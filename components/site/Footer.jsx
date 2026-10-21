import Link from "next/link";
import { site } from "@/config/site";
import { BackToTop } from "./BackToTop";
import { Logo, SectionLabel, Shape, StageTag } from "./Brand";
import { InstagramIcon } from "./icons";
import { Reveal } from "./Reveal";

// Footer en la capa Laboratorio: cacao con retícula visible.
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-lab-grid relative overflow-hidden text-crema">
      <Shape type="chispa" color="lemon" className="absolute -right-16 -top-16 h-56 w-56 sm:h-72 sm:w-72" />

      <div className="container-site relative pb-10 pt-20 lg:pt-28">
        {/* Llamado principal */}
        <Reveal className="max-w-[52rem]">
          <SectionLabel tone="lemon">Contacto</SectionLabel>
          <h2 className="title-pop mt-4 text-[44px] text-crema sm:text-[64px] lg:text-[80px]">
            ¿Tenés un proyecto en mente?
          </h2>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/contacto" className="btn-watermelon">
              Contanos tu idea
            </Link>
            <a href={site.instagram.url} target="_blank" rel="noopener noreferrer" className="btn-outline-light">
              <InstagramIcon className="h-4 w-4" />
              {site.instagram.handle}
            </a>
          </div>
        </Reveal>

        <div className="mt-20 grid gap-12 border-t border-crema/15 pt-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo color="crema" className="w-[120px]" />
            <p className="mt-5 max-w-[17rem] text-[15px] leading-relaxed text-crema/75">{site.tagline}</p>
            <StageTag tone="lemon" className="mt-6">
              Próximamente: La CoFiteca
            </StageTag>
          </div>

          <nav aria-label="Pie de página">
            <p className="mono-label text-periwinkle">Navegación</p>
            <ul className="mt-5 space-y-2.5 text-[16px]">
              <li>
                <Link href="/" className="link-underline">
                  Inicio
                </Link>
              </li>
              {site.nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="link-underline">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="mono-label text-periwinkle">Seguinos</p>
            <ul className="mt-5 space-y-2.5 text-[16px]">
              <li>
                <a href={site.instagram.url} target="_blank" rel="noopener noreferrer" className="link-underline">
                  {site.instagram.handle}
                </a>
              </li>
              {site.team.map((member) => (
                <li key={member.handle} className="text-crema/70">
                  {member.name} ·{" "}
                  <a href={member.url} target="_blank" rel="noopener noreferrer" className="link-underline">
                    {member.handle}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mono-label text-periwinkle">Escribinos</p>
            <ul className="mt-5 space-y-2.5 text-[16px]">
              <li>
                <Link href="/contacto" className="link-underline">
                  Formulario de contacto
                </Link>
              </li>
              {site.contact.email ? (
                <li>
                  <a href={`mailto:${site.contact.email}`} className="link-underline">
                    {site.contact.email}
                  </a>
                </li>
              ) : null}
              {site.contact.whatsapp ? (
                <li>
                  <a href={`https://wa.me/${site.contact.whatsapp}`} target="_blank" rel="noopener noreferrer" className="link-underline">
                    WhatsApp
                  </a>
                </li>
              ) : null}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-between gap-6 border-t border-crema/15 pt-8">
          <p className="mono-label text-crema/60">
            © {year} CoFi · {site.descriptor}
          </p>
          <BackToTop />
        </div>
      </div>
    </footer>
  );
}
