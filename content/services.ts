export type ServiceId = "web" | "whatsapp" | "visuals"

export type ServiceDefinition = {
  id: ServiceId
  translationKey: ServiceId
  name: string
  description: string
  serviceType: string
  landingAnchor: string
  futurePath: string
}

export const services = [
  {
    id: "web",
    translationKey: "web",
    name: "Páginas web premium",
    description:
      "Diseño y desarrollo de páginas web rápidas, cuidadas y orientadas a conversión para negocios que quieren una presencia digital profesional.",
    serviceType: "Diseño y desarrollo web",
    landingAnchor: "#servicios",
    futurePath: "/servicios/paginas-web",
  },
  {
    id: "whatsapp",
    translationKey: "whatsapp",
    name: "Agentes IA para WhatsApp",
    description:
      "Asistentes conversacionales para WhatsApp que ayudan a responder clientes, orientar consultas y preparar reservas o solicitudes de contacto.",
    serviceType: "Asistente IA para WhatsApp",
    landingAnchor: "#whatsapp",
    futurePath: "/servicios/agentes-ia-whatsapp",
  },
  {
    id: "visuals",
    translationKey: "visuals",
    name: "Visuales mejorados con IA",
    description:
      "Mejora, composición y generación de recursos visuales con IA para web, redes, pantallas y presentaciones.",
    serviceType: "Contenido visual con IA",
    landingAnchor: "#servicios",
    futurePath: "/servicios/visuales-ia",
  },
] as const satisfies readonly ServiceDefinition[]

export const serviceIds = services.map((service) => service.id) as ServiceId[]
