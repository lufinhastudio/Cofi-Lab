import "server-only";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
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

  // Tablas y estilos en línea para mantener el diseño en clientes de correo.
  const logo = await readFile(join(process.cwd(), "public/brand/cofi-tinta.png"), "base64").catch(() => null);
  const logoId = "cofi-logo";
  const brand = logo
    ? `<img src="cid:${logoId}" width="72" height="54" alt="CoFi" style="display:block;border:0;font-size:24px;font-weight:900;color:#141414">`
    : '<span style="font-size:28px;font-weight:900;letter-spacing:-1px">CoFi:</span>';
  const mailto = `mailto:${escapeHtml(encodeURIComponent(email.toWellFormed()).replace("%40", "@"))}`;
  const label = "margin:0;font-family:'Space Mono','Courier New',monospace;font-size:12px;line-height:18px;letter-spacing:0.07em;font-weight:normal";
  const wrap = "word-wrap:break-word;word-break:break-word";
  const serviceChips = services.length
    ? services.map((service) =>
        `<span style="display:inline-block;box-sizing:border-box;max-width:100%;margin:0 4px 6px 0;padding:5px 11px;background-color:#FCFF82;border:1px solid #141414;border-radius:999px;font-size:14px;line-height:20px;font-weight:bold;${wrap}">${escapeHtml(service)}</span>`
      ).join("\n")
    : '<span style="font-size:15px;color:#5C5148">Sin servicios seleccionados</span>';

  const html = `<!doctype html>
<html lang="es-AR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    @media screen and (max-width: 480px) {
      .cofi-outer { padding:12px 8px !important; }
      .cofi-panel { padding-left:18px !important; padding-right:18px !important; }
      .cofi-title { font-size:36px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#EFEDE4">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="#EFEDE4" style="width:100%;background-color:#EFEDE4">
    <tr>
      <td class="cofi-outer" align="center" style="padding:28px 16px">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="#F8F7F2" style="width:100%;max-width:600px;table-layout:fixed;border:1px solid #141414;background-color:#F8F7F2;color:#141414;font-family:Poppins,Arial,Helvetica,sans-serif">
          <tr>
            <td class="cofi-panel" bgcolor="#AFC5FF" style="padding:22px 30px 26px;border-bottom:1px solid #141414;background-color:#AFC5FF;color:#141414">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%">
                <tr>
                  <td valign="middle">${brand}</td>
                  <td align="right" valign="middle" aria-hidden="true" style="font-family:Arial,sans-serif;font-size:56px;line-height:54px;color:#FD5959">&#10022;</td>
                </tr>
              </table>
              <p style="${label};margin-top:20px">FORMULARIO DE CONTACTO</p>
              <h1 class="cofi-title" style="margin:5px 0 0;font-family:Poppins,'Arial Black',Arial,Helvetica,sans-serif;font-size:47px;line-height:1.07;letter-spacing:-0.04em;font-weight:900;color:#141414">Nueva consulta</h1>
            </td>
          </tr>
          <tr>
            <td class="cofi-panel" style="padding:25px 30px 28px">
              <p style="${label};color:#5C5148">DE</p>
              <p style="margin:4px 0 2px;font-size:21px;line-height:1.3;font-weight:bold;${wrap}">${escapeHtml(name)}</p>
              <p style="margin:0;font-size:16px;line-height:1.5;${wrap}"><a href="${mailto}" style="color:#141414;text-decoration:underline">${escapeHtml(email)}</a></p>

              <div style="margin-top:20px;padding-top:15px;border-top:1px solid #DCD9CE">
                <h2 style="${label};margin-bottom:8px;color:#5C5148">LE INTERESA</h2>
                ${serviceChips}
              </div>

              <h2 style="${label};margin:18px 0 8px;color:#5C5148">MENSAJE</h2>
              <div style="padding:14px 16px;border:1px solid #141414;font-size:16px;line-height:1.55;white-space:pre-wrap;${wrap}">${escapeHtml(message || "(Sin mensaje escrito)")}</div>

              <p style="margin:21px 0 0"><a href="${mailto}" style="display:inline-block;padding:11px 19px;border-radius:999px;background-color:#FD5959;color:#141414;font-size:15px;line-height:22px;font-weight:bold;text-decoration:none">Escribirle&nbsp; <span aria-hidden="true">&rarr;</span></a></p>
            </td>
          </tr>
          <tr>
            <td class="cofi-panel" bgcolor="#5C5148" style="padding:13px 30px;background-color:#5C5148;color:#F8F7F2;font-family:'Space Mono','Courier New',monospace;font-size:12px;line-height:18px">
              Recibida el ${escapeHtml(date)}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

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
        html,
        attachments: logo ? [{ filename: "cofi-tinta.png", content: logo, content_id: logoId }] : undefined
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
