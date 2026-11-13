import { adminRoute, readBody, revalidatePublicSite } from "@/lib/server/admin";
import { deleteProduct, updateProduct } from "@/lib/server/collections";

async function update({ request, params }) {
  const product = await updateProduct(params.id, await readBody(request, 64 * 1024));
  revalidatePublicSite();
  return { product };
}

export const PUT = adminRoute(update, { scope: "admin-cofiteca-item" });
export const PATCH = adminRoute(update, { scope: "admin-cofiteca-item" });

export const DELETE = adminRoute(
  async ({ params }) => {
    await deleteProduct(params.id);
    revalidatePublicSite();
    return { ok: true };
  },
  { scope: "admin-cofiteca-item" }
);
