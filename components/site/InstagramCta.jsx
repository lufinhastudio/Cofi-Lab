import Image from "next/image";
import { site } from "@/config/site";
import { HandHeart, TestTube } from "./Doodles";
import { ArrowIcon } from "./icons";
import { Reveal } from "./Reveal";

// Tarjeta tipo perfil de Instagram (avatar con el logo, nombre y bio).
// En el paso de Instagram se le suma la grilla con los últimos posteos.
export function InstagramCta({ handle, url }) {
  return (
    <section className="container-site py-24 lg:py-32">
      <Reveal className="relative mx-auto max-w-[56rem]">
        <TestTube className="absolute -left-4 -top-14 hidden h-24 w-16 -rotate-12 sm:block" />
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex flex-col items-center gap-8 rounded-[28px] border border-heading/10 bg-white/50 px-8 py-10 text-center shadow-[0_30px_70px_-45px_rgb(66_64_59/0.5)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_40px_80px_-40px_rgb(66_64_59/0.55)] sm:flex-row sm:px-12 sm:text-left"
        >
          {/* Avatar con anillo que gira */}
          <span className="relative grid h-28 w-28 shrink-0 place-items-center">
            <span
              className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,#2F4FA8,#9DB2F2,#EAE9E5,#2F4FA8)] transition-transform duration-[2000ms] ease-out group-hover:rotate-180"
              aria-hidden="true"
            />
            <span className="relative grid h-[104px] w-[104px] place-items-center rounded-full bg-paper">
              <span className="relative block h-10 w-16">
                <Image src={site.logo} alt="" fill sizes="64px" className="object-contain" unoptimized />
              </span>
            </span>
          </span>

          <span className="flex-1">
            <span className="font-hand text-[24px] text-azul">Seguinos en Instagram</span>
            <span className="mt-1 block font-display text-[22px] font-normal text-heading">{handle}</span>
            <span className="mt-2 flex items-center justify-center gap-2 text-[14.5px] text-muted sm:justify-start">
              {site.motto}
              <HandHeart className="h-5 w-5" />
            </span>
          </span>

          <span className="relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-heading px-6 py-3 font-display text-[11px] uppercase tracking-label text-white">
            <span className="absolute inset-0 -translate-x-full bg-azul transition-transform duration-500 ease-out group-hover:translate-x-0" aria-hidden="true" />
            <span className="relative">Seguir</span>
            <ArrowIcon className="relative h-2.5 w-6 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </a>
      </Reveal>
    </section>
  );
}
