"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { ArrowIcon } from "./icons";
import { GinghamFlower } from "./Stickers";

// Bloque partido (texto + foto) con varias señales de que hay más para ver:
//   · pestañas con el nombre de cada slide
//   · barra de progreso que avanza sola (se pausa con el mouse)
//   · tarjeta "Siguiente" sobre la foto con miniatura
//   · arrastrar / deslizar la foto para cambiar
// Se usa en Testimonios (Inicio) y en Quiénes somos (Nosotras).
export function SplitSlider({ eyebrow, slides, autoplay = 7000, imageSide = "right", decorated = false }) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);
  const [interacted, setInteracted] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(true);
  const drag = useRef(null);
  const total = slides.length;

  // Sin avance automático si la persona pidió menos movimiento.
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  const goTo = useCallback(
    (target, dir) => {
      setDirection(dir ?? (target > index ? 1 : -1));
      setIndex(((target % total) + total) % total);
    },
    [index, total]
  );
  const go = (step) => goTo(index + step, step);

  if (!total) return null;
  const slide = slides[index];
  const next = slides[(index + 1) % total];
  const canAutoplay = Boolean(autoplay) && total > 1 && !reducedMotion;

  const onPointerDown = (event) => {
    drag.current = { x: event.clientX, moved: false };
  };
  const onPointerUp = (event) => {
    if (!drag.current) return;
    const delta = event.clientX - drag.current.x;
    drag.current = null;
    if (Math.abs(delta) > 40) {
      setInteracted(true);
      go(delta < 0 ? 1 : -1);
    }
  };

  return (
    <section
      aria-roledescription="carrusel"
      aria-label={eyebrow}
      className={cn("relative grid overflow-hidden md:grid-cols-2", decorated ? "bg-grid-paper" : "bg-sand", paused && "is-paused")}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {/* Foto */}
      <div
        className={cn(
          "group relative aspect-[4/5] cursor-grab touch-pan-y select-none overflow-hidden active:cursor-grabbing md:aspect-auto md:min-h-[660px]",
          imageSide === "right" ? "md:order-2" : "md:order-1"
        )}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerLeave={() => (drag.current = null)}
      >
        {slides.map((item, itemIndex) => (
          <Image
            key={item.id || itemIndex}
            src={item.image}
            alt={item.imageAlt || item.title}
            fill
            draggable={false}
            sizes="(min-width: 768px) 50vw, 100vw"
            priority={itemIndex === 0}
            className={cn(
              "object-cover transition-[opacity,transform] duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
              itemIndex === index ? "scale-100 opacity-100" : "scale-[1.06] opacity-0"
            )}
          />
        ))}
        <span className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/35 to-transparent" aria-hidden="true" />

        {/* Pista para deslizar (celular), desaparece al usarla */}
        {total > 1 && !interacted ? (
          <span className="pointer-events-none absolute left-1/2 top-5 -translate-x-1/2 rounded-full bg-white/85 px-4 py-1.5 font-hand text-[17px] text-heading shadow-sm backdrop-blur md:hidden">
            ← deslizá →
          </span>
        ) : null}

        {/* Siguiente */}
        {total > 1 ? (
          <button
            type="button"
            onClick={() => {
              setInteracted(true);
              go(1);
            }}
            className="absolute bottom-5 right-5 flex items-center gap-3 rounded-full bg-white/90 py-1.5 pl-1.5 pr-5 text-left shadow-[0_10px_30px_-12px_rgb(0_0_0/0.45)] backdrop-blur transition-transform duration-300 hover:-translate-y-0.5"
            aria-label={`Ver siguiente: ${next.title}`}
          >
            <span className="relative block h-11 w-11 overflow-hidden rounded-full bg-sand">
              <Image src={next.image} alt="" fill sizes="44px" className="object-cover" />
            </span>
            <span className="leading-tight">
              <span className="block font-display text-[9px] uppercase tracking-label text-muted">Siguiente</span>
              <span className="block font-display text-[13px] text-heading">{next.title}</span>
            </span>
            <ArrowIcon className="ml-1 h-2.5 w-7 text-heading" />
          </button>
        ) : null}
      </div>

      {/* Texto */}
      <div className={cn("flex flex-col justify-center px-7 py-14 sm:px-14 lg:px-20", imageSide === "right" ? "md:order-1" : "md:order-2")}>
        <div className="relative">
          {eyebrow ? <p className="label">{eyebrow}</p> : null}
          {decorated ? <GinghamFlower className="absolute -top-10 right-0 h-16 w-16 animate-float sm:right-8" rotate={-12} /> : null}
        </div>

        {/* Pestañas */}
        {total > 1 ? (
          <div role="tablist" aria-label={eyebrow} className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
            {slides.map((item, itemIndex) => (
              <button
                key={item.id || itemIndex}
                type="button"
                role="tab"
                aria-selected={itemIndex === index}
                onClick={() => {
                  setInteracted(true);
                  goTo(itemIndex);
                }}
                className={cn(
                  "relative pb-1.5 font-display text-[12px] uppercase tracking-[0.18em] transition-colors",
                  itemIndex === index ? "text-heading" : "text-muted/70 hover:text-heading"
                )}
              >
                {item.title}
                <span className="absolute inset-x-0 bottom-0 h-px overflow-hidden bg-line">
                  {itemIndex === index ? (
                    canAutoplay ? (
                      <span
                        key={`p-${index}`}
                        className="progress-bar block h-full bg-bordo"
                        style={{ "--duration": `${autoplay}ms` }}
                        onAnimationEnd={() => go(1)}
                      />
                    ) : (
                      <span className="block h-full bg-bordo" />
                    )
                  ) : null}
                </span>
              </button>
            ))}
          </div>
        ) : null}

        <div
          key={index}
          className="mt-10 max-w-md"
          style={{ animation: `${direction > 0 ? "slideInRight" : "slideInLeft"} 0.7s cubic-bezier(0.22,1,0.36,1) both` }}
          aria-live="polite"
        >
          <h3 className="font-display text-[22px] font-light text-heading sm:text-[26px]">
            {slide.title}
            {slide.subtitle ? <span className="mt-1 block font-hand text-[20px] text-bordo">{slide.subtitle}</span> : null}
          </h3>
          <div className="mt-6 space-y-4 text-[14.5px] leading-[1.9] text-ink">
            {slide.body.map((paragraph, paragraphIndex) => (
              <p key={paragraphIndex}>{paragraph}</p>
            ))}
          </div>
        </div>

        {total > 1 ? (
          <div className="mt-12 flex items-center gap-4">
            <button
              type="button"
              onClick={() => {
                setInteracted(true);
                go(-1);
              }}
              className="grid h-12 w-12 place-items-center rounded-full border border-heading/25 text-heading transition-all duration-300 hover:border-heading hover:bg-heading hover:text-white"
              aria-label="Anterior"
            >
              <ArrowIcon direction="left" className="h-2.5 w-6" />
            </button>
            <button
              type="button"
              onClick={() => {
                setInteracted(true);
                go(1);
              }}
              className="grid h-12 w-12 place-items-center rounded-full border border-heading/25 text-heading transition-all duration-300 hover:border-heading hover:bg-heading hover:text-white"
              aria-label="Siguiente"
            >
              <ArrowIcon className="h-2.5 w-6" />
            </button>
            <span className="ml-2 font-display text-[11px] tracking-[0.2em] text-muted">
              <span className="text-heading">{String(index + 1).padStart(2, "0")}</span> / {String(total).padStart(2, "0")}
            </span>
          </div>
        ) : null}
      </div>
    </section>
  );
}
