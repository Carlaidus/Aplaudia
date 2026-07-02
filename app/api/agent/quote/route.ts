import { NextResponse } from "next/server"
import {
  CloudflareEmailConfigurationError,
  getInternalEmailRecipient,
  sendInternalEmail,
} from "@/lib/email/cloudflare-email"

export const runtime = "nodejs"

type AgentQuoteHistoryMessage = {
  role: "assistant" | "user"
  content: string
}

const MAX_TEXT_LENGTH = 1200
const MAX_HISTORY_ITEMS = 14

function escapeHtml(value: unknown) {
  if (typeof value !== "string") return ""

  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

function normalizeSource(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}

function normalizeText(value: unknown, maxLength = MAX_TEXT_LENGTH) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : ""
}

function normalizeHistory(value: unknown): AgentQuoteHistoryMessage[] {
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

function buildConversationSummary(history: AgentQuoteHistoryMessage[]) {
  const userMessages = history.filter((item) => item.role === "user").map((item) => item.content)
  const assistantMessages = history.filter((item) => item.role === "assistant").map((item) => item.content)
  const questions = userMessages.filter((message) => message.includes("?") || message.includes("¿")).slice(-6)
  const priceQuestionCount = userMessages.filter((message) =>
    /precio|coste|presupuesto|tarifa|mensualidad|mantenimiento|cu[aá]nto cuesta|barato|econ[oó]mico|desde cu[aá]nto/i.test(
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
    latestRelevantMessages: history.slice(-8).map((item) => `${item.role === "user" ? "Cliente" : "Aplaudia"}: ${item.content}`),
    priceQuestionCount,
    priceLines,
    questions,
    transcript: history.map((item) => `${item.role === "user" ? "Cliente" : "Aplaudia"}: ${item.content}`),
    userMessages,
  }
}

function detectServices(source: string) {
  const normalized = normalizeSource(source)
  const services: string[] = []

  if (/web|landing|pagina|catalogo|seo|presencia digital/.test(normalized)) services.push("Web / landing")
  if (/restaurante|bar|cafeteria|carta|reservas/.test(normalized)) {
    services.push("Restaurante: carta, reservas o presencia digital")
  }
  if (/tienda|ecommerce|catalogo|producto|ropa|comercio/.test(normalized)) services.push("Catalogo / comercio")
  if (/agente|chatbot|whatsapp/.test(normalized)) services.push("Agente web o WhatsApp")
  if (/visual|imagen|foto|video|reel|pantalla|escaparate/.test(normalized)) services.push("Visuales / imagen / video")
  if (/mantenimiento|mensualidad|soporte|actualizacion/.test(normalized)) services.push("Mantenimiento")
  if (/panel|dashboard|gestion|editar/.test(normalized)) services.push("Panel de gestion")

  return services.length > 0 ? Array.from(new Set(services)) : ["Por definir"]
}

function inferProjectType(source: string) {
  const normalized = normalizeSource(source)

  if (/restaurante|bar|cafeteria|carta|reservas/.test(normalized)) return "Restaurante, bar o cafetería"
  if (/tienda|ecommerce|catalogo|producto|ropa|comercio/.test(normalized)) return "Tienda o comercio"
  if (/clinica|salud|fisio|dentista|centro medico/.test(normalized)) return "Clinica o centro profesional"
  if (/freelance|autonomo|consultor|profesional independiente/.test(normalized)) return "Profesional independiente"
  if (/hotel|alojamiento|turismo|apartamento/.test(normalized)) return "Turismo o alojamiento"
  if (/visual|imagen|foto|video|reel|pantalla|escaparate/.test(normalized)) return "Proyecto visual o audiovisual"
  if (/web|landing|pagina|seo|presencia digital/.test(normalized)) return "Web o presencia digital"

  return "Por definir"
}

function detectUrgency(source: string) {
  const normalized = normalizeSource(source)
  if (/urgente|ya|cuanto antes|prisa|esta semana|hoy|manana|mañana/.test(normalized)) return "Alta"
  if (/pronto|rapido|rápido|en breve|lo antes posible/.test(normalized)) return "Media"
  return "No indicada"
}

function detectPriceSensitivity(source: string) {
  const normalized = normalizeSource(source)
  if (/caro|poco presupuesto|barato|economico|ajustar|no superar|maximo|maximo|limite/.test(normalized)) {
    return "Alta"
  }
  if (/precio|coste|presupuesto|tarifa|mensualidad|desde cuanto/.test(normalized)) return "Media"
  return "No detectada"
}

function detectFriction(source: string) {
  const normalized = normalizeSource(source)
  if (/me estas hablando demasiado|bloqueado|raro|no funciona|no entiendo|pesado|demasiado texto/.test(normalized)) {
    return "Alta"
  }
  if (/duda|no se|no sé|orientacion|orientación|me pierdo/.test(normalized)) return "Media"
  return "Baja"
}

function detectProjectClarity(source: string, services: string[]) {
  const normalized = normalizeSource(source)
  if (services.length >= 3 || /no tengo web|no tengo carta|no tengo fotos|quiero orientacion/.test(normalized)) {
    return "Media: hay necesidad clara, pero falta concretar alcance"
  }
  if (services.length >= 2 || /quiero|necesito|busco/.test(normalized)) return "Media"
  return "Inicial"
}

function detectClientType(source: string) {
  const normalized = normalizeSource(source)
  if (/restaurante|bar|cafeteria/.test(normalized)) return "Negocio de hostelería"
  if (/tienda|ecommerce|comercio|ropa/.test(normalized)) return "Comercio / retail"
  if (/clinica|salud|fisio|dentista/.test(normalized)) return "Servicio profesional / salud"
  if (/freelance|autonomo|consultor/.test(normalized)) return "Profesional independiente"
  if (/marca|empresa|negocio/.test(normalized)) return "Marca o negocio"
  return "No definido"
}

function detectObjections(source: string, questions: string[]) {
  const normalized = normalizeSource(source)
  const objections: string[] = []

  if (/no tengo web/.test(normalized)) objections.push("No tiene web actual")
  if (/no tengo carta/.test(normalized)) objections.push("No tiene carta preparada")
  if (/no tengo fotos/.test(normalized)) objections.push("No tiene fotos/material visual")
  if (/caro|poco presupuesto|barato|economico/.test(normalized)) objections.push("Sensibilidad al precio")
  if (/no entiendo|me pierdo|me estas hablando demasiado|demasiado texto/.test(normalized)) {
    objections.push("Necesita respuesta más directa y guiada")
  }

  return objections.length > 0 ? objections : questions.length > 0 ? questions : ["No detectadas"]
}

function recommendNextAction(urgency: string, friction: string, priceSensitivity: string) {
  if (friction === "Alta") return "Responder con un email breve, directo y con el siguiente paso claro."
  if (urgency === "Alta") return "Priorizar respuesta rápida y proponer una llamada o email de alcance inicial."
  if (priceSensitivity === "Alta") return "Proponer una fase inicial ajustada y dejar ampliaciones para después."
  return "Responder con orientación comercial y pedir solo los datos que falten para acotar alcance."
}

function buildFallbackInterest(history: AgentQuoteHistoryMessage[]) {
  const userMessages = history.filter((item) => item.role === "user").map((item) => item.content)
  const fallback = userMessages.slice(-5).join("\n").trim()

  return fallback || "No especificado. Revisar conversación."
}

function buildExecutiveSummary(args: {
  budgetLabel: string
  clientType: string
  email: string
  interest: string
  name: string
  projectType: string
  services: string[]
  source: string
  urgency: string
}) {
  const normalized = normalizeSource(args.source)
  const lines = [
    `Contacto: ${args.name || "nombre no indicado"} (${args.email}).`,
    `Tipo de cliente: ${args.clientType}. Proyecto: ${args.projectType}.`,
    `Necesidad principal: ${args.interest}`,
    `Servicios o bloques detectados: ${args.services.join(", ")}.`,
    `Urgencia: ${args.urgency}. Presupuesto indicado: ${args.budgetLabel}.`,
  ]

  if (/no tengo web/.test(normalized)) lines.push("El cliente indica que parte sin web.")
  if (/no tengo carta/.test(normalized)) lines.push("El cliente indica que no tiene carta preparada.")
  if (/no tengo fotos/.test(normalized)) lines.push("El cliente indica que no tiene fotos/material visual preparado.")

  return lines.slice(0, 8)
}

function listText(title: string, items: string[]) {
  if (items.length === 0) return `${title}:\n- No detectado`

  return [title, ...items.map((item) => `- ${item}`)].join("\n")
}

function listHtml(items: string[]) {
  if (items.length === 0) return "<li>No detectado</li>"

  return items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const rawName = normalizeText(body.name, 120)
    const email = normalizeText(body.email, 180)
    const phone = normalizeText(body.phone, 80)
    const rawProjectType = normalizeText(body.projectType, 500)
    const rawInterest = normalizeText(body.interest, 1200)
    const budget = normalizeText(body.budget, 300)
    const sessionId = normalizeText(body.sessionId, 160)
    const clientCopy = body.clientCopy === true
    const consent = body.consent === true
    const history = normalizeHistory(body.history)
    const summary = buildConversationSummary(history)
    const source = [rawName, rawProjectType, rawInterest, budget, ...summary.userMessages].join("\n")
    const name = rawName || "No indicado"
    const projectType = rawProjectType || inferProjectType(source)
    const interest = rawInterest || buildFallbackInterest(history)
    const budgetLabel = budget || "No indicado"
    const detectedServices = detectServices(source)
    const urgency = detectUrgency(source)
    const priceSensitivity = detectPriceSensitivity(source)
    const friction = detectFriction(source)
    const clarity = detectProjectClarity(source, detectedServices)
    const clientType = detectClientType(source)
    const objections = detectObjections(source, summary.questions)
    const nextAction = recommendNextAction(urgency, friction, priceSensitivity)
    const executiveSummary = buildExecutiveSummary({
      budgetLabel,
      clientType,
      email,
      interest,
      name,
      projectType,
      services: detectedServices,
      source,
      urgency,
    })
    const priceFocus =
      summary.priceQuestionCount > 1
        ? "Sí, ha preguntado varias veces por precio"
        : summary.priceQuestionCount === 1
          ? "Sí, ha preguntado por precio"
          : "No detectado"

    if (!consent) {
      return NextResponse.json(
        {
          error:
            "Antes de enviar, el cliente debe aceptar que Aplaudia trate los datos facilitados y el resumen de la solicitud solo para gestionar esta consulta y responder por email.",
        },
        { status: 400 },
      )
    }

    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ error: "Introduce un email valido." }, { status: 400 })
    }

    const date = new Date().toLocaleString("es-ES", {
      timeZone: "Europe/Madrid",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })

    const safeName = escapeHtml(name)
    const safeEmail = escapeHtml(email)
    const safePhone = escapeHtml(phone)
    const safeProjectType = escapeHtml(projectType)
    const safeInterest = escapeHtml(interest)
    const safeBudget = escapeHtml(budgetLabel)
    const safeSessionId = escapeHtml(sessionId || "No disponible")

    const internalText = [
      "Solicitud de presupuesto desde el chatbot de Aplaudia",
      "",
      `Fecha: ${date}`,
      `Nombre: ${name}`,
      `Email: ${email}`,
      phone ? `Telefono: ${phone}` : null,
      `Tipo de negocio/proyecto: ${projectType}`,
      `Servicios detectados: ${detectedServices.join(", ")}`,
      `Tipo de cliente: ${clientType}`,
      `Urgencia: ${urgency}`,
      `Interes aproximado: ${clarity}`,
      `Sensibilidad a precio: ${priceSensitivity}`,
      `Friccion detectada: ${friction}`,
      `Foco en precios: ${priceFocus}`,
      `Siguiente accion recomendada: ${nextAction}`,
      `Session: ${sessionId || "No disponible"}`,
      "",
      "Resumen ejecutivo:",
      ...executiveSummary.map((line) => `- ${line}`),
      "",
      "Interes principal indicado/inferido:",
      interest,
      "",
      "Presupuesto orientativo indicado por el cliente:",
      budgetLabel,
      "",
      listText("Necesidades, servicios o extras detectados", detectedServices),
      "",
      listText("Dudas u objeciones detectadas", objections),
      "",
      listText("Importes o referencias de presupuesto mencionadas por el agente", summary.priceLines),
      "",
      listText("Ultimos mensajes relevantes", summary.latestRelevantMessages),
      "",
      "Bloque legal:",
      "Consentimiento: aceptado antes de enviar.",
      "Finalidad: gestionar esta consulta y responder por email. No newsletter, publicidad ni otros fines.",
      "Persistencia: no se guarda en base de datos desde este endpoint.",
      clientCopy
        ? "Peticion del cliente: quiere recibir copia o respuesta por email. No se envia copia automatica desde el chatbot."
        : "Peticion del cliente: no ha pedido copia. No se envia copia automatica desde el chatbot.",
      "",
      listText("Resumen completo de conversacion", summary.transcript),
    ]
      .filter(Boolean)
      .join("\n")

    const internalHtml = `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /></head>
<body style="margin:0;padding:0;background:#07111f;font-family:Arial,Helvetica,sans-serif">
  <div style="max-width:760px;margin:32px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 24px 80px rgba(0,0,0,0.24)">
    <div style="background:#0b1220;padding:28px 32px">
      <p style="margin:0;color:#67e8f9;font-size:11px;text-transform:uppercase;letter-spacing:0.16em">Aplaudia · Chatbot</p>
      <h1 style="margin:8px 0 0;color:#ffffff;font-size:24px;font-weight:700">Solicitud comercial</h1>
      <p style="margin:8px 0 0;color:#94a3b8;font-size:13px">${date}</p>
    </div>
    <div style="padding:32px">
      <h2 style="margin:0 0 12px;color:#64748b;font-size:11px;text-transform:uppercase;letter-spacing:0.12em">Datos de contacto</h2>
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px;font-size:14px;color:#0f172a">
        <tr><td style="padding:7px 0;color:#64748b;width:160px">Nombre</td><td style="padding:7px 0;font-weight:700">${safeName}</td></tr>
        <tr><td style="padding:7px 0;color:#64748b">Email</td><td style="padding:7px 0"><a href="mailto:${safeEmail}" style="color:#2563eb;text-decoration:none">${safeEmail}</a></td></tr>
        ${safePhone ? `<tr><td style="padding:7px 0;color:#64748b">Telefono</td><td style="padding:7px 0"><a href="tel:${safePhone}" style="color:#0f172a;text-decoration:none">${safePhone}</a></td></tr>` : ""}
        <tr><td style="padding:7px 0;color:#64748b">Proyecto</td><td style="padding:7px 0">${safeProjectType}</td></tr>
        <tr><td style="padding:7px 0;color:#64748b">Session</td><td style="padding:7px 0">${safeSessionId}</td></tr>
      </table>

      <div style="background:#eff6ff;border-left:4px solid #2563eb;border-radius:10px;padding:16px 18px;margin-bottom:24px">
        <p style="margin:0;color:#1d4ed8;font-size:11px;text-transform:uppercase;letter-spacing:0.12em">Resumen ejecutivo</p>
        <ul style="margin:10px 0 0;padding-left:18px;color:#0f172a;font-size:14px;line-height:1.7">${listHtml(executiveSummary)}</ul>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:24px">
        <div style="background:#f8fafc;border-radius:10px;padding:14px 16px">
          <p style="margin:0;color:#64748b;font-size:11px;text-transform:uppercase;letter-spacing:0.12em">Servicios</p>
          <p style="margin:10px 0 0;color:#0f172a;font-size:14px;line-height:1.6">${escapeHtml(detectedServices.join(", "))}</p>
        </div>
        <div style="background:#f8fafc;border-radius:10px;padding:14px 16px">
          <p style="margin:0;color:#64748b;font-size:11px;text-transform:uppercase;letter-spacing:0.12em">Señales comerciales</p>
          <p style="margin:10px 0 0;color:#0f172a;font-size:14px;line-height:1.6">Urgencia: ${escapeHtml(urgency)}<br />Claridad: ${escapeHtml(clarity)}<br />Precio: ${escapeHtml(priceSensitivity)}<br />Fricción: ${escapeHtml(friction)}</p>
        </div>
      </div>

      <div style="background:#f8fafc;border-radius:10px;padding:16px 18px;margin-bottom:24px">
        <p style="margin:0;color:#64748b;font-size:11px;text-transform:uppercase;letter-spacing:0.12em">Interes / necesidad</p>
        <p style="margin:10px 0 0;color:#0f172a;font-size:15px;line-height:1.7;white-space:pre-wrap">${safeInterest}</p>
      </div>

      <div style="background:#f8fafc;border-radius:10px;padding:16px 18px;margin-bottom:24px">
        <p style="margin:0;color:#64748b;font-size:11px;text-transform:uppercase;letter-spacing:0.12em">Presupuesto</p>
        <p style="margin:10px 0 0;color:#0f172a;font-size:15px;line-height:1.7">${safeBudget}</p>
        <p style="margin:12px 0 0;color:#64748b;font-size:12px;line-height:1.6">Los importes tratados por el agente son orientativos y sin IVA.</p>
      </div>

      <div style="background:#f8fafc;border-radius:10px;padding:16px 18px;margin-bottom:24px">
        <p style="margin:0;color:#64748b;font-size:11px;text-transform:uppercase;letter-spacing:0.12em">Siguiente paso recomendado</p>
        <p style="margin:10px 0 0;color:#0f172a;font-size:15px;line-height:1.7">${escapeHtml(nextAction)}</p>
      </div>

      <h2 style="margin:0 0 10px;color:#64748b;font-size:11px;text-transform:uppercase;letter-spacing:0.12em">Dudas u objeciones</h2>
      <ul style="margin:0 0 24px;padding-left:18px;color:#1e293b;font-size:14px;line-height:1.7">${listHtml(objections)}</ul>

      <h2 style="margin:0 0 10px;color:#64748b;font-size:11px;text-transform:uppercase;letter-spacing:0.12em">Precios comentados</h2>
      <ul style="margin:0 0 24px;padding-left:18px;color:#1e293b;font-size:14px;line-height:1.7">${listHtml(summary.priceLines.length > 0 ? summary.priceLines : ["No hay importes concretos en el historial."])}</ul>

      <h2 style="margin:0 0 10px;color:#64748b;font-size:11px;text-transform:uppercase;letter-spacing:0.12em">Ultimos mensajes relevantes</h2>
      <pre style="white-space:pre-wrap;margin:0;background:#0f172a;color:#e2e8f0;border-radius:10px;padding:16px;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.6">${escapeHtml(summary.latestRelevantMessages.join("\n\n"))}</pre>

      <div style="background:#fff7ed;border-radius:10px;padding:16px 18px;margin-top:24px;color:#7c2d12;font-size:13px;line-height:1.7">
        <strong>Legal:</strong> consentimiento aceptado antes del envío. Finalidad: gestionar esta consulta y responder por email. No newsletter, publicidad ni otros fines. No se guarda en base de datos. ${
          clientCopy
            ? "El cliente ha pedido copia o respuesta por email; queda como nota interna, sin copia automática."
            : "El chatbot no envía copia automática al cliente."
        }
      </div>
    </div>
  </div>
</body>
</html>`

    try {
      const to = getInternalEmailRecipient("AGENT_QUOTE_RECIPIENT_EMAIL")

      await sendInternalEmail({
        subject: `Solicitud Aplaudia - ${projectType} - ${email}`,
        html: internalHtml,
        text: internalText,
        replyTo: email,
        to,
      })
    } catch (error) {
      if (error instanceof CloudflareEmailConfigurationError) {
        console.error("[api/agent/quote] Cloudflare Email Service no configurado:", error.message)
        return NextResponse.json(
          { error: "El envio interno por email no esta configurado todavia." },
          { status: 503 },
        )
      }

      console.error("[api/agent/quote] Error Cloudflare Email Service:", error)
      return NextResponse.json({ error: "No se ha podido enviar la solicitud." }, { status: 500 })
    }

    return NextResponse.json({ clientCopyRequested: clientCopy, clientCopySent: false, ok: true })
  } catch (error) {
    console.error("[api/agent/quote] Error inesperado:", error)
    return NextResponse.json({ error: "No se ha podido enviar la solicitud." }, { status: 500 })
  }
}
