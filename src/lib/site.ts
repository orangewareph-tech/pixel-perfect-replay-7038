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
  { id: "parol", icon: "⭐", best: true, name: "Parol Star Magic", desc: "Makolor nga parol · MORE MOVEMENT · mainit nga Paskong Pinoy", img: parol, scene: "Background transforms into a Filipino Christmas celebration with more than 20 colorful parol star lanterns in red, gold, yellow, blue and green glowing with warm realistic light at different depths behind the family. Parols float, rotate naturally and shimmer; golden star particles drift through the air, tiny sparkles appear around the lanterns, fairy lights twinkle, light reflections move across the scene and rich cinematic bokeh adds depth. A softly blurred Noche Buena feast glows behind with natural steam rising. Detailed parol craftsmanship, vibrant Filipino colors, parols and particles stay animated through the final frame." },
  { id: "snow", icon: "❄️", best: false, name: "Snowfall Magic", desc: "Pinoy dream snow · MORE MOVEMENT · kahayag sa parol", img: snow, scene: "Environment becomes a Filipino-inspired winter wonderland: realistic snow falls at multiple depths from the first moment, large detailed snowflakes pass through the foreground while smaller flakes drift far behind, tumbling with natural gravity and a gentle breeze. Warm glowing parols and soft Christmas lights shine through the snow with volumetric light scattering, contrasting cool snow with cozy golden light. A light dusting of snow gathers subtly on background surfaces and shoulders, natural breath vapor appears below faces, snow never covers faces, original clothing kept. Snowfall continues through the final frame." },
  { id: "bokeh", icon: "✨", best: false, name: "Fairy Lights Magic", desc: "Kahayag sa Pasko · MORE MOVEMENT · parol ug heart lights", img: bokeh, scene: "Thousands of warm golden fairy lights float like tiny glowing fireflies at different depths around the family, twinkling independently and leaving short delicate light trails; groups of lights flow in smooth curved paths with golden particles and shifting bokeh parallax. Behind the family the lights organize into heart-shaped halos and Filipino parol star patterns that glow, pulse gently, dissolve into particles and reform, staying in the background and outer edges. Light changes smoothly without harsh flashes, effects stay away from eyes, nose and mouth, and the lights keep moving through the final frame." },
  { id: "globe", icon: "🎅", best: false, name: "Santa Village Magic", desc: "Santa nga naka-barong · MORE MOVEMENT · parol village", img: globe, scene: "A warm glowing Filipino parol portal behind the family gradually reveals a storybook Christmas village: charming houses, a toy workshop with colorful parols, lit windows, festive trees and gentle snowfall. Santa Claus in a barong Tagalog smiles and waves in the background, small friendly elves carry wrapped gifts, a toy train with colorful gifts travels along a track behind the family, reindeer turn their heads with softly glowing noses, chimney smoke rises above the houses, and a distant sleigh with glowing parol stars crosses the sky trailing golden particles. All village characters stay small and behind the family; the village keeps moving through the final frame." },
  { id: "fire", icon: "🔥", best: false, name: "Fireplace Noche Buena Magic", desc: "Noche Buena · MORE MOVEMENT · kainit sa pamilya", img: fire, scene: "Background becomes a Filipino Noche Buena celebration: a warm fireplace with naturally flickering flames and embers rising inside the hearth casts gentle moving shadows, beside Christmas stockings, colorful parols, fairy lights and a Christmas tree with wrapped gifts. A feast table behind the family holds lechon, Christmas ham, queso de bola, bibingka, puto bumbong, Filipino spaghetti, lumpia and pancit with realistic textures; soft steam rises from bibingka and lechon. Tree lights twinkle, ribbons and stockings sway slightly. Food never covers people, no excessive flames, and the cozy glow continues through the final frame." },
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