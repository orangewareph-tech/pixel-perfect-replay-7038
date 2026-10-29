# MagicPh AI — Template Prompts

Model: `fal-ai/kling-video/v2.5-turbo/pro/image-to-video` (5s ≈ $0.35, 10s ≈ $0.70).

This file is generated from the live code — `src/lib/site.ts`, `src/lib/video-movement.ts` and
`src/lib/video-duration.ts` — so every string below is exactly what the app sends.

## Structure

Final prompt = **5s/10s pacing** + **neutral template scene** + **movement level** (slider, default
extreme) + **identity rules**. The negative prompt is sent separately.

Scenes carry no speed words at all. Only the movement slider sets speed, so Low really does look
gentle and Extreme really does look frantic. Camera shake is always blocked; fast zoom and orbiting
are only allowed at High/Extreme.

## Base scenes


### Parol Star Magic (`parol`)
```text
Background transforms into a Filipino Christmas celebration with more than 20 colorful parol star lanterns in red, gold, yellow, blue and green glowing with warm realistic light at different depths behind the family. Parols float, rotate naturally and shimmer; golden star particles drift through the air, tiny sparkles appear around the lanterns, fairy lights twinkle, light reflections move across the scene and rich cinematic bokeh adds depth. A softly blurred Noche Buena feast glows behind with natural steam rising. Detailed parol craftsmanship, vibrant Filipino colors, parols and particles stay animated through the final frame.
```

### Snowfall Magic (`snow`)
```text
Environment becomes a Filipino-inspired winter wonderland: realistic snow falls at multiple depths from the first moment, large detailed snowflakes pass through the foreground while smaller flakes drift far behind, tumbling with natural gravity and a gentle breeze. Warm glowing parols and soft Christmas lights shine through the snow with volumetric light scattering, contrasting cool snow with cozy golden light. A light dusting of snow gathers subtly on background surfaces and shoulders, natural breath vapor appears below faces, snow never covers faces, original clothing kept. Snowfall continues through the final frame.
```

### Fairy Lights Magic (`bokeh`)
```text
Thousands of warm golden fairy lights float like tiny glowing fireflies at different depths around the family, twinkling independently and leaving short delicate light trails; groups of lights flow in smooth curved paths with golden particles and shifting bokeh parallax. Behind the family the lights organize into heart-shaped halos and Filipino parol star patterns that glow, pulse gently, dissolve into particles and reform, staying in the background and outer edges. Light changes smoothly without harsh flashes, effects stay away from eyes, nose and mouth, and the lights keep moving through the final frame.
```

### Santa Village Magic (`globe`)
```text
A warm glowing Filipino parol portal behind the family gradually reveals a storybook Christmas village: charming houses, a toy workshop with colorful parols, lit windows, festive trees and gentle snowfall. Santa Claus in a barong Tagalog smiles and waves in the background, small friendly elves carry wrapped gifts, a toy train with colorful gifts travels along a track behind the family, reindeer turn their heads with softly glowing noses, chimney smoke rises above the houses, and a distant sleigh with glowing parol stars crosses the sky trailing golden particles. All village characters stay small and behind the family; the village keeps moving through the final frame.
```

### Fireplace Noche Buena Magic (`fire`)
```text
Background becomes a Filipino Noche Buena celebration: a warm fireplace with naturally flickering flames and embers rising inside the hearth casts gentle moving shadows, beside Christmas stockings, colorful parols, fairy lights and a Christmas tree with wrapped gifts. A feast table behind the family holds lechon, Christmas ham, queso de bola, bibingka, puto bumbong, Filipino spaghetti, lumpia and pancit with realistic textures; soft steam rises from bibingka and lechon. Tree lights twinkle, ribbons and stockings sway slightly. Food never covers people, no excessive flames, and the cozy glow continues through the final frame.
```

## Movement levels

Only one of these is inserted, chosen by the slider. Default: **extreme**.


- **low**: Low movement: gentle slow floating, subtle twinkling, soft parallax, slow dolly. Calm and peaceful, no fast motion, no camera shake.

- **medium**: Medium movement: moderate floating and pulsing, gentle swirling, moderate parallax, smooth dolly. No camera shake.

- **high**: High movement: energetic floating, dancing and pulsing effects, dynamic swirling, strong parallax, fast dolly zooming in and out. No camera shake.

