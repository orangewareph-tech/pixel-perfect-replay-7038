import { z } from "zod";
import { DURATION_OFFERS, type VideoDuration } from "@/lib/video-duration";

export const musicSchema = z.enum(["no-music", "pasko-sa-nayon", "christmas-in-our-hearts", "ang-pasko-ay-sumapit", "jingle-bells-pinoy"]);
export type MusicId = z.infer<typeof musicSchema>;
export const MUSIC_SURCHARGE = 20;
export const DEFAULT_MUSIC_VOLUME = 70;
export const MUSIC_OPTIONS = [
  { id: "no-music", icon: "🔇", name: "No Music — Video Only", detail: "Original video · no extra charge", best: false },
  { id: "pasko-sa-nayon", icon: "🎵", name: "Pasko sa Nayon", detail: "Pinoy Christmas · instrumental", best: true },
  { id: "christmas-in-our-hearts", icon: "🎵", name: "Christmas in our Hearts", detail: "Jose Mari Chan", best: false },
  { id: "ang-pasko-ay-sumapit", icon: "🎵", name: "Ang Pasko ay Sumapit", detail: "Traditional Christmas", best: false },
  { id: "jingle-bells-pinoy", icon: "🎄", name: "Jingle Bells — Pinoy Remix", detail: "Upbeat Christmas", best: false },
] as const;
export function musicOption(id: MusicId) { return MUSIC_OPTIONS.find((item) => item.id === id) ?? MUSIC_OPTIONS[0]; }
export function musicPath(id: MusicId, duration: VideoDuration) { return id === "no-music" ? null : `/music/${id}-${duration}sec.mp3`; }
export function christmasTotal(duration: VideoDuration, id: MusicId) { return DURATION_OFFERS[duration].price + (id === "no-music" ? 0 : MUSIC_SURCHARGE); }
export function christmasProfit(duration: VideoDuration, id: MusicId) { return Number((christmasTotal(duration, id) - DURATION_OFFERS[duration].falCost * 58 - 2 - (id === "no-music" ? 0 : 5)).toFixed(2)); }
export function mergeAudioArgs(volume: number, loop: boolean, duration: VideoDuration, hasOriginalAudio = false) {
  const level = Math.max(0, Math.min(100, volume)) / 100;
  return ["-i", "video.mp4", ...(loop ? ["-stream_loop", "-1"] : []), "-i", "music.mp3", "-filter_complex", hasOriginalAudio ? `[1:a]volume=${level},apad[music];[0:a:0][music]amix=inputs=2:duration=first:normalize=0[audio]` : `[1:a]volume=${level},apad[audio]`, "-map", "0:v:0", "-map", "[audio]", "-c:v", "copy", "-c:a", "aac", "-t", String(duration), "-movflags", "+faststart", "output.mp4"];
}
export async function loadMusicFile(path: string, signal?: AbortSignal) {
  const response = await fetch(path, { signal });
  if (!response.ok || response.headers.get("content-type")?.includes("text/html")) throw new Error("Licensed song file not available yet.");
  const bytes = await response.arrayBuffer();
  if (bytes.byteLength < 100) throw new Error("Music file is empty.");
  const context = new AudioContext();
  try { await context.decodeAudioData(bytes.slice(0)); } finally { await context.close(); }
  return new Blob([bytes], { type: "audio/mpeg" });
}