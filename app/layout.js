import { Caveat_Brush, Poppins, Raleway } from "next/font/google";
import "./globals.css";
import { site } from "@/config/site";

// Mismas familias que el sitio actual, servidas desde el propio dominio.
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap"
});

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-raleway",
  display: "swap"
});

// Manuscrita para acentos, en la línea del logo (trazo de pincel redondeado).
const hand = Caveat_Brush({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-hand",
  display: "swap"
});

export const metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} · ${site.tagline}`, template: `%s · ${site.name}` },
  description: site.description,
  icons: { icon: site.logo, apple: site.logo },
  openGraph: {
    title: site.name,
    description: site.description,
    type: "website",
    locale: "es_AR",
    siteName: site.name
  }
};

export const viewport = {
  themeColor: "#F9F8F6"
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${poppins.variable} ${raleway.variable} ${hand.variable}`}>
      <body>{children}</body>
    </html>
  );
}
