import "server-only";
import { getSql, isDatabaseConfigured } from "./db";
import { placeholderContent } from "@/data/placeholder";

// Lecturas de contenido administrable (trabajos, Cofiteca, testimonios).
// Las escrituras del admin se suman en el próximo paso.

export async function listProjects({ includeHidden = false } = {}) {
  const sql = getSql();
  const projects = includeHidden
    ? await sql`select * from projects order by sort_order asc, created_at desc`
    : await sql`select * from projects where visible = true order by sort_order asc, created_at desc`;
  if (!projects.length) return [];

  const ids = projects.map((project) => project.id);
  const sections = includeHidden
    ? await sql`select * from project_sections where project_id = any(${ids}) order by sort_order asc, created_at asc`
    : await sql`select * from project_sections where project_id = any(${ids}) and visible = true order by sort_order asc, created_at asc`;

  const byProject = new Map();
  for (const section of sections) {
    if (!byProject.has(section.project_id)) byProject.set(section.project_id, []);
    byProject.get(section.project_id).push(mapSection(section));
  }
  return projects.map((project) => mapProject(project, byProject.get(project.id) || []));
}

export async function listCofitecaProducts({ includeHidden = false } = {}) {
  const sql = getSql();
  const rows = includeHidden
    ? await sql`select * from cofiteca_products order by sort_order asc, created_at desc`
    : await sql`select * from cofiteca_products where visible = true order by sort_order asc, created_at desc`;
  return rows.map(mapProduct);
}

export async function listTestimonials({ includeHidden = false } = {}) {
  const sql = getSql();
  const rows = includeHidden
    ? await sql`select * from testimonials order by sort_order asc, created_at desc`
    : await sql`select * from testimonials where visible = true order by sort_order asc, created_at desc`;
  return rows.map(mapTestimonial);
}

export async function getContentCounts() {
  const sql = getSql();
  const [row] = await sql`
    select
      (select count(*)::int from projects) as projects,
      (select count(*)::int from projects where visible) as projects_visible,
      (select count(*)::int from cofiteca_products) as products,
      (select count(*)::int from cofiteca_products where visible) as products_visible,
      (select count(*)::int from testimonials) as testimonials,
      (select count(*)::int from testimonials where visible) as testimonials_visible
  `;
  return row;
}

// Contenido para la landing pública. Si la base todavía no está configurada
// (o falla), se muestra el contenido de ejemplo para poder maquetar.
export async function getPublicContent() {
  if (!isDatabaseConfigured()) return { ...placeholderContent, source: "placeholder" };
  try {
    const [projects, products, testimonials] = await Promise.all([
      listProjects(),
      listCofitecaProducts(),
      listTestimonials()
    ]);
    return { projects, products, testimonials, source: "database" };
  } catch (error) {
    console.error("[content] No se pudo leer la base, uso contenido de ejemplo:", error?.message);
    return { ...placeholderContent, source: "placeholder" };
  }
}

function mapProject(row, sections) {
  return {
    id: row.id,
    slug: row.slug,
    clientName: row.client_name,
    title: row.title || "",
    workType: row.work_type || "",
    summary: row.summary || "",
    coverUrl: row.cover_url || "",
    media: Array.isArray(row.media) ? row.media : [],
    featured: Boolean(row.featured),
    visible: Boolean(row.visible),
    sortOrder: row.sort_order,
    sections
  };
}

function mapSection(row) {
  return {
    id: row.id,
    title: row.title,
    concept: row.concept || "",
    description: row.description || "",
    media: Array.isArray(row.media) ? row.media : [],
    visible: Boolean(row.visible),
    sortOrder: row.sort_order
  };
}

function mapProduct(row) {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category,
    shortDescription: row.short_description || "",
    description: row.description || "",
    images: Array.isArray(row.images) ? row.images : [],
    whatsappMessage: row.whatsapp_message || "",
    visible: Boolean(row.visible),
    sortOrder: row.sort_order
  };
}

function mapTestimonial(row) {
  return {
    id: row.id,
    quote: row.quote,
    authorName: row.author_name,
    company: row.company || "",
    logoUrl: row.logo_url || "",
    visible: Boolean(row.visible),
    sortOrder: row.sort_order
  };
}
