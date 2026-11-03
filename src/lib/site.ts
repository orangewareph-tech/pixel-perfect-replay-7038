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
  { id: "parol", icon: "⭐", best: true, name: "Parol Star Magic", desc: "Makolor nga parol · MORE MOVEMENT · mainit nga Paskong Pinoy", img: parol, scene: "Parol-led village story: colorful Filipino parol star lanterns sway above the family, warm light pulses through capiz windows, golden star dust twinkles clear of faces. The final big glowing parol is the visual centerpiece; lantern reflections and sparkling snow surround the Noche Buena table." },
  { id: "snow", icon: "❄️", best: false, name: "Snowfall Magic", desc: "Pinoy dream snow · MORE MOVEMENT · kahayag sa parol", img: snow, scene: "Snow-led village story: heavy layered sparkling snowfall falls with gravity through the foreground and background, snowflakes settle on shoulders without covering faces, breath vapor dissipates below mouths. The family marvels at the snow; banana and coconut palms catch snow around the warm parol-lit Noche Buena table." },
  { id: "bokeh", icon: "✨", best: false, name: "Fairy Lights Magic", desc: "Kahayag sa Pasko · MORE MOVEMENT · parol ug heart lights", img: bokeh, scene: "Fairy-light-led village story: warm golden fairy lights dance like fireflies around the family without covering faces, delicate light trails form a heart behind them, parol star shapes twinkle above capiz windows. Soft bokeh and sparkling snow lead toward a luminous heart of lights above the Noche Buena table." },
  { id: "globe", icon: "🎅", best: false, name: "Santa Village Magic", desc: "Santa nga naka-barong · MORE MOVEMENT · parol village", img: globe, scene: "Santa-led village story: exactly one jolly Santa Claus in a festive barong sways beside P1 without touching, while exactly one snowman in a woven salakot waves his stick arms. Parols light the bahay kubo and sari-sari store, sparkling snow drifts over palms, and Santa joins the family beside the Noche Buena table." },
  { id: "fire", icon: "🔥", best: false, name: "Fireplace Noche Buena Magic", desc: "Noche Buena · MORE MOVEMENT · kainit sa pamilya", img: fire, scene: "Noche Buena-led village story: a safely enclosed fireplace beside the covered bahay kubo veranda has realistic dancing flames and rising embers; warm firelight illuminates the family. Food steam rises from a whole lechon, bibingka and puto bumbong, with queso de bola and pancit on the table, glowing parols above and sparkling snow outside." },
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