/** @type {import('tailwindcss').Config} */

// Paleta del Brand Book v1.0 de CoFi (2026).
// Proporción de uso: crema 40% · cacao 15% · periwinkle 20% · lemon 10% · watermelon 6% · cantaloupe resto.
const brand = {
  periwinkle: "#AFC5FF", // principal: fondo protagonista
  watermelon: "#FD5959", // acento: logo, formas y llamados a la acción. Nunca como fondo
  lemon: "#FCFF82", // secundario: fondos de apoyo y datos sobre oscuro
  cantaloupe: "#FF9C6D", // apoyo: calidez, une el rojo con el amarillo
  tinta: "#141414", // solo texto
  cacao: "#5C5148", // fondos oscuros
  piedra: "#8A8A85",
  arena: "#EFEDE4",
  crema: "#F8F7F2"
};

module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}", "./lib/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ...brand,
        // alias usados por el admin
        paper: brand.crema,
        ink: brand.tinta,
        heading: brand.tinta,
        muted: "#5F5E59",
        line: "#DCD9CE"
      },
      fontFamily: {
        sans: ["var(--font-poppins)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-poppins)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-space-mono)", "ui-monospace", "monospace"]
      },
      maxWidth: {
        site: "80rem"
      },
      keyframes: {
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" }
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" }
        },
        progress: {
          "0%": { transform: "scaleX(0)" },
          "100%": { transform: "scaleX(1)" }
        },
        spinSlow: {
          to: { transform: "rotate(360deg)" }
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.25" }
        }
      },
      animation: {
        "fade-in-up": "fadeInUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) both",
        "fade-in": "fadeIn 0.4s ease both",
        marquee: "marquee 40s linear infinite",
        "spin-slow": "spinSlow 24s linear infinite",
        blink: "blink 1.6s ease-in-out infinite"
      }
    }
  },
  plugins: []
};
