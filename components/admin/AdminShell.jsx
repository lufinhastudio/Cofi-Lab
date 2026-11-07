"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Briefcase, ExternalLink, FileText, LayoutDashboard, LogOut, Menu, MessageSquareQuote, Settings, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { AdminProviders } from "./ui";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/marcas", label: "Marcas y trabajos", icon: Briefcase },
  { href: "/admin/contenido", label: "Contenido del sitio", icon: FileText },
  { href: "/admin/testimonios", label: "Testimonios", icon: MessageSquareQuote },
  { href: "/admin/configuracion", label: "Configuración", icon: Settings }
];

export function AdminShell({ user, children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  async function logout() {
    setLeaving(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } finally {
      router.replace("/admin/login");
      router.refresh();
    }
  }

  const isActive = (item) => (item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`));

  const nav = (
    <nav aria-label="Panel" className="flex flex-1 flex-col">
      <ul className="grid gap-1">
        {NAV.map((item) => {
          const active = isActive(item);
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-semibold transition-colors",
                  active ? "bg-periwinkle text-tinta" : "text-crema/80 hover:bg-crema/10 hover:text-crema"
                )}
              >
                <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={2} aria-hidden="true" />
                <span className="flex-1">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="mt-auto grid gap-1 border-t border-crema/15 pt-4">
        <a href="/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-semibold text-crema/80 hover:bg-crema/10 hover:text-crema">
          <ExternalLink className="h-[18px] w-[18px]" aria-hidden="true" /> Ver sitio
        </a>
        <button
          type="button"
          onClick={logout}
          disabled={leaving}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[14px] font-semibold text-crema/80 hover:bg-crema/10 hover:text-crema disabled:opacity-50"
        >
          <LogOut className="h-[18px] w-[18px]" aria-hidden="true" /> {leaving ? "Saliendo…" : "Cerrar sesión"}
        </button>
        <p className="truncate px-3 pt-2 text-[12px] text-crema/50" title={user.email}>
          {user.name !== user.email ? `${user.name} · ` : ""}
          {user.email}
        </p>
      </div>
    </nav>
  );

  const brand = (
    <Link href="/admin" className="flex items-center gap-3" aria-label="Panel de CoFi, ir al dashboard">
      <span className="relative block h-9 w-12">
        <Image src="/brand/cofi-crema.png" alt="" fill sizes="48px" className="object-contain" unoptimized />
      </span>
      <span className="mono-label text-lemon">Panel</span>
    </Link>
  );

  return (
    <AdminProviders>
      <div className="min-h-screen bg-[#F4F2EC] lg:grid lg:grid-cols-[264px_1fr]">
        {/* Lateral (computadora) */}
        <aside className="sticky top-0 hidden h-screen flex-col gap-8 overflow-y-auto bg-cacao p-5 text-crema lg:flex">
          {brand}
          {nav}
        </aside>

        {/* Barra superior (celular / tablet) */}
        <div className="sticky top-0 z-40 flex h-16 items-center justify-between bg-cacao px-4 text-crema lg:hidden">
          {brand}
          <button type="button" onClick={() => setOpen(true)} className="relative grid h-10 w-10 place-items-center rounded-full hover:bg-crema/10" aria-label="Abrir menú" aria-expanded={open}>
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        {open ? (
          <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Menú del panel">
            <button type="button" className="absolute inset-0 bg-tinta/50" onClick={() => setOpen(false)} aria-label="Cerrar menú" />
            <div className="absolute inset-y-0 left-0 flex w-[82%] max-w-xs animate-fade-in flex-col gap-8 overflow-y-auto bg-cacao p-5 text-crema">
              <div className="flex items-center justify-between">
                {brand}
                <button type="button" onClick={() => setOpen(false)} className="grid h-10 w-10 place-items-center rounded-full hover:bg-crema/10" aria-label="Cerrar menú">
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
              {nav}
            </div>
          </div>
        ) : null}

        <main id="panel" className="min-w-0 px-4 pb-10 pt-6 sm:px-8 sm:pt-8 lg:pt-10">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </AdminProviders>
  );
}
