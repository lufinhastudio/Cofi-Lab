import "server-only";
import { COFITECA_CATEGORIES } from "@/lib/content/options";
import { cleanLine, cleanText, isUuid, isValidSlug, parseHttpUrl, slugify, ValidationError } from "@/lib/content/sanitize";
import { isAllowedImageUrl } from "./cloudinary";
import { mapTestimonial } from "./content";
import { getSql } from "./db";
import { PublicApiError } from "./http";

// ABM de testimonios, productos de La Cofiteca y mensajes de contacto.

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

// --- La Cofiteca -------------------------------------------------------------------

function mapProduct(row) {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category || "libro",
    shortDescription: row.short_description || "",
    description: row.description || "",
    images: Array.isArray(row.images) ? row.images.filter((item) => item?.url) : [],
    whatsappMessage: row.whatsapp_message || "",
    linkUrl: row.link_url || "",
    visible: Boolean(row.visible),
    sortOrder: row.sort_order
  };
}

export async function listProductsAdmin() {
  const sql = getSql();
  const rows = await sql`select * from cofiteca_products order by sort_order asc, created_at asc`;
  return rows.map(mapProduct);
}

function sanitizeProduct(input) {
  const errors = [];
  const name = cleanLine(input.name, 120);
  if (!name) errors.push("Escribí el nombre del producto.");
  const slug = slugify(input.slug || name);
  if (name && !isValidSlug(slug)) errors.push("La dirección (slug) solo puede tener letras minúsculas, números y guiones.");
  const category = Object.hasOwn(COFITECA_CATEGORIES, input.category) ? input.category : "libro";
  const images = (Array.isArray(input.images) ? input.images : [])
    .map((item) => ({ url: cleanLine(item?.url, 600), alt: cleanLine(item?.alt, 140) }))
    .filter((item) => item.url);
  if (images.length > 12) errors.push("Un producto admite hasta 12 imágenes.");
  if (images.some((item) => !isAllowedImageUrl(item.url))) errors.push("Hay una imagen que no es válida. Subila desde el panel.");
  const linkUrl = parseHttpUrl(input.linkUrl);
  if (linkUrl === null) errors.push("El link no es válido. Tiene que empezar con https://");
  if (errors.length) throw new ValidationError(errors);
  return {
    name,
    slug,
    category,
    shortDescription: cleanText(input.shortDescription, 300),
    description: cleanText(input.description, 4000),
    images: images.slice(0, 12).map((item) => ({ url: item.url, type: "image", ...(item.alt ? { alt: item.alt } : {}) })),
    whatsappMessage: cleanText(input.whatsappMessage, 500),
    linkUrl: linkUrl || "",
    visible: input.visible !== false
  };
}

export async function createProduct(input) {
  const data = sanitizeProduct(input);
  const sql = getSql();
  const [row] = await sql`
    insert into cofiteca_products (slug, name, category, short_description, description, images, whatsapp_message, link_url, visible, sort_order)
    values (${data.slug}, ${data.name}, ${data.category}, ${data.shortDescription || null}, ${data.description || null},
      ${JSON.stringify(data.images)}::jsonb, ${data.whatsappMessage || null}, ${data.linkUrl || null}, ${data.visible},
      (select coalesce(max(sort_order), -1) + 1 from cofiteca_products))
    returning *
  `;
  return mapProduct(row);
}

export async function updateProduct(id, input) {
  if (!isUuid(id)) throw missing("Este producto");
  const sql = getSql();
  let data;
  if (Object.keys(input).length === 1 && "visible" in input) {
    const [current] = await sql`select * from cofiteca_products where id = ${id}`;
    if (!current) throw missing("Este producto");
    data = sanitizeProduct({ ...mapProduct(current), visible: Boolean(input.visible) });
  } else {
    data = sanitizeProduct(input);
  }
  const [row] = await sql`
    update cofiteca_products set
      slug = ${data.slug}, name = ${data.name}, category = ${data.category},
      short_description = ${data.shortDescription || null}, description = ${data.description || null},
      images = ${JSON.stringify(data.images)}::jsonb, whatsapp_message = ${data.whatsappMessage || null},
      link_url = ${data.linkUrl || null}, visible = ${data.visible}, updated_at = now()
    where id = ${id}
    returning *
  `;
  if (!row) throw missing("Este producto");
  return mapProduct(row);
}

export async function deleteProduct(id) {
  if (!isUuid(id)) throw missing("Este producto");
  const sql = getSql();
  const [row] = await sql`delete from cofiteca_products where id = ${id} returning id`;
  if (!row) throw missing("Este producto");
}

// --- Mensajes de contacto -----------------------------------------------------------

function mapMessage(row) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    services: Array.isArray(row.services) ? row.services : [],
    message: row.message || "",
    read: Boolean(row.read_at),
    readAt: row.read_at ? new Date(row.read_at).toISOString() : null,
    createdAt: new Date(row.created_at).toISOString()
  };
}

export async function listMessages({ limit = 500 } = {}) {
  const sql = getSql();
  const rows = await sql`select * from contact_messages order by created_at desc limit ${limit}`;
  return rows.map(mapMessage);
}

export async function setMessageRead(id, read) {
  if (!isUuid(id)) throw missing("Este mensaje");
  const sql = getSql();
  const [row] = await sql`
    update contact_messages set read_at = ${read ? new Date().toISOString() : null}
    where id = ${id}
    returning *
  `;
  if (!row) throw missing("Este mensaje");
  return mapMessage(row);
}

export async function deleteMessage(id) {
  if (!isUuid(id)) throw missing("Este mensaje");
  const sql = getSql();
  const [row] = await sql`delete from contact_messages where id = ${id} returning id`;
  if (!row) throw missing("Este mensaje");
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
      (select count(*)::int from cofiteca_products) as products,
      (select count(*)::int from contact_messages) as messages,
      (select count(*)::int from contact_messages where read_at is null) as unread_messages,
      (select count(*)::int from media_assets) as uploads
  `;
  const recentProjects = await sql`select id, client_name, status, visible, updated_at from projects order by updated_at desc limit 5`;
  const recentMessages = await sql`select * from contact_messages order by created_at desc limit 5`;
  return {
    counts: row,
    recentProjects: recentProjects.map((item) => ({
      id: item.id,
      clientName: item.client_name,
      status: item.status || (item.visible ? "published" : "hidden"),
      updatedAt: new Date(item.updated_at).toISOString()
    })),
    recentMessages: recentMessages.map(mapMessage)
  };
}
