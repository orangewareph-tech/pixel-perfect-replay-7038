import { useEffect, useState } from "react";
import { TEMPLATES } from "@/lib/site";
import { musicSchema, type MusicId } from "@/lib/christmas-music";

export function useChristmasChoices(initialTemplate?: string, initialMusic?: MusicId) {
  const validTemplate = (value: string | null | undefined) => TEMPLATES.find((t) => t.id === value)?.id;
  const [template, setTemplate] = useState<string>(validTemplate(initialTemplate) ?? "parol");
  const [music, setMusic] = useState<MusicId>(initialMusic ?? "no-music");
  useEffect(() => {
    try {
      setTemplate(validTemplate(initialTemplate) ?? validTemplate(localStorage.getItem("magicph_template")) ?? "parol");
      const parsed = musicSchema.safeParse(initialMusic ?? localStorage.getItem("magicph_music"));
      setMusic(parsed.success ? parsed.data : "no-music");
    } catch { /* Preferences are optional. */ }
  }, [initialTemplate, initialMusic]);
  function chooseTemplate(value: string) { if (!validTemplate(value)) return; setTemplate(value); try { localStorage.setItem("magicph_template", value); } catch { /* Optional. */ } }
  function chooseMusic(value: MusicId) { setMusic(value); try { localStorage.setItem("magicph_music", value); } catch { /* Optional. */ } }
  return { template, chooseTemplate, music, chooseMusic };
}