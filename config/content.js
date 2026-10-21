// Textos fijos del sitio (no se editan desde el admin).
// Fuente: Brand Book v1.0 de CoFi + textos del sitio anterior.
// Formato de énfasis: **negrita** y *cursiva*.
// Las imágenes usan la ruta original de Pixieset; legacyImage() las resuelve a Cloudinary.

export const home = {
  label: "Laboratorio creativo",
  intro: [
    "En **CoFi** combinamos estrategia, creatividad y producción audiovisual para desarrollar la comunicación en redes de cada marca.",
    "No solo creamos contenido: construimos posicionamiento, percepción de marca y sistemas de comunicación que acompañan el crecimiento del negocio con identidad y dirección.",
    "Trabajamos de forma cercana con cada proyecto, entendiendo su identidad, su contexto y sus objetivos para desarrollar una comunicación coherente, auténtica y sostenida en el tiempo."
  ],
  // Franja de bloques de color del hero (aplicación web del manual)
  strip: [
    { label: "Contenido", href: "/#servicios", tone: "arena" },
    { label: "Estrategia", href: "/#servicios", tone: "lemon" },
    { label: "Redes", href: "/#servicios", tone: "cantaloupe" },
    { label: "Paid", href: "/#servicios", tone: "cacao" }
  ],
  // Datos de su posteo de primer aniversario
  stats: [
    { value: "+12", label: "marcas", note: "confiaron en nosotras", tone: "periwinkle" },
    { value: "+7.300", label: "contenidos", note: "sí, siete mil trescientos", tone: "lemon" },
    { value: "+100", label: "reuniones", note: "con todas las minutas", tone: "cantaloupe" },
    { value: "2 + 2", label: "CoFis y asistentes", note: "Coca y Firu, ejecutivas", tone: "crema" }
  ],
  photos: [
    { src: "ov6XOGd/IMG_4358-74900f70-2500.jpg", alt: "Coca y Firu, las perritas de CoFi" },
    { src: "lykq9Ve/IMG_4356-b1a7cc9f-2500.jpg", alt: "Sofi y Cami, fundadoras de CoFi" },
    { src: "vXQq463/WhatsAppImage2026-03-05at16.55.511-20f5dd8a-2500.jpeg", alt: "Edición de contenido en tablet" },
    { src: "wXaoq0o/IMG_4353-178f8009-2500.jpg", alt: "Detrás de escena de una producción" }
  ]
};

// Servicios del manual (02 — Nosotras) con el detalle del sitio anterior.
// icon: nombre del ícono lineal (ver components/site/ServiceIcon.jsx)
export const services = [
  {
    number: "01",
    title: "Estrategia de marca",
    lead: "Definimos el rumbo antes de ejecutar.",
    icon: "strategy",
    tone: "periwinkle",
    items: [
      "Diagnóstico de marca",
      "Definición de propuesta de valor",
      "Posicionamiento y diferenciación",
      "Arquitectura de comunicación",
      "Plan estratégico de crecimiento"
    ]
  },
  {
    number: "02",
    title: "Gestión de redes",
    lead: "Una herramienta comercial, no solo estética.",
    icon: "social",
    tone: "lemon",
    items: [
      "Calendario estratégico de contenidos",
      "Redacción y dirección creativa",
      "Optimización de perfil y narrativa digital",
      "Seguimiento y análisis de métricas"
    ]
  },
  {
    number: "03",
    title: "Contenido audiovisual",
    lead: "Con intención, no por inercia.",
    icon: "video",
    tone: "cantaloupe",
    items: [
      "Producción de fotos y videos para redes",
      "Dirección creativa y estética visual de la marca",
      "Piezas pensadas para comunicar, no solo para publicar"
    ]
  },
  {
    number: "04",
    title: "Fotografía publicitaria",
    lead: "El producto, con claridad e impacto.",
    icon: "camera",
    tone: "periwinkle",
    items: [
      "Fotografía publicitaria en estudio",
      "Producto para web y e-commerce",
      "Imágenes para campañas y catálogos"
    ]
  },
  {
    number: "05",
    title: "Presencia digital completa",
    lead: "Web y pauta con equipos aliados que conocemos y en los que confiamos.",
    icon: "paid",
    tone: "lemon",
    items: ["Estrategia y gestión de pauta (Meta / Google)", "Segmentación, testing y reportes", "Web con equipos aliados"]
  }
];

// Diferenciadores (11 — Mensajes clave)
export const differentiators = [
  { number: "01", title: "Integral sin burocracia", text: "Un equipo, un interlocutor." },
  { number: "02", title: "Red de aliados", text: "Equipos expertos de confianza para web y pauta." },
  { number: "03", title: "Estética propia", text: "Nada de plantillas." },
  { number: "04", title: "Orden creativo", text: "Método, calendario y seguimiento." }
];

