import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { adminCheckTest, adminDashboardStatus, adminStartTest } from "@/lib/admin-dashboard.functions";
import { Header, Footer } from "@/components/SiteChrome";
import { Button } from "@/components/ui/button";
import { MovementSelector } from "@/components/MovementSelector";
import { TEMPLATES } from "@/lib/site";
import { DEFAULT_MOVEMENT, type VideoMovement } from "@/lib/video-movement";
import { ADMIN_LIMITS, adminTestQuota, canAdminTest } from "@/lib/owner-tests";
import { FAL_LISTED_COST, type VideoDuration } from "@/lib/video-duration";

type TestLog = { id: string; email: string; template: string; movement: VideoMovement; duration: VideoDuration; cost: number; timestamp: string; videoUrl: string | null; status: string };
type Batch = { phase: "submitting" | "rendering"; total: number; done: number };
const STORE = "fal_admin_tests";
const readLogs = (): TestLog[] => { try { return JSON.parse(localStorage.getItem(STORE) ?? "[]"); } catch { return []; } };
const toRecords = (logs: TestLog[]) => logs.map((l) => ({ email: l.email, templateId: l.template, cost: l.cost, duration: l.duration, timestamp: l.timestamp }));

const statusOptions = queryOptions({ queryKey: ["admin-dashboard-status"], queryFn: () => adminDashboardStatus() });

export const Route = createFileRoute("/_authenticated/admin-dashboard")({
  loader: ({ context }) => context.queryClient.ensureQueryData(statusOptions),
  head: () => ({ meta: [{ title: "Admin Test Dashboard — MagicPh AI" }, { name: "description", content: "Private MagicPh AI admin video tests." }, { property: "og:title", content: "MagicPh AI Admin Test Dashboard" }, { property: "og:description", content: "Private admin video tests." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }, { name: "robots", content: "noindex" }] }),
  component: AdminDashboard,
});

