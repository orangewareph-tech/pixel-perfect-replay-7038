import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import "@lovable.dev/cloud-auth-js/styles.css";
import { Header, Footer } from "@/components/SiteChrome";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/auth")({ head: () => ({ meta: [ { title: "Account Sign In — MagicPh AI" }, { name: "description", content: "Sign in to manage Christmas video payments, credits and saved videos." }, { property: "og:title", content: "MagicPh AI Account Sign In" }, { property: "og:description", content: "Secure account access for video payments and administrator review." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }, { name: "robots", content: "noindex" } ] }), component: Auth });
function Auth() {
  const navigate = useNavigate();
  const goBack = async () => { const target = sessionStorage.getItem("magicph_auth_return"); sessionStorage.removeItem("magicph_auth_return"); if (target === "/create" || target === "/payment" || target === "/admin") { window.location.assign(target); return; } await navigate({ to: "/create" }); };
  const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [signup, setSignup] = useState(false); const [message, setMessage] = useState(""); const [busy, setBusy] = useState(false);
  const [recovery, setRecovery] = useState(false);
  useEffect(() => {
    const recovering = new URLSearchParams(location.hash.slice(1)).get("type") === "recovery";
    setRecovery(recovering);
    if (!recovering) void supabase.auth.getUser().then(({ data }) => { if (data.user) void goBack(); });
  }, [navigate]);
  async function submit(event: FormEvent) {
    event.preventDefault(); setBusy(true); setMessage("");
    try {
      if (recovery) {
        const result = await supabase.auth.updateUser({ password });
        if (result.error) setMessage(result.error.message);
        else await goBack();
        return;
      }
      const result = signup ? await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${location.origin}/auth` } }) : await supabase.auth.signInWithPassword({ email, password });
      if (result.error) setMessage(result.error.message);
      else if (result.data.session) await goBack();
      else setMessage("Check your email to confirm your account. Administrator approval is required only for audit access.");
    } finally { setBusy(false); }
  }
  async function social(provider: "google" | "lovable") {
    const result = await lovable.auth.signInWithOAuth(provider, { redirect_uri: `${location.origin}/auth` });
    if (result.error) setMessage(result.error.message);
    else if (!result.redirected) await goBack();
  }
  return <><Header /><main className="mx-auto max-w-md px-4 py-12"><h1 className="text-3xl font-bold text-primary">MagicPh AI Audit</h1><form onSubmit={submit} className="mt-6 space-y-4"><label className="block">Email<Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" /></label><label className="block">Password<Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} autoComplete={signup ? "new-password" : "current-password"} /></label><Button className="w-full" disabled={busy}>{signup ? "Create account" : "Sign in"}</Button><Button type="button" variant="link" onClick={() => setSignup(!signup)}>{signup ? "Already have an account?" : "Create an account"}</Button></form><div className="mt-4 flex flex-col gap-3"><Button variant="outline" onClick={() => social("google")}>Continue with Google</Button><Button className="lovable-auth-button" onClick={() => social("lovable")}>Continue with Lovable</Button><Button variant="link" onClick={async () => { const result = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${location.origin}/auth` }); setMessage(result.error?.message ?? "Password reset email sent."); }}>Reset password</Button></div>{message && <p role="status" className="mt-4 text-sm">{message}</p>}</main><Footer /></>;
}