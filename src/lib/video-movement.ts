import { z } from "zod";

export const movementSchema = z.enum(["low", "medium", "high", "extreme"]);
export type VideoMovement = z.infer<typeof movementSchema>;
export const DEFAULT_MOVEMENT: VideoMovement = "extreme";
export const MOVEMENT_LABELS = { low: "Low", medium: "Medium", high: "High", extreme: "Extreme" } as const;
export const MOVEMENT_DIRECTIONS = {
  low: "Low movement: gentle slow floating, subtle twinkling, soft parallax, slow dolly. Calm and peaceful, no fast motion, no camera shake.",
  medium: "Medium movement: moderate floating and pulsing, gentle swirling, moderate parallax, smooth dolly. No camera shake.",
  high: "High movement: energetic floating, dancing and pulsing effects, dynamic swirling, strong parallax, fast dolly zooming in and out. No camera shake.",
  extreme: "EXTREME MOVEMENT: effects RAPIDLY floating spinning rotating continuously, dancing swirling fast, pulsing, zooming, orbiting like planets flying from background to foreground, SWIRLING FAST vortex, TWINKLING FAST, BLINKING FAST, moving bokeh, traveling lens flare moving, camera RAPIDLY ZOOMING IN and OUT, camera ORBITING fast with parallax, HIGH MOTION DYNAMIC energetic continuous animation, no static frames, viral TikTok movement. Keep the camera stable without shake and keep faces undistorted.",
} as const;
