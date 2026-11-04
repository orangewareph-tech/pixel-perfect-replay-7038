# MagicPh AI — Template Prompts

Generated from the live app code. Every prompt block below is the exact string the app sends.

## Provider and limits

- Provider: **Free.ai** (api.free.ai), called only from server functions. The key lives in the server-only `FREE_AI_API_KEY` secret and never reaches the browser.
- Model aliases offered: `wan-2.2`, `cogvideox`, `hunyuan`. Alias → Free.ai request ID: `wan-2.2` → `wan22-ti2v-5b`, `cogvideox` → `cogvideox`, `hunyuan` → `hunyuan-video`.
- Default model alias: `wan-2.2`.
- Durations the integration will send: **2–6 seconds**. The app's active offer is 5 seconds; the 10-second option is visible but disabled, and a 10-second request is rejected before submission.
- 10-second prompts appear below for reference only. They are not sendable under the current provider limit and are never silently shortened.
- The provider returns silent video. Music and the greeting are added by the app's own download step, so the prompt asks for no on-screen lettering.

## Shared story and identity rules

Every prompt, for every template and movement level, carries the same frame: one continuous camera glide, no cuts or crossfades, the uploaded photo as the first frame and only identity reference, people labelled P1/P2 left to right, exact faces/skin/hair/clothing/body preserved including babies, no blending or face copying, faces unobstructed, a snowy Philippine bahay kubo village with capiz windows, palms, a sari-sari store and glowing parols, no vehicles, and only the uploaded family plus exactly one Santa and exactly one snowman in a woven salakot. Human action stays gentle and ground-level: no clapping, hand-holding, hugging or touching, no face-obscuring motion blur, hands relaxed and never in close-up. These are instructions to the model, not guarantees.

## Base scenes

### Parol Star Magic (`parol`)

```text
Parol-led village story: colorful Filipino parol star lanterns sway above the family, warm light pulses through capiz windows, golden star dust twinkles clear of faces. The final big glowing parol is the visual centerpiece; lantern reflections and sparkling snow surround the Noche Buena table.
```

### Snowfall Magic (`snow`)

```text
Snow-led village story: heavy layered sparkling snowfall falls with gravity through the foreground and background, snowflakes settle on shoulders without covering faces, breath vapor dissipates below mouths. The family marvels at the snow; banana and coconut palms catch snow around the warm parol-lit Noche Buena table.
```

### Fairy Lights Magic (`bokeh`)

```text
Fairy-light-led village story: warm golden fairy lights dance like fireflies around the family without covering faces, delicate light trails form a heart behind them, parol star shapes twinkle above capiz windows. Soft bokeh and sparkling snow lead toward a luminous heart of lights above the Noche Buena table.
```

### Santa Village Magic (`globe`)

```text
Santa-led village story: exactly one jolly Santa Claus in a festive barong sways beside P1 without touching, while exactly one snowman in a woven salakot waves his stick arms. Parols light the bahay kubo and sari-sari store, sparkling snow drifts over palms, and Santa joins the family beside the Noche Buena table.
```

### Fireplace Noche Buena Magic (`fire`)

```text
Noche Buena-led village story: a safely enclosed fireplace beside the covered bahay kubo veranda has realistic dancing flames and rising embers; warm firelight illuminates the family. Food steam rises from a whole lechon, bibingka and puto bumbong, with queso de bola and pancit on the table, glowing parols above and sparkling snow outside.
```

## Movement levels

Default: **Extreme**. Strength scales the effects; human actions stay gentle and the camera stays steady at every level.

- **low**: Low movement: gentle slow realistic movement, subtle swaying and soft twinkling; a gentle continuous camera glide with slight parallax.
- **medium**: Medium movement: moderate floating, pulsing and drifting effects; a gentle continuous camera glide with natural parallax.
- **high**: High movement: lively sparkling, floating and pulsing effects; one continuous camera glide with stronger parallax. Keep human actions gentle.
- **extreme**: Extreme movement: richly animated continuous snowfall, lights and particles; one continuous camera glide with pronounced parallax. Keep sways, turns and hops gentle, faces clear and bodies realistic.

## Music direction

```text
Accompanied by joyful Filipino Christmas music, a cheerful Pasko sa Nayon melody with jingle bells, warm festive carols, cozy Noche Buena celebration music and a soft Christmas choir with bells ringing; motion and twinkling follow the musical rhythm.
```

