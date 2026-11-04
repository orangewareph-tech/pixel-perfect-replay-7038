import { z } from "zod";

export const FREE_VIDEO_MODELS = ["wan-2.2", "cogvideox", "hunyuan"] as const;
export const freeVideoModelSchema = z.enum(FREE_VIDEO_MODELS);
export type FreeVideoModel = z.infer<typeof freeVideoModelSchema>;
export const FREE_AI_MODEL_IDS = { "wan-2.2": "wan22-ti2v-5b", cogvideox: "cogvideox", hunyuan: "hunyuan-video" } as const;
export const freeVideoDurationSchema = z.number().int().min(2).max(6);
export function requireFreeDuration(duration: number) {
  if (!freeVideoDurationSchema.safeParse(duration).success) throw new Error("Free.ai supports only 2–6 seconds in this integration. Your 10-second credit has not been used.");
  return duration;
}
export function freeVideoPayload(imageUrl: string, prompt: string, duration: number, model: FreeVideoModel) {
  return { image_url: imageUrl, prompt, duration: requireFreeDuration(duration), model: FREE_AI_MODEL_IDS[freeVideoModelSchema.parse(model)] };
}
export function safeVideoUrl(value: string) {
  const url = new URL(value);
  if (url.protocol !== "https:" || url.username || url.password || url.port || !url.hostname.includes(".") || /(^|\.)(localhost|local|internal|test|invalid)$/.test(url.hostname) || /^\d/.test(url.hostname) || url.hostname.includes(":")) throw new Error("Unexpected provider video URL");
  return url.href;
}
export function normalizeVideoResult(value: unknown) {
  const response = z.object({ job_id: z.union([z.string(), z.number()]).optional(), status: z.string().optional(), video_url: z.string().optional(), error: z.unknown().optional(), result: z.object({ video_url: z.string().optional() }).optional() }).parse(value);
  if (response.error) throw new Error(`Free.ai reported a generation error: ${JSON.stringify(response.error)}`);
  const rawUrl = response.video_url ?? response.result?.video_url;
  const videoUrl = rawUrl ? safeVideoUrl(rawUrl) : null;
  const rawStatus = response.status?.toLowerCase();
  const status = videoUrl ? "COMPLETED" : ["failed", "error", "canceled", "cancelled"].includes(rawStatus ?? "") ? "FAILED" : ["processing", "running", "in_progress"].includes(rawStatus ?? "") ? "IN_PROGRESS" : ["queued", "pending", "in_queue"].includes(rawStatus ?? "") ? "IN_QUEUE" : null;
  if (!status) throw new Error("Free.ai returned an unrecognized job response; administrator reconciliation required.");
  const jobId = response.job_id === undefined ? null : String(response.job_id);
  if (!videoUrl && (!jobId || jobId.length > 100)) throw new Error("Free.ai returned no usable job ID; do not resubmit.");
  return { status, videoUrl, jobId };
}