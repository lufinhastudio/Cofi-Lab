// Textos institucionales fijos (según la propuesta no se editan desde el admin).
// Formato de énfasis: **negrita** y *cursiva*.
// Las imágenes usan la ruta original de Pixieset; legacyImage() las resuelve
// a Cloudinary una vez importadas (ver scripts/import-legacy.mjs).

export const home = {
  title: "Ideas que se prueban. Marcas que se construyen",
  intro: [
    "En **CoFi** combinamos *estrategia, creatividad y producción audiovisual* para desarrollar la comunicación en redes de cada marca.",
    "No solo creamos contenido: construimos posicionamiento, percepción de marca y sistemas de comunicación que acompañan el crecimiento del negocio con identidad y dirección.",
    "Trabajamos de forma cercana con cada proyecto, entendiendo su identidad, su contexto y sus objetivos para desarrollar una comunicación coherente, auténtica y sostenida en el tiempo."
  ],
  // Datos de su posteo de primer aniversario en Instagram
  stats: [
    { value: "+12", label: "marcas", note: "confiaron en nosotras" },
    { value: "+7.300", label: "contenidos", note: "sí, siete mil trescientos" },
    { value: "+100", label: "reuniones", note: "con todas las minutas" },
    { value: "2 + 2", label: "CoFis y asistentes", note: "Coca y Firu, ejecutivas" }
  ],
  photos: [
    { src: "ov6XOGd/IMG_4358-74900f70-2500.jpg", alt: "Coca y Firu, las perritas de CoFi" },
    { src: "lykq9Ve/IMG_4356-b1a7cc9f-2500.jpg", alt: "Sofi y Cami, fundadoras de CoFi" },
    { src: "vXQq463/WhatsAppImage2026-03-05at16.55.511-20f5dd8a-2500.jpeg", alt: "Edición de contenido en tablet" },
    { src: "wXaoq0o/IMG_4353-178f8009-2500.jpg", alt: "Detrás de escena de una producción" }
  ]
};

export const services = [
  {
    number: "01",
    title: "Estrategia de marca y posicionamiento",
    lead: "Definimos el rumbo antes de ejecutar.",
    items: [
      "Diagnóstico de marca.",
      "Definición de propuesta de valor.",
      "Posicionamiento y diferenciación.",
      "Arquitectura de comunicación.",
      "Plan estratégico de crecimiento."
    ]
  },
  {
    number: "02",
    title: "Gestión de redes sociales",
    lead: "Tus redes como una herramienta comercial, no solo estética.",
    items: [
      "Calendario estratégico de contenidos.",
      "Redacción y dirección creativa.",
      "Construcción de percepción de profesionalismo.",
      "Optimización de perfil y narrativa digital.",
      "Seguimiento y análisis de métricas."
    ]
  },
  {
    number: "03",
    title: "Paid media",
    lead: "Diseñamos campañas que responden a objetivos concretos.",
    items: [
      "Estrategia de pauta.",
      "Configuración y gestión de campañas (Meta / Google).",
      "Segmentación y testing.",
      "Optimización continua.",
      "Reportes y análisis de rendimiento."
    ]
  },
  {
    number: "04",
    title: "Consultoría comercial y orden estratégico",
    lead: "Ordenamos el negocio para que marketing y ventas trabajen alineados.",
    items: [
      "Definición de objetivos comerciales.",
      "Estructura de oferta.",
      "Profesionalización del mensaje.",
      "Alineación entre comunicación y conversión."
    ]
  },
  {
    number: "05",
    title: "Contenido audiovisual",
    lead: "Creamos contenido con intención, no por inercia.",
    items: [
      "Producción de fotografías y videos para redes.",
      "Contenido alineado a la estrategia de comunicación.",
      "Dirección creativa y estética visual de la marca.",
      "Producción audiovisual profesional.",
      "Piezas pensadas para comunicar, no solo para publicar."
    ]
  },
  {
    number: "06",
    title: "Fotografía publicitaria",
    lead: "Producciones pensadas para mostrar el producto con claridad, estética e impacto.",
    items: [
      "Fotografía publicitaria en estudio.",
      "Producción con iluminación profesional.",
      "Fotografía de producto para web y e-commerce.",
      "Imágenes para campañas, catálogos y comunicación de marca.",
      "Dirección visual enfocada en destacar el producto."
    ]
  }
];

export const about = {
  title: "Sobre nosotras",
  intro: [
    "**CoFi** surge del encuentro entre estrategia y creatividad, con la idea de acompañar a las marcas en el desarrollo de su comunicación.",
    "Acompañamos a cada proyecto desde la idea hasta la ejecución: *planificando contenidos, gestionando redes, combinando pensamiento estratégico con una identidad visual sólida* para que cada marca pueda desarrollarse con una identidad clara y una comunidad activa.",
    "Así nace este **laboratorio creativo:** un espacio donde las ideas se piensan, se prueban y se transforman en contenido con identidad."
  ],
  team: [
    {
      name: "Sofi",
      image: "wXaEZ7a/WhatsAppImage2026-03-05at16.54.06-f0484fd9-1500.jpeg",
      bio: [
        "Se desarrolla en las áreas de sales & marketing, con experiencia en entornos B2B y B2C.",
        "Trabajó con empresas de tecnología y acompañando a pymes en el desarrollo de su comunicación y su presencia digital.",
        "Dentro de CoFi se enfoca en la estrategia de los proyectos, ayudando a cada marca a definir su posicionamiento, su comunicación y el rumbo de su crecimiento."
      ]
    },
    {
      name: "Cami",
      image: "1zm9Moa/WhatsAppImage2026-03-05at16.55.512-b6c5d6e7-1500.jpeg",
      bio: [
        "Fotógrafa y creadora audiovisual especializada en contenido para marcas. Es quien convierte las ideas en imágenes.",
        "Se encarga de la dirección visual y la producción de fotos y videos, transformando ideas estratégicas en piezas que transmiten identidad y generan conexión.",
        "Hace más de 8 años trabaja desarrollando contenido para redes sociales y se ha formado en fotografía publicitaria."
      ]
    },
    {
      name: "Coca y Firu",
      image: "J370rrK/WhatsAppImage2026-03-05at16.54.061-815111c4-1500.jpeg",
      bio: [
        "Coca y Firu, las que inspiraron el nombre de CoFi.",
        "Están presentes en nuestro día a día, acompañándonos entre ideas, reuniones y nuevos proyectos."
      ]
    }
  ]
};

export const clientsPage = {
  title: "Conocé algunos de nuestros trabajos",
  intro: [
    "Cada marca tiene su **propia historia, su contexto y sus objetivos.**",
    "Estos son algunos de los proyectos en los que trabajamos, acompañando a cada cliente en la construcción de su comunicación y su posicionamiento."
  ]
};

export const contactPage = {
  title: "Contanos tu idea",
  intro: [
    "¿Tenés un proyecto en mente o querés potenciar la comunicación de tu marca?",
    "Escribinos y conversemos sobre cómo podemos trabajar juntos."
  ],
  services: [
    "Estrategia de contenido",
    "Gestión de redes sociales",
    "Paid Media (publicidad en Meta)",
    "Asesoría / estrategia digital",
    "Contenido audiovisual",
    "Fotografía publicitaria",
    "Otro"
  ]
};

// Testimonios iniciales: se cargan en la base con scripts/import-legacy.mjs
// y desde ahí se editan en el admin.
export { default as legacyTestimonials } from "@/data/legacy/testimonials.json";
