import { Link } from "@tanstack/react-router";
import logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import { Search, LogOut } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

export function Header() {
  const queryClient = useQueryClient(); const navigate = useNavigate();
  const [signedIn, setSignedIn] = useState(false);
  useEffect(() => { void supabase.auth.getUser().then(({ data }) => setSignedIn(Boolean(data.user))); }, []);
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="MagicPh AI" width={40} height={40} className="h-10 w-10" />
          <span className="font-display text-xl font-bold text-primary">MagicPh <span className="text-gold">AI</span></span>
        </Link>
        <div className="flex flex-wrap items-center gap-2"><Button asChild variant="outline" size="sm"><Link to="/test"><Search aria-hidden="true" />Scan & Test Fal.ai</Link></Button>
        {signedIn && <Button aria-label="Sign out" title="Sign out" variant="ghost" size="icon" onClick={async () => { await queryClient.cancelQueries(); queryClient.clear(); await supabase.auth.signOut(); setSignedIn(false); await navigate({ to: "/auth", replace: true }); }}><LogOut /></Button>}
        <Link to="/create" className="rounded-full bg-festive px-4 py-2 text-sm font-bold text-primary-foreground shadow-festive">
          Upload Photo
        </Link>
        </div>
      </div>
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
