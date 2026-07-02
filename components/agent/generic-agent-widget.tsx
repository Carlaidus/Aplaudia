"use client"

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react"
import { ArrowDown, Bot, Loader2, MessageCircle, Mic, MicOff, Send, Sparkles, X } from "lucide-react"

import { cn } from "@/lib/utils"
import type { AgentMessage, AgentWidgetConfig, AgentWidgetTheme } from "@/lib/agent/types"

type SpeechRecognitionAlternativeLike = {
  transcript: string
}

type SpeechRecognitionResultLike = {
  readonly isFinal: boolean
  readonly length: number
  [index: number]: SpeechRecognitionAlternativeLike
}

type SpeechRecognitionResultListLike = {
  readonly length: number
  [index: number]: SpeechRecognitionResultLike
}

type SpeechRecognitionEventLike = Event & {
  readonly resultIndex?: number
  results: SpeechRecognitionResultListLike
}

type SpeechRecognitionErrorEventLike = Event & {
  error?: string
}

type SpeechRecognitionLike = {
  lang: string
  continuous: boolean
  interimResults: boolean
  onstart: (() => void) | null
  onresult: ((event: SpeechRecognitionEventLike) => void) | null
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null
  onend: (() => void) | null
  start: () => void
  stop: () => void
}

type SpeechRecognitionConstructorLike = new () => SpeechRecognitionLike

type SpeechRecognitionWindow = Window & {
  SpeechRecognition?: SpeechRecognitionConstructorLike
  webkitSpeechRecognition?: SpeechRecognitionConstructorLike
}

const DEFAULT_THEME: Required<AgentWidgetTheme> = {
  assistantAvatar: "border-primary/30 bg-primary/15 text-primary",
  assistantBubble: "w-full max-w-full rounded-bl-sm bg-card text-foreground",
  floatingButton: "bg-primary text-primary-foreground shadow-primary/30 hover:bg-primary/90",
  floatingSparkle: "text-accent",
  header: "border-border bg-card/80",
  input: "border-border bg-card text-foreground placeholder:text-muted-foreground focus:border-primary",
  micActive: "border-accent/60 bg-accent/15 text-accent shadow-lg shadow-accent/20",
  micIdle: "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground",
  micPing: "bg-accent/20",
  micUnsupported: "border-border/70 bg-card/70 text-muted-foreground/60",
  onlineDot: "bg-accent",
  panel: "border-white/10 bg-background/95 shadow-primary/20",
  scrollHint: "border-white/10 bg-background/60 text-primary/80 shadow-primary/15 hover:border-primary/35 hover:bg-background/80 hover:text-primary",
  sendButton: "bg-primary text-primary-foreground hover:bg-primary/90",
  unreadBadge: "bg-accent text-accent-foreground",
  userBubble: "max-w-[94%] rounded-br-sm bg-primary text-primary-foreground sm:max-w-[88%]",
  voiceStatusActive: "text-accent",
}

const INLINE_MARKDOWN_PATTERN = /(\*\*[^*]+?\*\*|\[[^\]]+?\]\([^)]+?\)|https?:\/\/[^\s<>()]+)/g
const VOICE_SILENCE_TIMEOUT_MS = 3600
const VOICE_RESTART_DELAY_MS = 220
const VOICE_MAX_AUTO_RESTARTS = 5
const NON_RETRYABLE_VOICE_ERRORS = new Set(["not-allowed", "service-not-allowed", "audio-capture"])
const LEAD_CONSENT_TEXT =
  "Para enviarlo, necesito que aceptes que Aplaudia trate los datos que has facilitado y el resumen de tu solicitud solo para gestionar esta consulta y responderte por email. No se guardarán en una base de datos. Los importes comentados son orientativos y sin IVA. ¿Aceptas?"

type ConversationalLeadDetails = {
  budget: string
  clientCopy: boolean
  email: string
  hasConsent: boolean
  interest: string
  missingFields: string[]
  name: string
  phone: string
  projectType: string
  shouldHandle: boolean
}

type LeadDraft = Omit<ConversationalLeadDetails, "missingFields" | "shouldHandle"> & {
  hasAskedConsent: boolean
  hasAskedEmail: boolean
  hasAskedName: boolean
  isActive: boolean
  sent: boolean
}

function createEmptyLeadDraft(): LeadDraft {
  return {
    budget: "",
    clientCopy: false,
    email: "",
    hasAskedConsent: false,
    hasAskedEmail: false,
    hasAskedName: false,
    hasConsent: false,
    interest: "",
    isActive: false,
    name: "",
    phone: "",
    projectType: "",
    sent: false,
  }
}

function normalizeLeadText(text: string) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
}

function hasRecentLeadContext(messages: AgentMessage[]) {
  return messages.slice(-8).some((message) =>
    /para enviarlo|aceptes que aplaudia trate|enviar un resumen|solicitud.*aplaudia|copia o respuesta/i.test(
      message.content,
    ),
  )
}

function hasLeadIntent(text: string) {
  const normalized = normalizeLeadText(text)

  return [
    /\b(presupuesto|propuesta|solicitud)\b[\s\S]{0,120}\b(enviar|envia|envialo|correo|email|mail|contact|persona)\b/i,
    /\b(enviar|envia|envialo|mandar|mandalo|pasar|pasalo)\b[\s\S]{0,120}\b(resumen|solicitud|datos|aplaudia|persona|correo|email|mail)\b/i,
    /\b(contactadme|escribidme|llamadme|que lo vea aplaudia|persona de aplaudia|humano de aplaudia)\b/i,
    /\b(que me contacte|que me escriba|que me llame|que me respondan)\b[\s\S]{0,80}\b(aplaudia|alguien|una persona|email|correo)\b/i,
    /\b(quiero|me gustaria|necesito|puedes|podeis)\b[\s\S]{0,100}\b(hablar con alguien|hablar con una persona|persona de aplaudia|enviar un resumen)\b/i,
  ].some((pattern) => pattern.test(normalized))
}

