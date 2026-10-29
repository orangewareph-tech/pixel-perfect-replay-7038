import { withinDailyBudget, withinHourlyLimit } from "./payment-rules";
import type { VideoDuration } from "./video-duration";

// Admin emails - MAIN + BACKUP - Test button visible ONLY for these
export const ADMIN_EMAILS = [
  "orangewareph@gmail.com", // NEW - Main admin you requested
  "orangawareph@gmail.com", // OLD - Keep for backup
  "jorjan.g.lanaja@gmail.com", // Optional backup
] as const;

export const OWNER_EMAIL = "orangawareph@gmail.com"; // Keep for backward compatibility
export const MAIN_ADMIN = "orangewareph@gmail.com"; // Your new main admin

// Check if email is admin (for test button visibility)
export function isAdminEmail(email: string | undefined | null): boolean {
  if (!email) return false;
  return (ADMIN_EMAILS as readonly string[]).includes(email.toLowerCase());
}

// Check if owner tester (old logic + new admin)
export function isOwnerTester(email: string | undefined, role: { role: string } | null | undefined) {
  // Paid bypass always requires a server-verified admin role row, never an email alone.
  return email?.toLowerCase() === OWNER_EMAIL && role?.role === "admin";
}

// Check if can reserve owner test (with limits)
export function canReserveOwnerTest(started: number[], spent: number, duration: VideoDuration, now: number) {
  return withinHourlyLimit(started, now) && withinDailyBudget(spent, duration);
}

// NEW: Admin limits for test button
export const ADMIN_LIMITS = {
  maxPerDay: 10,
  maxCostPerDay: 10, // $10
  costPer5s: 0.35,
  costPer10s: 0.70,
} as const;

export type AdminTestRecord = {
  email: string;
  templateId: string;
  cost: number;
  duration: "5s" | "10s" | VideoDuration;
  timestamp: string;
};

// NEW: Check if admin can test with detailed reason (for test button)
export type AdminTestQuota = { allowed: boolean; videosLeft: number; costLeft: number; reason?: string };

// How many more free admin renders may start right now, given today's browser-side history.
export function adminTestQuota(email: string, recentTests: AdminTestRecord[]): AdminTestQuota {
  if (!isAdminEmail(email)) {
    return { allowed: false, videosLeft: 0, costLeft: 0, reason: "Not admin - orangewareph@gmail.com only" };
  }

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const dayTests = recentTests.filter(
    (t) => t.email.toLowerCase() === email.toLowerCase() && new Date(t.timestamp) > todayStart
  );

  const dayCost = dayTests.reduce((sum, t) => sum + t.cost, 0);
  const videosLeft = Math.max(0, ADMIN_LIMITS.maxPerDay - dayTests.length);
  const costLeft = Math.max(0, Number((ADMIN_LIMITS.maxCostPerDay - dayCost).toFixed(2)));

  if (videosLeft === 0) {
    return { allowed: false, videosLeft, costLeft, reason: `Limit: ${ADMIN_LIMITS.maxPerDay} videos/day` };
  }

  if (costLeft <= 0) {
    return { allowed: false, videosLeft, costLeft, reason: `Limit: $${ADMIN_LIMITS.maxCostPerDay}/day` };
  }

  return { allowed: true, videosLeft, costLeft };
}

// NEW: Check if admin can test with detailed reason (for test button)
export function canAdminTest(email: string, recentTests: AdminTestRecord[]): { allowed: boolean; reason?: string } {
  const quota = adminTestQuota(email, recentTests);
  return quota.allowed ? { allowed: true } : { allowed: false, reason: quota.reason ?? "Daily limit reached" };
}

// Helper for UI - Get admin display info
export function getAdminInfo(email: string | undefined | null) {
  if (!email) return null;
  if (!isAdminEmail(email)) return null;
  
  return {
    isAdmin: true,
    email: email.toLowerCase(),
    isMainAdmin: email.toLowerCase() === MAIN_ADMIN,
    badge: "👑 ADMIN TEST MODE - FREE - Bypass P149",
    cost5s: `$${ADMIN_LIMITS.costPer5s}`,
    cost10s: `$${ADMIN_LIMITS.costPer10s}`,
    limits: `${ADMIN_LIMITS.maxPerDay}/day`,
  };
}