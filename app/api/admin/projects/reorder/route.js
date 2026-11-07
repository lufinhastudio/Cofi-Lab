import { adminRoute, readBody, revalidatePublicSite } from "@/lib/server/admin";
import { reorderTable } from "@/lib/server/projects";

export const POST = adminRoute(
  async ({ request }) => {
    const { ids } = await readBody(request, 32 * 1024);
    await reorderTable("projects", ids);
    revalidatePublicSite();
    return { ok: true };
  },
  { scope: "admin-projects-reorder" }
);
