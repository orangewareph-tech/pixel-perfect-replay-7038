import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

export function MusicVideoPlayer({ src, music, musicName, volume, loopMusic, ratio }: { src: string; music: string | null; musicName: string; volume: number; loopMusic: boolean; ratio: "9:16" | "16:9" }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [error, setError] = useState("");
  useEffect(() => { if (audioRef.current) audioRef.current.volume = volume / 100; }, [volume]);
  function sync() {
    const video = videoRef.current; const audio = audioRef.current;
    if (!video || !audio || !Number.isFinite(audio.duration) || audio.duration <= 0) return;
    const target = loopMusic ? video.currentTime % audio.duration : Math.min(video.currentTime, audio.duration);
    if (Math.abs(audio.currentTime - target) > 0.25) audio.currentTime = target;
  }
  async function playTogether() {
    setError(""); sync();
    try { await Promise.all([videoRef.current?.play(), audioRef.current?.play()]); }
    catch { audioRef.current?.pause(); videoRef.current?.pause(); setError("This preview could not play. Try another browser or save the MP4."); }
  }
  return <>
    <video ref={videoRef} src={src} controls autoPlay={!music} loop playsInline onPlay={() => { if (music) { sync(); void audioRef.current?.play().catch(() => setError("Tap Preview Music with Video to enable sound.")); } }} onPause={() => audioRef.current?.pause()} onSeeking={sync} onTimeUpdate={sync} onError={() => { audioRef.current?.pause(); setError("This browser cannot play the preview. Save the MP4 to watch it on your device."); }} onEnded={() => audioRef.current?.pause()} className={`mx-auto mt-4 rounded-3xl bg-night object-cover shadow-glow ${ratio === "9:16" ? "aspect-[9/16] w-full max-w-xs" : "aspect-video w-full"}`} />
    {music && <div className="mx-auto mt-4 max-w-md"><p className="text-sm font-bold text-christmas-green">🎵 {musicName}</p><audio ref={audioRef} src={music} controls loop={loopMusic} onPlay={() => { if (videoRef.current?.paused) void videoRef.current.play().catch(() => { audioRef.current?.pause(); setError("This preview could not play. Try another browser or save the MP4."); }); }} onPause={() => { if (!audioRef.current?.ended) videoRef.current?.pause(); }} className="mt-2 w-full" /><Button variant="outline" onClick={playTogether} className="mt-3 h-auto whitespace-normal"><Play className="size-4" />Preview Music with Video</Button><p className="mt-2 text-xs text-muted-foreground">Music plays alongside this preview. Download with Music embeds it in your MP4.</p></div>}
    {error && <p role="alert" className="mt-2 text-sm text-destructive">{error}</p>}
  </>;
}