import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { authReturnPath } from "@/lib/google-auth";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/auth/callback")({
  component: AuthCallback,
});

function AuthCallback() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("Completing sign-in...");

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          setMessage(`Sign-in failed: ${error.message}`);
          setTimeout(() => navigate({ to: "/auth" }), 3000);
          return;
        }

        if (data.session) {
          const target = authReturnPath(sessionStorage.getItem("magicph_auth_return"));
          sessionStorage.removeItem("magicph_auth_return");
          await navigate({ to: target });
        } else {
          const { data: userData } = await supabase.auth.getUser();
          if (userData.user) {
            const target = authReturnPath(sessionStorage.getItem("magicph_auth_return"));
            sessionStorage.removeItem("magicph_auth_return");
            await navigate({ to: target });
          } else {
            setMessage("No session found. Redirecting to sign-in...");
            setTimeout(() => navigate({ to: "/auth" }), 2000);
          }
        }
      } catch (err) {
        setMessage(err instanceof Error ? err.message : "Callback failed");
        setTimeout(() => navigate({ to: "/auth" }), 3000);
      }
    };

    void handleCallback();
  }, [navigate]);

  return (
    <div className="mx-auto flex min-h- max-w-md flex-col items-center justify-center px-4 py-12 text-center">
      <Loader2 className="size-8 animate-spin text-primary" />
      <p className="mt-4 text-muted-foreground">{message}</p>
    </div>
  );
}