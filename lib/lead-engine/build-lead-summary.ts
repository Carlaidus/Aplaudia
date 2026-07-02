import { classifyLeadMessages } from "./classify-lead-messages"
import { normalizeSource } from "./extract-lead-data"
import {
  detectLeadServices,
  detectMaterials,
  getLeadProjectType,
  hasCheapSeekingContext,
  hasHighComplexityContext,
  hasPriceTooLowConcern,
} from "./detect-lead-services"
import { detectQuestions, inferCommercialSignals } from "./infer-commercial-signals"
import type { LeadAnalysis, LeadEngineConfig, LeadMessage } from "./lead-types"

function unique(items: string[]) {
  return Array.from(new Set(items))
}

function buildClientOnlyText(messages: string[], fields: string[]) {
  return [...messages, ...fields].filter(Boolean).join("\n")
}

function buildObjective(projectKind: LeadAnalysis["projectKind"]) {
  if (projectKind === "petClinicTool") {
    return "Crear una herramienta para gestionar mascotas, vacunas, avisos y accesos internos."
  }
  if (projectKind === "municipalInstitutional") {
    return "Crear una web institucional o plataforma municipal con gestion de contenidos, documentacion, agenda, panel interno, automatizaciones y asistente ciudadano."
  }
  if (projectKind === "webApp") {
    return "Crear una herramienta web a medida con panel interno, gestion de datos y funcionalidades especificas."
  }
  if (projectKind === "personal") return "Crear una pagina personal sencilla."
  if (projectKind === "restaurant") return "Crear una web para restaurante o negocio de hosteleria."
  if (projectKind === "generalWeb" || projectKind === "landing" || projectKind === "catalog") {
    return "Crear o mejorar una presencia web."
  }
  if (projectKind === "visual") return "Crear o mejorar piezas visuales para marca o comunicacion."

  return "Orientar una solicitud digital todavia por definir."
}

function buildSummaryForReply(args: {
  materials: string[]
  objective: string
  projectContextText: string
  projectKind: LeadAnalysis["projectKind"]
  projectType: string
  questions: string[]
  requestedServices: string[]
}) {
  const normalized = normalizeSource(args.projectContextText)
  if (args.projectKind === "municipalInstitutional") {
    const priceNote = hasPriceTooLowConcern(normalized)
      ? " Pregunta por precio y tiempo, y percibe que los importes iniciales pueden ser demasiado bajos para el alcance."
      : ""

    return `Cliente plantea una web municipal completa para un ayuntamiento, con organizacion de documentacion actual, informacion del pueblo, agenda de fiestas y eventos, panel de control propio tipo CMS, automatizaciones para publicaciones, chatbot ciudadano con acceso a contenidos y ayuda con instancias. Quiere que el sistema sea ampliable a otros ayuntamientos o pueblos conectados a una misma red/base de datos.${priceNote}`
  }

  const lines = [
    `${args.objective}`,
    `Tipo de proyecto detectado: ${args.projectType}.`,
    args.requestedServices.length > 0 ? `Servicios relevantes: ${args.requestedServices.join(", ")}.` : "",
    args.materials.some((item) => item !== "No indicado") ? `Materiales: ${args.materials.join(", ")}.` : "",
    args.questions.length > 0 ? `Puntos a responder: ${args.questions.slice(0, 4).join(" ")}` : "",
  ].filter(Boolean)

  return lines.slice(0, 5).join(" ")
}

function truncatePhrase(value: string, maxLength = 340) {
  const clean = value.replace(/\s+/g, " ").trim()
  if (clean.length <= maxLength) return clean

  const slice = clean.slice(0, maxLength)
  const sentenceEnd = Math.max(slice.lastIndexOf("."), slice.lastIndexOf("?"), slice.lastIndexOf("!"))
  if (sentenceEnd > 120) return slice.slice(0, sentenceEnd + 1)

  const lastSpace = slice.lastIndexOf(" ")
  return `${slice.slice(0, lastSpace > 120 ? lastSpace : maxLength).trim()}...`
}

