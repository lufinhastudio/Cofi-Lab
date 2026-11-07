import { adminRoute, readBody, revalidatePublicSite } from "@/lib/server/admin";
import { createTestimonial, listTestimonialsAdmin } from "@/lib/server/collections";

export const GET = adminRoute(async () => ({ testimonials: await listTestimonialsAdmin() }), { scope: "admin-testimonials" });

export const POST = adminRoute(
  async ({ request }) => {
    const testimonial = await createTestimonial(await readBody(request, 16 * 1024));
    revalidatePublicSite();
    return { testimonial };
  },
  { scope: "admin-testimonials" }
);
