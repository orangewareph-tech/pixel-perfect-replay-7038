# MagicPh AI — Template Prompts

Model: `fal-ai/kling-video/v2.5-turbo/pro/image-to-video` (5s ≈ $0.35, 10s ≈ $0.70).

## Structure

Final prompt = **neutral template scene** + **movement level** (slider, default Extreme) + **5s/10s pacing** + identity rules. Negative prompt is added separately.

## Contradiction fix

Scenes used to hard-code EXTREME / RAPIDLY / 360 spin / camera shake, so Low still looked frantic and asked for camera moves the blocked list forbade. Scenes are now neutral; only the movement slider sets speed. Camera shake is always blocked; fast zoom and orbiting are only allowed at High/Extreme.

## Base scenes

### Parol Star Magic (`parol`)
```text
20+ colorful Filipino parol star lanterns in red yellow blue green floating at safe distance, golden star dust around outer edges, parol stars with warm light, fairy lights twinkling, moving bokeh, traveling lens flare, family smiling, Noche Buena steam rising, cinematic golden glow, vibrant festive colors, joyful Noche Buena warmth, softly blurred Filipino feast behind.
```

### Snowfall Magic (`snow`)
```text
A Pinoy dream of first snowfall: heavy layered snowfall falling in foreground and background clear of faces, snowflakes sparkling settling lightly on shoulders with natural gravity accumulating, breath vapor puffs rise and dissipate below faces, soft Filipino parol-light bokeh and volumetric light through snow create cozy winter wonderland with gentle joyful wonder, foreground snow sweeps past camera with dynamic parallax, realistic snow textures luminous snow glow, preserve original clothing.
```

### Fairy Lights Magic (`bokeh`)
```text
Warm golden Pinoy Christmas village fairy lights floating dancing like fireflies around family leaving delicate light trails, thousands of lights wrapping and unwrapping continuously twinkling to Pasko sa Nayon beat, lights gather into heart-shaped halo pulsing and Filipino parol star shapes behind family continually reforming hearts and parol shapes, fine fairy dust floating everywhere, soft golden-hour reflections, intimate magical glow with subtle light reflections in eyes, moving bokeh adds strong parallax, faces remain frontal recognizable, lights never wrap across faces.
```

### Santa Village Magic (`globe`)
```text
A soft Filipino parol magical portal glow reveals detailed storybook Pinoy Santa Village behind unchanged family, Santa wearing barong Tagalog waving and walking towards family beside warmly lit toy workshop decorated with parols, tiny elves in barong walking waving jumping and carrying gifts, toy train carrying Pinoy gifts along background track, reindeer turn heads and walk while noses pulse glowing, chimney smoke rises in the wind over Christmas houses with parol lanterns glowing as gentle snow falls, distant sleigh decorated with parol stars flies across sky trailing stars, rotating parol portal and strong background parallax stay animated, camera push-in dolly parallax through village, all village characters remain small and behind family.
```

### Fireplace Noche Buena Magic (`fire`)
```text
A cozy Filipino Noche Buena setting glows behind family: detailed table with lechon, ham, queso de bola, bibingka, puto bumbong, Pinoy spaghetti, lumpia and pancit, realistic fireplace flames dance inside hearth while bright embers swirl and rise safely inside hearth sparkling, continuous food steam rises from lechon and bibingka, parol-decorated stockings swaying slightly, Christmas tree with gifts, parols and fairy lights twinkling, gift ribbons flutter subtly, tree lights dance and warm firelight casts moving shadows flickering on faces, family smiling with slight breathing and head nods, nostalgic Filipino family warmth, preserve original clothing and keep feast behind family, cozy.
```

## Movement levels

- **low**: Low movement: gentle slow floating, subtle twinkling, soft parallax, slow dolly. Calm and peaceful, no fast motion, no camera shake.
- **medium**: Medium movement: moderate floating and pulsing, gentle swirling, moderate parallax, smooth dolly. No camera shake.
- **high**: High movement: energetic floating, dancing and pulsing effects, dynamic swirling, strong parallax, fast dolly zooming in and out. No camera shake.
- **extreme**: EXTREME MOVEMENT: effects RAPIDLY floating spinning rotating continuously, dancing swirling fast, pulsing, zooming, orbiting like planets flying from background to foreground, SWIRLING FAST vortex, TWINKLING FAST, BLINKING FAST, moving bokeh, traveling lens flare moving, camera RAPIDLY ZOOMING IN and OUT, camera ORBITING fast with parallax, HIGH MOTION DYNAMIC energetic continuous animation, no static frames, viral TikTok movement. Keep the camera stable without shake and keep faces undistorted.

## Full example — Parol, 10s, low

