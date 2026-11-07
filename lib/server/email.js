import "server-only";
import { getSiteSettings } from "./siteContent";

// Envío de las consultas del formulario de contacto por email con Resend
// (https://resend.com). Se usa la API REST directamente: no hace falta SDK.
//
// Variables (solo servidor):
//   RESEND_API_KEY      clave de Resend (re_…). Sin ella no se envía nada.
//   CONTACT_EMAIL_TO    a quién llegan las consultas (uno o varios, separados por coma).
//                       Si falta, se usa el email público de Configuración.
//   CONTACT_EMAIL_FROM  remitente, ej: "CoFi Web <web@cofilab.com>". Tiene que ser de un
//                       dominio verificado en Resend. Si falta se usa onboarding@resend.dev,
//                       que solo sirve para pruebas (envía únicamente al dueño de la cuenta).

const RESEND_ENDPOINT = "https://api.resend.com/emails";
const DEFAULT_FROM = "CoFi Web <onboarding@resend.dev>";

async function recipients() {
  const fromEnv = String(process.env.CONTACT_EMAIL_TO || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  if (fromEnv.length) return fromEnv;
  const settings = await getSiteSettings().catch(() => null);
  return settings?.email ? [settings.email] : [];
}

export async function getContactEmailStatus() {
  const to = await recipients();
  return { configured: Boolean(process.env.RESEND_API_KEY && to.length), to: to.join(", ") };
}

const escapeHtml = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

// Devuelve { sent: true } o { sent: false, reason }. Nunca lanza: el formulario no
// debe fallar para la persona que escribe si el email tiene un problema.
export async function sendContactEmail({ name, email, services, message }) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = await recipients();
  if (!apiKey || !to.length) return { sent: false, reason: "not-configured" };

  const date = new Date().toLocaleString("es-AR", { timeZone: "America/Argentina/Buenos_Aires", dateStyle: "long", timeStyle: "short" });
  const servicesText = services.length ? services.join(", ") : "—";
  const text = [
    `Nueva consulta desde la web de CoFi`,
    ``,
    `Nombre: ${name}`,
    `Email: ${email}`,
    `Le interesa: ${servicesText}`,
    ``,
    message || "(Sin mensaje escrito)",
    ``,
    `Recibido el ${date}. Respondé este email para contestarle directamente.`
  ].join("\n");

  const html = `<!doctype html><html><body style="margin:0;background:#F8F7F2;font-family:Arial,Helvetica,sans-serif;color:#141414">
  <div style="max-width:560px;margin:0 auto;padding:32px 24px">
    <p style="margin:0 0 8px;font-family:'Courier New',monospace;font-size:13px;color:#c23434">Formulario de contacto</p>
    <h1 style="margin:0 0 24px;font-size:26px;line-height:1.15">Nueva consulta de ${escapeHtml(name)}</h1>
    <table role="presentation" style="width:100%;border-collapse:collapse;font-size:15px;margin-bottom:20px">
      <tr><td style="padding:8px 0;color:#5F5E59;width:110px">Nombre</td><td style="padding:8px 0;font-weight:bold">${escapeHtml(name)}</td></tr>
      <tr><td style="padding:8px 0;color:#5F5E59">Email</td><td style="padding:8px 0"><a href="mailto:${escapeHtml(email)}" style="color:#141414">${escapeHtml(email)}</a></td></tr>
      <tr><td style="padding:8px 0;color:#5F5E59">Le interesa</td><td style="padding:8px 0">${escapeHtml(servicesText)}</td></tr>
    </table>
    <div style="background:#ffffff;border:1px solid #DCD9CE;border-radius:12px;padding:16px;font-size:15px;line-height:1.6;white-space:pre-wrap">${escapeHtml(message || "(Sin mensaje escrito)")}</div>
    <p style="margin:20px 0 0;font-size:13px;color:#5F5E59">Recibido el ${escapeHtml(date)}. Respondé este email para contestarle directamente.</p>
  </div></body></html>`;

  try {
    const response = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.CONTACT_EMAIL_FROM || DEFAULT_FROM,
        to,
        reply_to: email,
        subject: `Nueva consulta de ${name.slice(0, 80)} · Web CoFi`,
        text,
        html
      }),
      signal: AbortSignal.timeout(10000)
    });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      return { sent: false, reason: `resend-${response.status}: ${String(data.message || data.name || "").slice(0, 200)}` };
    }
    return { sent: true };
  } catch (error) {
    return { sent: false, reason: `resend-error: ${String(error?.message || error).slice(0, 200)}` };
  }
}
