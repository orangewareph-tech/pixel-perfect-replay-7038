import { z } from "zod";

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
export function buildVideoInput(imageUrl: string, scene: string, duration: VideoDuration) {
  return {
    image_url: imageUrl,
    prompt: `${duration === 5
      ? "Ultra magical Filipino Christmas, Noche Buena, parol star glowing and sparkling, golden fairy lights twinkling, gentle snowfall around family, warm Christmas lights bokeh, fireplace glow, magical sparkles and stars floating around family, Christmas tree lights blinking, magical snow globe effect, warm and cozy Filipino Christmas atmosphere"
      : "Ultra magical Filipino Christmas extended story, starts with the original family photo then magical transition: parol star lights up and glows, snowfall begins gently, fairy lights around family start twinkling and dancing, golden sparkles float in air, Christmas tree behind family lights up with blinking colors, family gently sways, fireplace flickering warm light, Santa hats appear magically, stars twinkle, Noche Buena table with lechon appears"}. Featured effect: ${scene}. ${duration} second smooth cinematic motion, ultra detailed, ultra realistic, preserve the original people, faces, identity, skin tone, expressions and clothing, no face change, no face distortion. Keep faces unobstructed and the family recognizable.`,
    duration: String(duration),
    cfg_scale: 0.5,
    negative_prompt: "blurred faces, face change, different faces, distorted faces, scary, horror, dark, low quality, blurry, deformed, changed ethnicity, cartoon, extra people, obscured faces",
  };
}
export const LAUNCH_COST = 3048;
export function breakEvenVideos(duration: VideoDuration) { return Math.ceil(LAUNCH_COST / durationProfit(duration)); }
