// Limpieza y validación de datos. Se usa en el servidor (fuente de verdad) y
// en el panel para mostrar errores antes de guardar.

export class ValidationError extends Error {
  constructor(messages) {
    const list = Array.isArray(messages) ? messages : [messages];
    super(list[0] || "Datos inválidos.");
    this.name = "ValidationError";
    this.messages = list;
  }
}

// eslint-disable-next-line no-control-regex
const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

export function cleanText(value, max = 500) {
  if (value === null || value === undefined) return "";
  return String(value).replace(/\r\n?/g, "\n").replace(CONTROL_CHARS, "").trim().slice(0, max);
}

export function cleanLine(value, max = 200) {
  return cleanText(value, max).replace(/\s*\n\s*/g, " ");
}

// Solo http(s). Bloquea javascript:, data:, etc. Devuelve "" si está vacío.
export function parseHttpUrl(value, { max = 600 } = {}) {
  const text = cleanLine(value, max + 1);
  if (!text) return "";
  if (text.length > max) return null;
  let url;
  try {
    url = new URL(/^[a-z][a-z0-9+.-]*:/i.test(text) ? text : `https://${text}`);
  } catch {
    return null;
  }
  if (!["http:", "https:"].includes(url.protocol) || !url.hostname.includes(".")) return null;
  return url.toString();
}

export function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(value || ""));
}

export function slugify(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export function isValidSlug(value) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(String(value || "")) && String(value).length <= 60;
}

export function isUuid(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(value || ""));
}

// Valida un objeto contra un esquema de campos (lib/content/schemas.js).
// ctx.isImageUrl(url) decide qué URLs de imagen se aceptan (en el servidor:
// solo Cloudinary propio y las fotos heredadas del sitio anterior).
export function sanitizeFields(fields, input, ctx = {}, path = "") {
  const errors = [];
  const data = {};
  const source = input && typeof input === "object" && !Array.isArray(input) ? input : {};

  for (const field of fields) {
    if (field.type === "note") continue;
    const label = path ? `${path} › ${field.label}` : field.label;
    const raw = source[field.name];
    const value = sanitizeField(field, raw, ctx, label, errors);
    if (field.required && (value === "" || value === null || (Array.isArray(value) && !value.length))) {
      errors.push(`Completá «${label}».`);
    }
    data[field.name] = value;
  }
  return { data, errors };
}

function sanitizeField(field, raw, ctx, label, errors) {
  switch (field.type) {
    case "text":
      return cleanLine(raw, field.max || 200);
    case "textarea":
      return cleanText(raw, field.max || 2000);
    case "toggle":
      return Boolean(raw);
    case "select": {
      const value = String(raw ?? "");
      if (!value) return Object.keys(field.options)[0];
      if (!Object.hasOwn(field.options, value)) {
        errors.push(`Elegí una opción válida en «${label}».`);
        return Object.keys(field.options)[0];
      }
      return value;
    }
    case "url": {
      const value = parseHttpUrl(raw);
      if (value === null) {
        errors.push(`El link de «${label}» no es válido. Tiene que empezar con https://`);
        return "";
      }
      return value;
    }
    case "email": {
      const value = cleanLine(raw, 254).toLowerCase();
      if (value && !isEmail(value)) errors.push(`Revisá el email de «${label}».`);
      return value;
    }
    case "phone": {
      const value = cleanLine(raw, 30).replace(/[\s+()-]/g, "");
      if (value && !/^\d{8,15}$/.test(value)) errors.push(`«${label}» tiene que tener solo números (8 a 15), sin + ni espacios.`);
      return value;
    }
    case "image": {
      const value = cleanLine(raw, 600);
      if (!value) return "";
      if (ctx.isImageUrl && !ctx.isImageUrl(value)) {
        errors.push(`La imagen de «${label}» no es válida. Subila desde el panel.`);
        return "";
      }
      return value;
    }
    case "tags": {
      const list = Array.isArray(raw) ? raw : [];
      const seen = new Set();
      const result = [];
      for (const item of list) {
        const value = cleanLine(item, field.max || 80);
        if (!value || seen.has(value.toLowerCase())) continue;
        seen.add(value.toLowerCase());
        result.push(value);
      }
      if (field.maxItems && result.length > field.maxItems) errors.push(`«${label}» admite hasta ${field.maxItems} elementos.`);
      return result.slice(0, field.maxItems || 50);
    }
    case "list": {
      const list = Array.isArray(raw) ? raw : [];
      if (field.maxItems && list.length > field.maxItems) errors.push(`«${label}» admite hasta ${field.maxItems} elementos.`);
      return list.slice(0, field.maxItems || 50).map((item, index) => {
        const result = sanitizeFields(field.fields, item, ctx, `${label} ${index + 1}`);
        errors.push(...result.errors);
        return result.data;
      });
    }
    default:
      return cleanText(raw, field.max || 500);
  }
}
