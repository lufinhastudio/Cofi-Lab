import { Poppins, Space_Mono } from "next/font/google";
import "./globals.css";
import { site } from "@/config/site";

// Tipografías del Brand Book: Poppins (Black títulos · Bold subtítulos · Regular cuerpo)
// y Space Mono (la voz del Laboratorio: solo etiquetas y datos).
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-poppins",
  display: "swap"
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
  display: "swap"
});

export const metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} · ${site.tagline}`, template: `%s · ${site.name}` },
  description: site.description,
  openGraph: {
    title: site.name,
    description: site.description,
    type: "website",
    locale: "es_AR",
    siteName: site.name
  }
};

export const viewport = {
  themeColor: "#AFC5FF"
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${poppins.variable} ${spaceMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
