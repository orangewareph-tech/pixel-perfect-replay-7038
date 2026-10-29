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

it("lets a fresh admin start all five templates at once", () => {
  const quota = adminTestQuota("orangewareph@gmail.com", []);
  expect(quota).toEqual({ allowed: true, videosLeft: ADMIN_LIMITS.maxPerDay, costLeft: ADMIN_LIMITS.maxCostPerDay });
});

it("counts only today's admin renders against the daily video allowance", () => {
  const yesterday = new Date(Date.now() - 2 * 86_400_000).toISOString();
  const quota = adminTestQuota("orangewareph@gmail.com", [record(), record({ timestamp: yesterday })]);
  expect(quota.videosLeft).toBe(ADMIN_LIMITS.maxPerDay - 1);
  expect(quota.costLeft).toBe(Number((ADMIN_LIMITS.maxCostPerDay - ADMIN_LIMITS.costPer5s).toFixed(2)));
});

it("blocks the admin batch once the daily video allowance is used", () => {
  const quota = adminTestQuota("orangewareph@gmail.com", Array.from({ length: ADMIN_LIMITS.maxPerDay }, () => record()));
  expect(quota.allowed).toBe(false);
  expect(quota.videosLeft).toBe(0);
  expect(quota.reason).toBe(`Limit: ${ADMIN_LIMITS.maxPerDay} videos/day`);
});

it("blocks the admin batch once the daily spending cap is reached", () => {
  // Eight renders at $1.25 spend the whole $10 budget while two video slots remain,
  // so this exercises the money cap on its own rather than the video cap.
  const pricey = record({ cost: 1.25 });
  const quota = adminTestQuota("orangewareph@gmail.com", Array.from({ length: 8 }, () => pricey));
  expect(quota.allowed).toBe(false);
  expect(quota.videosLeft).toBe(2);
  expect(quota.costLeft).toBe(0);
  expect(quota.reason).toBe(`Limit: $${ADMIN_LIMITS.maxCostPerDay}/day`);
});

it("leaves the admin batch with only what the remaining budget can actually pay for", () => {
  const nine = record({ cost: 1.0 });
  const quota = adminTestQuota("orangewareph@gmail.com", Array.from({ length: 9 }, () => nine));
  expect(quota.allowed).toBe(true);
  expect(quota.costLeft).toBe(1);
  const unitCost = ADMIN_LIMITS.costPer10s;
  expect(Math.min(TEMPLATES.length, quota.videosLeft, Math.floor(quota.costLeft / unitCost))).toBe(1);
});


it("gives non-admins no free renders", () => {
  const quota = adminTestQuota("someone@gmail.com", []);
  expect(quota.allowed).toBe(false);
  expect(quota.videosLeft).toBe(0);
});
