import type { LeadDraft, LeadMessage, LeadOptionalContactPrompt } from "./lead-types"

const MAX_HISTORY_ITEMS = 36

export function normalizeSource(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
}

export function normalizeText(value: unknown, maxLength = 1200) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : ""
}

export function normalizeHistory(value: unknown): LeadMessage[] {
  if (!Array.isArray(value)) return []

  return value
    .map((item) => {
      if (!item || typeof item !== "object") return null

      const role = "role" in item ? item.role : null
      const content = "content" in item ? normalizeText(item.content, 2400) : ""

      if ((role !== "user" && role !== "assistant") || !content) return null

      return { role, content }
    })
    .filter((item): item is LeadMessage => Boolean(item))
    .slice(-MAX_HISTORY_ITEMS)
}

export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}

export function createLeadDraft(): LeadDraft {
  return {
    budget: "",
    consentAccepted: false,
    email: "",
    hasAskedForBudget: false,
    hasAskedForConsent: false,
    hasAskedForEmail: false,
    hasAskedForName: false,
    hasAskedForOptionalContact: false,
    interest: "",
    isActive: false,
    leadStartedAtMessageIndex: null,
    name: "",
    optionalContactAskCount: 0,
    phone: "",
    projectType: "",
    sent: false,
    wantsClientCopy: false,
  }
}

export function cleanExtractedText(value: string) {
  return value
    .replace(/\s+/g, " ")
    .replace(/[.,;:!?]+$/g, "")
    .trim()
}

export function extractEmail(source: string) {
  return source.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0]?.replace(/[).,;:!?]+$/g, "").trim() ?? ""
}

export function extractPhone(source: string) {
  const matches = source.matchAll(/\+?\d[\d\s().-]{7,}\d/g)

  for (const match of matches) {
    const raw = match[0]
    const start = match.index ?? 0
    const end = start + raw.length
    const phone = cleanExtractedText(raw)
    const digits = phone.replace(/\D/g, "")
    const context = `${source.slice(Math.max(0, start - 28), start)} ${source.slice(end, end + 28)}`
    const normalizedContext = normalizeSource(context)
    const hasPhoneHint = /\b(tel[eé]fono|telefono|tel|m[oó]vil|movil|llamar|llamadme|whatsapp|contacto)\b/.test(
      normalizedContext,
    )
    const hasPriceHint = /\b(precio|presupuesto|coste|tarifa|desde|hasta|euros?|eur|iva|pagar|cobrar)\b|€/.test(
      normalizedContext,
    )

    if (digits.length < 9 || digits.length > 15) continue
    if (hasPriceHint && !hasPhoneHint && !phone.trim().startsWith("+")) continue

    return phone
  }

  return ""
}

export function extractName(source: string) {
  const explicit = source.match(
    /(?:me llamo|mi nombre es|nombre\s*:|soy)\s+([A-Za-zÁÉÍÓÚÜÑáéíóúüñ][^,.;\n]{1,70})/i,
  )
  if (explicit?.[1]) {
    const name = cleanExtractedText(
      explicit[1].split(/\s+(?:y|ya|con|email|correo|tel[eé]fono|telefono|no tengo|quiero|necesito)\b/i)[0] ?? "",
    )
    if (isPlausibleShortName(name)) return name
  }

  return ""
}

export function extractShortName(source: string) {
  const name = cleanExtractedText(source)

  return isPlausibleShortName(name) ? name : ""
}

export function extractOptionalContactName(source: string) {
  const email = extractEmail(source)
  const phone = extractPhone(source)
  const candidate = cleanExtractedText(
    source
      .replace(email, " ")
      .replace(phone, " ")
      .replace(/\b(?:mi\s+)?(?:tel[eé]fono|telefono|tel|m[oó]vil|movil|contacto)\b/gi, " ")
      .replace(/\b(?:es|soy|me llamo|mi nombre es)\b/gi, " ")
      .replace(/\b(?:y|con|para|llamadme|llamarme|whatsapp)\b/gi, " ")
      .replace(/[()[\]{}]/g, " "),
  )

  return extractShortName(candidate)
}