- **extreme**: EXTREME MOVEMENT: effects RAPIDLY floating spinning rotating continuously, dancing swirling fast, pulsing, zooming, orbiting like planets flying from background to foreground, SWIRLING FAST vortex, TWINKLING FAST, BLINKING FAST, moving bokeh, traveling lens flare moving, camera RAPIDLY ZOOMING IN and OUT, camera ORBITING fast with parallax, HIGH MOTION DYNAMIC energetic continuous animation, no static frames, viral TikTok movement. Keep the camera stable without shake and keep faces undistorted.


## Full examples — Parol Star Magic


### 10s, Low

**Prompt** (1718 chars)
```text
A 10 second progressive cinematic Christmas story in one continuous shot: starts with the original family photo. During seconds 0–3 the selected setting lights up with motion immediately; during seconds 3–7 its main magical motion builds and secondary background details animate; during seconds 7–10 the glow intensifies while effects continue moving through the ending. Featured effect: Background transforms into a Filipino Christmas celebration with more than 20 colorful parol star lanterns in red, gold, yellow, blue and green glowing with warm realistic light at different depths behind the family. Parols float, rotate naturally and shimmer; golden star particles drift through the air, tiny sparkles appear around the lanterns, fairy lights twinkle, light reflections move across the scene and rich cinematic bokeh adds depth. A softly blurred Noche Buena feast glows behind with natural steam rising. Detailed parol craftsmanship, vibrant Filipino colors, parols and particles stay animated through the final frame.. Low movement: gentle slow floating, subtle twinkling, soft parallax, slow dolly. Calm and peaceful, no fast motion, no camera shake. The movement level controls speed and density of every scene action; Low and Medium slow the effects, High and Extreme accelerate them. Use only the camera move specified by the movement level. Apply only this selected template's effects. Cinematic lighting, detailed realistic textures and natural subtle family movement. Preserve the original people, faces, identity, skin tone, expressions and clothing, no face change, no face distortion. Keep faces unobstructed and the family recognizable. No cuts, no additional foreground people, no captions or logos.
```

**Negative prompt**
```text
blurred faces, face change, different faces, distorted faces, scary, horror, dark, low quality, blurry, deformed, changed ethnicity, cartoon, extra foreground people, obscured faces, face morphing, outfit transformation, extra limbs, warped hands, camera shake, rapid spinning camera, fast zoom, strobing lights, hard cuts, text, watermark
```

### 10s, Extreme

**Prompt** (2086 chars)
```text
A 10 second progressive cinematic Christmas story in one continuous shot: starts with the original family photo. During seconds 0–3 the selected setting lights up with motion immediately; during seconds 3–7 its main magical motion builds and secondary background details animate; during seconds 7–10 the glow intensifies while effects continue moving through the ending. Featured effect: Background transforms into a Filipino Christmas celebration with more than 20 colorful parol star lanterns in red, gold, yellow, blue and green glowing with warm realistic light at different depths behind the family. Parols float, rotate naturally and shimmer; golden star particles drift through the air, tiny sparkles appear around the lanterns, fairy lights twinkle, light reflections move across the scene and rich cinematic bokeh adds depth. A softly blurred Noche Buena feast glows behind with natural steam rising. Detailed parol craftsmanship, vibrant Filipino colors, parols and particles stay animated through the final frame.. EXTREME MOVEMENT: effects RAPIDLY floating spinning rotating continuously, dancing swirling fast, pulsing, zooming, orbiting like planets flying from background to foreground, SWIRLING FAST vortex, TWINKLING FAST, BLINKING FAST, moving bokeh, traveling lens flare moving, camera RAPIDLY ZOOMING IN and OUT, camera ORBITING fast with parallax, HIGH MOTION DYNAMIC energetic continuous animation, no static frames, viral TikTok movement. Keep the camera stable without shake and keep faces undistorted. The movement level controls speed and density of every scene action; Low and Medium slow the effects, High and Extreme accelerate them. Use only the camera move specified by the movement level. Apply only this selected template's effects. Cinematic lighting, detailed realistic textures and natural subtle family movement. Preserve the original people, faces, identity, skin tone, expressions and clothing, no face change, no face distortion. Keep faces unobstructed and the family recognizable. No cuts, no additional foreground people, no captions or logos.
```

