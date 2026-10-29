import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { paymentChoicesSchema } from "@/lib/payment-rules";
import { listMyPayments } from "@/lib/payments.functions";
import { PaymentPanel } from "@/components/PaymentPanel";
import { Header, Footer } from "@/components/SiteChrome";

const options = queryOptions({ queryKey: ["my-payments"], queryFn: () => listMyPayments() });
export const Route = createFileRoute("/_authenticated/payment")({
  validateSearch: (input) => paymentChoicesSchema.parse({ duration: Number(input.duration ?? 5), music: input.music ?? "no-music", template: input.template ?? "parol" }),
  loader: ({ context }) => context.queryClient.ensureQueryData(options),
  head: () => ({ meta: [{ title: "Payment & Video Credits — MagicPh AI" }, { name: "description", content: "Submit your GCash or InstaPay receipt for administrator approval and unlock one Christmas video." }, { property: "og:title", content: "MagicPh AI Payment" }, { property: "og:description", content: "Secure account-based receipt review and video credits." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }, { name: "robots", content: "noindex" }] }),
  component: PaymentPage,
});
function PaymentPage() {
  const query = useSuspenseQuery(options);
  return <><Header /><main className="mx-auto max-w-2xl px-4 py-10"><h1 className="text-3xl font-bold text-primary">Payment & Video Credits</h1><p className="mt-3 text-sm">{query.data.email}</p><PaymentPanel choices={Route.useSearch()} payments={query.data.payments} onRefresh={async () => { await query.refetch(); }} /></main><Footer /></>;
}