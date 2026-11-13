import { SERVICE_ICONS, TAG_TONES, TONES } from "./options";

// Qué se puede editar en cada área del sitio. El mismo esquema arma el
// formulario del panel y valida los datos en el servidor (lib/content/sanitize.js).
//
// Tipos: text · textarea · image · url · email · phone · select · toggle · tags · list
// "group" agrupa campos en tarjetas dentro del formulario.

const EMPHASIS_HELP = "Podés usar **negrita** y *cursiva*. Dejá una línea en blanco para separar párrafos.";

const toneField = (label = "Color de fondo", options = TONES) => ({ name: "tone", label, type: "select", options });

export const CONTENT_AREAS = {
  home: {
    title: "Inicio",
    description: "Textos, fotos, servicios y números de la página principal.",
    path: "/",
    fields: [
      { group: "Portada", name: "heroLabel", label: "Etiqueta superior", type: "text", max: 60 },
      { group: "Portada", name: "heroTitle", label: "Título principal", type: "textarea", rows: 2, max: 120 },
      { group: "Portada", name: "heroText", label: "Texto debajo del título", type: "textarea", rows: 3, max: 400 },
      { group: "Portada", name: "heroPrimaryCta", label: "Botón principal (va a Contacto)", type: "text", max: 40 },
      { group: "Portada", name: "heroSecondaryCta", label: "Botón secundario (va a Clientes)", type: "text", max: 40 },
      {
        group: "Portada",
        name: "strip",
        label: "Franja de colores",
        help: "Los tres bloques de color debajo de la portada. Llevan a la sección de servicios.",
        type: "list",
        maxItems: 3,
        itemLabel: "Bloque",
        fields: [{ name: "label", label: "Texto", type: "text", max: 30, required: true }, toneField("Color")]
      },

      { group: "Laboratorio creativo", name: "introLabel", label: "Etiqueta", type: "text", max: 60 },
      { group: "Laboratorio creativo", name: "introTitle", label: "Título", type: "textarea", rows: 2, max: 120 },
      { group: "Laboratorio creativo", name: "intro", label: "Texto", type: "textarea", rows: 8, max: 2000, help: EMPHASIS_HELP },
      {
        group: "Laboratorio creativo",
        name: "photos",
        label: "Fotos",
        help: "Hasta 4 fotos verticales (se recortan en 4:5).",
        type: "list",
        maxItems: 4,
        itemLabel: "Foto",
        fields: [
          { name: "url", label: "Foto", type: "image", scope: "site", required: true },
          { name: "alt", label: "Descripción de la foto (accesibilidad)", type: "text", max: 140 }
        ]
      },

      { group: "Servicios", name: "servicesLabel", label: "Etiqueta", type: "text", max: 60 },
      { group: "Servicios", name: "servicesTitle", label: "Título", type: "text", max: 80 },
      { group: "Servicios", name: "servicesText", label: "Bajada", type: "textarea", rows: 2, max: 240 },
      {
        group: "Servicios",
        name: "services",
        label: "Servicios ofrecidos",
        help: "La numeración (01, 02…) se pone sola según el orden.",
        type: "list",
        maxItems: 10,
        itemLabel: "Servicio",
        titleField: "title",
        fields: [
          { name: "title", label: "Nombre del servicio", type: "text", max: 60, required: true },
          { name: "lead", label: "Frase corta", type: "text", max: 140 },
          { name: "items", label: "Qué incluye", type: "tags", maxItems: 10, max: 90, help: "Escribí y apretá Enter para agregar cada punto." },
          { name: "icon", label: "Ícono", type: "select", options: SERVICE_ICONS },
          toneField("Color al pasar el mouse")
        ]
      },

      { group: "Por qué CoFi", name: "positioningLabel", label: "Etiqueta", type: "text", max: 60 },
      { group: "Por qué CoFi", name: "positioningText", label: "Texto destacado", type: "textarea", rows: 4, max: 400 },
      {
        group: "Por qué CoFi",
        name: "positioningTags",
        label: "Etiquetas",
        type: "list",
        maxItems: 6,
        itemLabel: "Etiqueta",
        fields: [{ name: "label", label: "Texto", type: "text", max: 30, required: true }, toneField("Color", TAG_TONES)]
      },
      {
        group: "Por qué CoFi",
        name: "differentiators",
        label: "Diferenciales",
        type: "list",
        maxItems: 8,
        itemLabel: "Diferencial",
        titleField: "title",
        fields: [
          { name: "title", label: "Título", type: "text", max: 60, required: true },
          { name: "text", label: "Texto", type: "textarea", rows: 2, max: 200 }
        ]
      },

      { group: "Números", name: "statsLabel", label: "Etiqueta", type: "text", max: 60 },
      { group: "Números", name: "statsTitle", label: "Título", type: "text", max: 100 },
      {
        group: "Números",
        name: "stats",
        label: "Estadísticas",
        help: "El número se anima contando desde cero. Ej: +12, +7.300, 2 + 2.",
        type: "list",
        maxItems: 4,
        itemLabel: "Número",
        titleField: "label",
        fields: [
          { name: "value", label: "Número", type: "text", max: 16, required: true },
          { name: "label", label: "Qué cuenta", type: "text", max: 40, required: true },
          { name: "note", label: "Nota", type: "text", max: 80 },
          toneField("Color")
        ]
      },

      { group: "Clientes destacados", name: "clientsLabel", label: "Etiqueta", type: "text", max: 60 },
      { group: "Clientes destacados", name: "clientsTitle", label: "Título", type: "text", max: 100 },
      { group: "Clientes destacados", name: "clientsButton", label: "Texto del botón", type: "text", max: 40 },
      {
        group: "Clientes destacados",
        name: "clientsNote",
        type: "note",
        label: "¿Qué marcas aparecen acá?",
        help: "Se muestran las marcas publicadas que tienen la estrella «Destacada en el inicio» (en Marcas y trabajos), en el mismo orden. Las marcas nuevas vienen destacadas; si no hay ninguna destacada, esta sección no aparece."
      },

      { group: "Testimonios", name: "showTestimonials", label: "Mostrar testimonios en el inicio", type: "toggle" },
      { group: "Testimonios", name: "testimonialsLabel", label: "Etiqueta", type: "text", max: 60 },
      { group: "Testimonios", name: "testimonialsTitle", label: "Título", type: "text", max: 80 },

      { group: "Llamado final", name: "finalTitle", label: "Título", type: "textarea", rows: 2, max: 120 },
      { group: "Llamado final", name: "finalButton", label: "Texto del botón", type: "text", max: 40 }
    ]
  },

  clients: {
    title: "Clientes",
    description: "Encabezado de la página que lista todas las marcas.",
    path: "/clientes",
    fields: [
      { name: "label", label: "Etiqueta", type: "text", max: 60 },
      { name: "title", label: "Título", type: "text", max: 60 },
      { name: "lead", label: "Bajada destacada", type: "text", max: 160 },
      { name: "intro", label: "Texto", type: "textarea", rows: 4, max: 800 },
      {
        name: "brandsNote",
        type: "note",
        label: "Las marcas se administran aparte",
        help: "El orden, las portadas y la visibilidad de cada marca se cambian en «Marcas y trabajos»."
      }
    ]
  },

  about: {
    title: "Nosotras",
    description: "Presentación, integrantes, propósito, misión, visión y valores.",
    path: "/nosotras",
    fields: [
      { group: "Presentación", name: "label", label: "Etiqueta", type: "text", max: 60 },
      { group: "Presentación", name: "title", label: "Título", type: "text", max: 80 },
      { group: "Presentación", name: "intro", label: "Texto", type: "textarea", rows: 8, max: 2000, help: EMPHASIS_HELP },
      {
        group: "Equipo",
        name: "team",
        label: "Integrantes",
        help: "Se muestran de a dos por fila en bloques de color.",
        type: "list",
        maxItems: 6,
        itemLabel: "Integrante",
        titleField: "name",
        fields: [
          { name: "name", label: "Nombre", type: "text", max: 60, required: true },
          { name: "role", label: "Rol / frase", type: "text", max: 140 },
          { name: "bio", label: "Biografía", type: "textarea", rows: 6, max: 1500, help: "Dejá una línea en blanco para separar párrafos." },
          { name: "image", label: "Foto", type: "image", scope: "site" },
          toneField("Color del bloque")
        ]
      },
      { group: "Bloque de las perritas", name: "petsName", label: "Nombre", type: "text", max: 60, help: "Dejalo vacío para ocultar este bloque." },
      { group: "Bloque de las perritas", name: "petsLabel", label: "Etiqueta", type: "text", max: 40 },
      { group: "Bloque de las perritas", name: "petsText", label: "Texto", type: "textarea", rows: 3, max: 300 },
      { group: "Bloque de las perritas", name: "petsImage", label: "Foto", type: "image", scope: "site" },

      { group: "Esencia", name: "essenceLabel", label: "Etiqueta", type: "text", max: 60 },
      { group: "Esencia", name: "essenceTitle", label: "Título", type: "text", max: 80 },
      {
        group: "Esencia",
        name: "essence",
        label: "Propósito, misión y visión",
        type: "list",
        maxItems: 4,
        itemLabel: "Bloque",
        titleField: "label",
        fields: [
          { name: "label", label: "Título (ej: Propósito)", type: "text", max: 40, required: true },
          { name: "text", label: "Texto", type: "textarea", rows: 3, max: 400 }
        ]
      },
      { group: "Esencia", name: "valuesLabel", label: "Etiqueta de valores", type: "text", max: 40 },
      {
        group: "Esencia",
        name: "values",
        label: "Valores",
        type: "list",
        maxItems: 10,
        itemLabel: "Valor",
        fields: [{ name: "label", label: "Valor", type: "text", max: 40, required: true }, toneField("Color")]
      },

      { group: "Cierre", name: "closingTitle", label: "Título", type: "textarea", rows: 2, max: 120 },
      { group: "Cierre", name: "closingButton", label: "Texto del botón", type: "text", max: 40 }
    ]
  },

  contact: {
    title: "Contacto",
    description: "Textos, foto y opciones del formulario de contacto.",
    path: "/contacto",
    fields: [
      { group: "Textos", name: "label", label: "Etiqueta", type: "text", max: 60 },
      { group: "Textos", name: "title", label: "Título", type: "text", max: 100 },
      { group: "Textos", name: "highlight", label: "Segunda línea del título", type: "text", max: 80 },
      { group: "Textos", name: "intro", label: "Texto", type: "textarea", rows: 3, max: 400 },
      { group: "Foto", name: "photo", label: "Foto", type: "image", scope: "site" },
      { group: "Foto", name: "photoAlt", label: "Descripción de la foto", type: "text", max: 140 },
      { group: "Foto", name: "photoCaption", label: "Epígrafe", type: "textarea", rows: 2, max: 60, help: "Cada renglón se muestra en una línea." },
      {
        group: "Formulario",
        name: "services",
        label: "Opciones de «Me interesa…»",
        type: "tags",
        maxItems: 12,
        max: 60,
        help: "Las personas eligen una o varias. Escribí y apretá Enter para agregar."
      },
      { group: "Formulario", name: "successTitle", label: "Título al enviar", type: "text", max: 60 },
      { group: "Formulario", name: "successText", label: "Mensaje al enviar", type: "textarea", rows: 2, max: 240 }
    ]
  },

  cofiteca: {
    title: "La CoFiteca",
    description: "Textos de la página de libros, juegos y productos propios, y el aviso «Próximamente».",
    path: "/cofiteca",
    fields: [
      { group: "Encabezado", name: "label", label: "Etiqueta", type: "text", max: 60 },
      { group: "Encabezado", name: "title", label: "Título", type: "text", max: 60 },
      { group: "Encabezado", name: "intro", label: "Texto", type: "textarea", rows: 3, max: 400 },
      {
        group: "Próximamente",
        name: "comingSoonNote",
        type: "note",
        label: "¿Cuándo se ve este bloque?",
        help: "Mientras no haya ningún producto visible en La Cofiteca, la página muestra este aviso. Apenas publiquen el primer producto, se reemplaza solo por el catálogo."
      },
      { group: "Próximamente", name: "comingSoonLabel", label: "Etiqueta", type: "text", max: 40 },
      { group: "Próximamente", name: "comingSoonTitle", label: "Título", type: "text", max: 80 },
      { group: "Próximamente", name: "comingSoonText", label: "Texto", type: "textarea", rows: 3, max: 400 },
      { group: "Próximamente", name: "comingSoonButton", label: "Botón (lleva al Instagram de CoFi)", type: "text", max: 40 },
      {
        group: "Catálogo",
        name: "catalogNote",
        type: "note",
        label: "Los productos se cargan aparte",
        help: "Nombre, fotos, descripción y links de cada producto se administran en «La Cofiteca» del menú."
      },
      { group: "Catálogo", name: "whatsappButton", label: "Botón de consulta por WhatsApp", type: "text", max: 40, help: "Se muestra si hay un WhatsApp cargado en Configuración." },
      { group: "Catálogo", name: "linkButton", label: "Botón del link del producto", type: "text", max: 40 }
    ]
  },

  settings: {
    title: "Configuración",
    description: "Redes sociales, datos de contacto, pie de página y textos para buscadores.",
    fields: [
      { group: "Redes sociales", name: "instagramHandle", label: "Usuario de Instagram de CoFi", type: "text", max: 40, required: true, help: "Ej: @cofi_labb" },
      { group: "Redes sociales", name: "instagramUrl", label: "Link de Instagram de CoFi", type: "url", required: true },
      {
        group: "Redes sociales",
        name: "teamSocials",
        label: "Redes del equipo (pie de página)",
        type: "list",
        maxItems: 6,
        itemLabel: "Persona",
        titleField: "name",
        fields: [
          { name: "name", label: "Nombre", type: "text", max: 40, required: true },
          { name: "handle", label: "Usuario", type: "text", max: 40 },
          { name: "url", label: "Link", type: "url" }
        ]
      },
      { group: "Datos de contacto", name: "email", label: "Email público", type: "email", help: "Vacío = no se muestra." },
      {
        group: "Datos de contacto",
        name: "whatsapp",
        label: "WhatsApp",
        type: "phone",
        help: "Formato internacional sin + ni espacios, ej: 5493511234567. Vacío = no se muestra."
      },
      { group: "Pie de página", name: "footerLabel", label: "Etiqueta", type: "text", max: 40 },
      { group: "Pie de página", name: "footerTitle", label: "Título del llamado", type: "text", max: 100 },
      { group: "Pie de página", name: "footerButton", label: "Texto del botón", type: "text", max: 40 },
      { group: "Encabezado", name: "headerCta", label: "Botón del menú en celulares", type: "text", max: 40 },
      { group: "Buscadores y redes", name: "tagline", label: "Frase de la marca", type: "text", max: 120, help: "Se usa en el título de la pestaña y en el pie." },
      { group: "Buscadores y redes", name: "description", label: "Descripción del sitio", type: "textarea", rows: 3, max: 300, help: "La ven Google y las redes al compartir el link." }
    ]
  }
};

export const CONTENT_KEYS = Object.keys(CONTENT_AREAS);

// Slugs en castellano para las URLs del panel.
export const CONTENT_SLUGS = { inicio: "home", clientes: "clients", nosotras: "about", contacto: "contact", cofiteca: "cofiteca" };
