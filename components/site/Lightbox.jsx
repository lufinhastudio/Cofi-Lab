"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { ArrowIcon, CloseIcon } from "./icons";

// Visor a pantalla completa: flechas del teclado, Esc para cerrar y swipe.
export function Lightbox({ images, index, onClose, onChange }) {
  const total = images.length;

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") onChange((index + 1) % total);
      if (event.key === "ArrowLeft") onChange((index - 1 + total) % total);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [index, total, onClose, onChange]);

  const touchStart = useRef(null);
  const image = images[index];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Galería de fotos"
      className="fixed inset-0 z-[60] flex animate-fade-in items-center justify-center bg-[#1c1b19]/95"
      onClick={onClose}
      onTouchStart={(event) => (touchStart.current = event.touches[0].clientX)}
      onTouchEnd={(event) => {
        if (touchStart.current === null) return;
        const delta = event.changedTouches[0].clientX - touchStart.current;
        touchStart.current = null;
        if (Math.abs(delta) > 40) onChange((index + (delta < 0 ? 1 : -1) + total) % total);
      }}
    >
      <div className="relative h-[82vh] w-[92vw]" onClick={(event) => event.stopPropagation()}>
        <Image key={image.url} src={image.url} alt={image.alt || ""} fill sizes="92vw" className="animate-fade-in object-contain" />
      </div>

      <button type="button" onClick={onClose} className="absolute right-4 top-4 p-3 text-white/80 hover:text-white" aria-label="Cerrar">
        <CloseIcon className="h-6 w-6" />
      </button>
      {total > 1 ? (
        <>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onChange((index - 1 + total) % total);
            }}
            className="absolute left-2 top-1/2 hidden -translate-y-1/2 p-4 text-white/70 hover:text-white sm:block"
            aria-label="Foto anterior"
          >
            <ArrowIcon direction="left" className="h-3 w-12" />
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onChange((index + 1) % total);
            }}
            className="absolute right-2 top-1/2 hidden -translate-y-1/2 p-4 text-white/70 hover:text-white sm:block"
            aria-label="Foto siguiente"
          >
            <ArrowIcon className="h-3 w-12" />
          </button>
          <p className="absolute bottom-5 left-1/2 -translate-x-1/2 font-display text-[11px] tracking-[0.2em] text-white/70">
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </p>
        </>
      ) : null}
    </div>
  );
}
