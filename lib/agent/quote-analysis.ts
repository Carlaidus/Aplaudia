export type AgentQuoteHistoryMessage = {
  role: "assistant" | "user"
  content: string
}

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

const MAX_HISTORY_ITEMS = 14

export function normalizeSource(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
}

export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}

export function normalizeText(value: unknown, maxLength = 1200) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : ""
}

export function normalizeHistory(value: unknown): AgentQuoteHistoryMessage[] {
  if (!Array.isArray(value)) return []

  return value
    .map((item) => {
      if (!item || typeof item !== "object") return null

      const role = "role" in item ? item.role : null
      const content = "content" in item ? normalizeText(item.content, 900) : ""

      if ((role !== "user" && role !== "assistant") || !content) return null

      return { role, content }
    })
    .filter((item): item is AgentQuoteHistoryMessage => Boolean(item))
    .slice(-MAX_HISTORY_ITEMS)
}

export function buildConversationSummary(history: AgentQuoteHistoryMessage[]) {
  const userMessages = history.filter((item) => item.role === "user").map((item) => item.content)
  const assistantMessages = history.filter((item) => item.role === "assistant").map((item) => item.content)
  const questions = userMessages.filter((message) => message.includes("?") || message.includes("¿")).slice(-6)
  const priceQuestionCount = userMessages.filter((message) =>
    /\b(precio|coste|presupuesto|tarifa|mensualidad|mantenimiento|cu[aá]nto cuesta|barato|barata|econ[oó]mico|econ[oó]mica|desde cu[aá]nto)\b/i.test(
      message,
    ),
  ).length
  const priceLines = assistantMessages
    .flatMap((message) => message.split("\n"))
    .map((line) => line.trim().replace(/^[-*]\s+/, ""))
    .filter((line) => /€|eur|desde|presupuesto|sin iva|pack personalizado/i.test(line))
    .slice(-10)

  return {
    lastUserMessages: userMessages.slice(-6),
    latestRelevantMessages: history
      .slice(-8)
      .map((item) => `${item.role === "user" ? "Cliente" : "Aplaudia"}: ${item.content}`),
    priceQuestionCount,
    priceLines,
    questions,
    transcript: history.map((item) => `${item.role === "user" ? "Cliente" : "Aplaudia"}: ${item.content}`),
    userMessages,
  }
}

function unique(items: string[]) {
  return Array.from(new Set(items))
}

function hasHostelryContext(normalized: string) {
  return /\b(restaurantes?|bar|bares|cafeteria|cafeterias|hosteleria|menu|menus|reservas?)\b/.test(normalized)
}

function hasRestaurantType(normalized: string) {
  if (/\brestaurantes?\b/.test(normalized)) return true
  if (/\bbares?\b|\bbar\b/.test(normalized)) return true
  if (/\bcafeterias?\b|\bcafeteria\b/.test(normalized)) return true
  if (/\bcafe\b/.test(normalized) && /\b(negocio|local|hosteleria|bar|restaurante|cafeteria)\b/.test(normalized)) {
    return true
  }
  return /\bcarta\b/.test(normalized) && hasHostelryContext(normalized)
}

function hasPersonalPage(normalized: string) {
  return /\b(pagina personal|web personal|portfolio personal|landing personal|pagina pequena personal|pagina pequena y personal)\b/.test(
    normalized,
  )
}

function hasWebRequest(normalized: string) {
  return /\b(web|pagina|landing|sitio|presencia digital)\b/.test(normalized)
}

function hasCatalogRequest(normalized: string) {
  return /\b(catalogo|productos?|fichas?|tienda|ecommerce|e-commerce|comercio online|venta online)\b/.test(
    normalized,
  )
}

function hasVisualRequest(normalized: string) {
  return /\b(visuales|imagenes para|imagen para|creatividades|grafica|graficas|banner|banners|escaparate|pantalla comercial|retoque|composicion visual)\b/.test(
    normalized,
  )
}

function hasVideoRequest(normalized: string) {
  return /\b(video|videos|reels?|animaciones?|audiovisual|edicion de video|edicion audiovisual)\b/.test(normalized)
}

