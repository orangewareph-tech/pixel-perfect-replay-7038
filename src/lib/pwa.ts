/**
 * Service worker registration wrapper.
 *
 * The SW must never register in dev or in any Lovable preview context —
 * a cached app shell there would keep serving stale code after edits.
 * In every refused context we proactively unregister a stale /sw.js.
 */

const SW_URL = "/sw.js";

function isPreviewHostname(hostname: string): boolean {
  const h = hostname.toLowerCase();
  const previewLabel = /^(?:id-preview|preview)(?:-[a-z0-9]+)?--.+$/;
  const firstLabel = h.split(".")[0] ?? "";
  const isLovableHost =
    h.endsWith(".lovable.app") || h.endsWith(".gpt-eng.com") || h.endsWith(".gptengineer.run");
  if (isLovableHost && previewLabel.test(firstLabel)) return true;
  // Dev-server hostnames: project--<project-id>-dev.<lovable host>
  if (isLovableHost && /^project--[a-z0-9-]+-dev$/.test(firstLabel)) return true;
  if (h === "lovableproject.com" || h.endsWith(".lovableproject.com")) return true;
  if (h === "lovableproject-dev.com" || h.endsWith(".lovableproject-dev.com")) return true;
  if (h === "beta.lovable.dev" || h.endsWith(".beta.lovable.dev")) return true;
  return false;
}

async function unregisterAppServiceWorkers(): Promise<void> {
  if (!("serviceWorker" in navigator)) return;
  try {
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(
      registrations
        .filter((r) => r.active?.scriptURL.endsWith(SW_URL) || r.scope === `${location.origin}/`)
        .map((r) => r.unregister()),
    );
  } catch {
    // best effort only
  }
}

export async function registerAppServiceWorker(): Promise<void> {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

  const refused =
    !import.meta.env.PROD ||
    window.self !== window.top ||
    isPreviewHostname(window.location.hostname) ||
    new URLSearchParams(window.location.search).get("sw") === "off";

  if (refused) {
    await unregisterAppServiceWorkers();
    return;
  }

  const { registerSW } = await import("virtual:pwa-register");
  registerSW({
    immediate: true,
    onRegisteredSW(swUrl) {
      if (swUrl.endsWith(SW_URL)) console.log("PWA ready - MagicPh AI");
    },
    onRegisterError(error) {
      console.warn("MagicPh AI service worker registration failed", error);
    },
  });
}
