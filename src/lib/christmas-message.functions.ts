import { createServerFn } from "@tanstack/react-start";
import { getRequest, setResponseHeader, setResponseStatus } from "@tanstack/react-start/server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { messageInputSchema } from "./christmas-message";

export const writeChristmasMessage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => messageInputSchema.parse(input))
  .handler(async ({ data }) => {
    setResponseHeader("Cache-Control", "no-store");
    // Authentication is verified before privileged circuit-breaker access.
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: blocked, error: stateError } = await supabaseAdmin.from("christmas_message_access_state").select("message,status").eq("id", "provider-denied").maybeSingle();
    if (stateError) return { message: "", error: "Dili ma-check ang AI connection karon. Sulayi unya." };
    if (blocked) { setResponseStatus(blocked.status); return { message: "", error: blocked.message }; }
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) return { message: "", error: "The AI message writer is not configured yet." };
    const { createResponsesCall } = await import("./ai/responses.server");
    const { christmasMessagePrompt } = await import("./christmas-message-prompt.server");
    const { APICallError } = await import("ai");
    const content = christmasMessagePrompt(data);
    try {
      const { result } = createResponsesCall(getRequest(), { apiKey, baseURL: "https://ai.gateway.lovable.dev/v1", model: "openai/gpt-6-astra" }, [{ role: "user", content: content.prompt }], content.instructions);
      const message = (await result.text).trim();
      if (!message) return { message: "", error: "The AI returned no message or declined this request. Please write your own greeting." };
      return { message, error: "" };
    } catch (error) {
      let status = 500;
      let safeMessage = "Dili makahimo ug message karon. Sulayi unya; wala mausab ang imong greeting.";
      let providerDenied = false;
      if (APICallError.isInstance(error)) {
        status = error.statusCode ?? 500;
        try {
          const body = JSON.parse(error.responseBody ?? "{}");
          const detail = body.error ?? body;
          if (typeof detail.message === "string") safeMessage = detail.message;
          const type = detail.type ?? body.type;
          providerDenied = status === 403 && (type === "permission_error" || type === "provider_access_denied" || type === "provider_denied" || /provider.*(denied|denial)|access.*denied/i.test(safeMessage));
        } catch { /* Do not expose raw errors or credentials. */ }
      }
      if (providerDenied) {
        const { error: persistError } = await supabaseAdmin.from("christmas_message_access_state").upsert({ id: "provider-denied", status: 403, message: safeMessage, updated_at: new Date().toISOString() });
        if (persistError) console.error("Could not persist AI provider denial");
      }
      setResponseStatus(status);
      return { message: "", error: safeMessage };
    }
  });