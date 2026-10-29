import { useEffect, useState } from "react";
import { videoDurationSchema, type VideoDuration } from "@/lib/video-duration";

export function useVideoDuration(initialDuration?: VideoDuration) {
  const [duration, setDuration] = useState<VideoDuration>(initialDuration ?? 5);
  useEffect(() => {
    let restored = initialDuration;
    try {
      if (!restored) {
        const parsed = videoDurationSchema.safeParse(Number(localStorage.getItem("magicph_duration")));
        if (parsed.success) restored = parsed.data;
      }
      if (restored) {
        setDuration(restored);
        localStorage.setItem("magicph_duration", String(restored));
      }
    } catch { /* Storage may be disabled. Selection still works. */ }
  }, [initialDuration]);
  function selectDuration(value: VideoDuration) {
    setDuration(value);
    try { localStorage.setItem("magicph_duration", String(value)); } catch { /* Optional persistence. */ }
  }
  return [duration, selectDuration] as const;
}