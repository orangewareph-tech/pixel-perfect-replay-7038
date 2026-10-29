import { Check, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DURATION_OFFERS, FAL_LISTED_COST, durationProfit, type VideoDuration } from "@/lib/video-duration";

export function DurationSelector({ duration, onChange }: { duration: VideoDuration; onChange: (value: VideoDuration) => void }) {
  const offer = DURATION_OFFERS[duration];
  return (
    <div className="mt-6 text-foreground">
      <h2 className="mb-3 text-xl font-bold text-christmas-green">Pili-a ang haba sa video</h2>
      <div className="grid gap-3 sm:grid-cols-2" role="group" aria-label="Video duration">
        {([5, 10] as const).map((value) => {
          const item = DURATION_OFFERS[value];
          return (
            <Button key={value} variant="ghost" type="button" aria-label={`${value} seconds`} aria-pressed={duration === value} onClick={() => onChange(value)} className={`flex h-auto min-w-0 flex-col items-stretch gap-0 whitespace-normal rounded-lg border-2 bg-card p-4 text-left hover:bg-card ${duration === value ? "border-gold shadow-glow" : "border-input"}`}>
              <span className="flex items-center justify-between gap-2">
                <span className={`rounded-full px-2 py-1 text-xs font-bold ${value === 5 ? "bg-primary text-primary-foreground" : "bg-gold text-gold-foreground"}`}>{item.badge}</span>
                {duration === value ? <Check className="text-primary" aria-hidden="true" /> : <Circle className="text-muted-foreground" aria-hidden="true" />}
              </span>
              <span className="mt-3 font-display text-lg font-bold">{item.title}</span>
              <span className="mt-1 text-xs text-muted-foreground">{item.subtitle}</span>
              <span className="mt-3 flex items-baseline gap-2"><strong className="font-display text-3xl text-primary">P{item.price}</strong>{"originalPrice" in item && <s className="text-muted-foreground">P{item.originalPrice}</s>}</span>
              <span className="mt-3 flex flex-col gap-1 text-xs">{item.details.map((detail) => <span key={detail}>✓ {detail}</span>)}</span>
            </Button>
          );
        })}
      </div>
      <p className="mt-4 font-bold text-gold">{offer.delivery}</p>
      <p className="mt-2 text-sm">Total: <b>P{offer.price}</b> · You pay P{offer.price} via GCash · {offer.renderTime}</p>
      <p className="mt-1 text-xs opacity-80">Planning estimate: ${offer.falCost.toFixed(2)} (P{(offer.falCost * 58).toFixed(2)}) · Estimated profit: P{durationProfit(duration).toFixed(2)}</p>
      <p className="mt-1 text-xs opacity-80">Fal.ai listed cost: ${FAL_LISTED_COST[duration].toFixed(2)} per video. Planning estimates exclude this actual cost; delivery and file size vary.</p>
    </div>
  );
}