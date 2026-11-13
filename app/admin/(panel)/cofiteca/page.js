import { requireAdminPage } from "@/lib/server/admin";
import { CofitecaManager } from "@/components/admin/CofitecaManager";
import { listProductsAdmin } from "@/lib/server/collections";

export const metadata = { title: { absolute: "La Cofiteca · Panel CoFi" } };

export default async function AdminCofitecaPage() {
  await requireAdminPage();
  return <CofitecaManager initialItems={await listProductsAdmin()} />;
}
