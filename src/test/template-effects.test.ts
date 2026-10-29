import { describe, expect, it } from "vitest";
import { TEMPLATES } from "@/lib/site";
import { buildVideoInput, VIDEO_MODEL } from "@/lib/video-duration";

describe("enhanced Christmas template payloads", () => {
  const requiredEffects = {
    parol: ["parol", "spinning", "pulsing"],
    snow: ["snow", "shoul", "falling fast"],
    bokeh: ["fairy lights", "fireflies", "light trails"],
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
});