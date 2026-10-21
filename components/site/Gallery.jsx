"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Lightbox } from "./Lightbox";

// Galerías de la página de cada cliente. Todas abren el visor al tocar una foto.
//   grid    → 3 columnas tipo mosaico (respeta la proporción de cada foto)
//   row     → fila de 5 verticales
//   square  → grilla de cuadrados
//   single  → una foto ancha
//   feature → foto + texto destacado
export function Gallery({ media, layout = "grid", alt = "", description }) {
  const [open, setOpen] = useState(null);
  const images = media.filter((item) => item?.url);
  if (!images.length) return null;

  const tile = (item, index, className, sizes, aspect) => (
    <button
      key={item.url}
      type="button"
      onClick={() => setOpen(index)}
      className={cn("group relative block w-full overflow-hidden bg-arena", aspect, className)}
      aria-label={`Ver foto ${index + 1} de ${images.length}${alt ? ` · ${alt}` : ""}`}
    >
      <Image
        src={item.url}
        alt={item.alt || alt}
        {...(aspect ? { fill: true } : { width: 1000, height: 1250 })}
        sizes={sizes}
        className={cn("transition-transform duration-700 ease-out group-hover:scale-[1.03]", aspect ? "object-cover" : "h-auto w-full")}
      />
    </button>
  );

  let content;
  if (layout === "row") {
    content = (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5 sm:gap-4">
        {images.map((item, index) => tile(item, index, index === 4 ? "col-span-2 sm:col-span-1" : "", "(min-width: 640px) 20vw, 50vw", "aspect-[2/3]"))}
      </div>
    );
  } else if (layout === "square") {
    content = (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
        {images.map((item, index) => tile(item, index, "", "(min-width: 640px) 33vw, 50vw", "aspect-square"))}
      </div>
    );
  } else if (layout === "single") {
    content = tile(images[0], 0, "", "(min-width: 1024px) 1100px, 100vw", "aspect-[16/9]");
  } else if (layout === "feature") {
    content = (
      <div className="grid items-center gap-8 md:grid-cols-[1.4fr_1fr] md:gap-14">
        {tile(images[0], 0, "", "(min-width: 768px) 60vw, 100vw", "")}
        {description ? <div className="text-[15px] leading-[1.9]">{description}</div> : null}
      </div>
    );
  } else {
    content = (
      <div className="columns-2 gap-3 sm:gap-4 lg:columns-3 [&>*]:mb-3 sm:[&>*]:mb-4">
        {images.map((item, index) => (
          <div key={item.url} className="break-inside-avoid">
            {tile(item, index, "", "(min-width: 1024px) 33vw, 50vw", "")}
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      {content}
      {open !== null ? <Lightbox images={images} index={open} onClose={() => setOpen(null)} onChange={setOpen} /> : null}
    </>
  );
}
