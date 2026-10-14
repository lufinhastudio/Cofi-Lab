import { getSql } from "@/lib/server/db";
import { errorResponse, getClientIp, json, PublicApiError, readJsonBody, validateMutationOrigin } from "@/lib/server/http";
import { assertAllowed, buildThrottleKey, recordHit } from "@/lib/server/loginThrottle";
import { contactPage } from "@/config/content";

const allowedServices = new Set(contactPage.services);

// Guarda los mensajes del formulario en la base (se verán en el admin).
export async function POST(request) {
  try {
    validateMutationOrigin(request);
    const body = await readJsonBody(request, { maxBytes: 16 * 1024 });

    // Bot: completó el campo oculto. Respondemos OK sin guardar.
    if (body.website) return json({ ok: true });

    const name = String(body.name ?? "").trim().slice(0, 120);
    const email = String(body.email ?? "").trim().toLowerCase().slice(0, 254);
    const message = String(body.message ?? "").trim().slice(0, 3000);
    const services = Array.isArray(body.services) ? body.services.filter((item) => allowedServices.has(item)).slice(0, 10) : [];

    if (!name) throw new PublicApiError("INVALID_INPUT", "Completá tu nombre.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new PublicApiError("INVALID_INPUT", "Revisá el correo electrónico.");

    // Máximo 5 mensajes cada 15 minutos por IP.
    const keys = [buildThrottleKey(`contact:ip:${getClientIp(request)}`, 5)];
    await assertAllowed(keys, "Recibimos varios mensajes seguidos. Probá de nuevo en unos minutos.");
    await recordHit(keys);

    const sql = getSql();
    await sql`
      insert into contact_messages (name, email, services, message)
      values (${name}, ${email}, ${services}, ${message || null})
    `;
    return json({ ok: true });
  } catch (error) {
    return errorResponse(error, { scope: "contact", fallback: "No pudimos enviar el mensaje. Probá de nuevo." });
  }
}
