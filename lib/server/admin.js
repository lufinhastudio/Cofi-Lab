import "server-only";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ValidationError } from "@/lib/content/sanitize";
import { getAdminSession } from "./auth";
import { isDatabaseConfigured } from "./db";
import { errorResponse, json, PublicApiError, readJsonBody, validateMutationOrigin } from "./http";

// Envoltorio de TODAS las rutas /api/admin/* que leen o modifican contenido:
//   1. bloquea pedidos de otros dominios (CSRF) en POST/PUT/PATCH/DELETE,
//   2. exige una sesión de admin válida (verificada contra la base),
//   3. traduce errores de validación a mensajes claros y oculta los internos.
export function adminRoute(handler, { scope = "admin-api" } = {}) {
  return async function route(request, context) {
    try {
      validateMutationOrigin(request);
      if (!isDatabaseConfigured()) {
        throw new PublicApiError("DATABASE_NOT_CONFIGURED", "La base de datos no está configurada.", { status: 503 });
      }
      const session = await getAdminSession();
      if (!session) throw new PublicApiError("UNAUTHORIZED", "Tu sesión expiró. Volvé a iniciar sesión.", { status: 401 });
      const params = context?.params ? await context.params : {};
      const result = await handler({ request, params, session });
      return result instanceof Response ? result : json(result ?? { ok: true });
    } catch (error) {
      if (error instanceof ValidationError) {
        return json({ error: "VALIDATION_ERROR", message: error.message, messages: error.messages }, { status: 422 });
      }
      if (error?.code === "23505") {
        return json({ error: "DUPLICATE", message: "Ya existe un registro con ese identificador (slug). Probá con otro." }, { status: 409 });
      }
      return errorResponse(error, { scope });
    }
  };
}

// Para páginas del panel: el layout ya verifica la sesión, pero en navegaciones
// del lado del cliente Next puede renderizar solo la página (sin el layout), así
// que cada página que lee datos privados lo verifica de nuevo. getAdminSession
// está cacheada por request: no agrega consultas.
export async function requireAdminPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return session;
}

export async function readBody(request, maxBytes = 512 * 1024) {
  return readJsonBody(request, { maxBytes });
}

export function notFound(message = "No encontramos ese contenido. Puede que se haya eliminado.") {
  return new PublicApiError("NOT_FOUND", message, { status: 404 });
}

// Después de cualquier cambio, el sitio público se regenera en la próxima visita
// (sin deploy). Se invalida todo el árbol: menú, pie, inicio, clientes, etc.
export function revalidatePublicSite() {
  revalidatePath("/", "layout");
}
