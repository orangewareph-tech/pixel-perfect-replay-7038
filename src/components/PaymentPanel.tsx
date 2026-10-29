import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Button } from "@/components/ui/button";
import { submitReceipt, listMyPayments } from "@/lib/payments.functions";
import { christmasTotal } from "@/lib/christmas-music";
import type { PaymentChoices } from "@/lib/payment-rules";
import qr from "@/assets/payment-qr.jpeg.asset.json";

type Payment = Awaited<ReturnType<typeof listMyPayments>>["payments"][number];
export function PaymentPanel({ choices, onApproved, payments, onRefresh }: { choices: PaymentChoices; onApproved?: (payment: Payment) => void; payments: Payment[]; onRefresh: () => Promise<void> }) {
  const submit = useServerFn(submitReceipt);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const total = christmasTotal(choices.duration, choices.music);
  const matching = payments.filter((payment) => payment.duration === choices.duration && payment.music === choices.music && payment.template === choices.template);
  async function upload(file?: File) {
    if (!file) return;
    if (!["image/jpeg", "image/png"].includes(file.type) || file.size > 2 * 1024 * 1024) { setMessage("Use a JPG or PNG receipt, max 2MB."); return; }
    setBusy(true); setMessage("");
    try {
      const receipt = await new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => typeof reader.result === "string" ? resolve(reader.result) : reject(new Error("Could not read receipt")); reader.onerror = () => reject(new Error("Could not read receipt")); reader.readAsDataURL(file); });
      await submit({ data: { ...choices, receipt } });
      setMessage("Payment pending verification. An administrator will review your receipt; timing may vary.");
      await onRefresh();
    } catch (error) { setMessage(error instanceof Error ? error.message : "Receipt could not be submitted. Sign in first."); }
    finally { setBusy(false); }
  }
  return <section className="mt-6 border-t py-6">
    <h2 className="text-xl font-bold text-primary">GCash / InstaPay · ₱{total}</h2>
    <p className="mt-2 text-sm">{choices.duration} seconds{choices.music !== "no-music" ? " + Music" : ""} · one video credit</p>
    <img src={qr.url} alt="InstaPay payment QR for Jorjan G. Lanaja" className="mx-auto mt-4 w-full max-w-xs rounded-lg border border-border" />
    <p className="mt-3 text-center font-bold">Jorjan G. Lanaja · 09752765499</p>
    <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm"><li>Scan with GCash or an InstaPay-compatible app. Verify the recipient before sending ₱{total}.</li><li>Save the receipt screenshot and upload it below.</li><li>Wait for administrator verification, then generate your video. Transfer fees may apply.</li></ol>
    <label className="mt-5 block text-sm font-bold">Upload payment receipt<input disabled={busy} type="file" accept="image/jpeg,image/png" className="mt-2 block w-full rounded-lg border border-input bg-background p-3 text-sm" onChange={(event) => { void upload(event.target.files?.[0]); event.target.value = ""; }} /></label>
    {message && <p role="status" className="mt-3 text-sm">{message}</p>}
    <div className="mt-5 flex flex-wrap items-center gap-3"><Button variant="outline" disabled={busy} onClick={() => void onRefresh()}>Check payment status</Button><Button variant="outline" disabled>Paymongo · not connected</Button><Button asChild variant="link"><Link to="/auth">Sign in / create account</Link></Button></div>
    <p className="mt-4 font-bold text-christmas-green">Your credits: {matching.filter((payment) => payment.status === "approved").length} for this selection</p>
    <ul className="mt-3 space-y-3">{matching.map((payment) => <li key={payment.id} className="flex flex-wrap items-center justify-between gap-3 border-b py-3 text-sm"><span>₱{payment.amount} · {payment.status === "approved" ? "Approved — 1 video remaining" : payment.status} · {new Date(payment.created_at).toLocaleDateString()}</span>{payment.status === "approved" && onApproved && <Button onClick={() => onApproved(payment)}>Generate {payment.duration}s video</Button>}{payment.status === "approved" && !onApproved && <Button asChild><Link to="/create" search={{ duration: choices.duration, music: choices.music, template: choices.template }}>Upload photo & generate</Link></Button>}</li>)}</ul>
    {!matching.some((payment) => payment.status === "approved") && <p className="mt-4 font-bold text-primary">🔒 Pay ₱{total} to unlock generation. Receipt approval is required.</p>}
  </section>;
}