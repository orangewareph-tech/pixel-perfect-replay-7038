import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { auditAccess, scanFalAi, testFalAiGeneration, pollFalTest } from "@/lib/fal-audit.functions";
import { Header, Footer } from "@/components/SiteChrome";
import { Button } from "@/components/ui/button";
import { DURATION_OFFERS, FAL_LISTED_COST, durationProfit, breakEvenVideos, VIDEO_MODEL, type VideoDuration } from "@/lib/video-duration";
import sample from "@/assets/hero.jpg";
import type { Tables } from "@/integrations/supabase/types";
import { christmasTotal, christmasProfit } from "@/lib/christmas-music";
import { InstalledStatus } from "@/components/InstalledStatus";
import { Link } from "@tanstack/react-router";
import { FreeTestSuite } from "@/components/FreeTestSuite";
import { MusicVideoPlayer } from "@/components/MusicVideoPlayer";
import { musicAssetUrl, AUTOMATIC_MUSIC, DEFAULT_MUSIC_VOLUME } from "@/lib/christmas-music";

const accessOptions = queryOptions({ queryKey: ["fal-audit-access"], queryFn: () => auditAccess() });
const scanOptions = queryOptions({ queryKey: ["fal-audit-scan"], queryFn: () => scanFalAi(), staleTime: 0 });
export const Route = createFileRoute("/_authenticated/test")({
  loader: async ({ context }) => {
    const access = await context.queryClient.ensureQueryData(accessOptions);
    const report = access.admin ? await context.queryClient.fetchQuery(scanOptions) : null;
    return { report };
  },
  head: () => ({ meta: [{ title: "Fal.ai Audit & Video Tests — MagicPh AI" }, { name: "description", content: "Protected MagicPh AI connectivity, billing and video generation audit." }, { property: "og:title", content: "MagicPh AI Fal.ai Audit" }, { property: "og:description", content: "Video service checks, actual costs and test results." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }, { name: "robots", content: "noindex" }] }),
  component: TestPage,
});

