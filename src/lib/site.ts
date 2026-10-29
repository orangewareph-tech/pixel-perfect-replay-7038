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
  parol: { webp: parolWebp, preview: parolPreview.url, badge: "🇵🇭 Parol Favorite", alt: "Parol Star Magic - Pinoy Christmas with glowing parol" },
  snow: { webp: snowWebp, preview: snowPreview.url, badge: "✨ Pinaka Magical", alt: "Snowfall Magic - Pinoy dream snow" },
  bokeh: { webp: bokehWebp, preview: bokehPreview.url, badge: "❤️ Pinaka Love", alt: "Fairy Lights Magic - Pinoy dancing lights and bokeh" },
  globe: { webp: globeWebp, preview: globePreview.url, badge: "🎅 Pang-Pinoy", alt: "Santa Village Magic - Santa and family" },
  fire: { webp: fireWebp, preview: firePreview.url, badge: "🇵🇭 Tatak Pinoy", alt: "Fireplace Noche Buena Magic - Family by fireplace with lechon" },
} as const;

export const TEMPLATES = [
  { id: "parol", icon: "⭐", best: true, name: "Parol Star Magic", desc: "Makolor nga parol · mainit nga Paskong Pinoy", img: parol, scene: "Red, yellow, blue and green Filipino parol star lanterns dance, orbit and float from background toward the outer foreground at a safe distance, continuously spinning through a full rotation. Golden star dust forms a lively swirling vortex like fireflies around the outer edges, parol stars pulse with warm light, fairy lights twinkle against rich Pinoy Christmas bokeh. Moving bokeh, bright traveling lens flare and strong background parallax, cinematic golden glow and restrained lens flare, vibrant festive colors, joyful Noche Buena warmth; a softly blurred Filipino feast stays in the background." },
  { id: "snow", icon: "❄️", best: false, name: "Snowfall Magic", desc: "Pinoy dream snow · kahayag sa parol", img: snow, scene: "A Pinoy dream of first snowfall: heavy layered snowfall blows and swirls in foreground and background, clear of faces. Diamond-sparkling snowflakes settle lightly on shoulders with natural gravity; repeated breath vapor puffs rise and dissipate below faces. Soft Filipino parol-light bokeh and volumetric light through snow create a cozy winter wonderland with gentle joyful wonder. Foreground snow sweeps past the camera with dynamic parallax, realistic snow textures, luminous snow glow; preserve the original clothing rather than transforming outfits." },
  { id: "bokeh", icon: "✨", best: false, name: "Fairy Lights Magic", desc: "Kahayag sa Pasko · parol ug heart lights", img: bokeh, scene: "Warm golden Pinoy Christmas village fairy lights drift like fireflies around the family, leaving delicate light trails. Lights gather into a heart-shaped halo and Filipino parol star shapes behind the family, continually reforming hearts and spinning parol shapes, twinkling and pulsing in a lively festive rhythm. Fine fairy dust, Filipino Christmas-tree and parol bokeh and soft golden-hour reflections create an intimate magical glow, with subtle light reflections in eyes. Swarming lights chase each other and moving bokeh adds strong parallax, faces remain frontal and recognizable; lights never wrap across faces or bodies." },
  { id: "globe", icon: "🎅", best: false, name: "Santa Village Magic", desc: "Santa nga naka-barong · parol village", img: globe, scene: "A soft Filipino parol magical portal glow reveals a detailed storybook Pinoy Santa Village behind the unchanged family. Santa wearing barong Tagalog waves in the distance beside a warmly lit toy workshop decorated with parols; tiny elves in barong briskly walk, wave and carry gifts, a toy train carrying Pinoy gifts races along a background track, reindeer turn their heads and walk while their noses pulse. Chimney smoke rises over Christmas houses with parol lanterns as gentle snow falls. A distant sleigh decorated with parol stars flies briskly across the sky. A rotating parol portal and strong background parallax stay continuously animated; all village characters remain small and behind the family." },
  { id: "fire", icon: "🔥", best: false, name: "Fireplace Noche Buena Magic", desc: "Noche Buena · kainit sa pamilya", img: fire, scene: "A cozy Filipino Noche Buena setting glows behind the family: a detailed table with lechon, ham, queso de bola, bibingka, puto bumbong, Pinoy spaghetti, lumpia and pancit. Realistic fireplace flames dance, crackle and flicker energetically while bright embers swirl and rise safely inside the hearth; continuous swirling food steam rises from the lechon and bibingka. Parol-decorated stockings hang beside a Christmas tree with gifts, parols and twinkling fairy lights. Stockings sway, gift ribbons flutter subtly, tree lights dance and warm firelight casts moving shadows on faces, nostalgic Filipino family warmth; preserve the original clothing and keep the feast behind the family." },
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
