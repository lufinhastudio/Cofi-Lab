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
import { Squiggle } from "@/components/site/Doodles";
import { GinghamFlower, PaperHeart, Star, TornEdge, WashiTape } from "@/components/site/Stickers";

export const revalidate = 60;

export default async function HomePage() {
  const testimonials = await getPublicTestimonials();

  return (
    <>
      {/* Presentación */}
      <section className="container-site pb-16 pt-10 lg:pb-24 lg:pt-16">
        <Reveal className="relative mx-auto max-w-[62rem]">
          <p className="mb-4 flex items-center gap-3 font-hand text-[24px] text-bordo">
            {site.fullName}
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
          <div className="mt-10 max-w-[52rem] space-y-4 text-[15px] leading-[1.9] text-ink sm:text-base">
            <Paragraphs text={home.intro} />
          </div>
        </Reveal>

        <div className="relative mx-auto mt-14 grid max-w-[62rem] grid-cols-2 gap-3 sm:gap-5 lg:mt-20 lg:grid-cols-4">
          <p className="absolute -top-10 right-2 hidden font-hand text-[20px] text-bordo sm:block">un poquito de nuestro día a día</p>
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

      {/* Un año de CoFi (datos de su posteo aniversario) */}
      <section aria-labelledby="un-ano" className="relative">
        <TornEdge className="text-[#ECE8E0]" />
        <div className="bg-grid-paper relative overflow-hidden py-20 lg:py-28">
          <GinghamFlower className="absolute left-[4%] top-10 h-16 w-16 animate-float sm:h-20 sm:w-20" rotate={-14} />
          <PaperHeart className="absolute right-[6%] top-14 h-14 w-14 animate-float [animation-delay:0.8s]" rotate={12} />
          <Star className="absolute bottom-12 right-[12%] h-12 w-12 animate-float [animation-delay:1.4s]" rotate={8} />
          <div className="container-site relative">
            <Reveal className="mx-auto max-w-[62rem] text-center">
              <p className="font-hand text-[26px] text-bordo">primer aniversario ✦</p>
              <h2 id="un-ano" className="mt-2 font-display text-[30px] font-bold uppercase leading-tight text-bordo sm:text-[40px]">
                1 año haciendo lo que nos gusta
              </h2>
            </Reveal>
            <div className="mx-auto mt-14 grid max-w-[62rem] grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
              {home.stats.map((stat, index) => (
                <Reveal
                  key={stat.label}
                  delay={index * 110}
                  className="relative rounded-[18px] border border-bordo/25 bg-paper/80 px-5 pb-6 pt-8 text-center shadow-[0_18px_40px_-30px_rgb(122_52_24/0.6)] transition-transform duration-500 hover:-translate-y-1 hover:rotate-[-1deg] even:hover:rotate-[1deg]"
                >
                  <WashiTape className="-top-3 left-1/2 -translate-x-1/2" rotate={index % 2 ? 3 : -3} />
                  <p className="font-display text-[34px] font-bold leading-none text-bordo sm:text-[42px]">{stat.value}</p>
                  <p className="mt-3 font-display text-[12px] font-semibold uppercase tracking-[0.12em] text-bordo/90">{stat.label}</p>
                  <p className="mt-2 font-hand text-[18px] leading-snug text-ink/70">{stat.note}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
        <TornEdge className="text-[#ECE8E0]" flip />
      </section>

      {/* Servicios: tarjetas de papel sobre bordó, como sus posteos */}
      <section aria-labelledby="servicios" className="relative -mt-px">
        <TornEdge className="text-bordo" />
        <div className="bg-bordo py-20 text-paper lg:py-28">
          <div className="container-site">
            <Reveal className="mx-auto flex max-w-[72rem] flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="font-hand text-[24px] text-[#E3A7AE]">lo que hacemos</p>
                <h2 id="servicios" className="mt-1 font-display text-[34px] font-bold uppercase leading-none text-paper sm:text-[48px]">
                  Nuestros servicios
                </h2>
              </div>
              <p className="max-w-[26rem] text-[15px] leading-relaxed text-paper/75">
                Estrategia, creatividad y producción audiovisual para que cada marca tenga una comunicación con identidad y dirección.
              </p>
            </Reveal>

            <div className="mx-auto mt-14 grid max-w-[72rem] gap-5 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-6">
              {services.map((service, index) => (
                <Reveal
                  key={service.number}
                  delay={(index % 3) * 100}
                  className={`group relative flex flex-col rounded-[6px] bg-[#F3EEE6] p-7 text-ink shadow-[0_24px_40px_-28px_rgb(0_0_0/0.6)] transition-transform duration-500 hover:-translate-y-1.5 hover:rotate-0 sm:p-8 ${
                    index % 2 ? "lg:rotate-[0.6deg]" : "lg:rotate-[-0.6deg]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="font-display text-[44px] font-bold leading-none text-bordo/90 transition-colors group-hover:text-bordo">
                      {service.number}
                    </span>
                    <span className="mt-3 h-px flex-1 bg-bordo/20" aria-hidden="true" />
                  </div>
                  <h3 className="mt-5 font-display text-[19px] font-semibold uppercase leading-tight text-bordo">{service.title}</h3>
                  <p className="mt-3 font-hand text-[21px] leading-snug text-heading">{service.lead}</p>
                  <ul className="mt-5 space-y-2 border-t border-bordo/15 pt-5 text-[14.5px] leading-snug text-ink">
                    {service.items.map((item) => (
                      <li key={item} className="flex gap-3">
                        <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-bordo/60" aria-hidden="true" />
                        {item.replace(/[.,]$/, "")}
                      </li>
                    ))}
                  </ul>
                </Reveal>
              ))}
            </div>

            <div className="mt-16 text-center">
              <Link
                href="/contacto"
                className="group relative inline-flex items-center gap-4 overflow-hidden rounded-full bg-paper py-4 pl-8 pr-4 font-display text-[11px] uppercase tracking-label text-bordo"
              >
                <span className="absolute inset-0 translate-y-full bg-[#E3A7AE] transition-transform duration-500 ease-out group-hover:translate-y-0" aria-hidden="true" />
                <span className="relative">Contanos tu idea</span>
                <span className="relative grid h-8 w-8 place-items-center rounded-full bg-bordo text-paper transition-transform duration-500 group-hover:rotate-[-35deg]">→</span>
              </Link>
            </div>
          </div>
        </div>
        <TornEdge className="text-bordo" flip />
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
