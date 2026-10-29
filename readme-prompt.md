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
Colorful Filipino parol lanterns gently float and glow behind the family. Golden sparkles drift through warm Christmas lights. Subtle background movement, cinematic golden lighting, realistic festive atmosphere.
```

### Snowfall Magic (`snow`)
```text
Beautiful, realistic snow falls gently around the family. Snowflakes drift at different depths while warm Filipino Christmas lights glow in the background. Cozy winter atmosphere, natural snowfall, soft cinematic lighting.
```

### Fairy Lights Magic (`bokeh`)
```text
Warm golden fairy lights gently float and twinkle around the family. Soft glowing particles form a subtle heart and parol pattern in the background. Elegant golden bokeh, dreamy Christmas atmosphere, realistic lighting.
```

### Santa Village Magic (`globe`)
```text
A charming Filipino Christmas village glows behind the family. Tiny Santa and elves move gently near a warmly lit toy workshop. Colorful parols glow, light snow falls, and a small toy train moves through the background.
```

### Fireplace Noche Buena Magic (`fire`)
```text
A cozy Filipino Noche Buena scene glows behind the family. Fireplace flames flicker naturally, warm Christmas lights twinkle, and gentle steam rises from the festive food. Realistic firelight, peaceful family atmosphere.
```

## Movement levels

Only one of these is inserted, chosen by the slider. Default: **extreme**.


- **low**: Low movement: slow, subtle movement of the effects.

- **medium**: Medium movement: natural, clearly visible movement of the effects.

- **high**: High movement: lively, faster environmental movement.

- **extreme**: Extreme movement: energetic effects while keeping realistic motion and recognizable faces.


## Full examples — Parol Star Magic


### 10s, Low

**Prompt** (853 chars)
```text
A 10 second cinematic Christmas video in one continuous shot that builds gently from start to finish. Use the uploaded photo as the starting frame and animate the existing scene; do not replace the people or create a new image. Colorful Filipino parol lanterns gently float and glow behind the family. Golden sparkles drift through warm Christmas lights. Subtle background movement, cinematic golden lighting, realistic festive atmosphere. Low movement: slow, subtle movement of the effects. One primary animation with subtle secondary effects. Steady camera: no forced camera rotation, rapid zooming or camera shake. Natural movement, realistic lighting, smooth animation. Preserve the original people, faces, identity, skin tone, hairstyle, clothing and body proportions. Keep faces unobstructed and the family recognizable. No cuts, no text or logos.
```

**Negative prompt**
```text
blurred faces, face change, different faces, distorted faces, face morphing, body distortion, changed ethnicity, outfit transformation, extra limbs, warped hands, extra foreground people, obscured faces, scary, horror, dark, low quality, blurry, deformed, cartoon, excessive particles, unnatural motion, flickering, strobing lights, abrupt scene changes, hard cuts, camera rotation, rapid zoom, camera shake, text, logo, watermark
```

### 10s, Extreme

**Prompt** (892 chars)
```text
A 10 second cinematic Christmas video in one continuous shot that builds gently from start to finish. Use the uploaded photo as the starting frame and animate the existing scene; do not replace the people or create a new image. Colorful Filipino parol lanterns gently float and glow behind the family. Golden sparkles drift through warm Christmas lights. Subtle background movement, cinematic golden lighting, realistic festive atmosphere. Extreme movement: energetic effects while keeping realistic motion and recognizable faces. One primary animation with subtle secondary effects. Steady camera: no forced camera rotation, rapid zooming or camera shake. Natural movement, realistic lighting, smooth animation. Preserve the original people, faces, identity, skin tone, hairstyle, clothing and body proportions. Keep faces unobstructed and the family recognizable. No cuts, no text or logos.
```

**Negative prompt**
```text
blurred faces, face change, different faces, distorted faces, face morphing, body distortion, changed ethnicity, outfit transformation, extra limbs, warped hands, extra foreground people, obscured faces, scary, horror, dark, low quality, blurry, deformed, cartoon, excessive particles, unnatural motion, flickering, strobing lights, abrupt scene changes, hard cuts, camera rotation, rapid zoom, camera shake, text, logo, watermark
```

### 5s, Extreme

**Prompt** (851 chars)
```text
A 5 second cinematic Christmas video in one continuous shot. Use the uploaded photo as the starting frame and animate the existing scene; do not replace the people or create a new image. Colorful Filipino parol lanterns gently float and glow behind the family. Golden sparkles drift through warm Christmas lights. Subtle background movement, cinematic golden lighting, realistic festive atmosphere. Extreme movement: energetic effects while keeping realistic motion and recognizable faces. One primary animation with subtle secondary effects. Steady camera: no forced camera rotation, rapid zooming or camera shake. Natural movement, realistic lighting, smooth animation. Preserve the original people, faces, identity, skin tone, hairstyle, clothing and body proportions. Keep faces unobstructed and the family recognizable. No cuts, no text or logos.
```

**Negative prompt**
```text
blurred faces, face change, different faces, distorted faces, face morphing, body distortion, changed ethnicity, outfit transformation, extra limbs, warped hands, extra foreground people, obscured faces, scary, horror, dark, low quality, blurry, deformed, cartoon, excessive particles, unnatural motion, flickering, strobing lights, abrupt scene changes, hard cuts, camera rotation, rapid zoom, camera shake, text, logo, watermark
```

## Prompt lengths

Every template / duration / movement combination stays under the 2500-character model ceiling.
Longest observed: **903** chars.

| Template | Length | Movement | Chars |
| --- | --- | --- | --- |
| parol | 5s | low | 812 |
| parol | 5s | medium | 827 |
| parol | 5s | high | 814 |
| parol | 5s | extreme | 851 |
| parol | 10s | low | 853 |
| parol | 10s | medium | 868 |
| parol | 10s | high | 855 |
| parol | 10s | extreme | 892 |
| snow | 5s | low | 823 |
| snow | 5s | medium | 838 |
| snow | 5s | high | 825 |
| snow | 5s | extreme | 862 |
| snow | 10s | low | 864 |
| snow | 10s | medium | 879 |
| snow | 10s | high | 866 |
| snow | 10s | extreme | 903 |
| bokeh | 5s | low | 820 |
| bokeh | 5s | medium | 835 |
| bokeh | 5s | high | 822 |
| bokeh | 5s | extreme | 859 |
| bokeh | 10s | low | 861 |
| bokeh | 10s | medium | 876 |
| bokeh | 10s | high | 863 |
| bokeh | 10s | extreme | 900 |
| globe | 5s | low | 820 |
| globe | 5s | medium | 835 |
| globe | 5s | high | 822 |
| globe | 5s | extreme | 859 |
| globe | 10s | low | 861 |
| globe | 10s | medium | 876 |
| globe | 10s | high | 863 |
| globe | 10s | extreme | 900 |
| fire | 5s | low | 821 |
| fire | 5s | medium | 836 |
| fire | 5s | high | 823 |
| fire | 5s | extreme | 860 |
| fire | 10s | low | 862 |
| fire | 10s | medium | 877 |
| fire | 10s | high | 864 |
| fire | 10s | extreme | 901 |
