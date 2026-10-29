import { useEffect, useState } from "react";
import { loadMusicFile, musicAssetUrl, type MusicId } from "@/lib/christmas-music";
import type { VideoDuration } from "@/lib/video-duration";

export function useMusicFile(music: MusicId, duration: VideoDuration) {
  const path = musicAssetUrl(music, duration);
  const [result, setResult] = useState<{ path: string | null; blob: Blob | null; url: string | null; status: "checking" | "ready" | "missing" }>({ path: null, blob: null, url: null, status: "ready" });
  useEffect(() => {
    const controller = new AbortController(); let objectUrl: string | null = null;
    if (!path) { setResult({ path: null, blob: null, url: null, status: "ready" }); return; }
    setResult({ path, blob: null, url: null, status: "checking" });
    void loadMusicFile(path, controller.signal).then((blob) => {
      if (controller.signal.aborted) return;
      objectUrl = URL.createObjectURL(blob);
      setResult({ path, blob, url: objectUrl, status: "ready" });
    }).catch(() => { if (!controller.signal.aborted) setResult({ path, blob: null, url: null, status: "missing" }); });
    return () => { controller.abort(); if (objectUrl) URL.revokeObjectURL(objectUrl); };
  }, [path]);
  return result.path === path ? result : { path, blob: null, url: null, status: path ? "checking" as const : "ready" as const };
}