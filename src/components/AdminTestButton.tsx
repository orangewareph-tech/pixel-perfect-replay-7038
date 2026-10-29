import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { isAdminEmail } from "@/lib/owner-tests";

// Visibility hint only; the dashboard's server functions re-check the verified email.
export function AdminTestButton({ email }: { email?: string | null }) {
  if (!isAdminEmail(email)) return null;
  return <Button asChild variant="outline"><Link to="/admin-dashboard">👑 Go to Admin Test Dashboard — FREE</Link></Button>;
}
