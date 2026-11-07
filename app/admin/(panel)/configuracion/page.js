import { requireAdminPage } from "@/lib/server/admin";
import { ContentEditor } from "@/components/admin/ContentEditor";
import { CONTENT_AREAS } from "@/lib/content/schemas";
import { getSiteContentWithMeta } from "@/lib/server/siteContent";

export const metadata = { title: { absolute: "Configuración · Panel CoFi" } };

export default async function AdminSettingsPage() {
  await requireAdminPage();
  const { data, updatedAt, customized } = await getSiteContentWithMeta("settings");
  return (
    <ContentEditor
      key={updatedAt || "default"}
      eyebrow="Configuración general"
      areaKey="settings"
      area={CONTENT_AREAS.settings}
      initial={data}
      updatedAt={updatedAt}
      customized={customized}
    />
  );
}
