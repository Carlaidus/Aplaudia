export type ContactDeliveryChannel = "email" | "whatsapp" | "both"

export type ContactProjectType =
  | "web"
  | "whatsapp-agent"
  | "visuals"
  | "portfolio"
  | "general"

export const defaultContactProjectType = "web" satisfies ContactProjectType
export const defaultContactDeliveryChannel = "email" satisfies ContactDeliveryChannel

export const contactProjectOptions = [
  {
    id: "web",
    label: "Página web",
    guidedMessage:
      "Hola, Aplaudia. Quiero hablar sobre una página web para mi negocio.\n\nAhora mismo tengo:\n\nMe gustaría conseguir:\n\nPresupuesto o urgencia aproximada:",
  },
  {
    id: "whatsapp-agent",
    label: "Agente IA para WhatsApp",
    guidedMessage:
      "Hola, Aplaudia. Me interesa un agente para WhatsApp que ayude a responder consultas.\n\nTipo de negocio:\n\nQué preguntas debería responder:\n\nCómo gestionamos ahora los mensajes:",
  },
  {
    id: "visuals",
    label: "Visuales para marca",
    guidedMessage:
      "Hola, Aplaudia. Quiero mejorar la parte visual de mi marca o web.\n\nQué material tengo ahora:\n\nDónde se usará:\n\nEstilo que busco:",
  },
  {
    id: "portfolio",
    label: "Portfolio o caso real",
    guidedMessage:
      "Hola, Aplaudia. Quiero preparar un portfolio o caso real para enseñar mejor mi trabajo.\n\nQué proyecto quiero mostrar:\n\nQué partes conviene destacar:\n\nDónde se publicará:",
  },
  {
    id: "general",
    label: "Consulta general",
    guidedMessage:
      "Hola, Aplaudia. Quiero comentar una idea o necesidad digital.\n\nContexto del negocio:\n\nQué necesito resolver:\n\nSiguiente paso que me gustaría:",
  },
] as const satisfies readonly {
  id: ContactProjectType
  label: string
  guidedMessage: string
}[]

export const contactDeliveryOptions = [
  {
    id: "email",
    label: "Email",
    description: "Envía la consulta por correo para responderla con calma.",
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    description: "Abre WhatsApp con el mensaje preparado para enviarlo tú.",
  },
  {
    id: "both",
    label: "Ambos",
    description: "Envía email y deja WhatsApp preparado como refuerzo.",
  },
] as const satisfies readonly {
  id: ContactDeliveryChannel
  label: string
  description: string
}[]

export function getContactProjectOption(id: string | null | undefined) {
  return (
    contactProjectOptions.find((option) => option.id === id) ??
    contactProjectOptions.find((option) => option.id === defaultContactProjectType) ??
    contactProjectOptions[0]
  )
}

export function getContactDeliveryOption(id: string | null | undefined) {
  return (
    contactDeliveryOptions.find((option) => option.id === id) ??
    contactDeliveryOptions.find((option) => option.id === defaultContactDeliveryChannel) ??
    contactDeliveryOptions[0]
  )
}
