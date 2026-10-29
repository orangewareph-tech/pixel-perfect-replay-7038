<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Rules

- Keep duration offers and validated Fal.ai payload construction in a shared browser-safe module, so upload, checkout, and server generation agree on the chosen duration; restore the optional local preference only after hydration.

- Pass template choices from the home page through the create route's validated search parameters, so uploading a photo preserves the selected template.

- Production builds run outside Lovable must keep emitting Vercel's Build Output
  API (the deploy preset in `vite.config.ts` plus `vercel.json`), because the site
  is self-hosted on Vercel; Lovable's own publish pipeline is unaffected and still
  builds for its own target.


## PWA
- PWA uses vite-plugin-pwa (generateSW, /sw.js); registration only via src/lib/pwa.ts, which refuses dev and Lovable preview hostnames, because a cached app shell in preview would serve stale code. sw.js outDir is dist/client for Lovable builds and .vercel/output/static for Vercel builds.
