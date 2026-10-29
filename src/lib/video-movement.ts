import { z } from "zod";

export const movementSchema = z.enum(["low", "medium", "high", "extreme"]);
export type VideoMovement = z.infer<typeof movementSchema>;
export const DEFAULT_MOVEMENT: VideoMovement = "extreme";
export const MOVEMENT_LABELS = { low: "Low", medium: "Medium", high: "High", extreme: "Extreme" } as const;
export const MOVEMENT_DIRECTIONS = {
  low: "Low movement: gentle drifting particles, soft light pulses and subtle background animation. One slow camera push-in, natural breathing only.",
  medium: "Medium movement: steadily moving particles, dancing lights and visible background animation. One smooth camera push-in with clear parallax, natural breathing and small smiles.",
  high: "High movement: fast swirling particles, lively dancing lights and energetic continuous background animation. One energetic smooth camera push-in with strong parallax, small natural smiles and breathing.",
  extreme: "Extreme movement: very high motion, dynamic energetic continuous animation throughout, rapid swirling spinning floating dancing particles and lights, strong foreground/background parallax. Activate all selected scene movements at their fastest coherent speed; no frozen or motionless effects. One brisk smooth camera push-in, keep the family frontal with small natural smiles and breathing. Do not shake the camera, spin around faces, strobe lights or force limbs to move.",
} as const;