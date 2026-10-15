/** @type {import('tailwindcss').Config} */

// Paleta tomada del sitio actual de CoFi Lab (Pixieset), con algún ajuste de contraste.
const colors = {
  paper: "#F9F8F6", // fondo general
  sand: "#EAE9E5", // paneles (testimonios, nosotras, contacto)
  ink: "#373737", // texto principal
  heading: "#42403B", // títulos
  muted: "#7D7973", // texto secundario (más contraste que el #97938E original)
  stone: "#97938E", // botones y detalles
  line: "#DAD8D2", // bordes finos
  bordo: "#7A3418", // color protagonista de su Instagram (títulos y bandas)
  rojo: "#D4483A", // corazones y frutillas
  rosa: "#E3A7AE", // florcitas de vichy
  amarillo: "#F2BC5A", // mariposa y estrellas
  celeste: "#5B8BD0", // detalles de la mariposa (uso mínimo)
  azul: "#5B8BD0", // alias de compatibilidad
  night: "#2B2925" // fondo oscuro cálido (footer, panel de contacto)
};

module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}", "./lib/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: { cofi: colors, ...colors },
      fontFamily: {
        sans: ["var(--font-raleway)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-poppins)", "ui-sans-serif", "system-ui", "sans-serif"],
        hand: ["var(--font-hand)", "cursive"]
      },
      letterSpacing: {
        label: "0.19em"
      },
      maxWidth: {
        site: "78rem",
        text: "46rem"
      },
      keyframes: {
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(18px)" },
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
        wiggle: {
          "0%, 100%": { transform: "rotate(0deg)" },
          "30%": { transform: "rotate(-6deg)" },
          "60%": { transform: "rotate(4deg)" }
        },
        float: {
          "0%, 100%": { transform: "translateY(0) rotate(var(--r, 0deg))" },
          "50%": { transform: "translateY(-6px) rotate(var(--r, 0deg))" }
        },
        draw: {
          "0%": { strokeDashoffset: "var(--len, 300)" },
          "100%": { strokeDashoffset: "0" }
        }
      },
      animation: {
        "fade-in-up": "fadeInUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) both",
        "fade-in": "fadeIn 0.4s ease both",
        marquee: "marquee 38s linear infinite",
        wiggle: "wiggle 0.6s ease-in-out",
        float: "float 5s ease-in-out infinite",
        draw: "draw 1.4s cubic-bezier(0.65, 0, 0.35, 1) both"
      }
    }
  },
  plugins: []
};
