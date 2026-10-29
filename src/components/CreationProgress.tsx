import { Check } from "lucide-react";

const STEPS = ["Upload", "Template", "Duration", "Payment", "Video"];

export function CreationProgress({ step, complete }: { step: number; complete: boolean }) {
  return <nav aria-label="Video creation progress" className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur">
    <ol className="mx-auto flex max-w-4xl px-3 py-3 sm:px-6">
      {STEPS.map((name, index) => <li key={name} aria-current={index === step ? "step" : undefined} className="relative flex min-w-0 flex-1 flex-col items-center gap-1.5 text-center">
        {index > 0 && <span aria-hidden="true" className={`absolute right-1/2 top-4 h-0.5 w-full ${index <= step ? "bg-christmas-green" : "bg-border"}`} />}
        <span className={`relative flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${index < step || complete ? "bg-christmas-green text-primary-foreground" : index === step ? "bg-festive text-primary-foreground ring-2 ring-gold ring-offset-2 ring-offset-background" : "bg-muted text-muted-foreground"}`}>
          {index < step || complete ? <Check className="size-4" aria-hidden="true" /> : index + 1}
        </span>
        <span className={`relative break-words px-1 text-[10px] font-bold leading-tight sm:text-xs ${index === step ? "text-primary" : "text-muted-foreground"}`}>{name}</span>
      </li>)}
    </ol>
  </nav>;
}