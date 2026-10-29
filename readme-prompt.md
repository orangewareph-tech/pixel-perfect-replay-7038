# MagicPh AI — Template Prompt Reference

This document shows the exact text MagicPh AI sends to the video model for each of the
five templates, plus the shared framing that gets wrapped around every prompt.

Nothing here is invented: every line below is copied from the running code.

| Part | Lives in |
| --- | --- |
| Template scene text | `src/lib/site.ts` (`TEMPLATES`) |
| 5s / 10s story framing + safety rules | `src/lib/video-duration.ts` (`buildVideoInput`) |
| Movement level wording | `src/lib/video-movement.ts` (`MOVEMENT_DIRECTIONS`) |
| Allowed template ids | `src/lib/template-ids.ts` |

Video model used: `fal-ai/kling-video/v2.5-turbo/pro/image-to-video`
(image → video, `cfg_scale` 0.5, `duration` sent as `"5"` or `"10"`).

---

## How a prompt is assembled

Every generation builds one prompt string in this order:

```text
[ duration framing for 5s or 10s ]
Featured effect: [ template scene text ].
[ movement level directions ]
The movement level controls speed and density of every scene action; Low and Medium slow
the effects, High and Extreme accelerate them. Use only the camera move specified by the
movement level. Apply only this selected template's effects.
Cinematic lighting, detailed realistic textures and natural subtle family movement.
Preserve the original people, faces, identity, skin tone, expressions and clothing, no
face change, no face distortion. Keep faces unobstructed and the family recognizable.
No cuts, no additional foreground people, no captions or logos.
```

The **negative prompt** (what the model must avoid) is always:

```text
blurred faces, face change, different faces, distorted faces, scary, horror, dark,
low quality, blurry, deformed, changed ethnicity, cartoon, extra foreground people,
obscured faces, face morphing, outfit transformation, extra limbs, warped hands,
camera shake, rapid spinning camera, strobing lights, hard cuts, text, watermark
```

When movement is **High** or **Extreme**, these are appended to the negative prompt:

```text
, static effects, frozen particles, motionless background, no movement
```

### Duration framing (verbatim)

**5 seconds**

```text
A 5 second cinematic Christmas portrait in one continuous shot. Establish the selected
effect immediately, emphasize one clear magical motion with supporting light and
particles, and keep effects moving through the ending.
```

**10 seconds**

```text
A 10 second progressive cinematic Christmas story in one continuous shot: starts with
the original family photo. During seconds 0–3 the selected setting lights up with motion
immediately; during seconds 3–7 its main magical motion builds and secondary background
details animate; during seconds 7–10 the glow intensifies while effects continue moving
through the ending.
```

### Movement levels (verbatim)

Default is **Extreme**.

**Low**

```text
Low movement: gentle drifting particles, soft light pulses and subtle background
animation. One slow camera push-in, natural breathing only.
```

**Medium**

```text
Medium movement: steadily moving particles, dancing lights and visible background
animation. One smooth camera push-in with clear parallax, natural breathing and small
smiles.
```

**High**

```text
High movement: fast swirling particles, lively dancing lights and energetic continuous
background animation. One energetic smooth camera push-in with strong parallax, small
natural smiles and breathing.
```

**Extreme**

```text
Extreme movement: very high motion, dynamic energetic continuous animation throughout,
rapid swirling spinning floating dancing particles and lights, strong
foreground/background parallax. Activate all selected scene movements at their fastest
coherent speed; no frozen or motionless effects. One brisk smooth camera push-in, keep
the family frontal with small natural smiles and breathing. Do not shake the camera, spin
around faces, strobe lights or force limbs to move.
```

---

## The 5 templates

### 1. Parol Star Magic — `parol`

Badge: 🇵🇭 Parol Favorite · card blurb: *Makolor nga parol · MORE MOVEMENT · mainit nga
Paskong Pinoy*

```text
EXTREME MOVEMENT - 20+ colorful Filipino parol star lanterns in red yellow blue green RAPIDLY floating spinning rotating 360 continuously dancing swirling fast pulsing zooming orbiting like planets flying background to foreground at safe distance, golden star dust SWIRLING FAST vortex like fireflies around outer edges, parol stars pulse with warm light and ZOOM IN OUT, fairy lights TWINKLING FAST, moving bokeh BLINKING FAST, bright traveling lens flare MOVING across screen, camera RAPIDLY ZOOMING IN OUT shaking, camera ORBITING 360 fast with parallax, family SMILING MOVING slightly breathing, Noche Buena steam RISING MOVING, lights BLINKING FAST, HIGH MOTION DYNAMIC energetic continuous no static viral TikTok movement, cinematic golden glow, vibrant festive colors, joyful Noche Buena warmth, softly blurred Filipino feast behind.
```

