// Datos fijos del sitio: nombre, contacto, redes y menú.
// Textos según el Brand Book v1.0 de CoFi.

export const site = {
  name: "CoFi",
  fullName: "CoFi · Laboratorio creativo",
  descriptor: "Laboratorio creativo",
  tagline: "Ideas que se prueban. Marcas que se construyen.",
  // Elevator pitch del manual (arquitectura verbal)
  pitch:
    "Acompañamos a cada marca desde la idea hasta la ejecución: no solo creamos contenido, construimos posicionamiento.",
  description:
    "CoFi es un laboratorio creativo de estrategia y contenido. Acompañamos a cada marca desde la idea hasta la ejecución: no solo creamos contenido, construimos posicionamiento.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  // Variantes del logo (combinaciones permitidas del manual)
  logo: {
    tinta: "/brand/cofi-tinta.png", // sobre cualquier color de marca o crema
    crema: "/brand/cofi-crema.png", // sobre cacao
    lemon: "/brand/cofi-lemon.png", // sobre cacao
    periwinkle: "/brand/cofi-periwinkle.png", // sobre cacao
    cantaloupe: "/brand/cofi-cantaloupe.png", // sobre cacao
    watermelon: "/brand/cofi-watermelon.png" // solo sobre lemon
  },
  isotipo: "/brand/flor-c.png",
  instagram: { handle: "@cofi_labb", url: "https://www.instagram.com/cofi_labb/" },
  team: [
    { name: "Sofi", handle: "@sofimaccarone", url: "https://www.instagram.com/sofimaccarone/" },
    { name: "Cami", handle: "@camicergneux", url: "https://www.instagram.com/camicergneux/" }
  ],
  contact: {
    email: "",
    // Formato internacional sin "+" ni espacios, ej: 5493511234567. Vacío = no se muestra.
    whatsapp: ""
  },
  // Mismo orden que la aplicación web del manual
  nav: [
    { label: "Servicios", href: "/#servicios" },
    { label: "Clientes", href: "/clientes" },
    { label: "Nosotras", href: "/nosotras" },
    { label: "Contacto", href: "/contacto" }
  ]
};
