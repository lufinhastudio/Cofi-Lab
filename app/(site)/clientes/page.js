import Image from "next/image";
import Link from "next/link";
import { clientsPage } from "@/config/content";
import { Paragraphs } from "@/lib/emphasis";
import { getPublicProjects } from "@/lib/server/content";
import { Reveal } from "@/components/site/Reveal";

export const revalidate = 60;

export const metadata = {
  title: "Clientes",
  description: "Algunos de los proyectos en los que trabajamos: estrategia, redes y contenido para cada marca."
};

export default async function ClientsPage() {
  const projects = await getPublicProjects();

  return (
    <section className="container-site pb-24 pt-10 lg:pb-32 lg:pt-16">
      <div className="mx-auto max-w-[46rem] text-center">
        <h1 className="animate-fade-in-up font-display text-[24px] font-normal sm:text-[30px]">{clientsPage.title}</h1>
        <div className="mt-6 animate-fade-in-up space-y-1 text-[14px] leading-[1.9] text-ink [animation-delay:120ms] sm:text-[15px]">
          <Paragraphs text={clientsPage.intro} />
        </div>
      </div>

      <div className="mx-auto mt-14 grid max-w-[62rem] gap-x-8 gap-y-14 sm:grid-cols-2 lg:mt-20 lg:grid-cols-3">
        {projects.map((project, index) => (
          <Reveal key={project.id} delay={(index % 3) * 90}>
            <Link href={`/clientes/${project.slug}`} className="group block text-center">
              <span className="relative block aspect-[3/4] overflow-hidden bg-sand">
                {project.coverUrl ? (
                  <Image
                    src={project.coverUrl}
                    alt={project.clientName}
                    fill
                    sizes="(min-width: 1024px) 320px, (min-width: 640px) 45vw, 90vw"
                    priority={index < 3}
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                ) : null}
              </span>
              <span className="mt-6 block font-display text-[15px] font-normal uppercase tracking-label text-heading">{project.clientName}</span>
              <span className="label mt-2 inline-block transition-colors group-hover:text-heading">
                <span className="link-underline">Ver trabajo</span>
              </span>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
