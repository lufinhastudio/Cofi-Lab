import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { differentiators, home, positioning, services } from "@/config/content";
import { site } from "@/config/site";
import { Paragraphs } from "@/lib/emphasis";
import { legacyImage } from "@/lib/legacy";
import { getPublicProjects, getPublicTestimonials } from "@/lib/server/content";
import { SectionLabel, Shape, StageTag, toneClass } from "@/components/site/Brand";
import { Reveal } from "@/components/site/Reveal";
import { ServiceIcon } from "@/components/site/ServiceIcon";
import { Testimonials } from "@/components/site/Testimonials";
import { cn } from "@/lib/utils";

export const revalidate = 60;

export default async function HomePage() {
  const [testimonials, projects] = await Promise.all([getPublicTestimonials(), getPublicProjects()]);

  return (
    <>
      {/* ── Hero · capa Pop ───────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-periwinkle">
        <Shape type="chispa" color="watermelon" className="absolute -right-10 top-6 h-40 w-40 sm:right-[6%] sm:top-10 sm:h-56 sm:w-56 lg:h-72 lg:w-72" />
        <div className="container-site relative pb-20 pt-10 sm:pt-14 lg:pb-28 lg:pt-20">
          <p className="flex animate-fade-in-up items-center gap-3 font-mono text-[13px]">
            <span className="h-2.5 w-2.5 animate-blink rounded-full bg-watermelon" aria-hidden="true" />
            {site.instagram.handle} · {home.label}
          </p>
          <h1 className="title-pop mt-6 max-w-[15ch] animate-fade-in-up text-[52px] [animation-delay:80ms] sm:text-[84px] lg:text-[112px]">
            Ideas que se prueban. Marcas que se construyen.
          </h1>
          <p className="mt-8 max-w-[36rem] animate-fade-in-up text-[17px] leading-relaxed [animation-delay:160ms] sm:text-[19px]">{site.pitch}</p>
          <div className="mt-10 flex animate-fade-in-up flex-wrap gap-3 [animation-delay:240ms]">
            <Link href="/contacto" className="btn-cacao">
              Contanos tu idea
            </Link>
            <Link href="/clientes" className="btn-outline">
              Ver clientes
            </Link>
          </div>
        </div>

        {/* Franja de bloques de color */}
        <nav aria-label="Qué hacemos" className="relative grid grid-cols-2 sm:grid-cols-4">
          {home.strip.map((block) => (
            <Link
              key={block.label}
              href={block.href}
              className={cn(
                "group flex items-center justify-between px-5 py-5 font-display text-[16px] font-bold transition-[padding] duration-300 hover:pb-8 sm:px-8 sm:py-6",
                toneClass(block.tone)
              )}
            >
              {block.label}
              <ArrowUpRight className="h-5 w-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" strokeWidth={2} aria-hidden="true" />
            </Link>
          ))}
        </nav>
      </section>

      {/* ── Qué hacemos ───────────────────────────────────────────────── */}
      <section className="container-site py-20 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <Reveal>
            <SectionLabel number="01">Laboratorio creativo</SectionLabel>
            <h2 className="title-pop mt-3 text-[40px] sm:text-[56px]">Un equipo cercano que se suma al tuyo.</h2>
          </Reveal>
          <Reveal delay={100} className="space-y-4 text-[17px] leading-relaxed">
            <Paragraphs text={home.intro} />
          </Reveal>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {home.photos.map((photo, index) => (
            <Reveal key={photo.src} delay={index * 90} className="group relative aspect-[4/5] overflow-hidden bg-arena">
              <Image
                src={legacyImage(photo.src)}
                alt={photo.alt}
                fill
                sizes="(min-width: 1024px) 25vw, 50vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Servicios ─────────────────────────────────────────────────── */}
      <section id="servicios" aria-labelledby="servicios-titulo" className="scroll-mt-20 bg-arena py-20 lg:py-28">
        <div className="container-site">
          <Reveal className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <SectionLabel number="02">Servicios</SectionLabel>
              <h2 id="servicios-titulo" className="title-pop mt-3 text-[40px] sm:text-[56px]">
                Lo que hacemos
              </h2>
            </div>
            <p className="max-w-[26rem] text-[17px]">Estrategia, creatividad y producción audiovisual en un mismo equipo.</p>
          </Reveal>

          <ul className="mt-12 border-t-[1.5px] border-tinta">
            {services.map((service, index) => (
              <Reveal as="li" key={service.number} delay={index * 60} className="group border-b-[1.5px] border-tinta">
                <div className="relative grid gap-4 overflow-hidden py-7 sm:grid-cols-[4rem_1fr] lg:grid-cols-[4rem_1.1fr_1fr_3rem] lg:items-start lg:gap-8 lg:py-9">
                  {/* Bloque de color que entra al pasar el mouse */}
                  <span
                    className={cn(
                      "absolute inset-0 -z-0 origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100",
                      toneClass(service.tone)
                    )}
                    aria-hidden="true"
                  />
                  <span className="relative font-mono text-[15px] text-watermelon transition-colors group-hover:text-tinta lg:pl-2">{service.number}</span>
                  <div className="relative">
                    <h3 className="font-display text-[26px] font-bold leading-tight sm:text-[32px]">{service.title}</h3>
                    <p className="mt-2 text-[17px]">{service.lead}</p>
                  </div>
                  <ul className="relative space-y-1.5 text-[15px] sm:col-start-2 lg:col-start-auto">
                    {service.items.map((item) => (
                      <li key={item} className="flex gap-2.5">
                        <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-tinta" aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <ServiceIcon name={service.icon} className="relative hidden h-8 w-8 lg:block" />
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Posicionamiento · capa Laboratorio ────────────────────────── */}
      <section className="bg-lab-grid relative overflow-hidden py-20 text-crema lg:py-28">
        <Shape type="flor" color="cantaloupe" className="absolute -bottom-20 -left-20 h-56 w-56" />
        <div className="container-site relative">
          <Reveal>
            <SectionLabel number="03" tone="lemon">
              Por qué CoFi
            </SectionLabel>
            <p className="title-pop mt-5 max-w-[22ch] text-[32px] leading-[1.08] text-crema sm:text-[44px] lg:text-[52px]">{positioning.text}</p>
            <div className="mt-8 flex flex-wrap gap-2">
              {positioning.tags.map((tag) => (
                <StageTag key={tag.label} tone={tag.tone}>
                  {tag.label}
                </StageTag>
              ))}
            </div>
          </Reveal>

          <div className="mt-16 grid gap-px bg-crema/15 sm:grid-cols-2 lg:grid-cols-4">
            {differentiators.map((item, index) => (
              <Reveal key={item.number} delay={index * 90} className="bg-cacao p-7 transition-colors duration-300 hover:bg-[#665a50]">
                <p className="font-mono text-[14px] text-watermelon">{item.number}</p>
                <h3 className="mt-4 font-display text-[22px] font-bold text-crema">{item.title}</h3>
                <p className="mt-2 text-[15px] text-crema/75">{item.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Un año en números ─────────────────────────────────────────── */}
      <section className="container-site py-20 lg:py-28">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <SectionLabel number="04">Primer aniversario</SectionLabel>
            <h2 className="title-pop mt-3 text-[40px] sm:text-[56px]">1 año haciendo lo que nos gusta.</h2>
          </div>
        </Reveal>
        <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {home.stats.map((stat, index) => (
            <Reveal
              key={stat.label}
              delay={index * 90}
              className={cn(
                "flex min-h-[200px] flex-col justify-between p-6 transition-transform duration-300 hover:-translate-y-1 sm:min-h-[240px] sm:p-7",
                toneClass(stat.tone),
                stat.tone === "crema" && "border-[1.5px] border-tinta"
              )}
            >
              <p className="mono-label uppercase">{stat.label}</p>
              <div>
                <p className="title-pop text-[44px] sm:text-[60px]">{stat.value}</p>
                <p className="mt-2 text-[14px] sm:text-[15px]">{stat.note}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Clientes (adelanto) ───────────────────────────────────────── */}
      <section className="bg-crema pb-4">
        <div className="container-site">
          <Reveal className="flex flex-wrap items-end justify-between gap-6 border-t-[1.5px] border-tinta pt-10">
            <div>
              <SectionLabel>Clientes</SectionLabel>
              <h2 className="title-pop mt-3 text-[32px] sm:text-[44px]">Marcas que nos dejaron ser parte.</h2>
            </div>
            <Link href="/clientes" className="btn-outline">
              Ver todos los casos
            </Link>
          </Reveal>
          <div className="-mx-5 mt-10 flex snap-x snap-mandatory scroll-pl-5 gap-4 overflow-x-auto px-5 pb-6 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 lg:grid-cols-6">
            {projects.map((project, index) => (
              <Link key={project.id} href={`/clientes/${project.slug}`} className="group w-[44%] shrink-0 snap-start sm:w-auto">
                <span className="relative block aspect-[3/4] overflow-hidden bg-arena">
                  {project.coverUrl ? (
                    <Image src={project.coverUrl} alt={project.clientName} fill sizes="(min-width: 1024px) 16vw, 45vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  ) : null}
                  <span
                    className={cn(
                      "absolute inset-x-0 bottom-0 translate-y-full px-3 py-2 font-mono text-[12px] uppercase transition-transform duration-300 group-hover:translate-y-0",
                      toneClass(["lemon", "periwinkle", "cantaloupe"][index % 3])
                    )}
                  >
                    Ver caso →
                  </span>
                </span>
                <span className="mt-3 block font-display text-[16px] font-bold">{project.clientName}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonios ───────────────────────────────────────────────── */}
      {testimonials.length ? <Testimonials items={testimonials} /> : null}

      {/* ── Llamado final ─────────────────────────────────────────────── */}
      <section className="relative grid overflow-hidden md:grid-cols-[1.6fr_1fr]">
        <div className="bg-periwinkle px-5 py-16 sm:px-12 lg:px-16 lg:py-24">
          <Reveal>
            <h2 className="title-pop max-w-[14ch] text-[40px] sm:text-[60px]">Para comunicar, no solo para publicar.</h2>
            <Link href="/contacto" className="btn-cacao mt-10">
              Contanos tu idea
            </Link>
          </Reveal>
        </div>
        <div className="relative grid min-h-[220px] place-items-center bg-lemon">
          <Shape type="flor" color="watermelon" spin className="h-40 w-40 sm:h-52 sm:w-52" />
        </div>
      </section>
    </>
  );
}
