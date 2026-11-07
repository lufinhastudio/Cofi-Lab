import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { getSiteSettings } from "@/lib/server/siteContent";

// Layout del sitio público (el admin tiene el suyo).
// Redes, contacto y textos del pie salen de Configuración (panel).
export default async function SiteLayout({ children }) {
  const settings = await getSiteSettings();
  return (
    <>
      <a href="#contenido" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-white focus:px-4 focus:py-2">
        Saltar al contenido
      </a>
      <Header settings={{ instagramHandle: settings.instagramHandle, instagramUrl: settings.instagramUrl, headerCta: settings.headerCta }} />
      <main id="contenido">{children}</main>
      <Footer settings={settings} />
    </>
  );
}