### 2. Snowfall Magic — `snow`

Badge: ✨ Pinaka Magical · card blurb: *Pinoy dream snow · MORE MOVEMENT · kahayag sa parol*

```text
EXTREME SNOW MOVEMENT - A Pinoy dream of first snowfall: HEAVY layered snowfall FALLING FAST all directions BLOWS and SWIRLS in foreground and background clear of faces, snowflakes FALLING FAST SPINNING DIAMOND-sparkling settling lightly on shoulders with natural gravity accumulating FAST, repeated breath vapor PUFFS rise and dissipate FAST below faces, soft Filipino parol-light bokeh BLINKING FAST and volumetric light through snow create cozy winter wonderland with gentle joyful wonder, foreground snow SWEEPS PAST camera FAST with dynamic parallax, camera DOLLY FAST through snow SHAKING handheld snowstorm, SHIVERING slight movement, snow BLOWING wind, HAIR and CLOTHES moving, realistic snow textures luminous snow glow, preserve original clothing.
```

### 3. Fairy Lights Magic — `bokeh`

Badge: ❤️ Pinaka Love · card blurb: *Kahayag sa Pasko · MORE MOVEMENT · parol ug heart
lights*

```text
EXTREME LIGHT MOVEMENT - Warm golden Pinoy Christmas village fairy lights RAPIDLY FLOATING DANCING like fireflies SWARMING around family leaving delicate light trails, THOUSANDS lights WRAPPING UNWRAPPING continuously TWINKLING FAST to Pasko sa Nayon beat, lights gather into heart-shaped halo PULSING FAST and Filipino parol star shapes SPINNING behind family continually reforming hearts and spinning parol shapes, fine fairy dust FLOATING FAST everywhere, soft golden-hour reflections, intimate magical glow with subtle light reflections MOVING in eyes, swarming lights CHASING each other and FLYING in circles, moving bokeh adds strong parallax and BLINKING FAST, camera ORBITING FAST 360 and ZOOMING IN OUT, faces remain frontal recognizable, lights never wrap across faces.
```

### 4. Santa Village Magic — `globe`

Badge: 🎅 Pang-Pinoy · card blurb: *Santa nga naka-barong · MORE MOVEMENT · parol village*

```text
EXTREME VILLAGE MOVEMENT - A soft Filipino parol magical portal glow SPINNING FAST reveals detailed storybook Pinoy Santa Village behind unchanged family, Santa wearing barong Tagalog WAVING FAST and WALKING towards family beside warmly lit toy workshop decorated with parols, tiny elves in barong BRISKLY WALKING FAST WAVING JUMPING and CARRYING gifts MOVING, toy train carrying Pinoy gifts RACES FAST along background track BOUNCING, reindeer TURN heads and WALK FAST while noses PULSE GLOWING, chimney smoke RISES FAST MOVING wind over Christmas houses with parol lanterns SPINNING GLOWING as gentle snow FALLS FAST, distant sleigh decorated with parol stars FLIES BRISKLY across sky TRAILING stars, rotating parol portal SPINNING FAST and strong background parallax STAY continuously animated, camera PUSH FAST parallax DOLLY through village, all village characters remain small and behind family, HIGH MOTION DYNAMIC.
```

### 5. Fireplace Noche Buena Magic — `fire`

Badge: 🇵🇭 Tatak Pinoy · card blurb: *Noche Buena · MORE MOVEMENT · kainit sa pamilya*

```text
EXTREME FIREPLACE MOVEMENT - A cozy Filipino Noche Buena setting glows behind family: detailed table with lechon ham queso de bola bibingka puto bumbong Pinoy spaghetti lumpia pancit, realistic fireplace flames DANCE CRACKLE FLICKER energetically FAST while bright embers SWIRL and RISE FAST safely inside hearth SPARKLING SPINNING, continuous swirling food steam RISES FAST from lechon and bibingka SWIRLING MOVING, parol-decorated stockings SWAYING slightly, Christmas tree with gifts parols and fairy lights BLINKING FAST TWINKLING, stockings SWAY gift ribbons FLUTTER subtly tree lights DANCE and warm firelight CASTS MOVING shadows FLICKERING FAST on faces, camera SLOW ZOOM slight SHAKE fire heat, family SMILING MOVING slightly breathing head nod, nostalgic Filipino family warmth, preserve original clothing and keep feast behind family, HIGH MOTION DYNAMIC cozy.
```