function hasPriceQuestion(text: string) {
  return /\b(precio|coste|presupuesto|tarifa|mensualidad|mantenimiento|cuanto cuesta|barato|economico|desde cuanto)\b/i.test(
    normalizeLeadText(text),
  )
}

function hasSendNowIntent(text: string) {
  return [
    /\b(envialo|envia|enviarlo ya|mandalo|manda|mándalo|pasalo|hazlo|adelante|tira)\b/i,
    /\b(ya porfa|ya por favor|me estas hablando demasiado|me estás hablando demasiado)\b/i,
    /^(si|sí|vale|ok|de acuerdo|perfecto)[\s,.:;-]*(envialo|envia|mandalo|hazlo|adelante)?[\s.!]*$/i,
  ].some((pattern) => pattern.test(normalizeLeadText(text)))
}

function hasExplicitLeadConsent(text: string) {
  return /\b(acepto|autorizo|doy mi consentimiento|te doy mi consentimiento|consiento|acepto el tratamiento|acepto que aplaudia trate)\b/i.test(
    normalizeLeadText(text),
  )
}

function hasAffirmativeConsentReply(text: string) {
  return /^(si|sí|vale|ok|de acuerdo|acepto|autorizo|consiento|correcto|perfecto)[\s.!]*$/i.test(
    normalizeLeadText(text),
  )
}

function wantsClientCopy(text: string) {
  return /\b(copia|enviame copia|mandame copia|recibir copia|quiero copia|que me llegue copia)\b/i.test(
    normalizeLeadText(text),
  )
}

function cleanExtractedText(value: string) {
  return value
    .replace(/\s+/g, " ")
    .replace(/[.,;:]+$/g, "")
    .trim()
}

function extractEmail(source: string) {
  return source.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0]?.replace(/[).,;:!?]+$/g, "").trim() ?? ""
}

function extractPhone(source: string) {
  const match = source.match(/(?:\+?\d[\d\s().-]{7,}\d)/)
  if (!match) return ""

  const phone = cleanExtractedText(match[0])
  const digits = phone.replace(/\D/g, "")
  return digits.length >= 9 ? phone : ""
}

function extractName(source: string) {
  const match = source.match(
    /(?:me llamo|mi nombre es|nombre\s*:|soy)\s+([A-Za-zÁÉÍÓÚÜÑáéíóúüñ][^,.;\n]{1,70})/i,
  )
  if (!match?.[1]) return ""

  const name = cleanExtractedText(match[1].split(/\s+(?:y|con|email|correo|tel[eé]fono|telefono)\b/i)[0] ?? "")
  if (/^(un|una|el|la|restaurante|bar|tienda|negocio|proyecto|empresa)\b/i.test(name)) return ""

  return name
}

