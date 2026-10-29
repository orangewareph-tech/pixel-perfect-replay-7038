import { CHRISTMAS_OVERLAY_TEXT, mergeAudioArgs } from "@/lib/christmas-music";
import type { VideoDuration } from "@/lib/video-duration";
import wasmAsset from "@/assets/ffmpeg-core.wasm.asset.json";

// The ffmpeg core has no fonts, so the greeting is drawn to a transparent PNG
// in the browser and overlaid with the overlay filter instead of drawtext.
async function renderOverlayPng(): Promise<Uint8Array> {
  const canvas = document.createElement("canvas");
  canvas.width = 1200;
  canvas.height = 220;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Christmas text could not be drawn. Try again or save the original video.");
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "italic 900 110px Georgia, 'Times New Roman', serif";
  const gradient = ctx.createLinearGradient(0, 40, 0, 190);
  gradient.addColorStop(0, "#fff8dc");
  gradient.addColorStop(0.5, "#ffd700");
  gradient.addColorStop(1, "#e8a000");
  ctx.lineWidth = 14;
  ctx.strokeStyle = "#7a0c0c";
  ctx.shadowColor = "rgba(0, 0, 0, 0.65)";
  ctx.shadowBlur = 18;
  ctx.shadowOffsetY = 6;
  const label = `🎄 ${CHRISTMAS_OVERLAY_TEXT} 🎄`;
  ctx.strokeText(label, canvas.width / 2, canvas.height / 2);
  ctx.fillStyle = gradient;
  ctx.fillText(label, canvas.width / 2, canvas.height / 2);
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
  if (!blob) throw new Error("Christmas text could not be drawn. Try again or save the original video.");
  return new Uint8Array(await blob.arrayBuffer());
}

// Only dynamically imported from a browser event. Single-thread core needs no
// cross-origin isolation headers and leaves OAuth/PWA behavior unchanged.
export async function embedMusic(video: Blob, music: Blob, volume: number, loop: boolean, duration: VideoDuration) {
  const { FFmpeg } = await import("@ffmpeg/ffmpeg");
  const ffmpeg = new FFmpeg();
  let hasAudio = false;
  ffmpeg.on("log", ({ message }) => { if (/Stream #0:\d.*Audio:/.test(message)) hasAudio = true; });
  try {
    await ffmpeg.load({ coreURL: new URL("/ffmpeg/ffmpeg-core.js", window.location.origin).href, wasmURL: new URL(wasmAsset.url, window.location.origin).href });
    await ffmpeg.writeFile("video.mp4", new Uint8Array(await video.arrayBuffer()));
    await ffmpeg.writeFile("music.mp3", new Uint8Array(await music.arrayBuffer()));
    await ffmpeg.writeFile("overlay.png", await renderOverlayPng());
    await ffmpeg.exec(["-i", "video.mp4", "-f", "null", "-t", "0", "-"], 30000);
    const result = await ffmpeg.exec(mergeAudioArgs(volume, loop, duration, hasAudio, true), 300000);
    if (result !== 0) throw new Error("Music could not be embedded. Try again or save the original video.");
    const file = await ffmpeg.readFile("output.mp4");
    if (typeof file === "string") throw new Error("Music output unavailable.");
    return new Blob([new Uint8Array(file)], { type: "video/mp4" });
  } finally { ffmpeg.terminate(); }
}