The provider renders silent video, so this line guides the pacing of motion and twinkling. The real soundtrack is one of the app's own instrumentals (Pasko sa Nayon by default, no extra charge) mixed in at download.

## Greeting

The prompt forbids generated text because the app burns in the greeting itself: `🎄 Merry Christmas 🎄` is drawn to a transparent PNG in the browser and overlaid near the bottom during the same download step that adds the music.

## Complete prompts — sendable (5s, extreme movement)

### Parol Star Magic — 5s

```text
A 5 second photorealistic Filipino Christmas video, ONE continuous camera glide, no cuts or crossfades. Use the uploaded photo as the first frame and only customer identity reference. Label its people P1, P2 and so on left to right. Exactly those family members remain visible from first to last frame; never invent a fictional family. Preserve each person's face geometry, eyes, nose, mouth, skin tone, hair, apparent age, clothing and body proportions, including babies. Never blend, merge, swap, duplicate or beautify identities; never copy a family face onto another figure. Keep faces unobstructed and recognizable. A snowy Philippine bahay kubo village with capiz windows, banana and coconut palms, a sari-sari store and glowing parols. No vehicles anywhere. Only the uploaded family, exactly one jolly Santa Claus and exactly one snowman in a woven salakot; no neighbors, crowds or other figures. Parol-led village story: colorful Filipino parol star lanterns sway above the family, warm light pulses through capiz windows, golden star dust twinkles clear of faces. The final big glowing parol is the visual centerpiece; lantern reflections and sparkling snow surround the Noche Buena table. 0–2s: whole family marvels at sparkling snow beside the bahay kubo, Santa and snowman already visible. 2–4s: Santa sways beside P1, snowman waves; family stays together. 4–5s: everyone waves under a glowing parol beside a Noche Buena table with a whole lechon; hold the final group shot. Extreme movement: richly animated continuous snowfall, lights and particles; one continuous camera glide with pronounced parallax. Keep sways, turns and hops gentle, faces clear and bodies realistic. No orbiting, rapid zooming or camera shake. Gentle safe ground-level action; no clapping, hand-holding, hugging or touching, no face-obscuring motion blur. Hands relaxed, never in close-up. Accompanied by joyful Filipino Christmas music, a cheerful Pasko sa Nayon melody with jingle bells, warm festive carols, cozy Noche Buena celebration music and a soft Christmas choir with bells ringing; motion and twinkling follow the musical rhythm. End cleanly at 5 seconds. No generated text, brand names or logos; the app adds the Merry Christmas greeting afterward.
```

### Snowfall Magic — 5s

```text
A 5 second photorealistic Filipino Christmas video, ONE continuous camera glide, no cuts or crossfades. Use the uploaded photo as the first frame and only customer identity reference. Label its people P1, P2 and so on left to right. Exactly those family members remain visible from first to last frame; never invent a fictional family. Preserve each person's face geometry, eyes, nose, mouth, skin tone, hair, apparent age, clothing and body proportions, including babies. Never blend, merge, swap, duplicate or beautify identities; never copy a family face onto another figure. Keep faces unobstructed and recognizable. A snowy Philippine bahay kubo village with capiz windows, banana and coconut palms, a sari-sari store and glowing parols. No vehicles anywhere. Only the uploaded family, exactly one jolly Santa Claus and exactly one snowman in a woven salakot; no neighbors, crowds or other figures. Snow-led village story: heavy layered sparkling snowfall falls with gravity through the foreground and background, snowflakes settle on shoulders without covering faces, breath vapor dissipates below mouths. The family marvels at the snow; banana and coconut palms catch snow around the warm parol-lit Noche Buena table. 0–2s: whole family marvels at sparkling snow beside the bahay kubo, Santa and snowman already visible. 2–4s: Santa sways beside P1, snowman waves; family stays together. 4–5s: everyone waves under a glowing parol beside a Noche Buena table with a whole lechon; hold the final group shot. Extreme movement: richly animated continuous snowfall, lights and particles; one continuous camera glide with pronounced parallax. Keep sways, turns and hops gentle, faces clear and bodies realistic. No orbiting, rapid zooming or camera shake. Gentle safe ground-level action; no clapping, hand-holding, hugging or touching, no face-obscuring motion blur. Hands relaxed, never in close-up. Accompanied by joyful Filipino Christmas music, a cheerful Pasko sa Nayon melody with jingle bells, warm festive carols, cozy Noche Buena celebration music and a soft Christmas choir with bells ringing; motion and twinkling follow the musical rhythm. End cleanly at 5 seconds. No generated text, brand names or logos; the app adds the Merry Christmas greeting afterward.
```