// Posicionamiento (04) y etiquetas
export const positioning = {
  text: "Para marcas que quieren consolidar su presencia digital, CoFi es el laboratorio creativo que se suma a tu equipo: estrategia y contenido en un solo lugar, junto a equipos aliados de confianza para todo lo demás.",
  tags: [
    { label: "Integral", tone: "periwinkle" },
    { label: "Cercana", tone: "lemon" },
    { label: "Organizada", tone: "cantaloupe" },
    { label: "Visible", tone: "watermelon" }
  ]
};

export const about = {
  title: "Quiénes somos",
  intro: [
    "**CoFi** surge del encuentro entre estrategia y creatividad, con la idea de acompañar a las marcas en el desarrollo de su comunicación.",
    "Acompañamos a cada proyecto desde la idea hasta la ejecución: planificando contenidos, gestionando redes y combinando pensamiento estratégico con una identidad visual sólida.",
    "Así nace este **laboratorio creativo:** un espacio donde las ideas se piensan, se prueban y se transforman en contenido con identidad."
  ],
  team: [
    {
      name: "Sofi",
      role: "Estrategia, posicionamiento y crecimiento.",
      tone: "periwinkle",
      image: "wXaEZ7a/WhatsAppImage2026-03-05at16.54.06-f0484fd9-1500.jpeg",
      bio: [
        "Se desarrolla en las áreas de sales & marketing, con experiencia en entornos B2B y B2C.",
        "Trabajó con empresas de tecnología y acompañando a pymes en el desarrollo de su comunicación y su presencia digital.",
        "Dentro de CoFi se enfoca en la estrategia de los proyectos, ayudando a cada marca a definir su posicionamiento, su comunicación y el rumbo de su crecimiento."
      ]
    },
    {
      name: "Cami",
      role: "Creatividad, dirección y producción audiovisual.",
      tone: "cantaloupe",
      image: "1zm9Moa/WhatsAppImage2026-03-05at16.55.512-b6c5d6e7-1500.jpeg",
      bio: [
        "Fotógrafa y creadora audiovisual especializada en contenido para marcas. Es quien convierte las ideas en imágenes.",
        "Se encarga de la dirección visual y la producción de fotos y videos, transformando ideas estratégicas en piezas que transmiten identidad y generan conexión.",
        "Hace más de 8 años trabaja desarrollando contenido para redes sociales y se ha formado en fotografía publicitaria."
      ]
    },
    {
      name: "Coca y Firu",
      label: "Co + Fi",
      role: "Inspiraron el nombre y nos acompañan entre ideas, reuniones y proyectos.",
      tone: "cacao",
      image: "J370rrK/WhatsAppImage2026-03-05at16.54.061-815111c4-1500.jpeg",
      bio: []
    }
  ],
  // 06 — Esencia de marca
  essence: [
    { label: "Propósito", text: "Que cada marca con algo valioso para decir logre hacerse ver y escuchar." },
    {
      label: "Misión",
      text: "Acompañar a cada marca desde la idea hasta la ejecución, con estrategia, creatividad y producción audiovisual."
    },
    { label: "Visión", text: "Ser el laboratorio creativo de referencia por su calidad, su orden y su cercanía." }
  ],
  values: [
    { label: "Cercanía", tone: "arena" },
    { label: "Compromiso", tone: "cantaloupe" },
    { label: "Organización", tone: "lemon" },
    { label: "Creatividad", tone: "periwinkle" },
    { label: "Calidad", tone: "cacao" }
  ]
};

export const clientsPage = {
  title: "Clientes",
  lead: "Marcas que nos dejaron ser parte.",
  intro:
    "Cada marca tiene su propia historia, su contexto y sus objetivos. Estos son algunos de los proyectos en los que trabajamos, acompañando a cada cliente en la construcción de su comunicación y su posicionamiento."
};

export const contactPage = {
  title: "¿Tenés un proyecto en mente?",
  highlight: "Contanos tu idea.",
  intro: "Escribinos y conversemos sobre cómo podemos trabajar juntas en la comunicación de tu marca.",
  services: [
    "Estrategia de marca",
    "Gestión de redes",
    "Contenido audiovisual",
    "Fotografía publicitaria",
    "Pauta y web",
    "Otro"
  ]
};

// Testimonios iniciales: se cargan en la base con scripts/import-legacy.mjs
// y desde ahí se editan en el admin.
export { default as legacyTestimonials } from "@/data/legacy/testimonials.json";
