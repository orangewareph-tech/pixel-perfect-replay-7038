import type { User } from "@supabase/supabase-js";

export function hasGoogleIdentity(user: Pick<User, "identities" | "app_metadata"> | null | undefined) {
  return Boolean(user?.identities?.some((identity) => identity.provider === "google") || user?.app_metadata.provider === "google" || user?.app_metadata.providers?.includes("google"));
}
export function authReturnPath(value: string | null) {
  const allowed = ["/create", "/payment", "/admin", "/test", "/my-videos", "/account"];
  if (!value || value.startsWith("//")) return "/create";
  const path = value.split("?")[0] ?? "";
  return allowed.includes(path) ? value : "/create";
}