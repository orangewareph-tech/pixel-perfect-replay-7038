import { z } from "zod";

export const messageInputSchema = z.object({
  recipient: z.string().trim().min(1, "Ibutang ang ngalan sa recipient.").max(80),
  greeting: z.string().trim().min(1, "Ibutang ang imong mubo nga greeting.").max(300),
  template: z.enum(["parol", "snow", "bokeh", "globe", "fire"]),
});
export type MessageInput = z.infer<typeof messageInputSchema>;
export type MessageDraft = { recipient: string; greeting: string; message: string };
export const EMPTY_MESSAGE: MessageDraft = { recipient: "", greeting: "", message: "" };