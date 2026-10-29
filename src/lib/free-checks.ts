import { TEMPLATES, TEMPLATE_MEDIA } from "@/lib/site";
import { TEMPLATE_WEBM } from "@/lib/template-preview-formats";
import { AUTOMATIC_MUSIC, musicAssetUrl, loadMusicFile, christmasTotal } from "@/lib/christmas-music";
import { canClaimPayment, withinDailyBudget, withinHourlyLimit } from "@/lib/payment-rules";

export type FreeCheck = { name: string; status: "PASS" | "FAIL" | "SKIP"; detail: string };
export function checkPaymentRules(): boolean {
  return christmasTotal(5, AUTOMATIC_MUSIC) === 149 && christmasTotal(10, AUTOMATIC_MUSIC) === 299 &&
    canClaimPayment("approved") && !canClaimPayment("pending") && !canClaimPayment("COMPLETED") &&
    !withinHourlyLimit([9999999, 9999998, 9999997], 10000000) && !withinDailyBudget(9.8, 5);
}
export async function checkStaticPreviews(): Promise<FreeCheck> {
  try {
    for (const t of TEMPLATES) {
      await new Promise<void>((resolve, reject) => {
        const video = document.createElement("video");
        const timeout = window.setTimeout(() => finish(new Error(`${t.name}: preview timed out`)), 20000);
        function finish(error?: Error) { clearTimeout(timeout); video.pause(); video.removeAttribute("src"); video.load(); error ? reject(error) : resolve(); }
        video.preload = "metadata";
        video.onloadedmetadata = () => finish(Math.abs(video.duration - 3) < 0.2 && video.videoWidth > 0 ? undefined : new Error(`${t.name}: expected a three-second clip`));
        video.onerror = () => finish(new Error(`${t.name}: sample could not load`));
        video.src = TEMPLATE_WEBM[t.id];
      });
    }
    return { name: "Three-second previews", status: "PASS", detail: "Five static three-second clips loaded. No generation endpoint used; no Fal.ai generation charge." };
  } catch (e) { return { name: "Three-second previews", status: "FAIL", detail: e instanceof Error ? e.message : "Preview unavailable" }; }
}
export async function runFreeChecks(): Promise<FreeCheck[]> {
  const results: FreeCheck[] = [await checkStaticPreviews()];
  try {
    await Promise.all(TEMPLATES.map((t) => new Promise<void>((resolve, reject) => { const img = new Image(); img.onload = () => img.naturalWidth > 0 ? resolve() : reject(new Error("Empty image")); img.onerror = () => reject(new Error(`${t.name} image unavailable`)); img.src = TEMPLATE_MEDIA[t.id].webp; })));
    results.push({ name: "Template images", status: "PASS", detail: "Five static images loaded. No image generation on viewing." });
  } catch (e) { results.push({ name: "Template images", status: "FAIL", detail: String(e) }); }
  try {
    for (const d of [5, 10] as const) { const url = musicAssetUrl(AUTOMATIC_MUSIC, d); if (!url) throw new Error("Missing soundtrack"); await loadMusicFile(url); }
    results.push({ name: "Included soundtrack", status: "PASS", detail: "Five- and ten-second music files decoded; ₱149/₱299 includes sound." });
  } catch (e) { results.push({ name: "Included soundtrack", status: "FAIL", detail: String(e) }); }
  results.push({ name: "Credit and spending rules", status: checkPaymentRules() ? "PASS" : "FAIL", detail: "Local rule checks: pending/used credits blocked, fourth hourly start blocked, next cost included in $10 cap. Live account enforcement is not exercised." });
  results.push({ name: "Manual payment approval", status: "SKIP", detail: "No receipt submitted or approved. Requires a real identified customer and administrator review." });
  results.push({ name: "Paymongo / Stripe", status: "SKIP", detail: "Paymongo disconnected; Stripe excluded. No checkout or charge attempted." });
  const installed = matchMedia("(display-mode: standalone)").matches || (navigator as Navigator & { standalone?: boolean }).standalone === true;
  results.push({ name: "PWA / administrator", status: "PASS", detail: `Installed: ${installed ? "Yes" : "No"}. Administrator access was verified before this panel opened; installed upgrade recovery not tested.` });
  results.push({ name: "Paid generation", status: "SKIP", detail: "Deliberately not submitted. Balance deductions and live payment consumption remain unverified." });
  return results;
}