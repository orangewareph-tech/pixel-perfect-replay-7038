import { useEffect, useState } from "react";

export function canGenerateVideo(online: boolean): boolean {
  return online;
}

export function useOnlineStatus() {
  // SSR and the first browser render must agree; read browser state after hydration.
  const [online, setOnline] = useState(true);
  useEffect(() => {
    const sync = () => setOnline(navigator.onLine);
    sync();
    window.addEventListener("online", sync);
    window.addEventListener("offline", sync);
    return () => {
      window.removeEventListener("online", sync);
      window.removeEventListener("offline", sync);
    };
  }, []);
  return online;
}