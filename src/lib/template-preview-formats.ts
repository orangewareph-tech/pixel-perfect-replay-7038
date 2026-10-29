import parol from "@/assets/parol-star-magic-sound.webm.asset.json";
import snow from "@/assets/snowfall-magic-sound.webm.asset.json";
import bokeh from "@/assets/fairy-lights-magic-sound.webm.asset.json";
import globe from "@/assets/santa-village-magic-sound.webm.asset.json";
import fire from "@/assets/fireplace-noche-buena-magic-sound.webm.asset.json";
import parolMp4 from "@/assets/parol-star-magic-sound.mp4.asset.json";
import snowMp4 from "@/assets/snowfall-magic-sound.mp4.asset.json";
import bokehMp4 from "@/assets/fairy-lights-magic-sound.mp4.asset.json";
import globeMp4 from "@/assets/santa-village-magic-sound.mp4.asset.json";
import fireMp4 from "@/assets/fireplace-noche-buena-magic-sound.mp4.asset.json";

export const TEMPLATE_WEBM = { parol: parol.url, snow: snow.url, bokeh: bokeh.url, globe: globe.url, fire: fire.url, simbang: null, crafting: null, caroling: null } as const;
export const TEMPLATE_MP4 = { parol: parolMp4.url, snow: snowMp4.url, bokeh: bokehMp4.url, globe: globeMp4.url, fire: fireMp4.url, simbang: null, crafting: null, caroling: null } as const;