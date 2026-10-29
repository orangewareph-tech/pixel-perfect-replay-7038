import { createServerFn } from "@tanstack/react-start";
import { requireGoogleAuth } from "@/lib/google-auth.functions";
import { z } from "zod";
import { buildVideoInput, VIDEO_MODEL, videoDurationSchema } from "@/lib/video-duration";
import { isAuditAdmin } from "@/lib/audit-permissions";
import { isOwnerTester } from "@/lib/owner-tests";

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

const requestError = (status: number) => status === 401 ? "FAL_KEY invalid" : status === 403 ? "Access denied: key permissions or balance" : status === 402 ? "Insufficient balance" : status === 404 ? "Model not found" : status === 429 ? "Fal.ai rate limit — try later" : `Fal.ai request failed (HTTP ${status})`;

export const freeConnectionCheck = createServerFn({ method: "GET" }).middleware([requireGoogleAuth]).handler(async () => {
  const key = process.env["FAL_KEY"] ?? process.env["FAL_API_KEY"];
  if (!key) return { connected: false, detail: "Video service configuration unavailable; no video submitted." };
  const response = await fetch(`https://api.fal.ai/v1/models/requests/by-endpoint?endpoint_id=${encodeURIComponent(VIDEO_MODEL)}&limit=1`, { headers: { Authorization: `Key ${key}` }, signal: AbortSignal.timeout(15000) }).catch(() => null);
  return { connected: response?.ok ?? false, detail: response?.ok ? "Google sign-in verified and video-service connection reachable. No generation charge." : "Google sign-in verified; video-service connection not verified. No video submitted." };
});

export const scanFalAi = createServerFn({ method: "GET" }).middleware([requireGoogleAuth]).handler(async ({ context }) => {
  const { data: role } = await context.supabase.from("user_roles").select("role").eq("user_id", context.userId).eq("role", "admin").maybeSingle();
  if (!isAuditAdmin(role)) throw new Error("Administrator access required");
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

export const testFalAiGeneration = createServerFn({ method: "POST" }).middleware([requireGoogleAuth])
  .inputValidator((value) => z.object({ duration: videoDurationSchema, template: z.enum(["parol", "snow", "bokeh", "globe", "fire"]).default("snow"), imageUrl: z.string().regex(/^data:image\/(jpeg|png);base64,/).max(15_000_000) }).parse(value))
  .handler(async ({ context, data }) => {
    await context.supabase.rpc("ensure_magicph_owner_role");
    const { data: role } = await context.supabase.from("user_roles").select("role").eq("user_id", context.userId).eq("role", "admin").maybeSingle();
    if (!isOwnerTester(context.googleUser?.email, role)) throw new Error("Owner administrator access required — customers must pay first");
    const key = process.env["FAL_KEY"] ?? process.env["FAL_API_KEY"];
    if (!key) throw new Error("FAL_KEY missing - add to Secrets");
    const { data: run, error } = await context.supabase.from("fal_test_runs").insert({ user_id: context.userId, duration: data.duration, template: data.template }).select("id").single();
    if (error || !run) throw new Error(error?.message ?? "An active test already exists. Refresh its status first.");
    try {
      const { TEMPLATES } = await import("@/lib/site");
      const template = TEMPLATES.find((t) => t.id === data.template);
      if (!template) throw new Error("Invalid test template");
      const result = await fetch(`https://queue.fal.run/${VIDEO_MODEL}`, { method: "POST", headers: { Authorization: `Key ${key}`, "Content-Type": "application/json" }, body: JSON.stringify(buildVideoInput(data.imageUrl, template.scene, data.duration)), signal: AbortSignal.timeout(30000) });
      if (!result.ok) throw new Error(requestError(result.status));
      const output = z.object({ request_id: z.string().min(5).max(100) }).parse(await result.json());
      const saved = await context.supabase.from("fal_test_runs").update({ request_id: output.request_id, status: "IN_QUEUE" }).eq("id", run.id);
      if (saved.error) throw new Error("Video submitted but the test record could not be updated. Check Fal.ai history before retrying.");
      return { id: run.id, requestId: output.request_id };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Fal.ai request failed";
      // Keep ambiguous submissions active: owner must reconcile before another run.
      await context.supabase.from("fal_test_runs").update({ error: `${message}; reconcile the reserved request before retrying` }).eq("id", run.id);
      throw new Error(message);
    }
  });

export const pollFalTest = createServerFn({ method: "POST" }).middleware([requireGoogleAuth])
  .inputValidator((value) => z.object({ id: z.string().uuid() }).parse(value))
  .handler(async ({ context, data }) => {
    const { data: role } = await context.supabase.from("user_roles").select("role").eq("user_id", context.userId).eq("role", "admin").maybeSingle();
    if (!isAuditAdmin(role)) throw new Error("Administrator access required");
    const { data: run } = await context.supabase.from("fal_test_runs").select("*").eq("id", data.id).eq("user_id", context.userId).single();
    if (!run?.request_id) throw new Error("Test request not found; check provider history before retrying");
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
      if (!videoUrl || !/^https:\/\/([a-zA-Z0-9-]+\.)*fal\.media\//.test(videoUrl)) { videoUrl = null; error = "Generation completed without a valid video result"; }
    }
    const status = error ? "FAILED" : output.status;
    const { data: updated, error: saveError } = await context.supabase.from("fal_test_runs").update({ status, video_url: videoUrl, error, finished_at: status === "COMPLETED" || status === "FAILED" ? new Date().toISOString() : null }).eq("id", run.id).select("*").single();
    if (saveError || !updated) throw new Error("Could not save test status");
    return updated;
  });