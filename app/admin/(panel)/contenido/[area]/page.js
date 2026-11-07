import { requireAdminPage } from "@/lib/server/admin";
import { notFound } from "next/navigation";
import { ContentEditor } from "@/components/admin/ContentEditor";
import { CONTENT_AREAS, CONTENT_SLUGS } from "@/lib/content/schemas";
import { getSiteContentWithMeta } from "@/lib/server/siteContent";

export async function generateMetadata({ params }) {
  const { area } = await params;
  const key = CONTENT_SLUGS[area];
  return { title: { absolute: `${key ? CONTENT_AREAS[key].title : "Contenido"} · Panel CoFi` } };
}

export default async function AdminContentAreaPage({ params }) {
  await requireAdminPage();
  const { area } = await params;
  const key = CONTENT_SLUGS[area];
  if (!key) notFound();
  const { data, updatedAt, customized } = await getSiteContentWithMeta(key);
  // CONTENT_AREAS solo tiene datos planos (sin funciones): se puede pasar al cliente.
  return <ContentEditor key={updatedAt || "default"} areaKey={key} area={CONTENT_AREAS[key]} initial={data} updatedAt={updatedAt} customized={customized} />;
}
