import Image from "next/image";
import { Instagram } from "lucide-react";
import { contactPage, home } from "@/config/content";
import { site } from "@/config/site";
import { legacyImage } from "@/lib/legacy";
import { Logo, SectionLabel, Shape } from "@/components/site/Brand";
import { ContactForm } from "@/components/site/ContactForm";

export const metadata = {
  title: "Contacto",
  description: "¿Tenés un proyecto en mente? Contanos tu idea."
};

export default function ContactPage() {
  const teamPhoto = home.photos[1];

  return (
    <section className="grid lg:grid-cols-[0.85fr_1.15fr]">
      {/* Panel periwinkle */}
      <aside className="relative flex flex-col overflow-hidden bg-periwinkle px-5 pb-12 pt-10 sm:px-10 lg:px-14 lg:pt-16">
        <Shape type="chispa" color="watermelon" className="absolute -right-12 top-8 h-36 w-36 sm:h-44 sm:w-44" />
        <SectionLabel tone="tinta">Contacto</SectionLabel>
        <h1 className="title-pop relative mt-4 animate-fade-in-up text-[44px] sm:text-[60px]">
          {contactPage.title} <span className="block">{contactPage.highlight}</span>
        </h1>
        <p className="relative mt-6 max-w-[28rem] animate-fade-in-up text-[17px] leading-relaxed [animation-delay:100ms]">{contactPage.intro}</p>

        <figure className="relative mt-12 grid max-w-[26rem] grid-cols-[1fr_auto] items-end gap-4">
          <span className="relative block aspect-square overflow-hidden">
            <Image src={legacyImage(teamPhoto.src)} alt={teamPhoto.alt} fill sizes="(min-width: 1024px) 22vw, 70vw" className="object-cover" />
          </span>
          <figcaption className="mono-label pb-1">
            Sofi
            <br />+ Cami
          </figcaption>
        </figure>

        <div className="relative mt-auto flex flex-wrap items-center gap-x-6 gap-y-3 pt-12">
          <Logo color="tinta" className="w-[88px]" />
          <a href={site.instagram.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-display text-[15px] font-bold">
            <Instagram className="h-4 w-4" strokeWidth={2} />
            {site.instagram.handle}
          </a>
          {site.contact.email ? (
            <a href={`mailto:${site.contact.email}`} className="font-display text-[15px] font-bold">
              {site.contact.email}
            </a>
          ) : null}
        </div>
      </aside>

      {/* Carta */}
      <div className="bg-crema px-5 py-12 sm:px-10 lg:px-16 lg:py-16">
        <ContactForm services={contactPage.services} />
      </div>
    </section>
  );
}
