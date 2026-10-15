import Image from "next/image";
import { contactPage, home } from "@/config/content";
import { site } from "@/config/site";
import { legacyImage } from "@/lib/legacy";
import { ContactForm } from "@/components/site/ContactForm";
import { WashiTape } from "@/components/site/Stickers";
import { InstagramIcon } from "@/components/site/icons";
import { Reveal } from "@/components/site/Reveal";

export const metadata = {
  title: "Contacto",
  description: "¿Tenés un proyecto en mente o querés potenciar la comunicación de tu marca? Escribinos."
};

export default function ContactPage() {
  const teamPhoto = home.photos[1];

  return (
    <section className="container-site pb-24 pt-8 lg:pb-32 lg:pt-12">
      <div className="mx-auto grid max-w-[72rem] overflow-hidden rounded-[28px] bg-white/50 shadow-[0_40px_90px_-50px_rgb(66_64_59/0.45)] ring-1 ring-heading/5 lg:grid-cols-[0.85fr_1.15fr]">
        {/* Panel izquierdo */}
        <aside className="relative flex flex-col justify-between overflow-hidden bg-night px-8 pb-10 pt-12 text-paper sm:px-12">
          <div className="relative z-10">
            <span className="relative block h-12 w-20">
              <Image src={site.logo} alt={site.name} fill sizes="80px" className="object-contain object-left invert" unoptimized />
            </span>
            <h1 className="mt-10 font-display text-[30px] font-light leading-tight text-paper sm:text-[38px]">
              {contactPage.title}
              <span className="mt-1 block font-hand text-[30px] text-[#E3A7AE] sm:text-[34px]">y la probamos juntas</span>
            </h1>
            <div className="mt-6 space-y-1 text-[14.5px] leading-[1.9] text-paper/70">
              {contactPage.intro.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </div>

          {/* Foto tipo polaroid */}
          <Reveal className="relative z-10 mx-auto mt-12 w-[78%] max-w-[300px] lg:mx-0">
            <figure className="relative rotate-[-4deg] bg-paper p-3 pb-10 shadow-[0_25px_50px_-20px_rgb(0_0_0/0.6)] transition-transform duration-500 hover:rotate-[-1deg]">
              <span className="relative block aspect-square overflow-hidden">
                <Image src={legacyImage(teamPhoto.src)} alt={teamPhoto.alt} fill sizes="300px" className="object-cover" />
              </span>
              <figcaption className="absolute bottom-2.5 left-0 right-0 text-center font-hand text-[22px] text-heading">Cami & Sofi ✦</figcaption>
              <WashiTape className="-top-3 left-1/2 -translate-x-1/2" rotate={-6} />
            </figure>
          </Reveal>

          <div className="relative z-10 mt-12 flex flex-wrap gap-x-6 gap-y-3 text-[13px] text-paper/70">
            <a href={site.instagram.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 transition-colors hover:text-paper">
              <InstagramIcon className="h-4 w-4" />
              {site.instagram.handle}
            </a>
            {site.contact.email ? (
              <a href={`mailto:${site.contact.email}`} className="transition-colors hover:text-paper">
                {site.contact.email}
              </a>
            ) : null}
          </div>

          <span className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-bordo/30 blur-3xl" aria-hidden="true" />
        </aside>

        {/* Carta */}
        <div className="relative bg-paper px-7 py-12 sm:px-12 sm:py-14 lg:px-14">
          <ContactForm services={contactPage.services} />
        </div>
      </div>
    </section>
  );
}
