import { describe, expect, it } from "vitest";
import { canClaimPayment, withinDailyBudget, withinHourlyLimit, installedDisplay, paymentChoicesSchema } from "@/lib/payment-rules";
import { christmasTotal } from "@/lib/christmas-music";

describe("paid video rules", () => {
  for (const template of ["parol", "snow", "bokeh", "globe", "fire"]) it(`accepts ${template} for both paid duration offers`, () => {
    for (const duration of [5, 10]) expect(paymentChoicesSchema.parse({ template, duration, music: "pasko-sa-nayon" }).template).toBe(template);
    expect(paymentChoicesSchema.safeParse({ template: "MagicFam", duration: 5, music: "pasko-sa-nayon" }).success).toBe(false);
  });
  it("grants generation only to approved unused credits", () => {
    expect(canClaimPayment("approved")).toBe(true);
    for (const status of ["pending", "rejected", "SUBMITTING", "IN_QUEUE", "COMPLETED", "FAILED"]) expect(canClaimPayment(status)).toBe(false);
  });
  it("charges ₱149 for a five-second video", () => expect(christmasTotal(5, "no-music")).toBe(149));
  it("charges ₱149 for a five-second music video", () => expect(christmasTotal(5, "pasko-sa-nayon")).toBe(149));
  it("charges ₱299 for a ten-second video", () => expect(christmasTotal(10, "no-music")).toBe(299));
  it("charges ₱299 for a ten-second music video", () => expect(christmasTotal(10, "pasko-sa-nayon")).toBe(299));
  it("blocks a fourth generation within an hour", () => { const now = 10_000_000; expect(withinHourlyLimit([now - 1, now - 2], now)).toBe(true); expect(withinHourlyLimit([now - 1, now - 2, now - 3], now)).toBe(false); expect(withinHourlyLimit([now - 3_600_000, now - 1, now - 2], now)).toBe(true); });
  it("keeps five-second spend within $10 including the next reservation", () => { expect(withinDailyBudget(9.45, 5)).toBe(true); expect(withinDailyBudget(9.8, 5)).toBe(false); });
  it("counts the ten-second cost as $0.70", () => { expect(withinDailyBudget(9.3, 10)).toBe(true); expect(withinDailyBudget(9.65, 10)).toBe(false); });
  it("detects standalone installation without treating browser mode as installed", () => { expect(installedDisplay(false, false)).toBe(false); expect(installedDisplay(true)).toBe(true); expect(installedDisplay(false, true)).toBe(true); });
});