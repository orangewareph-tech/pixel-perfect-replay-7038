import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Copy, Check, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { writeChristmasMessage } from "@/lib/christmas-message.functions";
import { messageInputSchema, type MessageDraft } from "@/lib/christmas-message";

export function ChristmasMessageWriter({ value, onChange, template, templateName, signedIn, online, onSignIn }: {
  value: MessageDraft; onChange: (value: MessageDraft) => void; template: string; templateName: string;
  signedIn: boolean; online: boolean; onSignIn: () => void;
}) {
  const write = useServerFn(writeChristmasMessage);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  async function generate() {
    const parsed = messageInputSchema.safeParse({ recipient: value.recipient, greeting: value.greeting, template });
    if (!parsed.success) { setError(parsed.error.issues[0]?.message ?? "Check your greeting."); return; }
    setBusy(true); setError(""); setCopied(false);
    try {
      const result = await write({ data: parsed.data });
      if (result.error) setError(result.error);
      else onChange({ ...value, message: result.message });
    } catch (e) { setError(e instanceof Error ? e.message : "Dili makahimo ug message karon."); }
    finally { setBusy(false); }
  }
  return <section aria-labelledby="christmas-message-title" className="mt-6 border-t pt-6 text-left">
    <div className="flex items-center gap-2"><Sparkles className="size-5 text-gold" aria-hidden="true" /><h2 id="christmas-message-title" className="text-xl font-bold text-primary">Personal nga Christmas message</h2><span className="text-xs text-muted-foreground">Optional</span></div>
    <p className="mt-1 text-sm text-muted-foreground">Para sa {templateName}</p>
    <div className="mt-4 space-y-4">
      <div><Label htmlFor="christmas-recipient">Ngalan sa recipient</Label><Input id="christmas-recipient" maxLength={80} value={value.recipient} placeholder="Pananglitan: Mama Rosa" disabled={busy} onChange={(e) => { onChange({ ...value, recipient: e.target.value, message: "" }); setError(""); }} className="mt-2" /></div>
      <div><Label htmlFor="christmas-greeting">Imong mubo nga greeting</Label><Textarea id="christmas-greeting" maxLength={300} value={value.greeting} placeholder="Salamat sa imong gugma. Gimingaw mi nimo karong Pasko." disabled={busy} onChange={(e) => { onChange({ ...value, greeting: e.target.value, message: "" }); setError(""); }} className="mt-2" /><p className="mt-1 text-right text-xs text-muted-foreground">{value.greeting.length}/300</p></div>
      {signedIn ? <Button onClick={() => void generate()} disabled={busy || !online || !value.recipient.trim() || !value.greeting.trim()} className="h-auto min-h-10 whitespace-normal">{busy ? <Loader2 className="animate-spin" /> : <Sparkles />}{busy ? "Gihimo ang imong message…" : value.message ? "Himo ug laing message" : "Himoa ang Christmas message"}</Button> : <Button variant="outline" onClick={onSignIn}>Sign in para sa AI message< Sparkles /></Button>}
      {!online && <p className="text-sm text-muted-foreground">Kinahanglan ug internet para sa AI message.</p>}
      {error && <p role="alert" className="break-words text-sm text-destructive">{error}</p>}
      {value.message && <div aria-live="polite"><Label htmlFor="christmas-result">Imong Christmas message</Label><Textarea id="christmas-result" value={value.message} onChange={(e) => { onChange({ ...value, message: e.target.value }); setCopied(false); }} className="mt-2 min-h-32" /><Button variant="outline" size="sm" className="mt-3" onClick={async () => { try { await navigator.clipboard.writeText(value.message); setCopied(true); } catch { setError("Dili ma-copy karon. Pilia ang message ug i-copy."); } }}>{copied ? <Check /> : <Copy />}{copied ? "Na-copy na" : "Copy message"}</Button><p className="mt-2 text-xs text-muted-foreground">Caption o greeting lang; dili kini text sulod sa video.</p></div>}
    </div>
  </section>;
}