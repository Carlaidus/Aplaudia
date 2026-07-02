import { aplaudiaLeadConfig } from "../../content/lead/aplaudia-lead-config"
import { buildLeadSummary, isValidEmail, normalizeHistory, normalizeText } from "../lead-engine"
import type { LeadMessage } from "../lead-engine"

export type AgentQuoteHistoryMessage = LeadMessage

export type AgentQuoteAnalysisInput = {
  budget: string
  email: string
  history: AgentQuoteHistoryMessage[]
  interest: string
  name: string
  phone: string
  projectType: string
  sessionId: string
}

export type AgentQuoteAnalysis = {
  budgetLabel: string
  clarity: string
  clientOnlyText: string
  clientType: string
  detectedServices: string[]
  executiveSummary: string[]
  friction: string
  interest: string
  materials: string[]
  name: string
  nextAction: string
  objections: string[]
  priceFocus: string
  priceSensitivity: string
  projectType: string
  summary: ReturnType<typeof buildConversationSummary>
  urgency: string
}

export { isValidEmail, normalizeHistory, normalizeText }

export function buildConversationSummary(history: AgentQuoteHistoryMessage[]) {
  const userMessages = history.filter((item) => item.role === "user").map((item) => item.content)
  const assistantMessages = history.filter((item) => item.role === "assistant").map((item) => item.content)
  const priceLines = assistantMessages
    .flatMap((message) => message.split("\n"))
    .map((line) => line.trim().replace(/^[-*]\s+/, ""))
    .filter((line) => /\bdesde\b|\d[\d.\s]*(?:,\d+)?\s*(?:€|eur|euros)|\ba medida\b/i.test(line))
    .slice(-6)

  return {
    lastUserMessages: userMessages.slice(-6),
    latestRelevantMessages: userMessages.slice(-6).map((message) => `Cliente: ${message}`),
    priceQuestionCount: userMessages.filter((message) =>
      /\b(precio|coste|presupuesto|tarifa|mensualidad|mantenimiento|cu[aá]nto cuesta|barato|barata|econ[oó]mico|econ[oó]mica|desde cu[aá]nto)\b/i.test(
        message,
      ),
    ).length,
    priceLines,
    questions: userMessages.filter((message) => message.includes("?") || message.includes("¿")).slice(-6),
    transcript: [],
    userMessages,
  }
}

export function analyzeAgentQuote(input: AgentQuoteAnalysisInput): AgentQuoteAnalysis {
  const history = normalizeHistory(input.history)
  const analysis = buildLeadSummary({
    budget: input.budget,
    config: aplaudiaLeadConfig,
    email: input.email,
    history,
    interest: input.interest,
    name: input.name,
    phone: input.phone,
    projectType: input.projectType,
  })
  const summary = buildConversationSummary(history)
  const urgency =
    analysis.commercialSignals.urgency?.replace(/^Urgencia\s+/i, "").replace(/\.$/, "") ??
    analysis.commercialSignals.timeline ??
    "No indicada"
  const priceSensitivity =
    analysis.commercialSignals.priceSensitivity?.replace(/^Sensibilidad al precio\s+/i, "").replace(/\.$/, "") ??
    "No detectada"

  return {
    budgetLabel: analysis.budgetLabel,
    clarity: analysis.commercialSignals.clarity ?? "Inicial",
    clientOnlyText: analysis.clientOnlyText,
    clientType: analysis.projectType,
    detectedServices: analysis.requestedServices,
    executiveSummary: analysis.summaryForReply.split(/(?<=\.)\s+/).filter(Boolean).slice(0, 5),
    friction: analysis.commercialSignals.friction ?? "No detectada",
    interest: analysis.projectContextText,
    materials: analysis.materials,
    name: analysis.contact.name,
    nextAction: analysis.commercialSignals.nextAction,
    objections: analysis.questions,
    priceFocus: analysis.priceLines.length > 0 ? "Sí, ha preguntado por precio" : "No detectado",
    priceSensitivity,
    projectType: analysis.projectType,
    summary: {
      ...summary,
      latestRelevantMessages: analysis.usefulClientPhrases.map((phrase) => `Cliente: ${phrase}`),
      priceLines: analysis.priceLines,
    },
    urgency,
  }
}
