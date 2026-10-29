import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Crown, FlaskConical } from "lucide-react";
import { ownerTestReport, testFalAiGeneration, pollFalTest } from "@/lib/fal-audit.functions";
import { Button } from "@/components/ui/button";
import { FAL_LISTED_COST, type VideoDuration } from "@/lib/video-duration";
import sample from "@/assets/hero.jpg";
import { TEMPLATES } from "@/lib/site";
import { templateSchema } from "@/lib/template-ids";

export function OwnerTestPanel({ photo, template = "parol", duration = 5, onStart, onVideo, onError }: { photo?: string | null; template?: string; duration?: VideoDuration; onStart?: () => void; onVideo?: (url: string) => void; onError?: (message: string) => void }) {
  const reportFn = useServerFn(ownerTestReport); const start = useServerFn(testFalAiGeneration); const poll = useServerFn(pollFalTest);
  const [report, setReport] = useState<Awaited<ReturnType<typeof ownerTestReport>> | null>(null);
  const [busy, setBusy] = useState(false); const [error, setError] = useState(""); const [customerView, setCustomerView] = useState(false);
  const [testTemplate, setTestTemplate] = useState(template);
  async function refresh() { setReport(await reportFn()); }
  useEffect(() => { void refresh().catch(() => {}); }, []);
  async function follow(id: string) {
    for (let i = 0; i < 150; i++) {
      const run = await poll({ data: { id } }); await refresh();
      if (run.status === "FAILED") throw new Error(run.error ?? "Video failed");
      if (run.status === "COMPLETED" && run.video_url) { onVideo?.(run.video_url); return; }
      await new Promise((resolve) => setTimeout(resolve, 4000));
    }
    throw new Error("Still rendering. Resume the saved test instead of submitting again.");
  }
  async function run(d: VideoDuration) {
    if (!window.confirm(`Real provider charge: $${FAL_LISTED_COST[d].toFixed(2)} listed. Continue?`)) return;
    setBusy(true); setError("");
    try {
      let imageUrl = photo;
      if (!imageUrl) { const blob = await (await fetch(sample)).blob(); imageUrl = await new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => typeof reader.result === "string" ? resolve(reader.result) : reject(new Error("Photo unavailable")); reader.onerror = () => reject(new Error("Photo unavailable")); reader.readAsDataURL(blob); }); }
      onStart?.();
      const result = await start({ data: { duration: d, template: templateSchema.parse(photo ? template : testTemplate), imageUrl } }); await follow(result.id);
    } catch (e) { const message = e instanceof Error ? e.message : "Test failed"; setError(message); onError?.(message); }
    finally { setBusy(false); await refresh().catch(() => {}); }
  }
  if (!report?.owner) return null;
  const active = report.runs.find((run) => ["SUBMITTING", "IN_QUEUE", "IN_PROGRESS"].includes(run.status));
  return <section className="mt-6 border-y border-gold py-6"><div className="flex flex-wrap items-center justify-between gap-3"><h2 className="flex items-center gap-2 text-xl font-bold"><Crown />ADMIN · Owner test mode</h2><Button variant="outline" size="sm" aria-pressed={customerView} onClick={() => setCustomerView(!customerView)}>{customerView ? "Return to admin view" : "Switch to customer view"}</Button></div>
    {customerView ? <p className="mt-4">Customer view · approved payment required: ₱149 / 5s or ₱299 / 10s.</p> : <>
      <p className="mt-3 text-sm">Customer payment bypass only · real Fal.ai charges apply. Maximum 3 videos/hour and $10/account/day, within the shared budget.</p>
      {!photo && <label className="mt-3 block text-sm">Test template<select aria-label="Owner test template" className="ml-2 max-w-full rounded-md border border-input bg-background p-2 text-foreground" value={testTemplate} onChange={(e) => setTestTemplate(e.target.value)}>{TEMPLATES.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</select></label>}
      <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3"><div><dt>This hour · all starts</dt><dd className="font-bold">{report.hour}/3</dd></div><div><dt>Today · UTC reserved</dt><dd className="font-bold">${report.accountSpent.toFixed(2)} / $10</dd></div><div><dt>All recorded tests</dt><dd className="font-bold">{report.runs.length} · ${report.totalSpent.toFixed(2)}</dd></div></dl><p className="mt-2 text-sm text-muted-foreground">Account allowance remaining: ${Math.max(0, 10 - report.accountSpent).toFixed(2)}. Not your Fal.ai credit balance.</p>
      <div className="mt-4 flex flex-wrap gap-3">{(photo ? [duration] : [5, 10] as const).map((d) => <Button key={d} className="h-auto whitespace-normal bg-gold text-gold-foreground" disabled={busy || Boolean(active) || report.hour >= 3 || report.accountSpent + FAL_LISTED_COST[d] > 10} onClick={() => void run(d)}><FlaskConical />Generate {d}s FREE (Admin) · costs ${FAL_LISTED_COST[d].toFixed(2)}</Button>)}{!photo && <Button variant="outline" disabled title="Five starts exceed the hourly limit">All 5 templates · $1.75 · exceeds 3/hour</Button>}
      <Button variant="outline" disabled={busy} onClick={() => void refresh()}>Refresh usage</Button>{active?.request_id && <Button disabled={busy} variant="outline" onClick={async () => { setBusy(true); try { await follow(active.id); } catch (e) { setError(String(e)); } finally { setBusy(false); } }}>Resume active test</Button>}</div>
      {busy && <p role="status" className="mt-3">Rendering owner test…</p>}{error && <p role="alert" className="mt-3 break-words text-destructive">{error}</p>}
      {!photo && <div className="mt-5 overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr><th className="py-2">Date</th><th>Template</th><th>Reserved</th><th>Status / video</th></tr></thead><tbody>{report.runs.map((r) => <tr className="border-t" key={r.id}><td className="py-3">{new Date(r.started_at).toLocaleString()}</td><td>{r.template}</td><td>${Number(r.cost_usd).toFixed(2)}</td><td>{r.status}{r.video_url && <a href={r.video_url} target="_blank" rel="noreferrer" className="ml-2 text-primary underline">Open video</a>}</td></tr>)}</tbody></table></div>}
    </>}
  </section>;
}