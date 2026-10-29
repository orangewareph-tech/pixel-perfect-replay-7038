# MagicPh AI

A Filipino Christmas photo-to-video app with a guided Cebuano creation flow, festive templates, automatic music, secure manual payment review, and personalized AI greetings.

## Features

- Five templates: **Parol Star Magic**, **Snowfall Magic**, **Fairy Lights Magic**, **Santa Village Magic**, and **Fireplace Noche Buena Magic**.
- Photo uploads: JPG or PNG, up to 10 MB.
- **5-second videos for ₱149** or **10-second videos for ₱299**, with Christmas music included and no music surcharge.
- Five-step flow: upload → template → duration → confirmation/payment → video/download.
- Optional AI-written Christmas captions based on a recipient’s name, a short greeting, and the selected template. Captions can be edited and copied; they are **not burned into the video**.
- Account-based receipt submission and administrator approval; one approved payment unlocks one video.
- One-click MP4 downloads with embedded Christmas audio and sharing actions.
- Home-screen installation support and non-blocking connection warnings.
- Protected administrator payment review, video diagnostics, and free media checks.

Template images and three-second animated previews are generated examples, not customer results or guarantees of the final video.

## Technology

- TanStack Start / TanStack Router, React 19, TypeScript
- Tailwind CSS v4 and shared UI components
- Lovable Cloud for accounts, private receipts, and payment records
- Fal.ai for video generation
- Lovable AI Gateway through the Vercel AI SDK for personalized captions
- Single-thread ffmpeg.wasm for browser-side music embedding
- Vitest for automated tests

## Local development

Use **Node.js 22** (see `.nvmrc`) and Bun. From the project folder:

```sh
bun install
bun run dev
```

Open the local address printed by the development server. The Lovable sandbox uses port 8080.

Other commands:

```sh
bun run test          # Run automated tests
bun run test:watch    # Watch tests
bun run lint         # Run ESLint
bun run build        # Create a production build
bun run preview      # Preview the production build
```

The existing tests cover pricing, payment rules, duration selection, music, offline recovery, access rules, routing, and Christmas message validation. Live AI/video calls require configured services; unit tests alone do not verify provider availability or real payment approval.

## Configuration and secrets

Keep secrets in Lovable’s secret settings or the hosting provider’s server environment. Never commit credentials or put private keys in `VITE_*` variables.

| Setting | Purpose |
| --- | --- |
| `FAL_KEY` | Server-side video generation credential; `FAL_API_KEY` remains a legacy fallback. |
| `LOVABLE_API_KEY` | Server-side AI Gateway credential, provisioned through Lovable. |
| `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` | Generated public connection settings for the Lovable Cloud browser client. |
| `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY` | Server connection settings where required by the generated Cloud integration. |

The generated Cloud server client handles privileged operations. Its managed service credential is **not available for manual export from Lovable Cloud**; do not fabricate a replacement or expose it to browsers. Self-hosting must verify that authenticated and privileged Cloud operations are supported in the target environment. Setting only `FAL_KEY` is not enough for the complete application.

Do not edit generated Cloud clients, auth middleware, connection files, or generated types manually. Apply schema changes using the project’s managed migration workflow.

## Accounts, payments, and safety

Video generation requires a signed-in owner and an atomically claimed, approved payment. Uploading a receipt does not approve a payment. Administrator access is verified server-side through protected role records; new accounts do not automatically receive that role.

Manual GCash/InstaPay receipt review is implemented. **Paymongo is not connected**, and automatic provider checkout remains disabled until configured and verified. Stripe is not part of this project’s payment setup.

Customer generation limits and the shared daily spending guard are enforced server-side. Ambiguous submissions remain saved for reconciliation rather than automatically creating another paid request. Receipts are private owner/administrator records.

Personalized greetings require sign-in, use `openai/gpt-6-astra` through AI Gateway’s Responses API, and keep prompts and keys on the server. AI usage consumes workspace credits. Provider access denials are persisted to prevent repeated blocked calls; restore access before explicitly clearing the server-side denial state and starting a fresh request.

## Music and downloads

All current previews and finished videos use automatic Christmas instrumental music at a default 70% volume. No customer music selector or separate music charge is required. Browser autoplay restrictions may require a sound-enabled play action.

Audio assets are original synthesized festive instrumentals, not recordings or covers of named commercial songs. Do not replace them with commercial recordings without appropriate synchronization rights.

Downloads fetch the video in bounded chunks, then lazy-load ffmpeg.wasm to embed AAC audio into an MP4 while preserving source audio. Allow the merge to finish before closing the page. Sharing the original provider URL does not include the separately added soundtrack; download the merged MP4 and upload it to social apps to share with sound.

Display aspect-ratio controls do not reshape the downloaded source video. Generation times are estimates, and exact face preservation is not guaranteed.

The pinned `@ffmpeg/core` build is GPL-2.0-or-later. Retain its license notice and review applicable redistribution obligations. Source and build instructions: <https://github.com/ffmpegwasm/ffmpeg.wasm/tree/v0.12.10>.

## PWA and offline recovery

The current release is **manifest-only**, without a new app-shell caching worker. Home-screen icons and a manifest with `start_url: "/"` remain available.

`public/sw.js` is a same-path cleanup release for the previous Workbox worker. It removes only its scoped Workbox caches and `magicph-assets`, recovers tabs, and unregisters itself. Keep it deployed at the same origin so returning installed-app users can receive the recovery; deleting the file is not sufficient. Messaging workers and caches must remain untouched.

Connection detection never replaces the running application. An already-open page remains browsable when disconnected, but new page loads, AI messages, and video generation require internet. Offline recovery includes retry and homepage actions.

## Deploy to Vercel

`vite.config.ts` uses the Vercel deployment preset for builds outside Lovable, emitting the Build Output API into `.vercel/output`. `vercel.json` specifies `npm run build`; `.nvmrc` pins Node 22. Lovable’s own publishing pipeline is unaffected.

1. Connect the repository to Vercel and select Node.js 22.
2. Install dependencies using the committed Bun lockfile and keep the configured build command.
3. Configure required public connection settings and server credentials in the deployment environment. Verify Cloud account, payment, and privileged operations are supported before launch.
4. Configure authentication’s allowed site/redirect addresses for the deployed origin.
5. Deploy and test sign-in, receipt submission, approved-credit access, captions, asset playback, and music-embedded downloads.

For an optional prebuilt deployment from a configured local environment:

```sh
bun run build
bunx vercel deploy --prebuilt
```

Keep the `/__l5e/assets-v1/` rewrite in `vercel.json`: imported media pointers and ffmpeg assets depend on this proxy to the published Lovable asset service. Update its destination if that published hostname changes.

## Project map

```text
src/routes/              Pages, guided creation, account and administrator views
src/components/          Template cards, payments, captions, video player and UI
src/lib/                 Validation, server functions, media and payment helpers
src/lib/ai/              Request-scoped AI Gateway helpers
src/hooks/               Hydration-safe preferences and connection status
src/assets/              Images and hosted-media asset pointers
src/test/                Automated tests
public/                  Manifest, icons, offline page and worker cleanup release
drizzle/migrations/      Managed database migrations
supabase/                Existing Cloud migration/configuration files
```

Read `AGENTS.md` before changing architecture and `roadmap.md` for outstanding verification and launch blockers. The README documents implemented behavior; it does not certify every paid or administrator workflow as production-verified.
