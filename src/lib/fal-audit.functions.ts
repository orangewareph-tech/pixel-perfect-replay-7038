import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";
import { buildVideoInput, VIDEO_MODEL, videoDurationSchema } from "@/lib/video-duration";

export const auditAccess = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(async ({ context }) => {
  const { data, error } = await context.supabase.from("user_roles").select("role").eq("user_id", context.userId).eq("role", "admin").maybeSingle();
  return { admin: !error && data?.role === "admin" };
});

const requestError = (status: number) => status === 401 ? "FAL_KEY invalid" : status === 403 ? "Access denied: key permissions or balance" : status === 402 ? "Insufficient balance" : status === 404 ? "Model not found" : status === 429 ? "Fal.ai rate limit — try later" : `Fal.ai request failed (HTTP ${status})`;

export const scanFalAi = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(async ({ context }) => {
  const { data: role } = await context.supabase.from("user_roles").select("role").eq("user_id", context.userId).eq("role", "admin").maybeSingle();
  if (!role) throw new Error("Administrator access required");
  const key = process.env["FAL_KEY"] ?? process.env["FAL_API_KEY"];
  if (!key) return { keyFound: false, connected: false, balance: null as number | null, balanceNote: "FAL_KEY missing - add to Secrets", model: false, lastTest: null, checkedAt: new Date().toISOString() };
  const headers = { Authorization: `Key ${key}` };
  const [history, billing, runs] = await Promise.all([
    fetch(`https://api.fal.ai/v1/models/requests/by-endpoint?endpoint_id=${encodeURIComponent(VIDEO_MODEL)}&limit=1`, { headers, signal: AbortSignal.timeout(20000) }).catch(() => null),
    fetch("https://api.fal.ai/v1/account/billing?expand=credits", { headers, signal: AbortSignal.timeout(20000) }).catch(() => null),
    context.supabase.from("fal_test_runs").select("*").order("started_at", { ascending: false }).limit(1).maybeSingle(),
  ]);
  let balance: number | null = null;
  if (billing?.ok) {
    const output = await billing.json() as { credits?: { current_balance?: number; currency?: string } };
    if (output.credits?.currency === "USD" && typeof output.credits.current_balance === "number") balance = output.credits.current_balance;
  }
  return { keyFound: true, connected: history?.ok ?? false, balance, balanceNote: balance === null ? `Balance unavailable${billing ? ` (HTTP ${billing.status})` : ""}; check Fal.ai dashboard or a key with billing:usage:read permission.` : "Live Fal.ai credits", model: history?.ok ?? false, lastTest: runs.data, checkedAt: new Date().toISOString() };
});

export const testFalAiGeneration = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth])
  .inputValidator((value) => z.object({ duration: videoDurationSchema, imageUrl: z.string().startsWith("data:image/").max(15_000_000) }).parse(value))
  .handler(async ({ context, data }) => {
    const { data: role } = await context.supabase.from("user_roles").select("role").eq("user_id", context.userId).eq("role", "admin").maybeSingle();
    if (!role) throw new Error("Administrator access required");
    const key = process.env["FAL_KEY"] ?? process.env["FAL_API_KEY"];
    if (!key) throw new Error("FAL_KEY missing - add to Secrets");
    const { data: run, error } = await context.supabase.from("fal_test_runs").insert({ user_id: context.userId, duration: data.duration }).select("id").single();
    if (error || !run) throw new Error("An active test already exists, or test storage is unavailable. Refresh its status first.");
    try {
      const result = await fetch(`https://queue.fal.run/${VIDEO_MODEL}`, { method: "POST", headers: { Authorization: `Key ${key}`, "Content-Type": "application/json" }, body: JSON.stringify(buildVideoInput(data.imageUrl, "Snowfall Magic", data.duration)), signal: AbortSignal.timeout(30000) });
      if (!result.ok) throw new Error(requestError(result.status));
      const output = await result.json() as { request_id: string };
      const saved = await context.supabase.from("fal_test_runs").update({ request_id: output.request_id, status: "IN_QUEUE" }).eq("id", run.id);
      if (saved.error) throw new Error("Video submitted but the test record could not be updated. Check Fal.ai history before retrying.");
      return { id: run.id, requestId: output.request_id };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Fal.ai request failed";
      await context.supabase.from("fal_test_runs").update({ status: "FAILED", error: message, finished_at: new Date().toISOString() }).eq("id", run.id);
      throw new Error(message);
    }
  });

export const pollFalTest = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth])
  .inputValidator((value) => z.object({ id: z.string().uuid() }).parse(value))
  .handler(async ({ context, data }) => {
    const { data: role } = await context.supabase.from("user_roles").select("role").eq("user_id", context.userId).eq("role", "admin").maybeSingle();
    if (!role) throw new Error("Administrator access required");
    const { data: run } = await context.supabase.from("fal_test_runs").select("*").eq("id", data.id).single();
    if (!run?.request_id) throw new Error("Test request not found");
    if (run.status === "COMPLETED" || run.status === "FAILED") return run;
    const key = process.env["FAL_KEY"] ?? process.env["FAL_API_KEY"];
    if (!key) throw new Error("FAL_KEY missing - add to Secrets");
    const headers = { Authorization: `Key ${key}` };
    const base = `https://queue.fal.run/fal-ai/kling-video/requests/${encodeURIComponent(run.request_id)}`;
    const result = await fetch(`${base}/status`, { headers, signal: AbortSignal.timeout(20000) });
    if (!result.ok) throw new Error(requestError(result.status));
    const output = await result.json() as { status: string };
    let videoUrl: string | null = null;
    let error: string | null = null;
    if (output.status === "COMPLETED") {
      const response = await fetch(base, { headers, signal: AbortSignal.timeout(20000) });
      if (response.ok) { const video = await response.json() as { video?: { url: string } }; videoUrl = video.video?.url ?? null; }
      if (!videoUrl) error = "Generation completed without a video result";
    }
    const status = error ? "FAILED" : output.status;
    const { data: updated, error: saveError } = await context.supabase.from("fal_test_runs").update({ status, video_url: videoUrl, error, finished_at: status === "COMPLETED" || status === "FAILED" ? new Date().toISOString() : null }).eq("id", run.id).select("*").single();
    if (saveError || !updated) throw new Error("Could not save test status");
    return updated;
  });