import { withinDailyBudget, withinHourlyLimit } from "./payment-rules";
import type { VideoDuration } from "./video-duration";

export const OWNER_EMAIL = "orangawareph@gmail.com";
export function isOwnerTester(email: string | undefined, role: { role: string } | null | undefined) {
  return email?.toLowerCase() === OWNER_EMAIL && role?.role === "admin";
}
export function canReserveOwnerTest(started: number[], spent: number, duration: VideoDuration, now: number) {
  return withinHourlyLimit(started, now) && withinDailyBudget(spent, duration);
}