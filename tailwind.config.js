/** @type {import('tailwindcss').Config} */

// Paleta provisoria. Se reemplaza con los colores reales de COFI LAB
// cuando terminemos de relevar la página actual y el Instagram.
const cofiInk = "#1B1B1B";
const cofiPaper = "#FAF7F2";
const cofiAccent = "#E2553A";
const cofiMuted = "#6B6560";

module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}", "./lib/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        cofi: {
          ink: cofiInk,
          paper: cofiPaper,
          accent: cofiAccent,
          muted: cofiMuted
        },
        ink: cofiInk,
        paper: cofiPaper,
        accent: cofiAccent,
        muted: cofiMuted
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      boxShadow: {
        soft: "0 16px 44px rgb(27 27 27 / 0.08)",
        card: "0 4px 24px rgb(27 27 27 / 0.06)"
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.25rem",
        "4xl": "1.5rem"
      },
      keyframes: {
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        }
      },
      animation: {
        "fade-in-up": "fadeInUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) both"
      }
    }
  },
  plugins: []
};
