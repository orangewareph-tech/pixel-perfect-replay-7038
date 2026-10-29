import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { Header, Footer, Snow } from "@/components/SiteChrome";
import { TEMPLATES, isAllowedPhoto } from "@/lib/site";
import { startVideo, checkVideo, downloadVideo } from "@/lib/fal.functions";
import logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import { DurationSelector } from "@/components/DurationSelector";
import { useVideoDuration } from "@/hooks/use-video-duration";
import { DURATION_OFFERS, videoDurationSchema } from "@/lib/video-duration";
import { MagicTemplateSelector } from "@/components/MagicTemplateSelector";
import { MusicSelector } from "@/components/MusicSelector";
import { MusicVideoPlayer } from "@/components/MusicVideoPlayer";
import { useChristmasChoices } from "@/hooks/use-christmas-choices";
import { useMusicFile } from "@/hooks/use-music-file";
import { christmasTotal, DEFAULT_MUSIC_VOLUME, musicOption, musicSchema, musicCheckoutLabel } from "@/lib/christmas-music";

export const Route = createFileRoute("/create")({
  validateSearch: z.object({ plan: z.string().optional(), template: z.string().optional(), music: musicSchema.optional().catch(undefined), duration: z.coerce.number().pipe(videoDurationSchema).optional().catch(undefined) }),
  head: () => ({
    meta: [
      { title: "Create Your Christmas Video — MagicPh AI" },
      { name: "description", content: "Create a Filipino Christmas video with parol glow, snowfall and optional licensed music. Pick 5 or 10 seconds; checkout is currently a demo." },
      { property: "og:title", content: "Create Your Christmas Video — MagicPh AI" },
      { property: "og:description", content: "Turn your family photo into Pinoy Christmas magic with five festive effects and optional music." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Create,
});

const STEPS = ["Upload", "Template", "Preview", "Payment", "Video"];

function Create() {
  const { template: templateParam, duration: durationParam, music: musicParam } = Route.useSearch();
  const [duration, setDuration] = useVideoDuration(durationParam);
  const offer = DURATION_OFFERS[duration];
  const [step, setStep] = useState(0);
  const [photo, setPhoto] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const { template: tpl, chooseTemplate: setTpl, music, chooseMusic: setMusic } = useChristmasChoices(templateParam, musicParam);
  const [volume, setVolume] = useState(DEFAULT_MUSIC_VOLUME);
  const [loopMusic, setLoopMusic] = useState(true);
  const track = useMusicFile(music, duration);
  const total = christmasTotal(duration, music);
  const musicReady = music === "no-music" || track.status === "ready";
  const [ratio, setRatio] = useState<"9:16" | "16:9">("9:16");
  const [progress, setProgress] = useState(0);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [genErr, setGenErr] = useState<string | null>(null);
  const [drag, setDrag] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const start = useServerFn(startVideo);
  const check = useServerFn(checkVideo);
  const download = useServerFn(downloadVideo);
  const template = TEMPLATES.find((t) => t.id === tpl) ?? TEMPLATES[0];
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  async function saveVideo() {
    if (!videoUrl || saving) return;
    setSaving(true); setSaveError("");
    try {
      const chunks: Uint8Array<ArrayBuffer>[] = [];
      let offset = 0;
      while (true) {
        const result = await download({ data: { videoUrl, offset } });
        const bytes = Uint8Array.from(atob(result.base64), (character) => character.charCodeAt(0));
        chunks.push(bytes);
        offset = result.nextOffset;
        if (offset >= result.total) break;
      }
      let output = new Blob(chunks, { type: "video/mp4" });
      if (music !== "no-music") {
        if (!track.blob) throw new Error("Music could not load. Reselect your track and try again.");
        const { embedMusic } = await import("@/lib/embed-music");
        output = await embedMusic(output, track.blob, volume, loopMusic, duration);
      }
      const objectUrl = URL.createObjectURL(output);
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = music === "no-music" ? "magicph-christmas.mp4" : "magicph-christmas-with-music.mp4";
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(objectUrl), 60_000);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Could not save. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  function onFile(f?: File) {
    if (!f) return;
    if (!isAllowedPhoto(f)) return setErr("JPG o PNG lang, max 10MB.");
    setErr(null);
    const r = new FileReader();
    r.onload = () => { setPhoto(r.result as string); setStep(1); };
    r.readAsDataURL(f);
  }

  async function generate() {
    if (!photo) { setErr("Please upload a family photo first."); setStep(0); return; }
    if (!musicReady) { setErr("Music is still loading. Please wait and try again."); return; }
    setStep(4); setProgress(3); setGenErr(null); setVideoUrl(null);
    const timer = setInterval(() => setProgress((p) => Math.min(p + 1.5, 95)), 800);
    try {
      const { requestId } = await start({ data: { imageUrl: photo, scene: template.scene, duration } });
      for (let i = 0; i < 90; i++) {
        await new Promise((r) => setTimeout(r, 4000));
        const s = await check({ data: { requestId } });
        if (s.status === "COMPLETED") {
          if (!s.videoUrl) throw new Error("No video returned");
          setVideoUrl(s.videoUrl); setProgress(100); return;
        }
      }
      throw new Error("Taking too long — please try again.");
    } catch (e) {
      setGenErr(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      clearInterval(timer);
    }
  }

  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [step]);

  const shareUrl = typeof window !== "undefined" ? window.location.origin : "https://magicph.ai";

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <ol className="mb-8 flex justify-between gap-1">
          {STEPS.map((s, i) => (
            <li key={s} className="flex flex-1 flex-col items-center gap-1 text-xs font-bold">
              <span className={`flex h-8 w-8 items-center justify-center rounded-full ${i <= step ? "bg-festive text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{i + 1}</span>
              <span className={i <= step ? "text-primary" : "text-muted-foreground"}>{s}</span>
            </li>
          ))}
        </ol>

        {step === 0 && (
          <section>
            <h1 className="text-center text-3xl font-bold text-primary">Upload Your Family Photo</h1>
            <MagicTemplateSelector value={tpl} onChange={setTpl} />
            <MusicSelector value={music} onChange={setMusic} volume={volume} onVolume={setVolume} loop={loopMusic} onLoop={setLoopMusic} status={track.status} audioUrl={track.url} />
            <DurationSelector duration={duration} onChange={setDuration} music={music} musicReady={musicReady} />
            <Button
              type="button"
              variant="ghost"
              onClick={() => inputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
              onDragLeave={() => setDrag(false)}
              onDrop={(e) => { e.preventDefault(); setDrag(false); onFile(e.dataTransfer.files[0]); }}
              className={`mt-6 flex h-auto w-full flex-col items-center whitespace-normal rounded-3xl border-4 border-dashed p-8 text-center transition ${drag ? "border-gold bg-secondary" : "border-border bg-card"}`}
            >
              <span className="text-6xl">📸</span>
              <span className="mt-4 font-display text-xl font-bold">{musicCheckoutLabel(duration, music)}</span>
              <span className="mt-1 text-sm text-muted-foreground">JPG or PNG · max 10MB</span>
            </Button>
            <input ref={inputRef} type="file" accept="image/jpeg,image/png" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
            {err && <p className="mt-3 text-center font-bold text-destructive">{err}</p>}
          </section>
        )}

        {step === 1 && (
          <section>
            <h1 className="text-center text-3xl font-bold text-primary">Pinoy Christmas Magic</h1>
            <MagicTemplateSelector value={tpl} onChange={setTpl} />
            <MusicSelector value={music} onChange={setMusic} volume={volume} onVolume={setVolume} loop={loopMusic} onLoop={setLoopMusic} status={track.status} audioUrl={track.url} />
            <DurationSelector duration={duration} onChange={setDuration} music={music} musicReady={musicReady} />
            <Nav onBack={() => setStep(0)} onNext={() => setStep(2)} />
          </section>
        )}

        {step === 2 && photo && (
          <section>
            <h1 className="text-center text-3xl font-bold text-primary">Your Preview</h1>
            <RatioToggle ratio={ratio} setRatio={setRatio} />
            <div className={`relative mx-auto mt-4 overflow-hidden rounded-3xl bg-night shadow-glow ${ratio === "9:16" ? "aspect-[9/16] max-w-xs" : "aspect-video"}`}>
              <img src={photo} alt="Your photo" className="animate-kenburns h-full w-full object-cover blur-[1px]" />
              <div className="absolute inset-0 bg-night/20" />
              <Snow count={25} />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-night-foreground opacity-70">
                <img src={logo} alt="" className="h-16 w-16" />
                <span className="font-display text-2xl font-bold">MagicPh AI</span>
                <span className="text-xs">PREVIEW 480p · {template.name}</span>
              </div>
            </div>
            {music !== "no-music" && <p className="mt-4 text-center text-sm">🎵 {musicOption(music).name} · {musicReady ? "Ready — music included in final download" : "Loading music…"}</p>}
            <Nav onBack={() => setStep(1)} onNext={() => setStep(3)} nextLabel="Remove watermark →" />
          </section>
        )}

        {step === 3 && (
          <section>
            <h1 className="text-center text-3xl font-bold text-primary">Choose & Pay</h1>
            <MagicTemplateSelector value={tpl} onChange={setTpl} />
            <MusicSelector value={music} onChange={setMusic} volume={volume} onVolume={setVolume} loop={loopMusic} onLoop={setLoopMusic} status={track.status} audioUrl={track.url} />
            <DurationSelector duration={duration} onChange={setDuration} music={music} musicReady={musicReady} />
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {["GCash", "Maya"].map((m) => (
                <div key={m} className="rounded-2xl bg-card p-4 text-center shadow-festive">
                  <b>{m} QR</b>
                  <div className="mx-auto mt-3 grid h-40 w-40 grid-cols-8 gap-0.5 rounded-lg bg-secondary p-2">
                    {Array.from({ length: 64 }).map((_, i) => (
                      <span key={i} className={(i * 7 + m.length) % 3 === 0 ? "bg-foreground" : ""} />
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">Demo QR · total ₱{total}</p>
                </div>
              ))}
            </div>
            <a href="https://paymongo.com" target="_blank" rel="noreferrer" className="mt-4 block rounded-full bg-festive py-3 text-center font-bold text-primary-foreground">Pay with Card via PayMongo</a>
            <Button onClick={generate} disabled={!musicReady} className="mt-3 h-auto w-full whitespace-normal rounded-full bg-gold-grad py-3 font-extrabold text-gold-foreground shadow-glow">I've paid ₱{total} — Generate {duration} Sec Magic{music !== "no-music" ? " + Music 🎵" : " ✨"}</Button>
            <Button variant="ghost" onClick={generate} disabled={!musicReady} className="mt-2 w-full text-sm text-muted-foreground underline">Skip payment (demo)</Button>
            {err && <p role="alert" className="mt-3 text-destructive">{err}</p>}
            <button onClick={() => setStep(2)} className="mt-4 text-sm font-bold text-primary">← Back</button>
          </section>
        )}

        {step === 4 && (
          <section className="text-center">
            {!videoUrl && !genErr && (
              <div className="relative overflow-hidden rounded-3xl bg-night-grad p-10 text-night-foreground">
                <Snow />
                <img src={logo} alt="" className="animate-twinkle relative mx-auto h-20 w-20" />
                <h1 className="relative mt-4 text-2xl font-bold">Generating your {duration}-second Christmas magic...</h1>
                <p className="relative opacity-80">{offer.renderTime}</p>
                <div className="relative mt-6 h-4 overflow-hidden rounded-full bg-night-foreground/20">
                  <div className="h-full bg-gold-grad transition-all" style={{ width: `${progress}%` }} />
                </div>
                <p className="relative mt-2 text-sm">{Math.round(progress)}%</p>
              </div>
            )}
            {genErr && (
              <div className="rounded-3xl bg-card p-8 shadow-festive">
                <h1 className="text-2xl font-bold text-primary">Oops, wala nahuman 😢</h1>
                <p className="mt-2 text-muted-foreground">{genErr}</p>
                <button onClick={generate} className="mt-4 rounded-full bg-festive px-6 py-3 font-bold text-primary-foreground">Try again</button>
              </div>
            )}
            {videoUrl && (
              <div>
                <h1 className="text-3xl font-bold text-primary">Merry Christmas! 🎄</h1>
                <RatioToggle ratio={ratio} setRatio={setRatio} />
                <MusicVideoPlayer src={videoUrl} music={track.url} musicName={musicOption(music).name} volume={volume} loopMusic={loopMusic} ratio={ratio} />
                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                  <Button onClick={saveVideo} disabled={saving || !musicReady} className="h-auto whitespace-normal rounded-full bg-gold-grad px-6 py-3 font-extrabold text-gold-foreground">{saving ? music === "no-music" ? "Saving…" : "Merging video + music… then downloading!" : music === "no-music" ? "⬇ Save Video" : `⬇ Download with Music — ₱${total}`}</Button>
                  <a href={`fb-messenger://share/?link=${encodeURIComponent(videoUrl)}`} onClick={(e) => { if (!/Mobi/.test(navigator.userAgent)) { e.preventDefault(); window.open(`https://www.facebook.com/dialog/send?link=${encodeURIComponent(videoUrl)}&redirect_uri=${encodeURIComponent(shareUrl)}`); } }} className="rounded-full bg-festive px-6 py-3 font-bold text-primary-foreground">Share to Messenger</a>
                </div>
                {saveError && <p role="alert" className="mt-3 text-sm text-destructive">{saveError}</p>}
                {music !== "no-music" && <p className="mt-2 text-xs text-muted-foreground">Messenger shares the original video. Save the music MP4 to share it with sound.</p>}
              </div>
            )}
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}

function Nav({ onBack, onNext, nextLabel = "Next →" }: { onBack: () => void; onNext: () => void; nextLabel?: string }) {
  return (
    <div className="mt-6 flex justify-between">
      <button onClick={onBack} className="rounded-full px-5 py-3 font-bold text-primary">← Back</button>
      <button onClick={onNext} className="rounded-full bg-festive px-6 py-3 font-bold text-primary-foreground shadow-festive">{nextLabel}</button>
    </div>
  );
}

function RatioToggle({ ratio, setRatio }: { ratio: string; setRatio: (r: "9:16" | "16:9") => void }) {
  return (
    <div className="mt-4 flex justify-center gap-2">
      {(["9:16", "16:9"] as const).map((r) => (
        <button key={r} onClick={() => setRatio(r)} className={`rounded-full px-4 py-1 text-sm font-bold ${ratio === r ? "bg-festive text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
          {r === "9:16" ? "9:16 TikTok/Reels" : "16:9 FB Feed"}
        </button>
      ))}
    </div>
  );
}
