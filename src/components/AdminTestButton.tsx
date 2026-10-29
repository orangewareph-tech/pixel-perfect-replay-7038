import { useState } from "react";
import { Button } from "@/components/ui/button";
import { isAdminEmail, ADMIN_LIMITS } from "@/lib/owner-tests";

export function AdminTestButton({ 
  email, 
  onTest, 
  templateId,
  disabled = false 
}: { 
  email?: string | null; 
  onTest: (duration: "5s" | "10s") => void;
  templateId: string;
  disabled?: boolean;
}) {
  const [loading, setLoading] = useState(false);
  
  if (!isAdminEmail(email || "")) {
    return null;
  }

  const handleTest = async (duration: "5s" | "10s") => {
    setLoading(true);
    try {
      await onTest(duration);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 rounded-lg border-2 border-yellow-400 bg-yellow-50 p-4">
      <div className="flex items-center gap-2">
        <span className="text-lg">👑</span>
        <span className="font-bold text-yellow-800">ADMIN TEST MODE</span>
        <span className="rounded bg-yellow-400 px-2 py-0.5 text-xs font-bold text-yellow-900">FREE</span>
      </div>
      <p className="mt-2 text-sm text-yellow-800">
        Test button for <span className="font-mono font-bold">{email}</span> ONLY
      </p>
      <p className="mt-1 text-xs text-yellow-700">
        Bypass P149 • Costs $0.35 (5s) • Limit 3/hour, 10/day
      </p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <Button
          onClick={() => handleTest("5s")}
          disabled={disabled || loading}
          className="bg-yellow-500 hover:bg-yellow-600 text-yellow-950 font-bold"
        >
          {loading ? "Testing..." : `Test 5s - ${templateId}`}
        </Button>
        <Button
          onClick={() => handleTest("10s")}
          disabled={disabled || loading}
          variant="outline"
          className="border-yellow-500 text-yellow-800"
        >
          {loading ? "Testing..." : `Test 10s`}
        </Button>
      </div>
    </div>
  );
}