function hasMaintenanceRequest(normalized: string) {
  return /\b(mantenimiento|soporte|cambios mensuales|actualizacion continua|actualizaciones continuas|mantenimiento mensual)\b/.test(
    normalized,
  )
}

function hasAgentRequest(normalized: string) {
  return /\b(agente|chatbot|whatsapp|asistente para whatsapp|automatizacion de whatsapp)\b/.test(normalized)
}

function hasReservationRequest(normalized: string) {
  return /\b(reserva|reservas|reservar|sistema de reservas)\b/.test(normalized)
}

export function detectServices(clientOnlyText: string) {
  const normalized = normalizeSource(clientOnlyText)
  const services: string[] = []

  if (hasWebRequest(normalized) || hasPersonalPage(normalized)) services.push("Web / landing")
  if (hasReservationRequest(normalized)) services.push("Reservas")
  if (hasCatalogRequest(normalized)) services.push("Catálogo / comercio")
  if (hasAgentRequest(normalized)) services.push("Agente web o WhatsApp")
  if (hasVisualRequest(normalized)) services.push("Visuales / imagen")
  if (hasVideoRequest(normalized)) services.push("Vídeo / audiovisual")
  if (hasMaintenanceRequest(normalized)) services.push("Mantenimiento")

  if (services.length === 0 && /\bpresupuesto\b/.test(normalized)) return ["Por definir"]
  return services.length > 0 ? unique(services) : ["Por definir"]
}

function normalizeProjectTypeFromLead(projectType: string, clientOnlyText: string) {
  const normalizedProject = normalizeSource(projectType)
  const normalizedClient = normalizeSource(clientOnlyText)

  if (!projectType || projectType === "Por definir") return ""
  if (/restaurante|bar|cafeteria/.test(normalizedProject) && !hasRestaurantType(normalizedClient)) return ""
  if (/catalogo|comercio|tienda/.test(normalizedProject) && !hasCatalogRequest(normalizedClient)) return ""
  if (/audiovisual|visual|escaparate/.test(normalizedProject) && !hasVisualRequest(normalizedClient) && !hasVideoRequest(normalizedClient)) {
    return ""
  }
  if (/whatsapp|agente/.test(normalizedProject) && !hasAgentRequest(normalizedClient)) return ""

  return projectType
}

export function inferProjectType(clientOnlyText: string, leadProjectType = "") {
  const normalized = normalizeSource(clientOnlyText)

  if (hasPersonalPage(normalized)) return "Página personal / web sencilla"
  if (/\blanding sencilla\b|\bweb sencilla\b|\bp[aá]gina sencilla\b/i.test(clientOnlyText)) return "Landing / web sencilla"
  if (hasRestaurantType(normalized)) return "Restaurante / bar / cafetería"
  if (hasCatalogRequest(normalized)) return "Tienda o catálogo"
  if (/\bclinica|clinicas|salud|fisio|dentista|centro medico\b/.test(normalized)) return "Clínica o centro profesional"
  if (/\bfreelance|autonomo|autonoma|consultor|profesional independiente\b/.test(normalized)) {
    return "Profesional independiente"
  }
  if (/\bhotel|alojamiento|turismo|apartamento\b/.test(normalized)) return "Turismo o alojamiento"
  if (hasVideoRequest(normalized)) return "Proyecto audiovisual o contenidos"
  if (hasVisualRequest(normalized)) return "Proyecto visual"
  if (hasWebRequest(normalized)) return "Web o presencia digital"
  if (hasAgentRequest(normalized)) return "Agente web o WhatsApp"

  return normalizeProjectTypeFromLead(leadProjectType, clientOnlyText) || "Por definir"
}

