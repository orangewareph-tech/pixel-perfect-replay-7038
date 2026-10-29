import { createServerFn } from "@tanstack/react-start";
import { requireGoogleAuth } from "@/lib/google-auth.functions";
import { z } from "zod";
import { paymentChoicesSchema } from "@/lib/payment-rules";

export const listMyPayments = createServerFn({ method: "GET" }).middleware([requireGoogleAuth]).handler(async ({ context }) => {
  const { data, error } = await context.supabase.from("video_payments").select("id,duration,music,template,amount,status,created_at,request_id,video_url,error,provider").eq("user_id", context.userId).order("created_at", { ascending: false }).limit(50);
  if (error) throw new Error("Could not load your payments");
  return { payments: data ?? [], email: typeof context.claims.email === "string" ? context.claims.email : "" };
});

export const submitReceipt = createServerFn({ method: "POST" }).middleware([requireGoogleAuth])
  .inputValidator((input) => paymentChoicesSchema.extend({ receipt: z.string().regex(/^data:image\/(jpeg|png);base64,/).max(2_800_000) }).parse(input))
  .handler(async ({ context, data }) => {
    const result = await context.supabase.rpc("create_video_payment", { p_duration: data.duration, p_music: data.music, p_template: data.template, p_provider: "manual", p_receipt: data.receipt });
    if (result.error) throw new Error(result.error.message);
    return { id: result.data.id };
  });

export const reviewPayment = createServerFn({ method: "POST" }).middleware([requireGoogleAuth])
  .inputValidator((input) => z.object({ id: z.string().uuid(), approve: z.boolean() }).parse(input))
  .handler(async ({ context, data }) => {
    const { data: role } = await context.supabase.from("user_roles").select("role").eq("user_id", context.userId).eq("role", "admin").maybeSingle();
    if (!role) throw new Error("Administrator access required");
    const result = await context.supabase.rpc("review_video_payment", { p_id: data.id, p_approve: data.approve });
    if (result.error) throw new Error(result.error.message);
    return { ok: true };
  });

export const adminPaymentReport = createServerFn({ method: "GET" }).middleware([requireGoogleAuth]).handler(async ({ context }) => {
  await context.supabase.rpc("ensure_magicph_owner_role");
  const { data: role } = await context.supabase.from("user_roles").select("role").eq("user_id", context.userId).eq("role", "admin").maybeSingle();
  if (!role) return { admin: false as const, payments: [], spending: 0, total: 0, dailyLimit: 10 };
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const today = new Date(); today.setUTCHours(0, 0, 0, 0);
  const [rows, spend, tests, count, settings] = await Promise.all([
    supabaseAdmin.from("video_payments").select("*").order("created_at", { ascending: false }).limit(100),
    supabaseAdmin.from("video_payments").select("cost_usd").gte("started_at", today.toISOString()),
    supabaseAdmin.from("fal_test_runs").select("duration").gte("started_at", today.toISOString()),
    supabaseAdmin.from("video_payments").select("id", { count: "exact", head: true }).not("started_at", "is", null),
    supabaseAdmin.from("video_launch_settings").select("daily_limit").eq("id", true).maybeSingle(),
  ]);
  if (rows.error || spend.error || tests.error || count.error || settings.error) throw new Error("Could not load administrator records");
  return { admin: true as const, payments: rows.data ?? [], spending: (spend.data ?? []).reduce((sum, row) => sum + row.cost_usd, 0) + (tests.data ?? []).reduce((sum, row) => sum + (row.duration === 5 ? 0.35 : 0.70), 0), total: count.count ?? 0, dailyLimit: settings.data?.daily_limit ?? 10 };
});

export const updateDailyLimit = createServerFn({ method: "POST" }).middleware([requireGoogleAuth]).inputValidator((input) => z.object({ limit: z.number().min(0.35).max(100) }).parse(input)).handler(async ({ context, data }) => {
  const { data: role } = await context.supabase.from("user_roles").select("role").eq("user_id", context.userId).eq("role", "admin").maybeSingle();
  if (!role) throw new Error("Administrator access required");
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const result = await supabaseAdmin.from("video_launch_settings").upsert({ id: true, daily_limit: data.limit });
  if (result.error) throw new Error("Could not update daily limit");
  return { ok: true };
});