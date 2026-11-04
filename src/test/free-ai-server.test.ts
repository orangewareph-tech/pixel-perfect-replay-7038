import { afterEach, describe, expect, it, vi } from "vitest";
import { uploadFreeAiImage, submitFreeAiVideo, pollFreeAiVideo } from "@/lib/free-ai.server";

afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); vi.restoreAllMocks(); });
describe("Free.ai server transport with dummy image", () => {
  it("uploads multipart, submits JSON, and polls the documented status endpoint", async () => {
    vi.stubEnv("FREE_AI_API_KEY", "dummy-test-only");
    const calls: { url: string; init?: RequestInit }[] = [];
    vi.stubGlobal("fetch", vi.fn(async (url: string, init?: RequestInit) => {
      calls.push(init ? { url, init } : { url });
      return Response.json(url.includes("upload") ? { url: "https://media.free.ai/photo.png" } : url.includes("generate") ? { job_id: "job-123", status: "queued" } : { status: "completed", video_url: "https://media.free.ai/video.mp4" });
    }));
    const image = await uploadFreeAiImage("data:image/png;base64,iVBORw0KGgo=");
    expect(calls[0]?.init?.body).toBeInstanceOf(FormData);
    const job = await submitFreeAiVideo(image, "Christmas snow", 5, "wan-2.2");
    expect(job.jobId).toBe("job-123");
    expect(JSON.parse(String(calls[1]?.init?.body))).toEqual({ image_url: image, prompt: "Christmas snow", duration: 5, model: "wan22-ti2v-5b" });
    expect((await pollFreeAiVideo("job-123")).videoUrl).toBe("https://media.free.ai/video.mp4");
    expect(calls[2]?.url).toBe("https://api.free.ai/v1/status/job-123/");
  });
  it("preserves provider denial instead of pretending generation succeeded", async () => {
    vi.stubEnv("FREE_AI_API_KEY", "dummy-test-only");
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.stubGlobal("fetch", vi.fn(async () => Response.json({ error: { code: "cap_hit", reason: "not_in_tier" } }, { status: 429 })));
    await expect(submitFreeAiVideo("https://media.free.ai/photo.png", "snow", 5)).rejects.toThrow("429");
  });
});