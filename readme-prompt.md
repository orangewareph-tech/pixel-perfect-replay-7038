# MagicPh AI — Template Prompts

Model: `fal-ai/kling-video/v2.5-turbo/pro/image-to-video` (5s ≈ $0.35, 10s ≈ $0.70).

This file is generated from the live code — `src/lib/site.ts`, `src/lib/video-movement.ts` and
`src/lib/video-duration.ts` — so every string below is exactly what the app sends.

## Structure

Final prompt = **5s/10s pacing** + **template scene (realistic motion that fits it)** + **movement level** (slider, default
extreme) + **Christmas music line (always added)** + **camera rule** + **identity rules**. The negative prompt is sent separately.

Scenes carry no speed words at all. Only the movement slider sets speed, so Low really does look
gentle and Extreme looks highly dynamic but still realistic. Camera shake is always blocked; fast zoom and orbiting
are only allowed at High/Extreme.

## Base scenes


### Parol Star Magic (`parol`)
```text
20+ colorful Filipino parol star lanterns in red, yellow, blue and green gently floating and swaying naturally like hanging lanterns in a breeze at a safe distance, each parol slowly pulsing with warm golden light, golden star dust drifting and twinkling like fireflies around the outer edges, fairy lights twinkling naturally, family smiling with subtle natural breathing movement, Noche Buena steam rising naturally, soft bokeh blinking, warm lens flare drifting slowly.
```

### Snowfall Magic (`snow`)
```text
Heavy layered snowfall falling naturally with gravity in the foreground and background, clear of faces, snowflakes spinning gently, sparkling and settling lightly on shoulders, breath vapor puffs rising and dissipating naturally below faces in cold air, soft Filipino parol-light bokeh glowing, foreground snow drifting past the camera with gentle parallax, person shivering slightly with natural cold movement, hair and clothes moving slightly in the wind, realistic snow textures with a luminous glow.
```

### Fairy Lights Magic (`bokeh`)
```text
Warm golden Pinoy Christmas village fairy lights floating and dancing naturally like fireflies around the family, leaving soft delicate light trails, thousands of lights wrapping and unwrapping while twinkling to a Christmas beat, lights gathering into a heart-shaped halo pulsing warmly and Filipino parol star shapes forming behind the family, continually reforming, fine fairy dust floating naturally, soft golden-hour reflections moving in the eyes, bokeh adding gentle parallax.
```

### Santa Village Magic (`globe`)
```text
A soft Filipino parol portal glow reveals a detailed storybook Pinoy Santa Village behind the unchanged family: Santa in a barong Tagalog waving and walking slowly toward the family beside a warmly lit toy workshop decorated with parols, tiny elves in barong walking, waving and carrying gifts, a toy train carrying gifts along a background track, reindeer turning their heads and walking with glowing noses, chimney smoke rising over parol-lit houses as gentle snow falls, a distant parol-decorated sleigh flying across the sky trailing stars, background parallax staying animated.
```

### Fireplace Noche Buena Magic (`fire`)
```text
A cozy Filipino Noche Buena setting glows behind the family: a table with lechon, ham, queso de bola, bibingka, puto bumbong, Pinoy spaghetti, lumpia and pancit, realistic fireplace flames dancing and crackling while bright embers swirl and rise safely inside the hearth, food steam rising from the lechon and bibingka, parol-decorated stockings swaying in warm air, a Christmas tree with gifts, parols and twinkling fairy lights, gift ribbons fluttering subtly, warm firelight casting flickering shadows on faces, family smiling with natural breathing and a slight head nod, nostalgic Filipino family warmth.
```

## Movement levels

Only one of these is inserted, chosen by the slider. Default: **extreme**.


- **low**: Low movement: gentle slow realistic movement, subtle natural floating and swaying, soft twinkling, slow camera push with slight parallax, calm peaceful Christmas atmosphere, minimal motion.

- **medium**: Medium movement: moderate realistic movement, natural floating and pulsing, gentle swirling and drifting, soft twinkling, moderate parallax dolly, warm joyful movement.

- **high**: High movement: energetic realistic movement, dynamic floating, dancing and pulsing that fits the template, lively swirling, bright twinkling, strong parallax, dolly with gentle zoom in and out, festive energy.

- **extreme**: Extreme movement: highly dynamic realistic movement that fits the template, effects floating, pulsing, swirling and dancing energetically, characters and particles in continuous motion, fast camera dolly through the scene with parallax, gentle zoom in and out and a smooth slow orbit, high-motion continuous viral TikTok energy with no static moments, still realistic and fitting.


## Christmas music (added to every prompt)

```text
Accompanied by joyful Filipino Christmas music, a cheerful Pasko sa Nayon melody with jingle bells, warm festive carols, cozy Noche Buena celebration music and a soft Christmas choir with bells ringing; motion and twinkling follow the musical rhythm.
```

Kling renders video only, so this mainly makes motion follow a musical rhythm; the app's own soundtrack is still added to downloads.

## Full examples


### 10s, Low — Parol Star Magic

