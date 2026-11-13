"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { Emphasis } from "@/lib/emphasis";
import { cn } from "@/lib/utils";
import { StageTag, toneClass } from "./Brand";
import { Lightbox } from "./Lightbox";
import { Reveal } from "./Reveal";

const CATEGORY_LABELS = { libro: "Libro", juego: "Juego", producto: "Producto propio", otro: "Otro" };
const CATEGORY_TONES = { libro: "lemon", juego: "periwinkle", producto: "cantaloupe", otro: "arena" };
const FRAME_TONES = ["periwinkle", "lemon", "cantaloupe"];

// Catálogo de La CoFiteca: tarjetas con foto (se abre el visor con todas las
// fotos del producto), categoría, descripción y botones de consulta.
export function CofitecaCatalog({ products, whatsapp, whatsappButton, linkButton }) {
  const [viewer, setViewer] = useState(null);

  return (
    <>
      <div className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product, index) => {
          const cover = product.images[0];
          const message = product.whatsappMessage || `Hola CoFi, quiero consultar por «${product.name}».`;
          return (
            <Reveal as="article" key={product.id} delay={(index % 3) * 90} className="flex flex-col">
              <button
                type="button"
                onClick={() => cover && setViewer({ images: product.images, index: 0 })}
                className={cn("group relative block p-3 text-left", toneClass(FRAME_TONES[index % FRAME_TONES.length]), !cover && "cursor-default")}
                aria-label={cover ? `Ver fotos de ${product.name}` : undefined}
                tabIndex={cover ? 0 : -1}
              >
                <span className="relative block aspect-[4/5] overflow-hidden bg-arena">
                  {cover ? (
                    <Image
                      src={cover.url}
                      alt={cover.alt || product.name}
                      fill
                      sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    />
                  ) : null}
                </span>
                {product.images.length > 1 ? (
                  <span className="stage-tag absolute bottom-5 right-5 bg-crema">{product.images.length} fotos</span>
                ) : null}
              </button>

              <div className="mt-5 flex flex-1 flex-col">
                <StageTag tone={CATEGORY_TONES[product.category] || "arena"} className="self-start">
                  {CATEGORY_LABELS[product.category] || product.category}
                </StageTag>
                <h2 className="mt-3 font-display text-[26px] font-black leading-tight">{product.name}</h2>
                {product.shortDescription ? <p className="mt-2 text-[16px] leading-relaxed">{product.shortDescription}</p> : null}
                {product.description ? (
                  <details className="group/details mt-3 text-[15px] leading-relaxed">
                    <summary className="mono-label cursor-pointer list-none text-watermelon">
                      <span className="group-open/details:hidden">Leer más ↓</span>
                      <span className="hidden group-open/details:inline">Leer menos ↑</span>
                    </summary>
                    <div className="mt-3 space-y-3">
                      {product.description
                        .split(/\n{2,}/)
                        .filter(Boolean)
                        .map((paragraph, paragraphIndex) => (
                          <p key={paragraphIndex}>
                            <Emphasis text={paragraph} />
                          </p>
                        ))}
                    </div>
                  </details>
                ) : null}

                {whatsapp || product.linkUrl ? (
                  <div className="mt-auto flex flex-wrap gap-2 pt-6">
                    {whatsapp ? (
                      <a href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`} target="_blank" rel="noopener noreferrer" className="btn-cacao px-5 py-2.5 text-[14px]">
                        <MessageCircle className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
                        {whatsappButton}
                      </a>
                    ) : null}
                    {product.linkUrl ? (
                      <a href={product.linkUrl} target="_blank" rel="noopener noreferrer" className="btn-outline px-5 py-2.5 text-[14px]">
                        {linkButton}
                        <ArrowUpRight className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
                      </a>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </Reveal>
          );
        })}
      </div>

      {viewer ? (
        <Lightbox images={viewer.images} index={viewer.index} onClose={() => setViewer(null)} onChange={(index) => setViewer((current) => ({ ...current, index }))} />
      ) : null}
    </>
  );
}
