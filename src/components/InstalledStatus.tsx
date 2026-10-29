import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { installedDisplay } from "@/lib/payment-rules";

export function InstalledStatus() {
  const [installed, setInstalled] = useState<boolean | null>(null);
  function check() { setInstalled(installedDisplay(window.matchMedia("(display-mode: standalone)").matches, (navigator as Navigator & { standalone?: boolean }).standalone)); }
  useEffect(() => { check(); const media = window.matchMedia("(display-mode: standalone)"); media.addEventListener("change", check); window.addEventListener("appinstalled", check); return () => { media.removeEventListener("change", check); window.removeEventListener("appinstalled", check); }; }, []);
  return <section className="border-t py-6"><h2 className="text-xl font-bold">Home-screen app</h2><p className="mt-3">PWA Installed: {installed === null ? "Checking…" : installed ? "Yes — standalone mode" : "No — browser mode"}</p>{installed === false && <p className="mt-2 text-sm text-muted-foreground">Add to Home Screen para dali! No Play Store needed.</p>}<p className="mt-2 text-sm text-muted-foreground">Installation does not enable offline video generation.</p><Button className="mt-3" variant="outline" onClick={check}>Check if installed</Button></section>;
}