import "server-only";
import { cache } from "react";
import { about, clientsPage, contactPage, differentiators, home, positioning, services } from "@/config/content";
import { site } from "@/config/site";
import { CONTENT_AREAS } from "@/lib/content/schemas";
import { sanitizeFields, ValidationError } from "@/lib/content/sanitize";
import { legacyImage } from "@/lib/legacy";
import { isAllowedImageUrl } from "./cloudinary";
import { getSql, isDatabaseConfigured } from "./db";

// Contenido editable del sitio. En la base (tabla site_content) se guarda cada
// área completa tal como la dejó el panel; lo que nunca se editó sale de estos
// valores por defecto, que son los textos y fotos actuales del sitio.

const paragraphs = (list) => (Array.isArray(list) ? list.join("\n\n") : String(list || ""));

export const CONTENT_DEFAULTS = {
  home: {
    heroLabel: home.label,
    heroTitle: site.tagline,
    heroText: site.pitch,
    heroPrimaryCta: "Contanos tu idea",
    heroSecondaryCta: "Ver clientes",
    strip: home.strip.map(({ label, tone }) => ({ label, tone })),
    introLabel: "Laboratorio creativo",
    introTitle: "Un equipo cercano que se suma al tuyo.",
    intro: paragraphs(home.intro),
    photos: home.photos.map((photo) => ({ url: legacyImage(photo.src), alt: photo.alt })),
    servicesLabel: "Servicios",
    servicesTitle: "Lo que hacemos",
    servicesText: "Estrategia, creatividad y producción audiovisual en un mismo equipo.",
    services: services.map(({ title, lead, items, icon, tone }) => ({ title, lead, items, icon, tone })),
    positioningLabel: "Por qué CoFi",
    positioningText: positioning.text,
    positioningTags: positioning.tags.map(({ label, tone }) => ({ label, tone })),
    differentiators: differentiators.map(({ title, text }) => ({ title, text })),
    statsLabel: "Primer aniversario",
    statsTitle: "1 año haciendo lo que nos gusta.",
    stats: home.stats.map(({ value, label, note, tone }) => ({ value, label, note, tone })),
    clientsLabel: "Clientes",
    clientsTitle: "Marcas que nos dejaron ser parte.",
    clientsButton: "Ver todos los casos",
    showTestimonials: true,
    testimonialsLabel: "Testimonios",
    testimonialsTitle: "Lo que dicen",
    finalTitle: "Para comunicar, no solo para publicar.",
    finalButton: "Contanos tu idea"
  },
  clients: {
    label: "Casos",
    title: clientsPage.title,
    lead: clientsPage.lead,
    intro: clientsPage.intro
  },
  about: {
    label: "Nosotras",
    title: about.title,
    intro: paragraphs(about.intro),
    team: about.team
      .filter((member) => member.bio.length)
      .map((member) => ({ name: member.name, role: member.role, bio: paragraphs(member.bio), image: legacyImage(member.image), tone: member.tone })),
    petsName: about.team[2]?.name || "",
    petsLabel: about.team[2]?.label || "",
    petsText: about.team[2]?.role || "",
    petsImage: legacyImage(about.team[2]?.image),
    essenceLabel: "Esencia",
    essenceTitle: "Lo que nos mueve",
    essence: about.essence.map(({ label, text }) => ({ label, text })),
    valuesLabel: "Valores",
    values: about.values.map(({ label, tone }) => ({ label, tone })),
    closingTitle: "Creamos juntas, crecemos juntas.",
    closingButton: "Contanos tu idea"
  },
  contact: {
    label: "Contacto",
    title: contactPage.title,
    highlight: contactPage.highlight,
    intro: contactPage.intro,
    photo: legacyImage(home.photos[1].src),
    photoAlt: home.photos[1].alt,
    photoCaption: "Sofi\n+ Cami",
    services: contactPage.services,
    successTitle: "¡Gracias!",
    successText: "Ya tenemos tu idea en el laboratorio. Te respondemos a la brevedad."
  },
  cofiteca: {
    label: "La CoFiteca",
    title: "La CoFiteca",
    intro: "Libros, juegos y productos propios: cosas que nos gustan y queremos compartir.",
    comingSoonLabel: "Próximamente",
    comingSoonTitle: "Estamos armando la estantería.",
    comingSoonText: "Muy pronto vas a encontrar acá libros, juegos y productos propios de CoFi. Seguinos en Instagram para enterarte cuando abra.",
    comingSoonButton: "Seguinos en Instagram",
    whatsappButton: "Consultar por WhatsApp",
    linkButton: "Ver más"
  },
  settings: {
    instagramHandle: site.instagram.handle,
    instagramUrl: site.instagram.url,
    teamSocials: site.team.map(({ name, handle, url }) => ({ name, handle, url })),
    email: site.contact.email,
    whatsapp: site.contact.whatsapp,
    footerLabel: "Contacto",
    footerTitle: "¿Tenés un proyecto en mente?",
    footerButton: "Contanos tu idea",
    headerCta: "Contanos tu idea",
    tagline: site.tagline,
    description: site.description
  }
};

function merge(key, stored) {
  const defaults = CONTENT_DEFAULTS[key];
  if (!stored || typeof stored !== "object") return { ...defaults };
  const result = { ...defaults };
  for (const field of CONTENT_AREAS[key].fields) {
    if (field.type === "note") continue;
    if (Object.hasOwn(stored, field.name) && stored[field.name] !== null && stored[field.name] !== undefined) {
      result[field.name] = stored[field.name];
    }
  }
  return result;
}

async function readRows() {
  if (!isDatabaseConfigured()) return {};
  try {
    const sql = getSql();
    const rows = await sql`select key, data, updated_at from site_content`;
    return Object.fromEntries(rows.map((row) => [row.key, row]));
  } catch (error) {
    // Antes de correr la migración v4 la tabla no existe: se usan los textos por defecto.
    if (error?.code === "42P01") return {};
    throw error;
  }
}

const getAllRows = cache(readRows);

export async function getSiteContent(key) {
  if (!CONTENT_AREAS[key]) throw new Error(`Área de contenido desconocida: ${key}`);
  const rows = await getAllRows();
  return merge(key, rows[key]?.data);
}

export async function getSiteContentWithMeta(key) {
  const rows = await readRows();
  return {
    data: merge(key, rows[key]?.data),
    updatedAt: rows[key]?.updated_at ? new Date(rows[key].updated_at).toISOString() : null,
    customized: Boolean(rows[key])
  };
}

export async function saveSiteContent(key, input, userId) {
  const area = CONTENT_AREAS[key];
  if (!area) throw new ValidationError("Área de contenido desconocida.");
  const { data, errors } = sanitizeFields(area.fields, input, { isImageUrl: isAllowedImageUrl });
  if (errors.length) throw new ValidationError(errors);
  const sql = getSql();
  await sql`
    insert into site_content (key, data, updated_by, updated_at)
    values (${key}, ${JSON.stringify(data)}::jsonb, ${userId}, now())
    on conflict (key) do update set data = excluded.data, updated_by = excluded.updated_by, updated_at = now()
  `;
  return getSiteContentWithMeta(key);
}

// Vuelve un área a los textos originales (borra solo esa fila de site_content).
export async function resetSiteContent(key) {
  if (!CONTENT_AREAS[key]) throw new ValidationError("Área de contenido desconocida.");
  const sql = getSql();
  await sql`delete from site_content where key = ${key}`;
  return getSiteContentWithMeta(key);
}

// Datos generales que usan el encabezado y el pie en todas las páginas.
export async function getSiteSettings() {
  return getSiteContent("settings");
}
