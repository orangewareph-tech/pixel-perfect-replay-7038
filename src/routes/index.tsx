import { createFileRoute, Link } from "@tanstack/react-router";
import { Header, Footer, Snow } from "@/components/SiteChrome";
import { PLANS, TEMPLATES } from "@/lib/site";
import hero from "@/assets/hero.jpg";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MagicPh AI — Family Pic to Christmas Video in 60 seconds" },
      { name: "description", content: "Upload your family photo and get a magical Filipino Christmas video in 60 seconds. P149 lang! GCash & Maya accepted." },
      { property: "og:title", content: "MagicPh AI — Ang Pasko, Magic!" },
      { property: "og:description", content: "Family Pic to Christmas Video in 60 seconds. P149 lang!" },
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

const FAQ = [
  ["Pila ka dugay? (How long?)", "60 seconds lang! Usually 30–60 seconds ang generation."],
  ["Pwede GCash?", "Oo! GCash, Maya, ug PayMongo (cards) accepted."],
  ["Same gihapon ang mga nawong?", "Oo, 100%. Among AI gi-instruct nga dili usbon ang mga nawong."],
  ["Unsa nga size ang video?", "Makakuha ka og 9:16 para TikTok/Reels ug 16:9 para FB feed."],
];

function Index() {
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
              Upload lang imong family photo, kami na bahala mo-himo og magical Christmas video in 60 seconds. <b className="text-gold">P149 ra!</b>
            </p>
            <Link to="/create" className="mt-8 inline-flex rounded-full bg-gold-grad px-7 py-4 text-lg font-extrabold text-gold-foreground shadow-glow transition hover:scale-105">
              Upload Family Photo Now →
            </Link>
            <p className="mt-3 text-sm opacity-75">✓ GCash & Maya · ✓ Faces 100% kept · ✓ TikTok & FB ready</p>
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
            <div key={t.id} className="w-44 shrink-0 snap-start overflow-hidden rounded-2xl bg-card shadow-festive md:w-auto">
              <img src={t.img} alt={t.name} width={768} height={1024} loading="lazy" className="aspect-[3/4] w-full object-cover" />
              <div className="p-3">
                <h3 className="font-bold">{t.name}</h3>
                <p className="text-xs text-muted-foreground">{t.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-secondary py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center text-3xl font-bold text-primary md:text-4xl">Simple Pricing</h2>
          <p className="mt-2 text-center text-muted-foreground">P149 – instant GCash 💸</p>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PLANS.map((p) => {
              const best = "best" in p;
              return (
                <div key={p.id} className={`relative rounded-3xl bg-card p-6 shadow-festive ${best ? "border-4 border-gold lg:scale-105" : "border border-border"}`}>
                  {best && <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gold-grad px-3 py-1 text-xs font-extrabold text-gold-foreground">⭐ BEST SELLER</span>}
                  <h3 className="text-xl font-bold">{p.name}</h3>
                  <p className="mt-2 font-display text-4xl font-bold text-primary">₱{p.price}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{p.detail}</p>
                  <Link to="/create" search={{ plan: p.id }} className={`mt-6 block rounded-full py-3 text-center font-bold ${best ? "bg-festive text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>
                    Choose
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-center text-3xl font-bold text-primary md:text-4xl">2,000+ Happy Pinoy Families ❤️</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {REVIEWS.map((r) => (
            <blockquote key={r.name} className="rounded-3xl bg-card p-6 shadow-festive">
              <div className="text-gold">★★★★★</div>
              <p className="mt-3">“{r.text}”</p>
              <footer className="mt-4 text-sm font-bold text-muted-foreground">— {r.name}</footer>
            </blockquote>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-20">
        <h2 className="text-center text-3xl font-bold text-primary">FAQ</h2>
        <Accordion type="single" collapsible className="mt-6 rounded-3xl bg-card px-6 shadow-festive">
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
