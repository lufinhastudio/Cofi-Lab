"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { site } from "@/config/site";
import { cn } from "@/lib/utils";
import { Logo } from "./Brand";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    document.body.style.overflow = "hidden";
    const onKey = (event) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  // En el inicio el header arranca sobre el periwinkle del hero, como en el manual.
  const onHero = pathname === "/" && !scrolled;
  const isActive = (href) => (href.startsWith("/#") ? false : pathname.startsWith(href));

  // Cierra el menú y, si el destino es la página actual, hace el scroll a mano:
  // Next no navega cuando la ruta no cambia, por eso el logo "no hacía nada"
  // y "Servicios" dejaba el menú abierto estando en el inicio.
  const handleNav = (event, href) => {
    setOpen(false);
    const [rawPath, hash] = href.split("#");
    const path = rawPath || "/";
    if (path !== pathname) return;
    event.preventDefault();
    document.body.style.overflow = "";
    requestAnimationFrame(() => {
      const target = hash ? document.getElementById(hash) : null;
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        window.history.replaceState(null, "", `${path}#${hash}`);
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
        if (window.location.hash) window.history.replaceState(null, "", path);
      }
    });
  };

  // El menú se monta directo en <body>. Antes vivía dentro del <header>, que al
  // scrollear tiene backdrop-blur: eso vuelve al header el contenedor de los
  // hijos "fixed", así que el menú quedaba recortado a la altura del header y
  // el resto se veía transparente encima de la página.
  const mobileMenu = (
    <div
      id="menu-movil"
      role="dialog"
      aria-modal="true"
      aria-label="Menú"
      className="fixed inset-0 z-50 flex animate-fade-in flex-col overflow-y-auto overscroll-contain bg-periwinkle md:hidden"
    >
      <div className="container-site flex h-20 shrink-0 items-center justify-between">
        <Link href="/" onClick={(event) => handleNav(event, "/")} aria-label="CoFi, ir al inicio" className="shrink-0">
          <Logo color="tinta" className="w-[92px]" alt="" />
        </Link>
        <button type="button" onClick={() => setOpen(false)} className="-mr-2 grid h-11 w-11 place-items-center" aria-label="Cerrar menú">
          <span className="relative block h-5 w-5" aria-hidden="true">
            <span className="absolute left-0 top-1/2 h-[2px] w-full rotate-45 rounded-full bg-tinta" />
            <span className="absolute left-0 top-1/2 h-[2px] w-full -rotate-45 rounded-full bg-tinta" />
          </span>
        </button>
      </div>
      <nav aria-label="Principal" className="container-site flex flex-1 flex-col justify-center pb-16">
        <ul className="grid gap-3">
          {site.nav.map((item, index) => (
            <li key={item.href} className="animate-fade-in-up" style={{ animationDelay: `${60 + index * 60}ms` }}>
              <Link href={item.href} onClick={(event) => handleNav(event, item.href)} className="title-pop text-[44px]">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <Link href="/contacto" onClick={(event) => handleNav(event, "/contacto")} className="btn-cacao mt-12 self-start">
          Contanos tu idea
        </Link>
        <a href={site.instagram.url} target="_blank" rel="noopener noreferrer" className="mono-label mt-8">
          {site.instagram.handle}
        </a>
      </nav>
    </div>
  );

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-[background-color,box-shadow] duration-300",
        onHero ? "bg-periwinkle" : "bg-crema/95 shadow-[0_1px_0_rgb(20_20_20/0.08)] backdrop-blur-md"
      )}
    >
      <div className={cn("container-site flex items-center justify-between transition-[height] duration-300", scrolled ? "h-16" : "h-20 lg:h-24")}>
        {/* Tamaño mínimo del logo: 80 px */}
        <Link href="/" onClick={(event) => handleNav(event, "/")} aria-label="CoFi, ir al inicio" className="shrink-0">
          <Logo color="tinta" priority className={cn("transition-[width] duration-300", scrolled ? "w-[84px]" : "w-[92px] lg:w-[104px]")} />
        </Link>

        <nav aria-label="Principal" className="hidden md:block">
          <ul className="flex items-center gap-8 font-display text-[15px] font-bold">
            {site.nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={(event) => handleNav(event, item.href)}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className="link-underline pb-1"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="-mr-2 grid h-11 w-11 place-items-center md:hidden"
          aria-label="Abrir menú"
          aria-expanded={open}
          aria-controls="menu-movil"
        >
          <span className="flex w-6 flex-col gap-[5px]" aria-hidden="true">
            <span className="h-[2px] w-full rounded-full bg-tinta" />
            <span className="h-[2px] w-full rounded-full bg-tinta" />
            <span className="h-[2px] w-4 rounded-full bg-tinta" />
          </span>
        </button>
      </div>

      {open && mounted ? createPortal(mobileMenu, document.body) : null}
    </header>
  );
}