### Fairy Lights Magic — 5s

```text
A 5 second photorealistic Filipino Christmas video, ONE continuous camera glide, no cuts or crossfades. Use the uploaded photo as the first frame and only customer identity reference. Label its people P1, P2 and so on left to right. Exactly those family members remain visible from first to last frame; never invent a fictional family. Preserve each person's face geometry, eyes, nose, mouth, skin tone, hair, apparent age, clothing and body proportions, including babies. Never blend, merge, swap, duplicate or beautify identities; never copy a family face onto another figure. Keep faces unobstructed and recognizable. A snowy Philippine bahay kubo village with capiz windows, banana and coconut palms, a sari-sari store and glowing parols. No vehicles anywhere. Only the uploaded family, exactly one jolly Santa Claus and exactly one snowman in a woven salakot; no neighbors, crowds or other figures. Fairy-light-led village story: warm golden fairy lights dance like fireflies around the family without covering faces, delicate light trails form a heart behind them, parol star shapes twinkle above capiz windows. Soft bokeh and sparkling snow lead toward a luminous heart of lights above the Noche Buena table. 0–2s: whole family marvels at sparkling snow beside the bahay kubo, Santa and snowman already visible. 2–4s: Santa sways beside P1, snowman waves; family stays together. 4–5s: everyone waves under a glowing parol beside a Noche Buena table with a whole lechon; hold the final group shot. Extreme movement: richly animated continuous snowfall, lights and particles; one continuous camera glide with pronounced parallax. Keep sways, turns and hops gentle, faces clear and bodies realistic. No orbiting, rapid zooming or camera shake. Gentle safe ground-level action; no clapping, hand-holding, hugging or touching, no face-obscuring motion blur. Hands relaxed, never in close-up. Accompanied by joyful Filipino Christmas music, a cheerful Pasko sa Nayon melody with jingle bells, warm festive carols, cozy Noche Buena celebration music and a soft Christmas choir with bells ringing; motion and twinkling follow the musical rhythm. End cleanly at 5 seconds. No generated text, brand names or logos; the app adds the Merry Christmas greeting afterward.
```

### Santa Village Magic — 5s

```text
A 5 second photorealistic Filipino Christmas video, ONE continuous camera glide, no cuts or crossfades. Use the uploaded photo as the first frame and only customer identity reference. Label its people P1, P2 and so on left to right. Exactly those family members remain visible from first to last frame; never invent a fictional family. Preserve each person's face geometry, eyes, nose, mouth, skin tone, hair, apparent age, clothing and body proportions, including babies. Never blend, merge, swap, duplicate or beautify identities; never copy a family face onto another figure. Keep faces unobstructed and recognizable. A snowy Philippine bahay kubo village with capiz windows, banana and coconut palms, a sari-sari store and glowing parols. No vehicles anywhere. Only the uploaded family, exactly one jolly Santa Claus and exactly one snowman in a woven salakot; no neighbors, crowds or other figures. Santa-led village story: exactly one jolly Santa Claus in a festive barong sways beside P1 without touching, while exactly one snowman in a woven salakot waves his stick arms. Parols light the bahay kubo and sari-sari store, sparkling snow drifts over palms, and Santa joins the family beside the Noche Buena table. 0–2s: whole family marvels at sparkling snow beside the bahay kubo, Santa and snowman already visible. 2–4s: Santa sways beside P1, snowman waves; family stays together. 4–5s: everyone waves under a glowing parol beside a Noche Buena table with a whole lechon; hold the final group shot. Extreme movement: richly animated continuous snowfall, lights and particles; one continuous camera glide with pronounced parallax. Keep sways, turns and hops gentle, faces clear and bodies realistic. No orbiting, rapid zooming or camera shake. Gentle safe ground-level action; no clapping, hand-holding, hugging or touching, no face-obscuring motion blur. Hands relaxed, never in close-up. Accompanied by joyful Filipino Christmas music, a cheerful Pasko sa Nayon melody with jingle bells, warm festive carols, cozy Noche Buena celebration music and a soft Christmas choir with bells ringing; motion and twinkling follow the musical rhythm. End cleanly at 5 seconds. No generated text, brand names or logos; the app adds the Merry Christmas greeting afterward.
```

