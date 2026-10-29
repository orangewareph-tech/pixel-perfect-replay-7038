import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TEMPLATES } from "@/lib/site";

export function MagicTemplateSelector({ value, onChange, inverse = false }: { value: string; onChange: (value: string) => void; inverse?: boolean }) {
  return <div className="mt-6">
    <h2 className={`text-xl font-bold ${inverse ? "text-gold" : "text-christmas-green"}`}>Pili-a ang magic template</h2>
    <div role="group" aria-label="Magic template" className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
      {TEMPLATES.map((t) => <Button key={t.id} variant="ghost" type="button" aria-label={t.name} aria-pressed={value === t.id} onClick={() => onChange(t.id)} className={`relative flex h-auto min-w-0 flex-col items-start gap-1 whitespace-normal rounded-lg border-2 bg-card p-3 text-left text-card-foreground hover:bg-card ${value === t.id ? "border-gold shadow-glow" : "border-input"}`}>
        <span className="flex w-full items-center justify-between"><span className="text-2xl" aria-hidden="true">{t.icon}</span>{value === t.id && <Check className="size-4 text-primary" aria-hidden="true" />}</span>
        <span className="mt-1 font-display font-bold">{t.name}</span><span className="text-xs text-muted-foreground">{t.desc}</span>
      </Button>)}
    </div>
    <p className={`mt-3 text-xs font-bold ${inverse ? "text-gold" : "text-christmas-green"}`}>✨ More Magical! Snowfall · Sparkles · Parol Glow</p>
  </div>;
}