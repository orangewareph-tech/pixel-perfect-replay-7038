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
import { MusicVideoPlayer } from "@/components/MusicVideoPlayer";
import { useChristmasChoices } from "@/hooks/use-christmas-choices";
import { useMusicFile } from "@/hooks/use-music-file";
import { canGenerateVideo, useOnlineStatus } from "@/hooks/use-online-status";
import { christmasTotal, DEFAULT_MUSIC_VOLUME, AUTOMATIC_MUSIC, musicSchema } from "@/lib/christmas-music";
import { PaymentPanel } from "@/components/PaymentPanel";
import { listMyPayments } from "@/lib/payments.functions";
import { paymentChoicesSchema } from "@/lib/payment-rules";
import { supabase } from "@/integrations/supabase/client";
import { CreationProgress } from "@/components/CreationProgress";
import { ArrowLeft, ArrowRight, Upload, Download, Share2 } from "lucide-react";
import { saveCreationDraft, takeCreationDraft } from "@/lib/creation-draft";

export const Route = createFileRoute("/create")({
  validateSearch: z.object({ plan: z.string().optional(), template: z.string().optional(), music: musicSchema.optional().catch(undefined), duration: z.coerce.number().pipe(videoDurationSchema).optional().catch(undefined) }),
  head: () => ({
    meta: [
      { title: "Create Your Christmas Video — MagicPh AI" },
      { name: "description", content: "Create a Filipino Christmas video with automatic included music. Pick 5 seconds for ₱149 or 10 seconds for ₱299; approved payment unlocks one video." },
      { property: "og:title", content: "Create Your Christmas Video — MagicPh AI" },
      { property: "og:description", content: "Turn your family photo into Pinoy Christmas magic with five festive effects and automatic included sound." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Create,
});

function Create() {
  const online = useOnlineStatus();
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
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [historyOnly, setHistoryOnly] = useState(false);
  const [saveError, setSaveError] = useState("");
  const listPayments = useServerFn(listMyPayments);
  const [payments, setPayments] = useState<Awaited<ReturnType<typeof listMyPayments>>["payments"]>([]);
  const [signedIn, setSignedIn] = useState(false);
  const [accountEmail, setAccountEmail] = useState("");
  async function refreshPayments() {
    try { const result = await listPayments(); setPayments(result.payments); setAccountEmail(result.email); setSignedIn(true); }
    catch { setSignedIn(false); setPayments([]); }
  }
  useEffect(() => { void supabase.auth.getUser().then(({ data }) => { if (data.user) void refreshPayments(); }); }, []);
  useEffect(() => {
    void takeCreationDraft().then((draft) => {
      if (!draft) return;
      setPhoto(draft.photo); setTpl(draft.template); setMusic(AUTOMATIC_MUSIC); setDuration(draft.duration);
      setVolume(DEFAULT_MUSIC_VOLUME); setLoopMusic(true); setPaymentOpen(true); setStep(3);
    }).catch(() => { /* Upload remains usable if browser storage is unavailable. */ });
  }, []);

  async function signInToPay() {
    if (!photo) return;
    try {
      await saveCreationDraft({ photo, template: tpl, music, duration, volume, loopMusic });
      sessionStorage.setItem("magicph_auth_return", "/create");
      window.location.assign("/auth");
    } catch { setErr("Dili ma-save ang photo para sa sign-in. Ablihi ang Sign in sa laing tab, dayon balik dinhi."); }
  }

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
      {
        if (!track.blob) throw new Error("Music could not load. Reselect your track and try again.");
        const { embedMusic } = await import("@/lib/embed-music");
        output = await embedMusic(output, track.blob, volume, loopMusic, duration);
      }
      const objectUrl = URL.createObjectURL(output);
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = "magicph-christmas-with-music.mp4";
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

  async function generate(paymentId?: string) {
    if (!canGenerateVideo(online)) { setErr("Need internet to generate video"); return; }
    if (!photo) { setErr("Please upload a family photo first."); setStep(0); return; }
    if (!musicReady) { setErr("Music is still loading. Please wait and try again."); return; }
    const payment = payments.find((item) => item.id === paymentId && item.status === "approved" && item.duration === duration && item.template === tpl);
    if (!payment) { setErr(`Please pay first — ₱${total} and an approved video credit are required.`); setStep(3); return; }
    setHistoryOnly(false); setStep(4); setProgress(3); setElapsed(0); setGenErr(null); setVideoUrl(null);
    const timer = setInterval(() => setProgress((p) => Math.min(p + 1.5, 95)), 800);
    try {
      const { requestId } = await start({ data: { imageUrl: photo, paymentId: payment.id } });
      await refreshPayments();
      for (let i = 0; i < 90; i++) {
        await new Promise((r) => setTimeout(r, 4000));
        const s = await check({ data: { requestId } });
        if (s.status === "COMPLETED") {
          if (!s.videoUrl) throw new Error("No video returned");
          setVideoUrl(s.videoUrl); setProgress(100); return;
        }
      }
      throw new Error("Wala pa mahuman. Tan-awa ang saved request; ayaw pagbayad o generate usab.");
    } catch (e) {
      setGenErr(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      clearInterval(timer);
      await refreshPayments();
    }
  }

  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [step]);
  useEffect(() => {
    if (step !== 4 || videoUrl || genErr || historyOnly) return;
    const timer = setInterval(() => setElapsed((seconds) => seconds + 1), 1000);
    return () => clearInterval(timer);
  }, [step, videoUrl, genErr, historyOnly]);

  async function shareVideo(platform: "Facebook" | "TikTok") {
    if (!videoUrl) return;
    if (navigator.share) {
      try { await navigator.share({ title: "MagicPh AI Christmas", url: videoUrl }); }
      catch (error) { if (!(error instanceof DOMException && error.name === "AbortError")) setSaveError("Dili ma-share karon. I-download ang video ug i-upload sa imong app."); }
    } else if (platform === "Facebook") window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(videoUrl)}`, "_blank", "noopener,noreferrer");
    else { await saveVideo(); }
  }

  const shareUrl = typeof window !== "undefined" ? window.location.origin : "https://magicph.ai";

  return (
    <div className="min-h-screen">
      <Header sticky={false} />
      <CreationProgress step={step} complete={Boolean(videoUrl)} />
      <main className="mx-auto max-w-4xl px-4 py-6 sm:py-8">

        {step === 0 && (
          <section>
            <h1 className="text-center text-2xl font-bold text-primary sm:text-3xl">I-upload ang imong family photo</h1>
            <Button
              type="button"
              variant="ghost"
              onClick={() => inputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
              onDragLeave={() => setDrag(false)}
              onDrop={(e) => { e.preventDefault(); setDrag(false); onFile(e.dataTransfer.files[0]); }}
              aria-label="Upload family photo"
              className={`mx-auto mt-6 flex min-h-64 h-auto w-full max-w-2xl flex-col items-center justify-center whitespace-normal rounded-lg border-2 border-dashed p-8 text-center transition ${drag ? "border-gold bg-secondary" : "border-gold/60 bg-card"}`}
            >
              <Upload className="size-12 text-christmas-green" aria-hidden="true" />
              <span className="mt-4 font-display text-xl font-bold">Pili ug photo o i-drop dinhi</span>
              <span className="mt-1 text-sm text-muted-foreground">JPG or PNG · max 10MB</span>
            </Button>
            <input ref={inputRef} type="file" accept="image/jpeg,image/png" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
            <p className="mt-4 text-center text-sm text-muted-foreground">Mas nindot ang resulta kung klaro ang mga nawong ug hayag ang suga.</p>
            {photo && <div className="mt-4 text-center"><Button variant="outline" onClick={() => setStep(1)}>Gamita ang kasamtangang photo<ArrowRight /></Button></div>}
            {signedIn && payments.some((payment) => payment.request_id || payment.status === "SUBMITTING") && <div className="mt-4 text-center"><Button variant="link" onClick={() => { setHistoryOnly(true); setStep(4); }}>Tan-awa ang saved videos</Button></div>}
            {err && <p className="mt-3 text-center font-bold text-destructive">{err}</p>}
          </section>
        )}

        {step === 1 && (
          <section>
            <h1 className="text-center text-2xl font-bold text-primary sm:text-3xl">Pili-a ang magic template</h1>
            <div className="mt-5">
              <MagicTemplateSelector value={tpl} onChange={setTpl} compact />
              <figure className="mx-auto mt-6 max-w-lg overflow-hidden rounded-lg">
                <img src={template.img} alt={`${template.name} example`} className="aspect-[4/3] w-full object-cover" />
                <figcaption className="mt-3 font-display text-lg font-bold text-christmas-green">{template.icon} {template.name}<span className="mt-1 block font-sans text-xs font-normal text-muted-foreground">Pananglitan sa template · dili pa imong final video</span></figcaption>
              </figure>
            </div>
            <Nav onBack={() => setStep(0)} onNext={() => setStep(2)} />
          </section>
        )}

        {step === 2 && (
          <section>
            <h1 className="text-center text-2xl font-bold text-primary sm:text-3xl">Pili-a ang kadugayon</h1>
            <div className="mx-auto max-w-2xl">
              <DurationSelector duration={duration} onChange={setDuration} music={music} musicReady={musicReady} compact />
            </div>
            <Nav onBack={() => setStep(1)} onNext={() => { setErr(null); setPaymentOpen(false); setStep(3); }} />
          </section>
        )}

        {step === 3 && (
          <section>
            <h1 className="text-center text-2xl font-bold text-primary sm:text-3xl">Kumpirmaha ug bayad</h1>
            {!online && <p role="alert" className="mt-3 text-center text-destructive">Need internet to generate video</p>}
            <div className="mt-6 flex flex-col gap-5 rounded-lg border bg-card p-5 text-card-foreground sm:flex-row">
              {photo && <img src={photo} alt="Imong family photo" className="mx-auto aspect-square w-32 shrink-0 rounded-lg object-cover sm:mx-0" />}
              <dl className="grid min-w-0 flex-1 grid-cols-[auto_1fr] gap-x-4 gap-y-3 text-sm">
                <dt className="text-muted-foreground">Template</dt><dd className="break-words font-bold">{template.name}</dd>
                <dt className="text-muted-foreground">Music</dt><dd className="break-words font-bold">Automatic Christmas soundtrack · included</dd>
                <dt className="text-muted-foreground">Kadugayon</dt><dd className="font-bold">{duration} segundos</dd>
                <dt className="border-t pt-3 font-bold">Total</dt><dd aria-live="polite" className="border-t pt-3 font-display text-2xl font-bold text-primary">₱{total}</dd>
              </dl>
            </div>
            <p className="mt-4 text-center text-xs text-muted-foreground">Gipaningkamotan nga mapreserbar ang mga nawong · Gibanabana: {duration === 5 ? "30–60 segundos" : "2–3 minutos"} human ma-approve ang bayad.</p>
            <Button onClick={() => setPaymentOpen(true)} className="mt-5 h-12 w-full text-base" disabled={!musicReady}>Pay with GCash / Maya · ₱{total}</Button>
            {paymentOpen && (!signedIn ? <div className="mt-6 border-t py-6"><p className="font-bold">🔒 Sign in una sa pagbayad. Usa ka approved payment para sa usa ka video.</p><Button onClick={() => void signInToPay()} className="mt-4">Sign in to pay</Button></div> : <><p className="mt-4 text-sm">{accountEmail} · Max 3 generations per hour</p><PaymentPanel choices={paymentChoicesSchema.parse({ duration, music, template: tpl })} payments={payments} onRefresh={refreshPayments} onApproved={(payment) => { if (!online || !musicReady) { setErr(!online ? "Need internet to generate video" : "Wait for music to load"); return; } void generate(payment.id); }} /></>)}
            {err && <p role="alert" className="mt-3 text-destructive">{err}</p>}
            <Button variant="ghost" onClick={() => setStep(2)} className="mt-4"><ArrowLeft />Balik</Button>
          </section>
        )}

        {step === 4 && (
          <section className="text-center">
            {historyOnly && !videoUrl && <><h1 className="text-2xl font-bold text-primary">Imong saved videos</h1><Button variant="ghost" onClick={() => { setHistoryOnly(false); setStep(0); }} className="mt-3"><ArrowLeft />Balik sa upload</Button></>}
            {!historyOnly && !videoUrl && !genErr && (
              <div className="relative overflow-hidden rounded-3xl bg-night-grad p-10 text-night-foreground">
                <Snow />
                <img src={logo} alt="" className="animate-twinkle relative mx-auto h-20 w-20" />
                <h1 className="relative mt-4 text-2xl font-bold">Gihimo ang imong Christmas magic...</h1>
                <p className="relative opacity-80">{offer.renderTime} · {duration} segundos nga video</p>
                <p className="relative mt-2 text-sm">{elapsed < (duration === 5 ? 60 : 180) ? `Gibanabanang nahabilin: ${Math.max(1, (duration === 5 ? 60 : 180) - elapsed)} segundos` : "Gihimo pa ang video — mahimong mas dugay ang paghulat."}</p>
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
                <p className="mt-3 text-sm">Your payment and request are saved. Check the existing request before paying or retrying.</p><Button onClick={() => setStep(3)} className="mt-4">View payment status</Button>
              </div>
            )}
            {videoUrl && (
              <div>
                <h1 className="text-3xl font-bold text-primary">Merry Christmas! 🎄</h1>
                <RatioToggle ratio={ratio} setRatio={setRatio} />
                <MusicVideoPlayer src={videoUrl} music={track.url} musicName="Christmas soundtrack" volume={volume} loopMusic={loopMusic} ratio={ratio} />
                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                  <Button onClick={saveVideo} disabled={saving || !musicReady} className="h-auto whitespace-normal rounded-full bg-gold-grad px-6 py-3 font-extrabold text-gold-foreground"><Download />{saving ? music === "no-music" ? "Gi-save…" : "Gihiusa ang video ug music…" : "Download Video"}</Button>
                  <Button variant="outline" onClick={() => void shareVideo("Facebook")}><Share2 />Facebook</Button>
                  <Button variant="outline" onClick={() => void shareVideo("TikTok")} disabled={saving || !musicReady}><Share2 />TikTok</Button>
                  <a href={`fb-messenger://share/?link=${encodeURIComponent(videoUrl)}`} onClick={(e) => { if (!/Mobi/.test(navigator.userAgent)) { e.preventDefault(); window.open(`https://www.facebook.com/dialog/send?link=${encodeURIComponent(videoUrl)}&redirect_uri=${encodeURIComponent(shareUrl)}`); } }} className="rounded-full bg-festive px-6 py-3 font-bold text-primary-foreground">Share to Messenger</a>
                </div>
                {saveError && <p role="alert" className="mt-3 text-sm text-destructive">{saveError}</p>}
                {music !== "no-music" && <p className="mt-2 text-xs text-muted-foreground">Messenger shares the original video. Save the music MP4 to share it with sound.</p>}
                <p className="mt-2 text-xs text-muted-foreground">I-upload ang na-download nga video sa TikTok o Facebook para apil ang music.</p>
              </div>
            )}
          </section>
        )}
        {step === 4 && signedIn && payments.some((payment) => payment.request_id || payment.status === "SUBMITTING") && <section className="mt-8 border-t py-6"><h2 className="text-xl font-bold text-primary">Your saved videos</h2><ul className="mt-3 space-y-3">{payments.filter((payment) => payment.request_id || payment.status === "SUBMITTING").map((payment) => <li key={payment.id} className="flex flex-wrap items-center justify-between gap-3 border-b py-3 text-sm"><span>{payment.duration}s · {payment.status}</span>{payment.request_id && <Button variant="outline" onClick={async () => { if (!payment.request_id) return; try { const result = await check({ data: { requestId: payment.request_id } }); if (result.videoUrl) { setDuration(videoDurationSchema.parse(payment.duration)); setMusic(AUTOMATIC_MUSIC); setTpl(payment.template); setVideoUrl(result.videoUrl); setGenErr(null); setStep(4); } else setErr(`Video status: ${result.status}. Check again shortly.`); await refreshPayments(); } catch (error) { setErr(error instanceof Error ? error.message : "Could not check video"); } }}>Open / check video</Button>}{payment.status === "SUBMITTING" && <span className="text-muted-foreground">Administrator review needed — do not retry</span>}</li>)}</ul></section>}
      </main>
      <Footer />
    </div>
  );
}

function Nav({ onBack, onNext, nextLabel = "Sunod" }: { onBack: () => void; onNext: () => void; nextLabel?: string }) {
  return (
    <div className="mt-6 flex justify-between">
      <Button variant="ghost" onClick={onBack}><ArrowLeft />Balik</Button>
      <Button onClick={onNext}>{nextLabel}<ArrowRight /></Button>
    </div>
  );
}

function RatioToggle({ ratio, setRatio }: { ratio: string; setRatio: (r: "9:16" | "16:9") => void }) {
  return (
    <div className="mt-4 flex justify-center gap-2">
      {(["9:16", "16:9"] as const).map((r) => (
        <Button key={r} variant={ratio === r ? "default" : "outline"} size="sm" aria-pressed={ratio === r} onClick={() => setRatio(r)}>
          {r === "9:16" ? "9:16 TikTok/Reels" : "16:9 FB Feed"}
        </Button>
      ))}
    </div>
  );
}
