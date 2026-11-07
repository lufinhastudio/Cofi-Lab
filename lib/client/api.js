// Llamadas del panel a /api/admin/*. Devuelve el JSON o lanza un Error con un
// mensaje en castellano listo para mostrar (y la lista completa en error.messages).

export class ApiError extends Error {
  constructor(message, { status, code, messages } = {}) {
    super(message);
    this.status = status;
    this.code = code;
    this.messages = messages || [message];
  }
}

export async function api(url, { method = "GET", body } = {}) {
  let response;
  try {
    response = await fetch(url, {
      method,
      headers: body === undefined ? undefined : { "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
      cache: "no-store"
    });
  } catch {
    throw new ApiError("No hay conexión. Revisá internet y probá de nuevo.");
  }
  const payload = await response.json().catch(() => ({}));
  if (response.status === 401) {
    // Sesión vencida: volvemos al login conservando a dónde quería ir.
    if (typeof window !== "undefined") window.location.href = `/admin/login?next=${encodeURIComponent(window.location.pathname)}`;
    throw new ApiError("Tu sesión expiró. Volvé a iniciar sesión.", { status: 401 });
  }
  if (!response.ok) {
    throw new ApiError(payload.message || "No pudimos guardar los cambios. Probá de nuevo.", {
      status: response.status,
      code: payload.error,
      messages: payload.messages
    });
  }
  return payload;
}
