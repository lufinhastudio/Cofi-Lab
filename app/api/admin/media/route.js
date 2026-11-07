import { adminRoute, readBody } from "@/lib/server/admin";
import { registerMediaAsset } from "@/lib/server/collections";

// Registra cada imagen subida a Cloudinary (para una futura limpieza segura).
export const POST = adminRoute(
  async ({ request, session }) => {
    await registerMediaAsset(await readBody(request, 4 * 1024), session.user.userId);
    return { ok: true };
  },
  { scope: "admin-media" }
);
