import { mergeAudioArgs } from "@/lib/christmas-music";
import type { VideoDuration } from "@/lib/video-duration";

// Only dynamically imported from a browser event. Single-thread core needs no
// cross-origin isolation headers and leaves OAuth/PWA behavior unchanged.
export async function embedMusic(video: Blob, music: Blob, volume: number, loop: boolean, duration: VideoDuration) {
  const { FFmpeg } = await import("@ffmpeg/ffmpeg");
  const ffmpeg = new FFmpeg();
  let hasAudio = false;
  ffmpeg.on("log", ({ message }) => { if (/Stream #0:\d.*Audio:/.test(message)) hasAudio = true; });
  try {
    await ffmpeg.load({ coreURL: new URL("/ffmpeg/ffmpeg-core.js", window.location.origin).href, wasmURL: new URL("/ffmpeg/ffmpeg-core.wasm", window.location.origin).href });
    await ffmpeg.writeFile("video.mp4", new Uint8Array(await video.arrayBuffer()));
    await ffmpeg.writeFile("music.mp3", new Uint8Array(await music.arrayBuffer()));
    await ffmpeg.exec(["-i", "video.mp4", "-f", "null", "-t", "0", "-"], 30000);
    const result = await ffmpeg.exec(mergeAudioArgs(volume, loop, duration, hasAudio), 120000);
    if (result !== 0) throw new Error("Music could not be embedded. Try again or save the original video.");
    const file = await ffmpeg.readFile("output.mp4");
    if (typeof file === "string") throw new Error("Music output unavailable.");
    return new Blob([new Uint8Array(file)], { type: "video/mp4" });
  } finally { ffmpeg.terminate(); }
}