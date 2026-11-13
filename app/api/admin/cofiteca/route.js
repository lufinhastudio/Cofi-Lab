import { adminRoute, readBody, revalidatePublicSite } from "@/lib/server/admin";
import { createProduct, listProductsAdmin } from "@/lib/server/collections";

export const GET = adminRoute(async () => ({ products: await listProductsAdmin() }), { scope: "admin-cofiteca" });

// Cada cambio actualiza la página pública /cofiteca (sin deploy).
export const POST = adminRoute(
  async ({ request }) => {
    const product = await createProduct(await readBody(request, 64 * 1024));
    revalidatePublicSite();
    return { product };
  },
  { scope: "admin-cofiteca" }
);
