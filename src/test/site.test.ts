import { describe, expect, it } from "vitest";
import { PLANS, isAllowedPhoto } from "@/lib/site";

describe("pricing & upload rules", () => {
  it("prices are P99/P149/P299/P499", () => {
    expect(PLANS.map((p) => p.price)).toEqual([99, 149, 299, 499]);
  });
  it("P149 is best seller", () => {
    expect(PLANS.find((p) => "best" in p)?.price).toBe(149);
  });
  it("rejects files over 10MB and non JPG/PNG", () => {
    expect(isAllowedPhoto({ type: "image/jpeg", size: 10 * 1024 * 1024 + 1 })).toBe(false);
    expect(isAllowedPhoto({ type: "image/gif", size: 100 })).toBe(false);
    expect(isAllowedPhoto({ type: "image/png", size: 5_000_000 })).toBe(true);
  });
});
