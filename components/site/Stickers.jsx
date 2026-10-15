import { cn } from "@/lib/utils";

// Stickers de collage en la línea de los posteos de @cofi_labb
// (papel, vichy, frutilla, mariposa, corazón). Dibujos propios en SVG.
// Flotan apenas con animate-float; --r define la inclinación.

const sticker = (className, rotate) => ({
  className: cn("pointer-events-none select-none drop-shadow-[0_6px_8px_rgb(66_40_20/0.18)]", className),
  style: rotate !== undefined ? { "--r": `${rotate}deg`, transform: `rotate(${rotate}deg)` } : undefined,
  "aria-hidden": true
});

export function GinghamFlower({ className, rotate = -10, color = "#E3A7AE" }) {
  const id = `g-${color.replace("#", "")}`;
  return (
    <svg viewBox="0 0 80 80" {...sticker(className, rotate)}>
      <defs>
        <pattern id={id} width="8" height="8" patternUnits="userSpaceOnUse">
          <rect width="8" height="8" fill="#fff" />
          <rect width="4" height="8" fill={color} opacity="0.55" />
          <rect width="8" height="4" fill={color} opacity="0.55" />
        </pattern>
      </defs>
      <path
        d="M40 6c8 0 12 9 10 16 7-5 18-3 20 5s-6 14-13 15c6 4 9 15 2 20s-15 0-19-7c-3 8-12 12-19 7s-4-15 3-19c-8 0-15-7-12-15s13-9 19-4c-2-8 1-18 9-18z"
        fill={`url(#${id})`}
        stroke={color}
        strokeWidth="2"
        strokeDasharray="3 2.5"
      />
      <circle cx="36" cy="38" r="2.4" fill="#fff" stroke={color} strokeWidth="0.8" />
      <circle cx="44" cy="38" r="2.4" fill="#fff" stroke={color} strokeWidth="0.8" />
      <circle cx="36" cy="46" r="2.4" fill="#fff" stroke={color} strokeWidth="0.8" />
      <circle cx="44" cy="46" r="2.4" fill="#fff" stroke={color} strokeWidth="0.8" />
    </svg>
  );
}

