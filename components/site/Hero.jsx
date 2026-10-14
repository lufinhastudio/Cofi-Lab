import { site } from "@/config/site";
import { whatsappUrl } from "@/lib/whatsapp";

// Inicio: presentación breve, imagen/video destacado, accesos a Trabajos y
// La Cofiteca, contacto y redes. Contenido real pendiente del relevamiento.
export function Hero() {
  return (
    <section id="inicio" className="mx-auto max-w-6xl px-4 py-20 sm:py-28">
      <p className="text-sm uppercase tracking-widest text-muted">Estudio creativo</p>
      <h1 className="mt-4 max-w-3xl font-display text-5xl font-bold leading-tight sm:text-7xl">{site.name}</h1>
      <p className="mt-6 max-w-xl text-lg text-muted">Presentación breve del estudio (texto pendiente).</p>
      <div className="mt-8 flex flex-wrap gap-3 text-sm">
        <a href="#trabajos" className="rounded-full bg-ink px-5 py-3 text-white">Ver trabajos</a>
        <a href="#cofiteca" className="rounded-full border border-ink px-5 py-3">La Cofiteca</a>
        <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="rounded-full border border-ink px-5 py-3">
          WhatsApp
        </a>
      </div>
    </section>
  );
}
