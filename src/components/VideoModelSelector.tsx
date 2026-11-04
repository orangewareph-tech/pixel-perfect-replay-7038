import { FREE_VIDEO_MODELS, type FreeVideoModel } from "@/lib/free-ai";
import { Button } from "@/components/ui/button";

export function VideoModelSelector({ value, onChange, disabled = false }: { value: FreeVideoModel; onChange: (value: FreeVideoModel) => void; disabled?: boolean }) {
  return <fieldset disabled={disabled} className="space-y-2"><legend className="text-sm font-semibold">Video model</legend><div className="flex flex-wrap gap-2">{FREE_VIDEO_MODELS.map((model) => <Button key={model} disabled={disabled} variant={value === model ? "default" : "outline"} aria-pressed={value === model} onClick={() => onChange(model)}>{model}</Button>)}</div></fieldset>;
}