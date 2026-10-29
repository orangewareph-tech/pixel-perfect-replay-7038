import { useEffect, useState } from "react";
import { RefreshCw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CACHE_RECOVERY_RELEASE, clearAppCaches, readAppCacheStatus } from "@/lib/cache-recovery";
import { retireAppServiceWorkers } from "@/lib/pwa";

export function CacheRecovery({ statusPanel = false }: { statusPanel?: boolean }) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState<Awaited<ReturnType<typeof readAppCacheStatus>> | null>(null);
  const [canReload, setCanReload] = useState(false);
  async function refresh() {
    try { setStatus(await readAppCacheStatus()); } catch { setError("Cache status is unavailable. Your page is still usable."); }
  }
  useEffect(() => { if (statusPanel || open) void refresh(); }, [statusPanel, open]);
  async function clear() {
    setBusy(true); setError(""); setNotice("");
    try {
      const removed = await clearAppCaches();
      await retireAppServiceWorkers();
      await refresh();
      setNotice(`${removed} app caches cleared. Sign-in and saved choices kept.`);
      setCanReload(window.location.pathname !== "/create");
    } catch (e) { setError(e instanceof Error ? e.message : "Cache reset failed. Please try again."); }
    finally { setBusy(false); }
  }
  const details = <>
    <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
      <dt className="text-muted-foreground">Recovery release</dt><dd>{CACHE_RECOVERY_RELEASE}</dd>
      <dt className="text-muted-foreground">App cache items</dt><dd>{status ? status.supported ? `${status.items} in ${status.caches} caches` : "Unavailable in this browser" : "Checking…"}</dd>
      <dt className="text-muted-foreground">Page loading</dt><dd>Online · no offline page interception</dd>
      <dt className="text-muted-foreground">Old worker</dt><dd>Automatically retired when its update arrives</dd>
    </dl>
    <Button className="mt-5 h-auto whitespace-normal" variant="outline" onClick={() => void clear()} disabled={busy || status?.supported === false}>{busy ? <Loader2 className="animate-spin" /> : <RefreshCw />}{busy ? "Clearing…" : "Clear Cache - Get Latest Version"}</Button>
    {notice && <div role="status" className="mt-3 text-sm"><p>{notice}</p>{canReload ? <Button className="mt-3" onClick={() => window.location.reload()}><RefreshCw />Reload latest version</Button> : <p className="mt-2 text-muted-foreground">Your photo stays open. Reload only after finishing or saving your video.</p>}</div>}
    {error && <p role="alert" className="mt-3 text-sm text-destructive">{error}</p>}
  </>;
  if (statusPanel) return <section className="border-t py-6"><h2 className="text-xl font-bold">Cache Status</h2>{details}</section>;
  return <Dialog open={open} onOpenChange={setOpen}><DialogTrigger asChild><Button variant="ghost" size="icon" aria-label="Clear app cache" title="Clear Cache - Get Latest Version"><RefreshCw /></Button></DialogTrigger><DialogContent><DialogHeader><DialogTitle>Get the latest MagicPh AI</DialogTitle></DialogHeader>{details}</DialogContent></Dialog>;
}