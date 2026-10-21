import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { clientsPage } from "@/config/content";
import { getPublicProjects } from "@/lib/server/content";
import { SectionLabel, Shape, toneClass } from "@/components/site/Brand";
import { Reveal } from "@/components/site/Reveal";
import { cn } from "@/lib/utils";

export const revalidate = 60;

export const metadata = {
  title: "Clientes",
  description: "Algunos de los proyectos en los que trabajamos: estrategia, redes y contenido para cada marca."
};

const tones = ["periwinkle", "lemon", "cantaloupe"];

export default async function ClientsPage() {
  const projects = await getPublicProjects();

  return (
    <>
      <section className="relative overflow-hidden bg-lemon">
        <Shape type="sello" color="watermelon" spin className="absolute -right-14 -top-14 h-48 w-48 sm:h-64 sm:w-64" />
        <div className="container-site relative pb-16 pt-12 lg:pb-20 lg:pt-20">
          <SectionLabel tone="tinta">Casos</SectionLabel>
          <h1 className="title-pop mt-4 animate-fade-in-up text-[56px] sm:text-[88px]">{clientsPage.title}</h1>
          <p className="mt-6 max-w-[38rem] animate-fade-in-up font-display text-[20px] font-bold [animation-delay:80ms] sm:text-[24px]">{clientsPage.lead}</p>
          <p className="mt-3 max-w-[40rem] animate-fade-in-up text-[17px] leading-relaxed [animation-delay:140ms]">{clientsPage.intro}</p>
        </div>
      </section>

      <section className="container-site py-16 lg:py-24">
        <div className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <Reveal key={project.id} delay={(index % 3) * 90}>
              <Link href={`/clientes/${project.slug}`} className="group block">
                <span className={cn("relative block overflow-hidden p-3 transition-[padding] duration-500 group-hover:p-0", toneClass(tones[index % tones.length]))}>
                  <span className="relative block aspect-[4/5] overflow-hidden">
                    {project.coverUrl ? (
                      <Image
                        src={project.coverUrl}
                        alt={project.clientName}
                        fill
                        sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"
                        priority={index < 3}
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                      />
                    ) : null}
                  </span>
                </span>
                <span className="mt-5 flex items-start justify-between gap-4">
                  <span>
                    <span className="mono-label block text-watermelon">
                      {String(index + 1).padStart(2, "0")} {project.industry ? `· ${project.industry}` : ""}
                    </span>
                    <span className="mt-2 block font-display text-[28px] font-black leading-none">{project.clientName}</span>
                  </span>
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border-[1.5px] border-tinta transition-all duration-300 group-hover:rotate-45 group-hover:bg-tinta group-hover:text-crema">
                    <ArrowUpRight className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
                  </span>
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
