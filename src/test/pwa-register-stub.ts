// Test stub for virtual:pwa-register (the real module only exists under the
// vite-plugin-pwa build plugin, which vitest does not load).
export function registerSW(_options?: Record<string, unknown>) {
  return (_reloadPage?: boolean) => Promise.resolve();
}
