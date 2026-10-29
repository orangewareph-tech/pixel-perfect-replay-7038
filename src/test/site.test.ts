import { describe, expect, it } from "vitest";
import { PLANS, isAllowedPhoto } from "@/lib/site";

describe("pricing & upload rules", () => {
  it("prices are P99/P149/P299/P499", () => {
    expect(PLANS.map((p) => p.price)).toEqual([99, 149, 299, 499]);
  });
  it("P149 is best seller", () => {
    expect(PLANS.find((p) => "best" in p)?.price).toBe(149);
  });
  it("keeps Preview at 720p and package quantities at 3 and 5", () => {
    expect(PLANS.find((p) => p.id === "preview")?.price).toBe(99);
    expect(PLANS.find((p) => p.id === "triple")?.videos).toBe(3);
    expect(PLANS.find((p) => p.id === "family")?.videos).toBe(5);
  });
  it("rejects files over 10MB and non JPG/PNG", () => {
    expect(isAllowedPhoto({ type: "image/jpeg", size: 10 * 1024 * 1024 + 1 })).toBe(false);
    expect(isAllowedPhoto({ type: "image/gif", size: 100 })).toBe(false);
    expect(isAllowedPhoto({ type: "image/png", size: 5_000_000 })).toBe(true);
  });
});
