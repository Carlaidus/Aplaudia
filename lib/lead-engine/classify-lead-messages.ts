import {
  extractEmail,
  extractPhone,
  extractShortName,
  isOnlyAdminMessage,
  normalizeSource,
} from "./extract-lead-data"
import type { ClassifiedLeadMessages, LeadMessage } from "./lead-types"

function hasProjectContext(text: string) {
  const normalized = normalizeSource(text)

  if (!normalized) return false
  if (isOnlyAdminMessage(text)) return false

  return /\b(quiero|necesito|gustaria|web|pagina|landing|presupuesto|precio|coste|tiempo|plazo|negocio|restaurante|reservas?|catalogo|productos?|panel|interno|usuarios?|permisos?|mascotas?|vacunas?|avisos?|recordatorios?|fotos?|carta|barato|barata|sencill[ao]|secciones?|pantallas?|herramienta|control|registro|datos?|seo|whatsapp|chatbot|agente|mantenimiento|visual|video|reels?)\b/.test(
    normalized,
  )
}

function isContactMessage(text: string) {
  if (extractEmail(text)) return true
  if (extractPhone(text)) return true

  return Boolean(extractShortName(text)) && text.trim().split(/\s+/).length <= 3
}

export function classifyLeadMessages(history: LeadMessage[]): ClassifiedLeadMessages {
  const userMessages = history.filter((message) => message.role === "user").map((message) => message.content)
  const adminMessages = userMessages.filter(isOnlyAdminMessage)
  const contactMessages = userMessages.filter((message) => !adminMessages.includes(message) && isContactMessage(message))
  const projectContextMessages = userMessages.filter((message) => {
    if (adminMessages.includes(message)) return false
    if (contactMessages.includes(message) && !hasProjectContext(message)) return false

    return hasProjectContext(message)
  })

  return {
    adminMessages,
    contactMessages,
    projectContextMessages,
    userMessages,
  }
}
