# Guided creation flow
- [ ] Separate upload, template, music/duration, confirmation/payment and video into five steps with sticky progress and Back actions.
- [ ] Keep payment security, media controls and download/share features; remove public diagnostics navigation.
- [ ] Verify step transitions, live totals, retained choices, and desktop/mobile layout.

# Secure payment launch
- [x] Protect customer generation with authenticated, single-use approved payment credits; direct unpaid calls reject before Fal submission.
- [x] Add manual payment receipt submission and administrator review using the uploaded InstaPay QR and confirmed recipient.
- [x] Add protected administrator dashboard and installed-app status checks.
- [ ] Connect Paymongo — connection was declined; automatic checkout remains disabled. Stripe excluded by user choice.
- [x] Enforce confirmed custom account limits: three starts per hour and atomic UTC daily budget reservations, including administrator tests.
- [x] Run 45 tests and verify unpaid checkout, direct-call rejection and protected-page redirects with no browser errors.
- [ ] Verify receipt approval, credit consumption and authenticated administrator views end-to-end — requesting user has no matching app account; awaits sign-in or an identified account.

# Full app testing
- [x] Run all 36 automated tests; verify five templates, eight playable music clips, saved preferences, four prices, mobile layout, signed-out audit redirect, offline checkout recovery, and real 5s/10s video downloads (5s contains audible AAC music).
- [ ] Verify protected audit with the owner's account — blocked until the owner signs in or identifies a test account.
- [ ] Verify installed-app stale-worker upgrade end-to-end — browser harness stalled during worker activation; isolated cleanup tests pass, but a deployed installed-app upgrade remains unverified.

## Test findings
- Manual payments now require account receipt submission and administrator approval. Paymongo remains disconnected; older bundle plans do not change delivery or checkout.
- Customer generation now requires approved single-use payment credits and atomic account/budget checks. Authenticated paid end-to-end launch verification is still required.
- Saved files retain the uploaded photo's aspect ratio; display toggles do not reshape the downloaded video.
- Generation failure handling and download range validation need hardening; this testing request did not change these rules.

# Offline recovery
- [x] Replace the broken navigation worker with a same-path cleanup release, preserving home-screen support.
- [x] Add non-blocking offline warning, retry, and video-generation guard; verify cache cleanup and online recovery.

# Video duration selection
- [x] Add reusable duration offers, saved selection, and pricing estimates.
- [x] Connect choices through upload, checkout, and Fal.ai requests.
- [x] Verify both duration flows, persistence, mobile layout, and provider pricing.

# Fal.ai audit
- [x] Correct actual costs and profit rules.
- [x] Add protected scan/test dashboard with real connectivity and generation results.
- [x] Verify balance availability, parameters, PWA, payment placeholders, and concurrent checks.
- [x] Run live tests and report verified outcomes and limitations.
- [ ] Approve the owner's audit account — waiting for the owner to sign in; no existing owner account.

# Public page polish
- [x] Remove all public internal cost/profit information and align duration/pricing copy.
- [x] Correct plan/duration links, open first FAQ, improve testimonial spacing, delay install prompt.
- [x] Hide published Lovable badge and verify desktop/mobile public page.

# Christmas magic and music
- [x] Add enhanced duration-specific prompts and five saved magical templates.
- [x] Add saved music choices, dynamic totals, synchronized preview and volume/loop controls.
- [x] Prepare real music-embedded MP4 downloads; do not sell or promise missing licensed songs.
- [x] Verify pricing, preferences, mobile layout, real 5s Parol generation/save, and music merging with synthetic audio; licensed-song end-to-end awaits files.
- [x] Make music functional with eight original synthesized festive MP3s; verify all clips play at 70%, ready pricing, saved choice, and a real 5s Parol MP4 download containing audible AAC music.