### Fireplace Noche Buena Magic — 5s

```text
A 5 second photorealistic Filipino Christmas video, ONE continuous camera glide, no cuts or crossfades. Use the uploaded photo as the first frame and only customer identity reference. Label its people P1, P2 and so on left to right. Exactly those family members remain visible from first to last frame; never invent a fictional family. Preserve each person's face geometry, eyes, nose, mouth, skin tone, hair, apparent age, clothing and body proportions, including babies. Never blend, merge, swap, duplicate or beautify identities; never copy a family face onto another figure. Keep faces unobstructed and recognizable. A snowy Philippine bahay kubo village with capiz windows, banana and coconut palms, a sari-sari store and glowing parols. No vehicles anywhere. Only the uploaded family, exactly one jolly Santa Claus and exactly one snowman in a woven salakot; no neighbors, crowds or other figures. Noche Buena-led village story: a safely enclosed fireplace beside the covered bahay kubo veranda has realistic dancing flames and rising embers; warm firelight illuminates the family. Food steam rises from a whole lechon, bibingka and puto bumbong, with queso de bola and pancit on the table, glowing parols above and sparkling snow outside. 0–2s: whole family marvels at sparkling snow beside the bahay kubo, Santa and snowman already visible. 2–4s: Santa sways beside P1, snowman waves; family stays together. 4–5s: everyone waves under a glowing parol beside a Noche Buena table with a whole lechon; hold the final group shot. Extreme movement: richly animated continuous snowfall, lights and particles; one continuous camera glide with pronounced parallax. Keep sways, turns and hops gentle, faces clear and bodies realistic. No orbiting, rapid zooming or camera shake. Gentle safe ground-level action; no clapping, hand-holding, hugging or touching, no face-obscuring motion blur. Hands relaxed, never in close-up. Accompanied by joyful Filipino Christmas music, a cheerful Pasko sa Nayon melody with jingle bells, warm festive carols, cozy Noche Buena celebration music and a soft Christmas choir with bells ringing; motion and twinkling follow the musical rhythm. End cleanly at 5 seconds. No generated text, brand names or logos; the app adds the Merry Christmas greeting afterward.
```

## Complete prompts — reference only (10s, extreme movement)

These exceed the integration's 2–6 second ceiling and are rejected before submission. Kept so the wording survives if the provider window widens.

### Parol Star Magic — 10s

```text
A 10 second photorealistic Filipino Christmas video, ONE continuous camera glide, no cuts or crossfades. Use the uploaded photo as the first frame and only customer identity reference. Label its people P1, P2 and so on left to right. Exactly those family members remain visible from first to last frame; never invent a fictional family. Preserve each person's face geometry, eyes, nose, mouth, skin tone, hair, apparent age, clothing and body proportions, including babies. Never blend, merge, swap, duplicate or beautify identities; never copy a family face onto another figure. Keep faces unobstructed and recognizable. A snowy Philippine bahay kubo village with capiz windows, banana and coconut palms, a sari-sari store and glowing parols. No vehicles anywhere. Only the uploaded family, exactly one jolly Santa Claus and exactly one snowman in a woven salakot; no neighbors, crowds or other figures. Parol-led village story: colorful Filipino parol star lanterns sway above the family, warm light pulses through capiz windows, golden star dust twinkles clear of faces. The final big glowing parol is the visual centerpiece; lantern reflections and sparkling snow surround the Noche Buena table. 0–2s: whole family at an open bahay kubo window marveling at snow, Santa and snowman visible outside. 2–4s: family steps outside together; toddlers, if present, reach for snowflakes. 4–6s: Santa and P1 sway and turn independently. 6–8s: snowman hops and waves beside P2, if present, who copies without touching. 8–10s: everyone waves under a big glowing parol beside a Noche Buena table with a whole lechon; hold the final group shot. Extreme movement: richly animated continuous snowfall, lights and particles; one continuous camera glide with pronounced parallax. Keep sways, turns and hops gentle, faces clear and bodies realistic. No orbiting, rapid zooming or camera shake. Gentle safe ground-level action; no clapping, hand-holding, hugging or touching, no face-obscuring motion blur. Hands relaxed, never in close-up. Accompanied by joyful Filipino Christmas music, a cheerful Pasko sa Nayon melody with jingle bells, warm festive carols, cozy Noche Buena celebration music and a soft Christmas choir with bells ringing; motion and twinkling follow the musical rhythm. End cleanly at 10 seconds. No generated text, brand names or logos; the app adds the Merry Christmas greeting afterward.
```

