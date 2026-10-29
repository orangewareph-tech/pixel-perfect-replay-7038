import snow from "@/assets/t-snow.jpg";
import globe from "@/assets/t-globe.jpg";
import fire from "@/assets/t-fire.jpg";
import bokeh from "@/assets/t-bokeh.jpg";

export const TEMPLATES = [
  { id: "parol", icon: "⭐", best: true, name: "Parol Star Magic", desc: "Best Seller · golden parol glow", img: fire, scene: "parol star glowing bright, Filipino parol lantern, star of Bethlehem, golden glow, sparkles from parol, traditional Filipino Christmas" },
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
