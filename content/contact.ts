export type ContactDeliveryChannel = "email" | "whatsapp"

export type ContactNeedId =
  | "web"
  | "whatsapp-agent"
  | "visuals"
  | "portfolio"
  | "seo"
  | "not-sure"

export const defaultContactNeedIds = ["web"] satisfies ContactNeedId[]
export const defaultContactDeliveryChannel = "email" satisfies ContactDeliveryChannel

export const contactNeeds = [
  {
    id: "web",
    label: "Página web o landing",
    description: "Una web clara, rápida y preparada para convertir visitas en contactos.",
    messageLine: "Página web o landing para presentar mejor mi negocio y captar contactos.",
  },
  {
    id: "whatsapp-agent",
    label: "Agente para WhatsApp",
    description: "Un flujo de atención que responda dudas, ordene reservas o filtre consultas.",
    messageLine: "Agente para WhatsApp que ayude a responder, ordenar reservas o filtrar consultas.",
  },
  {
    id: "visuals",
    label: "Visuales para marca",
    description: "Imágenes, mockups o recursos visuales para que la marca se vea más sólida.",
    messageLine: "Visuales para marca, web o redes con una estética más profesional.",
  },
  {
    id: "portfolio",
    label: "Portfolio o casos",
    description: "Casos reales, capturas y estructura comercial para enseñar mejor el trabajo.",
    messageLine: "Portfolio o casos reales para explicar mejor trabajos ya hechos.",
  },
  {
    id: "seo",
    label: "SEO y estructura",
    description: "Base técnica, textos y datos semánticos para que la web se entienda mejor.",
    messageLine: "SEO técnico, estructura de contenidos y preparación para buscadores e IAs.",
  },
  {
    id: "not-sure",
    label: "No lo tengo claro",
    description: "Tengo una idea o problema y necesito orientación para definir el siguiente paso.",
    messageLine: "Orientación para decidir qué necesita ahora mi proyecto digital.",
  },
] as const satisfies readonly {
  id: ContactNeedId
  label: string
  description: string
  messageLine: string
}[]

export const contactDeliveryOptions = [
  {
    id: "email",
    label: "Email",
    description: "Enviar la consulta por correo.",
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    description: "Abrir WhatsApp con el mensaje preparado.",
  },
] as const satisfies readonly {
  id: ContactDeliveryChannel
  label: string
  description: string
}[]

export function getContactNeed(id: string | null | undefined) {
  return contactNeeds.find((option) => option.id === id)
}

export function getContactNeeds(ids: readonly string[] | null | undefined) {
  const cleanIds = Array.isArray(ids) ? ids : []
  return contactNeeds.filter((option) => cleanIds.includes(option.id))
}

export function getContactDeliveryOption(id: string | null | undefined) {
  return (
    contactDeliveryOptions.find((option) => option.id === id) ??
    contactDeliveryOptions.find((option) => option.id === defaultContactDeliveryChannel) ??
    contactDeliveryOptions[0]
  )
}

export function buildGuidedContactMessage(needIds: readonly string[] | null | undefined) {
  const selectedNeeds = getContactNeeds(needIds)
  const needsText = selectedNeeds.length
    ? selectedNeeds.map((need) => `- ${need.messageLine}`).join("\n")
    : "- Todavía no tengo claro qué servicio concreto necesito."

  return `Hola, Aplaudia. He visto vuestra web y quiero comentar un proyecto digital.

Necesidades que me interesan:
${needsText}

Contexto del negocio:

Qué me gustaría conseguir:

Estado actual o enlaces que debería revisar:

Presupuesto, plazo o urgencia aproximada:`
}
