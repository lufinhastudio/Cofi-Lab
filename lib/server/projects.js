import "server-only";
import { PROJECT_STATUS, templateById, templateFor } from "@/lib/content/options";
import { cleanLine, cleanText, isUuid, isValidSlug, parseHttpUrl, slugify, ValidationError } from "@/lib/content/sanitize";
import { isAllowedImageUrl } from "./cloudinary";
import { mapProject, mapSection, projectStatus } from "./content";
import { getSql } from "./db";
import { PublicApiError } from "./http";

// ABM de marcas (tabla projects) y sus secciones (project_sections).

const MAX_SECTIONS = 60;

export async function listProjectsAdmin() {
  const sql = getSql();
  const rows = await sql`
    select p.*,
      (select count(*)::int from project_sections s where s.project_id = p.id) as section_count,
      (select coalesce(sum(jsonb_array_length(s.media)), 0)::int from project_sections s where s.project_id = p.id) as image_count
    from projects p
    order by p.sort_order asc, p.created_at asc
  `;
  return rows.map((row) => ({ ...mapProject(row), sectionCount: row.section_count, imageCount: row.image_count }));
}

export async function getProjectAdmin(id) {
  if (!isUuid(id)) return null;
  const sql = getSql();
  const [row] = await sql`select * from projects where id = ${id} limit 1`;
  if (!row) return null;
  const sections = await sql`select * from project_sections where project_id = ${id} order by sort_order asc, created_at asc`;
  return mapProject(row, sections.map(mapSection));
}

export async function createProject(input) {
  const clientName = cleanLine(input.clientName, 80);
  if (!clientName) throw new ValidationError("Escribí el nombre de la marca.");
  const sql = getSql();
  const slug = await uniqueSlug(slugify(input.slug || clientName) || "marca");
  const [row] = await sql`
    insert into projects (slug, client_name, industry, status, visible, sort_order)
    values (
      ${slug}, ${clientName}, ${cleanLine(input.industry, 80) || null}, 'draft', false,
      (select coalesce(max(sort_order), -1) + 1 from projects)
    )
    returning *
  `;
  return mapProject(row);
}

export async function saveProject(id, input) {
  const current = await getProjectAdmin(id);
  if (!current) throw new PublicApiError("NOT_FOUND", "Esta marca ya no existe.", { status: 404 });

  if (input.updatedAt && current.updatedAt && input.updatedAt !== current.updatedAt) {
    throw new PublicApiError(
      "CONFLICT",
      "Alguien más guardó cambios en esta marca mientras la editabas. Recargá la página para ver la última versión.",
      { status: 409 }
    );
  }

  const errors = [];
  const brand = sanitizeBrand(input, errors);
  const sections = sanitizeSections(input.sections, errors);

  if (brand.slug !== current.slug) {
    const sql = getSql();
    const [taken] = await sql`select id from projects where lower(slug) = ${brand.slug} and id <> ${id} limit 1`;
    if (taken) errors.push(`Ya hay otra marca con la dirección /clientes/${brand.slug}. Elegí otra.`);
  }
  if (brand.status === "published") {
    if (!brand.coverUrl) errors.push("Para publicar la marca, agregale una foto de portada.");
  }
  if (errors.length) throw new ValidationError(errors);

  const previousSlugs = new Set(current.previousSlugs);
  const sql = getSql();
  if (brand.slug !== current.slug) previousSlugs.add(current.slug);
  previousSlugs.delete(brand.slug);

  const ids = sections.map((section) => section.id);
  const queries = [
    sql`
      update projects set
        client_name = ${brand.clientName},
        slug = ${brand.slug},
        previous_slugs = ${[...previousSlugs]},
        industry = ${brand.industry || null},
        summary = ${brand.summary || null},
        services = ${brand.services},
        cover_url = ${brand.coverUrl || null},
        videos_heading = ${brand.videosHeading || null},
        instagram_url = ${brand.instagramUrl || null},
        instagram_label = ${brand.instagramLabel || null},
        instagram_image_url = ${brand.instagramImageUrl || null},
        featured = ${brand.featured},
        status = ${brand.status},
        visible = ${brand.status === "published"},
        published_at = case when ${brand.status} = 'published' then coalesce(published_at, now()) else published_at end,
        updated_at = now()
      where id = ${id}
    `,
    sql`delete from project_sections where project_id = ${id} and not (id = any(${ids}::uuid[]))`,
    ...sections.map(
      (section, index) => sql`
        insert into project_sections (id, project_id, kind, layout, title, description, link_url, media, visible, sort_order)
        values (
          ${section.id}, ${id}, ${section.kind}, ${section.layout}, ${section.title || null}, ${section.description || null},
          ${section.linkUrl || null}, ${JSON.stringify(section.media)}::jsonb, ${section.visible}, ${index}
        )
        on conflict (id) do update set
          kind = excluded.kind,
          layout = excluded.layout,
          title = excluded.title,
          description = excluded.description,
          link_url = excluded.link_url,
          media = excluded.media,
          visible = excluded.visible,
          sort_order = excluded.sort_order,
          updated_at = now()
        where project_sections.project_id = ${id}
      `
    )
  ];
  await sql.transaction(queries);
  return getProjectAdmin(id);
}

