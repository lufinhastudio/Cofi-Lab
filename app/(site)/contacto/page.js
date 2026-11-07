import Image from "next/image";
import { Instagram } from "lucide-react";
import { getSiteContent, getSiteSettings } from "@/lib/server/siteContent";
import { Logo, SectionLabel, Shape } from "@/components/site/Brand";
import { ContactForm } from "@/components/site/ContactForm";

// Respaldo: además de la revalidación inmediata al guardar en el panel.
export const revalidate = 60;

export const metadata = {
  title: "Contacto",
  description: "¿Tenés un proyecto en mente? Contanos tu idea."
};

export default async function ContactPage() {
  const [contactPage, settings] = await Promise.all([getSiteContent("contact"), getSiteSettings()]);
  const caption = contactPage.photoCaption.split("\n").filter(Boolean);

  return (
    <section className="grid lg:grid-cols-[0.85fr_1.15fr]">
      {/* Panel periwinkle */}
      <aside className="relative flex flex-col overflow-hidden bg-periwinkle px-5 pb-12 pt-10 sm:px-10 lg:px-14 lg:pt-16">
        <Shape type="chispa" color="watermelon" className="absolute -right-12 top-8 h-36 w-36 sm:h-44 sm:w-44" />
        <SectionLabel tone="tinta">{contactPage.label}</SectionLabel>
        <h1 className="title-pop relative mt-4 animate-fade-in-up text-[44px] sm:text-[60px]">
          {contactPage.title} {contactPage.highlight ? <span className="block">{contactPage.highlight}</span> : null}
        </h1>
        {contactPage.intro ? (
          <p className="relative mt-6 max-w-[28rem] animate-fade-in-up text-[17px] leading-relaxed [animation-delay:100ms]">{contactPage.intro}</p>
        ) : null}

        {contactPage.photo ? (
          <figure className="relative mt-12 grid max-w-[26rem] grid-cols-[1fr_auto] items-end gap-4">
            <span className="relative block aspect-square overflow-hidden">
              <Image src={contactPage.photo} alt={contactPage.photoAlt || ""} fill sizes="(min-width: 1024px) 22vw, 70vw" className="object-cover" />
            </span>
            {caption.length ? (
              <figcaption className="mono-label pb-1">
                {caption.map((line, index) => (
                  <span key={index} className="block">
                    {line}
                  </span>
                ))}
              </figcaption>
            ) : null}
          </figure>
        ) : null}

        <div className="relative mt-auto flex flex-wrap items-center gap-x-6 gap-y-3 pt-12">
          <Logo color="tinta" className="w-[88px]" />
          {settings.instagramUrl ? (
            <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-display text-[15px] font-bold">
              <Instagram className="h-4 w-4" strokeWidth={2} />
              {settings.instagramHandle}
            </a>
          ) : null}
          {settings.email ? (
            <a href={`mailto:${settings.email}`} className="font-display text-[15px] font-bold [overflow-wrap:anywhere]">
              {settings.email}
            </a>
          ) : null}
        </div>
      </aside>

      {/* Carta */}
      <div className="bg-crema px-5 py-12 sm:px-10 lg:px-16 lg:py-16">
        <ContactForm services={contactPage.services} successTitle={contactPage.successTitle} successText={contactPage.successText} />
      </div>
    </section>
  );
}
