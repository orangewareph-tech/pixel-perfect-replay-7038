import { createMiddleware, createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { hasGoogleIdentity } from "./google-auth";

export const requireGoogleAuth = createMiddleware({ type: "function" })
  .middleware([requireSupabaseAuth])
  .server(async ({ context, next }) => {
    const { data, error } = await context.supabase.auth.getUser();
    if (error || !hasGoogleIdentity(data.user)) throw new Error("Continue with Google to access MagicPh AI.");
    return next({ context: { googleUser: data.user } });
  });

export const googleAccount = createServerFn({ method: "GET" }).middleware([requireGoogleAuth]).handler(({ context }) => {
  const user = context.googleUser;
  return { name: String(user?.user_metadata.full_name ?? "Google account"), email: user?.email ?? "", avatar: typeof user?.user_metadata.avatar_url === "string" ? user.user_metadata.avatar_url : "" };
});