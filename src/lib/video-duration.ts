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
      ? "A 5 second cinematic Christmas portrait in one continuous shot. Establish the selected effect immediately, emphasize one clear magical motion with supporting light and particles, then settle into a warm portrait ending. Keep secondary background actions subtle rather than crowding the short scene."
      : "A 10 second progressive cinematic Christmas story in one continuous shot: starts with the original family photo. During seconds 0–3 the selected setting gradually lights up; during seconds 3–7 its main magical motion unfolds and secondary background details become visible; during seconds 7–10 the glow builds gently and settles into a warm portrait ending."} Featured effect: ${scene}. Apply only this selected template's effects. Smooth controlled camera motion, cinematic lighting, detailed realistic textures and natural subtle family movement. Preserve the original people, faces, identity, skin tone, expressions and clothing, no face change, no face distortion. Keep faces unobstructed and the family recognizable. No cuts, no additional foreground people, no captions or logos.`,
    duration: String(duration),
    cfg_scale: 0.5,
    negative_prompt: "blurred faces, face change, different faces, distorted faces, scary, horror, dark, low quality, blurry, deformed, changed ethnicity, cartoon, extra foreground people, obscured faces, face morphing, outfit transformation, extra limbs, warped hands, camera shake, rapid spinning camera, hard cuts, text, watermark",
  };
}
export const LAUNCH_COST = 3048;
export function breakEvenVideos(duration: VideoDuration) { return Math.ceil(LAUNCH_COST / durationProfit(duration)); }