---

## Worked example: full prompt actually sent

Template **Parol Star Magic**, **10 seconds**, movement **Extreme** (the default):

```text
A 10 second progressive cinematic Christmas story in one continuous shot: starts with the original family photo. During seconds 0–3 the selected setting lights up with motion immediately; during seconds 3–7 its main magical motion builds and secondary background details animate; during seconds 7–10 the glow intensifies while effects continue moving through the ending. Featured effect: EXTREME MOVEMENT - 20+ colorful Filipino parol star lanterns in red yellow blue green RAPIDLY floating spinning rotating 360 continuously dancing swirling fast pulsing zooming orbiting like planets flying background to foreground at safe distance, golden star dust SWIRLING FAST vortex like fireflies around outer edges, parol stars pulse with warm light and ZOOM IN OUT, fairy lights TWINKLING FAST, moving bokeh BLINKING FAST, bright traveling lens flare MOVING across screen, camera RAPIDLY ZOOMING IN OUT shaking, camera ORBITING 360 fast with parallax, family SMILING MOVING slightly breathing, Noche Buena steam RISING MOVING, lights BLINKING FAST, HIGH MOTION DYNAMIC energetic continuous no static viral TikTok movement, cinematic golden glow, vibrant festive colors, joyful Noche Buena warmth, softly blurred Filipino feast behind.. Extreme movement: very high motion, dynamic energetic continuous animation throughout, rapid swirling spinning floating dancing particles and lights, strong foreground/background parallax. Activate all selected scene movements at their fastest coherent speed; no frozen or motionless effects. One brisk smooth camera push-in, keep the family frontal with small natural smiles and breathing. Do not shake the camera, spin around faces, strobe lights or force limbs to move. The movement level controls speed and density of every scene action; Low and Medium slow the effects, High and Extreme accelerate them. Use only the camera move specified by the movement level. Apply only this selected template's effects. Cinematic lighting, detailed realistic textures and natural subtle family movement. Preserve the original people, faces, identity, skin tone, expressions and clothing, no face change, no face distortion. Keep faces unobstructed and the family recognizable. No cuts, no additional foreground people, no captions or logos.
```

---

## Notes and known quirks

- **Double period.** Scene texts end with `.` and the wrapper adds `Featured effect: ${scene}.`,
  so the assembled prompt contains `..` after each scene. Harmless to the model, but it is
  there.
- **Scene text says "EXTREME" regardless of the slider.** Each scene starts with a hard-coded
  `EXTREME ... MOVEMENT` prefix written before the movement slider existed. The slider's own
  wording is appended after it, so on **Low** or **Medium** the two halves disagree — the
  scene asks for extreme motion while the movement line asks for gentle motion. The movement
  line comes later and carries the explicit "use only the camera move specified by the
  movement level" instruction, but the scene prefix is not rewritten. If Low/Medium renders
  still look frantic, this is the cause.
- **Scene camera wording vs. movement wording.** The scenes ask for things the movement
  levels forbid: `camera RAPIDLY ZOOMING IN OUT shaking` and `camera ORBITING 360 fast`
  (parol), `camera DOLLY FAST through snow SHAKING` (snow), `camera ORBITING FAST 360`
  (bokeh), while Extreme says *do not shake the camera, spin around faces*. The negative
  prompt also blocks `camera shake, rapid spinning camera`. The model has to reconcile these.
- **Greeting text is not in these prompts.** The `no captions or logos` rule blocks burned-in
  text, so the "Merry Christmas!" greetings seen in the sample files under
  `/mnt/documents/videos/` were written into those prompts separately, outside the app flow.
- **Music is not in these prompts either.** The Christmas soundtrack is merged into the
  finished file afterwards in the browser, not requested from the model.
- **Only these five ids are accepted** (`parol`, `snow`, `bokeh`, `globe`, `fire`). Simbang
  Gabi, Parol Making and Christmas Caroling were retired and are rejected by validation.

---

## Related prompt: the AI Christmas caption

Separate from video generation, the app can write a personalized greeting for the chosen
template. It runs through Lovable AI Gateway from an authenticated server function
(`src/lib/christmas-message.functions.ts`), with the instructions and per-template themes
built in `src/lib/christmas-message-prompt.server.ts`. Inputs are a recipient name
(1–80 characters) and a short personal greeting (1–300 characters). That prompt is not
part of the video request and does not affect the rendered footage.
