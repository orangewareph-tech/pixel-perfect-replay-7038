import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const DISMISS_KEY = "magicph-install-dismissed";
const SHOW_DELAY_MS = 45_000;

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

/**
 * "Add to Home Screen" prompt. Shows 45s after the browser fires
 * beforeinstallprompt, remembers dismissal in localStorage.
 */
export function InstallBanner() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(DISMISS_KEY)) return;

    let timer: ReturnType<typeof setTimeout> | undefined;
    const onPrompt = (e: Event) => {
      e.preventDefault();
      const evt = e as BeforeInstallPromptEvent;
      setDeferred(evt);
      timer = setTimeout(() => setVisible(true), SHOW_DELAY_MS);
    };

    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      if (timer) clearTimeout(timer);
    };
  }, []);

  if (!visible || !deferred) return null;

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, "1");
    setVisible(false);
  };

  const install = async () => {
    await deferred.prompt();
    const choice = await deferred.userChoice;
    if (choice.outcome === "accepted") localStorage.setItem(DISMISS_KEY, "1");
    setVisible(false);
    setDeferred(null);
  };

  return (
    <div className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-md rounded-2xl border border-gold/40 bg-night-grad p-4 text-night-foreground shadow-glow">
      <p className="text-sm font-semibold">
        I-add sa Home Screen ang MagicPh AI para dali ra sunod! 📱✨
      </p>
      <p className="mt-1 text-xs opacity-80">No need Play Store!</p>
      <div className="mt-3 flex gap-2">
        <Button
          onClick={install}
          className="flex-1 rounded-full bg-gold-grad px-4 py-2 text-sm font-bold text-gold-foreground"
        >
          Add Now
        </Button>
        <Button variant="ghost"
          onClick={dismiss}
          className="rounded-full border border-night-foreground/30 px-4 py-2 text-sm font-semibold"
        >
          Later
        </Button>
      </div>
    </div>
  );
}
