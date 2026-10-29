import { useState } from "react";
import { Button } from "@/components/ui/button";
import { checkStaticPreviews, runFreeChecks, type FreeCheck } from "@/lib/free-checks";
import { useServerFn } from "@tanstack/react-start";
import { freeConnectionCheck } from "@/lib/fal-audit.functions";
import { readAppCacheStatus } from "@/lib/cache-recovery";

export function FreeTestSuite() {
  const connection = useServerFn(freeConnectionCheck);
  const [results, setResults] = useState<FreeCheck[]>([]);
  const [busy, setBusy] = useState(false);
  async function run(previewOnly = false) {
    setBusy(true);
    try {
      const checks = previewOnly ? [await checkStaticPreviews()] : await runFreeChecks();
      if (!previewOnly) {
        try { const result = await connection(); checks.push({ name: "Google & video-service connection", status: result.connected ? "PASS" : "SKIP", detail: result.detail }); } catch { checks.push({ name: "Google & video-service connection", status: "SKIP", detail: "Connection could not be verified. No video submitted." }); }
        const cache = await readAppCacheStatus(); checks.push({ name: "Safe cache recovery", status: cache.supported ? "PASS" : "SKIP", detail: `${cache.items} scoped cache items. No account storage cleared.` });
      }
      setResults(checks);
    }
    finally { setBusy(false); }
  }
  return <section className="border-y py-8">
    <h2 className="text-xl font-bold">Free feature checks · no paid generation</h2>
    <div className="mt-4 flex flex-wrap gap-3"><Button disabled={busy} onClick={() => void run()}>Run all free checks</Button><Button variant="outline" disabled={busy} onClick={() => void run(true)}>Check 3-sec previews only</Button><Button variant="ghost" disabled={busy} onClick={() => setResults([])}>Clear test results</Button></div>
    <p className="mt-3 text-sm text-muted-foreground">Images, soundtrack and sample clips are existing static files. These checks do not submit Fal.ai jobs. Hosting and bandwidth are separate from generation costs.</p>
    <ul aria-live="polite" className="mt-4 divide-y">{results.map((r) => <li key={r.name} className="py-3"><p className={`font-bold ${r.status === "FAIL" ? "text-destructive" : r.status === "PASS" ? "text-christmas-green" : "text-muted-foreground"}`}>{r.status} · {r.name}</p><p className="mt-1 text-sm">{r.detail}</p></li>)}</ul>
  </section>;
}