export async function setProjectStatus(id, status) {
  if (!isUuid(id)) throw new PublicApiError("NOT_FOUND", "Esta marca ya no existe.", { status: 404 });
  if (!Object.hasOwn(PROJECT_STATUS, status)) throw new ValidationError("Estado no válido.");
  const sql = getSql();
  if (status === "published") {
    const [row] = await sql`select cover_url from projects where id = ${id}`;
    if (!row) throw new PublicApiError("NOT_FOUND", "Esta marca ya no existe.", { status: 404 });
    if (!row.cover_url) throw new ValidationError("Para publicar la marca, agregale una foto de portada.");
  }
  const [row] = await sql`
    update projects set
      status = ${status},
      visible = ${status === "published"},
      published_at = case when ${status} = 'published' then coalesce(published_at, now()) else published_at end,
      updated_at = now()
    where id = ${id}
    returning *
  `;
  if (!row) throw new PublicApiError("NOT_FOUND", "Esta marca ya no existe.", { status: 404 });
  return mapProject(row);
}

export async function setProjectFeatured(id, featured) {
  if (!isUuid(id)) throw new PublicApiError("NOT_FOUND", "Esta marca ya no existe.", { status: 404 });
  const sql = getSql();
  const [row] = await sql`update projects set featured = ${Boolean(featured)}, updated_at = now() where id = ${id} returning *`;
  if (!row) throw new PublicApiError("NOT_FOUND", "Esta marca ya no existe.", { status: 404 });
  return mapProject(row);
}

export async function deleteProject(id) {
  if (!isUuid(id)) throw new PublicApiError("NOT_FOUND", "Esta marca ya no existe.", { status: 404 });
  const sql = getSql();
  // Las secciones se borran en cascada (FK on delete cascade). Las fotos quedan en Cloudinary.
  const [row] = await sql`delete from projects where id = ${id} returning id`;
  if (!row) throw new PublicApiError("NOT_FOUND", "Esta marca ya no existe.", { status: 404 });
}

export async function reorderTable(table, ids) {
  const list = Array.isArray(ids) ? ids.filter(isUuid) : [];
  if (!list.length || list.length !== new Set(list).size) throw new ValidationError("Orden no válido.");
  const sql = getSql();
  const queries = {
    projects: (id, index) => sql`update projects set sort_order = ${index} where id = ${id}`,
    testimonials: (id, index) => sql`update testimonials set sort_order = ${index} where id = ${id}`
  }[table];
  if (!queries) throw new Error("Tabla no permitida.");
  await sql.transaction(list.map(queries));
}

// --- Validación ----------------------------------------------------------------