export function detectMaterials(clientOnlyText: string) {
  const normalized = normalizeSource(clientOnlyText)
  const materials: string[] = []

  if (/\b(no tengo|no tiene|no tenemos|sin|falta(?:n)?)\b[\s\S]{0,35}\bfotos?\b/.test(normalized)) {
    materials.push("No tiene fotos")
  }
  if (/\b(no tengo|no tiene|no tenemos|sin|falta(?:n)?)\b[\s\S]{0,35}\bcarta\b/.test(normalized)) {
    materials.push("No tiene carta")
  }
  if (/\b(no tengo|no tiene|no tenemos|sin|falta(?:n)?)\b[\s\S]{0,35}\bweb\b/.test(normalized)) {
    materials.push("No tiene web")
  }
  if (/\b(no tengo|no tiene|no tenemos|sin|falta(?:n)?)\b[\s\S]{0,35}\b(textos?|copy|contenido)\b/.test(normalized)) {
    materials.push("No tiene textos")
  }
  if (/\b(tengo|tenemos|tiene)\b[\s\S]{0,35}\blogo\b/.test(normalized)) materials.push("Tiene logo")
  if (/\b(tengo|tenemos|tiene)\b[\s\S]{0,35}\bproductos?\b/.test(normalized)) materials.push("Tiene productos")

  return materials.length > 0 ? unique(materials) : ["No indicado"]
}

function extractNameFromText(clientOnlyText: string) {
  const match = clientOnlyText.match(
    /(?:me llamo|mi nombre es|nombre\s*:|soy)\s+([A-Za-zÁÉÍÓÚÜÑáéíóúüñ][^,.;\n]{1,70})/i,
  )
  if (!match?.[1]) return ""

  const name = match[1].split(/\s+(?:y|ya|con|email|correo|tel[eé]fono|telefono|no tengo)\b/i)[0]?.trim() ?? ""
  if (/^(un|una|el|la|restaurante|bar|tienda|negocio|proyecto|empresa)\b/i.test(name)) return ""

  return name
}

function detectUrgency(clientOnlyText: string) {
  const normalized = normalizeSource(clientOnlyText)
  if (/\b(urgente|cuanto antes|prisa|esta semana|hoy|manana)\b/.test(normalized)) return "Alta"
  if (/\b(pronto|rapido|en breve|lo antes posible)\b/.test(normalized)) return "Media"
  return "No indicada"
}

function detectPriceSensitivity(clientOnlyText: string) {
  const normalized = normalizeSource(clientOnlyText)
  if (/\b(caro|cara|poco presupuesto|barato|barata|economico|economica|ajustar|lo mas barato|no superar|maximo|limite)\b/.test(normalized)) {
    return "Alta"
  }
  if (/\b(precio|coste|presupuesto|tarifa|mensualidad|desde cuanto)\b/.test(normalized)) return "Media"
  return "No detectada"
}

function detectFriction(clientOnlyText: string) {
  const normalized = normalizeSource(clientOnlyText)
  if (/\b(me estas hablando demasiado|bloqueado|raro|no funciona|no entiendo|pesado|demasiado texto)\b/.test(normalized)) {
    return "Alta"
  }
  if (/\b(duda|no se|orientacion|me pierdo)\b/.test(normalized)) return "Media"
  return "Baja"
}

function detectProjectClarity(clientOnlyText: string, services: string[]) {
  const normalized = normalizeSource(clientOnlyText)
  if (services.length >= 3 || /\b(no tengo web|no tengo carta|no tengo fotos|quiero orientacion)\b/.test(normalized)) {
    return "Media: hay necesidad clara, pero falta concretar alcance"
  }
  if (services.length >= 2 || /\b(quiero|necesito|busco)\b/.test(normalized)) return "Media"
  return "Inicial"
}

function detectClientType(clientOnlyText: string) {
  const normalized = normalizeSource(clientOnlyText)
  if (hasRestaurantType(normalized)) return "Negocio de hosteleria"
  if (hasCatalogRequest(normalized)) return "Comercio / retail"
  if (/\bclinica|salud|fisio|dentista\b/.test(normalized)) return "Servicio profesional / salud"
  if (/\bfreelance|autonomo|autonoma|consultor\b/.test(normalized)) return "Profesional independiente"
  if (hasPersonalPage(normalized)) return "Persona / marca personal"
  if (/\bmarca|empresa|negocio\b/.test(normalized)) return "Marca o negocio"
  return "No definido"
}

