import Image from "next/image";
import Link from "next/link";
import { home, services } from "@/config/content";
import { site } from "@/config/site";
import { Paragraphs } from "@/lib/emphasis";
import { legacyImage } from "@/lib/legacy";
import { getPublicTestimonials } from "@/lib/server/content";
import { Reveal } from "@/components/site/Reveal";
import { SplitSlider } from "@/components/site/SplitSlider";
import { InstagramCta } from "@/components/site/InstagramCta";
import { CurvedArrow, Sparkle, Squiggle, TestTube } from "@/components/site/Doodles";

export const revalidate = 60;

export default async function HomePage() {
  const testimonials = await getPublicTestimonials();

  return (
    <>
      {/* Presentación */}
      <section className="container-site pb-16 pt-10 lg:pb-24 lg:pt-16">
        <Reveal className="relative mx-auto max-w-[62rem]">
          <p className="mb-4 flex items-center gap-3 font-hand text-[24px] text-azul">
            {site.fullName}
            <Sparkle className="h-5 w-5" />
          </p>
          <h1 className="text-balance font-display text-[30px] font-semibold leading-[1.15] sm:text-[40px] lg:text-[48px]">
            Ideas que se prueban.
            <br />
            Marcas que se{" "}
            <span className="relative inline-block whitespace-nowrap">
              construyen
              <Squiggle className="absolute -bottom-3 left-0 h-4 w-full" />
            </span>
          </h1>
          <TestTube className="absolute -top-2 right-0 hidden h-28 w-20 rotate-[14deg] lg:block" />
          <div className="mt-10 max-w-[52rem] space-y-4 text-[15px] leading-[1.9] text-ink sm:text-base">
            <Paragraphs text={home.intro} />
          </div>
        </Reveal>

        <div className="relative mx-auto mt-14 grid max-w-[62rem] grid-cols-2 gap-3 sm:gap-5 lg:mt-20 lg:grid-cols-4">
          <p className="absolute -top-12 right-2 hidden items-end gap-1 font-hand text-[20px] text-azul sm:flex">
            un poquito de nuestro día a día
            <CurvedArrow className="h-10 w-14 translate-y-6 rotate-[70deg]" />
          </p>
          {home.photos.map((photo, index) => (
            <Reveal
              key={photo.src}
              delay={index * 110}
              className="reveal-img group relative aspect-square overflow-hidden rounded-[18px] bg-sand transition-transform duration-500 hover:z-10 hover:-translate-y-1.5 hover:rotate-[-1.5deg] even:hover:rotate-[1.5deg]"
            >
              <Image
                src={legacyImage(photo.src)}
                alt={photo.alt}
                fill
                sizes="(min-width: 1024px) 240px, 45vw"
                priority={index < 2}
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Servicios */}
      <section aria-labelledby="servicios" className="container-site pb-24 lg:pb-32">
        <Reveal as="h2" id="servicios" className="text-center font-display text-[26px] font-semibold uppercase sm:text-[30px]">
          Nuestros servicios
        </Reveal>
        <div className="mx-auto mt-14 grid max-w-[62rem] gap-x-12 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <Reveal
              key={service.number}
              delay={(index % 3) * 90}
              className="group relative border-t border-line pt-6 transition-colors duration-500 before:absolute before:left-0 before:top-[-1px] before:h-px before:w-0 before:bg-azul before:transition-all before:duration-700 hover:before:w-full"
            >
              <p className="font-hand text-[30px] leading-none text-azul transition-transform duration-500 group-hover:-rotate-6">{service.number}</p>
              <h3 className="mt-2 font-display text-[13px] font-semibold uppercase leading-snug tracking-[0.16em] text-heading">{service.title}</h3>
              <p className="mt-3 text-[14px] italic leading-relaxed text-heading">{service.lead}</p>
              <ul className="mt-4 space-y-1.5 text-[13.5px] leading-relaxed text-muted">
                {service.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
        <div className="mt-16 text-center">
          <Link
            href="/contacto"
            className="group relative inline-flex items-center gap-4 overflow-hidden rounded-full bg-heading py-4 pl-8 pr-4 font-display text-[11px] uppercase tracking-label text-white"
          >
            <span className="absolute inset-0 -translate-x-full bg-azul transition-transform duration-500 ease-out group-hover:translate-x-0" aria-hidden="true" />
            <span className="relative">Contanos tu idea</span>
            <span className="relative grid h-8 w-8 place-items-center rounded-full bg-white/15 transition-transform duration-500 group-hover:rotate-[-35deg]">→</span>
          </Link>
        </div>
      </section>

      {/* Testimonios */}
      {testimonials.length ? (
        <SplitSlider
          eyebrow="Testimonios"
          slides={testimonials.map((item) => ({
            id: item.id,
            title: item.authorName,
            subtitle: item.company,
            body: [`“${item.quote}”`],
            image: item.imageUrl,
            imageAlt: item.company ? `Trabajo para ${item.company}` : ""
          }))}
        />
      ) : null}

      <InstagramCta handle={site.instagram.handle} url={site.instagram.url} />
    </>
  );
}
