import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireGoogleAuth } from "@/lib/google-auth.functions";
import { isAdminEmail } from "@/lib/owner-tests";
import { buildVideoInput, VIDEO_BUDGET_RESERVATION, VIDEO_MODEL, videoDurationSchema } from "@/lib/video-duration";
import { movementSchema, DEFAULT_MOVEMENT } from "@/lib/video-movement";
import { templateSchema } from "@/lib/template-ids";
import { TEMPLATES } from "@/lib/site";
import { FREE_AI_MODEL_IDS, freeVideoModelSchema, requireFreeDuration } from "./free-ai";
import { freeAiConfigured, uploadFreeAiImage, submitFreeAiVideo, pollFreeAiVideo } from "./free-ai.server";

function adminEmail(user: { email?: string | null } | null | undefined) {
  if (!isAdminEmail(user?.email)) throw new Error("Access denied — Admin only");
}
export const adminDashboardStatus = createServerFn({ method: "GET" }).middleware([requireGoogleAuth]).handler(async ({ context }) => {
  const email = context.googleUser?.email ?? "";
  const admin = isAdminEmail(email);
  return { admin, email, videoKey: admin && freeAiConfigured(), model: VIDEO_MODEL };
});
export const adminStartTest = createServerFn({ method: "POST" }).middleware([requireGoogleAuth])
  .inputValidator((d) => z.object({ template: templateSchema, movement: movementSchema.default(DEFAULT_MOVEMENT), duration: videoDurationSchema, model: freeVideoModelSchema.default("wan-2.2"), imageUrl: z.string().regex(/^data:image\/(jpeg|png|webp);base64,/).max(15_000_000) }).parse(d))
  .handler(async ({ data, context }) => {
    adminEmail(context.googleUser);
    requireFreeDuration(data.duration);
    const template = TEMPLATES.find((t) => t.id === data.template);
    if (!template) throw new Error("Invalid template");
    const imageUrl = await uploadFreeAiImage(data.imageUrl);
    const reservation = await context.supabase.rpc("reserve_free_ai_admin_test", { p_model: FREE_AI_MODEL_IDS[data.model], p_duration: data.duration, p_template: data.template });
    if (reservation.error || !reservation.data) throw new Error(reservation.error?.message ?? "Could not reserve test");
    const run = reservation.data;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    try {
      const result = await submitFreeAiVideo(imageUrl, buildVideoInput(imageUrl, template.scene, data.duration, data.movement).prompt, data.duration, data.model);
      const saved = await supabaseAdmin.from("video_provider_jobs").update({ request_id: result.jobId, status: result.status, video_url: result.videoUrl, finished_at: result.status === "COMPLETED" || result.status === "FAILED" ? new Date().toISOString() : null }).eq("id", run.id).eq("user_id", context.userId);
      if (saved.error) throw new Error("Submitted; administrator reconciliation required. Do not retry.");
      return { requestId: run.id, cost: VIDEO_BUDGET_RESERVATION[data.duration] };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Free.ai submission failed";
      await supabaseAdmin.from("video_provider_jobs").update({ error: message.slice(0, 2000) }).eq("id", run.id).eq("user_id", context.userId);
      throw new Error(message);
    }
  });
export const adminCheckTest = createServerFn({ method: "POST" }).middleware([requireGoogleAuth])
  .inputValidator((d) => z.object({ requestId: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    adminEmail(context.googleUser);
    const { data: run } = await context.supabase.from("video_provider_jobs").select("*").eq("id", data.requestId).eq("user_id", context.userId).maybeSingle();
    if (!run) throw new Error("Your saved test was not found");
    if (run.status === "COMPLETED" || run.status === "FAILED") return { status: run.status, videoUrl: run.video_url };
    if (!run.request_id) throw new Error(run.error ?? "Submission needs reconciliation; do not resubmit.");
    const result = await pollFreeAiVideo(run.request_id);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const saved = await supabaseAdmin.from("video_provider_jobs").update({ status: result.status, video_url: result.videoUrl, finished_at: result.status === "COMPLETED" || result.status === "FAILED" ? new Date().toISOString() : null }).eq("id", run.id).eq("user_id", context.userId);
    if (saved.error) throw new Error("Could not save test status");
    return { status: result.status, videoUrl: result.videoUrl };
  });