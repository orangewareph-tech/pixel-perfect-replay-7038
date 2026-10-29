import { describe, expect, it } from "vitest";
import { christmasTotal, christmasProfit, DEFAULT_MUSIC_VOLUME, mergeAudioArgs, musicPath, musicSchema, musicAssetUrl, MUSIC_ASSETS, CHRISTMAS_OVERLAY_TEXT } from "@/lib/christmas-music";
import { TEMPLATES } from "@/lib/site";
import { buildVideoInput } from "@/lib/video-duration";

describe("Christmas upgrades", () => {
  it("defaults to Parol and offers five Pinoy effects", () => { expect(TEMPLATES.map((t) => t.id)).toEqual(["parol", "snow", "bokeh", "globe", "fire"]); expect(TEMPLATES[0].best).toBe(true); });
  it("keeps a silent 5-second video at ₱149", () => { expect(christmasTotal(5, "no-music")).toBe(149); });
  it("keeps a silent 10-second video at ₱299", () => { expect(christmasTotal(10, "no-music")).toBe(299); });
  it("includes automatic music at ₱149 for five seconds", () => { for (const id of musicSchema.options) expect(christmasTotal(5, id)).toBe(149); });
  it("includes automatic music at ₱299 for ten seconds", () => { for (const id of musicSchema.options) expect(christmasTotal(10, id)).toBe(299); });
  it("subtracts the supplied ₱5 audio budget from included-music profit", () => { expect(christmasProfit(5, "pasko-sa-nayon")).toBe(121.70); expect(christmasProfit(10, "pasko-sa-nayon")).toBe(251.40); });
  it("uses no audio file for No Music", () => { expect(musicPath("no-music", 5)).toBeNull(); });
  it("No Music never loads an audio asset", () => { expect(musicAssetUrl("no-music", 5)).toBeNull(); expect(musicAssetUrl("no-music", 10)).toBeNull(); });
  it("provides a distinct nonempty MP3 asset for each track and duration", () => { const assets = Object.values(MUSIC_ASSETS).flatMap((pair) => [pair[5], pair[10]]); expect(assets.length).toBe(8); expect(new Set(assets.map((a) => a.asset_id)).size).toBe(8); for (const asset of assets) { expect(asset.size).toBeGreaterThan(1000); expect(asset.content_type).toBe("audio/mpeg"); } });
  it("uses duration-specific audio files", () => { expect(musicPath("pasko-sa-nayon", 5)).toBe("/music/pasko-sa-nayon-5sec.mp3"); expect(musicPath("pasko-sa-nayon", 10)).toBe("/music/pasko-sa-nayon-10sec.mp3"); });
  it("defaults music volume to 70 percent", () => { expect(DEFAULT_MUSIC_VOLUME).toBe(70); expect(mergeAudioArgs(70, true, 5)).toContain("[1:a]volume=0.7,apad[audio]"); });
  it("only loops music when requested", () => { expect(mergeAudioArgs(70, true, 10)).toContain("-stream_loop"); expect(mergeAudioArgs(70, false, 10)).not.toContain("-stream_loop"); });
  it("preserves original audio when present", () => { expect(mergeAudioArgs(70, true, 5, true).join(" ")).toContain("amix=inputs=2"); });
  it("each selected template changes the actual generation payload", () => { const prompts = TEMPLATES.map((t) => buildVideoInput("photo", t.scene, 5).prompt); expect(new Set(prompts).size).toBe(5); for (const t of TEMPLATES) expect(buildVideoInput("photo", t.scene, 5).prompt).toContain(t.scene); });
  it("requests progressive magic for 10 seconds and protects faces", () => { expect(buildVideoInput("photo", TEMPLATES[0].scene, 10).prompt).toContain("Use the uploaded photo as the starting frame"); expect(buildVideoInput("photo", TEMPLATES[0].scene, 5).negative_prompt).toContain("different faces"); });
});