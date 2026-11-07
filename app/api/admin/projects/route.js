import { adminRoute, readBody, revalidatePublicSite } from "@/lib/server/admin";
import { json } from "@/lib/server/http";
import { createProject, listProjectsAdmin } from "@/lib/server/projects";

export const GET = adminRoute(async () => ({ projects: await listProjectsAdmin() }), { scope: "admin-projects" });

// Crea la marca como borrador: no aparece en el sitio hasta publicarla.
export const POST = adminRoute(
  async ({ request }) => {
    const project = await createProject(await readBody(request, 8 * 1024));
    revalidatePublicSite();
    return json({ project }, { status: 201 });
  },
  { scope: "admin-projects" }
);