function isPlausibleShortName(value: string) {
  const normalized = normalizeSource(value)
  const stopWords = new Set([
    "acepto",
    "adelante",
    "bar",
    "email",
    "envialo",
    "gracias",
    "hola",
    "mail",
    "ok",
    "presupuesto",
    "restaurante",
    "si",
    "vale",
    "web",
  ])

  if (isOnlyAdminMessage(value)) return false
  if (value.length < 2 || value.length > 42) return false
  if (stopWords.has(normalized)) return false
  if (!/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ' -]+$/.test(value)) return false
  if (value.split(/\s+/).length > 3) return false

  return true
}

export function extractBudget(source: string) {
  const match = source.match(
    /(?:no superar|presupuesto|rango|m[aá]ximo|maximo|hasta|dispongo de|tengo|invertir|poco presupuesto)[^\d€]{0,45}(\d[\d.\s]*(?:,\d+)?\s*(?:€|eur|euros)?(?:\s*(?:-|a|y)\s*\d[\d.\s]*(?:,\d+)?\s*(?:€|eur|euros)?)?)/i,
  )

  return match?.[1] ? cleanExtractedText(match[1]) : ""
}

export function hasPriceQuestion(text: string) {
  return /\b(precio|coste|presupuesto|tarifa|mensualidad|mantenimiento|cuanto cuesta|barato|barata|economico|economica|minimo|desde cuanto|tiempos? de entrega|plazos?)\b/.test(
    normalizeSource(text),
  )
}

export function hasNewLeadRequestIntent(text: string) {
  const normalized = normalizeSource(text)

  return /\b(quiero|necesito|me gustaria|busco|tengo|planteo|crear|hacer)\b[\s\S]{0,180}\b(web|pagina|plataforma|proyecto|presupuesto|precio|coste|ayuntamiento|municipal|restaurante|catalogo|panel|chatbot|agente|visual|imagenes?)\b/.test(
    normalized,
  )
}

export function hasLeadIntent(text: string) {
  const normalized = normalizeSource(text)

  return [
    /\b(presupuesto|propuesta|solicitud)\b[\s\S]{0,140}\b(enviar|envia|envialo|correo|email|mail|contact|persona|responder|pasar|pasame)\b/,
    /\b(enviar|envia|envialo|mandar|mandalo|pasar|pasalo)\b[\s\S]{0,140}\b(resumen|solicitud|datos|persona|correo|email|mail|presupuesto)\b/,
    /\b(contactadme|escribidme|llamadme|que lo vea aplaudia|persona de aplaudia|humano de aplaudia)\b/,
    /\b(que me contacte|que me escriba|que me llame|que me respondan)\b[\s\S]{0,90}\b(aplaudia|alguien|una persona|email|correo)\b/,
    /\b(quiero|necesito|puedes|podeis|me gustaria)\b[\s\S]{0,120}\b(enviar un resumen|hablar con alguien|hablar con una persona|persona de aplaudia)\b/,
  ].some((pattern) => pattern.test(normalized))
}

export function hasSendNowIntent(text: string) {
  const normalized = normalizeSource(text)

  return [
    /\b(envialo|envia|enviarlo ya|mandalo|manda|pasalo|hazlo|adelante|tira palante|tira|por favor envialo)\b/,
    /\b(ya porfa|ya por favor|me estas hablando demasiado|ya te lo he dado|ya te pase el mail|no hace falta|sin telefono|sin movil|sin datos|no quiero dar mas datos|no anadir nada mas)\b/,
    /^(si|vale|ok|de acuerdo|perfecto|acepto|autorizo|consiento)[\s,.:;-]*(envialo|envia|mandalo|hazlo|adelante)?[\s.!]*$/,
  ].some((pattern) => pattern.test(normalized))
}

export function hasOptionalContactSkipIntent(text: string) {
  const normalized = normalizeSource(text)

  return [
    /\b(envialo|envia|enviarlo ya|mandalo|manda|pasalo|hazlo|adelante|tira palante|tira|por favor envialo)\b/,
    /\b(ya porfa|ya por favor|me estas hablando demasiado|ya te lo he dado|ya te pase el mail)\b/,
    /\b(no hace falta|sin telefono|sin movil|sin datos extra|sin mas datos|no quiero dar mas datos|no anadir nada mas|prefiero no)\b/,
    /^(si|vale|ok|de acuerdo|perfecto)[\s,.:;-]*(envialo|envia|mandalo|hazlo|adelante)[\s.!]*$/,
  ].some((pattern) => pattern.test(normalized))
}

export function hasExplicitLeadConsent(text: string) {
  return /\b(acepto|autorizo|doy mi consentimiento|te doy mi consentimiento|consiento|acepto el tratamiento|acepto que aplaudia trate)\b/.test(
    normalizeSource(text),
  )
}

export function hasAffirmativeConsentReply(text: string) {
  return /^(si|vale|ok|de acuerdo|acepto|autorizo|consiento|correcto|perfecto)[\s.!]*$/.test(normalizeSource(text))
}

export function wantsClientCopy(text: string) {
  return /\b(copia|enviame copia|mandame copia|recibir copia|quiero copia|que me llegue copia)\b/.test(
    normalizeSource(text),
  )
}

function isProjectContextText(text: string) {
  const normalized = normalizeSource(text)
  if (!normalized) return false
  if (isOnlyAdminMessage(text)) return false
  if (extractEmail(text) && normalized.replace(extractEmail(text).toLowerCase(), "").trim().length < 8) return false
  if (extractShortName(text) && normalized.split(/\s+/).length <= 3) return false

  return /\b(quiero|necesito|gustaria|web|pagina|landing|presupuesto|precio|coste|tiempo|plazo|negocio|restaurante|reservas?|catalogo|productos?|panel|interno|usuarios?|permisos?|mascotas?|vacunas?|avisos?|recordatorios?|fotos?|carta|barato|barata|sencill[ao]|secciones?|pantallas?|herramienta|control|registro|datos?|seo|whatsapp|chatbot|agente|mantenimiento|visual|video|reels?|ayuntamiento|municipal|municipio|pueblo|institucional|ciudadania|vecinos|tramites?|instancias?|documentacion|fiestas?|eventos?|agenda|instagram|redes|base de datos|cms|wordpress)\b/.test(
    normalized,
  )
}

export function isOnlyAdminMessage(text: string) {
  const normalized = normalizeSource(text).replace(/[.,;:!?]+/g, "").trim()

  return /^(acepto|acepto acepto|vale|vale hazlo|ok|si|gracias|adelante|hazlo|envialo|mandalo|tira palante|ya te lo he dado|ya te pase el mail|por favor envialo|si dime)$/.test(
    normalized,
  )
}

export function buildLeadInterestFromMessages(text: string, messages: LeadMessage[]) {
  const userMessages = [...messages.filter((message) => message.role === "user").map((message) => message.content), text]
  const useful = userMessages.filter(isProjectContextText)
  const source = useful.length > 0 ? useful : userMessages
  const interest = source.slice(-10).join("\n").slice(0, 3600).trim()

  return interest || "Solicitud enviada desde chatbot sin resumen suficiente"
}

export function updateLeadDraftFromMessage(draft: LeadDraft, text: string, messages: LeadMessage[]) {
  const userHistory = messages.filter((message) => message.role === "user").map((message) => message.content)
  const source = [...userHistory, text].join("\n")
  const next: LeadDraft = { ...draft }

  const email = extractEmail(source)
  const phone = extractPhone(source)
  const budget = extractBudget(source)
  const explicitName = extractName(source)
  const optionalContactName = !next.name && next.hasAskedForOptionalContact ? extractOptionalContactName(text) : ""
  const shortName =
    !next.name && (next.isActive || next.hasAskedForName || next.hasAskedForOptionalContact)
      ? optionalContactName || extractShortName(text)
      : ""

  if (email) next.email = email
  if (phone) next.phone = phone
  if (budget) next.budget = budget
  if (explicitName || shortName) next.name = explicitName || shortName
  if (wantsClientCopy(text)) next.wantsClientCopy = true
  if (hasExplicitLeadConsent(text) || (next.hasAskedForConsent && hasAffirmativeConsentReply(text))) {
    next.consentAccepted = true
  }

  next.interest = buildLeadInterestFromMessages(text, messages)
  next.isActive =
    next.isActive ||
    hasLeadIntent(text) ||
    (Boolean(next.email) && next.consentAccepted && (hasPriceQuestion(source) || isProjectContextText(source))) ||
    (hasRecentLeadContext(messages) &&
      (Boolean(email) ||
        Boolean(phone) ||
        Boolean(budget) ||
        Boolean(explicitName) ||
        Boolean(shortName) ||
        hasExplicitLeadConsent(text) ||
        hasAffirmativeConsentReply(text) ||
        wantsClientCopy(text) ||
        hasSendNowIntent(text)))

  return next
}

export function hasRecentLeadContext(messages: LeadMessage[]) {
  return messages.slice(-8).some((message) =>
    /para enviarlo|aceptes que aplaudia trate|enviar un resumen|solicitud.*aplaudia|copia o respuesta|dime el email/i.test(
      message.content,
    ),
  )
}

export function shouldHandleLeadMessage(text: string, messages: LeadMessage[], draft: LeadDraft) {
  if (draft.sent && !hasLeadIntent(text) && !hasRecentLeadContext(messages)) return false
  if (draft.isActive) return true
  if (hasLeadIntent(text)) return true

  return hasRecentLeadContext(messages) && (hasSendNowIntent(text) || Boolean(extractEmail(text)) || hasExplicitLeadConsent(text))
}

export function shouldSendLead(text: string, draft: LeadDraft) {
  if (!draft.email || !draft.consentAccepted) return false
  if (hasSendNowIntent(text)) return true

  return draft.isActive
}

export function shouldAskOptionalContact(
  text: string,
  draft: LeadDraft,
  optionalContactPrompt?: LeadOptionalContactPrompt,
) {
  if (!optionalContactPrompt?.enabled) return false
  if (!draft.email || !draft.consentAccepted || draft.sent) return false
  if (!draft.interest || draft.interest === "Solicitud enviada desde chatbot sin resumen suficiente") return false
  if (hasOptionalContactSkipIntent(text)) return false

  const maxAskCount = optionalContactPrompt.maxAskCount ?? 1
  if (draft.hasAskedForOptionalContact || draft.optionalContactAskCount >= maxAskCount) return false

  const wantsName = optionalContactPrompt.askName !== false && !draft.name
  const wantsPhone = optionalContactPrompt.askPhone !== false && !draft.phone

  return wantsName || wantsPhone
}

export function markOptionalContactAsked(draft: LeadDraft) {
  draft.hasAskedForOptionalContact = true
  draft.optionalContactAskCount += 1
}
