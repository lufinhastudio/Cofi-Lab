import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/server/auth";
import { LogoutButton } from "./LogoutButton";

// Todo lo que está dentro de app/admin/(panel)/ queda protegido:
// sin sesión válida redirige a /admin/login (se verifica en el servidor).
export const dynamic = "force-dynamic";

const sections = [
  { href: "/admin", label: "Inicio" },
  { href: "/admin/trabajos", label: "Trabajos" },
  { href: "/admin/cofiteca", label: "La Cofiteca" },
  { href: "/admin/testimonios", label: "Testimonios" }
];

export default async function AdminPanelLayout({ children }) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  // Esqueleto sin diseño: el panel se diseña desde cero en el próximo paso.
  return (
    <div className="min-h-screen">
      <header className="flex flex-wrap items-center gap-4 border-b border-black/10 px-6 py-4">
        <strong>COFI LAB · Admin</strong>
        <nav className="flex flex-wrap gap-4 text-sm">
          {sections.map((section) => (
            <Link key={section.href} href={section.href} className="underline-offset-4 hover:underline">
              {section.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-3 text-sm">
          <span className="opacity-60">{session.user.email}</span>
          <LogoutButton />
        </div>
      </header>
      <main className="p-6">{children}</main>
    </div>
  );
}
