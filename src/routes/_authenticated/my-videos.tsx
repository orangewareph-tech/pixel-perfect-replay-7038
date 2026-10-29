import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { listMyPayments } from "@/lib/payments.functions";
import { Header, Footer } from "@/components/SiteChrome";
import { Button } from "@/components/ui/button";
const options = queryOptions({ queryKey: ["my-video-payments"], queryFn: () => listMyPayments() });
export const Route = createFileRoute("/_authenticated/my-videos")({
  loader: ({ context }) => context.queryClient.ensureQueryData(options),
  head: () => ({ meta: [{ title: "My Christmas Videos — MagicPh AI" }, { name: "description", content: "Your saved MagicPh AI Christmas video requests." }, { property: "og:title", content: "My MagicPh AI Videos" }, { property: "og:description", content: "Private Christmas video history and request status." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }, { name: "robots", content: "noindex" }] }),
  component: Videos,
});
function Videos() {
  const rows = useSuspenseQuery(options).data.payments.filter((payment) => payment.request_id || payment.status === "SUBMITTING");
  return <><Header /><main className="mx-auto max-w-2xl px-4 py-10"><h1 className="text-3xl font-bold text-primary">My Christmas videos</h1>{rows.length ? <ul className="mt-6 divide-y">{rows.map((row) => <li key={row.id} className="flex flex-wrap items-center justify-between gap-3 py-4"><div><p className="font-bold">{row.duration}s Christmas magic</p><p className="text-sm text-muted-foreground">{row.status}</p></div><Button asChild variant="outline"><Link to="/create">Open saved videos</Link></Button></li>)}</ul> : <p className="mt-6 text-muted-foreground">No video requests yet.</p>}<Button asChild className="mt-6"><Link to="/create">Create a video</Link></Button></main><Footer /></>;
}