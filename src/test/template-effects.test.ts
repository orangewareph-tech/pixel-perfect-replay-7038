import { describe, expect, it } from "vitest";
import { TEMPLATES } from "@/lib/site";
import { buildVideoInput, VIDEO_MODEL } from "@/lib/video-duration";

describe("enhanced Christmas template payloads", () => {
  const requiredEffects = {
    parol: ["parol", "golden star dust"],
    snow: ["snow", "snowflakes"],
    bokeh: ["fairy lights", "heart", "bokeh"],
    globe: ["santa", "snowman", "salakot"],
    fire: ["fireplace", "flames", "steam"],
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
    for (const t of TEMPLATES) for (const d of [5, 10] as const) for (const m of ["low", "medium", "high", "extreme"] as const)
      expect(buildVideoInput("photo", t.scene, d, m).prompt.length).toBeLessThanOrEqual(2500);
  });
  it("uses progressive 10-second pacing and focused 5-second motion", () => {
    expect(buildVideoInput("photo", TEMPLATES[0].scene, 10).prompt).toContain("10 second");
    expect(buildVideoInput("photo", TEMPLATES[0].scene, 5).prompt).toContain("5 second");
  });
  it("keeps faces and outfits intact without mixing other template scenes", () => {
    const input = buildVideoInput("photo", TEMPLATES[1].scene, 10);
    expect(input.prompt).toContain("Preserve each person's face geometry");
    expect(input.negative_prompt).toContain("outfit transformation");
    expect(input.prompt).not.toContain("fireplace");
    expect(input.prompt).not.toContain("toy train");
    expect(VIDEO_MODEL).toBe("fal-ai/kling-video/v2.5-turbo/pro/image-to-video");
  });
  it("keeps base scenes neutral so the movement slider decides speed", () => {
    for (const t of TEMPLATES) expect(t.scene).not.toMatch(/EXTREME|RAPIDLY|FAST|shak|ORBIT|360/);
  });
  it("Low stays gentle and Extreme animates effects without unsafe camera motion", () => {
    const low = buildVideoInput("photo", TEMPLATES[0].scene, 10, "low");
    expect(low.prompt).toContain("gentle slow realistic movement");
    expect(low.prompt).not.toContain("Extreme movement");
    expect(low.negative_prompt).toContain("rapid zoom");
    const ext = buildVideoInput("photo", TEMPLATES[0].scene, 10, "extreme");
    expect(ext.prompt).toContain("Extreme movement");
    expect(ext.negative_prompt).toContain("camera shake");
    expect(ext.negative_prompt).toContain("rapid zoom");
    expect(buildVideoInput("photo", TEMPLATES[0].scene, 10, "medium").negative_prompt).toContain("orbiting");
    for (const m of ["low", "medium", "high", "extreme"] as const) expect(buildVideoInput("photo", TEMPLATES[2].scene, 5, m).prompt).toContain("Pasko sa Nayon");
  });
  it("uses the five two-second story beats for every 10-second template", () => {
    for (const t of TEMPLATES) {
      const prompt = buildVideoInput("photo", t.scene, 10).prompt;
      for (const beat of ["0–2s:", "2–4s:", "4–6s:", "6–8s:", "8–10s:"]) expect(prompt).toContain(beat);
      expect(prompt).toContain("End cleanly at 10 seconds");
    }
  });
  it("keeps only customer identities, one Santa and one snowman without vehicles or touching", () => {
    for (const t of TEMPLATES) for (const duration of [5, 10] as const) {
      const input = buildVideoInput("photo", t.scene, duration);
      expect(input.prompt).toContain("Exactly those family members remain visible from first to last frame");
      expect(input.prompt).toContain("exactly one jolly Santa Claus and exactly one snowman");
      expect(input.prompt).toContain("No vehicles anywhere");
      expect(input.prompt).toContain("no clapping, hand-holding, hugging or touching");
      expect(input.negative_prompt).toContain("duplicated people, extra children, background people");
    }
  });
  it("leaves the automatic greeting to the existing overlay rather than generating duplicate text", () => {
    expect(buildVideoInput("photo", TEMPLATES[0].scene, 10).prompt).toContain("the app adds the Merry Christmas greeting afterward");
  });
});
