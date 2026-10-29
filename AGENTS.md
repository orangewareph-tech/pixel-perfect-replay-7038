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

- Personalized Christmas captions use an authenticated server function and request-scoped AI Gateway Responses helpers; keep prompts/keys server-only, persist provider denials, and retain caption drafts only across sign-in without changing video payment or rendering payloads.

- Keep template images, accessible labels, badges and CDN-hosted sample clips in the shared browser-safe template catalogue; label animated generated samples honestly and keep preview actions separate from selection.

- Keep creation choices in the protected create route and save a one-time IndexedDB draft across sign-in/sign-out, so private photos survive account navigation without entering URLs; progress rendering stays in a shared presentation component.
- Compose Google identity enforcement after managed account authentication for private server functions, use the managed OAuth broker and public auth callback, and never duplicate tokens into custom storage; keep integration-managed route guards unchanged.

- Customer videos require authenticated ownership and an atomically claimed approved video_payments row; never trust client credits, approval timers or passwords. Reserve before Fal submission, retain ambiguous failures for reconciliation, and count administrator tests in the shared UTC daily budget so retries cannot create unpaid charges.
- Payment prices, duration, music and template are stored by validated account operations; only authenticated administrator review may approve manual receipts. Keep provider checkout disabled until its connection and server-side verification are configured.
- Payment receipts are private account records with owner/admin SELECT only; server-only privileged writes follow verified ownership or role checks, and public pages expose no internal spending values.

- Public duration selectors show customer pricing only; internal cost/profit calculations belong exclusively in the administrator audit.

- Protect Fal.ai diagnostics and paid test functions with Cloud authentication plus a server-verified user_roles admin row; never grant admin to new signups automatically, and persist test jobs to prevent overlapping paid runs.
- Provision only the verified Google owner through an authenticated database function; keep owner bypasses on the audit queue, with immutable atomic reservations shared with customer hourly/daily limits. Mock payments never write payment records or submit jobs.

- Keep duration offers and validated Fal.ai payload construction in a shared browser-safe module, so upload, checkout, and server generation agree on the chosen duration; restore the optional local preference only after hydration.
- Keep each template's effects in the shared catalogue, shared templateSchema validation in captions/payment/owner tests, and duration pacing through buildVideoInput, so all creation paths accept the same choices without mixing scenes. New catalogue choices must also be allowed by payment constraints and owner-reservation validation.
- Download Fal.ai videos in bounded ranged chunks and assemble a browser Blob, because full base64 MP4 responses exceed server-function serialization limits for longer videos.

- Pass template choices from the home page through the create route's validated search parameters, so uploading a photo preserves the selected template.
- Keep included automatic soundtrack pricing and duration-specific audio in browser-safe shared modules; preserve legacy payment records but never restore old silent preferences for newly rendered downloads.
- Resolve playable music through imported per-duration asset pointers, not the reserved /music file names, so repository binaries and missing local paths cannot block playback.
- Decode real song files before enabling music generation; missing audio must block the music checkout, because filenames are not playable tracks or license evidence.
- Lazy-load the single-thread ffmpeg browser worker only for music downloads, use asset-hosted WASM, preserve source audio and return an actually muxed MP4; do not change cross-origin isolation headers or pre-cache the large core.
- Preserve Vercel's asset-prefix rewrite to the published Lovable asset service, because relative asset pointers require that proxy when self-hosted.

- Production builds run outside Lovable must keep emitting Vercel's Build Output
  API (the deploy preset in `vite.config.ts` plus `vercel.json`), because the site
  is self-hosted on Vercel; Lovable's own publish pipeline is unaffected and still
  builds for its own target.


## PWA
- Manual cache recovery only deletes scoped legacy app caches, never auth storage or private drafts; show a recovery release rather than inventing an active cache version, and defer reload on the creation page to preserve in-progress work.
- PWA is manifest-only during offline recovery; keep public/sw.js as a same-path kill-switch release to retire the old Workbox navigation fallback, delete only its scoped Workbox caches and magicph-assets, and leave messaging workers/caches alone. Never register a new app-shell worker during this release; src/lib/pwa.ts only updates existing /sw.js registrations so cleanup can activate.
- Use the hydration-safe shared online-status hook for non-blocking connection warnings and generation guards, never to replace the route or discard in-progress photo choices.
- The /admin-dashboard free tests authorize via the server-verified Google email in ADMIN_EMAILS and keep history in browser storage only; never add client-side bypass codes or browser-exposed Fal keys, because either would let anyone spend Fal credits.
