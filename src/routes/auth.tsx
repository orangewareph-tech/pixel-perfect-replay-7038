import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Header, Footer } from "@/components/SiteChrome";
import { Button } from "@/components/ui/button";
import { GoogleMark } from "@/components/GoogleMark";
import { authReturnPath, hasGoogleIdentity } from "@/lib/google-auth";
import logo from "@/assets/logo.png";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/auth")({ 
  head: () => ({ 
    meta: [ 
      { title: "Account Sign In — MagicPh AI" }, 
      { name: "description", content: "Sign in to manage Christmas video payments, credits and saved videos." }, 
      { property: "og:title", content: "MagicPh AI Account Sign In" }, 
      { property: "og:description", content: "Secure account access for video payments and administrator review." }, 
      { property: "og:type", content: "website" }, 
      { name: "twitter:card", content: "summary" }, 
      { name: "robots", content: "noindex" } 
    ] 
  }), 
  component: Auth 
});

function Auth() {
  const navigate = useNavigate();
  const goBack = async () => { 
    const target = authReturnPath(sessionStorage.getItem("magicph_auth_return")); 
    sessionStorage.removeItem("magicph_auth_return"); 
    await navigate({ to: target }); 
  };
  const [message, setMessage] = useState(""); 
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void supabase.auth.getUser().then(({ data }) => { 
      if (hasGoogleIdentity(data.user)) void goBack(); 
    });
  }, [navigate]);

  async function social() {
    setBusy(true); 
    setMessage("");
    try {
      // FIXED: Use Supabase auth directly for Vercel - NOT lovable.auth
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: "offline",
            prompt: "select_account",
          },
        },
      });
      
      if (error) {
        setMessage(error.message);
        console.error("Google sign-in error:", error);
      } else if (data.url) {
        // Redirect to Google
        window.location.href = data.url;
      } else {
        // Check if already signed in
        const { data: userData } = await supabase.auth.getUser(); 
        if (hasGoogleIdentity(userData.user)) {
          await goBack(); 
        } else {
          setMessage("Google sign-in has not completed. Please try again.");
        }
      }
    } catch (error) { 
      setMessage(error instanceof Error ? error.message : "Google sign-in could not finish.");
      console.error("Google sign-in exception:", error);
    } finally { 
      setBusy(false); 
    }
  }

  return (
    <>
      <Header />
      <main className="mx-auto flex min-h- max-w-md flex-col items-center justify-center px-4 py-12 text-center">
        <img src={logo} alt="" className="size-24" />
        <h1 className="mt-5 text-3xl font-bold text-primary">MagicPh AI</h1>
        <p className="mt-2 font-display text-lg text-christmas-green">Christmas Magic</p>
        <p className="mt-4 text-muted-foreground">Sign in with Google to create magical Christmas videos</p>
        <Button 
          variant="outline" 
          onClick={() => void social()} 
          disabled={busy} 
          className="mt-7 h-auto min-h-12 w-full max-w-80 whitespace-normal bg-card py-3 font-semibold shadow-sm"
        >
          {busy ? <Loader2 className="animate-spin" /> : <GoogleMark />}
          {busy ? "Signing in with Google…" : "Continue with Google"}
        </Button>
        <p className="mt-5 text-xs text-muted-foreground">Secure sign-in with Google · Your unfinished photo stays on this device</p>
        {message && <p role="alert" className="mt-4 break-words text-sm text-destructive">{message}</p>}
      </main>
      <Footer />
    </>
  );
}