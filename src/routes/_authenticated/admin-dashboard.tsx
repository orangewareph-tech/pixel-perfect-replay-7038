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
import { ADMIN_LIMITS, canAdminTest } from "@/lib/owner-tests";
import type { VideoDuration } from "@/lib/video-duration";

type TestLog = { id: string; email: string; template: string; movement: VideoMovement; duration: VideoDuration; cost: number; timestamp: string; videoUrl: string | null; status: string };
const STORE = "fal_admin_tests";
const readLogs = (): TestLog[] => { try { return JSON.parse(localStorage.getItem(STORE) ?? "[]"); } catch { return []; } };

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
  const [error, setError] = useState("");

  useEffect(() => setLogs(readLogs()), []);
  const save = (next: TestLog[]) => { setLogs(next); localStorage.setItem(STORE, JSON.stringify(next)); };
  const update = (id: string, patch: Partial<TestLog>) => { const next = readLogs().map((l) => (l.id === id ? { ...l, ...patch } : l)); save(next); };

  if (!status.admin) {
    return (<><Header /><main className="mx-auto max-w-lg px-4 py-24 text-center"><h1 className="text-2xl font-bold">Access denied — Admin only</h1><Button asChild className="mt-6"><Link to="/">Go home</Link></Button></main><Footer /></>);
  }

  const limit = canAdminTest(status.email, logs.map((l) => ({ email: l.email, templateId: l.template, cost: l.cost, duration: l.duration, timestamp: l.timestamp })));

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
          <p>Limits: {ADMIN_LIMITS.maxPerHour}/hour · {ADMIN_LIMITS.maxPerDay}/day</p>
        </section>

        <section className="space-y-5 rounded-xl border bg-card p-5">
          <input type="file" accept="image/jpeg,image/png,image/webp" aria-label="Upload photo" onChange={(e) => onFile(e.target.files?.[0])} />
          {photo && <img src={photo} alt="Uploaded test photo" className="h-40 rounded-lg object-cover" />}
          <div className="flex flex-wrap gap-2">
            {TEMPLATES.map((t) => <Button key={t.id} variant={template === t.id ? "default" : "outline"} aria-pressed={template === t.id} onClick={() => setTemplate(t.id)}>{t.icon} {t.name}</Button>)}
          </div>
          <MovementSelector value={movement} onChange={setMovement} />
          <div className="flex gap-2">
            {([5, 10] as const).map((d) => <Button key={d} variant={duration === d ? "default" : "outline"} aria-pressed={duration === d} onClick={() => setDuration(d)}>{d}s</Button>)}
          </div>
          <Button size="lg" disabled={!photo || busy || !limit.allowed || !status.falKey} onClick={generate}>{busy ? "Generating…" : "Generate FREE Admin Test (Bypass ₱149)"}</Button>
          {!limit.allowed && <p className="text-sm text-destructive">{limit.reason}</p>}
          {error && <p className="text-sm text-destructive">{error}</p>}
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
