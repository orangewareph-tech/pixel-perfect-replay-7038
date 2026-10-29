# MagicPh payment UX — read-only reference (no changes)

Nothing gets built from this. It's a reference record only. Approving it, skipping it or ignoring it makes no change to the app.

## Providers actually present
- GCash / InstaPay: manual payment. The customer scans a static QR code, uploads a receipt, and an administrator approves it.
- PayMongo: only a disabled button that says "Paymongo · not connected". There is no PayMongo code.
- PayMaya / Maya, GoTyme, Xendit, Stripe: there is no code or copy for any of them anywhere in the app.

## Files
- `src/components/PaymentPanel.tsx` is the main GCash/InstaPay panel. It shows the QR code, takes the receipt upload (JPG/PNG, max 2MB), checks payment status, lists credits, and shows the Generate button once a payment is approved.
  - Copy: "GCash / InstaPay · ₱{total}"
  - Copy: "Scan with GCash or an InstaPay-compatible app. Verify the recipient before sending ₱{total}."
  - Copy: "Save the receipt screenshot and upload it below."
  - Copy: "Wait for administrator verification, then generate your video. Transfer fees may apply."
  - Copy: "Payment pending verification. An administrator will review your receipt; timing may vary."
  - Copy: "🔒 Pay ₱{total} to unlock generation. Receipt approval is required."
  - Copy: "Approved — 1 video remaining"
  - QR alt text: "InstaPay payment QR for Jorjan G. Lanaja"
- `src/assets/payment-qr.jpeg.asset.json` points to the hosted image of the static GCash/InstaPay QR code.
- `src/components/MockPaymentFlow.tsx` is a practice run for administrators. Its button reads "Test Payment Flow · Mock ₱149", the screen says "Rehearsal only — do not scan or pay", and it says "Real video remains locked." It never saves a record.
- `src/lib/payments.functions.ts` holds the server functions, all behind Google sign-in:
  - `listMyPayments` reads your own rows in the `video_payments` table.
  - `submitReceipt` calls the `create_video_payment` database function with provider set to "manual".
  - `reviewPayment` is how an administrator approves or rejects a receipt.
  - `adminPaymentReport` builds the administrator's payment report.
  - `updateDailyLimit` changes the daily spending cap.
- `src/lib/payment-rules.ts` holds the payment rules:
  - A payment can be claimed only when its status is "approved".
  - `HOURLY_GENERATION_LIMIT` is set to 3.
  - It also holds the payment choices check (duration, music, template).
- `src/lib/fal.functions.ts` makes the paid video. It claims the approved payment with the `claim_video_payment` database function, sends the job to Fal, and updates `video_payments` through IN_QUEUE, then COMPLETED or FAILED.
- `src/lib/video-duration.ts` sets the prices: 5s is ₱149 (shown as "was ₱299") and 10s is ₱299. It also holds Fal's listed costs.
- `src/routes/_authenticated/payment.tsx` is the Payment & Video Credits page, which shows PaymentPanel. Its page description reads "Submit your GCash or InstaPay receipt … unlock one Christmas video."
- `src/routes/_authenticated/admin.tsx` is the administrator page:
  - A "Pending receipts" list with "Approve payment" and "Reject" buttons.
  - The note "Verify the received transfer in your payment account before approving."
  - Spending, credits and recent generations.
- `src/routes/create.tsx`, `src/routes/_authenticated/my-videos.tsx` and `src/routes/_authenticated/account.tsx` are where customers choose their options, get sent to payment, use credits and see their videos.
- `src/components/OwnerTestPanel.tsx`, `src/lib/owner-tests.ts`, `src/lib/fal-audit.functions.ts`, `src/lib/free-checks.ts` and `src/routes/_authenticated/test.tsx` handle owner and administrator free tests that skip payment.
- `src/components/CreationProgress.tsx`, `src/components/InstalledStatus.tsx`, `src/lib/christmas-music.ts`, `src/routes/index.tsx` and `src/routes/auth.tsx` only touch payment in passing: the price, unlock or "pay first" wording.
- `src/test/payment-rules.test.ts`, `src/test/owner-tests.test.ts`, `src/test/free-checks.test.ts` and `src/test/pinoy-templates.test.ts` are the automated tests for these rules.
- The `video_payments` table and the `create_video_payment` and `claim_video_payment` functions live in the database. There is no local migrations folder.

## Setting names (names only)
- `FAL_KEY` and `FAL_API_KEY` are the video service key.
- `LOVABLE_API_KEY` is for the caption feature.
- There are no settings at all for any payment provider: GCash, PayMongo, Xendit, Stripe or Maya.

## Flow from tap to unlock
1. On /create, the customer picks a template, length and music. Their choices are carried along in the page address.
2. They sign in with Google, then open /payment, where PaymentPanel shows the GCash/InstaPay QR code for the total.
3. They pay outside the app, in GCash or another InstaPay app.
4. They upload the receipt screenshot. `submitReceipt` saves it through `create_video_payment` as a "pending" row.
5. An administrator opens /admin, checks that the money arrived in the real account, and clicks Approve. The status becomes "approved", which is one credit.
6. The customer taps "Check payment status". The panel shows "Approved — 1 video remaining" and a "Generate {n}s video" button.
7. On Generate, the server claims the approved row with `claim_video_payment`. The claim is one-time, so a payment can't make two videos.
8. The server then sends the job to Fal, the row moves to IN_QUEUE and then COMPLETED, and the video URL is saved.
9. The customer downloads the video from /my-videos.
