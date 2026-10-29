import { createFileRoute, Link } from "@tanstack/react-router";
import { Header, Footer, Snow } from "@/components/SiteChrome";
import { PLANS, TEMPLATES } from "@/lib/site";
import hero from "@/assets/hero.jpg";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { DurationSelector } from "@/components/DurationSelector";
import { useVideoDuration } from "@/hooks/use-video-duration";
import { durationCheckoutLabel } from "@/lib/video-duration";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { MagicTemplateSelector } from "@/components/MagicTemplateSelector";
import { MusicSelector } from "@/components/MusicSelector";
import { useChristmasChoices } from "@/hooks/use-christmas-choices";
import { useMusicFile } from "@/hooks/use-music-file";
import { christmasTotal, DEFAULT_MUSIC_VOLUME } from "@/lib/christmas-music";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MagicPh AI — Family Pic to Christmas Video in 60 seconds" },
      { name: "description", content: "Create Filipino family Christmas videos with parol glow, snowfall, fairy lights and optional licensed music. 5 seconds from ₱149; 10 seconds from ₱299. Demo checkout." },
      { property: "og:title", content: "MagicPh AI — Ang Pasko, Magic!" },
      { property: "og:description", content: "Five festive effects, 5- or 10-second family videos and optional Christmas music. Gikan ₱149 ra!" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const REVIEWS = [
  { name: "Joy D., Cebu", text: "Grabe ka nindot! Ang among family pic nahimong Christmas video. Nihilak akong Lola!" },
  { name: "Mark R., Davao", text: "Wala gyud nausab ang mga nawong. Gi-post nako sa FB, daghan kaayo likes!" },
  { name: "Ana L., Manila", text: "Super bilis, wala pang 1 minute. GCash pa, sobrang dali. Sulit ang P149!" },
];

const FAQ: [string, string][] = [
  ["Pila ka dugay? (How long?)", "Ang 5-second video: estimated 30–60 seconds. Ang 10-second Premium: estimated 2–3 minutes. Usahay mas dugay kung busy ang queue."],
  ["Pwede GCash?", "GCash ug Maya ang planned payment options. Demo pa ang checkout karon; wala pa ang verified secure payment."],
  ["Same gihapon ang mga nawong?", "Among AI gi-instruct nga ipabilin ang inyong mga nawong. Tan-awa ang result; dili guaranteed nga 100% identical ang output."],
  ["Unsa nga size ang video?", "Makakuha ka og 9:16 para TikTok/Reels ug 16:9 para FB feed."],
];

function Index() {
  const [duration, setDuration] = useVideoDuration();
  const { template, chooseTemplate, music, chooseMusic } = useChristmasChoices();
  const [volume, setVolume] = useState(DEFAULT_MUSIC_VOLUME);
  const [loopMusic, setLoopMusic] = useState(true);
  const track = useMusicFile(music, duration);
  return (
    <div className="min-h-screen">
      <Header />
      <section className="relative overflow-hidden bg-night-grad text-night-foreground">
        <Snow />
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 md:grid-cols-2 md:py-20">
          <div>
            <span className="inline-block rounded-full bg-gold-grad px-3 py-1 text-xs font-extrabold text-gold-foreground">
              ⭐ Ang Pasko, Magic!
            </span>
            <h1 className="mt-4 text-4xl font-bold leading-tight md:text-6xl">
              Himoa Imong Family Pic nga <span className="text-gold">Christmas Magic!</span> 🎄
            </h1>
            <p className="mt-4 text-lg opacity-90">
              Upload lang imong family photo, kami na bahala sa Christmas magic. 5 segundos, estimated 30–60 seconds; Premium 10 segundos, 2–3 minutes. <b className="text-gold">Gikan ₱149 ra!</b>
            </p>
            <MagicTemplateSelector value={template} onChange={chooseTemplate} inverse />
            <MusicSelector value={music} onChange={chooseMusic} volume={volume} onVolume={setVolume} loop={loopMusic} onLoop={setLoopMusic} status={track.status} inverse />
            <DurationSelector duration={duration} onChange={setDuration} music={music} musicReady={track.status === "ready"} inverse />
            <Button asChild className="mt-6 h-auto w-full whitespace-normal rounded-full bg-gold-grad px-5 py-4 text-base font-extrabold text-gold-foreground shadow-glow">
              <Link to="/create" search={{ duration, template, music, plan: duration === 5 ? "hd" : undefined }}>{music === "no-music" ? durationCheckoutLabel(duration) : `Upload Photo · ₱${christmasTotal(duration, music)} once music is available →`}</Link>
            </Button>
            <Link to="/create" search={{ duration, template, music, plan: duration === 5 ? "hd" : undefined }} className="mt-4 inline-flex font-bold text-gold underline">
              Upload Family Photo Now →
            </Link>
            <ul className="mt-4 space-y-2 text-sm opacity-90"><li>✓ Faces preserved with care</li><li>✓ {duration === 5 ? "Estimated 30–60 seconds" : "Estimated 2–3 minutes"}</li><li>✓ TikTok & FB Reels ready</li><li>GCash & Maya · demo checkout; secure payment coming soon</li></ul>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <figure className="relative overflow-hidden rounded-3xl border-4 border-night-foreground/20">
              <img src={hero} alt="Family photo before" width={1088} height={1360} className="aspect-[9/16] w-full object-cover grayscale-[40%]" />
              <figcaption className="absolute left-2 top-2 rounded-full bg-night/80 px-2 py-1 text-xs font-bold">BEFORE</figcaption>
            </figure>
            <figure className="relative overflow-hidden rounded-3xl border-4 border-gold shadow-glow">
              <img src={TEMPLATES[2].img} alt="Christmas video after" width={768} height={1024} className="animate-kenburns aspect-[9/16] w-full object-cover" />
              <Snow count={18} />
              <figcaption className="absolute left-2 top-2 rounded-full bg-primary px-2 py-1 text-xs font-bold text-primary-foreground">AFTER ▶</figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-center text-3xl font-bold text-primary md:text-4xl">5 Magical Templates</h2>
        <div className="mt-8 flex snap-x gap-4 overflow-x-auto pb-4 md:grid md:grid-cols-5">
          {TEMPLATES.map((t) => (
            <Link key={t.id} to="/create" search={{ template: t.id, duration, music }} aria-label={`Choose ${t.name}`} className="w-44 shrink-0 snap-start overflow-hidden rounded-2xl bg-card shadow-festive transition hover:ring-2 hover:ring-gold focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gold md:w-auto">
              <img src={t.img} alt={t.name} width={768} height={1024} loading="lazy" className="aspect-[3/4] w-full object-cover" />
              <div className="p-3">
                <h3 className="font-bold">{t.name}</h3>
                <p className="text-xs text-muted-foreground">{t.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-secondary py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center text-3xl font-bold text-primary md:text-4xl">Simple Pricing</h2>
          <p className="mt-2 text-center text-muted-foreground">5 segundos · ₱149 &nbsp; / &nbsp; 10 segundos Premium · ₱299</p>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PLANS.map((p) => {
              const best = "best" in p;
              return (
                <div key={p.id} className={`relative rounded-3xl bg-card p-6 shadow-festive ${best ? "border-4 border-gold lg:scale-105" : "border border-border"}`}>
                  {best && <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gold-grad px-3 py-1 text-xs font-extrabold text-gold-foreground">⭐ BEST SELLER</span>}
                  <h3 className="text-xl font-bold">{p.name}</h3>
                  <p className="mt-2 font-display text-4xl font-bold text-primary">₱{p.price}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{p.detail}</p>
                  <Button asChild className={`mt-6 h-auto w-full rounded-full py-3 font-bold ${best ? "bg-festive text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}><Link to="/create" search={{ plan: p.id, duration: 5 }}>
                    Choose
                  </Link></Button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-center text-3xl font-bold text-primary md:text-4xl">2,000+ Happy Pinoy Families ❤️</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {REVIEWS.map((r) => (
            <blockquote key={r.name} className="flex flex-col rounded-2xl border border-border/60 bg-card p-7 shadow-festive">
              <div className="text-gold">★★★★★</div>
              <p className="mb-6 mt-4 flex-1 leading-relaxed">“{r.text}”</p>
              <footer className="border-t border-border/60 pt-4 text-sm font-bold text-muted-foreground">— {r.name}</footer>
            </blockquote>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-20">
        <h2 className="text-center text-3xl font-bold text-primary">FAQ</h2>
        <Accordion type="single" collapsible defaultValue={FAQ[0]?.[0] ?? ""} className="mt-6 rounded-3xl bg-card px-6 shadow-festive">
          {FAQ.map(([q, a]) => (
            <AccordionItem key={q} value={q}>
              <AccordionTrigger className="text-left font-bold">{q}</AccordionTrigger>
              <AccordionContent>{a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
      <Footer />
    </div>
  );
}
