import { z } from "zod";
import { videoDurationSchema, type VideoDuration } from "@/lib/video-duration";
import { musicSchema } from "@/lib/christmas-music";
import { templateSchema } from "@/lib/template-ids";

export const paymentChoicesSchema = z.object({ duration: videoDurationSchema, music: musicSchema, template: templateSchema });
export type PaymentChoices = z.infer<typeof paymentChoicesSchema>;
export const DAILY_SPEND_LIMIT = 10;
export const HOURLY_GENERATION_LIMIT = 3;
export function canClaimPayment(status: string) { return status === "approved"; }
export function withinHourlyLimit(started: number[], now: number) { return started.filter((time) => time > now - 3_600_000).length < HOURLY_GENERATION_LIMIT; }
export function withinDailyBudget(spent: number, duration: VideoDuration, cap = DAILY_SPEND_LIMIT) { return Math.round(spent * 100) + (duration === 5 ? 35 : 70) <= Math.round(cap * 100); }
export function installedDisplay(standalone: boolean, iosStandalone?: boolean) { return standalone || iosStandalone === true; }