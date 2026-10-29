import { Slider } from "@/components/ui/slider";
import { movementSchema, MOVEMENT_LABELS, type VideoMovement } from "@/lib/video-movement";

export function MovementSelector({ value, onChange }: { value: VideoMovement; onChange: (value: VideoMovement) => void }) {
  return <div className="mx-auto mt-6 max-w-lg border-y border-border py-5">
    <div className="mb-5 flex items-center justify-between gap-3"><span className="font-bold text-primary">Kusog sa movement</span><output className="font-bold text-christmas-green">{MOVEMENT_LABELS[value]}</output></div>
    <Slider aria-label="Movement level" aria-valuetext={MOVEMENT_LABELS[value]} min={0} max={3} step={1} value={[movementSchema.options.indexOf(value)]} onValueChange={([index]) => { const next = movementSchema.options[index ?? 3]; if (next) onChange(next); }} />
    <div className="mt-3 flex justify-between text-xs text-muted-foreground">{movementSchema.options.map((level) => <span key={level} className={level === value ? "font-bold text-primary" : ""}>{MOVEMENT_LABELS[level]}</span>)}</div>
  </div>;
}