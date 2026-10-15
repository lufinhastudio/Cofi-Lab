"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { site } from "@/config/site";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (!open) return undefined;
    const onKey = (event) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const isActive = (href) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-[background-color,box-shadow] duration-300",
        scrolled ? "bg-paper/90 shadow-[0_1px_0_rgb(0_0_0/0.05)] backdrop-blur-md" : "bg-paper"
      )}
    >
      <div className={cn("container-site flex items-center justify-between transition-[height] duration-300", scrolled ? "h-16" : "h-20 lg:h-24")}>
        <Link href="/" aria-label={`${site.name}, ir al inicio`} className="group relative block h-10 w-16 shrink-0 lg:h-12 lg:w-20">
          <Image src={site.logo} alt={site.name} fill priority sizes="80px" className="object-contain object-left transition-transform group-hover:animate-wiggle" unoptimized />
        </Link>

        <nav aria-label="Principal" className="hidden md:block">
          <ul className="flex items-center gap-8 font-display text-[13px] font-light text-heading">
            {site.nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} aria-current={isActive(item.href) ? "page" : undefined} className="link-underline pb-0.5 transition-colors hover:text-bordo aria-[current=page]:text-bordo">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="-mr-2 grid h-10 w-10 place-items-center md:hidden"
          aria-label="Abrir menú"
          aria-expanded={open}
          aria-controls="menu-movil"
        >
          <span className="flex w-6 flex-col gap-1.5" aria-hidden="true">
            <span className="h-px w-full bg-heading" />
            <span className="h-px w-full bg-heading" />
            <span className="h-px w-4 bg-heading" />
          </span>
        </button>
      </div>

      {open ? (
        <div id="menu-movil" role="dialog" aria-modal="true" aria-label="Menú" className="fixed inset-0 z-50 flex animate-fade-in flex-col bg-paper md:hidden">
          <div className="container-site flex h-20 items-center justify-between">
            <span className="relative block h-10 w-16">
              <Image src={site.logo} alt="" fill sizes="64px" className="object-contain object-left" unoptimized />
            </span>
            <button type="button" onClick={() => setOpen(false)} className="-mr-2 grid h-10 w-10 place-items-center" aria-label="Cerrar menú">
              <span className="relative block h-5 w-5" aria-hidden="true">
                <span className="absolute left-0 top-1/2 h-px w-full rotate-45 bg-heading" />
                <span className="absolute left-0 top-1/2 h-px w-full -rotate-45 bg-heading" />
              </span>
            </button>
          </div>
          <nav aria-label="Principal" className="container-site flex flex-1 flex-col justify-center pb-24">
            <ul className="grid gap-6">
              {site.nav.map((item, index) => (
                <li key={item.href} className="animate-fade-in-up" style={{ animationDelay: `${80 + index * 60}ms` }}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={cn("font-display text-3xl font-light text-heading", isActive(item.href) && "font-normal")}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <a href={site.instagram.url} target="_blank" rel="noopener noreferrer" className="label mt-14">
              {site.instagram.handle}
            </a>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