function extractShortName(source: string) {
  const name = cleanExtractedText(source)
  const normalized = normalizeLeadText(name)
  const stopWords = new Set([
    "acepto",
    "adelante",
    "email",
    "envialo",
    "hola",
    "mail",
    "ok",
    "presupuesto",
    "restaurante",
    "si",
    "vale",
    "web",
  ])

  if (name.length < 2 || name.length > 42) return ""
  if (stopWords.has(normalized)) return ""
  if (!/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ' -]+$/.test(name)) return ""
  if (name.split(/\s+/).length > 3) return ""

  return name
}

function extractProjectType(source: string) {
  const explicitMatch = source.match(
    /(?:tipo de negocio|tipo de proyecto|negocio|proyecto)\s*:\s*([^.;\n]{3,120})/i,
  )
  if (explicitMatch?.[1]) return cleanExtractedText(explicitMatch[1])

  const projectTypes: Array<[RegExp, string]> = [
    [/restaurante|bar|cafeter[ií]a|carta|reservas/i, "Restaurante, bar o cafetería"],
    [/tienda|ecommerce|e-commerce|cat[aá]logo|producto|ropa|comercio/i, "Tienda o comercio"],
    [/freelance|aut[oó]nomo|profesional independiente|consultor/i, "Profesional independiente"],
    [/cl[ií]nica|salud|fisio|dentista|centro/i, "Centro profesional o servicios"],
    [/hotel|alojamiento|turismo|apartamento/i, "Turismo o alojamiento"],
    [/v[ií]deo|video|reels|audiovisual|edici[oó]n/i, "Proyecto audiovisual o contenidos"],
    [/marca|visual|escaparate|pantalla|imagen|v[ií]deo|video/i, "Marca visual o escaparate digital"],
    [/web|landing|p[aá]gina|seo|presencia digital/i, "Web o presencia digital"],
    [/whatsapp|chatbot|agente/i, "Agente IA o WhatsApp"],
  ]

  return projectTypes.find(([pattern]) => pattern.test(source))?.[1] ?? ""
}

function hasExplicitProjectData(text: string) {
  return /\b(tipo de negocio|tipo de proyecto|mi negocio es|mi proyecto es|es un|es una|somos un|somos una)\b/i.test(
    text,
  )
}

function extractBudget(source: string) {
  const budgetMatch = source.match(
    /(?:no superar|presupuesto|rango|m[aá]ximo|maximo|hasta|dispongo de|tengo|invertir|poco presupuesto)[^\d€]{0,45}(\d[\d.\s]*(?:,\d+)?\s*(?:€|eur|euros)?(?:\s*(?:-|a|y)\s*\d[\d.\s]*(?:,\d+)?\s*(?:€|eur|euros)?)?)/i,
  )
  return budgetMatch?.[1] ? cleanExtractedText(budgetMatch[1]) : ""
}

function buildLeadInterest(text: string, messages: AgentMessage[]) {
  const userMessages = [...messages.filter((message) => message.role === "user").map((message) => message.content), text]
  const interest = userMessages.slice(-5).join("\n").slice(0, 1100).trim()

  return interest.length >= 10 ? interest : text
}

function updateLeadDraftFromMessage(draft: LeadDraft, text: string, messages: AgentMessage[]) {
  const userHistory = messages.filter((message) => message.role === "user").map((message) => message.content)
  const source = [...userHistory, text].join("\n")
  const next: LeadDraft = { ...draft }

  const email = extractEmail(source)
  const phone = extractPhone(source)
  const projectType = extractProjectType(source)
  const budget = extractBudget(source)
  const explicitName = extractName(source)
  const shortName = !next.name && next.hasAskedName ? extractShortName(text) : ""

  if (email) next.email = email
  if (phone) next.phone = phone
  if (projectType) next.projectType = projectType
  if (budget) next.budget = budget
  if (explicitName || shortName) next.name = explicitName || shortName
  if (wantsClientCopy(text)) next.clientCopy = true
  if (hasExplicitLeadConsent(text) || (next.hasAskedConsent && hasAffirmativeConsentReply(text))) {
    next.hasConsent = true
  }

  next.interest = buildLeadInterest(text, messages)
  next.isActive =
    next.isActive ||
    hasLeadIntent(text) ||
    (hasRecentLeadContext(messages) &&
      (Boolean(email) ||
        Boolean(phone) ||
        Boolean(projectType) ||
        Boolean(budget) ||
        Boolean(explicitName) ||
        Boolean(shortName) ||
        hasExplicitLeadConsent(text) ||
        hasAffirmativeConsentReply(text) ||
        wantsClientCopy(text) ||
        hasSendNowIntent(text)))

  return next
}

function shouldHandleLeadMessage(text: string, messages: AgentMessage[], draft: LeadDraft) {
  const normalized = normalizeLeadText(text)
  const directLeadWithEnoughData =
    Boolean(draft.email) &&
    draft.hasConsent &&
    Boolean(draft.projectType) &&
    /\b(necesito|quiero|busco|me gustaria|presupuesto|propuesta|solicitud)\b/.test(normalized)

  if (draft.sent && !hasLeadIntent(text) && !hasRecentLeadContext(messages)) return false
  if (draft.isActive) return true
  if (directLeadWithEnoughData) return true
  if (hasLeadIntent(text)) return true

  return hasRecentLeadContext(messages) && (hasSendNowIntent(text) || Boolean(extractEmail(text)))
}

function buildLeadEmailReply(text: string, draft: LeadDraft) {
  const lines = ["### Para poder enviarlo"]

  if (hasPriceQuestion(text)) {
    if (/restaurante|reserva|carta/i.test(normalizeLeadText(`${text} ${draft.projectType} ${draft.interest}`))) {
      lines.push(
        "Para una web de restaurante con reservas puede haber una fase sencilla y otra más completa con carta, fotos y automatizaciones. Los importes son orientativos y sin IVA.",
      )
    } else if (/imagen|visual|foto|reel|video|vídeo/i.test(normalizeLeadText(text))) {
      lines.push(
        "En visuales conviene preparar un pack personalizado según volumen, estilo, uso y presupuesto. Los importes se ajustan al alcance y son orientativos sin IVA.",
      )
    } else {
      lines.push(
        "Puedo preparar una orientación inicial, siempre con importes orientativos sin IVA y alcance por confirmar.",
      )
    }
  } else {
    lines.push("Tengo el contexto principal. Para que Aplaudia pueda responderte, falta un email de contacto.")
  }

  lines.push("", "Dime el email y sigo con el envío.")

  return lines.join("\n")
}

function buildLeadConsentReply() {
  return ["### Antes de enviarlo", LEAD_CONSENT_TEXT].join("\n")
}

function buildOptionalNameReply() {
  return [
    "### Ya tengo email y consentimiento",
    "Si quieres, dime tu nombre y lo añado al resumen. Si prefieres no añadir nada más, dime “envíalo” y lo mando.",
  ].join("\n")
}

function buildLeadAcknowledgementReply() {
  return [
    "Perfecto, lo añado al resumen.",
    "",
    "Si quieres incluir algún detalle más, dímelo. Cuando esté listo, dime “envíalo” y lo mando.",
  ].join("\n")
}

function buildLeadAlreadySentReply() {
  return "Ya he enviado el resumen a una persona de Aplaudia. Te responderán por email."
}

function buildLeadSentReply(clientCopy: boolean) {
  return clientCopy
    ? "Perfecto, ya he enviado el resumen a una persona de Aplaudia. Te responderán por email.\n\nTambién he incluido que quieres recibir copia o respuesta por email."
    : "Perfecto, ya he enviado el resumen a una persona de Aplaudia. Te responderán por email."
}

function getSafeHref(rawHref: string) {
  const href = rawHref.trim()

  if (href.startsWith("/") || href.startsWith("#")) return href

  try {
    const url = new URL(href)
    if (["http:", "https:", "mailto:", "tel:"].includes(url.protocol)) return href
  } catch {
    return null
  }

  return null
}

function renderInlineMarkdown(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = []
  let cursor = 0

  for (const match of text.matchAll(INLINE_MARKDOWN_PATTERN)) {
    const token = match[0]
    const index = match.index ?? 0

    if (index > cursor) {
      nodes.push(text.slice(cursor, index))
    }

    if (token.startsWith("**") && token.endsWith("**")) {
      const strongText = token.slice(2, -2).trim()
      nodes.push(
        <strong key={`${keyPrefix}-strong-${index}`} className="font-semibold text-foreground">
          {renderInlineMarkdown(strongText, `${keyPrefix}-strong-${index}`)}
        </strong>,
      )
    } else if (token.startsWith("[")) {
      const linkMatch = token.match(/^\[([^\]]+?)\]\(([^)]+?)\)$/)
      const label = linkMatch?.[1]?.trim() ?? token
      const href = linkMatch ? getSafeHref(linkMatch[2]) : null

      nodes.push(
        href ? (
          <a
            key={`${keyPrefix}-link-${index}`}
            href={href}
            target={href.startsWith("http") ? "_blank" : undefined}
            rel={href.startsWith("http") ? "noreferrer noopener" : undefined}
            className="font-medium text-primary underline decoration-primary/40 underline-offset-4 transition-colors hover:text-primary/80"
          >
            {renderInlineMarkdown(label, `${keyPrefix}-link-${index}`)}
          </a>
        ) : (
          label
        ),
      )
    } else {
      const trailingPunctuation = token.match(/[.,;:!?]$/)?.[0] ?? ""
      const hrefCandidate = trailingPunctuation ? token.slice(0, -1) : token
      const href = getSafeHref(hrefCandidate)

      nodes.push(
        href ? (
          <a
            key={`${keyPrefix}-url-${index}`}
            href={href}
            target="_blank"
            rel="noreferrer noopener"
            className="font-medium text-primary underline decoration-primary/40 underline-offset-4 transition-colors hover:text-primary/80"
          >
            {hrefCandidate}
          </a>
        ) : (
          hrefCandidate
        ),
      )

      if (trailingPunctuation) nodes.push(trailingPunctuation)
    }

    cursor = index + token.length
  }

  if (cursor < text.length) {
    nodes.push(text.slice(cursor))
  }

  return nodes
}

