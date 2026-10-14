import "server-only";
import crypto from "node:crypto";

// Carpetas permitidas en Cloudinary. El cliente pide una "scope" y el servidor firma
// solo para estas carpetas: nunca se acepta una carpeta arbitraria desde el navegador.
export const UPLOAD_FOLDERS = {
  projects: "cofilab/trabajos",
  cofiteca: "cofilab/cofiteca",
  testimonials: "cofilab/testimonios"
};

export function createUploadSignature(scope) {
  const folder = UPLOAD_FOLDERS[scope];
  if (!folder) {
    const error = new Error("Destino de subida no permitido.");
    error.status = 400;
    throw error;
  }

  const config = getCloudinaryConfig();
  const timestamp = Math.floor(Date.now() / 1000);
  const payload = `folder=${folder}&timestamp=${timestamp}`;

  return {
    cloudName: config.cloudName,
    apiKey: config.apiKey,
    folder,
    timestamp,
    signature: crypto.createHash("sha1").update(`${payload}${config.apiSecret}`).digest("hex")
  };
}

function getCloudinaryConfig() {
  const fromUrl = parseCloudinaryUrl(process.env.CLOUDINARY_URL);
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || fromUrl.cloudName;
  const apiKey = process.env.CLOUDINARY_API_KEY || fromUrl.apiKey;
  const apiSecret = process.env.CLOUDINARY_API_SECRET || fromUrl.apiSecret;

  if (!cloudName || !apiKey || !apiSecret) {
    const error = new Error("Cloudinary no está configurado en el servidor.");
    error.status = 503;
    throw error;
  }
  return { cloudName, apiKey, apiSecret };
}

function parseCloudinaryUrl(value) {
  const empty = { cloudName: "", apiKey: "", apiSecret: "" };
  if (!value) return empty;
  try {
    const parsed = new URL(value);
    if (parsed.protocol !== "cloudinary:") return empty;
    return {
      cloudName: parsed.hostname,
      apiKey: decodeURIComponent(parsed.username),
      apiSecret: decodeURIComponent(parsed.password)
    };
  } catch {
    return empty;
  }
}
