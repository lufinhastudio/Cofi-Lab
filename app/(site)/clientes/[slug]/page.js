import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Emphasis } from "@/lib/emphasis";
import { getPublicProject, getPublicProjects } from "@/lib/server/content";
import { Gallery } from "@/components/site/Gallery";
import { InstagramBlock } from "@/components/site/InstagramBlock";
import { Reveal } from "@/components/site/Reveal";
import { VideoCard } from "@/components/site/VideoCard";
import { CurvedArrow, Sparkle, Squiggle } from "@/components/site/Doodles";
import { ArrowIcon, InstagramIcon, PlayIcon } from "@/components/site/icons";

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
    openGraph: { title: `${project.clientName} · CoFi Lab`, description, images: project.coverUrl ? [project.coverUrl] : [] }
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

  // Collage del primer pantallazo: portada + dos fotos de la galería
  const collage = [project.coverUrl, ...photos.map((item) => item.url)].filter(Boolean).filter((url, index, list) => list.indexOf(url) === index);

  const stats = [
    photos.length ? { value: photos.length, label: "fotos" } : null,
    videos.length ? { value: videos.length, label: videos.length === 1 ? "reel" : "reels" } : null,
    brands.length ? { value: brands.length, label: "marcas" } : null
  ].filter(Boolean);

  return (
    <article className="pb-10">
      {/* ── Primer pantallazo ─────────────────────────────────────────── */}
      <header className="container-site pb-16 pt-6 lg:pb-24 lg:pt-10">
        <div className="mx-auto grid max-w-[72rem] items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
          <div>
            <Link href="/clientes" className="label inline-flex items-center gap-3 transition-colors hover:text-heading">
              <ArrowIcon direction="left" className="h-2.5 w-8" />
              Clientes
            </Link>

            {project.industry ? (
              <p className="mt-8 flex animate-fade-in-up items-center gap-2 font-hand text-[24px] leading-none text-azul">
                {project.industry}
                <Sparkle className="doodle-draw is-drawn h-5 w-5" />
              </p>
            ) : null}

            <h1 className="relative mt-3 inline-block animate-fade-in-up font-display text-[46px] font-semibold uppercase leading-none tracking-[0.02em] [animation-delay:80ms] sm:text-[64px] lg:text-[76px]">
              {project.clientName}
              <Squiggle className="doodle-draw is-drawn absolute -bottom-4 left-0 h-4 w-[70%]" />
            </h1>

            {lead ? (
              <p className="mt-9 max-w-[34rem] animate-fade-in-up text-[17px] leading-[1.75] text-ink [animation-delay:160ms]">
                <Emphasis text={lead} />
              </p>
            ) : null}

            {/* Qué hicimos */}
            {project.services.length ? (
              <div className="mt-8 animate-fade-in-up [animation-delay:240ms]">
                <p className="label">Qué hicimos</p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {project.services.map((service, index) => (
                    <li
                      key={service}
                      className="animate-fade-in-up rounded-full border border-azul/25 bg-azul/[0.06] px-3.5 py-1.5 text-[13px] text-azul"
                      style={{ animationDelay: `${300 + index * 70}ms` }}
                    >
                      {service}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {/* Números rápidos + accesos */}
            <div className="mt-9 flex animate-fade-in-up flex-wrap items-center gap-x-8 gap-y-5 [animation-delay:380ms]">
              {stats.map((stat) => (
                <div key={stat.label} className="leading-none">
                  <span className="font-display text-[30px] font-light text-heading">{stat.value}</span>
                  <span className="ml-1.5 font-display text-[11px] uppercase tracking-label text-muted">{stat.label}</span>
                </div>
              ))}
              <span className="hidden h-8 w-px bg-line sm:block" aria-hidden="true" />
              <div className="flex flex-wrap gap-3">
                {videos.length ? (
                  <a
                    href="#reels"
                    className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-heading py-2.5 pl-2.5 pr-5 font-display text-[11px] uppercase tracking-label text-white"
                  >
                    <span className="absolute inset-0 -translate-x-full bg-azul transition-transform duration-500 ease-out group-hover:translate-x-0" aria-hidden="true" />
                    <span className="relative grid h-7 w-7 place-items-center rounded-full bg-white text-heading">
                      <PlayIcon className="ml-0.5 h-3.5 w-3.5" />
                    </span>
                    <span className="relative">Ver reels</span>
                  </a>
                ) : null}
                {project.instagramUrl ? (
                  <a
                    href={project.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-heading/20 px-4 py-2.5 font-display text-[11px] uppercase tracking-label text-heading transition-colors hover:border-heading"
                  >
                    <InstagramIcon className="h-3.5 w-3.5" />
                    Su Instagram
                  </a>
                ) : null}
              </div>
            </div>
          </div>

          {/* Collage */}
          <div className="relative mx-auto aspect-[4/5] w-full max-w-[30rem] lg:max-w-none">
            {collage[0] ? (
              <div className="absolute inset-y-0 left-[8%] right-[14%] animate-fade-in-up overflow-hidden rounded-[24px] shadow-[0_40px_80px_-40px_rgb(66_64_59/0.6)] [animation-delay:120ms]">
                <Image src={collage[0]} alt={project.clientName} fill priority sizes="(min-width: 1024px) 34vw, 80vw" className="object-cover" />
              </div>
            ) : null}
            {collage[1] ? (
              <div className="absolute -left-1 bottom-[8%] w-[38%] rotate-[-6deg] animate-fade-in-up bg-paper p-2 pb-6 shadow-[0_25px_45px_-20px_rgb(0_0_0/0.45)] transition-transform duration-500 [animation-delay:320ms] hover:rotate-[-2deg] sm:p-2.5 sm:pb-8">
                <span className="relative block aspect-[4/5] overflow-hidden">
                  <Image src={collage[1]} alt="" fill sizes="200px" className="object-cover" />
                </span>
              </div>
            ) : null}
            {collage[2] ? (
              <div className="absolute -right-1 top-[6%] w-[34%] rotate-[5deg] animate-fade-in-up bg-paper p-2 pb-6 shadow-[0_25px_45px_-20px_rgb(0_0_0/0.45)] transition-transform duration-500 [animation-delay:440ms] hover:rotate-[1deg] sm:p-2.5 sm:pb-8">
                <span className="relative block aspect-square overflow-hidden">
                  <Image src={collage[2]} alt="" fill sizes="180px" className="object-cover" />
                </span>
              </div>
            ) : null}
            {videos[0] ? (
              <a
                href={videos[0].linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group absolute bottom-[4%] right-[4%] flex animate-fade-in-up items-center gap-3 rounded-full bg-white/90 py-1.5 pl-1.5 pr-5 shadow-[0_15px_35px_-15px_rgb(0_0_0/0.5)] backdrop-blur transition-transform duration-300 [animation-delay:560ms] hover:-translate-y-0.5"
              >
                <span className="grid h-10 w-10 place-items-center rounded-full bg-azul text-white transition-transform duration-500 group-hover:scale-110">
                  <PlayIcon className="ml-0.5 h-4 w-4" />
                </span>
                <span className="leading-tight">
                  <span className="block font-display text-[9px] uppercase tracking-label text-muted">Reel</span>
                  <span className="block font-display text-[13px] text-heading">{videos[0].title}</span>
                </span>
              </a>
            ) : null}
          </div>
        </div>
      </header>

      {/* ── Reels / campañas ───────────────────────────────────────────── */}
      {videos.length ? (
        <section id="reels" className="scroll-mt-24 bg-sand py-16 lg:py-24">
          <div className="container-site">
            <div className="mx-auto max-w-[72rem]">
              <Reveal className="flex flex-wrap items-end justify-between gap-4">
                <h2 className="font-display text-[26px] font-semibold sm:text-[32px]">{project.videosHeading || "Reels destacados"}</h2>
                <p className="flex items-center gap-2 font-hand text-[20px] text-azul">
                  tocá para verlos en Instagram
                  <CurvedArrow className="h-8 w-12 translate-y-3 rotate-[60deg]" />
                </p>
              </Reveal>
              <div className="-mx-5 mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-8 sm:overflow-visible sm:px-0 sm:pb-0">
                {videos.map((video, index) => (
                  <Reveal key={video.id} delay={index * 100} className="w-[72%] shrink-0 snap-start sm:w-auto">
                    <VideoCard title={video.title} url={video.linkUrl} image={video.media[0]?.url} />
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* ── Cómo lo acompañamos ────────────────────────────────────────── */}
      {rest.length ? (
        <section className="container-site py-16 lg:py-24">
          <Reveal className="mx-auto grid max-w-[72rem] gap-6 lg:grid-cols-[1fr_2fr] lg:gap-16">
            <p className="font-hand text-[28px] leading-tight text-azul">Cómo acompañamos a {project.clientName}</p>
            <div className="space-y-4 font-display text-[19px] font-light leading-[1.7] text-heading sm:text-[22px]">
              {rest.map((paragraph) => (
                <p key={paragraph}>
                  <Emphasis text={paragraph} />
                </p>
              ))}
            </div>
          </Reveal>
        </section>
      ) : null}

      {/* ── Galerías ───────────────────────────────────────────────────── */}
      <div className="container-site space-y-16 lg:space-y-24">
        {galleries.map((section, index) => (
          <Reveal as="section" key={section.id} className="mx-auto max-w-[72rem]">
            {section.title ? (
              <div className="mb-8 flex flex-wrap items-end justify-between gap-3 border-t border-line pt-6">
                <h2 className="font-display text-[22px] font-semibold uppercase tracking-[0.06em] sm:text-[26px]">{section.title}</h2>
                {section.description ? (
                  <p className="max-w-[34rem] text-[14px] leading-[1.8] text-muted">
                    <Emphasis text={section.description} />
                  </p>
                ) : null}
              </div>
            ) : index === 0 ? (
              <p className="label mb-6">Galería</p>
            ) : null}
            <Gallery
              media={section.media}
              layout={section.layout}
              alt={`${project.clientName}${section.title ? ` · ${section.title}` : ""}`}
              description={
                !section.title && section.description ? (
                  <p className="font-display text-[19px] font-light leading-relaxed text-heading">
                    <Emphasis text={section.description.replace(/\*\*/g, "")} />
                  </p>
                ) : null
              }
            />
          </Reveal>
        ))}

        {project.instagramUrl ? (
          <Reveal className="mx-auto max-w-[72rem]">
            <InstagramBlock url={project.instagramUrl} label={project.instagramLabel} image={project.instagramImageUrl} />
          </Reveal>
        ) : null}
      </div>

      {/* ── Navegación entre clientes ──────────────────────────────────── */}
      <nav aria-label="Otros clientes" className="container-site mt-24">
        <div className="mx-auto grid max-w-[72rem] grid-cols-2 border-t border-line pt-8">
          {[previous, next].map((item, itemIndex) =>
            item && item.slug !== project.slug ? (
              <Link
                key={`${item.slug}-${itemIndex}`}
                href={`/clientes/${item.slug}`}
                className={`group flex items-center gap-4 ${itemIndex === 1 ? "justify-end text-right" : ""}`}
              >
                {itemIndex === 0 ? <ArrowIcon direction="left" className="h-3 w-10 shrink-0 text-stone transition-transform group-hover:-translate-x-1" /> : null}
                <span className="flex items-center gap-4">
                  {item.coverUrl ? (
                    <span className="relative hidden h-14 w-11 shrink-0 overflow-hidden rounded-md bg-sand sm:block">
                      <Image src={item.coverUrl} alt="" fill sizes="44px" className="object-cover transition-transform duration-500 group-hover:scale-110" />
                    </span>
                  ) : null}
                  <span>
                    <span className="label block">{itemIndex === 0 ? "Anterior" : "Siguiente"}</span>
                    <span className="font-display text-[14px] uppercase tracking-[0.14em] text-heading">{item.clientName}</span>
                  </span>
                </span>
                {itemIndex === 1 ? <ArrowIcon className="h-3 w-10 shrink-0 text-stone transition-transform group-hover:translate-x-1" /> : null}
              </Link>
            ) : (
              <span key={itemIndex} />
            )
          )}
        </div>
      </nav>
    </article>
  );
}
