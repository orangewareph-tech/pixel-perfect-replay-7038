import { AdminTestButton } from "@/components/AdminTestButton";
import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { googleAccount } from "@/lib/google-auth.functions";
import { Header, Footer } from "@/components/SiteChrome";
import { Button } from "@/components/ui/button";
const options = queryOptions({ queryKey: ["google-account"], queryFn: () => googleAccount() });
export const Route = createFileRoute("/_authenticated/account")({
  loader: ({ context }) => context.queryClient.ensureQueryData(options),
  head: () => ({ meta: [{ title: "Your Google Account — MagicPh AI" }, { name: "description", content: "Your MagicPh AI Google account and Christmas videos." }, { property: "og:title", content: "Your MagicPh AI Account" }, { property: "og:description", content: "Manage your Christmas video account." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }, { name: "robots", content: "noindex" }] }),
  component: Account,
});
function Account() {
  const user = useSuspenseQuery(options).data;
  return <><Header /><main className="mx-auto max-w-xl px-4 py-10"><h1 className="text-3xl font-bold text-primary">Your account</h1><div className="mt-6 flex items-center gap-4">{user.avatar && <img src={user.avatar} alt="" referrerPolicy="no-referrer" className="size-16 rounded-full" />}<div className="min-w-0"><h2 className="break-words text-xl font-bold">{user.name}</h2><p className="break-all text-muted-foreground">{user.email}</p><p className="mt-1 text-sm">Google sign-in</p></div></div><div className="mt-6 flex flex-wrap gap-3"><Button asChild><Link to="/create">Create a video</Link></Button><Button variant="outline" asChild><Link to="/my-videos">My videos</Link></Button><Button variant="outline" asChild><Link to="/payment" search={{ duration: 5, template: "parol", music: "pasko-sa-nayon" }}>Payments</Link></Button><AdminTestButton email={user.email} /></div></main><Footer /></>;
}