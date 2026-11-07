import Image from "next/image";
import { redirect } from "next/navigation";
import { Shape } from "@/components/site/Brand";
import { getAdminSession } from "@/lib/server/auth";
import { LoginForm } from "./LoginForm";

export const dynamic = "force-dynamic";
export const metadata = { title: { absolute: "Ingresar · Panel CoFi" } };

export default async function AdminLoginPage({ searchParams }) {
  const session = await getAdminSession();
  const params = await searchParams;
  // Solo se permite volver a una pantalla del panel (evita redirecciones abiertas).
  const next = typeof params?.next === "string" && /^\/admin(\/[\w\-/]*)?$/.test(params.next) && !params.next.startsWith("/admin/login") ? params.next : "/admin";
  if (session) redirect(next);

  return (
    <main className="grid min-h-screen lg:grid-cols-[1fr_1.1fr]">
      <section className="relative hidden overflow-hidden bg-periwinkle p-12 lg:flex lg:flex-col lg:justify-between">
        <Shape type="flor" color="watermelon" spin className="absolute -bottom-24 -right-24 h-80 w-80" />
        <span className="relative block h-16 w-24">
          <Image src="/brand/cofi-tinta.png" alt="CoFi" fill sizes="96px" className="object-contain" unoptimized priority />
        </span>
        <div className="relative">
          <p className="mono-label">Panel de contenido</p>
          <p className="title-pop mt-4 max-w-[12ch] text-[64px]">El laboratorio, por dentro.</p>
        </div>
      </section>
      <section className="flex items-center justify-center bg-crema px-5 py-12">
        <div className="w-full max-w-sm">
          <span className="relative mb-10 block h-12 w-16 lg:hidden">
            <Image src="/brand/cofi-tinta.png" alt="CoFi" fill sizes="64px" className="object-contain" unoptimized priority />
          </span>
          <p className="mono-label text-[#c23434]">Acceso privado</p>
          <h1 className="mt-3 font-display text-[32px] font-black leading-tight">Ingresá al panel</h1>
          <p className="mt-2 text-[15px] text-muted">Usá el email y la contraseña de administradora.</p>
          <LoginForm next={next} />
        </div>
      </section>
    </main>
  );
}