### Snowfall Magic — 10s

```text
A 10 second photorealistic Filipino Christmas video, ONE continuous camera glide, no cuts or crossfades. Use the uploaded photo as the first frame and only customer identity reference. Label its people P1, P2 and so on left to right. Exactly those family members remain visible from first to last frame; never invent a fictional family. Preserve each person's face geometry, eyes, nose, mouth, skin tone, hair, apparent age, clothing and body proportions, including babies. Never blend, merge, swap, duplicate or beautify identities; never copy a family face onto another figure. Keep faces unobstructed and recognizable. A snowy Philippine bahay kubo village with capiz windows, banana and coconut palms, a sari-sari store and glowing parols. No vehicles anywhere. Only the uploaded family, exactly one jolly Santa Claus and exactly one snowman in a woven salakot; no neighbors, crowds or other figures. Snow-led village story: heavy layered sparkling snowfall falls with gravity through the foreground and background, snowflakes settle on shoulders without covering faces, breath vapor dissipates below mouths. The family marvels at the snow; banana and coconut palms catch snow around the warm parol-lit Noche Buena table. 0–2s: whole family at an open bahay kubo window marveling at snow, Santa and snowman visible outside. 2–4s: family steps outside together; toddlers, if present, reach for snowflakes. 4–6s: Santa and P1 sway and turn independently. 6–8s: snowman hops and waves beside P2, if present, who copies without touching. 8–10s: everyone waves under a big glowing parol beside a Noche Buena table with a whole lechon; hold the final group shot. Extreme movement: richly animated continuous snowfall, lights and particles; one continuous camera glide with pronounced parallax. Keep sways, turns and hops gentle, faces clear and bodies realistic. No orbiting, rapid zooming or camera shake. Gentle safe ground-level action; no clapping, hand-holding, hugging or touching, no face-obscuring motion blur. Hands relaxed, never in close-up. Accompanied by joyful Filipino Christmas music, a cheerful Pasko sa Nayon melody with jingle bells, warm festive carols, cozy Noche Buena celebration music and a soft Christmas choir with bells ringing; motion and twinkling follow the musical rhythm. End cleanly at 10 seconds. No generated text, brand names or logos; the app adds the Merry Christmas greeting afterward.
```

### Fairy Lights Magic — 10s

```text
A 10 second photorealistic Filipino Christmas video, ONE continuous camera glide, no cuts or crossfades. Use the uploaded photo as the first frame and only customer identity reference. Label its people P1, P2 and so on left to right. Exactly those family members remain visible from first to last frame; never invent a fictional family. Preserve each person's face geometry, eyes, nose, mouth, skin tone, hair, apparent age, clothing and body proportions, including babies. Never blend, merge, swap, duplicate or beautify identities; never copy a family face onto another figure. Keep faces unobstructed and recognizable. A snowy Philippine bahay kubo village with capiz windows, banana and coconut palms, a sari-sari store and glowing parols. No vehicles anywhere. Only the uploaded family, exactly one jolly Santa Claus and exactly one snowman in a woven salakot; no neighbors, crowds or other figures. Fairy-light-led village story: warm golden fairy lights dance like fireflies around the family without covering faces, delicate light trails form a heart behind them, parol star shapes twinkle above capiz windows. Soft bokeh and sparkling snow lead toward a luminous heart of lights above the Noche Buena table. 0–2s: whole family at an open bahay kubo window marveling at snow, Santa and snowman visible outside. 2–4s: family steps outside together; toddlers, if present, reach for snowflakes. 4–6s: Santa and P1 sway and turn independently. 6–8s: snowman hops and waves beside P2, if present, who copies without touching. 8–10s: everyone waves under a big glowing parol beside a Noche Buena table with a whole lechon; hold the final group shot. Extreme movement: richly animated continuous snowfall, lights and particles; one continuous camera glide with pronounced parallax. Keep sways, turns and hops gentle, faces clear and bodies realistic. No orbiting, rapid zooming or camera shake. Gentle safe ground-level action; no clapping, hand-holding, hugging or touching, no face-obscuring motion blur. Hands relaxed, never in close-up. Accompanied by joyful Filipino Christmas music, a cheerful Pasko sa Nayon melody with jingle bells, warm festive carols, cozy Noche Buena celebration music and a soft Christmas choir with bells ringing; motion and twinkling follow the musical rhythm. End cleanly at 10 seconds. No generated text, brand names or logos; the app adds the Merry Christmas greeting afterward.
```

