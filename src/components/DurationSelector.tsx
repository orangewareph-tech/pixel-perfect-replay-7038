import { Check, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DURATION_OFFERS, type VideoDuration } from "@/lib/video-duration";
import { christmasTotal, type MusicId } from "@/lib/christmas-music";

export function DurationSelector({ duration, onChange, inverse = false, music = "no-music", musicReady = true, compact = false }: { duration: VideoDuration; onChange: (value: VideoDuration) => void; inverse?: boolean; music?: MusicId; musicReady?: boolean; compact?: boolean }) {
  const offer = DURATION_OFFERS[duration];
  return (
    <div className={`mt-6 ${inverse ? "text-night-foreground" : "text-foreground"}`}>
      <h2 className={`mb-3 text-xl font-bold ${inverse ? "text-gold" : "text-christmas-green"}`}>Pili-a ang haba sa video</h2>
      <div className="grid gap-3 sm:grid-cols-2" role="group" aria-label="Video duration">
        {([5, 10] as const).map((value) => {
          const item = DURATION_OFFERS[value];
          return (
            <Button key={value} variant="ghost" type="button" aria-label={`${value} seconds`} aria-pressed={duration === value} onClick={() => onChange(value)} className={`flex h-auto min-w-0 flex-col items-stretch gap-0 whitespace-normal rounded-lg border-2 bg-card p-4 text-left text-card-foreground hover:bg-card ${duration === value ? "border-gold shadow-glow" : "border-input"}`}>
              <span className="flex items-center justify-between gap-2">
                <span className={`rounded-full px-2 py-1 text-xs font-bold ${value === 5 ? "bg-primary text-primary-foreground" : "bg-gold text-gold-foreground"}`}>{item.badge}</span>
                {duration === value ? <Check className="text-primary" aria-hidden="true" /> : <Circle className="text-muted-foreground" aria-hidden="true" />}
              </span>
              <span className="mt-3 font-display text-lg font-bold">{item.title}</span>
              <span className="mt-1 text-xs text-muted-foreground">{item.subtitle}</span>
              <span className="mt-3 flex items-baseline gap-2"><strong className="font-display text-3xl text-primary">₱{item.price}</strong>{"originalPrice" in item && <s className="text-muted-foreground">₱{item.originalPrice}</s>}</span>
              {!compact && <span className="mt-3 flex flex-col gap-1 text-xs">{item.details.map((detail) => <span key={detail}>✓ {detail}</span>)}</span>}
            </Button>
          );
        })}
      </div>
      <p className="mt-4 font-bold text-gold">{offer.delivery}</p>
      <p aria-live="polite" className={`mt-2 ${compact ? "font-display text-2xl text-primary" : "text-sm"}`}>Total: <b>₱{christmasTotal(duration, music)}</b> · Christmas music included 🎵</p>
      <p className="mt-1 text-xs">{musicReady ? "Automatic Christmas soundtrack · no extra charge" : "Loading included soundtrack…"}</p>
    </div>
  );
}