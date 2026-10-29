import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { buildVideoInput, VIDEO_MODEL, videoDurationSchema } from "@/lib/video-duration";
import { requireGoogleAuth } from "@/lib/google-auth.functions";
import { TEMPLATES } from "@/lib/site";

function key() {
  const k = process.env["FAL_KEY"] ?? process.env["FAL_API_KEY"];
  if (!k) throw new Error("Video service is not set up yet (missing FAL_KEY).");
  return k;
}

export const startVideo = createServerFn({ method: "POST" })
  .middleware([requireGoogleAuth])
  .inputValidator((d) =>
    z.object({ paymentId: z.string().uuid(), imageUrl: z.string().regex(/^data:image\/(jpeg|png);base64,/).max(15_000_000) }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const apiKey = key();
    const claimed = await context.supabase.rpc("claim_video_payment", { p_id: data.paymentId });
    if (claimed.error || !claimed.data) throw new Error(claimed.error?.message ?? "Please pay first");
    const order = claimed.data;
    const duration = videoDurationSchema.parse(order.duration);
    const template = TEMPLATES.find((item) => item.id === order.template);
    if (!template) throw new Error("Invalid payment template");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    // A credit is reserved before contacting Fal. Ambiguous failures stay reserved
    // for administrator reconciliation; retries must never create another charge.
    const res = await fetch(`https://queue.fal.run/${VIDEO_MODEL}`, {
      method: "POST",
      headers: { Authorization: `Key ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify(buildVideoInput(data.imageUrl, template.scene, duration)),
      signal: AbortSignal.timeout(30000),
    });
    if (!res.ok) {
      await supabaseAdmin.from("video_payments").update({ status: "FAILED", error: `Submission error ${res.status}; administrator review required`, finished_at: new Date().toISOString() }).eq("id", order.id).eq("user_id", context.userId);
      throw new Error("Video submission failed. Your payment is saved; contact the administrator before retrying.");
    }
    const j = z.object({ request_id: z.string().min(5).max(100) }).parse(await res.json());
    const saved = await supabaseAdmin.from("video_payments").update({ request_id: j.request_id, status: "IN_QUEUE" }).eq("id", order.id).eq("user_id", context.userId);
    if (saved.error) throw new Error("Submitted; payment record needs administrator reconciliation. Do not retry.");
    return { requestId: j.request_id };
  });

export const checkVideo = createServerFn({ method: "POST" })
  .middleware([requireGoogleAuth])
  .inputValidator((d) => z.object({ requestId: z.string().min(5).max(100) }).parse(d))
  .handler(async ({ data, context }) => {
    const { data: order } = await context.supabase.from("video_payments").select("id,status,video_url").eq("user_id", context.userId).eq("request_id", data.requestId).maybeSingle();
    if (!order) throw new Error("Your video request was not found");
    if (order.status === "COMPLETED") return { status: order.status, videoUrl: order.video_url };
    const base = `https://queue.fal.run/fal-ai/kling-video/requests/${encodeURIComponent(data.requestId)}`;
    const headers = { Authorization: `Key ${key()}` };
    const s = await fetch(`${base}/status`, { headers });
    if (!s.ok) throw new Error(`Status error [${s.status}]`);
    const st = (await s.json()) as { status: string };
    if (st.status !== "COMPLETED") return { status: st.status, videoUrl: null as string | null };
    const r = await fetch(base, { headers });
    if (!r.ok) throw new Error(`Result error [${r.status}]`);
    const out = (await r.json()) as { video?: { url: string } };
    const videoUrl = out.video?.url;
    if (!videoUrl || !/^https:\/\/([a-zA-Z0-9-]+\.)*fal\.media\//.test(videoUrl)) throw new Error("Video result unavailable; contact the administrator");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const saved = await supabaseAdmin.from("video_payments").update({ status: "COMPLETED", video_url: videoUrl, finished_at: new Date().toISOString() }).eq("id", order.id).eq("user_id", context.userId);
    if (saved.error) throw new Error("Could not save video status; refresh to retry");
    return { status: "COMPLETED", videoUrl };
  });

// Small ranged chunks avoid RPC output limits for longer MP4s; the browser
// assembles a local Blob for one-click saving of cross-origin videos.
export const downloadVideo = createServerFn({ method: "POST" })
  .middleware([requireGoogleAuth])
  .inputValidator((d) => z.object({ videoUrl: z.string().url().max(2000), offset: z.number().int().min(0).max(60 * 1024 * 1024).default(0) }).parse(d))
  .handler(async ({ data, context }) => {
    const { data: order } = await context.supabase.from("video_payments").select("id").eq("user_id", context.userId).eq("video_url", data.videoUrl).eq("status", "COMPLETED").maybeSingle();
    const { data: test } = order ? { data: null } : await context.supabase.from("fal_test_runs").select("id").eq("user_id", context.userId).eq("video_url", data.videoUrl).eq("status", "COMPLETED").maybeSingle();
    if (!order && !test) throw new Error("Your completed video was not found");
    const u = new URL(data.videoUrl);
    if (u.protocol !== "https:" || !(u.hostname === "fal.media" || u.hostname.endsWith(".fal.media"))) {
      throw new Error("Unexpected video URL");
    }
    const chunkSize = 3 * 1024 * 1024;
    const res = await fetch(data.videoUrl, { headers: { Range: `bytes=${data.offset}-${data.offset + chunkSize - 1}` } });
    if (!res.ok) throw new Error(`Download error [${res.status}]`);
    const total = res.status === 206 ? Number(res.headers.get("content-range")?.split("/")[1]) : Number(res.headers.get("content-length"));
    if (!Number.isFinite(total) || total <= 0 || total > 60 * 1024 * 1024) throw new Error("Video too large or missing file size");
    const buf = await res.arrayBuffer();
    const chunk = res.status === 206 ? buf : buf.slice(data.offset, data.offset + chunkSize);
    if (chunk.byteLength === 0 || chunk.byteLength > chunkSize) throw new Error("Invalid video download chunk");
    return { base64: Buffer.from(chunk).toString("base64"), nextOffset: data.offset + chunk.byteLength, total };
  });
