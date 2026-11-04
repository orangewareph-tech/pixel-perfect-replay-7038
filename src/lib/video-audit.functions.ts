import { requireFreeDuration } from "./free-ai";
import { freeAiConfigured, freeAiConnectionCheck, uploadFreeAiImage, submitFreeAiVideo, pollFreeAiVideo } from "./free-ai.server";
import { createServerFn } from "@tanstack/react-start";
import { requireGoogleAuth } from "@/lib/google-auth.functions";
import { z } from "zod";
import { buildVideoInput, videoDurationSchema } from "@/lib/video-duration";
import { isAuditAdmin } from "@/lib/audit-permissions";
import { isOwnerTester } from "@/lib/owner-tests";
import { templateSchema } from "@/lib/template-ids";
import { movementSchema, DEFAULT_MOVEMENT } from "@/lib/video-movement";

export const ownerTestReport = createServerFn({ method: "GET" }).middleware([requireGoogleAuth]).handler(async ({ context }) => {
  await context.supabase.rpc("ensure_magicph_owner_role");
  const { data: role } = await context.supabase.from("user_roles").select("role").eq("user_id", context.userId).eq("role", "admin").maybeSingle();
  const owner = isOwnerTester(context.googleUser?.email, role);
  if (!owner) return { owner: false, runs: [], hour: 0, today: 0, spent: 0, totalSpent: 0, accountSpent: 0 };
  const { data: runs, error } = await context.supabase.from("fal_test_runs").select("*").eq("user_id", context.userId).order("started_at", { ascending: false });
  const now = Date.now(); const midnight = new Date(); midnight.setUTCHours(0, 0, 0, 0);
  const { data: payments, error: paymentError } = await context.supabase.from("video_payments").select("started_at,cost_usd").eq("user_id", context.userId).gte("started_at", midnight.toISOString());
  if (error || paymentError) throw new Error("Could not read owner test usage");
  const history = runs ?? []; const daily = history.filter((run) => Date.parse(run.started_at) >= midnight.getTime());
  const spent = daily.reduce((sum, run) => sum + Number(run.cost_usd), 0);
  return { owner, runs: history, hour: history.filter((run) => Date.parse(run.started_at) > now - 3_600_000).length + (payments ?? []).filter((p) => p.started_at && Date.parse(p.started_at) > now - 3_600_000).length, today: daily.length, spent, totalSpent: history.reduce((sum, run) => sum + Number(run.cost_usd), 0), accountSpent: spent + (payments ?? []).reduce((sum, p) => sum + p.cost_usd, 0) };
});

export const auditAccess = createServerFn({ method: "GET" }).middleware([requireGoogleAuth]).handler(async ({ context }) => {
  await context.supabase.rpc("ensure_magicph_owner_role");
  const { data, error } = await context.supabase.from("user_roles").select("role").eq("user_id", context.userId).eq("role", "admin").maybeSingle();
  return { admin: !error && isAuditAdmin(data) };
});

export const freeConnectionCheck = createServerFn({ method: "GET" }).middleware([requireGoogleAuth]).handler(async () => freeAiConnectionCheck());

export const scanVideoService = createServerFn({ method: "GET" }).middleware([requireGoogleAuth]).handler(async ({ context }) => {
  const { data: role } = await context.supabase.from("user_roles").select("role").eq("user_id", context.userId).eq("role", "admin").maybeSingle();
  if (!isAuditAdmin(role)) throw new Error("Administrator access required");
  const connection = await freeAiConnectionCheck();
  const runs = await context.supabase.from("fal_test_runs").select("*").order("started_at", { ascending: false }).limit(1).maybeSingle();
  return { keyFound: freeAiConfigured(), connected: connection.connected, balance: null as number | null, balanceNote: connection.detail + " Free-key API video access is not included; no live billing balance is available.", model: connection.connected, lastTest: runs.data, checkedAt: new Date().toISOString() };
});

export const testVideoGeneration = createServerFn({ method: "POST" }).middleware([requireGoogleAuth])
  .inputValidator((value) => z.object({ duration: videoDurationSchema, template: templateSchema.default("snow"), movement: movementSchema.default(DEFAULT_MOVEMENT), imageUrl: z.string().regex(/^data:image\/(jpeg|png);base64,/).max(15_000_000) }).parse(value))
  .handler(async ({ context, data }) => {
    await context.supabase.rpc("ensure_magicph_owner_role");
    const { data: role } = await context.supabase.from("user_roles").select("role").eq("user_id", context.userId).eq("role", "admin").maybeSingle();
    if (!isOwnerTester(context.googleUser?.email, role)) throw new Error("Owner administrator access required — customers must pay first");
    if (!freeAiConfigured()) throw new Error("FREE_AI_API_KEY missing");
    requireFreeDuration(data.duration);
    const imageUrl = await uploadFreeAiImage(data.imageUrl);
    const { data: run, error } = await context.supabase.from("fal_test_runs").insert({ user_id: context.userId, duration: data.duration, template: data.template }).select("id").single();
    if (error || !run) throw new Error(error?.message ?? "An active test already exists. Refresh its status first.");
    try {
      const { TEMPLATES } = await import("@/lib/site");
      const template = TEMPLATES.find((t) => t.id === data.template);
      if (!template) throw new Error("Invalid test template");
      const output = await submitFreeAiVideo(imageUrl, buildVideoInput(imageUrl, template.scene, data.duration, data.movement).prompt, data.duration);
      const requestId = `freeai:${output.jobId ?? run.id}`;
      const saved = await context.supabase.from("fal_test_runs").update({ request_id: requestId, status: output.status, video_url: output.videoUrl, finished_at: output.status === "COMPLETED" || output.status === "FAILED" ? new Date().toISOString() : null }).eq("id", run.id);
      if (saved.error) throw new Error("Video submitted but the test record could not be updated. Reconcile before retrying.");
      return { id: run.id, requestId };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Free.ai request failed";
      // Keep ambiguous submissions active: owner must reconcile before another run.
      await context.supabase.from("fal_test_runs").update({ error: `${message}; reconcile the reserved request before retrying` }).eq("id", run.id);
      throw new Error(message);
    }
  });

export const pollVideoTest = createServerFn({ method: "POST" }).middleware([requireGoogleAuth])
  .inputValidator((value) => z.object({ id: z.string().uuid() }).parse(value))
  .handler(async ({ context, data }) => {
    const { data: role } = await context.supabase.from("user_roles").select("role").eq("user_id", context.userId).eq("role", "admin").maybeSingle();
    if (!isAuditAdmin(role)) throw new Error("Administrator access required");
    const { data: run } = await context.supabase.from("fal_test_runs").select("*").eq("id", data.id).eq("user_id", context.userId).single();
    if (!run?.request_id) throw new Error("Test request not found; check provider history before retrying");
    if (run.status === "COMPLETED" || run.status === "FAILED") return run;
    if (!run.request_id.startsWith("freeai:")) throw new Error("Legacy provider test; administrator reconciliation required.");
    const output = await pollFreeAiVideo(run.request_id.slice(7));
    const { data: updated, error: saveError } = await context.supabase.from("fal_test_runs").update({ status: output.status, video_url: output.videoUrl, finished_at: output.status === "COMPLETED" || output.status === "FAILED" ? new Date().toISOString() : null }).eq("id", run.id).select("*").single();
    if (saveError || !updated) throw new Error("Could not save test status");
    return updated;
  });