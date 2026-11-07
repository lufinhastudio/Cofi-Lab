import { requireAdminPage } from "@/lib/server/admin";
import { TestimonialsManager } from "@/components/admin/TestimonialsManager";
import { listTestimonialsAdmin } from "@/lib/server/collections";

export const metadata = { title: { absolute: "Testimonios · Panel CoFi" } };

export default async function AdminTestimonialsPage() {
  await requireAdminPage();
  return <TestimonialsManager initialItems={await listTestimonialsAdmin()} />;
}
