import Image from "next/image";
import { site } from "@/config/site";
import { cn } from "@/lib/utils";

// ── Logo ────────────────────────────────────────────────────────────────────
// Combinaciones permitidas (manual, pág. 29): tinta sobre cualquier color de marca;
// sobre cacao: crema, lemon, periwinkle o cantaloupe; watermelon solo sobre lemon.
// Nunca rotar, deformar, ni agregar sombras o degradés.
export function Logo({ color = "tinta", className, priority = false, alt = "CoFi" }) {
  return (
    <span className={cn("relative block aspect-[1188/888]", className)}>
      <Image src={site.logo[color]} alt={alt} fill priority={priority} sizes="160px" className="object-contain" unoptimized />
    </span>
  );
}

// ── Formas de marca (manual, pág. 21) ───────────────────────────────────────
// Planas, sin contorno ni sombra. Una o dos por pieza. Pueden cortarse en el borde.
// Nunca encima del logo.
const shapePaths = {
  // Flor de 6 pétalos
  flor: (
    <>
      {[0, 60, 120, 180, 240, 300].map((angle) => (
        <circle key={angle} cx={50 + Math.cos(((angle - 90) * Math.PI) / 180) * 24} cy={50 + Math.sin(((angle - 90) * Math.PI) / 180) * 24} r="22" />
      ))}
      <circle cx="50" cy="50" r="26" />
    </>
  ),
  // Chispa de 4 puntas
  chispa: <path d="M50 0C53 30 70 47 100 50 70 53 53 70 50 100 47 70 30 53 0 50 30 47 47 30 50 0z" />,
  // Sello dentado
  sello: (
    <path
      d={Array.from({ length: 32 }, (_, i) => {
        const r = i % 2 ? 40 : 50;
        const a = (i * Math.PI) / 16 - Math.PI / 2;
        return `${i ? "L" : "M"}${(50 + Math.cos(a) * r).toFixed(2)} ${(50 + Math.sin(a) * r).toFixed(2)}`;
      }).join(" ") + "Z"}
    />
  ),
  // Trébol de 4 hojas
  trebol: (
    <>
      <circle cx="50" cy="27" r="25" />
      <circle cx="73" cy="50" r="25" />
      <circle cx="50" cy="73" r="25" />
      <circle cx="27" cy="50" r="25" />
      <rect x="27" y="27" width="46" height="46" />
    </>
  ),
  // Cruz de pétalos
  cruz: <path d="M50 38C62 10 90 2 96 8s-4 34-34 42c30 8 40 36 34 42S62 90 50 62C38 90 10 98 4 92s4-34 34-42C8 42-2 14 4 8s34 2 46 30z" />
};

export function Shape({ type = "flor", className, color = "watermelon", spin = false, style }) {
  const fill = {
    watermelon: "#FD5959",
    lemon: "#FCFF82",
    periwinkle: "#AFC5FF",
    cantaloupe: "#FF9C6D",
    tinta: "#141414",
    cacao: "#5C5148",
    crema: "#F8F7F2"
  }[color];
  return (
    <svg
      viewBox="0 0 100 100"
      fill={fill}
      aria-hidden="true"
      className={cn("pointer-events-none select-none", spin && "animate-spin-slow", className)}
      style={style}
    >
      {shapePaths[type]}
    </svg>
  );
}

// Sol de rayos (lineal)
export function Sun({ className, color = "#141414" }) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" className={cn("pointer-events-none select-none", className)}>
      {Array.from({ length: 32 }, (_, i) => {
        const a = (i * Math.PI) / 16;
        return (
          <line
            key={i}
            x1={50 + Math.cos(a) * 12}
            y1={50 + Math.sin(a) * 12}
            x2={50 + Math.cos(a) * 48}
            y2={50 + Math.sin(a) * 48}
            stroke={color}
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        );
      })}
      <circle cx="50" cy="50" r="7" fill={color} />
    </svg>
  );
}

// ── Etiquetas ───────────────────────────────────────────────────────────────
const tones = {
  periwinkle: "bg-periwinkle text-tinta",
  lemon: "bg-lemon text-tinta",
  cantaloupe: "bg-cantaloupe text-tinta",
  watermelon: "bg-watermelon text-tinta",
  arena: "bg-arena text-tinta",
  crema: "bg-crema text-tinta",
  cacao: "bg-cacao text-crema",
  tinta: "bg-tinta text-crema"
};

export function toneClass(tone) {
  return tones[tone] || tones.arena;
}

// Etiqueta de etapa: bloque de color + Space Mono en mayúsculas
export function StageTag({ children, tone = "periwinkle", className }) {
  return <span className={cn("stage-tag", toneClass(tone), className)}>{children}</span>;
}

// Rótulo de sección: "01 — Servicios"
export function SectionLabel({ number, children, className, tone = "watermelon" }) {
  const color = { watermelon: "text-watermelon", lemon: "text-lemon", tinta: "text-tinta", crema: "text-crema/70", periwinkle: "text-periwinkle" }[tone];
  return (
    <p className={cn("mono-label", color, className)}>
      {number ? `${number} — ` : ""}
      {children}
    </p>
  );
}

// Los dos puntos del logo: "anticipan algo"
export function TwoDots({ className, color = "bg-tinta" }) {
  return (
    <span className={cn("inline-flex flex-col gap-[0.18em] align-middle", className)} aria-hidden="true">
      <span className={cn("block h-[0.2em] w-[0.2em] rounded-full", color)} />
      <span className={cn("block h-[0.2em] w-[0.2em] rounded-full", color)} />
    </span>
  );
}
