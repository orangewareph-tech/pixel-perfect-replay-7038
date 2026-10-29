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
  { id: "parol", icon: "⭐", best: true, name: "Parol Star Magic", desc: "Makolor nga parol · MORE MOVEMENT · mainit nga Paskong Pinoy", img: parol, scene: "EXTREME MOVEMENT - 20+ colorful Filipino parol star lanterns in red yellow blue green RAPIDLY floating spinning rotating 360 continuously dancing swirling fast pulsing zooming orbiting like planets flying background to foreground at safe distance, golden star dust SWIRLING FAST vortex like fireflies around outer edges, parol stars pulse with warm light and ZOOM IN OUT, fairy lights TWINKLING FAST, moving bokeh BLINKING FAST, bright traveling lens flare MOVING across screen, camera RAPIDLY ZOOMING IN OUT shaking, camera ORBITING 360 fast with parallax, family SMILING MOVING slightly breathing, Noche Buena steam RISING MOVING, lights BLINKING FAST, HIGH MOTION DYNAMIC energetic continuous no static viral TikTok movement, cinematic golden glow, vibrant festive colors, joyful Noche Buena warmth, softly blurred Filipino feast behind." },
  { id: "snow", icon: "❄️", best: false, name: "Snowfall Magic", desc: "Pinoy dream snow · MORE MOVEMENT · kahayag sa parol", img: snow, scene: "EXTREME SNOW MOVEMENT - A Pinoy dream of first snowfall: HEAVY layered snowfall FALLING FAST all directions BLOWS and SWIRLS in foreground and background clear of faces, snowflakes FALLING FAST SPINNING DIAMOND-sparkling settling lightly on shoulders with natural gravity accumulating FAST, repeated breath vapor PUFFS rise and dissipate FAST below faces, soft Filipino parol-light bokeh BLINKING FAST and volumetric light through snow create cozy winter wonderland with gentle joyful wonder, foreground snow SWEEPS PAST camera FAST with dynamic parallax, camera DOLLY FAST through snow SHAKING handheld snowstorm, SHIVERING slight movement, snow BLOWING wind, HAIR and CLOTHES moving, realistic snow textures luminous snow glow, preserve original clothing." },
  { id: "bokeh", icon: "✨", best: false, name: "Fairy Lights Magic", desc: "Kahayag sa Pasko · MORE MOVEMENT · parol ug heart lights", img: bokeh, scene: "EXTREME LIGHT MOVEMENT - Warm golden Pinoy Christmas village fairy lights RAPIDLY FLOATING DANCING like fireflies SWARMING around family leaving delicate light trails, THOUSANDS lights WRAPPING UNWRAPPING continuously TWINKLING FAST to Pasko sa Nayon beat, lights gather into heart-shaped halo PULSING FAST and Filipino parol star shapes SPINNING behind family continually reforming hearts and spinning parol shapes, fine fairy dust FLOATING FAST everywhere, soft golden-hour reflections, intimate magical glow with subtle light reflections MOVING in eyes, swarming lights CHASING each other and FLYING in circles, moving bokeh adds strong parallax and BLINKING FAST, camera ORBITING FAST 360 and ZOOMING IN OUT, faces remain frontal recognizable, lights never wrap across faces." },
  { id: "globe", icon: "🎅", best: false, name: "Santa Village Magic", desc: "Santa nga naka-barong · MORE MOVEMENT · parol village", img: globe, scene: "EXTREME VILLAGE MOVEMENT - A soft Filipino parol magical portal glow SPINNING FAST reveals detailed storybook Pinoy Santa Village behind unchanged family, Santa wearing barong Tagalog WAVING FAST and WALKING towards family beside warmly lit toy workshop decorated with parols, tiny elves in barong BRISKLY WALKING FAST WAVING JUMPING and CARRYING gifts MOVING, toy train carrying Pinoy gifts RACES FAST along background track BOUNCING, reindeer TURN heads and WALK FAST while noses PULSE GLOWING, chimney smoke RISES FAST MOVING wind over Christmas houses with parol lanterns SPINNING GLOWING as gentle snow FALLS FAST, distant sleigh decorated with parol stars FLIES BRISKLY across sky TRAILING stars, rotating parol portal SPINNING FAST and strong background parallax STAY continuously animated, camera PUSH FAST parallax DOLLY through village, all village characters remain small and behind family, HIGH MOTION DYNAMIC." },
  { id: "fire", icon: "🔥", best: false, name: "Fireplace Noche Buena Magic", desc: "Noche Buena · MORE MOVEMENT · kainit sa pamilya", img: fire, scene: "EXTREME FIREPLACE MOVEMENT - A cozy Filipino Noche Buena setting glows behind family: detailed table with lechon ham queso de bola bibingka puto bumbong Pinoy spaghetti lumpia pancit, realistic fireplace flames DANCE CRACKLE FLICKER energetically FAST while bright embers SWIRL and RISE FAST safely inside hearth SPARKLING SPINNING, continuous swirling food steam RISES FAST from lechon and bibingka SWIRLING MOVING, parol-decorated stockings SWAYING slightly, Christmas tree with gifts parols and fairy lights BLINKING FAST TWINKLING, stockings SWAY gift ribbons FLUTTER subtly tree lights DANCE and warm firelight CASTS MOVING shadows FLICKERING FAST on faces, camera SLOW ZOOM slight SHAKE fire heat, family SMILING MOVING slightly breathing head nod, nostalgic Filipino family warmth, preserve original clothing and keep feast behind family, HIGH MOTION DYNAMIC cozy." },
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