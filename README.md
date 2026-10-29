# Welcome to your Lovable project

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Open your project in the [Lovable editor](https://lovable.dev) and keep building.

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: connect the project to GitHub and every change made in Lovable is committed straight to your repository.
- **Full ownership**: this code is yours. Push to your repository and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

## Deploy to Vercel

This repo builds straight to Vercel's Build Output API (`.vercel/output`) — no
extra plugins or config to maintain. `vercel.json` keeps the build command
explicit, and `.nvmrc` pins Node 22 so the deployed function runs on the Node 22
runtime.

1. Push this repository to GitHub and import it into Vercel.
2. Vercel installs dependencies (Bun is picked up from `bun.lock`) and runs
   `npm run build`, which produces the serverless function plus static assets.
3. In **Settings → Environment Variables**, add `FAL_KEY` (the video service
   key) for the Production environment, then deploy.
4. Optional, for a one-off deploy straight from your machine:
   `npm run build && npx vercel deploy --prebuilt`.

Deploying from Lovable is unaffected — Lovable's own publish pipeline keeps its
Cloudflare layout, and the Vercel target only applies to builds run outside it.

## Built with

## Offline recovery release

Home-screen icons and the manifest remain available. New app-shell caching is
disabled for this release: `public/sw.js` replaces the previous Workbox worker
at the same deployed URL, removes only its scoped Workbox caches and
`magicph-assets`, recovers open tabs, and unregisters itself. Keep this file
available for returning installed-app users; deleting the old worker is not
sufficient. Publish/deploy this release to the same origin before installed
apps can recover. Reopening while online lets the browser check for the update.
An already-open app stays usable while disconnected, but new page loads and
video generation require internet. Offline warnings never replace the app.

## Christmas music

The five magic templates and four playable music upgrades are available.
Eight asset-hosted MP3s provide 5/10-second original synthesized festive bell
instrumentals. These are not recordings or covers of the named songs; the music
selector discloses this. Music adds ₱20 and previews at 70% volume by default.
Do not replace tracks with commercial recordings without synchronization rights.

Music downloads lazy-load single-thread ffmpeg.wasm and embed AAC sound in the
MP4, honoring volume/loop settings and preserving any original audio. Large
WASM is asset-hosted (not checked into the repository); the Vercel rewrite
for `/__l5e/assets-v1/` keeps these pointer URLs working outside Lovable.
If the published Lovable hostname changes, update that rewrite destination.

The pinned `@ffmpeg/core` build is GPL-2.0-or-later. Source and build instructions:
https://github.com/ffmpegwasm/ffmpeg.wasm/tree/v0.12.10 . Retain the license notice
and review applicable redistribution obligations before distributing the core.


- TanStack Start
- TypeScript
- React
- Tailwind CSS
