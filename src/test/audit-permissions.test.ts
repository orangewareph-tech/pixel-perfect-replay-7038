import { expect, it } from "vitest";
import { isAuditAdmin } from "@/lib/audit-permissions";

it("only an administrator may use private Fal.ai diagnostics", () => {
  expect(isAuditAdmin({ role: "admin" })).toBe(true);
  expect(isAuditAdmin({ role: "user" })).toBe(false);
  expect(isAuditAdmin(null)).toBe(false);
});