function renderInlineLines(lines: string[], keyPrefix: string) {
  return lines.flatMap((line, index) => {
    const nodes = renderInlineMarkdown(line, `${keyPrefix}-line-${index}`)
    if (index === lines.length - 1) return nodes
    return [...nodes, <br key={`${keyPrefix}-br-${index}`} />]
  })
}

function AgentMessageContent({ content }: { content: string }) {
  const lines = content.replace(/\r\n/g, "\n").split("\n")
  const blocks: ReactNode[] = []
  let paragraphLines: string[] = []
  let listItems: string[] = []

  const flushParagraph = () => {
    if (paragraphLines.length === 0) return

    const blockIndex = blocks.length
    blocks.push(
      <p key={`paragraph-${blockIndex}`} className="text-pretty">
        {renderInlineLines(paragraphLines, `paragraph-${blockIndex}`)}
      </p>,
    )
    paragraphLines = []
  }

  const flushList = () => {
    if (listItems.length === 0) return

    const blockIndex = blocks.length
    blocks.push(
      <ul key={`list-${blockIndex}`} className="space-y-1.5 pl-4">
        {listItems.map((item, index) => (
          <li key={`list-${blockIndex}-item-${index}`} className="list-disc pl-1 text-pretty marker:text-primary/80">
            {renderInlineMarkdown(item, `list-${blockIndex}-item-${index}`)}
          </li>
        ))}
      </ul>,
    )
    listItems = []
  }

  lines.forEach((line) => {
    const trimmed = line.trim()

    if (!trimmed) {
      flushParagraph()
      flushList()
      return
    }

    const headingMatch = trimmed.match(/^#{1,4}\s+(.+)$/)
    if (headingMatch) {
      flushParagraph()
      flushList()
      const blockIndex = blocks.length
      blocks.push(
        <h3 key={`heading-${blockIndex}`} className="text-[0.95em] font-semibold leading-snug text-foreground">
          {renderInlineMarkdown(headingMatch[1].trim(), `heading-${blockIndex}`)}
        </h3>,
      )
      return
    }

    const listMatch = trimmed.match(/^[-*]\s+(.+)$/)
    if (listMatch) {
      flushParagraph()
      listItems.push(listMatch[1].trim())
      return
    }

    flushList()
    paragraphLines.push(trimmed)
  })

  flushParagraph()
  flushList()

  return <div className="space-y-2.5 break-words">{blocks}</div>
}

function getSpeechRecognitionConstructor() {
  if (typeof window === "undefined") return null

  const speechWindow = window as SpeechRecognitionWindow
  return speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition ?? null
}

export function GenericAgentWidget({ config }: { config: AgentWidgetConfig }) {
  const {
    apiEndpoint = "/api/agent",
    closeLabel = "Cerrar asistente",
    inputMaxLength = 500,
    leadRequest,
    listeningPlaceholder = "Escuchando...",
    maxHistoryItems = 8,
    sendLabel = "Enviar mensaje",
    showFloatingSparkle = true,
    unavailableVoiceMessage = "El dictado por voz no está disponible en este navegador.",
    voiceLanguage = "es-ES",
  } = config

  const theme = useMemo(
    () => ({
      ...DEFAULT_THEME,
      ...config.theme,
    }),
    [config.theme],
  )
  const isLeadRequestEnabled = leadRequest?.enabled ?? false
  const leadRequestEndpoint = leadRequest?.apiEndpoint ?? "/api/agent/quote"

  const welcomeMessage = useMemo<AgentMessage>(
    () => ({ role: "assistant", content: config.welcomeMessage }),
    [config.welcomeMessage],
  )

  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<AgentMessage[]>([welcomeMessage])
  const [inputDraft, setInputDraft] = useState("")
  const [hasText, setHasText] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [hasUnread, setHasUnread] = useState(false)
  const [supportsVoiceInput, setSupportsVoiceInput] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [voiceMessage, setVoiceMessage] = useState("")
  const [hasMoreMessagesBelow, setHasMoreMessagesBelow] = useState(false)

  const messagesViewportRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const inputDraftRef = useRef("")
  const leadDraftRef = useRef<LeadDraft>(createEmptyLeadDraft())
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null)
  const pendingUserAnchorIndexRef = useRef<number | null>(null)
  const voiceBaseTextRef = useRef("")
  const shouldKeepVoiceListeningRef = useRef(false)
  const manuallyStoppedVoiceRef = useRef(false)
  const lastVoiceErrorRef = useRef<string | null>(null)
  const voiceRestartAttemptsRef = useRef(0)
  const voiceSilenceTimeoutRef = useRef<number | null>(null)
  const voiceRestartTimeoutRef = useRef<number | null>(null)
  const startVoiceSessionRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    setMessages((current) => {
      if (current.length === 1 && current[0]?.role === "assistant") return [welcomeMessage]
      return current
    })
  }, [welcomeMessage])

  useEffect(() => {
    let id = sessionStorage.getItem(config.sessionStorageKey)
    if (!id) {
      id = crypto.randomUUID()
      sessionStorage.setItem(config.sessionStorageKey, id)
    }
    setSessionId(id)
  }, [config.sessionStorageKey])

  useEffect(() => {
    setSupportsVoiceInput(Boolean(getSpeechRecognitionConstructor()))
  }, [])

  const updateMessagesScrollHint = useCallback(() => {
    const viewport = messagesViewportRef.current
    if (!viewport) {
      setHasMoreMessagesBelow(false)
      return
    }

    const remaining = viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight
    setHasMoreMessagesBelow(remaining > 12)
  }, [])

  const scrollUserMessageToTop = useCallback(
    (messageIndex: number) => {
      const viewport = messagesViewportRef.current
      const message = viewport?.querySelector<HTMLElement>(
        `[data-chat-message-index="${messageIndex}"]`,
      )

      if (!viewport || !message) return

      const viewportRect = viewport.getBoundingClientRect()
      const messageRect = message.getBoundingClientRect()
      const nextTop = viewport.scrollTop + messageRect.top - viewportRect.top

      viewport.scrollTo({
        top: Math.max(0, nextTop - 2),
        behavior: "smooth",
      })

      window.setTimeout(updateMessagesScrollHint, 260)
    },
    [updateMessagesScrollHint],
  )

  useEffect(() => {
    if (!isOpen) {
      setHasMoreMessagesBelow(false)
      return
    }

    const frame = window.requestAnimationFrame(() => {
      const pendingUserIndex = pendingUserAnchorIndexRef.current

      if (pendingUserIndex !== null) {
        scrollUserMessageToTop(pendingUserIndex)

        if (!isLoading && messages[pendingUserIndex + 1]?.role === "assistant") {
          pendingUserAnchorIndexRef.current = null
        }
      } else {
        updateMessagesScrollHint()
      }
    })

    return () => window.cancelAnimationFrame(frame)
  }, [isLoading, isOpen, messages, scrollUserMessageToTop, updateMessagesScrollHint])

  useEffect(() => {
    if (!isOpen) {
      shouldKeepVoiceListeningRef.current = false
      manuallyStoppedVoiceRef.current = true
      if (voiceSilenceTimeoutRef.current !== null) {
        window.clearTimeout(voiceSilenceTimeoutRef.current)
        voiceSilenceTimeoutRef.current = null
      }
      if (voiceRestartTimeoutRef.current !== null) {
        window.clearTimeout(voiceRestartTimeoutRef.current)
        voiceRestartTimeoutRef.current = null
      }
      recognitionRef.current?.stop()
      recognitionRef.current = null
      setIsListening(false)
      setVoiceMessage("")
      return
    }

    setHasUnread(false)
    const timeout = window.setTimeout(() => inputRef.current?.focus(), 200)

    return () => window.clearTimeout(timeout)
  }, [isOpen])

  useEffect(() => {
    return () => {
      shouldKeepVoiceListeningRef.current = false
      if (voiceSilenceTimeoutRef.current !== null) {
        window.clearTimeout(voiceSilenceTimeoutRef.current)
      }
      if (voiceRestartTimeoutRef.current !== null) {
        window.clearTimeout(voiceRestartTimeoutRef.current)
      }
      recognitionRef.current?.stop()
      recognitionRef.current = null
    }
  }, [])

  const resizeInput = useCallback(() => {
    const input = inputRef.current
    if (!input) return

    input.style.height = "auto"
    input.style.height = `${Math.min(input.scrollHeight, 96)}px`
  }, [])

  const resetInput = useCallback(() => {
    const clearTextarea = (input: HTMLTextAreaElement | null) => {
      if (!input) return

      input.value = ""
      input.defaultValue = ""
      input.scrollTop = 0
      input.style.height = "auto"
      input.style.removeProperty("height")
    }

    inputDraftRef.current = ""
    setInputDraft("")
    clearTextarea(inputRef.current)
    voiceBaseTextRef.current = ""
    setHasText(false)

    window.requestAnimationFrame(() => {
      clearTextarea(inputRef.current)
    })
    window.setTimeout(() => {
      clearTextarea(inputRef.current)
    }, 0)
    window.setTimeout(() => {
      clearTextarea(inputRef.current)
    }, 80)
  }, [])

  const setInputValue = useCallback(
    (value: string) => {
      const input = inputRef.current
      inputDraftRef.current = value
      setInputDraft(value)

      if (!input) return

      input.value = value
      input.scrollTop = input.scrollHeight
      setHasText(value.trim().length > 0)
      resizeInput()
    },
    [resizeInput],
  )

  const clearVoiceTimers = useCallback(() => {
    if (voiceSilenceTimeoutRef.current !== null) {
      window.clearTimeout(voiceSilenceTimeoutRef.current)
      voiceSilenceTimeoutRef.current = null
    }

    if (voiceRestartTimeoutRef.current !== null) {
      window.clearTimeout(voiceRestartTimeoutRef.current)
      voiceRestartTimeoutRef.current = null
    }
  }, [])

  const stopVoiceInput = useCallback(
    (nextMessage = "") => {
      shouldKeepVoiceListeningRef.current = false
      manuallyStoppedVoiceRef.current = true
      clearVoiceTimers()
      recognitionRef.current?.stop()
      recognitionRef.current = null
      voiceBaseTextRef.current = inputDraftRef.current.trim()
      setIsListening(false)
      setVoiceMessage(nextMessage)
    },
    [clearVoiceTimers],
  )

  const scheduleVoiceSilenceStop = useCallback(() => {
    if (voiceSilenceTimeoutRef.current !== null) {
      window.clearTimeout(voiceSilenceTimeoutRef.current)
    }

    voiceSilenceTimeoutRef.current = window.setTimeout(() => {
      shouldKeepVoiceListeningRef.current = false
      manuallyStoppedVoiceRef.current = false
      voiceSilenceTimeoutRef.current = null
      recognitionRef.current?.stop()
      setIsListening(false)
      setVoiceMessage("")
    }, VOICE_SILENCE_TIMEOUT_MS)
  }, [])

  const startVoiceSession = useCallback(() => {
    const SpeechRecognitionConstructor = getSpeechRecognitionConstructor()

    if (!SpeechRecognitionConstructor) {
      shouldKeepVoiceListeningRef.current = false
      setSupportsVoiceInput(false)
      setIsListening(false)
      setVoiceMessage(unavailableVoiceMessage)
      return
    }

    const recognition = new SpeechRecognitionConstructor()
    recognition.lang = voiceLanguage
    recognition.continuous = true
    recognition.interimResults = true

    recognition.onstart = () => {
      lastVoiceErrorRef.current = null
      setSupportsVoiceInput(true)
      setIsListening(true)
      setVoiceMessage("Puedes hablar, paro cuando detecte silencio.")
      scheduleVoiceSilenceStop()
    }

    recognition.onresult = (event) => {
      voiceRestartAttemptsRef.current = 0
      lastVoiceErrorRef.current = null
      scheduleVoiceSilenceStop()

      const transcript = Array.from({ length: event.results.length }, (_, index) => {
        return event.results[index]?.[0]?.transcript ?? ""
      })
        .join("")
        .replace(/\s+/g, " ")
        .trim()

      const baseText = voiceBaseTextRef.current
      const nextValue = [baseText, transcript].filter(Boolean).join(" ").trim()
      setInputValue(nextValue)
    }

    recognition.onerror = (event) => {
      const error = event.error ?? "unknown"
      lastVoiceErrorRef.current = error

      if (NON_RETRYABLE_VOICE_ERRORS.has(error)) {
        shouldKeepVoiceListeningRef.current = false
        clearVoiceTimers()
        setIsListening(false)
        setVoiceMessage(
          error === "audio-capture"
            ? "No se ha encontrado un microfono disponible."
            : "No se ha podido acceder al microfono.",
        )
        return
      }

      if (shouldKeepVoiceListeningRef.current) {
        setVoiceMessage("Sigo escuchando...")
      } else if (error === "no-speech") {
        setVoiceMessage("No se ha detectado voz. Puedes intentarlo de nuevo.")
      } else {
        setVoiceMessage("El dictado por voz no esta disponible ahora mismo.")
      }
    }

    recognition.onend = () => {
      recognitionRef.current = null
      voiceBaseTextRef.current = inputDraftRef.current.trim()

      const shouldRestart =
        shouldKeepVoiceListeningRef.current &&
        !manuallyStoppedVoiceRef.current &&
        !NON_RETRYABLE_VOICE_ERRORS.has(lastVoiceErrorRef.current ?? "")

      if (shouldRestart && voiceRestartAttemptsRef.current < VOICE_MAX_AUTO_RESTARTS) {
        voiceRestartAttemptsRef.current += 1
        voiceRestartTimeoutRef.current = window.setTimeout(() => {
          startVoiceSessionRef.current?.()
        }, VOICE_RESTART_DELAY_MS)
        return
      }

      clearVoiceTimers()
      shouldKeepVoiceListeningRef.current = false
      setIsListening(false)

      if (voiceRestartAttemptsRef.current >= VOICE_MAX_AUTO_RESTARTS) {
        setVoiceMessage("El dictado se ha detenido. Puedes tocar el microfono para seguir.")
      } else {
        setVoiceMessage((current) =>
          current === listeningPlaceholder || current === "Puedes hablar, paro cuando detecte silencio." ? "" : current,
        )
      }
    }

    recognitionRef.current = recognition

    try {
      recognition.start()
    } catch {
      shouldKeepVoiceListeningRef.current = false
      recognitionRef.current = null
      setIsListening(false)
      setVoiceMessage("No se ha podido iniciar el dictado por voz.")
    }
  }, [clearVoiceTimers, listeningPlaceholder, scheduleVoiceSilenceStop, setInputValue, unavailableVoiceMessage, voiceLanguage])

  useEffect(() => {
    startVoiceSessionRef.current = startVoiceSession
  }, [startVoiceSession])

  const toggleVoiceInput = useCallback(() => {
    if (isListening) {
      stopVoiceInput()
      return
    }

    voiceBaseTextRef.current = inputDraftRef.current.trim()
    shouldKeepVoiceListeningRef.current = true
    manuallyStoppedVoiceRef.current = false
    lastVoiceErrorRef.current = null
    voiceRestartAttemptsRef.current = 0
    clearVoiceTimers()
    startVoiceSession()
  }, [clearVoiceTimers, isListening, startVoiceSession, stopVoiceInput])

  const sendMessage = useCallback(async () => {
    const text = (inputDraftRef.current || inputRef.current?.value || "").trim()
    if (!text || isLoading || !sessionId) return

    resetInput()
    stopVoiceInput()

    const userMessage: AgentMessage = { role: "user", content: text }
    setMessages((current) => {
      pendingUserAnchorIndexRef.current = current.length
      return [...current, userMessage]
    })
    setIsLoading(true)

    let attemptedLeadSend = false

    try {
      const previousLeadDraft = leadDraftRef.current
      const leadDetails = isLeadRequestEnabled ? updateLeadDraftFromMessage(previousLeadDraft, text, messages) : null
      const conversationHistory = [...messages.slice(-11), userMessage]

      if (leadDetails && shouldHandleLeadMessage(text, messages, leadDetails)) {
        leadDetails.isActive = true
        leadDraftRef.current = leadDetails

        if (leadDetails.sent) {
          setMessages((current) => [...current, { role: "assistant", content: buildLeadAlreadySentReply() }])
          if (!isOpen) setHasUnread(true)
          return
        }

        if (!leadDetails.email) {
          leadDetails.hasAskedEmail = true
          leadDraftRef.current = leadDetails
          setMessages((current) => [...current, { role: "assistant", content: buildLeadEmailReply(text, leadDetails) }])
          if (!isOpen) setHasUnread(true)
          return
        }

        if (!leadDetails.hasConsent) {
          leadDetails.hasAskedConsent = true
          leadDraftRef.current = leadDetails
          setMessages((current) => [...current, { role: "assistant", content: buildLeadConsentReply() }])
          if (!isOpen) setHasUnread(true)
          return
        }

        const justCapturedOptionalName =
          !previousLeadDraft.name && Boolean(leadDetails.name) && previousLeadDraft.hasAskedName
        const justCompletedRequiredData =
          (!previousLeadDraft.email && Boolean(leadDetails.email)) ||
          (!previousLeadDraft.hasConsent && leadDetails.hasConsent)
        const onlyCompletedRequiredData =
          justCompletedRequiredData &&
          !extractProjectType(text) &&
          !extractBudget(text) &&
          !hasLeadIntent(text) &&
          !hasSendNowIntent(text)
        const shouldAskOptionalName =
          (previousLeadDraft.isActive ||
            previousLeadDraft.hasAskedEmail ||
            previousLeadDraft.hasAskedConsent ||
            onlyCompletedRequiredData) &&
          justCompletedRequiredData &&
          !previousLeadDraft.sent &&
          !previousLeadDraft.hasAskedName &&
          !leadDetails.name &&
          !hasSendNowIntent(text)
        const addedExtraContext =
          previousLeadDraft.isActive &&
          previousLeadDraft.hasAskedName &&
          !hasSendNowIntent(text) &&
          !justCapturedOptionalName

        if (shouldAskOptionalName) {
          leadDetails.hasAskedName = true
          leadDraftRef.current = leadDetails
          setMessages((current) => [...current, { role: "assistant", content: buildOptionalNameReply() }])
          if (!isOpen) setHasUnread(true)
          return
        }

        if ((justCapturedOptionalName || addedExtraContext) && !hasSendNowIntent(text)) {
          leadDraftRef.current = leadDetails
          setMessages((current) => [...current, { role: "assistant", content: buildLeadAcknowledgementReply() }])
          if (!isOpen) setHasUnread(true)
          return
        }

        attemptedLeadSend = true
        const response = await fetch(leadRequestEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            budget: leadDetails.budget,
            clientCopy: leadDetails.clientCopy,
            consent: true,
            email: leadDetails.email,
            history: conversationHistory,
            interest: leadDetails.interest,
            name: leadDetails.name,
            phone: leadDetails.phone,
            projectType: leadDetails.projectType,
            sessionId,
          }),
        })
        const data = await response.json().catch(() => ({}))

        if (!response.ok || data?.ok !== true) {
          throw new Error(typeof data?.error === "string" ? data.error : "No se ha podido enviar la solicitud.")
        }

        setMessages((current) => [
          ...current,
          {
            role: "assistant",
            content: buildLeadSentReply(leadDetails.clientCopy),
          },
        ])
        leadDetails.sent = true
        leadDraftRef.current = leadDetails
        if (!isOpen) setHasUnread(true)
        return
      }

      const res = await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, sessionId, history: messages.slice(-maxHistoryItems) }),
      })
      const data = await res.json()
      const reply = data.reply ?? config.fallbackReply

      setMessages((current) => [...current, { role: "assistant", content: reply }])
      if (!isOpen) setHasUnread(true)
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: attemptedLeadSend
            ? `### No se ha podido enviar\n${
                error instanceof Error ? error.message : "No se ha podido enviar la solicitud."
              }`
            : config.connectionErrorReply,
        },
      ])
    } finally {
      resetInput()
      setIsLoading(false)
    }
  }, [
    apiEndpoint,
    config.connectionErrorReply,
    config.fallbackReply,
    isLeadRequestEnabled,
    isLoading,
    isOpen,
    leadRequestEndpoint,
    maxHistoryItems,
    messages,
    resetInput,
    sessionId,
    stopVoiceInput,
  ])

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault()
      void sendMessage()
    }
  }

  return (
    <>
      {isOpen && (
        <div
          className={cn(
            "fixed inset-x-1.5 bottom-1.5 top-1.5 z-[70] flex max-h-[calc(100dvh-0.75rem)] flex-col overflow-hidden rounded-2xl border shadow-2xl backdrop-blur-xl transition-all duration-200 sm:inset-x-6 sm:bottom-6 sm:top-6 sm:max-h-[calc(100dvh-3rem)] lg:inset-x-[8vw] xl:inset-x-[10vw]",
            theme.panel,
          )}
          role="dialog"
          aria-label={config.dialogLabel}
        >
          <div className={cn("flex items-center justify-between border-b px-3 py-2.5 sm:px-4 sm:py-3", theme.header)}>
            <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
              <div
                className={cn(
                  "relative flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border sm:h-10 sm:w-10",
                  theme.assistantAvatar,
                )}
              >
                <Bot className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
                <span className={cn("absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-card", theme.onlineDot)} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold leading-none text-foreground">{config.assistantTitle}</p>
                <p className="mt-1 text-xs text-muted-foreground">{config.assistantSubtitle}</p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                aria-label={closeLabel}
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="relative min-h-0 flex-1">
            <div
              ref={messagesViewportRef}
              data-chat-scroll-viewport="true"
              onScroll={updateMessagesScrollHint}
              className="h-full min-h-0 space-y-2.5 overflow-y-auto px-2.5 py-3 sm:space-y-3 sm:px-4 sm:py-4"
            >
              {messages.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  data-chat-message-index={index}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.role === "user" ? (
                    <p
                      className={cn(
                        "whitespace-pre-wrap break-words rounded-2xl px-3 py-2 text-base leading-[1.45] sm:px-3.5 sm:text-[17px] sm:leading-[1.42]",
                        theme.userBubble,
                      )}
                    >
                      {message.content}
                    </p>
                  ) : (
                    <div
                      className={cn(
                        "break-words rounded-2xl px-3 py-2 text-base leading-[1.45] sm:px-3.5 sm:text-[17px] sm:leading-[1.42]",
                        theme.assistantBubble,
                      )}
                    >
                      <AgentMessageContent content={message.content} />
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex max-w-full items-center gap-1.5 rounded-2xl rounded-bl-sm bg-card px-3.5 py-2.5">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:0ms]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:160ms]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:320ms]" />
                  </div>
                </div>
              )}
            </div>

            {hasMoreMessagesBelow && (
              <button
                type="button"
                onClick={() => {
                  const viewport = messagesViewportRef.current
                  if (!viewport) return

                  viewport.scrollBy({
                    top: Math.max(160, viewport.clientHeight * 0.72),
                    behavior: "smooth",
                  })
                  window.setTimeout(updateMessagesScrollHint, 260)
                }}
                className={cn(
                  "absolute bottom-3 right-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full border shadow-xl backdrop-blur-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  theme.scrollHint,
                )}
                aria-label="Hay más respuesta hacia abajo"
              >
                <ArrowDown className="h-4 w-4 animate-bounce" aria-hidden="true" />
              </button>
            )}
          </div>

          <div className="flex items-end gap-2 border-t border-border bg-background/95 p-2.5 sm:p-3">
            <textarea
              ref={inputRef}
              rows={1}
              maxLength={inputMaxLength}
              value={inputDraft}
              onChange={(event) => {
                const nextValue = event.currentTarget.value
                inputDraftRef.current = nextValue
                setInputDraft(nextValue)
                setHasText(nextValue.trim().length > 0)
                setVoiceMessage("")
                resizeInput()
              }}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              placeholder={isListening ? listeningPlaceholder : config.placeholder}
              className={cn(
                "min-h-12 flex-1 resize-none rounded-xl border px-3.5 py-2.5 text-base leading-6 outline-none transition-colors disabled:opacity-50",
                theme.input,
              )}
            />
            <button
              type="button"
              onClick={toggleVoiceInput}
              disabled={isLoading}
              aria-disabled={!supportsVoiceInput}
              aria-label={
                isListening
                  ? "Parar dictado por voz"
                  : supportsVoiceInput
                    ? "Dictar mensaje por voz"
                    : unavailableVoiceMessage
              }
              aria-pressed={isListening}
              className={cn(
                "relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-40",
                isListening ? theme.micActive : supportsVoiceInput ? theme.micIdle : theme.micUnsupported,
              )}
              title={supportsVoiceInput ? "Dictar mensaje por voz" : unavailableVoiceMessage}
            >
              {isListening ? (
                <MicOff className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Mic className="h-4 w-4" aria-hidden="true" />
              )}
              {isListening && (
                <span className={cn("absolute inset-0 animate-ping rounded-xl", theme.micPing)} aria-hidden="true" />
              )}
            </button>
            <button
              type="button"
              onClick={sendMessage}
              disabled={!hasText || isLoading || !sessionId}
              className={cn(
                "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-transform active:scale-95 disabled:cursor-not-allowed disabled:opacity-40",
                theme.sendButton,
              )}
              aria-label={sendLabel}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <Send className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          </div>

          {(isListening || voiceMessage) && (
            <p
              className={cn(
                "border-t border-border/60 px-4 pb-3 text-xs",
                isListening ? theme.voiceStatusActive : "text-muted-foreground",
              )}
              aria-live="polite"
            >
              {voiceMessage}
            </p>
          )}
        </div>
      )}

      {!isOpen && (
        <div className="fixed bottom-4 right-4 z-[55] flex items-center gap-2 sm:bottom-6 sm:right-6">
          {config.floatingButtonText && (
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="rounded-full border border-white/10 bg-background/80 px-3 py-2 text-sm font-medium text-foreground/90 shadow-xl backdrop-blur-md transition-colors hover:border-primary/30 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {config.floatingButtonText}
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className={cn(
              "relative flex h-14 w-14 items-center justify-center rounded-full border border-white/15 shadow-2xl transition-all hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-95",
              theme.floatingButton,
            )}
            aria-label={config.floatingButtonLabel}
          >
            {hasUnread && (
              <span
                className={cn(
                  "absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-background text-[10px] font-bold",
                  theme.unreadBadge,
                )}
              >
                1
              </span>
            )}
            <MessageCircle className="h-6 w-6" aria-hidden="true" />
            {showFloatingSparkle && <Sparkles className={cn("absolute -right-1 -top-1 h-4 w-4", theme.floatingSparkle)} aria-hidden="true" />}
          </button>
        </div>
      )}
    </>
  )
}
