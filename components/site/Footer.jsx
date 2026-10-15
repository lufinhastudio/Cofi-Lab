import Image from "next/image";
import Link from "next/link";
import { site } from "@/config/site";
import { BackToTop } from "./BackToTop";
import { HandHeart, Squiggle } from "./Doodles";
import { TornEdge } from "./Stickers";
import { ArrowIcon, InstagramIcon } from "./icons";
import { Reveal } from "./Reveal";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-10 bg-night text-paper">
      <TornEdge className="absolute -top-5 left-0 text-night sm:-top-7" />
      {/* Cinta con lo que hacemos */}
      <div className="relative -rotate-1 overflow-hidden border-y border-paper/10 bg-bordo py-3.5 text-paper" aria-hidden="true">
        <div className="flex w-max animate-marquee gap-10 whitespace-nowrap font-hand text-[24px] leading-none">
          {[0, 1].map((copy) => (
            <span key={copy} className="flex items-center gap-10">
              {site.keywords.map((word) => (
                <span key={`${copy}-${word}`} className="flex items-center gap-10">
                  {word}
                  <span className="h-1.5 w-1.5 rounded-full bg-paper/50" />
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      <div className="container-site relative overflow-hidden pb-10 pt-20 lg:pt-28">
        {/* Llamado principal */}
        <Reveal className="grid items-end gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <p className="font-hand text-[26px] text-[#E3A7AE]">¿Tenés una idea dando vueltas?</p>
            <h2 className="mt-3 font-display text-[40px] font-light leading-[1.05] text-paper sm:text-[60px] lg:text-[72px]">
              Probémosla
              <span className="relative inline-block">
                <span className="relative z-10">&nbsp;juntas.</span>
                <Squiggle className="absolute -bottom-2 left-4 h-4 w-[90%] text-[#E3A7AE]" />
              </span>
            </h2>
          </div>
          <div className="flex flex-col items-start gap-6 lg:items-end">
            <Link
              href="/contacto"
              className="group relative inline-flex items-center gap-5 overflow-hidden rounded-full border border-paper/30 py-4 pl-8 pr-4 font-display text-[12px] uppercase tracking-label text-paper transition-colors duration-500 hover:border-paper hover:text-night"
            >
              <span className="absolute inset-0 translate-y-full rounded-full bg-paper transition-transform duration-500 ease-out group-hover:translate-y-0" aria-hidden="true" />
              <span className="relative">Escribinos</span>
              <span className="relative grid h-10 w-10 place-items-center rounded-full bg-paper text-night transition-all duration-500 group-hover:rotate-[-35deg] group-hover:bg-night group-hover:text-paper">
                <ArrowIcon className="h-2.5 w-5" />
              </span>
            </Link>
          </div>
        </Reveal>

        <div className="mt-20 h-px bg-paper/10" />

        {/* Columnas */}
        <div className="mt-14 grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <span className="relative block h-14 w-24">
              <Image src={site.logo} alt={site.name} fill sizes="96px" className="object-contain object-left invert" unoptimized />
            </span>
            <p className="mt-5 max-w-[16rem] text-[14px] leading-relaxed text-paper/60">
              {site.fullName}. {site.motto}
            </p>
            <p className="mt-6 font-hand text-[20px] text-[#E3A7AE]">Próximamente: La CoFiteca</p>
          </div>

          <nav aria-label="Pie de página">
            <p className="font-display text-[10px] uppercase tracking-label text-paper/40">Navegación</p>
            <ul className="mt-5 space-y-2.5">
              {site.nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="group inline-flex items-center gap-0 text-[15px] text-paper/80 transition-all duration-300 hover:gap-2 hover:text-paper">
                    <span className="h-px w-0 bg-[#E3A7AE] transition-all duration-300 group-hover:w-4" aria-hidden="true" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="font-display text-[10px] uppercase tracking-label text-paper/40">Seguinos</p>
            <a
              href={site.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-5 inline-flex items-center gap-3 text-[15px] text-paper/80 transition-colors hover:text-paper"
            >
              <span className="grid h-9 w-9 place-items-center rounded-full border border-paper/20 transition-all duration-300 group-hover:border-paper group-hover:bg-paper group-hover:text-night">
                <InstagramIcon className="h-4 w-4" />
              </span>
              {site.instagram.handle}
            </a>
            <ul className="mt-4 space-y-1.5 text-[13px] text-paper/50">
              {site.team.map((member) => (
                <li key={member.handle}>
                  <a href={member.url} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-paper">
                    {member.name} · {member.handle}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-display text-[10px] uppercase tracking-label text-paper/40">Contacto</p>
            <ul className="mt-5 space-y-2.5 text-[15px] text-paper/80">
              <li>
                <Link href="/contacto" className="transition-colors hover:text-paper">
                  Contanos tu idea
                </Link>
              </li>
              {site.contact.email ? (
                <li>
                  <a href={`mailto:${site.contact.email}`} className="transition-colors hover:text-paper">
                    {site.contact.email}
                  </a>
                </li>
              ) : null}
              {site.contact.whatsapp ? (
                <li>
                  <a href={`https://wa.me/${site.contact.whatsapp}`} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-paper">
                    WhatsApp
                  </a>
                </li>
              ) : null}
            </ul>
          </div>
        </div>

        {/* Barra inferior */}
        <div className="mt-20 flex flex-wrap items-center justify-between gap-6 text-[12px] text-paper/45">
          <p className="flex items-center gap-2">
            © {year} {site.name} · Hecho con
            <HandHeart draw={false} className="h-4 w-4 text-rojo" />
            y mate
          </p>
          <BackToTop />
        </div>
      </div>

      {/* Logo gigante de fondo */}
      <div className="pointer-events-none relative -mb-[6vw] select-none opacity-[0.07]" aria-hidden="true">
        <span className="relative mx-auto block h-[26vw] w-[70vw]">
          <Image src={site.logo} alt="" fill sizes="70vw" className="object-contain object-bottom invert" unoptimized />
        </span>
      </div>
    </footer>
  );
}
