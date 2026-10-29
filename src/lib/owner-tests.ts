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
  // New: Check ADMIN_EMAILS list (no need role check for test button)
  if (email && isAdminEmail(email)) {
    return true;
  }
  // Old: Keep existing logic for backward compatibility
  return email?.toLowerCase() === OWNER_EMAIL && role?.role === "admin";
}

// Check if can reserve owner test (with limits)
export function canReserveOwnerTest(started: number[], spent: number, duration: VideoDuration, now: number) {
  return withinHourlyLimit(started, now) && withinDailyBudget(spent, duration);
}

// NEW: Admin limits for test button
export const ADMIN_LIMITS = {
  maxPerHour: 3,
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
export function canAdminTest(email: string, recentTests: AdminTestRecord[]): { allowed: boolean; reason?: string } {
  if (!isAdminEmail(email)) {
    return { allowed: false, reason: "Not admin - orangewareph@gmail.com only" };
  }

  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const hourTests = recentTests.filter(
    (t) => t.email.toLowerCase() === email.toLowerCase() && new Date(t.timestamp) > oneHourAgo
  );

  const dayTests = recentTests.filter(
    (t) => t.email.toLowerCase() === email.toLowerCase() && new Date(t.timestamp) > todayStart
  );

  const dayCost = dayTests.reduce((sum, t) => sum + t.cost, 0);

  if (hourTests.length >= ADMIN_LIMITS.maxPerHour) {
    return { allowed: false, reason: `Limit: ${ADMIN_LIMITS.maxPerHour} videos/hour - Try again later` };
  }

  if (dayTests.length >= ADMIN_LIMITS.maxPerDay) {
    return { allowed: false, reason: `Limit: ${ADMIN_LIMITS.maxPerDay} videos/day` };
  }

  if (dayCost >= ADMIN_LIMITS.maxCostPerDay) {
    return { allowed: false, reason: `Limit: $${ADMIN_LIMITS.maxCostPerDay}/day` };
  }

  return { allowed: true };
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
    limits: `${ADMIN_LIMITS.maxPerHour}/hour, ${ADMIN_LIMITS.maxPerDay}/day`,
  };
}