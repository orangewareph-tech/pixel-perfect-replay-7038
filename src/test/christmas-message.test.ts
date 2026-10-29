import { describe, expect, it } from "vitest";
import { messageInputSchema } from "@/lib/christmas-message";
import { christmasMessagePrompt } from "@/lib/christmas-message-prompt.server";

describe("personal Christmas messages", () => {
  for (const [template, theme] of [["simbang", "Simbang Gabi"], ["crafting", "Parol Making"], ["caroling", "Pinoy Aguinaldo"]]) it(`supports personalized greetings for ${template}`, () => {
    const input = messageInputSchema.parse({ recipient: "Rosa", greeting: "Malipayong Pasko", template });
    expect(JSON.parse(christmasMessagePrompt(input).prompt).selectedTemplate).toContain(theme);
  });
  it("requires a recipient", () => {
    expect(messageInputSchema.safeParse({ recipient: " ", greeting: "Malipayong Pasko", template: "parol" }).success).toBe(false);
  });
  it("requires a short greeting", () => {
    expect(messageInputSchema.safeParse({ recipient: "Rosa", greeting: " ", template: "parol" }).success).toBe(false);
  });
  it("rejects an unknown template", () => {
    expect(messageInputSchema.safeParse({ recipient: "Rosa", greeting: "Malipayong Pasko", template: "unknown" }).success).toBe(false);
  });
  it("uses the actual recipient, greeting and selected template as data", () => {
    const input = messageInputSchema.parse({ recipient: " Mama Rosa ", greeting: " Gimingaw mi nimo. ", template: "fire" });
    const prompt = JSON.parse(christmasMessagePrompt(input).prompt);
    expect(prompt.recipient).toBe("Mama Rosa");
    expect(prompt.greeting).toBe("Gimingaw mi nimo.");
    expect(prompt.selectedTemplate).toContain("Fireplace Noche Buena Magic");
  });
});