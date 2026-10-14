import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

// Layout del sitio público (el admin tiene el suyo).
export default function SiteLayout({ children }) {
  return (
    <>
      <a href="#contenido" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-white focus:px-4 focus:py-2">
        Saltar al contenido
      </a>
      <Header />
      <main id="contenido">{children}</main>
      <Footer />
    </>
  );
}
