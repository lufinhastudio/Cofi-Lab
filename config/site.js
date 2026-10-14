// Datos fijos del sitio: nombre, contacto, redes y menú.

export const site = {
  name: "CoFi Lab",
  tagline: "Ideas que se prueban. Marcas que se construyen",
  // Bio de Instagram
  motto: "Probamos, mezclamos y transformamos ideas.",
  fullName: "CoFi Laboratorio Creativo",
  description:
    "Estudio de comunicación y contenido: estrategia, creatividad y producción audiovisual para desarrollar la comunicación en redes de cada marca.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  logo: "/brand/cofi-logo.png",
  instagram: { handle: "@cofi_labb", url: "https://www.instagram.com/cofi_labb/" },
  team: [
    { name: "Cami", handle: "@camicergneux", url: "https://www.instagram.com/camicergneux/" },
    { name: "Sofi", handle: "@sofimaccarone", url: "https://www.instagram.com/sofimaccarone/" }
  ],
  keywords: ["Estrategia", "Redes sociales", "Producción audiovisual", "Paid media", "Fotografía publicitaria", "Laboratorio creativo"],
  contact: {
    email: "",
    // Formato internacional sin "+" ni espacios, ej: 5493511234567. Vacío = no se muestra.
    whatsapp: ""
  },
  nav: [
    { label: "Inicio", href: "/" },
    { label: "Sobre nosotras", href: "/nosotras" },
    { label: "Clientes", href: "/clientes" },
    { label: "Contacto", href: "/contacto" }
  ]
};
