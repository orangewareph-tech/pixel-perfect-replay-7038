import { z } from "zod";

export const templateSchema = z.enum(["parol", "snow", "bokeh", "globe", "fire"]);
export type TemplateId = z.infer<typeof templateSchema>;