function sanitizeBrand(input, errors) {
  const clientName = cleanLine(input.clientName, 80);
  if (!clientName) errors.push("Escribí el nombre de la marca.");
  const slug = slugify(input.slug || clientName);
  if (!isValidSlug(slug)) errors.push("La dirección (slug) solo puede tener letras minúsculas, números y guiones.");

  const url = (value, label) => {
    const parsed = parseHttpUrl(value);
    if (parsed === null) errors.push(`El link de «${label}» no es válido. Tiene que empezar con https://`);
    return parsed || "";
  };
  const image = (value, label) => {
    const text = cleanLine(value, 600);
    if (text && !isAllowedImageUrl(text)) {
      errors.push(`La imagen de «${label}» no es válida. Subila desde el panel.`);
      return "";
    }
    return text;
  };

  const services = (Array.isArray(input.services) ? input.services : [])
    .map((item) => cleanLine(item, 60))
    .filter(Boolean)
    .slice(0, 12);

  const status = Object.hasOwn(PROJECT_STATUS, input.status) ? input.status : "draft";

  return {
    clientName,
    slug,
    industry: cleanLine(input.industry, 80),
    summary: cleanText(input.summary, 4000),
    services,
    coverUrl: image(input.coverUrl, "Portada"),
    videosHeading: cleanLine(input.videosHeading, 80),
    instagramUrl: url(input.instagramUrl, "Instagram"),
    instagramLabel: cleanLine(input.instagramLabel, 60),
    instagramImageUrl: image(input.instagramImageUrl, "Foto del bloque de Instagram"),
    featured: Boolean(input.featured),
    status
  };
}

function sanitizeSections(input, errors) {
  const list = Array.isArray(input) ? input : [];
  if (list.length > MAX_SECTIONS) errors.push(`Una marca puede tener hasta ${MAX_SECTIONS} secciones.`);
  const seen = new Set();

  return list.slice(0, MAX_SECTIONS).map((raw, index) => {
    const number = index + 1;
    const id = isUuid(raw?.id) && !seen.has(raw.id) ? raw.id : crypto.randomUUID();
    seen.add(id);
    const template = templateById(raw?.template) || templateFor(raw?.kind, raw?.layout);
    const label = `Sección ${number} (${template.label})`;

    const media = (Array.isArray(raw?.media) ? raw.media : [])
      .map((item) => ({ url: cleanLine(item?.url, 600), alt: cleanLine(item?.alt, 140) }))
      .filter((item) => item.url);
    for (const item of media) {
      if (!isAllowedImageUrl(item.url)) {
        errors.push(`${label}: hay una imagen que no es válida. Subila desde el panel.`);
        break;
      }
    }
    if (media.length > template.images.max) {
      errors.push(
        template.images.max === 0
          ? `${label}: este diseño no lleva fotos.`
          : `${label}: este diseño admite hasta ${template.images.max} ${template.images.max === 1 ? "foto" : "fotos"}.`
      );
    }

    const linkUrl = template.link ? parseHttpUrl(raw?.linkUrl) : "";
    if (linkUrl === null) errors.push(`${label}: el link no es válido. Tiene que empezar con https://`);

    const section = {
      id,
      kind: template.kind,
      layout: template.layout,
      title: template.title ? cleanLine(raw?.title, 120) : "",
      description: template.text ? cleanText(raw?.description, 3000) : "",
      linkUrl: linkUrl || "",
      media: media.slice(0, Math.max(template.images.max, 0)).map((item) => ({ url: item.url, type: "image", ...(item.alt ? { alt: item.alt } : {}) })),
      visible: raw?.visible !== false
    };

    if (section.visible) {
      if (template.kind === "video" && !section.linkUrl) errors.push(`${label}: agregá el link del reel o video.`);
      if (template.images.min > 0 && !section.media.length) errors.push(`${label}: agregá al menos una foto (o ocultá la sección).`);
      if (template.kind === "text" && !section.title && !section.description) errors.push(`${label}: escribí un título o un texto.`);
    }
    return section;
  });
}

async function uniqueSlug(base) {
  const sql = getSql();
  const rows = await sql`select slug from projects where slug = ${base} or slug like ${`${base}-%`}`;
  const taken = new Set(rows.map((row) => row.slug));
  if (!taken.has(base)) return base;
  for (let n = 2; n < 1000; n += 1) {
    const candidate = `${base}-${n}`.slice(0, 60);
    if (!taken.has(candidate)) return candidate;
  }
  return `${base}-${Date.now()}`;
}

export { projectStatus };
