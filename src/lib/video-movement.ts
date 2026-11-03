import { z } from "zod";

export const movementSchema = z.enum(["low", "medium", "high", "extreme"]);
export type VideoMovement = z.infer<typeof movementSchema>;
export const DEFAULT_MOVEMENT: VideoMovement = "extreme";
export const MOVEMENT_LABELS = { low: "Low", medium: "Medium", high: "High", extreme: "Extreme" } as const;
export const MOVEMENT_DIRECTIONS = {
  low: "Low movement: gentle slow realistic movement, subtle swaying and soft twinkling; a gentle continuous camera glide with slight parallax.",
  medium: "Medium movement: moderate floating, pulsing and drifting effects; a gentle continuous camera glide with natural parallax.",
  high: "High movement: lively sparkling, floating and pulsing effects; one continuous camera glide with stronger parallax. Keep human actions gentle.",
  extreme: "Extreme movement: richly animated continuous snowfall, lights and particles; one continuous camera glide with pronounced parallax. Keep sways, turns and hops gentle, faces clear and bodies realistic.",
} as const;
