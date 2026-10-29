import { describe, expect, it } from "vitest";
import { TEMPLATES } from "@/lib/site";
import { buildVideoInput, VIDEO_MODEL } from "@/lib/video-duration";

describe("enhanced Christmas template payloads", () => {
  const requiredEffects = {
    parol: ["parol", "20 colorful parol", "golden star particles"],
    snow: ["snow", "shoul", "breath vapor"],
    bokeh: ["fairy lights", "fireflies", "light trails", "heart-shaped halos"],
    globe: ["santa", "elves", "toy train", "chimney smoke", "sleigh"],
    fire: ["bibingka", "puto bumbong", "fireplace", "flames"],
  };
  for (const template of TEMPLATES) {
    it(`${template.name} carries its requested effects at both durations`, () => {
      for (const duration of [5, 10] as const) {
        const input = buildVideoInput("photo", template.scene, duration);
        for (const effect of requiredEffects[template.id]) expect(input.prompt.toLowerCase()).toContain(effect);
        expect(input.image_url).toBe("photo");
        expect(input.duration).toBe(String(duration));
        expect(input.cfg_scale).toBe(0.5);
      }
    });
  }
  it("keeps every full prompt within the 2500-character model limit", () => {
    for (const t of TEMPLATES) for (const d of [5, 10] as const) for (const m of ["low", "extreme"] as const)
      expect(buildVideoInput("photo", t.scene, d, m).prompt.length).toBeLessThanOrEqual(2500);
  });
  it("uses progressive 10-second pacing and focused 5-second motion", () => {
    expect(buildVideoInput("photo", TEMPLATES[0].scene, 10).prompt).toContain("seconds 3–7");
    expect(buildVideoInput("photo", TEMPLATES[0].scene, 5).prompt).toContain("one clear magical motion");
  });
  it("keeps faces and outfits intact without mixing other template scenes", () => {
    const input = buildVideoInput("photo", TEMPLATES[1].scene, 10);
    expect(input.prompt).toContain("Preserve the original people, faces, identity, skin tone, expressions and clothing");
    expect(input.negative_prompt).toContain("outfit transformation");
    expect(input.prompt).not.toContain("lechon");
    expect(input.prompt).not.toContain("Santa hats");
    expect(VIDEO_MODEL).toBe("fal-ai/kling-video/v2.5-turbo/pro/image-to-video");
  });
  it("keeps base scenes neutral so the movement slider decides speed", () => {
    for (const t of TEMPLATES) expect(t.scene).not.toMatch(/EXTREME|RAPIDLY|FAST|shak|ORBIT|360/);
  });
  it("Low movement stays gentle and Extreme adds rapid motion", () => {
    const low = buildVideoInput("photo", TEMPLATES[0].scene, 10, "low");
    expect(low.prompt).toContain("gentle slow floating");
    expect(low.prompt).not.toContain("RAPIDLY");
    expect(low.negative_prompt).toContain("rapid spinning camera");
    const ext = buildVideoInput("photo", TEMPLATES[0].scene, 10, "extreme");
    expect(ext.prompt).toContain("RAPIDLY");
    expect(ext.negative_prompt).toContain("camera shake");
    expect(ext.negative_prompt).not.toContain("rapid spinning camera");
  });
});
