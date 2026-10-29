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
  { id: "parol", icon: "⭐", best: true, name: "Parol Star Magic", desc: "Makolor nga parol · MORE MOVEMENT · mainit nga Paskong Pinoy", img: parol, scene: "20+ colorful Filipino parol star lanterns in red yellow blue green floating at safe distance, golden star dust around outer edges, parol stars with warm light, fairy lights twinkling, moving bokeh, traveling lens flare, family smiling, Noche Buena steam rising, cinematic golden glow, vibrant festive colors, joyful Noche Buena warmth, softly blurred Filipino feast behind." },
  { id: "snow", icon: "❄️", best: false, name: "Snowfall Magic", desc: "Pinoy dream snow · MORE MOVEMENT · kahayag sa parol", img: snow, scene: "A Pinoy dream of first snowfall: heavy layered snowfall falling in foreground and background clear of faces, snowflakes sparkling settling lightly on shoulders with natural gravity accumulating, breath vapor puffs rise and dissipate below faces, soft Filipino parol-light bokeh and volumetric light through snow create cozy winter wonderland with gentle joyful wonder, foreground snow sweeps past camera with dynamic parallax, realistic snow textures luminous snow glow, preserve original clothing." },
  { id: "bokeh", icon: "✨", best: false, name: "Fairy Lights Magic", desc: "Kahayag sa Pasko · MORE MOVEMENT · parol ug heart lights", img: bokeh, scene: "Warm golden Pinoy Christmas village fairy lights floating dancing like fireflies around family leaving delicate light trails, thousands of lights wrapping and unwrapping continuously twinkling to Pasko sa Nayon beat, lights gather into heart-shaped halo pulsing and Filipino parol star shapes behind family continually reforming hearts and parol shapes, fine fairy dust floating everywhere, soft golden-hour reflections, intimate magical glow with subtle light reflections in eyes, moving bokeh adds strong parallax, faces remain frontal recognizable, lights never wrap across faces." },
  { id: "globe", icon: "🎅", best: false, name: "Santa Village Magic", desc: "Santa nga naka-barong · MORE MOVEMENT · parol village", img: globe, scene: "A soft Filipino parol magical portal glow reveals detailed storybook Pinoy Santa Village behind unchanged family, Santa wearing barong Tagalog waving and walking towards family beside warmly lit toy workshop decorated with parols, tiny elves in barong walking waving jumping and carrying gifts, toy train carrying Pinoy gifts along background track, reindeer turn heads and walk while noses pulse glowing, chimney smoke rises in the wind over Christmas houses with parol lanterns glowing as gentle snow falls, distant sleigh decorated with parol stars flies across sky trailing stars, rotating parol portal and strong background parallax stay animated, camera push-in dolly parallax through village, all village characters remain small and behind family." },
  { id: "fire", icon: "🔥", best: false, name: "Fireplace Noche Buena Magic", desc: "Noche Buena · MORE MOVEMENT · kainit sa pamilya", img: fire, scene: "A cozy Filipino Noche Buena setting glows behind family: detailed table with lechon, ham, queso de bola, bibingka, puto bumbong, Pinoy spaghetti, lumpia and pancit, realistic fireplace flames dance inside hearth while bright embers swirl and rise safely inside hearth sparkling, continuous food steam rises from lechon and bibingka, parol-decorated stockings swaying slightly, Christmas tree with gifts, parols and fairy lights twinkling, gift ribbons flutter subtly, tree lights dance and warm firelight casts moving shadows flickering on faces, family smiling with slight breathing and head nods, nostalgic Filipino family warmth, preserve original clothing and keep feast behind family, cozy." },
] as const;

export const PLANS = [
  { id: "preview", price: 99, name: "Preview", detail: "720p with watermark", videos: 1 },
  { id: "hd", price: 149, name: "HD Magic", detail: "1080p, no watermark, 5-6 seconds", videos: 1, best: true },
  { id: "triple", price: 299, name: "Triple Pack", detail: "3 versions, same photo", videos: 3 },
  { id: "family", price: 499, name: "Family Bundle", detail: "5 videos", videos: 5 },
] as const;

export const MAX_BYTES = 10 * 1024 * 1024;
export const isAllowedPhoto = (f: { type: string; size: number }) =>
  ["image/jpeg", "image/png"].includes(f.type) && f.size <= MAX_BYTES;