### Santa Village Magic — 10s

```text
A 10 second photorealistic Filipino Christmas video, ONE continuous camera glide, no cuts or crossfades. Use the uploaded photo as the first frame and only customer identity reference. Label its people P1, P2 and so on left to right. Exactly those family members remain visible from first to last frame; never invent a fictional family. Preserve each person's face geometry, eyes, nose, mouth, skin tone, hair, apparent age, clothing and body proportions, including babies. Never blend, merge, swap, duplicate or beautify identities; never copy a family face onto another figure. Keep faces unobstructed and recognizable. A snowy Philippine bahay kubo village with capiz windows, banana and coconut palms, a sari-sari store and glowing parols. No vehicles anywhere. Only the uploaded family, exactly one jolly Santa Claus and exactly one snowman in a woven salakot; no neighbors, crowds or other figures. Santa-led village story: exactly one jolly Santa Claus in a festive barong sways beside P1 without touching, while exactly one snowman in a woven salakot waves his stick arms. Parols light the bahay kubo and sari-sari store, sparkling snow drifts over palms, and Santa joins the family beside the Noche Buena table. 0–2s: whole family at an open bahay kubo window marveling at snow, Santa and snowman visible outside. 2–4s: family steps outside together; toddlers, if present, reach for snowflakes. 4–6s: Santa and P1 sway and turn independently. 6–8s: snowman hops and waves beside P2, if present, who copies without touching. 8–10s: everyone waves under a big glowing parol beside a Noche Buena table with a whole lechon; hold the final group shot. Extreme movement: richly animated continuous snowfall, lights and particles; one continuous camera glide with pronounced parallax. Keep sways, turns and hops gentle, faces clear and bodies realistic. No orbiting, rapid zooming or camera shake. Gentle safe ground-level action; no clapping, hand-holding, hugging or touching, no face-obscuring motion blur. Hands relaxed, never in close-up. Accompanied by joyful Filipino Christmas music, a cheerful Pasko sa Nayon melody with jingle bells, warm festive carols, cozy Noche Buena celebration music and a soft Christmas choir with bells ringing; motion and twinkling follow the musical rhythm. End cleanly at 10 seconds. No generated text, brand names or logos; the app adds the Merry Christmas greeting afterward.
```

### Fireplace Noche Buena Magic — 10s

```text
A 10 second photorealistic Filipino Christmas video, ONE continuous camera glide, no cuts or crossfades. Use the uploaded photo as the first frame and only customer identity reference. Label its people P1, P2 and so on left to right. Exactly those family members remain visible from first to last frame; never invent a fictional family. Preserve each person's face geometry, eyes, nose, mouth, skin tone, hair, apparent age, clothing and body proportions, including babies. Never blend, merge, swap, duplicate or beautify identities; never copy a family face onto another figure. Keep faces unobstructed and recognizable. A snowy Philippine bahay kubo village with capiz windows, banana and coconut palms, a sari-sari store and glowing parols. No vehicles anywhere. Only the uploaded family, exactly one jolly Santa Claus and exactly one snowman in a woven salakot; no neighbors, crowds or other figures. Noche Buena-led village story: a safely enclosed fireplace beside the covered bahay kubo veranda has realistic dancing flames and rising embers; warm firelight illuminates the family. Food steam rises from a whole lechon, bibingka and puto bumbong, with queso de bola and pancit on the table, glowing parols above and sparkling snow outside. 0–2s: whole family at an open bahay kubo window marveling at snow, Santa and snowman visible outside. 2–4s: family steps outside together; toddlers, if present, reach for snowflakes. 4–6s: Santa and P1 sway and turn independently. 6–8s: snowman hops and waves beside P2, if present, who copies without touching. 8–10s: everyone waves under a big glowing parol beside a Noche Buena table with a whole lechon; hold the final group shot. Extreme movement: richly animated continuous snowfall, lights and particles; one continuous camera glide with pronounced parallax. Keep sways, turns and hops gentle, faces clear and bodies realistic. No orbiting, rapid zooming or camera shake. Gentle safe ground-level action; no clapping, hand-holding, hugging or touching, no face-obscuring motion blur. Hands relaxed, never in close-up. Accompanied by joyful Filipino Christmas music, a cheerful Pasko sa Nayon melody with jingle bells, warm festive carols, cozy Noche Buena celebration music and a soft Christmas choir with bells ringing; motion and twinkling follow the musical rhythm. End cleanly at 10 seconds. No generated text, brand names or logos; the app adds the Merry Christmas greeting afterward.
```

