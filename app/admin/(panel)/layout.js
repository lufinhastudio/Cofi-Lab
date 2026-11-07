import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { getAdminSession } from "@/lib/server/auth";

// Todo lo que está dentro de app/admin/(panel)/ queda protegido:
// sin sesión válida redirige a /admin/login (se verifica en el servidor).
// Las APIs /api/admin/* hacen su propia verificación (lib/server/admin.js).
export const dynamic = "force-dynamic";

export default async function AdminPanelLayout({ children }) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  return (
    <AdminShell user={session.user}>
      {children}
    </AdminShell>
  );
}
