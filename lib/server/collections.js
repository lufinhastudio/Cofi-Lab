import "server-only";
import { cleanLine, cleanText, isUuid, ValidationError } from "@/lib/content/sanitize";
import { isAllowedImageUrl } from "./cloudinary";
import { mapTestimonial } from "./content";
import { getSql } from "./db";
import { PublicApiError } from "./http";

// ABM de testimonios, registro de imágenes subidas y resumen del dashboard.

const missing = (what) => new PublicApiError("NOT_FOUND", `${what} ya no existe.`, { status: 404 });

function imageOrError(value, label, errors) {
  const text = cleanLine(value, 600);
  if (text && !isAllowedImageUrl(text)) {
    errors.push(`La imagen de «${label}» no es válida. Subila desde el panel.`);
    return "";
  }
  return text;
}

// --- Testimonios -----------------------------------------------------------------

export async function listTestimonialsAdmin() {
  const sql = getSql();
  const rows = await sql`select * from testimonials order by sort_order asc, created_at asc`;
  return rows.map(mapTestimonial);
}

function sanitizeTestimonial(input) {
  const errors = [];
  const data = {
    quote: cleanText(input.quote, 1200),
    authorName: cleanLine(input.authorName, 80),
    company: cleanLine(input.company, 80),
    imageUrl: imageOrError(input.imageUrl, "Foto", errors),
    visible: input.visible !== false
  };
  if (!data.authorName) errors.push("Escribí el nombre de quien da el testimonio.");
  if (!data.quote) errors.push("Escribí el testimonio.");
  if (data.visible && !data.imageUrl) errors.push("Para mostrar el testimonio, agregale una foto.");
  if (errors.length) throw new ValidationError(errors);
  return data;
}

export async function createTestimonial(input) {
  const data = sanitizeTestimonial(input);
  const sql = getSql();
  const [row] = await sql`
    insert into testimonials (quote, author_name, company, image_url, visible, sort_order)
    values (${data.quote}, ${data.authorName}, ${data.company || null}, ${data.imageUrl || null}, ${data.visible},
      (select coalesce(max(sort_order), -1) + 1 from testimonials))
    returning *
  `;
  return mapTestimonial(row);
}

export async function updateTestimonial(id, input) {
  if (!isUuid(id)) throw missing("Este testimonio");
  const sql = getSql();
  let data;
  if (Object.keys(input).length === 1 && "visible" in input) {
    const [current] = await sql`select * from testimonials where id = ${id}`;
    if (!current) throw missing("Este testimonio");
    data = sanitizeTestimonial({ ...mapTestimonial(current), visible: Boolean(input.visible) });
  } else {
    data = sanitizeTestimonial(input);
  }
  const [row] = await sql`
    update testimonials set
      quote = ${data.quote}, author_name = ${data.authorName}, company = ${data.company || null},
      image_url = ${data.imageUrl || null}, visible = ${data.visible}, updated_at = now()
    where id = ${id}
    returning *
  `;
  if (!row) throw missing("Este testimonio");
  return mapTestimonial(row);
}

export async function deleteTestimonial(id) {
  if (!isUuid(id)) throw missing("Este testimonio");
  const sql = getSql();
  const [row] = await sql`delete from testimonials where id = ${id} returning id`;
  if (!row) throw missing("Este testimonio");
}

// --- Imágenes subidas ------------------------------------------------------------------

export async function registerMediaAsset({ url, publicId, scope, width, height, bytes }, userId) {
  if (!isAllowedImageUrl(url)) throw new ValidationError("La imagen subida no es de la cuenta de Cloudinary del sitio.");
  const sql = getSql();
  const int = (value) => (Number.isFinite(Number(value)) ? Math.round(Number(value)) : null);
  await sql`
    insert into media_assets (url, public_id, scope, width, height, bytes, uploaded_by)
    values (${url}, ${cleanLine(publicId, 300) || null}, ${cleanLine(scope, 40) || null}, ${int(width)}, ${int(height)}, ${int(bytes)}, ${userId})
    on conflict (url) do nothing
  `;
}

// --- Resumen del dashboard ----------------------------------------------------------------

export async function getDashboardStats() {
  const sql = getSql();
  const [row] = await sql`
    select
      (select count(*)::int from projects) as projects,
      (select count(*)::int from projects where visible) as projects_published,
      (select count(*)::int from projects where status = 'draft') as projects_draft,
      (select count(*)::int from projects where status = 'hidden') as projects_hidden,
      (select count(*)::int from project_sections) as sections,
      (select coalesce(sum(jsonb_array_length(media)), 0)::int from project_sections) as images,
      (select count(*)::int from testimonials) as testimonials,
      (select count(*)::int from testimonials where visible) as testimonials_visible,
      (select count(*)::int from media_assets) as uploads
  `;
  const recentProjects = await sql`select id, client_name, status, visible, updated_at from projects order by updated_at desc limit 5`;
  return {
    counts: row,
    recentProjects: recentProjects.map((item) => ({
      id: item.id,
      clientName: item.client_name,
      status: item.status || (item.visible ? "published" : "hidden"),
      updatedAt: new Date(item.updated_at).toISOString()
    }))
  };
}
