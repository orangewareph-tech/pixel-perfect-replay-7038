import { describe, expect, it } from "vitest";
import { authReturnPath, hasGoogleIdentity } from "@/lib/google-auth";
describe("Google-only accounts", () => {
  it("accepts Google and rejects email-only accounts", () => {
    expect(hasGoogleIdentity({ app_metadata: { provider: "google" }, identities: [] })).toBe(true);
    expect(hasGoogleIdentity({ app_metadata: { provider: "email" }, identities: [] })).toBe(false);
    expect(hasGoogleIdentity(null)).toBe(false);
  });
  it("preserves an allowed creation destination without external redirects", () => {
    expect(authReturnPath("/create?template=fire")).toBe("/create?template=fire");
    expect(authReturnPath("https://example.com")).toBe("/create");
    expect(authReturnPath("//example.com")).toBe("/create");
  });
});