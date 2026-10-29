import { describe, expect, it } from "vitest";
import { buildVideoInput, DURATION_OFFERS, durationProfit, VIDEO_MODEL, videoDurationSchema } from "@/lib/video-duration";

describe("video duration rules", () => {
  it("prices 5 seconds at P149 with P299 original", () => { expect(DURATION_OFFERS[5].price).toBe(149); expect(DURATION_OFFERS[5].originalPrice).toBe(299); });
  it("prices 10 seconds at P299", () => { expect(DURATION_OFFERS[10].price).toBe(299); });
  it("uses the requested cost assumptions", () => { expect(DURATION_OFFERS[5].falCost).toBe(0.08); expect(DURATION_OFFERS[10].falCost).toBe(0.15); });
  it("calculates 5 second profit with FX 58 and P2 fee", () => { expect(durationProfit(5)).toBe(142.36); });
  it("calculates 10 second profit with FX 58 and P2 fee", () => { expect(durationProfit(10)).toBe(288.30); });
  it("passes 5 seconds to Kling", () => { expect(buildVideoInput("photo", "snow", 5).duration).toBe("5"); });
  it("passes 10 seconds and longer motion to Kling", () => { const input = buildVideoInput("photo", "parol", 10); expect(input.duration).toBe("10"); expect(input.prompt).toContain("10 second"); });
  it("rejects durations outside 5 and 10", () => { expect(videoDurationSchema.safeParse(6).success).toBe(false); expect(videoDurationSchema.safeParse(10).success).toBe(true); });
  it("uses the existing model", () => { expect(VIDEO_MODEL).toBe("fal-ai/kling-video/v2.5-turbo/pro/image-to-video"); });
  it("sets requested rendering times", () => { expect(DURATION_OFFERS[5].renderTime).toBe("30-60 seconds"); expect(DURATION_OFFERS[10].renderTime).toBe("2-3 minutes"); });
});