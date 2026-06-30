export type ContactDeliveryChannel = "email" | "whatsapp"

export type ContactNeedId =
  | "web"
  | "whatsapp-agent"
  | "visuals"
  | "portfolio"
  | "general"

export const defaultContactNeedIds = ["web"] satisfies ContactNeedId[]
export const defaultContactDeliveryChannel = "email" satisfies ContactDeliveryChannel
export const defaultContactDeliveryChannels = ["email"] satisfies ContactDeliveryChannel[]

export const contactNeeds = [
  {
    id: "web",
    label: "Página web o landing",
    messageLabel: "página web o landing",
  },
  {
    id: "whatsapp-agent",
    label: "Agente IA para WhatsApp",
    messageLabel: "agente IA para WhatsApp",
  },
  {
    id: "visuals",
    label: "Visuales para marca",
    messageLabel: "visuales para marca",
  },
  {
    id: "portfolio",
    label: "Portfolio / caso real",
    messageLabel: "portfolio o caso real",
  },
  {
    id: "general",
    label: "Consulta general",
    messageLabel: "consulta general",
  },
] as const satisfies readonly {
  id: ContactNeedId
  label: string
  messageLabel: string
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
    ? selectedNeeds.map((need) => need.messageLabel).join(", ")
    : "consulta general"

  return `Hola, Aplaudia. Me gustaría recibir información sobre ${needsText}. Quiero explicaros mi proyecto y ver cuál sería la mejor forma de enfocarlo.`
}
