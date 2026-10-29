import { z } from "zod";

export const templateSchema = z.enum(["parol", "snow", "bokeh", "globe", "fire", "simbang", "crafting", "caroling"]);
export type TemplateId = z.infer<typeof templateSchema>;