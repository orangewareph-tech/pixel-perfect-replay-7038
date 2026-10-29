import { afterEach, describe, expect, it, vi } from "vitest";
import { clearAppCaches, isMagicPhCache, readAppCacheStatus } from "@/lib/cache-recovery";

afterEach(() => { vi.restoreAllMocks(); Reflect.deleteProperty(window, "caches"); });
describe("safe app cache recovery", () => {
  it("targets old v2 and v3 app caches, not messaging or another scope", () => {
    const scope = `${location.origin}/`;
    expect(isMagicPhCache("magicph-v2", scope)).toBe(true);
    expect(isMagicPhCache("magicph-magicph-v3", scope)).toBe(true);
    expect(isMagicPhCache(`workbox-precache-v2-${scope}`, scope)).toBe(true);
    expect(isMagicPhCache("firebase-messaging-cache", scope)).toBe(false);
    expect(isMagicPhCache(`workbox-precache-v2-${scope}other/`, scope)).toBe(false);
    expect(isMagicPhCache("magicph-user-photos", scope)).toBe(false);
  });
  it("clears app caches while preserving sign-in, drafts and unrelated caches", async () => {
    const remove = vi.fn().mockResolvedValue(true);
    Object.defineProperty(window, "caches", { configurable: true, value: { keys: async () => ["magicph-v2", "magicph-assets", "firebase-messaging-cache"], delete: remove } });
    const localClear = vi.spyOn(Storage.prototype, "clear");
    const storageDelete = vi.spyOn(Storage.prototype, "removeItem");
    expect(await clearAppCaches()).toBe(2);
    expect(remove.mock.calls.map(([name]) => name)).toEqual(["magicph-v2", "magicph-assets"]);
    expect(localClear).not.toHaveBeenCalled();
    expect(storageDelete).not.toHaveBeenCalled();
  });
  it("counts only app items", async () => {
    Object.defineProperty(window, "caches", { configurable: true, value: { keys: async () => ["magicph-assets", "messaging"], open: async () => ({ keys: async () => [1, 2, 3] }) } });
    expect(await readAppCacheStatus()).toEqual({ supported: true, caches: 1, items: 3 });
  });
  it("reports failed deletion instead of claiming success", async () => {
    Object.defineProperty(window, "caches", { configurable: true, value: { keys: async () => ["magicph-v2"], delete: async () => { throw new Error("denied"); } } });
    await expect(clearAppCaches()).rejects.toThrow("could not be cleared");
  });
});