import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireGoogleAuth } from "@/lib/google-auth.functions";
import { isAdminEmail } from "@/lib/owner-tests";
import { buildVideoInput, FAL_LISTED_COST, VIDEO_MODEL, videoDurationSchema } from "@/lib/video-duration";
import { movementSchema, DEFAULT_MOVEMENT } from "@/lib/video-movement";
import { templateSchema } from "@/lib/template-ids";
import { TEMPLATES } from "@/lib/site";

// Admin access is decided on the server from the verified Google email only;
// the browser never decides who may spend Fal.ai credits.
function adminEmail(user: { email?: string | null } | null | undefined) {
  const email = user?.email ?? "";
  if (!isAdminEmail(email)) throw new Error("Access denied — Admin only");
  return email.toLowerCase();
}
function falKey() {
  return process.env["FAL_KEY"] ?? process.env["FAL_API_KEY"] ?? "";
}

export const adminDashboardStatus = createServerFn({ method: "GET" })
  .middleware([requireGoogleAuth])
  .handler(async ({ context }) => {
    const email = context.googleUser?.email ?? "";
    const admin = isAdminEmail(email);
    return { admin, email, falKey: admin ? Boolean(falKey()) : false, model: VIDEO_MODEL };
  });

export const adminStartTest = createServerFn({ method: "POST" })
  .middleware([requireGoogleAuth])
  .inputValidator((d) =>
    z.object({
      template: templateSchema,
      movement: movementSchema.default(DEFAULT_MOVEMENT),
      duration: videoDurationSchema,
      imageUrl: z.string().regex(/^data:image\/(jpeg|png|webp);base64,/).max(15_000_000),
    }).parse(d),
  )
  .handler(async ({ data, context }) => {
    adminEmail(context.googleUser);
    const key = falKey();
    if (!key) throw new Error("FAL_KEY is missing from the project secrets.");
    const template = TEMPLATES.find((t) => t.id === data.template)!;
    const res = await fetch(`https://queue.fal.run/${VIDEO_MODEL}`, {
      method: "POST",
      headers: { Authorization: `Key ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify(buildVideoInput(data.imageUrl, template.scene, data.duration, data.movement)),
      signal: AbortSignal.timeout(30000),
    });
    if (!res.ok) throw new Error(`Fal.ai submission failed [${res.status}]`);
    const j = z.object({ request_id: z.string().min(5).max(100) }).parse(await res.json());
    return { requestId: j.request_id, cost: FAL_LISTED_COST[data.duration] };
  });

export const adminCheckTest = createServerFn({ method: "POST" })
  .middleware([requireGoogleAuth])
  .inputValidator((d) => z.object({ requestId: z.string().min(5).max(100) }).parse(d))
  .handler(async ({ data, context }) => {
    adminEmail(context.googleUser);
    const base = `https://queue.fal.run/fal-ai/kling-video/requests/${encodeURIComponent(data.requestId)}`;
    const headers = { Authorization: `Key ${falKey()}` };
    const s = await fetch(`${base}/status`, { headers });
    if (!s.ok) throw new Error(`Status error [${s.status}]`);
    const st = (await s.json()) as { status: string };
    if (st.status !== "COMPLETED") return { status: st.status, videoUrl: null as string | null };
    const r = await fetch(base, { headers });
    if (!r.ok) return { status: "FAILED", videoUrl: null };
    const out = (await r.json()) as { video?: { url?: string } };
    const url = out.video?.url ?? null;
    return { status: url ? "COMPLETED" : "FAILED", videoUrl: url && /^https:\/\/([a-zA-Z0-9-]+\.)*fal\.media\//.test(url) ? url : null };
  });
