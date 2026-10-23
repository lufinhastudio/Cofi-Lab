"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

// Separa el valor en texto y números: "+7.300" → ["+", 7300], "2 + 2" → [2, " + ", 2].
// Los puntos se toman como separador de miles (formato argentino).
function parse(value) {
  return String(value)
    .split(/(\d[\d.]*)/)
    .filter(Boolean)
    .map((part) => (/^\d/.test(part) ? { number: Number(part.replace(/\./g, "")) } : { text: part }));
}

const formatNumber = (n) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
const easeOutExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

// Número que cuenta desde 0 cuando entra en pantalla.
// Sin JS (y en el HTML del servidor) se ve el valor final.
export function CountUp({ value, duration = 1800, delay = 0, className }) {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;
    const parts = parse(value);
    if (!parts.some((part) => "number" in part)) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    const render = (progress) => {
      element.textContent = parts.map((part) => ("number" in part ? formatNumber(part.number * progress) : part.text)).join("");
    };

    let frame;
    let timeout;
    let safety;
    render(0);

    const start = () => {
      const startedAt = performance.now();
      // Si el navegador frena requestAnimationFrame (pestaña en segundo plano,
      // ahorro de batería), el número igual termina en su valor final.
      safety = setTimeout(() => {
        cancelAnimationFrame(frame);
        render(1);
      }, duration + 200);
      const tick = (now) => {
        const t = Math.min(1, (now - startedAt) / duration);
        render(easeOutExpo(t));
        if (t < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    };

    if (!("IntersectionObserver" in window)) {
      render(1);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        timeout = setTimeout(start, delay);
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.4 }
    );
    observer.observe(element);

    return () => {
      observer.disconnect();
      clearTimeout(timeout);
      clearTimeout(safety);
      cancelAnimationFrame(frame);
      render(1);
    };
  }, [value, duration, delay]);

  // El valor final invisible reserva el ancho, así la tarjeta no "baila" mientras cuenta.
  return (
    <span className={cn("relative inline-block whitespace-nowrap tabular-nums", className)}>
      <span className="invisible" aria-hidden="true">
        {value}
      </span>
      <span ref={ref} className="absolute inset-0" aria-hidden="true">
        {value}
      </span>
      <span className="sr-only">{value}</span>
    </span>
  );
}
