import { z } from "zod";

export const movementSchema = z.enum(["low", "medium", "high", "extreme"]);
export type VideoMovement = z.infer<typeof movementSchema>;
export const DEFAULT_MOVEMENT: VideoMovement = "extreme";
export const MOVEMENT_LABELS = { low: "Low", medium: "Medium", high: "High", extreme: "Extreme" } as const;
export const MOVEMENT_DIRECTIONS = {
  low: "Low movement: slow, subtle movement of the effects.",
  medium: "Medium movement: natural, clearly visible movement of the effects.",
  high: "High movement: lively, faster environmental movement.",
  extreme: "Extreme movement: energetic effects while keeping realistic motion and recognizable faces.",
} as const;
