import { freeVideoPayload, normalizeVideoResult, type FreeVideoModel } from "./free-ai";

const BASE = "https://api.free.ai";
export function freeAiConfigured() { return Boolean(process.env["FREE_AI_API_KEY"]); }
function headers() {
  const key = process.env["FREE_AI_API_KEY"];
  if (!key) throw new Error("Free.ai is not configured (missing FREE_AI_API_KEY).");
  return { Authorization: `Bearer ${key}` };
}
async function request(path: string, init: RequestInit = {}) {
  const response = await fetch(`${BASE}${path}`, { ...init, headers: { ...headers(), ...init.headers }, signal: AbortSignal.timeout(30000), redirect: "error" });
  if (!response.ok) {
    const body = (await response.text()).slice(0, 2000);
    console.error(`Free.ai request failed [${response.status}]: ${body}`);
    throw new Error(`Free.ai request failed [${response.status}]: ${body}`);
  }
  return response.json() as Promise<unknown>;
}
export async function freeAiConnectionCheck() {
  if (!freeAiConfigured()) return { connected: false, detail: "FREE_AI_API_KEY missing. No video submitted." };
  try { await request("/v1/models/"); return { connected: true, detail: "Free.ai model catalogue reachable. This does not verify upload or video entitlement; no generation submitted." }; }
  catch (error) { return { connected: false, detail: error instanceof Error ? error.message : "Free.ai connection could not be verified." }; }
}
export async function uploadFreeAiImage(imageBase64: string) {
  const match = /^data:image\/(jpeg|png|webp);base64,([A-Za-z0-9+/=]+)$/.exec(imageBase64);
  if (!match?.[1] || !match[2]) throw new Error("Upload a valid JPG, PNG or WebP photo.");
  const bytes = Uint8Array.from(atob(match[2]), (c) => c.charCodeAt(0));
  if (bytes.length === 0 || bytes.length > 10 * 1024 * 1024) throw new Error("Photo must be between 1 byte and 10MB.");
  const form = new FormData();
  form.append("file", new Blob([bytes], { type: `image/${match[1]}` }), `photo.${match[1]}`);
  const result = await request("/v1/upload/", { method: "POST", body: form });
  if (!result || typeof result !== "object" || !("url" in result) || typeof result.url !== "string" || !result.url.startsWith("https://")) throw new Error("Free.ai did not return an uploaded image URL.");
  return result.url;
}
export async function submitFreeAiVideo(imageUrl: string, prompt: string, duration: number, model: FreeVideoModel = "wan-2.2") {
  return normalizeVideoResult(await request("/v1/video/generate/", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(freeVideoPayload(imageUrl, prompt, duration, model)) }));
}
export async function pollFreeAiVideo(jobId: string) {
  const result = await request(`/v1/status/${encodeURIComponent(jobId)}/`);
  return normalizeVideoResult(result && typeof result === "object" ? { ...result, job_id: jobId } : result);
}