**Negative prompt**
```text
blurred faces, face change, different faces, distorted faces, scary, horror, dark, low quality, blurry, deformed, changed ethnicity, cartoon, extra foreground people, obscured faces, face morphing, outfit transformation, extra limbs, warped hands, camera shake, strobing lights, hard cuts, text, watermark, static effects, frozen particles, motionless background, no movement
```

### 5s, Extreme

**Prompt** (1938 chars)
```text
A 5 second cinematic Christmas portrait in one continuous shot. Establish the selected effect immediately, emphasize one clear magical motion with supporting light and particles, and keep effects moving through the ending. Featured effect: Background transforms into a Filipino Christmas celebration with more than 20 colorful parol star lanterns in red, gold, yellow, blue and green glowing with warm realistic light at different depths behind the family. Parols float, rotate naturally and shimmer; golden star particles drift through the air, tiny sparkles appear around the lanterns, fairy lights twinkle, light reflections move across the scene and rich cinematic bokeh adds depth. A softly blurred Noche Buena feast glows behind with natural steam rising. Detailed parol craftsmanship, vibrant Filipino colors, parols and particles stay animated through the final frame.. EXTREME MOVEMENT: effects RAPIDLY floating spinning rotating continuously, dancing swirling fast, pulsing, zooming, orbiting like planets flying from background to foreground, SWIRLING FAST vortex, TWINKLING FAST, BLINKING FAST, moving bokeh, traveling lens flare moving, camera RAPIDLY ZOOMING IN and OUT, camera ORBITING fast with parallax, HIGH MOTION DYNAMIC energetic continuous animation, no static frames, viral TikTok movement. Keep the camera stable without shake and keep faces undistorted. The movement level controls speed and density of every scene action; Low and Medium slow the effects, High and Extreme accelerate them. Use only the camera move specified by the movement level. Apply only this selected template's effects. Cinematic lighting, detailed realistic textures and natural subtle family movement. Preserve the original people, faces, identity, skin tone, expressions and clothing, no face change, no face distortion. Keep faces unobstructed and the family recognizable. No cuts, no additional foreground people, no captions or logos.
```

**Negative prompt**
```text
blurred faces, face change, different faces, distorted faces, scary, horror, dark, low quality, blurry, deformed, changed ethnicity, cartoon, extra foreground people, obscured faces, face morphing, outfit transformation, extra limbs, warped hands, camera shake, strobing lights, hard cuts, text, watermark, static effects, frozen particles, motionless background, no movement
```

## Prompt lengths

Every template / duration / movement combination stays under the 2500-character model ceiling.
Longest observed: **2125** chars.

| Template | Length | Movement | Chars |
| --- | --- | --- | --- |
| parol | 5s | low | 1570 |
| parol | 5s | medium | 1552 |
| parol | 5s | high | 1584 |
| parol | 5s | extreme | 1938 |
| parol | 10s | low | 1718 |
| parol | 10s | medium | 1700 |
| parol | 10s | high | 1732 |
| parol | 10s | extreme | 2086 |
| snow | 5s | low | 1560 |
| snow | 5s | medium | 1542 |
| snow | 5s | high | 1574 |
| snow | 5s | extreme | 1928 |
| snow | 10s | low | 1708 |
| snow | 10s | medium | 1690 |
| snow | 10s | high | 1722 |
| snow | 10s | extreme | 2076 |
| bokeh | 5s | low | 1547 |
| bokeh | 5s | medium | 1529 |
| bokeh | 5s | high | 1561 |
| bokeh | 5s | extreme | 1915 |
| bokeh | 10s | low | 1695 |
| bokeh | 10s | medium | 1677 |
| bokeh | 10s | high | 1709 |
| bokeh | 10s | extreme | 2063 |
| globe | 5s | low | 1609 |
| globe | 5s | medium | 1591 |
| globe | 5s | high | 1623 |
| globe | 5s | extreme | 1977 |
| globe | 10s | low | 1757 |
| globe | 10s | medium | 1739 |
| globe | 10s | high | 1771 |
| globe | 10s | extreme | 2125 |
| fire | 5s | low | 1566 |
| fire | 5s | medium | 1548 |
| fire | 5s | high | 1580 |
| fire | 5s | extreme | 1934 |
| fire | 10s | low | 1714 |
| fire | 10s | medium | 1696 |
| fire | 10s | high | 1728 |
| fire | 10s | extreme | 2082 |
