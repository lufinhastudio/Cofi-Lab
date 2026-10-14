// Subida de imágenes desde el admin: se redimensionan y convierten a WebP en el
// navegador y se suben a Cloudinary con una firma que da el servidor.
// scope: "projects" | "cofiteca" | "testimonials"

const ALLOWED_TYPES = new Set(["image/jpeg", "image/jpg", "image/png", "image/webp"]);
const MAX_SOURCE_BYTES = 15 * 1024 * 1024;
const MAX_OUTPUT_BYTES = 1600 * 1024;
const MAX_DIMENSION = 2000;
const QUALITIES = [0.85, 0.76, 0.68];

export async function uploadImages(files, scope) {
  const list = Array.from(files ?? []);
  list.forEach(validateImageFile);
  const authorization = await requestSignature(scope);
  const results = [];
  for (const file of list) {
    const optimized = await optimizeImage(file);
    results.push(await uploadToCloudinary(optimized, authorization));
  }
  return results;
}

export function validateImageFile(file) {
  if (!file || !ALLOWED_TYPES.has(String(file.type).toLowerCase())) {
    throw new Error("Formato no permitido. Usá JPG, PNG o WebP.");
  }
  if (file.size > MAX_SOURCE_BYTES) {
    throw new Error("La imagen supera los 15 MB.");
  }
}

async function requestSignature(scope) {
  const response = await fetch("/api/admin/cloudinary-signature", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ scope })
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || !payload.upload) {
    throw new Error(payload.message || "No se pudo autorizar la subida de imágenes.");
  }
  return payload.upload;
}

async function uploadToCloudinary(file, upload) {
  const form = new FormData();
  form.append("file", file);
  form.append("api_key", upload.apiKey);
  form.append("timestamp", String(upload.timestamp));
  form.append("signature", upload.signature);
  form.append("folder", upload.folder);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${encodeURIComponent(upload.cloudName)}/image/upload`, {
    method: "POST",
    body: form
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.secure_url) {
    throw new Error(data.error?.message || "Error al subir la imagen.");
  }
  return { url: data.secure_url, width: data.width, height: data.height };
}

async function optimizeImage(file) {
  const bitmap = await createImageBitmap(file);
  try {
    const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    const context = canvas.getContext("2d");
    context.imageSmoothingQuality = "high";
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

    let blob = null;
    for (const quality of QUALITIES) {
      blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/webp", quality));
      if (blob && blob.size <= MAX_OUTPUT_BYTES) break;
    }
    if (!blob || blob.type !== "image/webp") throw new Error("No se pudo optimizar la imagen.");
    const baseName = String(file.name || "imagen").replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9_-]+/g, "-") || "imagen";
    return new File([blob], `${baseName}.webp`, { type: "image/webp" });
  } finally {
    bitmap.close();
  }
}
