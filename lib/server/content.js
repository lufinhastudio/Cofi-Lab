import "server-only";
import { cache } from "react";
import { getSql, isDatabaseConfigured } from "./db";
import { getLegacyProjects, legacyImage } from "@/lib/legacy";
import { legacyTestimonials } from "@/config/content";

// Lecturas del contenido administrable: clientes (trabajos) y testimonios.
// Si la base no está configurada o falla, se usa el contenido del sitio anterior.

export async function listProjects({ includeHidden = false } = {}) {
  const sql = getSql();
  const projects = includeHidden
    ? await sql`select * from projects order by sort_order asc, created_at asc`
    : await sql`select * from projects where visible = true order by sort_order asc, created_at asc`;
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

export async function listTestimonials({ includeHidden = false } = {}) {
  const sql = getSql();
  const rows = includeHidden
    ? await sql`select * from testimonials order by sort_order asc, created_at asc`
    : await sql`select * from testimonials where visible = true order by sort_order asc, created_at asc`;
  return rows.map(mapTestimonial);
}

export async function getContentCounts() {
  const sql = getSql();
  const [row] = await sql`
    select
      (select count(*)::int from projects) as projects,
      (select count(*)::int from projects where visible) as projects_visible,
      (select count(*)::int from testimonials) as testimonials,
      (select count(*)::int from contact_messages where read_at is null) as unread_messages
  `;
  return row;
}

// --- Lecturas públicas con respaldo ----------------------------------------

export const getPublicProjects = cache(async () => {
  if (!isDatabaseConfigured()) return getLegacyProjects();
  try {
    const projects = await listProjects();
    return projects.length ? projects : getLegacyProjects();
  } catch (error) {
    console.error("[content] No se pudo leer la base, uso el contenido anterior:", error?.message);
    return getLegacyProjects();
  }
});

export async function getPublicProject(slug) {
  const projects = await getPublicProjects();
  const index = projects.findIndex((project) => project.slug === slug);
  if (index === -1) return null;
  return {
    project: projects[index],
    previous: projects[(index - 1 + projects.length) % projects.length],
    next: projects[(index + 1) % projects.length]
  };
}

export const getPublicTestimonials = cache(async () => {
  const fallback = legacyTestimonials.map((item, index) => ({
    id: `legacy-testimonial-${index}`,
    quote: item.quote,
    authorName: item.authorName,
    company: item.company,
    imageUrl: legacyImage(item.image),
    visible: true,
    sortOrder: index
  }));
  if (!isDatabaseConfigured()) return fallback;
  try {
    const rows = await listTestimonials();
    return rows.length ? rows : fallback;
  } catch (error) {
    console.error("[content] No se pudieron leer los testimonios:", error?.message);
    return fallback;
  }
});

// --- Mapeos ------------------------------------------------------------------

function mapProject(row, sections) {
  return {
    id: row.id,
    slug: row.slug,
    clientName: row.client_name,
    summary: row.summary || "",
    industry: row.industry || "",
    services: Array.isArray(row.services) ? row.services : [],
    coverUrl: row.cover_url || "",
    videosHeading: row.videos_heading || "",
    instagramUrl: row.instagram_url || "",
    instagramLabel: row.instagram_label || "",
    instagramImageUrl: row.instagram_image_url || "",
    visible: Boolean(row.visible),
    sortOrder: row.sort_order,
    sections
  };
}

function mapSection(row) {
  return {
    id: row.id,
    kind: row.kind || "gallery",
    layout: row.layout || "grid",
    title: row.title || "",
    description: row.description || "",
    linkUrl: row.link_url || "",
    media: Array.isArray(row.media) ? row.media : [],
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
    imageUrl: row.image_url || row.logo_url || "",
    visible: Boolean(row.visible),
    sortOrder: row.sort_order
  };
}
