import { act, cleanup, renderHook } from "@testing-library/react";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import { afterEach, describe, expect, it, vi } from "vitest";
import { canGenerateVideo, useOnlineStatus } from "@/hooks/use-online-status";
import { retireAppServiceWorkers } from "@/lib/pwa";

afterEach(() => { cleanup(); vi.restoreAllMocks(); vi.unstubAllGlobals(); });

describe("Offline recovery", () => {
  it("blocks generation while offline and permits it online", () => {
    expect(canGenerateVideo(false)).toBe(false);
    expect(canGenerateVideo(true)).toBe(true);
  });

  it("responds to going offline and returning online without replacing the app", () => {
    const status = vi.spyOn(navigator, "onLine", "get").mockReturnValue(true);
    const { result } = renderHook(useOnlineStatus);
    expect(result.current).toBe(true);
    status.mockReturnValue(false);
    act(() => window.dispatchEvent(new Event("offline")));
    expect(result.current).toBe(false);
    status.mockReturnValue(true);
    act(() => window.dispatchEvent(new Event("online")));
    expect(result.current).toBe(true);
  });

  it("updates only existing app-shell workers and never registers a new worker", async () => {
    const update = vi.fn().mockResolvedValue(undefined);
    const messagingUpdate = vi.fn();
    const register = vi.fn();
    Object.defineProperty(navigator, "serviceWorker", { configurable: true, value: {
      register,
      getRegistrations: async () => [
        { active: { scriptURL: `${location.origin}/sw.js` }, update },
        { active: { scriptURL: `${location.origin}/firebase-messaging-sw.js` }, update: messagingUpdate },
      ],
    } });
    await retireAppServiceWorkers();
    expect(update).toHaveBeenCalledOnce();
    expect(messagingUpdate).not.toHaveBeenCalled();
    expect(register).not.toHaveBeenCalled();
    delete (navigator as Navigator & { serviceWorker?: unknown }).serviceWorker;
  });

  it("evicts only this app's caches, recovers tabs and unregisters even when cleanup fails", async () => {
    const source = readFileSync("public/sw.js", "utf8");
    for (const fail of [false, true]) {
      const handlers: Record<string, (event: { waitUntil: (promise: Promise<unknown>) => void }) => void> = {};
      const scope = "https://magicph.example/";
      const remove = vi.fn().mockResolvedValue(true);
      const unregister = vi.fn().mockResolvedValue(true);
      const navigate = vi.fn().mockResolvedValue(undefined);
      vm.runInNewContext(source, {
        self: {
          registration: { scope, unregister },
          skipWaiting: vi.fn(),
          addEventListener: (type: string, handler: typeof handlers[string]) => { handlers[type] = handler; },
          clients: { claim: async () => {}, matchAll: async () => [{ url: scope, navigate }] },
        },
        caches: {
          keys: async () => {
            if (fail) throw new Error("cache access failed");
            return [`workbox-precache-v2-${scope}`, "magicph-assets", "firebase-messaging-cache", "unrelated-cache", "workbox-precache-v2-https://magicph.example/other/"];
          },
          delete: remove,
        },
      });
      let task: Promise<unknown> | undefined;
      handlers.activate({ waitUntil: (promise) => { task = promise; } });
      if (fail) await expect(task).rejects.toThrow("cache access failed");
      else {
        await task;
        expect(remove.mock.calls.map(([name]) => name)).toEqual([`workbox-precache-v2-${scope}`, "magicph-assets"]);
        expect(navigate).toHaveBeenCalledWith(scope);
      }
      expect(unregister).toHaveBeenCalledOnce();
      expect(handlers.fetch).toBeUndefined();
    }
  });
});