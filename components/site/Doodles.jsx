import { cn } from "@/lib/utils";

// Garabatos a mano alzada en bordó, inspirados en los posteos de @cofi_labb.
// Con la clase "doodle-draw" se dibujan solos cuando el bloque entra en pantalla
// (necesitan estar dentro de un <Reveal>).

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true
};

// Tubo de ensayo con burbujas (el "lab" de CoFi Lab)
export function TestTube({ className, draw = true }) {
  return (
    <svg viewBox="0 0 64 96" strokeWidth="2.2" className={cn("text-bordo", draw && "doodle-draw", className)} {...base}>
      <path style={{ "--len": 220 }} d="M22 8c6 1 14 1 20-.5M25 9l-.5 58c0 9 4.5 15 8 15s8-6 7.6-15L39.5 9" />
      <path style={{ "--len": 90, "--draw-delay": "700ms" }} d="M25 50c4 2.5 10 2.5 15-.5" />
      <path style={{ "--len": 40, "--draw-delay": "900ms" }} d="M31 60a2.5 2.5 0 1 0 0.1 0M35 68a1.8 1.8 0 1 0 0.1 0" />
      <path style={{ "--len": 60, "--draw-delay": "1100ms" }} d="M48 26c3-3 7-3 9 0M50 16c1-4 5-6 8-4M45 36c3 0 5 1 6 3" />
    </svg>
  );
}

// Subrayado ondulado
export function Squiggle({ className, draw = true }) {
  return (
    <svg viewBox="0 0 220 18" strokeWidth="2.4" preserveAspectRatio="none" className={cn("text-bordo", draw && "doodle-draw", className)} {...base}>
      <path style={{ "--len": 260 }} d="M3 11c18-8 30 6 48-1s30-7 47 1 32 6 49-2 32-5 48 1 16 3 22 1" />
    </svg>
  );
}

// Flechita curva
export function CurvedArrow({ className, draw = true }) {
  return (
    <svg viewBox="0 0 90 60" strokeWidth="2.2" className={cn("text-bordo", draw && "doodle-draw", className)} {...base}>
      <path style={{ "--len": 140 }} d="M5 10c22-4 52 4 62 34" />
      <path style={{ "--len": 40, "--draw-delay": "900ms" }} d="M56 38l11 8 6-13" />
    </svg>
  );
}

// Destello / chispa
export function Sparkle({ className, draw = true }) {
  return (
    <svg viewBox="0 0 40 40" strokeWidth="2.2" className={cn("text-bordo", draw && "doodle-draw", className)} {...base}>
      <path style={{ "--len": 120 }} d="M20 4c0 9 3 14 16 16-13 2-16 7-16 16 0-9-3-14-16-16 13-2 16-7 16-16z" />
    </svg>
  );
}

// Corazón dibujado (el 💌 de su bio)
export function HandHeart({ className, draw = true }) {
  return (
    <svg viewBox="0 0 40 36" strokeWidth="2.2" className={cn("text-bordo", draw && "doodle-draw", className)} {...base}>
      <path style={{ "--len": 130 }} d="M20 32C9 24 3 17 4 10c1-6 9-8 14-2l2 3 2-3c5-6 13-4 14 2 1 7-5 14-16 22z" />
    </svg>
  );
}

// Círculo hecho a mano para resaltar
export function HandCircle({ className, draw = true }) {
  return (
    <svg viewBox="0 0 200 80" strokeWidth="2" preserveAspectRatio="none" className={cn("text-bordo", draw && "doodle-draw", className)} {...base}>
      <path style={{ "--len": 520 }} d="M150 10C110 0 30 4 10 30c-14 20 30 44 96 42 60-2 92-22 86-40-5-15-40-24-82-22" />
    </svg>
  );
}
