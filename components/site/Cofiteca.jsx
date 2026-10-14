import Image from "next/image";
import { productWhatsappMessage, whatsappUrl } from "@/lib/whatsapp";

export function Cofiteca({ products }) {
  return (
    <section id="cofiteca" className="scroll-mt-20 bg-paper py-20">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="font-display text-3xl font-bold sm:text-4xl">La Cofiteca</h2>
        <p className="mt-3 max-w-xl text-muted">Libros, juegos e ideas para descubrir (texto pendiente).</p>
        {products.length ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <article key={product.id} className="overflow-hidden rounded-3xl bg-white">
                <div className="relative aspect-square bg-black/5">
                  {product.images[0]?.url ? (
                    <Image src={product.images[0].url} alt={product.images[0].alt || product.name} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover" />
                  ) : null}
                </div>
                <div className="p-5">
                  <p className="text-xs uppercase tracking-widest text-muted">{product.category}</p>
                  <h3 className="mt-1 text-lg font-bold">{product.name}</h3>
                  {product.shortDescription ? <p className="mt-2 text-sm text-muted">{product.shortDescription}</p> : null}
                  <a
                    href={whatsappUrl(productWhatsappMessage(product))}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-block rounded-full bg-ink px-4 py-2 text-sm text-white"
                  >
                    Consultar por WhatsApp
                  </a>
                </div>
              </article>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
