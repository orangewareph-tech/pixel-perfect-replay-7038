import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { adminCheckTest, adminDashboardStatus, adminStartTest } from "@/lib/admin-dashboard.functions";
import { Header, Footer } from "@/components/SiteChrome";
import { Button } from "@/components/ui/button";
import { VideoModelSelector } from "@/components/VideoModelSelector";
import { FREE_AI_MODEL_IDS, type FreeVideoModel } from "@/lib/free-ai";
import { freeConnectionCheck } from "@/lib/video-audit.functions";
import { RefreshCw, ExternalLink, Play, FlaskConical } from "lucide-react";
import { MovementSelector } from "@/components/MovementSelector";
import { TEMPLATES } from "@/lib/site";
import { DEFAULT_MOVEMENT, type VideoMovement } from "@/lib/video-movement";
import { ADMIN_LIMITS, adminTestQuota, canAdminTest } from "@/lib/owner-tests";
import { VIDEO_BUDGET_RESERVATION, type VideoDuration } from "@/lib/video-duration";

type TestLog = { id: string; email: string; template: string; movement: VideoMovement; duration: VideoDuration; cost: number; model?: FreeVideoModel; timestamp: string; videoUrl: string | null; status: string };
type Batch = { phase: "submitting" | "rendering"; total: number; done: number };
const STORE = "freeai_admin_tests";
const readLogs = (): TestLog[] => { try { return JSON.parse(localStorage.getItem(STORE) ?? "[]"); } catch { return []; } };
const toRecords = (logs: TestLog[]) => logs.map((l) => ({ email: l.email, templateId: l.template, cost: l.cost, duration: l.duration, timestamp: l.timestamp }));

const statusOptions = queryOptions({ queryKey: ["admin-dashboard-status"], queryFn: () => adminDashboardStatus() });

export const Route = createFileRoute("/_authenticated/admin-dashboard")({
  loader: ({ context }) => context.queryClient.ensureQueryData(statusOptions),
  head: () => ({ meta: [{ title: "Free.ai Admin Tests — MagicPh AI" }, { name: "description", content: "Private Free.ai model checks, five-second Christmas video tests and administrator results." }, { property: "og:title", content: "MagicPh AI Free.ai Admin Tests" }, { property: "og:description", content: "Private admin video tests." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }, { name: "robots", content: "noindex" }] }),
  component: AdminDashboard,
});

