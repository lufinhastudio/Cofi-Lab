"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionLabel, Shape } from "./Brand";

// Testimonios: foto + cita sobre bloque de color. Pestañas con nombres,
// barra de progreso, flechas y deslizar con el dedo.
export function Testimonials({ items, autoplay = 8000 }) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(true);
  const touch = useRef(null);
  const total = items.length;

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
  const item = items[index];
  const canAutoplay = total > 1 && !reducedMotion;
  const tones = ["bg-lemon", "bg-periwinkle", "bg-cantaloupe"];

  return (
    <section
      aria-roledescription="carrusel"
      aria-label="Testimonios"
      className={cn("container-site py-20 lg:py-28", paused && "is-paused")}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={(event) => (touch.current = event.touches[0].clientX)}
      onTouchEnd={(event) => {
        if (touch.current === null) return;
        const delta = event.changedTouches[0].clientX - touch.current;
        if (Math.abs(delta) > 40) go(delta < 0 ? 1 : -1);
        touch.current = null;
      }}
    >
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <SectionLabel number="05">Testimonios</SectionLabel>
          <h2 className="title-pop mt-3 text-[40px] sm:text-[56px]">Lo que dicen</h2>
        </div>
        {total > 1 ? (
          <div role="tablist" aria-label="Testimonios" className="flex flex-wrap gap-2">
            {items.map((testimonial, itemIndex) => (
              <button
                key={testimonial.id}
                type="button"
                role="tab"
                aria-selected={itemIndex === index}
                onClick={() => goTo(itemIndex)}
                className={cn(
                  "relative overflow-hidden rounded-full border-[1.5px] px-4 py-2 font-display text-[14px] font-bold transition-colors",
                  itemIndex === index ? "border-tinta bg-tinta text-crema" : "border-tinta/20 hover:border-tinta"
                )}
              >
                {testimonial.authorName}
                {itemIndex === index && canAutoplay ? (
                  <span className="absolute inset-x-0 bottom-0 h-[3px] bg-crema/20">
                    <span key={`p-${index}`} className="progress-bar block h-full bg-lemon" style={{ "--duration": `${autoplay}ms` }} onAnimationEnd={() => go(1)} />
                  </span>
                ) : null}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div className="mt-10 grid overflow-hidden md:grid-cols-[0.9fr_1.1fr]">
        <div className="relative aspect-[4/3] bg-arena md:aspect-auto md:min-h-[460px]">
          {items.map((testimonial, itemIndex) => (
            <Image
              key={testimonial.id}
              src={testimonial.imageUrl}
              alt={testimonial.company ? `Trabajo para ${testimonial.company}` : ""}
              fill
              sizes="(min-width: 768px) 45vw, 100vw"
              className={cn("object-cover transition-opacity duration-700", itemIndex === index ? "opacity-100" : "opacity-0")}
            />
          ))}
        </div>

        <div className={cn("relative flex flex-col justify-between overflow-hidden p-8 transition-colors duration-700 sm:p-12", tones[index % tones.length])}>
          <Shape type="flor" color="watermelon" className="absolute -right-10 -top-10 h-32 w-32" />
          <blockquote
            key={index}
            className="relative font-display text-[22px] font-bold leading-snug sm:text-[28px]"
            style={{ animation: `${direction > 0 ? "slideInRight" : "slideInLeft"} 0.6s cubic-bezier(0.22,1,0.36,1) both` }}
            aria-live="polite"
          >
            “{item.quote}”
          </blockquote>
          <div className="relative mt-10 flex flex-wrap items-end justify-between gap-6">
            <p>
              <span className="block font-display text-[18px] font-black">{item.authorName}</span>
              {item.company ? <span className="mono-label mt-2 block">{item.company}</span> : null}
            </p>
            {total > 1 ? (
              <div className="flex items-center gap-3">
                <span className="mono-label mr-1">
                  {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
                </span>
                <button type="button" onClick={() => go(-1)} className="grid h-11 w-11 place-items-center rounded-full bg-tinta text-crema transition-transform hover:-translate-y-0.5" aria-label="Anterior">
                  <ArrowLeft className="h-4 w-4" strokeWidth={2} />
                </button>
                <button type="button" onClick={() => go(1)} className="grid h-11 w-11 place-items-center rounded-full bg-tinta text-crema transition-transform hover:-translate-y-0.5" aria-label="Siguiente">
                  <ArrowRight className="h-4 w-4" strokeWidth={2} />
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
