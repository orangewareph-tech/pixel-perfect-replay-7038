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
import simbang from "@/assets/simbang-gabi.jpg";
import crafting from "@/assets/parol-making.jpg";
import caroling from "@/assets/pinoy-caroling.jpg";

export const TEMPLATE_MEDIA = {
  parol: { webp: parolWebp, preview: parolPreview.url, badge: "🇵🇭 Parol Favorite", alt: "Parol Star Magic - Pinoy Christmas with glowing parol" },
  snow: { webp: snowWebp, preview: snowPreview.url, badge: "✨ Pinaka Magical", alt: "Snowfall Magic - Pinoy dream snow" },
  bokeh: { webp: bokehWebp, preview: bokehPreview.url, badge: "❤️ Pinaka Love", alt: "Fairy Lights Magic - Pinoy dancing lights and bokeh" },
  globe: { webp: globeWebp, preview: globePreview.url, badge: "🎅 Pang-Pinoy", alt: "Santa Village Magic - Santa and family" },
  fire: { webp: fireWebp, preview: firePreview.url, badge: "🇵🇭 Tatak Pinoy", alt: "Fireplace Noche Buena Magic - Family by fireplace with lechon" },
  simbang: { webp: simbang, preview: null, badge: "🏆 Simbang Gabi Special", alt: "Generated Filipino family sample outside a parol-lit church at dawn" },
  crafting: { webp: crafting, preview: null, badge: "🇵🇭 Pamilyang Pinoy", alt: "Generated Filipino family sample making a colorful parol together" },
  caroling: { webp: caroling, preview: null, badge: "🎵 Pinoy Aguinaldo", alt: "Generated Filipino family sample caroling with guitar and tambourine" },
} as const;

export const TEMPLATES = [
  { id: "parol", icon: "⭐", best: true, name: "Parol Star Magic", desc: "Makolor nga parol · mainit nga Paskong Pinoy", img: parol, scene: "Red, yellow, blue and green Filipino parol star lanterns float around the family at a safe distance and slowly complete a full rotation. Golden star dust swirls like fireflies around the outer edges, parol stars pulse with warm light, fairy lights twinkle against rich Pinoy Christmas bokeh. Gentle camera push-in with subtle background parallax, cinematic golden glow and restrained lens flare, vibrant festive colors, joyful Noche Buena warmth; a softly blurred Filipino feast stays in the background." },
  { id: "snow", icon: "❄️", best: false, name: "Snowfall Magic", desc: "Pinoy dream snow · kahayag sa parol", img: snow, scene: "A Pinoy dream of first snowfall: layered snowfall drifts slowly in foreground and background, clear of faces. Diamond-sparkling snowflakes settle lightly on shoulders with natural gravity; subtle breath vapor dissipates below faces. Soft Filipino parol-light bokeh and volumetric light through snow create a cozy winter wonderland with gentle joyful wonder. Gentle camera dolly-in, realistic snow textures, luminous snow glow; preserve the original clothing rather than transforming outfits." },
  { id: "bokeh", icon: "✨", best: false, name: "Fairy Lights Magic", desc: "Kahayag sa Pasko · parol ug heart lights", img: bokeh, scene: "Warm golden Pinoy Christmas village fairy lights drift like fireflies around the family, leaving delicate light trails. Lights gather into a heart-shaped halo and Filipino parol star shapes behind the family, then gently twinkle and pulse in a steady festive rhythm. Fine fairy dust, Filipino Christmas-tree and parol bokeh and soft golden-hour reflections create an intimate magical glow, with subtle light reflections in eyes. Very slight camera arc with subtle parallax, faces remain frontal and recognizable; lights never wrap across faces or bodies." },
  { id: "globe", icon: "🎅", best: false, name: "Santa Village Magic", desc: "Santa nga naka-barong · parol village", img: globe, scene: "A soft Filipino parol magical portal glow reveals a detailed storybook Pinoy Santa Village behind the unchanged family. Santa wearing barong Tagalog waves in the distance beside a warmly lit toy workshop decorated with parols; tiny elves in barong walk and wave, a toy train carrying Pinoy gifts moves along a background track, a reindeer nose softly glows. Chimney smoke rises over Christmas houses with parol lanterns as gentle snow falls. A distant sleigh decorated with parol stars glides across the sky. Slow camera push-in with background parallax; all village characters remain small and behind the family." },
  { id: "fire", icon: "🔥", best: false, name: "Fireplace Noche Buena Magic", desc: "Noche Buena · kainit sa pamilya", img: fire, scene: "A cozy Filipino Noche Buena setting glows behind the family: a detailed table with lechon, ham, queso de bola, bibingka, puto bumbong, Pinoy spaghetti, lumpia and pancit. Realistic fireplace flames flicker and small embers rise safely inside the hearth; gentle food steam rises from the lechon and bibingka. Parol-decorated stockings hang beside a Christmas tree with gifts, parols and twinkling fairy lights. Warm firelight softly flickers on faces, slow camera zoom-in, nostalgic Filipino family warmth; preserve the original clothing and keep the feast behind the family." },
  { id: "simbang", icon: "⛪", best: false, name: "Simbang Gabi Magic", desc: "Simbahan sa kaadlawon · tradisyong Pinoy", img: simbang, scene: "The unchanged family portrait glows in a Filipino Simbang Gabi scene outside a church at dawn. Church parol lights gently brighten, star lanterns float safely above the path, morning mist drifts beneath the last visible stars. Puto bumbong and bibingka stalls outside the church release delicate steam in the background. A slow camera push-in with subtle church parallax reveals magical dawn light, tiny golden fairy dust and warm parol bokeh. Spiritual, peaceful, nostalgic Filipino Christmas togetherness; preserve the family's pose, faces and clothing, no forced walking or body transformation." },
  { id: "crafting", icon: "⭐", best: false, name: "Paskong Pinoy Parol Making", desc: "Paghimo ug parol · bonding sa pamilya", img: crafting, scene: "A Filipino bamboo-and-colored-paper parol workshop appears behind the unchanged family, celebrating making parol together. Red, yellow, blue and green completed parol lanterns gently float upward and glow, golden dust particles swirl above the crafting table, paper stars shimmer in warm cinematic light. A very slight camera arc gives workshop parallax and intimate joyful family bonding. Keep any existing hands and objects unchanged; suggest crafting through bamboo, colored paper and a finished parol on the background table rather than inventing hands or making the family change pose. Nostalgic Paskong Pinoy tradition." },
  { id: "caroling", icon: "🎵", best: false, name: "Christmas Caroling Pinoy Aguinaldo", desc: "Pang-caroling · malipayong Paskong Pinoy", img: caroling, scene: "The unchanged family portrait becomes a nostalgic Filipino Christmas caroling scene outside a parol-lit house under night stars. A guitar, homemade tambourine and small aguinaldo envelopes rest on a background bench, warm doorway light gently opens into the scene without adding foreground people. Magical music notes and golden fairy dust float behind the family, parol lights twinkle and pulse, warm cinematic Christmas bokeh. Slow camera push-in with gentle background parallax, joyful Pinoy caroling togetherness. Preserve existing hands, mouth expressions, clothing and pose; no forced singing, instrument handling or giving gestures." },
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
