import { adminRoute, readBody, revalidatePublicSite } from "@/lib/server/admin";
import { deleteTestimonial, updateTestimonial } from "@/lib/server/collections";

async function update({ request, params }) {
  const testimonial = await updateTestimonial(params.id, await readBody(request, 16 * 1024));
  revalidatePublicSite();
  return { testimonial };
}

export const PUT = adminRoute(update, { scope: "admin-testimonial" });
export const PATCH = adminRoute(update, { scope: "admin-testimonial" });

export const DELETE = adminRoute(
  async ({ params }) => {
    await deleteTestimonial(params.id);
    revalidatePublicSite();
    return { ok: true };
  },
  { scope: "admin-testimonial" }
);
