export type ConceptualCase = {
  titleKey: string
  categoryKey: string
  descriptionKey: string
  image: string
  accent: string
}

export type RealProject = {
  name: string
  businessType: string
  description: string
  image: string
  url: string
}

export const showcaseLabels = {
  conceptualPreview: "Vista previa conceptual",
  projectImage: "Imagen del proyecto",
  projectStatus: "Proyecto real",
  projectLink: "Ver proyecto",
  emptyProject: "Tu proyecto podría estar aquí",
} as const

export const conceptualCases = [
  {
    titleKey: "Restaurante elegante",
    categoryKey: "Página web + WhatsApp IA",
    descriptionKey:
      "Concepto de página web para restaurante premium con sistema de reservas y asistente WhatsApp para pedidos.",
    image: "/placeholder-restaurant.jpg",
    accent: "from-primary to-accent-cyan",
  },
  {
    titleKey: "Estudio de yoga",
    categoryKey: "Página web + reservas",
    descriptionKey:
      "Diseño conceptual para estudio de bienestar con calendario de clases integrado y pagos online.",
    image: "/placeholder-yoga.jpg",
    accent: "from-accent-cyan to-accent-violet",
  },
  {
    titleKey: "Boutique de moda",
    categoryKey: "E-commerce + visuales",
    descriptionKey:
      "Tienda online conceptual con visuales mejorados con IA y composiciones fotográficas de producto.",
    image: "/placeholder-fashion.jpg",
    accent: "from-accent-violet to-accent-magenta",
  },
] as const satisfies readonly ConceptualCase[]

export const realProjects = [
  {
    name: "Proyecto demo 1",
    businessType: "Consultoría",
    description:
      "Página web corporativa con diseño moderno y sistema de contacto inteligente.",
    image: "/placeholder-project1.jpg",
    url: "#",
  },
  {
    name: "Proyecto demo 2",
    businessType: "Gastronomía",
    description:
      "Presencia digital completa incluyendo menú interactivo y asistente WhatsApp.",
    image: "/placeholder-project2.jpg",
    url: "#",
  },
] as const satisfies readonly RealProject[]
