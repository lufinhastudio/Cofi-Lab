import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Instagram, Play } from "lucide-react";
import { Emphasis } from "@/lib/emphasis";
import { getPublicProject, getPublicProjects } from "@/lib/server/content";
import { SectionLabel, Shape, StageTag } from "@/components/site/Brand";
import { Gallery } from "@/components/site/Gallery";
import { InstagramBlock } from "@/components/site/InstagramBlock";
import { Reveal } from "@/components/site/Reveal";
import { VideoCard } from "@/components/site/VideoCard";

export const revalidate = 60;

export async function generateStaticParams() {
  const projects = await getPublicProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const result = await getPublicProject(slug);
  if (!result) return {};
  const { project } = result;
  const description = project.summary.replace(/\*+/g, "").split("\n")[0].slice(0, 160);
  return {
    title: project.clientName,
    description,
    openGraph: { title: `${project.clientName} · CoFi`, description, images: project.coverUrl ? [project.coverUrl] : [] }
  };
}

export default async function ProjectPage({ params }) {
  const { slug } = await params;
  const result = await getPublicProject(slug);
  if (!result) notFound();
  const { project, previous, next } = result;

  const [lead, ...rest] = project.summary.split(/\n{2,}/).filter(Boolean);
  const videos = project.sections.filter((section) => section.kind === "video");
  const galleries = project.sections.filter((section) => section.kind !== "video");
  const photos = galleries.flatMap((section) => section.media).filter((item) => item?.url);
  const brands = galleries.filter((section) => section.title);

  const stats = [
    photos.length ? { value: photos.length, label: "Fotos" } : null,
    videos.length ? { value: videos.length, label: videos.length === 1 ? "Reel" : "Reels" } : null,
    brands.length ? { value: brands.length, label: "Marcas" } : null
  ].filter(Boolean);

  return (
    <article>
      {/* ── Primer pantallazo: post de caso del manual ────────────────── */}
      <header className="grid lg:grid-cols-[1.05fr_1fr]">
        <div className="relative flex flex-col overflow-hidden bg-lemon px-5 pb-12 pt-8 sm:px-10 lg:px-14 lg:pb-16 lg:pt-12">
          <Link href="/clientes" className="mono-label inline-flex items-center gap-2 self-start transition-opacity hover:opacity-60">
            <ArrowLeft className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
            Clientes
          </Link>

          <p className="mono-label mt-10 animate-fade-in-up uppercase">Caso / {project.clientName}</p>
          <h1 className="title-pop mt-3 animate-fade-in-up text-[60px] [animation-delay:60ms] sm:text-[88px] lg:text-[104px]">{project.clientName}</h1>
          {project.industry ? (
            <StageTag tone="cacao" className="mt-5 animate-fade-in-up self-start [animation-delay:120ms]">
              {project.industry}
            </StageTag>
          ) : null}

          {lead ? (
            <p className="mt-8 max-w-[34rem] animate-fade-in-up text-[18px] leading-relaxed [animation-delay:180ms]">
              <Emphasis text={lead} />
            </p>
          ) : null}

          <div className="mt-auto pt-10">
            {stats.length ? (
              <dl className="flex flex-wrap gap-x-10 gap-y-4 border-t-[1.5px] border-tinta pt-6">
                {stats.map((stat) => (
                  <div key={stat.label}>
                    <dt className="mono-label uppercase">{stat.label}</dt>
                    <dd className="title-pop mt-1 text-[44px]">{stat.value}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
            <div className="mt-8 flex flex-wrap gap-3">
              {videos.length ? (
                <a href="#reels" className="btn-cacao">
                  <Play className="h-4 w-4" strokeWidth={2} fill="currentColor" aria-hidden="true" />
                  Ver reels
                </a>
              ) : null}
              {project.instagramUrl ? (
                <a href={project.instagramUrl} target="_blank" rel="noopener noreferrer" className="btn-outline">
                  <Instagram className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
                  Su Instagram
                </a>
              ) : null}
            </div>
          </div>
        </div>

        <div className="relative min-h-[420px] overflow-hidden bg-cantaloupe sm:min-h-[560px]">
          {project.coverUrl ? (
            <Image src={project.coverUrl} alt={project.clientName} fill priority sizes="(min-width: 1024px) 48vw, 100vw" className="animate-fade-in object-cover" />
          ) : null}
          <Shape type="flor" color="watermelon" className="absolute -bottom-10 -right-10 h-36 w-36 sm:h-44 sm:w-44" />
        </div>
      </header>

      {/* ── Reels · capa Laboratorio ──────────────────────────────────── */}
      {videos.length ? (
        <section id="reels" className="bg-lab-grid scroll-mt-20 py-16 text-crema lg:py-24">
          <div className="container-site">
            <Reveal className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <SectionLabel number="01" tone="lemon">
                  Reels
                </SectionLabel>
                <h2 className="title-pop mt-3 text-[36px] text-crema sm:text-[52px]">{project.videosHeading || "Reels destacados"}</h2>
              </div>
              <p className="mono-label text-crema/70">Se abren en Instagram ↗</p>
            </Reveal>
            <div className="-mx-5 mt-10 flex snap-x snap-mandatory scroll-pl-5 gap-4 overflow-x-auto px-5 pb-4 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-6 sm:overflow-visible sm:px-0 sm:pb-0">
              {videos.map((video, index) => (
                <Reveal key={video.id} delay={index * 90} className="w-[72%] shrink-0 snap-start sm:w-auto">
                  <VideoCard title={video.title} url={video.linkUrl} image={video.media[0]?.url} index={index} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* ── Cómo lo acompañamos ───────────────────────────────────────── */}
      {rest.length ? (
        <section className="container-site py-16 lg:py-24">
          <Reveal className="grid gap-6 lg:grid-cols-[1fr_2fr] lg:gap-16">
            <SectionLabel number="02">El trabajo</SectionLabel>
            <div className="space-y-4 font-display text-[22px] font-medium leading-snug sm:text-[28px]">
              {rest.map((paragraph) => (
                <p key={paragraph}>
                  <Emphasis text={paragraph} />
                </p>
              ))}
            </div>
          </Reveal>
        </section>
      ) : null}

      {/* ── Galerías ──────────────────────────────────────────────────── */}
      <div className="container-site space-y-16 pb-8 lg:space-y-24">
        {galleries.map((section, index) => (
          <Reveal as="section" key={section.id}>
            {section.title ? (
              <div className="mb-8 grid gap-3 border-t-[1.5px] border-tinta pt-6 lg:grid-cols-[1fr_2fr] lg:gap-16">
                <h2 className="title-pop text-[32px] sm:text-[44px]">{section.title}</h2>
                {section.description ? (
                  <p className="max-w-[40rem] text-[17px] leading-relaxed">
                    <Emphasis text={section.description} />
                  </p>
                ) : null}
              </div>
            ) : index === 0 ? (
              <SectionLabel number="03" className="mb-6">
                Galería
              </SectionLabel>
            ) : null}
            <Gallery
              media={section.media}
              layout={section.layout}
              alt={`${project.clientName}${section.title ? ` · ${section.title}` : ""}`}
              description={
                !section.title && section.description ? (
                  <p className="font-display text-[22px] font-bold leading-snug">
                    <Emphasis text={section.description.replace(/\*\*/g, "")} />
                  </p>
                ) : null
              }
            />
          </Reveal>
        ))}

        {project.instagramUrl ? (
          <Reveal>
            <InstagramBlock url={project.instagramUrl} label={project.instagramLabel} image={project.instagramImageUrl} />
          </Reveal>
        ) : null}
      </div>

      {/* ── Otros clientes ────────────────────────────────────────────── */}
      <nav aria-label="Otros clientes" className="mt-16 grid grid-cols-2">
        {[previous, next].map((item, itemIndex) =>
          item && item.slug !== project.slug ? (
            <Link
              key={`${item.slug}-${itemIndex}`}
              href={`/clientes/${item.slug}`}
              className={`group flex items-center gap-4 px-5 py-8 transition-colors sm:px-10 sm:py-10 ${
                itemIndex === 0 ? "bg-periwinkle" : "justify-end bg-cantaloupe text-right"
              }`}
            >
              {itemIndex === 0 ? <ArrowLeft className="h-6 w-6 shrink-0 transition-transform group-hover:-translate-x-1" strokeWidth={2} /> : null}
              <span>
                <span className="mono-label block">{itemIndex === 0 ? "Anterior" : "Siguiente"}</span>
                <span className="title-pop mt-1 block text-[24px] sm:text-[36px]">{item.clientName}</span>
              </span>
              {itemIndex === 1 ? <ArrowRight className="h-6 w-6 shrink-0 transition-transform group-hover:translate-x-1" strokeWidth={2} /> : null}
            </Link>
          ) : (
            <span key={itemIndex} />
          )
        )}
      </nav>
    </article>
  );
}
