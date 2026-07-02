import { classifyLeadMessages } from "./classify-lead-messages"
import { normalizeSource } from "./extract-lead-data"
import { detectLeadServices, detectMaterials, getLeadProjectType } from "./detect-lead-services"
import { detectQuestions, inferCommercialSignals } from "./infer-commercial-signals"
import type { LeadAnalysis, LeadEngineConfig, LeadMessage } from "./lead-types"

function unique(items: string[]) {
  return Array.from(new Set(items))
}

function buildClientOnlyText(messages: string[], fields: string[]) {
  return [...messages, ...fields].filter(Boolean).join("\n")
}

function buildObjective(projectContextText: string) {
  const normalized = normalizeSource(projectContextText)

  if (/\b(mascotas?|vacunas?|clinica|veterinaria|usuarios?|panel|registro|control)\b/.test(normalized)) {
    return "Crear una herramienta o web-app para gestionar mascotas, vacunas, avisos y accesos internos."
  }
  if (/\b(pagina personal|web personal|portfolio personal|pagina pequena personal)\b/.test(normalized)) {
    return "Crear una pagina personal sencilla y economica."
  }
  if (/\b(restaurantes?|bar|cafeteria|reservas?)\b/.test(normalized)) {
    return "Crear una web de restaurante con sistema o flujo de reservas."
  }
  if (/\b(web|pagina|landing)\b/.test(normalized)) return "Crear o mejorar una presencia web."

  return "Orientar una solicitud digital todavia por definir."
}

function buildSummaryForReply(args: {
  materials: string[]
  objective: string
  projectContextText: string
  projectType: string
  questions: string[]
  requestedServices: string[]
}) {
  const lines = [
    `${args.objective}`,
    `Tipo de proyecto detectado: ${args.projectType}.`,
    args.requestedServices.length > 0 ? `Servicios relevantes: ${args.requestedServices.join(", ")}.` : "",
    args.materials.some((item) => item !== "No indicado") ? `Materiales: ${args.materials.join(", ")}.` : "",
    args.questions.length > 0 ? `Puntos a responder: ${args.questions.slice(0, 4).join(" ")}` : "",
  ].filter(Boolean)

  return lines.slice(0, 5).join(" ")
}

function pickUsefulPhrases(projectMessages: string[]) {
  return projectMessages
    .map((message) => message.trim())
    .filter((message) => message.length >= 18)
    .filter((message) => !/^(acepto|vale|ok|si|envialo|gracias|carlos)$/i.test(message))
    .slice(0, 3)
}

function extractStrictAssistantPriceLines(history: LeadMessage[]) {
  return history
    .filter((message) => message.role === "assistant")
    .flatMap((message) => message.content.split("\n"))
    .map((line) => line.trim().replace(/^[-*]\s+/, ""))
    .filter(Boolean)
    .filter((line) => {
      const normalized = normalizeSource(line)
      if (/para enviarlo|aceptes que|consentimiento|privacidad|newsletter|base de datos|no se guardaran|no se guardarán/.test(normalized)) {
        return false
      }
      if (/sin iva/.test(normalized) && !/\d|€|eur|a medida|desde/.test(normalized)) return false

      return /\bdesde\b[\s\S]{0,30}(€|eur|euros)|\d[\d.\s]*(?:,\d+)?\s*(?:€|eur|euros)|\ba medida\b/.test(normalized)
    })
    .slice(-6)
}

function fallbackPriceLines(config: LeadEngineConfig, projectKind: LeadAnalysis["projectKind"], projectContextText: string) {
  const normalized = normalizeSource(projectContextText)
  const hasPriceIntent = /\b(precio|precios|coste|presupuesto|cuanto cuesta|desde cuanto|barato|barata|tiempos? de entrega)\b/.test(
    normalized,
  )
  if (!hasPriceIntent) return []

  const sensitivity = /\b(barato|barata|economico|economica|lo mas barato|minimo)\b/.test(normalized) ? "high" : "medium"
  const reference = config.priceReferences.find((item) => {
    if (!item.projectKinds.includes(projectKind)) return false
    if (item.sensitivity && item.sensitivity !== sensitivity) return false

    return true
  })

  return reference?.lines ?? []
}

export function buildLeadSummary(args: {
  budget: string
  config: LeadEngineConfig
  email: string
  history: LeadMessage[]
  interest: string
  name: string
  phone: string
  projectType: string
}) {
  const classifiedMessages = classifyLeadMessages(args.history)
  const projectContextText =
    classifiedMessages.projectContextMessages.join("\n") ||
    args.interest ||
    "Solicitud enviada desde chatbot sin resumen suficiente"
  const clientOnlyText = buildClientOnlyText(classifiedMessages.projectContextMessages, [
    args.interest,
    args.budget,
    args.phone,
  ])
  const project = getLeadProjectType(clientOnlyText || projectContextText, args.config, args.projectType)
  const requestedServices = detectLeadServices(clientOnlyText || projectContextText, args.config)
  const materials = detectMaterials(clientOnlyText || projectContextText)
  const objective = buildObjective(projectContextText)
  const questions = detectQuestions(projectContextText)
  const usefulClientPhrases = pickUsefulPhrases(classifiedMessages.projectContextMessages)
  const assistantPriceLines = extractStrictAssistantPriceLines(args.history)
  const configPriceLines = fallbackPriceLines(args.config, project.kind, projectContextText)
  const priceLines = unique([...assistantPriceLines, ...configPriceLines])
  const commercialSignals = inferCommercialSignals({
    projectContextText,
    projectKind: project.kind,
    requestedServices,
  })
  const summaryForReply = buildSummaryForReply({
    materials,
    objective,
    projectContextText,
    projectType: project.label,
    questions,
    requestedServices,
  })

  return {
    budgetLabel: args.budget || "No indicado",
    classifiedMessages,
    clientOnlyText,
    commercialSignals,
    contact: {
      consentAccepted: true,
      email: args.email,
      name: args.name || "No indicado",
      phone: args.phone,
    },
    materials,
    objective,
    priceLines,
    projectContextText,
    projectKind: project.kind,
    projectType: project.label,
    questions,
    requestedServices,
    summaryForReply,
    usefulClientPhrases,
  } satisfies LeadAnalysis
}
