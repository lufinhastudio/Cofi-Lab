import "server-only";
import { cache } from "react";
import { getSql, isDatabaseConfigured } from "./db";
import { getLegacyProjects, legacyImage } from "@/lib/legacy";
import { legacyTestimonials } from "@/config/content";

// Lecturas públicas del contenido administrable (marcas y testimonios).
//
// Respaldo legacy: SOLO se usa cuando no hay base configurada (desarrollo sin
// DATABASE_URL). Si la base está configurada se respeta lo que diga, aunque esté
// vacía: así no reaparecen marcas o testimonios que se ocultaron o eliminaron.
// Si la consulta falla, el error sube: Next mantiene la última versión buena de
// la página (ISR) en lugar de mostrar contenido viejo.

// Visible en el sitio = status "published". La columna "visible" se mantiene
// sincronizada con el estado (ver lib/server/projects.js), por eso alcanza con ella
// y el sitio funciona igual antes y después de correr la migración v4.
async function queryPublicProjects() {
  const sql = getSql();
  const projects = await sql`select * from projects where visible = true order by sort_order asc, created_at asc`;
  if (!projects.length) return [];
  const ids = projects.map((project) => project.id);
  const sections = await sql`
    select * from project_sections
    where project_id = any(${ids}) and visible = true
    order by sort_order asc, created_at asc
  `;
  const byProject = new Map();
  for (const section of sections) {
    if (!byProject.has(section.project_id)) byProject.set(section.project_id, []);
    byProject.get(section.project_id).push(mapSection(section));
  }
  return projects.map((project) => mapProject(project, byProject.get(project.id) || []));
}

export const getPublicProjects = cache(async () => {
  if (!isDatabaseConfigured()) return getLegacyProjects();
  return queryPublicProjects();
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

// Si una marca cambió de slug, la URL anterior redirige a la nueva.
export async function findRenamedProjectSlug(slug) {
  if (!isDatabaseConfigured()) return null;
  try {
    const sql = getSql();
    const [row] = await sql`
      select slug from projects
      where visible = true and ${slug} = any(previous_slugs)
      order by updated_at desc
      limit 1
    `;
    return row?.slug || null;
  } catch {
    return null;
  }
}

// Marcas del inicio: solo las publicadas marcadas como «Destacada en el inicio».
// Sin reglas ocultas: lo que dice el panel es lo que se ve. Sin base (desarrollo)
// se muestran todas las del contenido de respaldo.
export async function getHomeProjects() {
  const projects = await getPublicProjects();
  if (!isDatabaseConfigured()) return projects;
  return projects.filter((project) => project.featured);
}

export const getPublicTestimonials = cache(async () => {
  if (!isDatabaseConfigured()) {
    return legacyTestimonials.map((item, index) => ({
      id: `legacy-testimonial-${index}`,
      quote: item.quote,
      authorName: item.authorName,
      company: item.company,
      imageUrl: legacyImage(item.image),
      visible: true,
      sortOrder: index
    }));
  }
  const sql = getSql();
  const rows = await sql`select * from testimonials where visible = true order by sort_order asc, created_at asc`;
  return rows.map(mapTestimonial);
});

// --- Mapeos ------------------------------------------------------------------

export function projectStatus(row) {
  if (row.status === "draft" || row.status === "hidden" || row.status === "published") return row.status;
  return row.visible ? "published" : "hidden";
}

export function mapProject(row, sections = []) {
  return {
    id: row.id,
    slug: row.slug,
    previousSlugs: Array.isArray(row.previous_slugs) ? row.previous_slugs : [],
    clientName: row.client_name,
    summary: row.summary || "",
    industry: row.industry || "",
    services: Array.isArray(row.services) ? row.services : [],
    coverUrl: row.cover_url || "",
    videosHeading: row.videos_heading || "",
    instagramUrl: row.instagram_url || "",
    instagramLabel: row.instagram_label || "",
    instagramImageUrl: row.instagram_image_url || "",
    featured: Boolean(row.featured),
    status: projectStatus(row),
    visible: Boolean(row.visible),
    sortOrder: row.sort_order,
    updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : null,
    sections
  };
}

export function mapSection(row) {
  return {
    id: row.id,
    kind: row.kind || "gallery",
    layout: row.layout || "grid",
    title: row.title || "",
    description: row.description || "",
    linkUrl: row.link_url || "",
    media: Array.isArray(row.media) ? row.media.filter((item) => item && item.url) : [],
    visible: Boolean(row.visible),
    sortOrder: row.sort_order
  };
}

export function mapTestimonial(row) {
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
