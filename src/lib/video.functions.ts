import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { buildVideoInput, videoDurationSchema } from "@/lib/video-duration";
import { requireGoogleAuth } from "@/lib/google-auth.functions";
import { TEMPLATES } from "@/lib/site";
import { movementSchema, DEFAULT_MOVEMENT } from "@/lib/video-movement";

import { requireFreeDuration, safeVideoUrl } from "./free-ai";
import { uploadFreeAiImage, submitFreeAiVideo, pollFreeAiVideo, freeAiConfigured } from "./free-ai.server";

export const startVideo = createServerFn({ method: "POST" })
  .middleware([requireGoogleAuth])
  .inputValidator((d) =>
    z.object({ paymentId: z.string().uuid(), movement: movementSchema.default(DEFAULT_MOVEMENT), imageUrl: z.string().regex(/^data:image\/(jpeg|png);base64,/).max(15_000_000) }).parse(d),
  )
  .handler(async ({ data, context }) => {
    if (!freeAiConfigured()) throw new Error("FREE_AI_API_KEY missing");
    const { data: pending } = await context.supabase.from("video_payments").select("duration,status").eq("id", data.paymentId).eq("user_id", context.userId).maybeSingle();
    if (!pending || pending.status !== "approved") throw new Error("An approved unused payment is required");
    requireFreeDuration(pending.duration);
    // Upload is preflight: a rejected upload must not consume a payment credit.
    const imageUrl = await uploadFreeAiImage(data.imageUrl);
    const claimed = await context.supabase.rpc("claim_video_payment", { p_id: data.paymentId });
    if (claimed.error || !claimed.data) throw new Error(claimed.error?.message ?? "Please pay first");
    const order = claimed.data;
    const duration = videoDurationSchema.parse(order.duration);
    const template = TEMPLATES.find((item) => item.id === order.template);
    if (!template) throw new Error("Invalid payment template");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    // Reserve before generation; keep ambiguous failures for reconciliation.
    try {
      const output = await submitFreeAiVideo(imageUrl, buildVideoInput(imageUrl, template.scene, duration, data.movement).prompt, duration);
      const requestId = `freeai:${output.jobId ?? order.id}`;
      const saved = await supabaseAdmin.from("video_payments").update({ request_id: requestId, status: output.status, video_url: output.videoUrl, finished_at: output.status === "COMPLETED" || output.status === "FAILED" ? new Date().toISOString() : null }).eq("id", order.id).eq("user_id", context.userId);
      if (saved.error) throw new Error("Submitted; payment record needs administrator reconciliation. Do not retry.");
      return { requestId };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Free.ai submission failed";
      await supabaseAdmin.from("video_payments").update({ error: `${message.slice(0, 400)}; administrator reconciliation required` }).eq("id", order.id).eq("user_id", context.userId);
      throw new Error(message);
    }
  });

export const checkVideo = createServerFn({ method: "POST" })
  .middleware([requireGoogleAuth])
  .inputValidator((d) => z.object({ requestId: z.string().min(5).max(100) }).parse(d))
  .handler(async ({ data, context }) => {
    const { data: order } = await context.supabase.from("video_payments").select("id,status,video_url").eq("user_id", context.userId).eq("request_id", data.requestId).maybeSingle();
    if (!order) throw new Error("Your video request was not found");
    if (order.status === "COMPLETED") return { status: order.status, videoUrl: order.video_url };
    if (order.status === "FAILED") return { status: "FAILED", videoUrl: null as string | null };
    if (!data.requestId.startsWith("freeai:")) throw new Error("Legacy provider job: ask the administrator to reconcile it. No old-provider request was sent.");
    const output = await pollFreeAiVideo(data.requestId.slice(7));
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const saved = await supabaseAdmin.from("video_payments").update({ status: output.status, video_url: output.videoUrl, finished_at: output.status === "COMPLETED" || output.status === "FAILED" ? new Date().toISOString() : null }).eq("id", order.id).eq("user_id", context.userId);
    if (saved.error) throw new Error("Could not save video status; refresh to retry");
    return { status: output.status, videoUrl: output.videoUrl };
  });

// Small ranged chunks avoid RPC output limits for longer MP4s; the browser
// assembles a local Blob for one-click saving of cross-origin videos.
export const downloadVideo = createServerFn({ method: "POST" })
  .middleware([requireGoogleAuth])
  .inputValidator((d) => z.object({ videoUrl: z.string().url().max(2000), offset: z.number().int().min(0).max(60 * 1024 * 1024).default(0) }).parse(d))
  .handler(async ({ data, context }) => {
    const { data: order } = await context.supabase.from("video_payments").select("id").eq("user_id", context.userId).eq("video_url", data.videoUrl).eq("status", "COMPLETED").maybeSingle();
    const { data: test } = order ? { data: null } : await context.supabase.from("fal_test_runs").select("id").eq("user_id", context.userId).eq("video_url", data.videoUrl).eq("status", "COMPLETED").maybeSingle();
    const { data: adminTest } = order || test ? { data: null } : await context.supabase.from("video_provider_jobs").select("id").eq("user_id", context.userId).eq("video_url", data.videoUrl).eq("status", "COMPLETED").maybeSingle();
    if (!order && !test && !adminTest) throw new Error("Your completed video was not found");
    safeVideoUrl(data.videoUrl);
    const chunkSize = 3 * 1024 * 1024;
    const res = await fetch(data.videoUrl, { redirect: "error", signal: AbortSignal.timeout(30000), headers: { Range: `bytes=${data.offset}-${data.offset + chunkSize - 1}` } });
    if (!res.ok) throw new Error(`Download error [${res.status}]`);
    const total = res.status === 206 ? Number(res.headers.get("content-range")?.split("/")[1]) : Number(res.headers.get("content-length"));
    if (!Number.isFinite(total) || total <= 0 || total > 60 * 1024 * 1024) throw new Error("Video too large or missing file size");
    const buf = await res.arrayBuffer();
    const chunk = res.status === 206 ? buf : buf.slice(data.offset, data.offset + chunkSize);
    if (chunk.byteLength === 0 || chunk.byteLength > chunkSize) throw new Error("Invalid video download chunk");
    return { base64: Buffer.from(chunk).toString("base64"), nextOffset: data.offset + chunk.byteLength, total };
  });
