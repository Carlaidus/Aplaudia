export type PortfolioImage = {
  src: string
  alt: string
  title: string
  description: string
}

export type PortfolioProofPoint = {
  title: string
  description: string
}

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
  cardTakeaway: string
  whatItIs: string
  audience: string
  whatWasDone: string
  whyItWorks: string
  highlights: readonly string[]
  deliverables: readonly string[]
  stack?: readonly string[]
  results?: readonly string[]
  proofPoints: readonly PortfolioProofPoint[]
  gallery: readonly PortfolioImage[]
}

export const showcaseLabels = {
  projectStatus: "Proyecto real",
  caseLink: "Ver caso",
  evidenceLabel: "Puntos clave",
  takeawayLabel: "Qué enseña",
  galleryLabel: "Vistas clave",
  proofLabel: "Valor visible",
} as const

export const portfolioProjects = [
  {
    slug: "cronoras",
    name: "Cronoras",
    businessType: "SaaS para freelance",
    shortDescription:
      "Aplicación para controlar jornadas, proyectos, importes, facturas y estadísticas con demo pública basada en datos ficticios.",
    description:
      "Cronoras es un producto SaaS para profesionales freelance que necesitan entender horas, cobros, proyectos activos y facturación sin depender de hojas sueltas.",
    image: "/portfolio/cronoras-dashboard.webp",
    imageAlt:
      "Portada de demo de Cronoras con acceso a datos ficticios, dashboard y estadísticas del producto.",
    url: "https://cronoras.com/demo-guia.html",
    caseHref: "/casos/cronoras",
    visitLabel: "Probar demo",
    accent: "from-amber-300 to-accent-cyan",
    cardTakeaway:
      "Demuestra producto real: panel, estados, métricas, proyectos y demo pública preparada para enseñar valor sin datos privados.",
    whatItIs:
      "Un producto digital para registrar tiempo, ordenar proyectos, revisar importes, controlar facturas y tomar decisiones con datos claros.",
    audience:
      "Profesionales freelance y pequeños equipos que quieren saber dónde se va el tiempo, qué proyectos siguen abiertos y cuánto queda por cobrar.",
    whatWasDone:
      "Landing/login, demo guiada pública, panel de control, proyectos, proyecto en curso, estadísticas, facturas, empresas y estructura preparada para planes.",
    whyItWorks:
      "Vende bien dentro de Aplaudia porque enseña capacidad para construir una herramienta completa: interfaz de uso diario, navegación de producto, métricas accionables y despliegue público.",
    highlights: [
      "Dashboard con horas, importes, proyectos y cobros.",
      "Demo pública con datos ficticios, sin exponer cuentas reales.",
      "Vista de proyectos con estados, ingresos y seguimiento.",
      "Estadísticas por periodo para entender evolución y rentabilidad.",
    ],
    deliverables: [
      "Landing/login y demo pública.",
      "Panel de control con proyectos, importes y estados.",
      "Vista de proyecto en curso para registrar sesiones.",
      "Estadísticas, facturas, empresas y base de planes.",
    ],
    stack: ["Dashboard", "Proyectos", "Estadísticas", "Demo pública"],
    proofPoints: [
      {
        title: "Problema claro",
        description:
          "Centraliza tiempo, ingresos, cobros y proyectos para evitar decisiones a ciegas.",
      },
      {
        title: "Interfaz de producto",
        description:
          "No es solo una página de venta: hay panel, menú, estados, tablas y flujos reales.",
      },
      {
        title: "Demo enseñable",
        description:
          "La demo permite probar el producto con datos ficticios sin comprometer información privada.",
      },
    ],
    gallery: [
      {
        src: "/portfolio/cronoras-app-dashboard.webp",
        alt: "Dashboard de Cronoras con métricas de trabajo sin facturar, facturas pendientes, proyectos y datos de demo.",
        title: "Dashboard de producto",
        description:
          "Vista principal de uso diario con horas, importes, proyectos y cobros para entender el negocio en segundos.",
      },
      {
        src: "/portfolio/cronoras-proyectos.webp",
        alt: "Vista de proyectos de Cronoras con clientes, fechas, horas, ingresos y estados de cobro.",
        title: "Control de proyectos",
        description:
          "Listado real de la demo con clientes, horas, ingresos y estados para revisar de un vistazo qué está en curso o cobrado.",
      },
      {
        src: "/portfolio/cronoras-estadisticas.webp",
        alt: "Pantalla de estadísticas de Cronoras con métricas de cobro, horas y gráfico de ingresos por periodo.",
        title: "Estadísticas accionables",
        description:
          "Métricas por periodo para entender horas, cobros, tarifa media y evolución del trabajo.",
      },
    ],
  },
  {
    slug: "arik-custom",
    name: "Arik Custom",
    businessType: "Catálogo y presupuestos",
    shortDescription:
      "Web comercial para personalización textil con portada de marca, catálogo filtrable, selección de productos y solicitud de presupuesto.",
    description:
      "Arik Custom transforma un negocio de ropa, accesorios y merchandising personalizados en una experiencia digital con mensaje claro, catálogo y camino directo a presupuesto.",
    image: "/portfolio/arik-home.webp",
    imageAlt:
      "Portada de Arik Custom con navegación, mensaje comercial y llamadas a catálogo y presupuesto.",
    url: "https://arikcustom.up.railway.app/",
    caseHref: "/casos/arik-custom",
    visitLabel: "Visitar web",
    accent: "from-accent-cyan to-primary",
    cardTakeaway:
      "Enseña una web comercial completa: portada, posicionamiento, catálogo, producto seleccionable y presupuesto.",
    whatItIs:
      "Una web comercial para una marca de ropa, accesorios y merchandising personalizados.",
    audience:
      "Empresas, equipos, eventos y clientes que necesitan explorar productos, entender servicios y pedir presupuesto con claridad.",
    whatWasDone:
      "Home de marca, catálogo filtrable, fichas de producto, selección, presupuesto, servicios de diseño gráfico, técnicas y contacto comercial.",
    whyItWorks:
      "Funciona como caso porque no se limita a enseñar productos: ordena una oferta comercial completa y lleva al visitante desde la portada hasta el presupuesto.",
    highlights: [
      "Portada con promesa clara y CTAs a catálogo y presupuesto.",
      "Catálogo filtrable por línea, familia y tipo de prenda.",
      "Selección de productos para preparar solicitud comercial.",
      "Servicios de diseño gráfico y técnicas integrados en la navegación.",
    ],
    deliverables: [
      "Home comercial con vídeo hero.",
      "Catálogo público con filtros y ordenación.",
      "Flujo de selección y presupuesto.",
      "Panel interno protegido para gestión de productos.",
    ],
    stack: ["Home comercial", "Catálogo filtrable", "Panel interno", "Presupuesto"],
    proofPoints: [
      {
        title: "Primera impresión de marca",
        description:
          "La portada explica el negocio y dirige rápido a las dos acciones principales: catálogo y presupuesto.",
      },
      {
        title: "Catálogo vendible",
        description:
          "Los filtros convierten muchas referencias en una búsqueda manejable para el cliente.",
      },
      {
        title: "Camino comercial",
        description:
          "La web no se queda en escaparate: prepara selección, presupuesto y contacto.",
      },
    ],
    gallery: [
      {
        src: "/portfolio/arik-catalogo.webp",
        alt: "Catálogo de Arik Custom centrado en filtros, buscador, familias, tipos de prenda y tarjetas de producto personalizable.",
        title: "Catálogo filtrable",
        description:
          "Vista real enfocada en filtros, buscador y familias para que el visitante pase de explorar a preparar una solicitud concreta.",
      },
      {
        src: "/portfolio/arik-dashboard.webp",
        alt: "Panel interno real de Arik Custom con dashboard, productos activos, líneas, familias, acciones rápidas y últimos productos.",
        title: "Panel interno",
        description:
          "Dashboard real de gestión con productos activos, líneas, familias, accesos rápidos y listado de últimos productos.",
      },
      {
        src: "/portfolio/arik-presupuesto.webp",
        alt: "Solicitud real de presupuesto de Arik Custom con producto añadido, cantidad, datos de contacto y opciones de envío.",
        title: "Solicitud de presupuesto",
        description:
          "Flujo comercial real con producto seleccionado, cantidades, datos de contacto y canales de envío de la solicitud.",
      },
    ],
  },
  {
    slug: "aventuras-pixeladas",
    name: "Aventuras Pixeladas",
    businessType: "Comunidad y contenido",
    shortDescription:
      "Experiencia editorial modular para videojuegos, directos, eventos, noticias, historias y música con identidad pixel art propia.",
    description:
      "Aventuras Pixeladas es una web de comunidad con dirección visual fuerte, cartuchos de navegación, paneles vivos de contenido y base editorial preparada para crecer.",
    image: "/portfolio/aventuras-pixeladas-home.webp",
    imageAlt:
      "Home de Aventuras Pixeladas con hero pixel art, cartuchos de navegación y paneles de evento, artículo, directo y música.",
    url: "https://aventuraspixeladas.up.railway.app/",
    caseHref: "/casos/aventuras-pixeladas",
    visitLabel: "Visitar web",
    accent: "from-accent-violet to-accent-magenta",
    cardTakeaway:
      "Vende dirección creativa y sistema modular: cartuchos, paneles, eventos, directos, música y contenido editorial con personalidad.",
    whatItIs:
      "Una plataforma editorial y de comunidad alrededor de videojuegos retro, directos, historias, música, eventos y noticias.",
    audience:
      "Comunidad gaming, seguidores de directos y lectores que conectan con una estética retro cuidada y una experiencia con mucho carácter.",
    whatWasDone:
      "Home modular, cartuchos de navegación, paneles de evento/directo/música, identidad visual pixel art, secciones de contenido y base de administración editorial.",
    whyItWorks:
      "Vende bien como ejemplo porque combina marca, interfaz memorable, arquitectura de contenido y herramientas para mantener la web viva sin rehacerla cada vez.",
    highlights: [
      "Cartuchos visuales para organizar secciones y dirigir al usuario.",
      "Paneles de evento, directo y música pensados como bloques vivos.",
      "Identidad pixel art propia, reconocible y coherente.",
      "Base editorial y admin preparada para noticias, historias, eventos y media.",
    ],
    deliverables: [
      "Home interactiva con cartuchos y módulos.",
      "Sistema editorial para blog, noticias e historias.",
      "Paneles para eventos, directos, música y contenido destacado.",
      "Assets visuales propios de estilo pixel art.",
    ],
    stack: ["Home modular", "Cartuchos", "Paneles vivos", "Responsive"],
    proofPoints: [
      {
        title: "Sistema de cartuchos",
        description:
          "La navegación se convierte en piezas visuales reconocibles, no en simples enlaces.",
      },
      {
        title: "Paneles vivos",
        description:
          "Evento, directo, música y artículo destacado funcionan como zonas actualizables de la home.",
      },
      {
        title: "Escalable",
        description:
          "La base editorial permite crecer en noticias, historias, media y administración sin perder identidad.",
      },
    ],
    gallery: [
      {
        src: "/portfolio/aventuras-cartuchos.webp",
        alt: "Cartuchos reales de la home responsive de Aventuras Pixeladas para directos, historias, música, eventos, noticias y Twitch.",
        title: "Cartuchos de la portada",
        description:
          "Secciones principales convertidas en piezas visuales reconocibles, con iconos, color y mensajes propios.",
      },
      {
        src: "/portfolio/aventuras-paneles.webp",
        alt: "Paneles de Aventuras Pixeladas con próximo evento, próximo directo y música en reproducción.",
        title: "Paneles de contenido",
        description:
          "Bloques para evento, directo y música que hacen que la home parezca viva y actualizable.",
      },
      {
        src: "/portfolio/aventuras-responsive.webp",
        alt: "Vista responsive real de Aventuras Pixeladas con cabecera, hero pixel art y cartuchos principales.",
        title: "Experiencia responsive",
        description:
          "La identidad pixel art se mantiene en una vista responsive con navegación compacta, hero visual y módulos reconocibles.",
      },
    ],
  },
] as const satisfies readonly PortfolioProject[]

export const caseStudies: readonly PortfolioProject[] = portfolioProjects

export function getCaseStudy(slug: string) {
  return caseStudies.find((project) => project.slug === slug)
}
