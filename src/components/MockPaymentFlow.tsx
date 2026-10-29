import { useState } from "react";
import { Button } from "@/components/ui/button";
import paymentQr from "@/assets/instapay-qr.jpeg.asset.json";

export function MockPaymentFlow() {
  const [stage, setStage] = useState(0);
  return <section className="border-t py-6"><h2 className="text-xl font-bold">Customer payment rehearsal · ₱0</h2><p className="mt-2 text-sm text-muted-foreground">Mock ₱149 only. No transfer, payment credit or real video.</p>
    {stage === 0 ? <Button className="mt-4" variant="outline" onClick={() => setStage(1)}>Test Payment Flow · Mock ₱149</Button> : <div className="mt-4"><img src={paymentQr.url} alt="GCash / InstaPay payment reference — do not pay during rehearsal" className="max-h-64 w-48 object-contain" /><p className="mt-2 font-bold">Rehearsal only — do not scan or pay</p><p role="status" className="mt-2">{stage === 1 ? "Mock receipt awaiting review" : "Mock review complete. Real video remains locked."}</p><div className="mt-3 flex flex-wrap gap-3">{stage === 1 && <Button onClick={() => setStage(2)}>Simulate receipt review</Button>}<Button variant="ghost" onClick={() => setStage(0)}>Reset rehearsal</Button></div></div>}
  </section>;
}