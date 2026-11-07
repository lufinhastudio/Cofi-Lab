import { ValidationError } from "@/lib/content/sanitize";
import { adminRoute, notFound, readBody, revalidatePublicSite } from "@/lib/server/admin";
import { deleteProject, getProjectAdmin, saveProject, setProjectFeatured, setProjectStatus } from "@/lib/server/projects";

export const GET = adminRoute(
  async ({ params }) => {
    const project = await getProjectAdmin(params.id);
    if (!project) throw notFound("Esta marca ya no existe.");
    return { project };
  },
  { scope: "admin-project" }
);

// Guarda la marca completa con todas sus secciones (en una sola transacción).
export const PUT = adminRoute(
  async ({ request, params }) => {
    const project = await saveProject(params.id, await readBody(request, 1024 * 1024));
    revalidatePublicSite();
    return { project };
  },
  { scope: "admin-project" }
);

// Cambios rápidos desde el listado: estado (publicar / ocultar / borrador) o destacada.
export const PATCH = adminRoute(
  async ({ request, params }) => {
    const body = await readBody(request, 2 * 1024);
    let project;
    if (typeof body.status === "string") project = await setProjectStatus(params.id, body.status);
    else if (typeof body.featured === "boolean") project = await setProjectFeatured(params.id, body.featured);
    else throw new ValidationError("No hay cambios para guardar.");
    revalidatePublicSite();
    return { project };
  },
  { scope: "admin-project" }
);

export const DELETE = adminRoute(
  async ({ params }) => {
    await deleteProject(params.id);
    revalidatePublicSite();
    return { ok: true };
  },
  { scope: "admin-project" }
);
