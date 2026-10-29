import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const MODEL = "fal-ai/kling-video/v2.5-turbo/pro/image-to-video";
const NEGATIVE = "distorted face, blurry, cartoon, changed ethnicity";

function key() {
  const k = process.env["FAL_KEY"] ?? process.env["FAL_API_KEY"];
  if (!k) throw new Error("Video service is not set up yet (missing FAL_KEY).");
  return k;
}

export const startVideo = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    z.object({ imageUrl: z.string().min(10).max(15_000_000), scene: z.string().min(3).max(300) }).parse(d),
  )
  .handler(async ({ data }) => {
    const prompt = `Transform Filipino family photo into ${data.scene} Christmas scene, keep all faces 100% identical no distortion, warm parol lantern glow, snowfall, Noche Buena vibe, 6 second smooth motion, photorealistic`;
    const res = await fetch(`https://queue.fal.run/${MODEL}`, {
      method: "POST",
      headers: { Authorization: `Key ${key()}`, "Content-Type": "application/json" },
      body: JSON.stringify({ image_url: data.imageUrl, prompt, duration: "5", negative_prompt: NEGATIVE }),
    });
    if (!res.ok) {
      const t = await res.text();
      console.error("fal submit failed", res.status, t);
      throw new Error(`Video service error [${res.status}]`);
    }
    const j = (await res.json()) as { request_id: string };
    return { requestId: j.request_id };
  });

export const checkVideo = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ requestId: z.string().min(5).max(100) }).parse(d))
  .handler(async ({ data }) => {
    const base = `https://queue.fal.run/fal-ai/kling-video/requests/${data.requestId}`;
    const headers = { Authorization: `Key ${key()}` };
    const s = await fetch(`${base}/status`, { headers });
    if (!s.ok) throw new Error(`Status error [${s.status}]`);
    const st = (await s.json()) as { status: string };
    if (st.status !== "COMPLETED") return { status: st.status, videoUrl: null as string | null };
    const r = await fetch(base, { headers });
    if (!r.ok) throw new Error(`Result error [${r.status}]`);
    const out = (await r.json()) as { video?: { url: string } };
    return { status: "COMPLETED", videoUrl: out.video?.url ?? null };
  });

// Fetches the finished MP4 server-side and returns it as a data URL so the
// browser can save it with one click (cross-origin URLs ignore `download`).
export const downloadVideo = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ videoUrl: z.string().url().max(2000) }).parse(d))
  .handler(async ({ data }) => {
    const u = new URL(data.videoUrl);
    if (u.protocol !== "https:" || !(u.hostname === "fal.media" || u.hostname.endsWith(".fal.media"))) {
      throw new Error("Unexpected video URL");
    }
    const res = await fetch(data.videoUrl);
    if (!res.ok) throw new Error(`Download error [${res.status}]`);
    const buf = await res.arrayBuffer();
    if (buf.byteLength > 60 * 1024 * 1024) throw new Error("Video too large");
    return { dataUrl: `data:video/mp4;base64,${Buffer.from(buf).toString("base64")}` };
  });
