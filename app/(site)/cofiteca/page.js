import { Instagram } from "lucide-react";
import { getPublicProducts } from "@/lib/server/content";
import { getSiteContent, getSiteSettings } from "@/lib/server/siteContent";
import { SectionLabel, Shape, StageTag } from "@/components/site/Brand";
import { CofitecaCatalog } from "@/components/site/CofitecaCatalog";
import { Reveal } from "@/components/site/Reveal";

// Respaldo: además de la revalidación inmediata al guardar en el panel.
export const revalidate = 60;

export const metadata = {
  title: "La CoFiteca",
  description: "Libros, juegos y productos propios de CoFi."
};

export default async function CofitecaPage() {
  const [products, content, settings] = await Promise.all([getPublicProducts(), getSiteContent("cofiteca"), getSiteSettings()]);

  return (
    <>
      <section className="relative overflow-hidden bg-cantaloupe">
        <Shape type="flor" color="lemon" spin className="absolute -right-14 -top-14 h-48 w-48 sm:h-64 sm:w-64" />
        <div className="container-site relative pb-16 pt-12 lg:pb-20 lg:pt-20">
          <SectionLabel tone="tinta">{content.label}</SectionLabel>
          <h1 className="title-pop mt-4 animate-fade-in-up text-[56px] sm:text-[88px]">{content.title}</h1>
          {content.intro ? (
            <p className="mt-6 max-w-[40rem] animate-fade-in-up text-[17px] leading-relaxed [animation-delay:80ms] sm:text-[19px]">{content.intro}</p>
          ) : null}
        </div>
      </section>

      <section className="container-site py-16 lg:py-24">
        {products.length ? (
          <CofitecaCatalog products={products} whatsapp={settings.whatsapp} whatsappButton={content.whatsappButton} linkButton={content.linkButton} />
        ) : (
          // Mientras no haya productos visibles: aviso de «Próximamente».
          <Reveal className="bg-lab-grid relative overflow-hidden px-6 py-16 text-crema sm:px-12 lg:px-16 lg:py-24">
            <Shape type="sello" color="watermelon" spin className="absolute -bottom-16 -right-16 h-56 w-56 sm:h-72 sm:w-72" />
            <div className="relative max-w-[40rem]">
              <StageTag tone="lemon">{content.comingSoonLabel}</StageTag>
              <h2 className="title-pop mt-6 text-[40px] text-crema sm:text-[60px]">{content.comingSoonTitle}</h2>
              {content.comingSoonText ? <p className="mt-6 text-[17px] leading-relaxed text-crema/85">{content.comingSoonText}</p> : null}
              {settings.instagramUrl && content.comingSoonButton ? (
                <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="btn-watermelon mt-10">
                  <Instagram className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
                  {content.comingSoonButton}
                </a>
              ) : null}
            </div>
          </Reveal>
        )}
      </section>
    </>
  );
}
