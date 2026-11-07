import { requireAdminPage } from "@/lib/server/admin";
import { BrandsList } from "@/components/admin/BrandsList";
import { listProjectsAdmin } from "@/lib/server/projects";

export const metadata = { title: { absolute: "Marcas · Panel CoFi" } };

export default async function AdminBrandsPage({ searchParams }) {
  await requireAdminPage();
  const [projects, params] = await Promise.all([listProjectsAdmin(), searchParams]);
  return <BrandsList initialProjects={projects} openCreate={params?.nueva === "1"} />;
}