function summarizeUsefulPhrase(message: string) {
  const normalized = normalizeSource(message)

  if (/\bayuntamiento\b|\bmunicipal\b/.test(normalized) && /\b(documentacion|fiestas|panel|web entera|web completa)\b/.test(normalized)) {
    return "Quiere crear una web completa para el ayuntamiento con documentacion, informacion del pueblo, fiestas y panel de control amplio."
  }
  if (/\bwordpress\b|\bcms\b|\bpanel interno\b|\bpanel de control\b/.test(normalized) && /\b(chatbot|ia|base de datos)\b/.test(normalized)) {
    return "Quiere un panel tipo WordPress personalizado, pero propio, con IA y chatbot conectado a contenidos y bases de datos."
  }
  if (/\bpueblo de al lado\b|\botros pueblos\b|\bred de municipios\b|\bvarios ayuntamientos\b|\bbase de datos\b/.test(normalized)) {
    return "Quiere que el sistema pueda ampliarse a otros ayuntamientos o pueblos en una red compartida."
  }

  return truncatePhrase(message)
}

function pickUsefulPhrases(projectMessages: string[]) {
  return unique(
    projectMessages
      .map((message) => message.trim())
      .filter((message) => message.length >= 18)
      .filter((message) => !/^(acepto|vale|ok|si|envialo|gracias|carlos)$/i.test(message))
      .map(summarizeUsefulPhrase),
  )
    .filter(Boolean)
    .slice(0, 3)
}

function pickMunicipalUsefulPhrases(projectContextText: string, projectMessages: string[]) {
  const normalized = normalizeSource(projectContextText)
  const phrases: string[] = []

  if (/\bayuntamiento\b|\bmunicipal\b|\bpueblo\b/.test(normalized)) {
    phrases.push(
      "Quiere crear una web completa para el ayuntamiento con documentacion, informacion del pueblo, fiestas y panel de control amplio.",
    )
  }
  if (/\bwordpress\b|\bcms\b|\bpanel interno\b|\bpanel de control\b|\bchatbot\b|\bia\b|\bbase de datos\b/.test(normalized)) {
    phrases.push(
      "Quiere un panel tipo CMS propio, con automatizaciones, IA/chatbot y acceso a contenidos o bases de datos.",
    )
  }
  if (/\bpueblo de al lado\b|\botros pueblos\b|\bred de municipios\b|\bvarios ayuntamientos\b|\bbase de datos entre pueblos\b/.test(normalized)) {
    phrases.push("Quiere que el sistema pueda ampliarse a otros ayuntamientos o pueblos en una red compartida.")
  }

  if (phrases.length >= 2) return unique(phrases).slice(0, 3)

  return pickUsefulPhrases(projectMessages)
    .filter((phrase) => !/\b(email|correo|telefono|tel[eé]fono|acepto|consentimiento)\b/i.test(phrase))
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

  const sensitivity = hasCheapSeekingContext(normalized) ? "high" : "medium"
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
  const objective = buildObjective(project.kind)
  const questions = detectQuestions(projectContextText)
  const usefulClientPhrases =
    project.kind === "municipalInstitutional"
      ? pickMunicipalUsefulPhrases(projectContextText, classifiedMessages.projectContextMessages)
      : pickUsefulPhrases(classifiedMessages.projectContextMessages)
  const assistantPriceLines = extractStrictAssistantPriceLines(args.history)
  const configPriceLines = fallbackPriceLines(args.config, project.kind, projectContextText)
  const normalizedClientText = normalizeSource(clientOnlyText || projectContextText)
  const highComplexity = hasHighComplexityContext(normalizedClientText) || project.kind === "municipalInstitutional"
  const manualReviewPriceLines =
    highComplexity || project.kind === "municipalInstitutional"
      ? configPriceLines.length > 0
        ? []
        : [
            "Proyecto a medida. Requiere revision humana y propuesta por fases.",
            "No se debe cerrar precio por chat ni usar precios de landing/web basica para este alcance.",
          ]
      : []
  const lowPriceWarning =
    highComplexity && assistantPriceLines.length > 0
      ? [
          "Atencion: los importes orientativos comentados en el chat pueden quedarse muy cortos para el alcance descrito. Revisar manualmente antes de responder.",
        ]
      : []
  const priceLines = unique([...manualReviewPriceLines, ...configPriceLines, ...assistantPriceLines, ...lowPriceWarning])
  const commercialSignals = inferCommercialSignals({
    projectContextText,
    projectKind: project.kind,
    requestedServices,
  })
  const summaryForReply = buildSummaryForReply({
    materials,
    objective,
    projectContextText,
    projectKind: project.kind,
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
