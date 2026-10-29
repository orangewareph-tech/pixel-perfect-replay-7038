/** Home-screen support is manifest-only during the stale-worker recovery release. */
export async function retireAppServiceWorkers(): Promise<void> {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;
  try {
    const registrations = await navigator.serviceWorker.getRegistrations();
    const appRegistrations = registrations.filter((registration) =>
      [registration.active, registration.waiting, registration.installing].some((worker) => {
        if (!worker) return false;
        const url = new URL(worker.scriptURL);
        return url.origin === window.location.origin && url.pathname === "/sw.js";
      }),
    );
    // Updating the old registration loads the same-path cleanup worker. Do not
    // unregister first: its activation must evict its own caches and recover tabs.
    await Promise.allSettled(appRegistrations.map((registration) => registration.update()));
  } catch {
    // Offline browsers retry the same-path update on their next online visit.
  }
}
