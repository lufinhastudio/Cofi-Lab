import { adminRoute, readBody } from "@/lib/server/admin";
import { createProduct, listProductsAdmin } from "@/lib/server/collections";

// La Cofiteca todavía no tiene página pública: estos cambios no revalidan el sitio.
export const GET = adminRoute(async () => ({ products: await listProductsAdmin() }), { scope: "admin-cofiteca" });

export const POST = adminRoute(async ({ request }) => ({ product: await createProduct(await readBody(request, 64 * 1024)) }), {
  scope: "admin-cofiteca"
});
