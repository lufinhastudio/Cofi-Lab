import Image from "next/image";
import Link from "next/link";
import { about } from "@/config/content";
import { site } from "@/config/site";
import { Paragraphs } from "@/lib/emphasis";
import { legacyImage } from "@/lib/legacy";
import { SectionLabel, Shape, toneClass } from "@/components/site/Brand";
import { Reveal } from "@/components/site/Reveal";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Nosotras",
  description: "CoFi surge del encuentro entre estrategia y creatividad. Conocé a Sofi, Cami, Coca y Firu."
};

export default function AboutPage() {
  return (
    <>
      {/* Intro */}
      <section className="relative overflow-hidden bg-crema">
        <Shape type="trebol" color="periwinkle" className="absolute -right-16 top-10 h-44 w-44 sm:h-64 sm:w-64" />
        <div className="container-site relative grid gap-10 pb-16 pt-12 lg:grid-cols-[1fr_1fr] lg:gap-20 lg:pb-24 lg:pt-20">
          <div>
            <SectionLabel>Nosotras</SectionLabel>
            <h1 className="title-pop mt-4 animate-fade-in-up text-[52px] sm:text-[80px]">{about.title}</h1>
          </div>
          <div className="animate-fade-in-up space-y-4 self-end text-[17px] leading-relaxed [animation-delay:120ms]">
            <Paragraphs text={about.intro} />
          </div>
        </div>
      </section>

      {/* Equipo: bloques de color como en el manual */}
      <section className="container-site pb-20 lg:pb-28">
        <div className="grid gap-4 lg:grid-cols-2">
          {about.team.slice(0, 2).map((member, index) => (
            <Reveal key={member.name} delay={index * 100} className={cn("grid overflow-hidden sm:grid-cols-[0.9fr_1.1fr]", toneClass(member.tone))}>
              <div className="relative aspect-[4/5] sm:aspect-auto sm:min-h-[420px]">
                <Image src={legacyImage(member.image)} alt={member.name} fill sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 100vw" className="object-cover" />
              </div>
              <div className="flex flex-col p-7 sm:p-8">
                <h2 className="title-pop text-[40px]">{member.name}</h2>
                <p className="mt-2 font-display text-[18px] font-bold leading-snug">{member.role}</p>
                <div className="mt-6 space-y-3 text-[15px] leading-relaxed">
                  {member.bio.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Coca y Firu */}
        {about.team[2] ? (
          <Reveal className="mt-4 grid overflow-hidden bg-cacao text-crema sm:grid-cols-[1fr_1.4fr]">
            <div className="relative aspect-[4/3] sm:aspect-auto sm:min-h-[300px]">
              <Image src={legacyImage(about.team[2].image)} alt={about.team[2].name} fill sizes="(min-width: 640px) 40vw, 100vw" className="object-cover" />
            </div>
            <div className="relative flex flex-col justify-center overflow-hidden p-8 sm:p-12">
              <Shape type="flor" color="watermelon" className="absolute -bottom-12 -right-12 h-40 w-40" />
              <p className="mono-label relative text-lemon">{about.team[2].label}</p>
              <h2 className="title-pop relative mt-3 text-[40px] text-crema sm:text-[52px]">{about.team[2].name}</h2>
              <p className="relative mt-4 max-w-[30rem] text-[18px] leading-relaxed text-crema/85">{about.team[2].role}</p>
            </div>
          </Reveal>
        ) : null}
      </section>

      {/* Esencia de marca */}
      <section className="bg-arena py-20 lg:py-28">
        <div className="container-site">
          <Reveal>
            <SectionLabel>Esencia</SectionLabel>
            <h2 className="title-pop mt-3 text-[40px] sm:text-[56px]">Lo que nos mueve</h2>
          </Reveal>
          <div className="mt-12 grid gap-10 md:grid-cols-3">
            {about.essence.map((item, index) => (
              <Reveal key={item.label} delay={index * 90} className="border-t-[1.5px] border-tinta pt-5">
                <p className="mono-label">{item.label}</p>
                <p className="mt-4 text-[19px] font-medium leading-snug">{item.text}</p>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-16">
            <p className="mono-label">Valores</p>
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
              {about.values.map((value) => (
                <span key={value.label} className={cn("px-5 py-5 font-display text-[18px] font-bold transition-transform duration-300 hover:-translate-y-1", toneClass(value.tone))}>
                  {value.label}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Llamado */}
      <section className="container-site flex flex-col items-start justify-between gap-8 py-20 sm:flex-row sm:items-end lg:py-24">
        <h2 className="title-pop max-w-[16ch] text-[40px] sm:text-[56px]">Creamos juntas, crecemos juntas.</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/contacto" className="btn-cacao">
            Contanos tu idea
          </Link>
          <a href={site.instagram.url} target="_blank" rel="noopener noreferrer" className="btn-outline">
            {site.instagram.handle}
          </a>
        </div>
      </section>
    </>
  );
}
