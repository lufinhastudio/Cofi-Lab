import { CONTENT_AREAS } from "@/lib/content/schemas";
import { adminRoute, notFound, readBody, revalidatePublicSite } from "@/lib/server/admin";
import { getSiteContentWithMeta, resetSiteContent, saveSiteContent } from "@/lib/server/siteContent";

function assertKey(key) {
  if (!Object.hasOwn(CONTENT_AREAS, key)) throw notFound("Esa sección del sitio no existe.");
}

export const GET = adminRoute(
  async ({ params }) => {
    assertKey(params.key);
    return getSiteContentWithMeta(params.key);
  },
  { scope: "admin-content" }
);

export const PUT = adminRoute(
  async ({ request, params, session }) => {
    assertKey(params.key);
    const result = await saveSiteContent(params.key, await readBody(request, 256 * 1024), session.user.userId);
    revalidatePublicSite();
    return result;
  },
  { scope: "admin-content" }
);

// Vuelve el área a los textos originales del sitio.
export const DELETE = adminRoute(
  async ({ params }) => {
    assertKey(params.key);
    const result = await resetSiteContent(params.key);
    revalidatePublicSite();
    return result;
  },
  { scope: "admin-content" }
);
