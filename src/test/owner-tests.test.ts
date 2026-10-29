import { expect, it } from "vitest";
import { ADMIN_LIMITS, adminTestQuota, canReserveOwnerTest, isOwnerTester, type AdminTestRecord } from "@/lib/owner-tests";

const today = new Date().toISOString();
const record = (over: Partial<AdminTestRecord> = {}): AdminTestRecord =>
  ({ email: "orangewareph@gmail.com", templateId: "parol", cost: ADMIN_LIMITS.costPer5s, duration: 5, timestamp: today, ...over });
it("only the named owner with a server role may bypass payment", () => {
  expect(isOwnerTester("orangawareph@gmail.com", { role: "admin" })).toBe(true);
  expect(isOwnerTester("test@gmail.com", { role: "admin" })).toBe(false);
  expect(isOwnerTester("orangawareph@gmail.com", null)).toBe(false);
});
it("blocks the fourth owner video in a rolling hour", () => {
  const now = 10_000_000;
  expect(canReserveOwnerTest([now - 1, now - 2], 0.7, 5, now)).toBe(true);
  expect(canReserveOwnerTest([now - 1, now - 2, now - 3], 1.05, 5, now)).toBe(false);
});
it("owner five-second reservations cost $0.35 and cannot exceed $10/day", () => {
  expect(canReserveOwnerTest([], 9.65, 5, 0)).toBe(true);
  expect(canReserveOwnerTest([], 9.66, 5, 0)).toBe(false);
});
it("owner ten-second reservations cost $0.70 and cannot exceed $10/day", () => {
  expect(canReserveOwnerTest([], 9.3, 10, 0)).toBe(true);
  expect(canReserveOwnerTest([], 9.31, 10, 0)).toBe(false);
});