function AdminDashboard() {
  const status = useSuspenseQuery(statusOptions).data;
  const start = useServerFn(adminStartTest);
  const check = useServerFn(adminCheckTest);
  const connectionCheck = useServerFn(freeConnectionCheck);
  const [connection, setConnection] = useState<{ connected: boolean; detail: string } | null>(null);
  const [checking, setChecking] = useState(false);
  const [logs, setLogs] = useState<TestLog[]>([]);
  const [photo, setPhoto] = useState<string | null>(null);
  const [template, setTemplate] = useState<(typeof TEMPLATES)[number]["id"]>("parol");
  const [movement, setMovement] = useState<VideoMovement>(DEFAULT_MOVEMENT);
  const [duration, setDuration] = useState<VideoDuration>(5);
  const [model, setModel] = useState<FreeVideoModel>("wan-2.2");
  const [busy, setBusy] = useState(false);
  const [batch, setBatch] = useState<Batch | null>(null);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => setLogs(readLogs()), []);
  const save = (next: TestLog[]) => { setLogs(next); localStorage.setItem(STORE, JSON.stringify(next)); };
  const update = (id: string, patch: Partial<TestLog>) => { const next = readLogs().map((l) => (l.id === id ? { ...l, ...patch } : l)); save(next); };
  const updateMany = (patches: { id: string; patch: Partial<TestLog> }[]) => {
    if (!patches.length) return;
    const byId = new Map(patches.map((p) => [p.id, p.patch]));
    save(readLogs().map((l) => (byId.has(l.id) ? { ...l, ...(byId.get(l.id) ?? {}) } : l)));
  };

  if (!status.admin) {
    return (<><Header /><main className="mx-auto max-w-lg px-4 py-24 text-center"><h1 className="text-2xl font-bold">Access denied — Admin only</h1><Button asChild className="mt-6"><Link to="/">Go home</Link></Button></main><Footer /></>);
  }

  const quota = adminTestQuota(status.email, toRecords(logs));
  const limit = canAdminTest(status.email, toRecords(logs));
  const unitCost = VIDEO_BUDGET_RESERVATION[duration];
  const batchCount = quota.allowed ? Math.min(TEMPLATES.length, quota.videosLeft, Math.floor(quota.costLeft / unitCost)) : 0;

  async function onFile(f: File | undefined) {
    if (!f) return;
    const r = new FileReader();
    r.onload = () => setPhoto(String(r.result));
    r.readAsDataURL(f);
  }

  async function generate() {
    if (!photo) return;
    setBusy(true); setError("");
    try {
      const { requestId, cost } = await start({ data: { template, movement, duration, model, imageUrl: photo } });
      const log: TestLog = { id: requestId, email: status.email, template, movement, duration, model, cost, timestamp: new Date().toISOString(), videoUrl: null, status: "IN_QUEUE" };
      save([log, ...readLogs()]);
      for (let i = 0; i < 120; i++) {
        await new Promise((r) => setTimeout(r, 5000));
        const s = await check({ data: { requestId } });
        update(requestId, { status: s.status, videoUrl: s.videoUrl });
        if (s.status === "COMPLETED" || s.status === "FAILED") return;
      }
      setError("Still rendering. Check the saved test below instead of starting another video.");
    } catch (e) { setError(e instanceof Error ? e.message : "Test failed"); }
    finally { setBusy(false); }
  }

  // One photo, one movement, one length — all five templates rendered and compared side by side.
  async function generateAll() {
    if (!photo || duration === 10 || busy || !status.videoKey || batchCount <= 0) return;
    setBusy(true); setError("");
    const targets = TEMPLATES.slice(0, batchCount);
    setBatch({ phase: "submitting", total: targets.length, done: 0 });
    const started: TestLog[] = [];
    const failed: string[] = [];
    for (const t of targets) {
      try {
        const { requestId, cost } = await start({ data: { template: t.id, movement, duration, model, imageUrl: photo } });
        const log: TestLog = { id: requestId, email: status.email, template: t.id, movement, duration, model, cost, timestamp: new Date().toISOString(), videoUrl: null, status: "IN_QUEUE" };
        started.push(log);
        save([log, ...readLogs()]);
      } catch (e) { failed.push(`${t.name}: ${e instanceof Error ? e.message : "did not start"}`); }
      setBatch((b) => (b ? { ...b, done: started.length + failed.length } : b));
    }
    if (!started.length) {
      setError(failed.join(" · ") || "Nothing could be started.");
      setBatch(null); setBusy(false); return;
    }
    setBatch({ phase: "rendering", total: started.length, done: 0 });
    let pending = started.map((l) => l.id);
    let guard = 0;
    while (pending.length && guard++ < 120) {
      await new Promise((r) => setTimeout(r, 5000));
      const results = await Promise.all(pending.map((id) => check({ data: { requestId: id } }).then((s) => ({ id, s })).catch(() => ({ id, s: null }))));
      const patches: { id: string; patch: Partial<TestLog> }[] = [];
      const still: string[] = [];
      for (const { id, s } of results) {
        if (!s) { still.push(id); continue; }
        patches.push({ id, patch: { status: s.status, videoUrl: s.videoUrl } });
        if (s.status !== "COMPLETED" && s.status !== "FAILED") still.push(id);
      }
      updateMany(patches);
      setBatch((b) => (b ? { ...b, done: b.total - still.length } : b));
      pending = still;
    }
    if (pending.length) setError("Some videos are still rendering. Check their saved tests below; do not submit them again.");
    if (failed.length) setError(`Some tests did not start — ${failed.join(" · ")}`);
    setBatch(null); setBusy(false);
  }

  async function checkConnection() {
    setChecking(true);
    try { setConnection(await connectionCheck()); }
    catch (e) { setConnection({ connected: false, detail: e instanceof Error ? e.message : "Connection check failed" }); }
    finally { setChecking(false); }
  }

  function readableError(message: string) {
    if (message.includes("signup_required")) return "Free.ai rejected the photo upload. Your API account needs upload access; no video was started. Check your Free.ai account before retrying.";
    if (message.includes("not_in_tier")) return "This Free.ai key does not include API video generation. Add API tokens in Free.ai before retrying. Website free videos do not cover API requests.";
    return message;
  }

  async function refreshTest(id: string) {
    setBusy(true); setError("");
    try { const result = await check({ data: { requestId: id } }); update(id, { status: result.status, videoUrl: result.videoUrl }); }
    catch (e) { setError(e instanceof Error ? e.message : "Could not check saved test"); }
    finally { setBusy(false); }
  }

  const comparison = TEMPLATES.map((t) => ({ template: t, log: logs.find((l) => l.template === t.id && l.videoUrl) }));

  return (
    <>
      <Header />
      <main className="mx-auto max-w-4xl space-y-8 px-4 py-10">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div><p className="text-sm font-semibold text-christmas-green">MagicPh AI · Administrator</p><h1 className="mt-1 text-3xl font-bold">Free.ai video tests</h1></div>
          <Button variant="outline" disabled={checking || busy} onClick={() => void checkConnection()}><RefreshCw className={checking ? "animate-spin" : ""} />{checking ? "Checking…" : "Check connection"}</Button>
        </div>
        <section className="grid gap-4 border-y py-5 text-sm sm:grid-cols-2">
          <p>Signed in: <b className="break-all">{status.email}</b></p>
          <p>API key: <b className={status.videoKey ? "text-christmas-green" : "text-destructive"}>{status.videoKey ? "Configured securely" : "Missing FREE_AI_API_KEY"}</b></p>
          <p>Selected model: <b>{model}</b><code className="mt-1 block break-all text-xs text-muted-foreground">{FREE_AI_MODEL_IDS[model]}</code></p>
          <p>Connection: <b>{connection ? connection.connected ? "Reachable — rendering access unverified" : "Check failed" : "Not checked"}</b></p>
          <p>Daily test limit: <b>{ADMIN_LIMITS.maxPerDay}</b> · {quota.videosLeft} left in local history</p>
          <p>Legacy budget reservation: <b>${unitCost.toFixed(2)}/test</b> · ${quota.costLeft.toFixed(2)} remaining locally</p>
          {connection && <p role="status" className="sm:col-span-2 text-muted-foreground">{connection.detail}</p>}
          <p className="text-xs text-muted-foreground sm:col-span-2">Reservation amounts are not Free.ai prices or your token balance. Saved server limits still apply.</p>
        </section>
        <section className="border-l-4 border-gold bg-secondary/40 px-4 py-3">
          <h2 className="font-semibold">API tokens required</h2>
          <p className="mt-1 text-sm">Administrator tests bypass customer payment, not Free.ai charges. The last upload was denied; API video generation was also excluded from the free key.</p>
          <div className="mt-3 flex flex-wrap gap-2"><Button asChild variant="outline" size="sm"><a href="https://free.ai/pricing/" target="_blank" rel="noreferrer">Free.ai tokens<ExternalLink /></a></Button><Button asChild variant="ghost" size="sm"><a href="https://free.ai/api/" target="_blank" rel="noreferrer">API documentation<ExternalLink /></a></Button></div>
        </section>

        <section className="space-y-5 border-b pb-8">
          <div className="rounded-lg bg-secondary/60 p-4">
            <p className="font-semibold">Upload Photo (for MagicPh video)</p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <input id="admin-photo-upload" type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(e) => { const f = e.target.files?.[0]; setFileName(f?.name ?? ""); void onFile(f); }} />
              <Button asChild variant="outline"><label htmlFor="admin-photo-upload" className="cursor-pointer">📸 Choose Photo</label></Button>
              <span className="break-all text-sm text-muted-foreground">{fileName || "No file chosen"}</span>
            </div>
            {photo && (
              <div className="mt-4 flex items-center gap-3">
                <img src={photo} alt="Uploaded test photo" className="size-32 rounded-lg border object-cover" />
                <Button variant="ghost" size="sm" onClick={() => { setPhoto(null); setFileName(""); const el = document.getElementById("admin-photo-upload") as HTMLInputElement | null; if (el) el.value = ""; }}>Remove</Button>
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {TEMPLATES.map((t) => <Button key={t.id} variant={template === t.id ? "default" : "outline"} aria-pressed={template === t.id} onClick={() => setTemplate(t.id)}>{t.icon} {t.name}</Button>)}
          </div>
          <MovementSelector value={movement} onChange={setMovement} />
          <VideoModelSelector value={model} onChange={setModel} disabled={busy} />
          <p className="text-sm text-muted-foreground">Free.ai API video generation requires tokens. These are non-premium models; website free videos do not include API access.</p>
          <div className="flex gap-2">
            {([5, 10] as const).map((d) => <Button key={d} variant={duration === d ? "default" : "outline"} aria-pressed={duration === d} disabled={d === 10} onClick={() => setDuration(d)}>{d}s</Button>)}
          </div>
          <p className="text-sm text-muted-foreground">10 seconds unavailable with the 2–6 second Free.ai integration.</p>
          <div className="flex flex-wrap gap-3">
            <Button size="lg" disabled={!photo || duration === 10 || busy || !limit.allowed || !status.videoKey} onClick={generate}>{busy ? "Working…" : <> <FlaskConical />Generate 5s test</>}</Button>
            <Button size="lg" variant="secondary" disabled={!photo || duration === 10 || busy || !status.videoKey || batchCount <= 0} onClick={generateAll}>
              {batch?.phase === "submitting" ? "Starting…" : `Test ${batchCount === 5 ? "all five templates" : `${batchCount} templates`}`}
            </Button>
          </div>
          {batch && <p className="text-sm font-semibold">{batch.phase === "submitting" ? `Starting ${batch.done} of ${batch.total}…` : `Rendering ${batch.done} of ${batch.total} — this takes a few minutes.`}</p>}
          {!photo && !busy && <p className="text-sm text-muted-foreground">Please choose a photo first</p>}
          {!limit.allowed && <p className="text-sm text-destructive">{limit.reason}</p>}
          {error && <div role="alert" className="space-y-2 text-sm text-destructive"><p>{readableError(error)}</p>{readableError(error) !== error && <details><summary className="cursor-pointer">Provider details</summary><p className="mt-2 break-words">{error}</p></details>}</div>}
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Compare all five prompts</h2>
          <p className="text-sm text-muted-foreground">The newest finished video for each template, so you can watch all five from the same photo and pick what to keep.</p>
          <div className="grid gap-4 sm:grid-cols-2">
            {comparison.map(({ template: t, log }) => (
              <div key={t.id} className="space-y-2 rounded-lg border bg-card p-4">
                <p className="font-semibold">{t.icon} {t.name}</p>
                {log?.videoUrl ? (
                  <>
                    <video src={log.videoUrl} controls className="w-full rounded-lg" />
                    <p className="text-xs text-muted-foreground">{log.model ?? "Earlier test"} · {log.movement} · {log.duration}s · {new Date(log.timestamp).toLocaleString()}</p>
                  </>
                ) : (
                  <p className="rounded-lg bg-secondary/60 p-8 text-center text-sm text-muted-foreground">Not tested yet</p>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between"><h2 className="text-xl font-semibold">Free.ai test history</h2><Button variant="outline" size="sm" onClick={() => save([])}>Clear local history</Button></div>
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead><tr className="text-left"><th className="p-2">Date</th><th className="p-2">Template</th><th className="p-2">Movement</th><th className="p-2">Reservation</th><th className="p-2">Video</th><th className="p-2">Status</th></tr></thead>
              <tbody>
                {logs.length === 0 && <tr><td colSpan={6} className="p-4 text-center text-muted-foreground">No tests yet</td></tr>}
                {logs.map((l) => (
                  <tr key={l.id} className="border-t">
                    <td className="p-2">{new Date(l.timestamp).toLocaleString()}</td><td className="p-2">{l.template} · {l.duration}s<span className="block text-xs text-muted-foreground">{l.model ?? "Earlier test"}</span></td><td className="p-2">{l.movement}</td><td className="p-2">${l.cost.toFixed(2)}</td>
                    <td className="p-2">{l.videoUrl ? <video src={l.videoUrl} controls className="h-32 rounded" /> : "—"}</td><td className="p-2">{l.status}{!["COMPLETED", "FAILED"].includes(l.status) && <Button variant="ghost" size="sm" disabled={busy} onClick={() => void refreshTest(l.id)}><Play />Check saved test</Button>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