**Prompt**
```text
A 10 second progressive cinematic Christmas story in one continuous shot: starts with the original family photo. During seconds 0–3 the selected setting lights up with motion immediately; during seconds 3–7 its main magical motion builds and secondary background details animate; during seconds 7–10 the glow intensifies while effects continue moving through the ending. Featured effect: 20+ colorful Filipino parol star lanterns in red yellow blue green floating at safe distance, golden star dust around outer edges, parol stars with warm light, fairy lights twinkling, moving bokeh, traveling lens flare, family smiling, Noche Buena steam rising, cinematic golden glow, vibrant festive colors, joyful Noche Buena warmth, softly blurred Filipino feast behind.. Low movement: gentle slow floating, subtle twinkling, soft parallax, slow dolly. Calm and peaceful, no fast motion, no camera shake. The movement level controls speed and density of every scene action; Low and Medium slow the effects, High and Extreme accelerate them. Use only the camera move specified by the movement level. Apply only this selected template's effects. Cinematic lighting, detailed realistic textures and natural subtle family movement. Preserve the original people, faces, identity, skin tone, expressions and clothing, no face change, no face distortion. Keep faces unobstructed and the family recognizable. No cuts, no additional foreground people, no captions or logos.
```
**Negative prompt**
```text
blurred faces, face change, different faces, distorted faces, scary, horror, dark, low quality, blurry, deformed, changed ethnicity, cartoon, extra foreground people, obscured faces, face morphing, outfit transformation, extra limbs, warped hands, camera shake, rapid spinning camera, fast zoom, strobing lights, hard cuts, text, watermark
```

## Full example — Parol, 10s, extreme

**Prompt**
```text
A 10 second progressive cinematic Christmas story in one continuous shot: starts with the original family photo. During seconds 0–3 the selected setting lights up with motion immediately; during seconds 3–7 its main magical motion builds and secondary background details animate; during seconds 7–10 the glow intensifies while effects continue moving through the ending. Featured effect: 20+ colorful Filipino parol star lanterns in red yellow blue green floating at safe distance, golden star dust around outer edges, parol stars with warm light, fairy lights twinkling, moving bokeh, traveling lens flare, family smiling, Noche Buena steam rising, cinematic golden glow, vibrant festive colors, joyful Noche Buena warmth, softly blurred Filipino feast behind.. EXTREME MOVEMENT: effects RAPIDLY floating spinning rotating continuously, dancing swirling fast, pulsing, zooming, orbiting like planets flying from background to foreground, SWIRLING FAST vortex, TWINKLING FAST, BLINKING FAST, moving bokeh, traveling lens flare moving, camera RAPIDLY ZOOMING IN and OUT, camera ORBITING fast with parallax, HIGH MOTION DYNAMIC energetic continuous animation, no static frames, viral TikTok movement. Keep the camera stable without shake and keep faces undistorted. The movement level controls speed and density of every scene action; Low and Medium slow the effects, High and Extreme accelerate them. Use only the camera move specified by the movement level. Apply only this selected template's effects. Cinematic lighting, detailed realistic textures and natural subtle family movement. Preserve the original people, faces, identity, skin tone, expressions and clothing, no face change, no face distortion. Keep faces unobstructed and the family recognizable. No cuts, no additional foreground people, no captions or logos.
```
**Negative prompt**
```text
blurred faces, face change, different faces, distorted faces, scary, horror, dark, low quality, blurry, deformed, changed ethnicity, cartoon, extra foreground people, obscured faces, face morphing, outfit transformation, extra limbs, warped hands, camera shake, strobing lights, hard cuts, text, watermark, static effects, frozen particles, motionless background, no movement
```

## 5s example — Parol, extreme
```text
A 5 second cinematic Christmas portrait in one continuous shot. Establish the selected effect immediately, emphasize one clear magical motion with supporting light and particles, and keep effects moving through the ending. Featured effect: 20+ colorful Filipino parol star lanterns in red yellow blue green floating at safe distance, golden star dust around outer edges, parol stars with warm light, fairy lights twinkling, moving bokeh, traveling lens flare, family smiling, Noche Buena steam rising, cinematic golden glow, vibrant festive colors, joyful Noche Buena warmth, softly blurred Filipino feast behind.. EXTREME MOVEMENT: effects RAPIDLY floating spinning rotating continuously, dancing swirling fast, pulsing, zooming, orbiting like planets flying from background to foreground, SWIRLING FAST vortex, TWINKLING FAST, BLINKING FAST, moving bokeh, traveling lens flare moving, camera RAPIDLY ZOOMING IN and OUT, camera ORBITING fast with parallax, HIGH MOTION DYNAMIC energetic continuous animation, no static frames, viral TikTok movement. Keep the camera stable without shake and keep faces undistorted. The movement level controls speed and density of every scene action; Low and Medium slow the effects, High and Extreme accelerate them. Use only the camera move specified by the movement level. Apply only this selected template's effects. Cinematic lighting, detailed realistic textures and natural subtle family movement. Preserve the original people, faces, identity, skin tone, expressions and clothing, no face change, no face distortion. Keep faces unobstructed and the family recognizable. No cuts, no additional foreground people, no captions or logos.
```
