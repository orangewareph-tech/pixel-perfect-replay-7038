export const CACHE_RECOVERY_RELEASE = "magicph-v2";

export function isMagicPhCache(name: string, scope: string): boolean {
  const workbox = /(^|-)precache-v\d+-|(^|-)runtime-|(^|-)googleAnalytics-/.test(name) && name.endsWith(scope);
  return workbox || name === "magicph-assets" || /^magicph-(?:magicph-)?v\d+$/.test(name);
}

export async function readAppCacheStatus() {
  if (typeof window === "undefined" || !("caches" in window)) return { supported: false, caches: 0, items: 0 };
  const names = (await window.caches.keys()).filter((name) => isMagicPhCache(name, `${window.location.origin}/`));
  let items = 0;
  for (const name of names) items += (await (await window.caches.open(name)).keys()).length;
  return { supported: true, caches: names.length, items };
}

export async function clearAppCaches() {
  if (typeof window === "undefined" || !("caches" in window)) throw new Error("Cache reset is unavailable in this browser.");
  const names = (await window.caches.keys()).filter((name) => isMagicPhCache(name, `${window.location.origin}/`));
  const results = await Promise.allSettled(names.map((name) => window.caches.delete(name)));
  if (results.some((result) => result.status === "rejected")) throw new Error("Some app caches could not be cleared. Please try again.");
  return names.length;
}