// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  vite: {
    plugins: [
      // PWA: generates /sw.js (generateSW) on build. Registration is handled
      // solely by src/lib/pwa.ts, which refuses dev/preview contexts.
      VitePWA({
        registerType: "autoUpdate",
        injectRegister: null,
        filename: "sw.js",
        // TanStack Start serves statics from the client build dir, which is
        // dist/client for the Lovable/Cloudflare target and .vercel/output/static
        // for self-hosted Vercel builds. The plugin otherwise writes sw.js to
        // the dist root where it is never served.
        outDir:
          process.env["LOVABLE_SANDBOX"] || process.env["DEV_SERVER__PROJECT_PATH"]
            ? "dist/client"
            : ".vercel/output/static",
        manifest: false, // we serve our own public/manifest.webmanifest
        devOptions: { enabled: false },
        workbox: {
          // SSR app: no static index.html exists, so offline navigations land
          // on the pre-cached offline page instead.
          navigateFallback: "/offline.html",
          navigateFallbackDenylist: [/^\/~oauth/],
          runtimeCaching: [
            {
              // Fal.ai video queue: never cache, always hit the network.
              urlPattern: /^https:\/\/queue\.fal\.run\/.*/i,
              handler: "NetworkOnly",
            },
            {
              // Same-origin hashed build assets are immutable.
              urlPattern: /\/assets\/.*/i,
              handler: "CacheFirst",
              options: {
                cacheName: "magicph-assets",
                expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 30 },
              },
            },
          ],
        },
      }),
    ],
  },
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  // Deploy target for builds run outside Lovable (e.g. Vercel CI): emit the Vercel
  // Build Output API into .vercel/output so the server renders there. Lovable's own
  // publish pipeline pins its Cloudflare layout, so this only affects self-hosted builds.
  nitro: { preset: "vercel" },
});