**Prompt** (1489 chars)
```text
A 10 second cinematic Christmas video in one continuous shot that builds gently from start to finish. Use the uploaded photo as the starting frame and animate the existing scene; do not replace the people or create a new image. 20+ colorful Filipino parol star lanterns in red, yellow, blue and green gently floating and swaying naturally like hanging lanterns in a breeze at a safe distance, each parol slowly pulsing with warm golden light, golden star dust drifting and twinkling like fireflies around the outer edges, fairy lights twinkling naturally, family smiling with subtle natural breathing movement, Noche Buena steam rising naturally, soft bokeh blinking, warm lens flare drifting slowly. Low movement: gentle slow realistic movement, subtle natural floating and swaying, soft twinkling, slow camera push with slight parallax, calm peaceful Christmas atmosphere, minimal motion. Accompanied by joyful Filipino Christmas music, a cheerful Pasko sa Nayon melody with jingle bells, warm festive carols, cozy Noche Buena celebration music and a soft Christmas choir with bells ringing; motion and twinkling follow the musical rhythm. One primary animation with subtle secondary effects. Steady camera: no orbiting, rapid zooming or camera shake. Natural movement, realistic lighting, smooth animation. Preserve the original people, faces, identity, skin tone, hairstyle, clothing and body proportions. Keep faces unobstructed and the family recognizable. No cuts, no text or logos.
```

**Negative prompt**
```text
blurred faces, face change, different faces, distorted faces, face morphing, body distortion, changed ethnicity, outfit transformation, extra limbs, warped hands, extra foreground people, obscured faces, scary, horror, dark, low quality, blurry, deformed, cartoon, excessive particles, unnatural motion, flickering, strobing lights, abrupt scene changes, hard cuts, camera shake, camera rotation, orbiting, rapid zoom, text, logo, watermark
```

### 10s, Extreme — Snowfall Magic

**Prompt** (1722 chars)
```text
A 10 second cinematic Christmas video in one continuous shot that builds gently from start to finish. Use the uploaded photo as the starting frame and animate the existing scene; do not replace the people or create a new image. Heavy layered snowfall falling naturally with gravity in the foreground and background, clear of faces, snowflakes spinning gently, sparkling and settling lightly on shoulders, breath vapor puffs rising and dissipating naturally below faces in cold air, soft Filipino parol-light bokeh glowing, foreground snow drifting past the camera with gentle parallax, person shivering slightly with natural cold movement, hair and clothes moving slightly in the wind, realistic snow textures with a luminous glow. Extreme movement: highly dynamic realistic movement that fits the template, effects floating, pulsing, swirling and dancing energetically, characters and particles in continuous motion, fast camera dolly through the scene with parallax, gentle zoom in and out and a smooth slow orbit, high-motion continuous viral TikTok energy with no static moments, still realistic and fitting. Accompanied by joyful Filipino Christmas music, a cheerful Pasko sa Nayon melody with jingle bells, warm festive carols, cozy Noche Buena celebration music and a soft Christmas choir with bells ringing; motion and twinkling follow the musical rhythm. One primary animation with subtle secondary effects. Smooth stabilized camera: zoom and orbit allowed, never camera shake. Natural movement, realistic lighting, smooth animation. Preserve the original people, faces, identity, skin tone, hairstyle, clothing and body proportions. Keep faces unobstructed and the family recognizable. No cuts, no text or logos.
```

**Negative prompt**
```text
blurred faces, face change, different faces, distorted faces, face morphing, body distortion, changed ethnicity, outfit transformation, extra limbs, warped hands, extra foreground people, obscured faces, scary, horror, dark, low quality, blurry, deformed, cartoon, excessive particles, unnatural motion, flickering, strobing lights, abrupt scene changes, hard cuts, camera shake, text, logo, watermark
```

## Prompt lengths

Every template / duration / movement combination stays under the 2500-character model ceiling.
Longest observed: **1828** chars.

| Template | Length | Movement | Chars |
| --- | --- | --- | --- |
| parol | 5s | low | 1448 |
| parol | 5s | medium | 1427 |
| parol | 5s | high | 1479 |
| parol | 5s | extreme | 1650 |
| parol | 10s | low | 1489 |
| parol | 10s | medium | 1468 |
| parol | 10s | high | 1520 |
| parol | 10s | extreme | 1691 |
| snow | 5s | low | 1479 |
| snow | 5s | medium | 1458 |
| snow | 5s | high | 1510 |
| snow | 5s | extreme | 1681 |
| snow | 10s | low | 1520 |
| snow | 10s | medium | 1499 |
| snow | 10s | high | 1551 |
| snow | 10s | extreme | 1722 |
| bokeh | 5s | low | 1459 |
| bokeh | 5s | medium | 1438 |
| bokeh | 5s | high | 1490 |
| bokeh | 5s | extreme | 1661 |
| bokeh | 10s | low | 1500 |
| bokeh | 10s | medium | 1479 |
| bokeh | 10s | high | 1531 |
| bokeh | 10s | extreme | 1702 |
| globe | 5s | low | 1558 |
| globe | 5s | medium | 1537 |
| globe | 5s | high | 1589 |
| globe | 5s | extreme | 1760 |
| globe | 10s | low | 1599 |
| globe | 10s | medium | 1578 |
| globe | 10s | high | 1630 |
| globe | 10s | extreme | 1801 |
| fire | 5s | low | 1585 |
| fire | 5s | medium | 1564 |
| fire | 5s | high | 1616 |
| fire | 5s | extreme | 1787 |
| fire | 10s | low | 1626 |
| fire | 10s | medium | 1605 |
| fire | 10s | high | 1657 |
| fire | 10s | extreme | 1828 |
