import { z } from "zod";
import { DEFAULT_MOVEMENT, MOVEMENT_DIRECTIONS, type VideoMovement } from "./video-movement";

export const videoDurationSchema = z.union([z.literal(5), z.literal(10)]);
export type VideoDuration = z.infer<typeof videoDurationSchema>;
export const VIDEO_MODEL = "fal-ai/kling-video/v2.5-turbo/pro/image-to-video";
export const FAL_LISTED_COST = { 5: 0.35, 10: 0.70 } as const;
export const DURATION_OFFERS = {
  5: { price: 149, originalPrice: 299, falCost: 0.35, renderTime: "30-60 seconds", delivery: "Estimated generation: 30–60 seconds 🎄", title: "5 segundos - Best Seller", subtitle: "Perfect for TikTok & FB Reels", badge: "Most Popular", details: ["30–60 sec generation", "No watermark", "HD 1080p", "Snowfall, Parol, Christmas Lights templates"] },
  10: { price: 299, falCost: 0.70, renderTime: "2-3 minutes", delivery: "Estimated delivery: 2-3 minutes - Longer magic! ✨", title: "10 segundos - Premium", subtitle: "Longer story, more magic", badge: "Premium", details: ["2-3 mins generation", "~25 MB file", "HD 1080p", "Extended story + dancing"] },
} as const;
export function durationProfit(duration: VideoDuration) {
  const offer = DURATION_OFFERS[duration];
  return Number((offer.price - offer.falCost * 58 - 2).toFixed(2));
}
export function durationCheckoutLabel(duration: VideoDuration) {
  return `Upload & Pay ₱${DURATION_OFFERS[duration].price} - ${duration} Sec ${duration === 10 ? "Premium Magic" : "Magic"} →`;
}
export function buildVideoInput(imageUrl: string, scene: string, duration: VideoDuration, movement: VideoMovement = DEFAULT_MOVEMENT) {
  return {
    image_url: imageUrl,
    prompt: `${duration === 5
      ? "A 5 second cinematic Christmas video in one continuous shot."
      : "A 10 second cinematic Christmas video in one continuous shot that builds gently from start to finish."} Use the uploaded photo as the starting frame and animate the existing scene; do not replace the people or create a new image. ${scene} ${MOVEMENT_DIRECTIONS[movement]} One primary animation with subtle secondary effects. Steady camera: no forced camera rotation, rapid zooming or camera shake. Natural movement, realistic lighting, smooth animation. Preserve the original people, faces, identity, skin tone, hairstyle, clothing and body proportions. Keep faces unobstructed and the family recognizable. No cuts, no text or logos.`,
    duration: String(duration),
    cfg_scale: 0.5,
    negative_prompt: "blurred faces, face change, different faces, distorted faces, face morphing, body distortion, changed ethnicity, outfit transformation, extra limbs, warped hands, extra foreground people, obscured faces, scary, horror, dark, low quality, blurry, deformed, cartoon, excessive particles, unnatural motion, flickering, strobing lights, abrupt scene changes, hard cuts, camera rotation, rapid zoom, camera shake, text, logo, watermark",
  };
}
export const LAUNCH_COST = 3048;
export function breakEvenVideos(duration: VideoDuration) { return Math.ceil(LAUNCH_COST / durationProfit(duration)); }
