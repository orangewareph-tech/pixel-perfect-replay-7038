import { describe, expect, it } from "vitest";
import { FREE_VIDEO_MODELS, freeVideoModelSchema, freeVideoDurationSchema, freeVideoPayload, normalizeVideoResult, safeVideoUrl } from "@/lib/free-ai";

describe("Free.ai video contract", () => {
  it("allows only the three requested non-premium model choices", () => {
    expect(FREE_VIDEO_MODELS).toEqual(["wan-2.2", "cogvideox", "hunyuan"]);
    for (const premium of ["kling", "pixverse", "seedance"]) expect(freeVideoModelSchema.safeParse(premium).success).toBe(false);
  });
  it("maps Wan to the provider-listed ID with a numeric duration", () => {
    expect(freeVideoPayload("https://media.free.ai/photo.png", "snow", 5, "wan-2.2")).toEqual({ image_url: "https://media.free.ai/photo.png", prompt: "snow", duration: 5, model: "wan22-ti2v-5b" });
  });
  it("maps Hunyuan to its provider-listed ID", () => { expect(freeVideoPayload("photo", "snow", 5, "hunyuan").model).toBe("hunyuan-video"); });
  it("accepts 2–6 seconds and rejects ten rather than silently shortening it", () => {
    expect(freeVideoDurationSchema.safeParse(2).success).toBe(true);
    expect(freeVideoDurationSchema.safeParse(6).success).toBe(true);
    expect(() => freeVideoPayload("photo", "snow", 10, "cogvideox")).toThrow("10-second credit has not been used");
  });
  it("normalizes queued jobs for existing UI polling", () => { expect(normalizeVideoResult({ job_id: "job-123", status: "queued" })).toEqual({ jobId: "job-123", status: "IN_QUEUE", videoUrl: null }); });
  it("reads a completed video URL", () => { expect(normalizeVideoResult({ video_url: "https://media.free.ai/video.mp4" }).status).toBe("COMPLETED"); });
  it("does not pretend unknown status is a render", () => { expect(() => normalizeVideoResult({ status: "unknown", job_id: "x" })).toThrow("unrecognized"); });
  it("rejects unsafe returned video destinations", () => {
    for (const url of ["http://media.free.ai/x", "https://127.0.0.1/x", "https://localhost/x", "https://user:pass@media.free.ai/x", "https://media.free.ai:8443/x"]) expect(() => safeVideoUrl(url)).toThrow();
  });
});