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
export const CHRISTMAS_MUSIC_PROMPT = "Accompanied by joyful Filipino Christmas music, a cheerful Pasko sa Nayon melody with jingle bells, warm festive carols, cozy Noche Buena celebration music and a soft Christmas choir with bells ringing; motion and twinkling follow the musical rhythm.";
export function buildVideoInput(imageUrl: string, scene: string, duration: VideoDuration, movement: VideoMovement = DEFAULT_MOVEMENT) {
  return {
    image_url: imageUrl,
    prompt: `A ${duration} second photorealistic Filipino Christmas video, ONE continuous camera glide, no cuts or crossfades. Use the uploaded photo as the first frame and only customer identity reference. Label its people P1, P2 and so on left to right. Exactly those family members remain visible from first to last frame; never invent a fictional family. Preserve each person's face geometry, eyes, nose, mouth, skin tone, hair, apparent age, clothing and body proportions, including babies. Never blend, merge, swap, duplicate or beautify identities; never copy a family face onto another figure. Keep faces unobstructed and recognizable. A snowy Philippine bahay kubo village with capiz windows, banana and coconut palms, a sari-sari store and glowing parols. No vehicles anywhere. Only the uploaded family, exactly one jolly Santa Claus and exactly one snowman in a woven salakot; no neighbors, crowds or other figures. ${scene} ${duration === 10
      ? "0–2s: whole family at an open bahay kubo window marveling at snow, Santa and snowman visible outside. 2–4s: family steps outside together; toddlers, if present, reach for snowflakes. 4–6s: Santa and P1 sway and turn independently. 6–8s: snowman hops and waves beside P2, if present, who copies without touching. 8–10s: everyone waves under a big glowing parol beside a Noche Buena table with a whole lechon; hold the final group shot."
      : "0–2s: whole family marvels at sparkling snow beside the bahay kubo, Santa and snowman already visible. 2–4s: Santa sways beside P1, snowman waves; family stays together. 4–5s: everyone waves under a glowing parol beside a Noche Buena table with a whole lechon; hold the final group shot."} ${MOVEMENT_DIRECTIONS[movement]} No orbiting, rapid zooming or camera shake. Gentle safe ground-level action; no clapping, hand-holding, hugging or touching, no face-obscuring motion blur. Hands relaxed, never in close-up. ${CHRISTMAS_MUSIC_PROMPT} End cleanly at ${duration} seconds. No generated text, brand names or logos; the app adds the Merry Christmas greeting afterward.`,
    duration: String(duration),
    cfg_scale: 0.5,
    negative_prompt: "blurred faces, face change, different faces, distorted faces, face morphing, face swapping, merged baby, duplicated people, extra children, background people, crowds, vehicles, body distortion, changed ethnicity, outfit transformation, extra limbs, warped hands, obscured faces, hand-holding, hugging, touching, clapping, unsafe action, scary, horror, low quality, blurry, deformed, cartoon, unnatural motion, flickering, strobing lights, abrupt scene changes, hard cuts, crossfades, camera shake, camera rotation, orbiting, rapid zoom, text, logo, watermark",
  };
}
export const LAUNCH_COST = 3048;
export function breakEvenVideos(duration: VideoDuration) { return Math.ceil(LAUNCH_COST / durationProfit(duration)); }