function AdminDashboard() {
  const status = useSuspenseQuery(statusOptions).data;
  const start = useServerFn(adminStartTest);
  const check = useServerFn(adminCheckTest);
  const [logs, setLogs] = useState<TestLog[]>([]);
  const [photo, setPhoto] = useState<string | null>(null);
  const [template, setTemplate] = useState<(typeof TEMPLATES)[number]["id"]>("parol");
  const [movement, setMovement] = useState<VideoMovement>(DEFAULT_MOVEMENT);
  const [duration, setDuration] = useState<VideoDuration>(5);
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
    save(readLogs().map((l) => (byId.has(l.id) ? { ...l, ...byId.get(l.id)! } : l)));
  };

  if (!status.admin) {
    return (<><Header /><main className="mx-auto max-w-lg px-4 py-24 text-center"><h1 className="text-2xl font-bold">Access denied — Admin only</h1><Button asChild className="mt-6"><Link to="/">Go home</Link></Button></main><Footer /></>);
  }

  const quota = adminTestQuota(status.email, toRecords(logs));
  const limit = canAdminTest(status.email, toRecords(logs));
  const unitCost = FAL_LISTED_COST[duration];
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
      const { requestId, cost } = await start({ data: { template, movement, duration, imageUrl: photo } });
      const log: TestLog = { id: requestId, email: status.email, template, movement, duration, cost, timestamp: new Date().toISOString(), videoUrl: null, status: "IN_QUEUE" };
      save([log, ...readLogs()]);
      for (let i = 0; i < 120; i++) {
        await new Promise((r) => setTimeout(r, 5000));
        const s = await check({ data: { requestId } });
        update(requestId, { status: s.status, videoUrl: s.videoUrl });
        if (s.status === "COMPLETED" || s.status === "FAILED") break;
      }
    } catch (e) { setError(e instanceof Error ? e.message : "Test failed"); }
    finally { setBusy(false); }
  }

  // One photo, one movement, one length — all five templates rendered and compared side by side.
  async function generateAll() {
    if (!photo || busy || !status.falKey || batchCount <= 0) return;
    setBusy(true); setError("");
    const targets = TEMPLATES.slice(0, batchCount);
    setBatch({ phase: "submitting", total: targets.length, done: 0 });
    const started: TestLog[] = [];
    const failed: string[] = [];
    for (const t of targets) {
      try {
        const { requestId, cost } = await start({ data: { template: t.id, movement, duration, imageUrl: photo } });
        const log: TestLog = { id: requestId, email: status.email, template: t.id, movement, duration, cost, timestamp: new Date().toISOString(), videoUrl: null, status: "IN_QUEUE" };
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
    if (failed.length) setError(`Some tests did not start — ${failed.join(" · ")}`);
    setBatch(null); setBusy(false);
  }

  const comparison = TEMPLATES.map((t) => ({ template: t, log: logs.find((l) => l.template === t.id && l.videoUrl) }));

  return (
    <>
      <Header />
      <main className="mx-auto max-w-4xl space-y-8 px-4 py-10">
        <h1 className="text-3xl font-bold">👑 MagicPh Admin Test Dashboard</h1>
        <section className="grid gap-3 rounded-xl border bg-card p-5 text-sm sm:grid-cols-2">
          <p>Signed in: <b>{status.email}</b></p>
          <p>FAL_KEY: <b className={status.falKey ? "text-primary" : "text-destructive"}>{status.falKey ? "Connected" : "Missing — add FAL_KEY in project secrets"}</b></p>
          <p>Model: <code>{status.model}</code></p>
          <p>Cost: 5s ${ADMIN_LIMITS.costPer5s} · 10s ${ADMIN_LIMITS.costPer10s}</p>
          <p>Limits: {ADMIN_LIMITS.maxPerDay}/day</p>
          <p>Room left today: <b>{quota.videosLeft} videos</b> · <b>${quota.costLeft.toFixed(2)}</b></p>
        </section>

        <section className="space-y-5 rounded-xl border bg-card p-5">
          <div className="rounded-xl bg-secondary/60 p-4">
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
          <div className="flex gap-2">
            {([5, 10] as const).map((d) => <Button key={d} variant={duration === d ? "default" : "outline"} aria-pressed={duration === d} onClick={() => setDuration(d)}>{d}s</Button>)}
          </div>
          <div className="flex flex-wrap gap-3">
            <Button size="lg" disabled={!photo || busy || !limit.allowed || !status.falKey} onClick={generate}>{busy ? "Working…" : "Generate FREE Admin Test (Bypass ₱149)"}</Button>
            <Button size="lg" variant="secondary" disabled={!photo || busy || !status.falKey || batchCount <= 0} onClick={generateAll}>
              {batch?.phase === "submitting" ? "Starting…" : `Run all five templates free (${batchCount})`}
            </Button>
          </div>
          {batch && <p className="text-sm font-semibold">{batch.phase === "submitting" ? `Starting ${batch.done} of ${batch.total}…` : `Rendering ${batch.done} of ${batch.total} — this takes a few minutes.`}</p>}
          {!photo && !busy && <p className="text-sm text-muted-foreground">Please choose a photo first</p>}
          {!limit.allowed && <p className="text-sm text-destructive">{limit.reason}</p>}
          {error && <p className="text-sm text-destructive">{error}</p>}
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Compare all five prompts</h2>
          <p className="text-sm text-muted-foreground">The newest finished video for each template, so you can watch all five from the same photo and pick what to keep.</p>
          <div className="grid gap-4 sm:grid-cols-2">
            {comparison.map(({ template: t, log }) => (
              <div key={t.id} className="space-y-2 rounded-xl border bg-card p-4">
                <p className="font-semibold">{t.icon} {t.name}</p>
                {log?.videoUrl ? (
                  <>
                    <video src={log.videoUrl} controls className="w-full rounded-lg" />
                    <p className="text-xs text-muted-foreground">{log.movement} · {log.duration}s · {new Date(log.timestamp).toLocaleString()}</p>
                  </>
                ) : (
                  <p className="rounded-lg bg-secondary/60 p-8 text-center text-sm text-muted-foreground">Not tested yet</p>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between"><h2 className="text-xl font-semibold">Test history</h2><Button variant="outline" size="sm" onClick={() => save([])}>Clear history</Button></div>
          <div className="overflow-x-auto rounded-xl border">
            <table className="w-full text-sm">
              <thead><tr className="text-left"><th className="p-2">Date</th><th className="p-2">Template</th><th className="p-2">Movement</th><th className="p-2">Cost</th><th className="p-2">Video</th><th className="p-2">Status</th></tr></thead>
              <tbody>
                {logs.length === 0 && <tr><td colSpan={6} className="p-4 text-center text-muted-foreground">No tests yet</td></tr>}
                {logs.map((l) => (
                  <tr key={l.id} className="border-t">
                    <td className="p-2">{new Date(l.timestamp).toLocaleString()}</td><td className="p-2">{l.template} · {l.duration}s</td><td className="p-2">{l.movement}</td><td className="p-2">${l.cost.toFixed(2)}</td>
                    <td className="p-2">{l.videoUrl ? <video src={l.videoUrl} controls className="h-32 rounded" /> : "—"}</td><td className="p-2">{l.status}</td>
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
