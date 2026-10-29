import { describe, expect, it } from "vitest";
import { checkPaymentRules } from "@/lib/free-checks";
import { AUTOMATIC_MUSIC, christmasTotal } from "@/lib/christmas-music";
import { TEMPLATE_WEBM } from "@/lib/template-preview-formats";
describe("automatic included sound and free audit", () => {
  it("automatically uses a real Christmas soundtrack", () => expect(AUTOMATIC_MUSIC).toBe("pasko-sa-nayon"));
  it("includes sound in ₱149 five-second price", () => expect(christmasTotal(5, AUTOMATIC_MUSIC)).toBe(149));
  it("includes sound in ₱299 ten-second price", () => expect(christmasTotal(10, AUTOMATIC_MUSIC)).toBe(299));
  it("checks unused credits and spending caps", () => expect(checkPaymentRules()).toBe(true));
  it("all five previews are static assets, not generation endpoints", () => { expect(Object.keys(TEMPLATE_WEBM)).toHaveLength(5); for (const url of Object.values(TEMPLATE_WEBM)) expect(url).toMatch(/^\/__l5e\/assets-v1\/[^/]+\/[^/]+\.webm$/); });
});