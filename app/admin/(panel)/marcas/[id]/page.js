import { requireAdminPage } from "@/lib/server/admin";
import { notFound } from "next/navigation";
import { BrandEditor } from "@/components/admin/BrandEditor";
import { getProjectAdmin } from "@/lib/server/projects";

export async function generateMetadata({ params }) {
  await requireAdminPage();
  const { id } = await params;
  const project = await getProjectAdmin(id);
  return { title: { absolute: `${project?.clientName || "Marca"} · Panel CoFi` } };
}

export default async function AdminBrandPage({ params }) {
  await requireAdminPage();
  const { id } = await params;
  const project = await getProjectAdmin(id);
  if (!project) notFound();
  return <BrandEditor initialProject={project} />;
}