## Negative prompt (every template, duration and level)

```text
blurred faces, face change, different faces, distorted faces, face morphing, face swapping, merged baby, duplicated people, extra children, background people, crowds, vehicles, body distortion, changed ethnicity, outfit transformation, extra limbs, warped hands, obscured faces, hand-holding, hugging, touching, clapping, unsafe action, scary, horror, low quality, blurry, deformed, cartoon, unnatural motion, flickering, strobing lights, abrupt scene changes, hard cuts, crossfades, camera shake, camera rotation, orbiting, rapid zoom, text, logo, watermark
```

## Prompt lengths

Longest sendable prompt: **2294** characters (fire, 5s, extreme). Provider ceiling: 2500.

| Template | Duration | Movement | Characters | Sendable |
| --- | --- | --- | --- | --- |
| parol | 5s | low | 2183 | yes |
| parol | 5s | medium | 2169 | yes |
| parol | 5s | high | 2189 | yes |
| parol | 5s | extreme | 2247 | yes |
| parol | 10s | low | 2332 | no — over 6s |
| parol | 10s | medium | 2318 | no — over 6s |
| parol | 10s | high | 2338 | no — over 6s |
| parol | 10s | extreme | 2396 | no — over 6s |
| snow | 5s | low | 2209 | yes |
| snow | 5s | medium | 2195 | yes |
| snow | 5s | high | 2215 | yes |
| snow | 5s | extreme | 2273 | yes |
| snow | 10s | low | 2358 | no — over 6s |
| snow | 10s | medium | 2344 | no — over 6s |
| snow | 10s | high | 2364 | no — over 6s |
| snow | 10s | extreme | 2422 | no — over 6s |
| bokeh | 5s | low | 2200 | yes |
| bokeh | 5s | medium | 2186 | yes |
| bokeh | 5s | high | 2206 | yes |
| bokeh | 5s | extreme | 2264 | yes |
| bokeh | 10s | low | 2349 | no — over 6s |
| bokeh | 10s | medium | 2335 | no — over 6s |
| bokeh | 10s | high | 2355 | no — over 6s |
| bokeh | 10s | extreme | 2413 | no — over 6s |
| globe | 5s | low | 2204 | yes |
| globe | 5s | medium | 2190 | yes |
| globe | 5s | high | 2210 | yes |
| globe | 5s | extreme | 2268 | yes |
| globe | 10s | low | 2353 | no — over 6s |
| globe | 10s | medium | 2339 | no — over 6s |
| globe | 10s | high | 2359 | no — over 6s |
| globe | 10s | extreme | 2417 | no — over 6s |
| fire | 5s | low | 2230 | yes |
| fire | 5s | medium | 2216 | yes |
| fire | 5s | high | 2236 | yes |
| fire | 5s | extreme | 2294 | yes |
| fire | 10s | low | 2379 | no — over 6s |
| fire | 10s | medium | 2365 | no — over 6s |
| fire | 10s | high | 2385 | no — over 6s |
| fire | 10s | extreme | 2443 | no — over 6s |

## Price and cost notes

Customer pricing comes from `DURATION_OFFERS`: 5s ₱149 (was ₱299), 10s ₱299. The internal cost figures in that table are conservative legacy reservations from the previous provider, not verified Free.ai charges, and are used only for the administrator budget — never shown to customers.