function detectObjections(clientOnlyText: string, questions: string[]) {
  const normalized = normalizeSource(clientOnlyText)
  const objections: string[] = []

  if (/\b(caro|cara|poco presupuesto|barato|barata|economico|economica|lo mas barato)\b/.test(normalized)) {
    objections.push("Sensibilidad al precio")
  }
  if (/\b(no entiendo|me pierdo|me estas hablando demasiado|demasiado texto)\b/.test(normalized)) {
    objections.push("Necesita respuesta mas directa y guiada")
  }

  return objections.length > 0 ? objections : questions.length > 0 ? questions : ["No detectadas"]
}

function recommendNextAction(urgency: string, friction: string, priceSensitivity: string) {
  if (friction === "Alta") return "Responder con un email breve, directo y con el siguiente paso claro."
  if (urgency === "Alta") return "Priorizar respuesta rapida y proponer una llamada o email de alcance inicial."
  if (priceSensitivity === "Alta") return "Proponer una fase inicial ajustada y dejar ampliaciones para despues."
  return "Responder con orientacion comercial y pedir solo los datos que falten para acotar alcance."
}

function buildFallbackInterest(history: AgentQuoteHistoryMessage[]) {
  const userMessages = history.filter((item) => item.role === "user").map((item) => item.content)
  const fallback = userMessages.slice(-5).join("\n").trim()

  return fallback || "No especificado. Revisar conversacion."
}

function buildClientOnlyText(input: AgentQuoteAnalysisInput) {
  return [
    ...input.history.filter((item) => item.role === "user").map((item) => item.content),
    input.name,
    input.interest,
    input.budget,
    input.phone,
  ]
    .filter(Boolean)
    .join("\n")
}

function buildExecutiveSummary(args: {
  budgetLabel: string
  clientOnlyText: string
  clientType: string
  email: string
  interest: string
  materials: string[]
  name: string
  projectType: string
  services: string[]
  urgency: string
}) {
  const lines = [
    `Contacto: ${args.name || "nombre no indicado"} (${args.email}).`,
    `Tipo de cliente: ${args.clientType}. Proyecto: ${args.projectType}.`,
    `Necesidad principal: ${args.interest}`,
    `Servicios pedidos: ${args.services.join(", ")}.`,
    `Materiales mencionados: ${args.materials.join(", ")}.`,
    `Urgencia: ${args.urgency}. Presupuesto indicado: ${args.budgetLabel}.`,
  ]

  return lines.slice(0, 8)
}

export function analyzeAgentQuote(input: AgentQuoteAnalysisInput): AgentQuoteAnalysis {
  const summary = buildConversationSummary(input.history)
  const clientOnlyText = buildClientOnlyText(input)
  const name = input.name || extractNameFromText(clientOnlyText) || "No indicado"
  const projectType = inferProjectType(clientOnlyText, input.projectType)
  const interest = input.interest || buildFallbackInterest(input.history)
  const budgetLabel = input.budget || "No indicado"
  const detectedServices = detectServices(clientOnlyText)
  const materials = detectMaterials(clientOnlyText)
  const urgency = detectUrgency(clientOnlyText)
  const priceSensitivity = detectPriceSensitivity(clientOnlyText)
  const friction = detectFriction(clientOnlyText)
  const clarity = detectProjectClarity(clientOnlyText, detectedServices)
  const clientType = detectClientType(clientOnlyText)
  const objections = detectObjections(clientOnlyText, summary.questions)
  const nextAction = recommendNextAction(urgency, friction, priceSensitivity)
  const executiveSummary = buildExecutiveSummary({
    budgetLabel,
    clientOnlyText,
    clientType,
    email: input.email,
    interest,
    materials,
    name,
    projectType,
    services: detectedServices,
    urgency,
  })
  const priceFocus =
    summary.priceQuestionCount > 1
      ? "Sí, ha preguntado varias veces por precio"
      : summary.priceQuestionCount === 1
        ? "Sí, ha preguntado por precio"
        : "No detectado"

  return {
    budgetLabel,
    clarity,
    clientOnlyText,
    clientType,
    detectedServices,
    executiveSummary,
    friction,
    interest,
    materials,
    name,
    nextAction,
    objections,
    priceFocus,
    priceSensitivity,
    projectType,
    summary,
    urgency,
  }
}
