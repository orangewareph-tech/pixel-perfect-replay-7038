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
  { id: "parol", icon: "⭐", best: true, name: "Parol Star Magic", desc: "Best Seller · golden parol glow", img: parol, scene: "Colorful Filipino parol star lanterns float around the family at a safe distance and slowly complete a full rotation. Golden star dust swirls around the outer edges, parol stars pulse with warm light, fairy lights twinkle against rich Christmas bokeh. Gentle camera push-in with subtle background parallax, cinematic golden glow and restrained lens flare, vibrant festive colors, joyful Noche Buena warmth." },
  { id: "snow", icon: "❄️", best: false, name: "Snowfall Magic", desc: "Gentle snowflakes, cozy magic", img: snow, scene: "Layered snowfall drifts slowly in foreground and background, clear of faces. Diamond-sparkling snowflakes settle lightly on shoulders with natural gravity; subtle breath vapor dissipates below faces. Soft Christmas-light bokeh and volumetric light through snow create a cozy winter wonderland. Gentle camera dolly-in, realistic snow textures, luminous snow glow; preserve the original clothing rather than transforming outfits." },
  { id: "bokeh", icon: "✨", best: false, name: "Fairy Lights Magic", desc: "Dancing lights & golden bokeh", img: bokeh, scene: "Warm golden fairy lights drift like fireflies around the family, leaving delicate light trails. Lights gather into a heart-shaped halo behind the family, then gently twinkle and pulse in a steady festive rhythm. Fine fairy dust, Christmas-tree bokeh and soft golden-hour reflections create an intimate magical glow. Very slight camera arc with subtle parallax, faces remain frontal and recognizable; lights never wrap across faces or bodies." },
  { id: "globe", icon: "🎅", best: false, name: "Santa Village Magic", desc: "Santa’s village & festive gifts", img: globe, scene: "A soft magical portal glow reveals a detailed storybook Santa Village behind the unchanged family. Santa waves in the distance beside a warmly lit toy workshop; tiny elves walk and wave, a toy train moves along a background track, a reindeer nose softly glows. Chimney smoke rises over Christmas houses as gentle snow falls. A distant sleigh glides across the sky. Slow camera push-in with background parallax; all village characters remain small and behind the family." },
  { id: "fire", icon: "🔥", best: false, name: "Fireplace Noche Buena Magic", desc: "Lechon, parol & fireplace warmth", img: fire, scene: "A cozy Filipino Noche Buena setting glows behind the family: a detailed table with lechon, ham, queso de bola, bibingka and puto bumbong. Realistic fireplace flames flicker and small embers rise safely inside the hearth; gentle food steam rises from the table. Stockings hang beside a Christmas tree with gifts and twinkling fairy lights. Warm firelight softly flickers on faces, slow camera zoom-in, nostalgic family warmth; preserve the original clothing and keep the feast behind the family." },
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