function TestPage() {
  const access = useSuspenseQuery(accessOptions).data;
  const initial = Route.useLoaderData().report;
  const scan = useServerFn(scanFalAi); const start = useServerFn(testFalAiGeneration); const poll = useServerFn(pollFalTest);
  const [report, setReport] = useState<Awaited<ReturnType<typeof scanFalAi>> | null>(initial);
  const [last, setLast] = useState<Tables<"fal_test_runs"> | null>(initial?.lastTest ?? null);
  const [logs, setLogs] = useState<string[]>([]); const [busy, setBusy] = useState(false); const [error, setError] = useState("");
  const addLog = (message: string) => setLogs((old) => [...old, `${new Date().toLocaleTimeString()} · ${message}`]);
  async function refresh() {
    setBusy(true); setError("");
    try { const result = await scan(); setReport(result); setLast(result.lastTest); addLog("Scan completed — walay generation charge."); }
    catch (err) { setError(err instanceof Error ? err.message : "Scan failed"); }
    finally { setBusy(false); }
  }
  async function follow(id: string) {
    for (let attempt = 0; attempt < 120; attempt++) {
      const run = await poll({ data: { id } }); setLast(run);
      addLog(`Queue ${run.request_id} — ${run.status}`);
      if (run.status === "FAILED") throw new Error(run.error ?? "Generation failed");
      if (run.status === "COMPLETED") { addLog("Video ready! Listed charge shown; actual balance deduction unverified."); return; }
      await new Promise((resolve) => setTimeout(resolve, 4000));
    }
    addLog("Still queued. Refresh status instead of creating another paid request.");
  }
  async function runTest(duration: VideoDuration) {
    setBusy(true); setError(""); setLogs([]);
    try {
      addLog("Uploading sample Pinoy family photo...");
      const response = await fetch(sample); const blob = await response.blob();
      const imageUrl = await new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => typeof reader.result === "string" ? resolve(reader.result) : reject(new Error("Photo unavailable")); reader.onerror = () => reject(new Error("Photo unavailable")); reader.readAsDataURL(blob); });
      addLog(`Calling Fal.ai — ${duration}s, listed cost $${FAL_LISTED_COST[duration].toFixed(2)}.`);
      const result = await start({ data: { duration, imageUrl } }); addLog(`Queue ID: ${result.requestId}`);
      await follow(result.id);
      const resultReport = await scan(); setReport(resultReport); setLast(resultReport.lastTest);
    } catch (err) { const message = err instanceof Error ? err.message : "Test failed"; setError(message); addLog(message); }
    finally { setBusy(false); }
  }
  const active = last && ["SUBMITTING", "IN_QUEUE", "IN_PROGRESS"].includes(last.status);
  return <><Header /><main className="mx-auto max-w-5xl px-4 py-10"><div className="flex flex-wrap items-center justify-between gap-4"><div><p className="text-sm font-bold text-christmas-green">MagicPh AI · launch audit</p><h1 className="mt-1 text-3xl font-bold text-primary">Scan & Test Fal.ai</h1></div>{access.admin && <Button onClick={refresh} disabled={busy}>Scan connection</Button>}</div>
    {!access.admin ? <section className="py-12"><h2 className="text-xl font-bold">Administrator access required</h2><p className="mt-3">Naka-sign in ka. An approved administrator role is required before balance checks or paid tests.</p></section> : <>
      <dl className="mt-8 grid gap-6 border-y py-6 sm:grid-cols-3"><div><dt className="text-sm text-muted-foreground">Fal.ai Status</dt><dd className="mt-1 font-bold">{report ? report.connected ? "Connected" : "Not verified / disconnected" : "Not scanned"}</dd></div><div><dt className="text-sm text-muted-foreground">Secret</dt><dd className="mt-1 font-bold">{report ? report.keyFound ? "FAL_KEY found - hidden for security" : "FAL_KEY missing - add to Secrets" : "Not scanned"}</dd></div><div><dt className="text-sm text-muted-foreground">Balance</dt><dd className="mt-1 font-bold">{report?.balance != null ? `$${report.balance.toFixed(2)} = ${Math.floor(report.balance / 0.35)} five-second / ${Math.floor(report.balance / 0.70)} ten-second videos` : "Unavailable / not scanned"}</dd></div></dl>
      {report && <p className="mt-3 text-sm text-muted-foreground">{report.balanceNote} <a href="https://fal.ai/dashboard/billing" target="_blank" rel="noreferrer" className="text-primary underline">Fal.ai billing dashboard ↗</a></p>}
      <section className="py-8"><h2 className="text-xl font-bold">Model & parameters</h2><p className="mt-2 break-all text-sm">{VIDEO_MODEL}</p><p className="mt-2 text-sm">{report?.model ? "Model request history reachable" : "Model connection not scanned"} · 5s / 10s · image_url · prompt · cfg_scale 0.5</p><p className="mt-2 text-sm text-muted-foreground">Duration uses "5" or "10". This image-to-video model has no aspect_ratio input: upload a 9:16 photo for vertical output. Display toggles do not reshape the saved file.</p><a href="https://fal.ai/models/fal-ai/kling-video/v2.5-turbo/pro/image-to-video/api" target="_blank" rel="noreferrer" className="mt-2 inline-block text-sm text-primary underline">Official model API & pricing ↗</a></section>
      <section className="border-y py-6"><h2 className="text-xl font-bold">Peso profit calculator</h2><div className="mt-4 grid gap-5 sm:grid-cols-2">{([5, 10] as const).map((duration) => <div key={duration}><h3 className="font-bold">{duration}s · P{DURATION_OFFERS[duration].price}</h3><p className="mt-1 text-sm">${FAL_LISTED_COST[duration].toFixed(2)} × P58 = P{(FAL_LISTED_COST[duration] * 58).toFixed(2)} + P2 fee</p><p className="mt-1 font-bold text-christmas-green">Net profit: P{durationProfit(duration).toFixed(2)}</p></div>)}</div><p className="mt-4 text-sm">P3,048 launch recovery: {breakEvenVideos(5)} sales at P149, or {breakEvenVideos(10)} sales at P299. 24 × P126.70 = P3,040.80, so 24 is not enough.</p></section>
      <section className="border-b py-6"><h2 className="text-xl font-bold">Included sound · planning estimate</h2><p className="mt-2 text-sm">Automatic original Christmas instrumental, no surcharge. Retained ₱5 audio budget is a planning assumption, not an incurred license fee.</p><div className="mt-3 grid gap-4 sm:grid-cols-2">{([5, 10] as const).map((duration) => <p key={duration} className="text-sm">{duration}s with included music: ₱{christmasTotal(duration, "pasko-sa-nayon")} · estimated net ₱{christmasProfit(duration, "pasko-sa-nayon").toFixed(2)}</p>)}</div></section>
      <FreeTestSuite />
      <section className="py-8"><h2 className="text-xl font-bold">Live generation test</h2><div className="mt-4 flex flex-wrap gap-3"><Button disabled={busy || Boolean(active)} onClick={() => runTest(5)}>Test Fal.ai Now — 5 sec ($0.35)</Button><Button variant="outline" disabled={busy || Boolean(active)} onClick={() => runTest(10)}>Run Test Again — 10 sec ($0.70)</Button>{active && <Button disabled={busy} variant="outline" onClick={async () => { setBusy(true); try { await follow(last.id); } catch (err) { setError(err instanceof Error ? err.message : "Status failed"); } finally { setBusy(false); } }}>Refresh active test</Button>}</div><p className="mt-3 text-sm text-muted-foreground">Paid generation starts only when you click a duration test. Scans do not create paid videos.</p>{error && <p role="alert" className="mt-4 text-destructive">{error}</p>}<ol aria-live="polite" className="mt-4 max-h-64 space-y-1 overflow-y-auto text-sm">{logs.map((log, index) => <li key={index}>{log}</li>)}</ol>
      {last && <p className="mt-4 text-sm">Last test: {last.status} · {last.duration}s · {new Date(last.started_at).toLocaleString()}{last.finished_at && ` · ${Math.round((Date.parse(last.finished_at) - Date.parse(last.started_at)) / 1000)} seconds elapsed`}</p>}
      <div className="mt-6 grid gap-4 sm:grid-cols-2"><figure><img src={sample} alt="Sample Pinoy family before" className="aspect-[9/16] max-h-96 w-full rounded-lg object-contain bg-night" /><figcaption className="mt-2 text-sm font-bold">Before · sample family</figcaption></figure><figure>{last?.video_url ? <MusicVideoPlayer src={last.video_url} music={musicAssetUrl(AUTOMATIC_MUSIC, last.duration === 10 ? 10 : 5)} musicName="Christmas soundtrack" volume={DEFAULT_MUSIC_VOLUME} loopMusic ratio="9:16" /> : <div className="flex aspect-[9/16] max-h-96 items-center justify-center rounded-lg bg-muted text-muted-foreground">{busy ? "Rendering…" : "No test video yet"}</div>}<figcaption className="mt-2 text-sm font-bold">After · {last?.status ?? "Not tested"}</figcaption>{last?.video_url && <a href={last.video_url} target="_blank" rel="noreferrer" className="mt-2 block break-all text-xs text-primary underline">{last.video_url}</a>}</figure></div></section>
      <InstalledStatus />
      <section className="border-t py-6"><h2 className="text-xl font-bold">Launch checklist</h2><ul className="mt-4 space-y-2 text-sm"><li>✓ 5s/10s selection, saved choice, P149/P299, dynamic checkout, correct duration payload.</li><li>✓ Manifest and home-screen support; offline recovery does not register a new app-shell worker.</li><li>Manual payment: uploaded InstaPay QR, receipt submission and administrator approval. Receipt alone does not unlock generation.</li><li>Generation requires authenticated ownership and an approved single-use credit; max 3 per hour and a shared daily spending cap.</li><li>Paymongo is not connected. Automatic payment verification is unavailable.</li><li>Administrator approval requires a protected account role, never a shared password.</li><li>⚠ Fal.ai billing permission is required for live balance. Never infer deductions from a video completing.</li></ul><Button asChild variant="outline" className="mt-4"><Link to="/admin">Review payments & credits</Link></Button></section>
      <section className="border-t py-6"><h2 className="text-xl font-bold">Concurrent capacity · estimates, not a load-test result</h2><p className="mt-3 text-sm">10 × 5s = $3.50 (P203). 100 × 5s = $35 (P2,030). Queue limits and completion time depend on your Fal.ai account; no promised 60–90-second batch delivery.</p><p className="mt-2 text-sm">$50 (P2,900) covers 142 five-second videos at listed cost. Top up according to actual demand; two-week capacity is not verified.</p></section>
    </>}
  </main><Footer /></>;
}