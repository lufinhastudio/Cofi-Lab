// Datos fijos del sitio (según la propuesta: textos institucionales, contacto y
// redes quedan en código, no en el admin). Completar con los datos reales.

export const site = {
  name: "COFI LAB",
  description: "Estudio creativo. Portfolio, La Cofiteca y contacto.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  contact: {
    // Formato internacional sin "+" ni espacios, ej: 5493511234567
    whatsapp: "",
    email: "",
    defaultWhatsappMessage: "Hola COFI LAB! Les escribo desde la web."
  },
  socials: [
    { label: "Instagram", href: "https://www.instagram.com/cofi_labb/" }
    // { label: "TikTok", href: "" },
    // { label: "LinkedIn", href: "" }
  ],
  nav: [
    { label: "Trabajos", href: "#trabajos" },
    { label: "La Cofiteca", href: "#cofiteca" },
    { label: "Nosotros", href: "#nosotros" },
    { label: "Contacto", href: "#contacto" }
  ]
};
