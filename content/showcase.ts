export type PortfolioProject = {
  slug: string
  name: string
  businessType: string
  shortDescription: string
  description: string
  image: string
  imageAlt: string
  url: string
  caseHref: string
  visitLabel: string
  accent: string
  whatItIs: string
  audience: string
  whatWasDone: string
  whyItWorks: string
  highlights: readonly string[]
  deliverables: readonly string[]
}

export const showcaseLabels = {
  projectStatus: "Proyecto real",
  caseLink: "Ver caso",
  evidenceLabel: "Puntos clave",
} as const

export const portfolioProjects = [
  {
    slug: "cronoras",
    name: "Cronoras",
    businessType: "SaaS para freelance",
    shortDescription:
      "Aplicación para registrar jornadas, proyectos, facturas y estadísticas con demo pública basada en datos ficticios.",
    description:
      "Cronoras organiza horas, proyectos, empresas, estadísticas y documentación en una experiencia clara para profesionales freelance.",
    image: "/portfolio/cronoras-dashboard.webp",
    imageAlt:
      "Dashboard de Cronoras con métricas de horas, importes, proyectos y demo guiada con datos ficticios.",
    url: "https://cronoras.com/demo-guia.html",
    caseHref: "/casos/cronoras",
    visitLabel: "Probar demo",
    accent: "from-amber-300 to-accent-cyan",
    whatItIs:
      "Un producto digital para controlar horas, proyectos, clientes y facturación desde una interfaz pensada para el trabajo diario.",
    audience:
      "Profesionales freelance y pequeños equipos que necesitan saber dónde se va el tiempo y cuánto queda por cobrar.",
    whatWasDone:
      "Landing/login, demo guiada pública, panel con proyectos, estadísticas, facturas, empresas y estructura preparada para planes.",
    whyItWorks:
      "Vende bien dentro de Aplaudia porque demuestra capacidad para construir un SaaS real, no sólo una landing: producto, interfaz, métricas y despliegue público.",
    highlights: [
      "Dashboard con horas, importes y proyectos.",
      "Demo pública con datos ficticios, sin exponer cuentas reales.",
      "Flujo preparado para planes Free/Pro y facturación.",
      "Interfaz responsive validada para uso diario.",
    ],
    deliverables: [
      "Landing/login y demo pública.",
      "Panel de control con proyectos y estadísticas.",
      "Estructura de planes, facturas y documentos.",
      "Despliegue público con dominio propio.",
    ],
  },
  {
    slug: "arik-custom",
    name: "Arik Custom",
    businessType: "Catálogo y presupuestos",
    shortDescription:
      "Web comercial para personalización textil con catálogo filtrable, selección de productos y solicitud de presupuesto.",
    description:
      "Arik Custom convierte un negocio de personalización textil en una experiencia digital clara: catálogo, servicios, selección y contacto comercial.",
    image: "/portfolio/arik-catalogo.webp",
    imageAlt:
      "Catálogo de Arik Custom con filtros por familia, tipo de prenda y tarjetas de producto personalizable.",
    url: "https://arikcustom.up.railway.app/catalogo",
    caseHref: "/casos/arik-custom",
    visitLabel: "Ver catálogo",
    accent: "from-accent-cyan to-primary",
    whatItIs:
      "Una web comercial para una marca de ropa, accesorios y merchandising personalizados.",
    audience:
      "Empresas, equipos, eventos y clientes que necesitan explorar productos antes de pedir presupuesto.",
    whatWasDone:
      "Home, catálogo filtrable, fichas de producto, selección, presupuesto, servicios de diseño gráfico y contacto.",
    whyItWorks:
      "Funciona como caso porque enseña una web orientada a vender: producto visible, filtros, presupuesto y rutas claras hacia contacto.",
    highlights: [
      "Catálogo filtrable por línea, familia y tipo de prenda.",
      "Selección de productos y solicitud de presupuesto.",
      "Servicios de diseño gráfico integrados.",
      "Contacto comercial y WhatsApp preparados.",
    ],
    deliverables: [
      "Home comercial con vídeo hero.",
      "Catálogo público con filtros y ordenación.",
      "Flujo de selección y presupuesto.",
      "Panel interno protegido para gestión de productos.",
    ],
  },
  {
    slug: "aventuras-pixeladas",
    name: "Aventuras Pixeladas",
    businessType: "Comunidad y contenido",
    shortDescription:
      "Experiencia editorial modular para videojuegos, directos, eventos, blog, historias y música con identidad pixel art propia.",
    description:
      "Aventuras Pixeladas es una web con personalidad fuerte: una home modular tipo cartuchos, contenido editorial y base preparada para crecer.",
    image: "/portfolio/aventuras-pixeladas-home.webp",
    imageAlt:
      "Escena pixel art de Aventuras Pixeladas con habitación retro, consola, pantalla, música y cartel de directo.",
    url: "https://aventuraspixeladas.up.railway.app/",
    caseHref: "/casos/aventuras-pixeladas",
    visitLabel: "Visitar web",
    accent: "from-accent-violet to-accent-magenta",
    whatItIs:
      "Una plataforma editorial y de comunidad alrededor de videojuegos retro, directos, historias, música y eventos.",
    audience:
      "Comunidad gaming, seguidores de directos y lectores que conectan con una estética retro cuidada.",
    whatWasDone:
      "Home modular, identidad visual pixel art, módulos de noticias, blog, historias, música, eventos y base de administración editorial.",
    whyItWorks:
      "Vende bien como ejemplo porque enseña dirección creativa, interfaz memorable y arquitectura preparada para contenido vivo.",
    highlights: [
      "Home modular con cartuchos redimensionables.",
      "Identidad pixel art propia y reconocible.",
      "Noticias, blog, historias, música y eventos.",
      "Base editorial preparada para futuras ampliaciones con IA.",
    ],
    deliverables: [
      "Home interactiva con módulos.",
      "Sistema editorial para blog, noticias e historias.",
      "Assets visuales propios de estilo pixel art.",
      "Estructura técnica preparada para evolucionar.",
    ],
  },
] as const satisfies readonly PortfolioProject[]

export const caseStudies = portfolioProjects

export function getCaseStudy(slug: string) {
  return caseStudies.find((project) => project.slug === slug)
}
