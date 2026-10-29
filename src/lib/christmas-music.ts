import { z } from "zod";
import { DURATION_OFFERS, type VideoDuration } from "@/lib/video-duration";
import pasko5 from "@/assets/pasko-sa-nayon-5sec.mp3.asset.json";
import pasko10 from "@/assets/pasko-sa-nayon-10sec.mp3.asset.json";
import hearts5 from "@/assets/christmas-in-our-hearts-5sec.mp3.asset.json";
import hearts10 from "@/assets/christmas-in-our-hearts-10sec.mp3.asset.json";
import sumapit5 from "@/assets/ang-pasko-ay-sumapit-5sec.mp3.asset.json";
import sumapit10 from "@/assets/ang-pasko-ay-sumapit-10sec.mp3.asset.json";
import jingle5 from "@/assets/jingle-bells-pinoy-5sec.mp3.asset.json";
import jingle10 from "@/assets/jingle-bells-pinoy-10sec.mp3.asset.json";

export const musicSchema = z.enum(["no-music", "pasko-sa-nayon", "christmas-in-our-hearts", "ang-pasko-ay-sumapit", "jingle-bells-pinoy"]);
export type MusicId = z.infer<typeof musicSchema>;
export const MUSIC_SURCHARGE = 0;
export const AUTOMATIC_MUSIC: MusicId = "pasko-sa-nayon";
export const DEFAULT_MUSIC_VOLUME = 70;
export const MUSIC_OPTIONS = [
  { id: "no-music", icon: "🔇", name: "No Music — Video Only", detail: "Original video · no extra charge", best: false },
  { id: "pasko-sa-nayon", icon: "🎵", name: "Pasko sa Nayon", detail: "Original village Christmas instrumental", best: true },
  { id: "christmas-in-our-hearts", icon: "🎵", name: "Christmas in our Hearts", detail: "Original warm festive instrumental", best: false },
  { id: "ang-pasko-ay-sumapit", icon: "🎵", name: "Ang Pasko ay Sumapit", detail: "Original bright Christmas instrumental", best: false },
  { id: "jingle-bells-pinoy", icon: "🎄", name: "Jingle Bells — Pinoy Remix", detail: "Original upbeat bell instrumental", best: false },
] as const;
export function musicOption(id: MusicId) { return MUSIC_OPTIONS.find((item) => item.id === id) ?? MUSIC_OPTIONS[0]; }
export function musicPath(id: MusicId, duration: VideoDuration) { return id === "no-music" ? null : `/music/${id}-${duration}sec.mp3`; }
export const MUSIC_ASSETS = { "pasko-sa-nayon": { 5: pasko5, 10: pasko10 }, "christmas-in-our-hearts": { 5: hearts5, 10: hearts10 }, "ang-pasko-ay-sumapit": { 5: sumapit5, 10: sumapit10 }, "jingle-bells-pinoy": { 5: jingle5, 10: jingle10 } };
export function musicAssetUrl(id: MusicId, duration: VideoDuration) { return id === "no-music" ? null : MUSIC_ASSETS[id][duration].url; }
export function musicCheckoutLabel(duration: VideoDuration, id: MusicId) { return `Upload & Pay ₱${christmasTotal(duration, id)} - ${duration} Sec ${duration === 10 ? "Premium Magic" : "Magic"}${id === "no-music" ? "" : " + Music 🎵"} →`; }
export function christmasTotal(duration: VideoDuration, _id: MusicId) { return DURATION_OFFERS[duration].price; }
export function christmasProfit(duration: VideoDuration, id: MusicId) { return Number((christmasTotal(duration, id) - DURATION_OFFERS[duration].falCost * 58 - 2 - (id === "no-music" ? 0 : 5)).toFixed(2)); }
export const CHRISTMAS_OVERLAY_TEXT = "Merry Christmas";
export function mergeAudioArgs(volume: number, loop: boolean, duration: VideoDuration, hasOriginalAudio = false, withOverlay = false) {
  const level = Math.max(0, Math.min(100, volume)) / 100;
  const audio = hasOriginalAudio ? `[1:a]volume=${level},apad[music];[0:a:0][music]amix=inputs=2:duration=first:normalize=0[audio]` : `[1:a]volume=${level},apad[audio]`;
  if (!withOverlay) return ["-i", "video.mp4", ...(loop ? ["-stream_loop", "-1"] : []), "-i", "music.mp3", "-filter_complex", audio, "-map", "0:v:0", "-map", "[audio]", "-c:v", "copy", "-c:a", "aac", "-t", String(duration), "-movflags", "+faststart", "output.mp4"];
  const video = "[0:v][2:v]overlay=(W-w)/2:H-h-48:alpha=premultiplied,format=yuv420p[v]";
  return ["-i", "video.mp4", ...(loop ? ["-stream_loop", "-1"] : []), "-i", "music.mp3", "-i", "overlay.png", "-filter_complex", `${video};${audio}`, "-map", "[v]", "-map", "[audio]", "-c:v", "libx264", "-preset", "veryfast", "-crf", "20", "-c:a", "aac", "-t", String(duration), "-movflags", "+faststart", "output.mp4"];
}
export async function loadMusicFile(path: string, signal?: AbortSignal) {
  const response = await fetch(path, { signal: signal ?? null });
  if (!response.ok || response.headers.get("content-type")?.includes("text/html")) throw new Error("Music could not load. Please try again.");
  const bytes = await response.arrayBuffer();
  if (bytes.byteLength < 100) throw new Error("Music file is empty.");
  const context = new AudioContext();
  try { await context.decodeAudioData(bytes.slice(0)); } finally { await context.close(); }
  return new Blob([bytes], { type: "audio/mpeg" });
}