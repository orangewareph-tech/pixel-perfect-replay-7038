import { Link } from "@tanstack/react-router";
import logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import { Crown, LogOut, RefreshCw } from "lucide-react";
import { useOnlineStatus } from "@/hooks/use-online-status";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { CacheRecovery } from "@/components/CacheRecovery";
import { hasGoogleIdentity } from "@/lib/google-auth";
import { useServerFn } from "@tanstack/react-start";
import { ownerTestReport } from "@/lib/fal-audit.functions";

export function Header({ sticky = true }: { sticky?: boolean }) {
  const online = useOnlineStatus();
  const queryClient = useQueryClient(); const navigate = useNavigate();
  const { data: user } = useQuery({ queryKey: ["header-session"], queryFn: async () => { const { data } = await supabase.auth.getUser(); return hasGoogleIdentity(data.user) ? data.user : null; }, retry: false });
  const ownerReport = useServerFn(ownerTestReport);
  const { data: owner } = useQuery({ queryKey: ["header-owner", user?.id], queryFn: () => ownerReport(), enabled: Boolean(user), retry: false });
  return (
    <header className={`${sticky ? "sticky top-0" : "relative"} z-40 border-b border-border/60 bg-background/85 backdrop-blur`}>
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="MagicPh AI" width={40} height={40} className="h-10 w-10" />
          <span className="font-display text-xl font-bold text-primary">MagicPh <span className="text-gold">AI</span></span>
        </Link>
        <div className="flex flex-wrap items-center gap-2">
        <CacheRecovery />
        {owner?.owner && <Link to="/admin" className="flex items-center gap-1 rounded-md bg-gold px-2 py-1 text-xs font-bold text-gold-foreground"><Crown className="size-4" />ADMIN · Test mode</Link>}
        {user && <><Link to="/account" className="flex min-w-0 max-w-56 items-center gap-2" aria-label="Google account">{typeof user.user_metadata['avatar_url'] === "string" && <img src={user.user_metadata['avatar_url']} alt="" referrerPolicy="no-referrer" className="size-8 rounded-full" />}<span className="min-w-0 text-xs"><span className="block truncate font-bold">{user.user_metadata['full_name'] ?? "Google account"}</span><span className="block truncate text-muted-foreground">{user.email}</span></span></Link><Button aria-label="Sign out" title="Sign out" variant="ghost" size="icon" onClick={async () => { const saves: Promise<unknown>[] = []; window.dispatchEvent(new CustomEvent("magicph-preserve-draft", { detail: { saves } })); try { await Promise.all(saves); } catch { window.alert("Your unfinished photo could not be saved. Please finish or download it before signing out."); return; } await queryClient.cancelQueries(); queryClient.clear(); await supabase.auth.signOut(); await navigate({ to: "/auth", replace: true }); }}><LogOut /></Button></>}
        <Link to="/create" className="rounded-full bg-festive px-4 py-2 text-sm font-bold text-primary-foreground shadow-festive">
          Upload Photo
        </Link>
        </div>
      </div>
      {!online && <div role="status" className="flex flex-wrap items-center justify-center gap-2 bg-secondary px-4 py-2 text-center text-sm text-secondary-foreground">
        <span>Offline ka — some features may not work</span>
        <Button variant="outline" size="sm" onClick={() => window.location.reload()}><RefreshCw aria-hidden="true" />Try Again — Balik Online</Button>
      </div>}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="bg-night-grad text-night-foreground">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2">
            <img src={logo} alt="" width={44} height={44} loading="lazy" className="h-11 w-11" />
            <span className="font-display text-2xl font-bold">MagicPh <span className="text-gold">AI</span></span>
          </div>
          <p className="mt-3 text-sm opacity-80">Ang Pasko, Magic! Family Pic to Christmas Video in 60 seconds.</p>
        </div>
        <div className="space-y-1 text-sm">
          <h4 className="mb-2 font-display text-lg text-gold">Contact</h4>
          <a className="block hover:text-gold" href="https://facebook.com/magicphai" target="_blank" rel="noreferrer">Facebook Page</a>
          <a className="block hover:text-gold" href="https://tiktok.com/@magicphai" target="_blank" rel="noreferrer">TikTok</a>
          <a className="block hover:text-gold" href="mailto:hello@magicph.ai">hello@magicph.ai</a>
        </div>
        <p className="self-end text-xs opacity-70 md:text-right">Powered by Fal.ai Kling v2.5 Turbo + Google Flow 10s<br />© 2026 MagicPh AI</p>
      </div>
    </footer>
  );
}

export function Snow({ count = 30 }: { count?: number }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className="animate-snow absolute top-0 block rounded-full bg-night-foreground"
          style={{
            left: `${(i * 37) % 100}%`,
            width: `${2 + (i % 4)}px`,
            height: `${2 + (i % 4)}px`,
            animationDuration: `${6 + (i % 7)}s`,
            animationDelay: `${(i % 10) * 0.6}s`,
          }}
        />
      ))}
    </div>
  );
}
