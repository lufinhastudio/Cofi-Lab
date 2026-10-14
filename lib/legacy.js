import cloudinaryMap from "@/data/legacy/cloudinary-map.json";
import legacyProjects from "@/data/legacy/pixieset-projects.json";
import highlights from "@/data/legacy/project-highlights.json";

// Las imágenes del sitio anterior se referencian por su ruta de Pixieset
// ("grupo/archivo.jpg"). Una vez importadas a Cloudinary, cloudinary-map.json
// tiene la URL nueva; si todavía no se importaron, se usa la original.
const PIXIESET_BASE = "https://images-pw.pixieset.com/elementfield/";

export function legacyImage(path) {
  if (!path) return "";
  if (/^https?:\/\//.test(path)) return path;
  return cloudinaryMap[path] || `${PIXIESET_BASE}${path}`;
}

// Proyectos del sitio anterior con la misma forma que los de la base.
// Se usan como respaldo si la base no responde y como fuente del import.
export function getLegacyProjects() {
  return legacyProjects.map((project, index) => ({
    id: `legacy-${project.slug}`,
    slug: project.slug,
    clientName: titleCase(project.name),
    summary: project.description.join("\n\n"),
    industry: highlights[project.slug]?.industry || "",
    services: highlights[project.slug]?.services || [],
    coverUrl: legacyImage(project.cover),
    videosHeading: project.videosHeading || "",
    instagramUrl: project.instagram?.url || "",
    instagramLabel: project.instagram?.label || "",
    instagramImageUrl: legacyImage(project.instagram?.image),
    visible: true,
    sortOrder: index,
    sections: project.sections.map((section, sectionIndex) => ({
      id: `legacy-${project.slug}-${sectionIndex}`,
      kind: section.kind,
      layout: section.layout || (section.kind === "video" ? "video" : "grid"),
      title: section.title || "",
      description: section.description || "",
      linkUrl: section.url || "",
      media: section.images.map((image) => ({ url: legacyImage(image), type: "image" })),
      visible: true,
      sortOrder: section.sort ?? sectionIndex
    }))
  }));
}

// "ANGUS" -> "Angus", pero respeta nombres con mayúsculas internas ("iZone")
// y siglas cortas ("ABA").
export function titleCase(name) {
  const value = String(name || "").trim();
  if (value.length <= 3 || value !== value.toUpperCase()) return value;
  return value.charAt(0) + value.slice(1).toLowerCase();
}
