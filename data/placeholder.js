// Contenido de EJEMPLO para maquetar mientras no hay base de datos.
// Se reemplaza con la información real (página actual + Instagram) y después
// se carga desde el admin. No se muestra cuando DATABASE_URL está configurado.

export const placeholderContent = {
  projects: [
    {
      id: "ejemplo-angus",
      slug: "angus",
      clientName: "Angus",
      title: "Una marca, distintas campañas",
      workType: "Campañas · Contenido para redes",
      summary: "Ejemplo de trabajo con “Ver más”: la marca en general y, adentro, cada campaña.",
      coverUrl: "",
      media: [],
      featured: true,
      visible: true,
      sortOrder: 0,
      sections: [
        { id: "ejemplo-angus-1", title: "Campaña de lanzamiento", concept: "Concepto de ejemplo", description: "Fotos, piezas y contenido para redes de esta campaña.", media: [], visible: true, sortOrder: 0 },
        { id: "ejemplo-angus-2", title: "Campaña hamburguesas", concept: "Concepto de ejemplo", description: "Otra campaña dentro del mismo cliente.", media: [], visible: true, sortOrder: 1 }
      ]
    },
    {
      id: "ejemplo-2",
      slug: "proyecto-ejemplo",
      clientName: "Cliente de ejemplo",
      title: "Identidad y contenido",
      workType: "Branding",
      summary: "Trabajo simple, sin contenido extra.",
      coverUrl: "",
      media: [],
      featured: false,
      visible: true,
      sortOrder: 1,
      sections: []
    }
  ],
  products: [
    {
      id: "ejemplo-libro",
      slug: "libro-ejemplo",
      name: "Libro de ejemplo",
      category: "libro",
      shortDescription: "Descripción breve del libro.",
      description: "",
      images: [],
      whatsappMessage: "",
      visible: true,
      sortOrder: 0
    },
    {
      id: "ejemplo-juego",
      slug: "juego-ejemplo",
      name: "Juego de ejemplo",
      category: "juego",
      shortDescription: "Descripción breve del juego.",
      description: "",
      images: [],
      whatsappMessage: "",
      visible: true,
      sortOrder: 1
    }
  ],
  testimonials: [
    {
      id: "ejemplo-testimonio",
      quote: "Acá va la opinión de un cliente.",
      authorName: "Nombre Apellido",
      company: "Marca",
      logoUrl: "",
      visible: true,
      sortOrder: 0
    }
  ]
};