export function Strawberry({ className, rotate = 8 }) {
  return (
    <svg viewBox="0 0 70 80" {...sticker(className, rotate)}>
      <path d="M35 20c16-2 30 6 30 22 0 18-17 34-30 34S5 60 5 42c0-16 14-24 30-22z" fill="#DB3628" />
      <path d="M14 34c4-6 10-8 16-8" stroke="#fff" strokeOpacity="0.45" strokeWidth="3" strokeLinecap="round" fill="none" />
      {[
        [24, 40], [36, 38], [46, 44], [30, 52], [42, 56], [22, 56], [35, 66]
      ].map(([x, y]) => (
        <ellipse key={`${x}-${y}`} cx={x} cy={y} rx="1.6" ry="2.4" fill="#F7D774" />
      ))}
      <path d="M35 22c-6-6-14-6-20-3 6 1 9 4 12 7-6 0-10 3-12 7 8-2 14-4 20-6 6 2 12 4 20 6-2-4-6-7-12-7 3-3 6-6 12-7-6-3-14-3-20 3z" fill="#4E9A43" />
      <path d="M35 21c0-6 2-11 6-14" stroke="#3C7D34" strokeWidth="3" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function Butterfly({ className, rotate = -14 }) {
  return (
    <svg viewBox="0 0 90 70" {...sticker(className, rotate)}>
      <g stroke="#3F6FB5" strokeWidth="2" strokeLinejoin="round">
        <path d="M44 34C34 14 14 6 8 14s4 22 34 24z" fill="#F2BC5A" />
        <path d="M46 34C56 14 76 6 82 14s-4 22-34 24z" fill="#F2BC5A" />
        <path d="M43 38C28 40 18 52 24 60s18-6 21-18z" fill="#F7CF7E" />
        <path d="M47 38c15 2 25 14 19 22s-18-6-21-18z" fill="#F7CF7E" />
      </g>
      <path d="M45 24c3 0 4 4 4 10v18c0 4-2 6-4 6s-4-2-4-6V34c0-6 1-10 4-10z" fill="#5B8BD0" stroke="#3F6FB5" strokeWidth="2" />
      <path d="M43 24c-3-8-8-12-12-12M47 24c3-8 8-12 12-12" stroke="#3F6FB5" strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function PaperHeart({ className, rotate = 10 }) {
  return (
    <svg viewBox="0 0 80 72" {...sticker(className, rotate)}>
      <defs>
        <pattern id="paper-dots" width="5" height="5" patternUnits="userSpaceOnUse">
          <rect width="5" height="5" fill="#D4483A" />
          <circle cx="1.5" cy="1.5" r="0.8" fill="#B83A2E" />
        </pattern>
      </defs>
      <path d="M40 68L8 36C-2 24 4 6 18 5c9-1 16 5 22 13 6-8 13-14 22-13 14 1 20 19 10 31z" fill="url(#paper-dots)" />
    </svg>
  );
}

export function Star({ className, rotate = 12 }) {
  return (
    <svg viewBox="0 0 70 70" {...sticker(className, rotate)}>
      <path
        d="M35 4l9 21 23 2-17 15 5 23-20-12-20 12 5-23L3 27l23-2z"
        fill="#F2BC5A"
        stroke="#E0603A"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path d="M26 30l6 2M37 22l-1 6M44 34l-5 1" stroke="#fff" strokeOpacity="0.6" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function PaperClip({ className, rotate = 0 }) {
  return (
    <svg viewBox="0 0 30 90" {...sticker(className, rotate)} fill="none">
      <path
        d="M20 22v44a8 8 0 0 1-16 0V14a10 10 0 0 1 20 0v50a4 4 0 0 1-8 0V24"
        stroke="#4A4A4A"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

// Cinta washi de vichy (para "pegar" polaroids)
export function WashiTape({ className, rotate = -4, color = "#B9B48F" }) {
  return (
    <span
      aria-hidden="true"
      className={cn("pointer-events-none absolute block h-7 w-24 opacity-90 shadow-sm", className)}
      style={{
        transform: `rotate(${rotate}deg)`,
        backgroundColor: "#EFEBDD",
        backgroundImage: `linear-gradient(90deg, ${color}66 50%, transparent 50%), linear-gradient(${color}66 50%, transparent 50%)`,
        backgroundSize: "10px 10px",
        clipPath: "polygon(3% 0, 97% 4%, 100% 50%, 96% 100%, 2% 96%, 0 50%)"
      }}
    />
  );
}

// Borde de papel rasgado (separador entre secciones)
export function TornEdge({ className, fill = "currentColor", flip = false }) {
  return (
    <svg
      viewBox="0 0 1200 40"
      preserveAspectRatio="none"
      className={cn("block h-6 w-full sm:h-8", flip && "rotate-180", className)}
      aria-hidden="true"
    >
      <path
        fill={fill}
        d="M0 40V18 L24 10 L50 7 L66 23 L83 17 L98 22 L118 7 L134 19 L161 8 L182 8 L209 7 L226 13 L241 24 L267 7 L288 7 L306 15 L333 10 L350 24 L373 23 L392 9 L412 17 L429 23 L445 24 L460 12 L489 23 L516 16 L544 24 L572 17 L595 13 L614 13 L630 24 L653 22 L682 16 L710 15 L726 9 L756 19 L775 16 L793 21 L820 7 L836 23 L860 16 L885 21 L913 8 L929 14 L958 8 L973 15 L1001 15 L1027 17 L1041 20 L1066 11 L1083 21 L1098 12 L1121 10 L1142 18 L1168 21 L1184 11 L1200 18 V40z"
      />
    </svg>
  );
}
