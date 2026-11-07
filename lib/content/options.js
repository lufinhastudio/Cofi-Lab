// Opciones cerradas que pueden elegir las administradoras. Todo lo visual
// (colores, íconos, plantillas) sale de listas fijas del Brand Book: nunca se
// escribe CSS, tipografías ni medidas a mano.

// Fondos de color permitidos (watermelon queda fuera: el manual no lo usa como fondo).
export const TONES = {
  periwinkle: "Periwinkle (celeste)",
  lemon: "Lemon (amarillo)",
  cantaloupe: "Cantaloupe (naranja)",
  arena: "Arena (beige)",
  crema: "Crema",
  cacao: "Cacao (oscuro)"
};

// Etiquetas pequeñas: acá sí se permite watermelon.
export const TAG_TONES = {
  periwinkle: "Periwinkle (celeste)",
  lemon: "Lemon (amarillo)",
  cantaloupe: "Cantaloupe (naranja)",
  watermelon: "Watermelon (rojo)",
  arena: "Arena (beige)"
};

export const TONE_SWATCHES = {
  periwinkle: "#AFC5FF",
  lemon: "#FCFF82",
  cantaloupe: "#FF9C6D",
  watermelon: "#FD5959",
  arena: "#EFEDE4",
  crema: "#F8F7F2",
  cacao: "#5C5148",
  tinta: "#141414"
};

export const SERVICE_ICONS = {
  strategy: "Estrategia (gráfico)",
  social: "Redes (mensajes)",
  video: "Video",
  camera: "Cámara de fotos",
  paid: "Pauta (megáfono)",
  lab: "Laboratorio"
};

export const PROJECT_STATUS = {
  draft: "Borrador",
  published: "Publicada",
  hidden: "Oculta"
};

// Color del indicador de estado en el panel.
export const STATUS_TONE = { published: "published", draft: "draft", hidden: "hidden" };

// Plantillas de secciones para la página de cada marca. Cada una se dibuja con
// los componentes del sitio (components/site/Gallery.jsx, VideoCard…).
export const SECTION_TEMPLATES = [
  {
    id: "grid",
    kind: "gallery",
    layout: "grid",
    label: "Mosaico de fotos",
    description: "Columnas que respetan la proporción de cada foto. Ideal para muchas fotos.",
    images: { min: 1, max: 60 },
    title: true,
    text: true
  },
  {
    id: "square",
    kind: "gallery",
    layout: "square",
    label: "Grilla cuadrada",
    description: "Fotos recortadas en cuadrado, 3 por fila en computadora y 2 en el celular.",
    images: { min: 1, max: 60 },
    title: true,
    text: true
  },
  {
    id: "row",
    kind: "gallery",
    layout: "row",
    label: "Fila de verticales",
    description: "Fotos verticales en fila. Queda mejor con 5 fotos.",
    images: { min: 1, max: 10 },
    title: true,
    text: true
  },
  {
    id: "single",
    kind: "gallery",
    layout: "single",
    label: "Imagen destacada",
    description: "Una sola foto grande y apaisada.",
    images: { min: 1, max: 1 },
    title: true,
    text: true
  },
  {
    id: "feature",
    kind: "gallery",
    layout: "feature",
    label: "Imagen + texto",
    description: "Una foto acompañada de un texto al costado.",
    images: { min: 1, max: 1 },
    title: true,
    text: true
  },
  {
    id: "video",
    kind: "video",
    layout: "video",
    label: "Reel / video",
    description: "Portada con botón de play que abre el reel (Instagram, TikTok, YouTube…). Todos los reels se agrupan en el bloque «Reels».",
    images: { min: 1, max: 1 },
    title: true,
    text: false,
    link: true
  },
  {
    id: "text",
    kind: "text",
    layout: "text",
    label: "Bloque de texto",
    description: "Texto de campaña o descripción, sin fotos.",
    images: { min: 0, max: 0 },
    title: true,
    text: true
  }
];

export function templateFor(kind, layout) {
  if (kind === "video") return SECTION_TEMPLATES.find((item) => item.id === "video");
  if (kind === "text") return SECTION_TEMPLATES.find((item) => item.id === "text");
  return SECTION_TEMPLATES.find((item) => item.kind === "gallery" && item.layout === layout) || SECTION_TEMPLATES[0];
}

export function templateById(id) {
  return SECTION_TEMPLATES.find((item) => item.id === id) || null;
}
