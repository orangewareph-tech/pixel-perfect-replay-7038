import { z } from "zod";

export const movementSchema = z.enum(["low", "medium", "high", "extreme"]);
export type VideoMovement = z.infer<typeof movementSchema>;
export const DEFAULT_MOVEMENT: VideoMovement = "extreme";
export const MOVEMENT_LABELS = { low: "Low", medium: "Medium", high: "High", extreme: "Extreme" } as const;
export const MOVEMENT_DIRECTIONS = {
  low: "Low movement: gentle slow realistic movement, subtle natural floating and swaying, soft twinkling, slow camera push with slight parallax, calm peaceful Christmas atmosphere, minimal motion.",
  medium: "Medium movement: moderate realistic movement, natural floating and pulsing, gentle swirling and drifting, soft twinkling, moderate parallax dolly, warm joyful movement.",
  high: "High movement: energetic realistic movement, dynamic floating, dancing and pulsing that fits the template, lively swirling, bright twinkling, strong parallax, dolly with gentle zoom in and out, festive energy.",
  extreme: "Extreme movement: highly dynamic realistic movement that fits the template, effects floating, pulsing, swirling and dancing energetically, characters and particles in continuous motion, fast camera dolly through the scene with parallax, gentle zoom in and out and a smooth slow orbit, high-motion continuous viral TikTok energy with no static moments, still realistic and fitting.",
} as const;
