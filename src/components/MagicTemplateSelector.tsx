import { useState } from "react";
import { Check, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { TEMPLATES, TEMPLATE_MEDIA } from "@/lib/site";
import { TEMPLATE_WEBM } from "@/lib/template-preview-formats";

export function MagicTemplateSelector({ value, onChange, inverse = false, compact = false }: { value: string; onChange: (value: string) => void; inverse?: boolean; compact?: boolean }) {
  const [preview, setPreview] = useState<(typeof TEMPLATES)[number] | null>(null);
  return <div className={compact ? "" : "mt-6"}>
    {!compact && <h2 className={`text-xl font-bold ${inverse ? "text-gold" : "text-christmas-green"}`}>Pili-a ang magic template</h2>}
    <div role="group" aria-label="Magic template" className={`${compact ? "" : "mt-3"} grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3`}>
      {TEMPLATES.map((t) => <article key={t.id} className={`group relative min-w-0 overflow-hidden rounded-lg border-2 bg-card text-card-foreground transition-shadow ${value === t.id ? "border-gold shadow-glow" : "border-input"}`}>
        <Button variant="ghost" type="button" aria-label={t.name} aria-pressed={value === t.id} onClick={() => onChange(t.id)} className="flex h-auto w-full flex-col items-start gap-0 whitespace-normal rounded-none p-0 text-left hover:bg-card">
          <span className="relative block h-[200px] w-full overflow-hidden">
            <picture><source srcSet={TEMPLATE_MEDIA[t.id].webp} type="image/webp" /><img src={t.img} alt={TEMPLATE_MEDIA[t.id].alt} width={900} height={600} loading="lazy" className="h-full w-full object-cover transition-transform duration-300 motion-safe:group-hover:scale-110" /></picture>
            <span className="absolute left-3 top-3 rounded-md bg-primary px-2 py-1 text-xs font-bold text-primary-foreground">{TEMPLATE_MEDIA[t.id].badge}</span>
            {value === t.id && <span className="absolute right-3 top-3 flex size-7 items-center justify-center rounded-full bg-gold text-gold-foreground"><Check className="size-4" aria-hidden="true" /></span>}
          </span>
          <span className="flex min-h-24 w-full flex-col gap-1 p-3"><span className="font-display text-base font-bold">{t.name}</span><span className="text-xs text-muted-foreground">{t.desc}</span><span className="mt-1 text-xs text-christmas-green">AI sample · 3-sec preview</span></span>
        </Button>
        <Button type="button" size="icon" variant="ghost" aria-label={`Preview ${t.name}`} title={`Preview ${t.name}`} onClick={() => setPreview(t)} className="absolute left-1/2 top-[76px] size-12 -translate-x-1/2 rounded-full bg-night/70 text-night-foreground opacity-90 hover:bg-night hover:text-night-foreground sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100"><Play className="size-5" aria-hidden="true" /></Button>
      </article>)}
    </div>
    <Dialog open={Boolean(preview)} onOpenChange={(open) => { if (!open) setPreview(null); }}>
      <DialogContent className="w-[calc(100%-2rem)] max-w-2xl rounded-lg">
        <DialogTitle>{preview?.name}</DialogTitle>
        <DialogDescription>Animated AI sample · dili pa imong final video</DialogDescription>
        {preview && <><video key={preview.id} poster={preview.img} aria-label={`${preview.name} sample video`} autoPlay muted playsInline controls preload="metadata" className="aspect-[3/2] w-full rounded-lg bg-night"><source src={TEMPLATE_WEBM[preview.id]} type="video/webm" /><source src={TEMPLATE_MEDIA[preview.id].preview} type="video/mp4" /></video><Button onClick={() => { onChange(preview.id); setPreview(null); }}><Check />Pilia kini nga template</Button></>}
      </DialogContent>
    </Dialog>
    {!compact && <p className={`mt-3 text-xs font-bold ${inverse ? "text-gold" : "text-christmas-green"}`}>✨ More Magical! Snowfall · Sparkles · Parol Glow</p>}
  </div>;
}