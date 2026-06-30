export type FutureRoute = {
  path: string
  purpose: string
}

export const futureRoutes = [
  {
    path: "/servicios/paginas-web",
    purpose: "Página específica para el servicio de páginas web premium.",
  },
  {
    path: "/servicios/agentes-ia-whatsapp",
    purpose: "Página específica para agentes IA conectados a WhatsApp.",
  },
  {
    path: "/servicios/visuales-ia",
    purpose:
      "Página específica para visuales y contenido generado o mejorado con IA.",
  },
  {
    path: "/casos",
    purpose: "Índice de casos, demos y trabajos validados.",
  },
  {
    path: "/sobre-aplaudia",
    purpose: "Página corporativa ampliada sobre Aplaudia.",
  },
  {
    path: "/contacto",
    purpose:
      "Página o sección ampliada para consultas comerciales y seguimiento de proyectos.",
  },
  {
    path: "/recursos",
    purpose: "Recursos editoriales y contenido educativo futuro.",
  },
] as const satisfies readonly FutureRoute[]
