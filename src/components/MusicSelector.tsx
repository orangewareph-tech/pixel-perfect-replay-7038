import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { MUSIC_OPTIONS, type MusicId } from "@/lib/christmas-music";

export function MusicSelector({ value, onChange, volume, onVolume, loop, onLoop, status, inverse = false }: { value: MusicId; onChange: (value: MusicId) => void; volume: number; onVolume: (value: number) => void; loop: boolean; onLoop: (value: boolean) => void; status: "checking" | "ready" | "missing"; inverse?: boolean }) {
  return <div className={`mt-6 ${inverse ? "text-night-foreground" : "text-foreground"}`}>
    <h2 className={`text-xl font-bold ${inverse ? "text-gold" : "text-christmas-green"}`}>Pili-a ang Christmas music</h2>
    <div className="mt-3 grid gap-2" role="group" aria-label="Christmas music">
      {MUSIC_OPTIONS.map((m) => <Button key={m.id} type="button" variant="ghost" aria-label={m.name} aria-pressed={value === m.id} onClick={() => onChange(m.id)} className={`flex h-auto min-w-0 items-start justify-start gap-3 whitespace-normal rounded-lg border-2 bg-card p-3 text-left text-card-foreground hover:bg-card ${value === m.id ? "border-gold" : "border-input"}`}>
        <span className="text-xl" aria-hidden="true">{m.icon}</span><span className="min-w-0 flex-1"><span className="block font-bold">{m.name}{m.best && <span className="ml-1 text-xs text-primary">· Best Seller</span>}</span><span className="block text-xs text-muted-foreground">{m.detail}{m.id !== "no-music" && " · +₱20 once available"}</span></span>{value === m.id && <Check className="size-4 shrink-0 text-primary" aria-hidden="true" />}
      </Button>)}
    </div>
    {value !== "no-music" && <>
      <p role="status" className="mt-3 text-sm">{status === "checking" ? "Checking music…" : status === "missing" ? "Coming soon — licensed song file needed. Choose No Music to generate now." : "🎵 With Christmas Music — Mas Pasko!"}</p>
      <div className="mt-4 flex items-center gap-4"><label htmlFor="music-volume" className="shrink-0 text-sm font-bold">Volume {volume}%</label><Slider id="music-volume" aria-label="Music volume" min={0} max={100} step={1} value={[volume]} onValueChange={([v]) => onVolume(v ?? 70)} /></div>
      <label className="mt-4 flex items-center gap-2 text-sm"><Checkbox checked={loop} onCheckedChange={(v) => onLoop(v === true)} />Loop music to match video length</label>
    </>}
  </div>;
}