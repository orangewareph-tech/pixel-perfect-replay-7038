import snow from "@/assets/snowfall-magic.jpg";
import globe from "@/assets/santa-village-magic.jpg";
import fire from "@/assets/fireplace-noche-buena-magic.jpg";
import bokeh from "@/assets/fairy-lights-magic.jpg";
import parol from "@/assets/parol-star-magic.jpg";
import snowWebp from "@/assets/snowfall-magic.webp";
import globeWebp from "@/assets/santa-village-magic.webp";
import fireWebp from "@/assets/fireplace-noche-buena-magic.webp";
import bokehWebp from "@/assets/fairy-lights-magic.webp";
import parolWebp from "@/assets/parol-star-magic.webp";
import parolPreview from "@/assets/parol-star-magic-preview.mp4.asset.json";
import snowPreview from "@/assets/snowfall-magic-preview.mp4.asset.json";
import bokehPreview from "@/assets/fairy-lights-magic-preview.mp4.asset.json";
import globePreview from "@/assets/santa-village-magic-preview.mp4.asset.json";
import firePreview from "@/assets/fireplace-noche-buena-magic-preview.mp4.asset.json";

export const TEMPLATE_MEDIA = {
  parol: { webp: parolWebp, preview: parolPreview.url, badge: "Best Seller", alt: "Parol Star Magic - Pinoy Christmas with glowing parol" },
  snow: { webp: snowWebp, preview: snowPreview.url, badge: "Viral TikTok", alt: "Snowfall Magic - Snow falling on family" },
  bokeh: { webp: bokehWebp, preview: bokehPreview.url, badge: "Most Beautiful", alt: "Fairy Lights Magic - Dancing lights and bokeh" },
  globe: { webp: globeWebp, preview: globePreview.url, badge: "Kids Favorite", alt: "Santa Village Magic - Santa and family" },
  fire: { webp: fireWebp, preview: firePreview.url, badge: "Premium", alt: "Fireplace Noche Buena Magic - Family by fireplace with lechon" },
} as const;

export const TEMPLATES = [
  { id: "parol", icon: "⭐", best: true, name: "Parol Star Magic", desc: "Best Seller · golden parol glow", img: parol, scene: "parol star glowing bright, Filipino parol lantern, star of Bethlehem, golden glow, sparkles from parol, traditional Filipino Christmas" },
  { id: "snow", icon: "❄️", best: false, name: "Snowfall Magic", desc: "Gentle snowflakes, cozy magic", img: snow, scene: "gentle snowfall, snow falling around family, winter wonderland in Philippines, snowflakes, white Christmas, magical snow, cozy snow" },
  { id: "bokeh", icon: "✨", best: false, name: "Fairy Lights Magic", desc: "Dancing lights & golden bokeh", img: bokeh, scene: "thousands of fairy lights twinkling, Christmas lights dancing, bokeh lights, golden twinkling lights, magical lights, warm glow" },
  { id: "globe", icon: "🎅", best: false, name: "Santa Village Magic", desc: "Santa’s village & festive gifts", img: globe, scene: "Santa Village background, Santa Claus, reindeer, snowman, Christmas village, magical Santa workshop, gifts" },
  { id: "fire", icon: "🔥", best: false, name: "Fireplace Noche Buena Magic", desc: "Lechon, parol & fireplace warmth", img: fire, scene: "cozy fireplace, Noche Buena table with lechon, Filipino Christmas dinner, warm fireplace glow, family by fireplace, lechon, ham, queso de bola" },
] as const;

export const PLANS = [
  { id: "preview", price: 99, name: "Preview", detail: "720p with watermark", videos: 1 },
  { id: "hd", price: 149, name: "HD Magic", detail: "1080p, no watermark, 5–6 seconds", videos: 1, best: true },
  { id: "triple", price: 299, name: "Triple Pack", detail: "3 versions, same photo", videos: 3 },
  { id: "family", price: 499, name: "Family Bundle", detail: "5 videos", videos: 5 },
] as const;

export const MAX_BYTES = 10 * 1024 * 1024;
export const isAllowedPhoto = (f: { type: string; size: number }) =>
  ["image/jpeg", "image/png"].includes(f.type) && f.size <= MAX_BYTES;
