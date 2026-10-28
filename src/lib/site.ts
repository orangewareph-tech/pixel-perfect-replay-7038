import snow from "@/assets/t-snow.jpg";
import globe from "@/assets/t-globe.jpg";
import fire from "@/assets/t-fire.jpg";
import bokeh from "@/assets/t-bokeh.jpg";
import hat from "@/assets/t-hat.jpg";

export const TEMPLATES = [
  { id: "snow", name: "Snowfall Magic", desc: "Gentle snow over the family", img: snow, scene: "Snowfall Magic, gentle snow falling over the family" },
  { id: "globe", name: "Santa Village", desc: "Family inside a snow globe", img: globe, scene: "Santa Village, family inside a magical snow globe" },
  { id: "fire", name: "Fireplace + Parol", desc: "Noche Buena, parol & lechon", img: fire, scene: "Fireplace Warmth with Parol, Noche Buena with parol lantern, fireplace, blurred lechon" },
  { id: "bokeh", name: "Christmas Lights Bokeh", desc: "Colorful lights background", img: bokeh, scene: "Christmas Lights Bokeh, colorful lights background" },
  { id: "hat", name: "Santa Hat Fun", desc: "Everyone in Santa hats", img: hat, scene: "Santa Hat Fun, everyone wearing Santa hats" },
] as const;

export const PLANS = [
  { id: "preview", price: 99, name: "Preview", detail: "720p with watermark", videos: 1 },
  { id: "hd", price: 149, name: "HD Magic", detail: "1080p, no watermark, 6–8s", videos: 1, best: true },
  { id: "triple", price: 299, name: "Triple Pack", detail: "3 versions, same photo", videos: 3 },
  { id: "family", price: 499, name: "Family Bundle", detail: "5 videos", videos: 5 },
] as const;

export const MAX_BYTES = 10 * 1024 * 1024;
export const isAllowedPhoto = (f: { type: string; size: number }) =>
  ["image/jpeg", "image/png"].includes(f.type) && f.size <= MAX_BYTES;
