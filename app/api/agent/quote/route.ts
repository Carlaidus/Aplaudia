import { NextResponse } from "next/server"
import { Resend } from "resend"

export const runtime = "nodejs"

type AgentQuoteHistoryMessage = {
  role: "assistant" | "user"
  content: string
}

const FALLBACK_FROM = "Aplaudia <onboarding@resend.dev>"
const INTERNAL_RECIPIENT_EMAIL = "carlosvfx@gmail.com"
const MAX_TEXT_LENGTH = 1200
const MAX_HISTORY_ITEMS = 12

function escapeHtml(value: unknown) {
  if (typeof value !== "string") return ""

  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
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
  const questions = userMessages.filter((message) => message.includes("?") || message.includes("¿")).slice(-5)
  const priceQuestionCount = userMessages.filter((message) =>
    /precio|coste|presupuesto|tarifa|mensualidad|mantenimiento|cu[aá]nto cuesta|barato|econ[oó]mico|desde cu[aá]nto/i.test(
      message,
    ),
  ).length
  const priceLines = assistantMessages
    .flatMap((message) => message.split("\n"))
    .map((line) => line.trim())
    .filter((line) => /€|eur|desde|presupuesto|sin iva/i.test(line))
    .slice(-8)

  return {
    lastUserMessages: userMessages.slice(-5),
    priceQuestionCount,
    priceLines,
    questions,
    transcript: history.map((item) => `${item.role === "user" ? "Cliente" : "Aplaudia"}: ${item.content}`),
  }
}

function detectServices(...values: string[]) {
  const source = values.join(" ").toLowerCase()
  const services: string[] = []

  if (/web|landing|pagina|p[aá]gina|catalogo|cat[aá]logo|seo/.test(source)) services.push("Web / landing / catalogo")
  if (/reserva|reservas/.test(source)) services.push("Reservas")
  if (/agente|chatbot|whatsapp|ia/.test(source)) services.push("Agente IA / WhatsApp")
  if (/visual|imagen|foto|video|v[ií]deo|pantalla|escaparate/.test(source)) services.push("Visuales / imagen / video")
  if (/mantenimiento|mensualidad|soporte|actualizaci[oó]n/.test(source)) services.push("Mantenimiento")

  return services.length > 0 ? services : ["Por definir"]
}

function inferInterestLevel(priceQuestionCount: number, interest: string, budget: string) {
  const source = `${interest} ${budget}`.toLowerCase()
  let score = 0

  if (/presupuesto|propuesta|contact|hablar|reuni[oó]n|llamada|empezar|contratar/.test(source)) score += 2
  if (budget) score += 1
  if (priceQuestionCount > 0) score += 1
  if (priceQuestionCount > 1) score += 1

  if (score >= 4) return "Alto"
  if (score >= 2) return "Medio"
  return "Inicial"
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

    const name = normalizeText(body.name, 120)
    const email = normalizeText(body.email, 180)
    const phone = normalizeText(body.phone, 80)
    const projectType = normalizeText(body.projectType, 500)
    const interest = normalizeText(body.interest, 1200)
    const budget = normalizeText(body.budget, 300)
    const sessionId = normalizeText(body.sessionId, 160)
    const clientCopy = body.clientCopy === true
    const consent = body.consent === true
    const history = normalizeHistory(body.history)
    const summary = buildConversationSummary(history)
    const detectedServices = detectServices(projectType, interest, budget, summary.transcript.join(" "))
    const interestLevel = inferInterestLevel(summary.priceQuestionCount, interest, budget)
    const priceFocus =
      summary.priceQuestionCount > 1
        ? "Si, ha preguntado varias veces por precio"
        : summary.priceQuestionCount === 1
          ? "Si, ha preguntado por precio"
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

    if (!name) {
      return NextResponse.json({ error: "El nombre es obligatorio." }, { status: 400 })
    }

    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ error: "Introduce un email valido." }, { status: 400 })
    }

    if (!projectType || projectType.length < 3) {
      return NextResponse.json({ error: "Indica el tipo de negocio o proyecto." }, { status: 400 })
    }

    if (!interest || interest.length < 10) {
      return NextResponse.json({ error: "Resume un poco el proyecto o la necesidad principal." }, { status: 400 })
    }

    const apiKey = process.env.RESEND_API_KEY

    if (!apiKey) {
      console.error("[api/agent/quote] RESEND_API_KEY no configurada")
      return NextResponse.json(
        { error: "El envio por email no esta configurado todavia." },
        { status: 503 },
      )
    }

    const resend = new Resend(apiKey)
    const from = process.env.EMAIL_FROM?.trim() || FALLBACK_FROM
    const to = INTERNAL_RECIPIENT_EMAIL

    const date = new Date().toLocaleString("es-ES", {
      timeZone: "Europe/Madrid",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })

    const budgetLabel = budget || "No indicado por el cliente"
    const safeProjectType = escapeHtml(projectType)
    const safeName = escapeHtml(name)
    const safeEmail = escapeHtml(email)
    const safePhone = escapeHtml(phone)
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
      `Nivel de interes aproximado: ${interestLevel}`,
      `Foco en precios: ${priceFocus}`,
      `Session: ${sessionId || "No disponible"}`,
      "Consentimiento: aceptado antes de enviar",
      "Finalidad: gestionar esta consulta y responder por email. No newsletter, publicidad ni otros fines.",
      "Persistencia: no se guarda en base de datos desde este endpoint.",
      clientCopy ? "Copia cliente: solicitada" : "Copia cliente: no solicitada",
      "",
      "Interes principal indicado por el cliente:",
      interest,
      "",
      "Presupuesto orientativo indicado por el cliente:",
      budgetLabel,
      "",
      listText("Dudas detectadas", summary.questions),
      "",
      listText("Ultimos mensajes del cliente", summary.lastUserMessages),
      "",
      listText("Importes o referencias de presupuesto mencionadas por el agente", summary.priceLines),
      "",
      listText("Resumen de conversacion", summary.transcript),
    ]
      .filter(Boolean)
      .join("\n")

    const internalHtml = `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /></head>
<body style="margin:0;padding:0;background:#07111f;font-family:Arial,Helvetica,sans-serif">
  <div style="max-width:720px;margin:32px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 24px 80px rgba(0,0,0,0.24)">
    <div style="background:#0b1220;padding:28px 32px">
      <p style="margin:0;color:#67e8f9;font-size:11px;text-transform:uppercase;letter-spacing:0.16em">Aplaudia · Chatbot</p>
      <h1 style="margin:8px 0 0;color:#ffffff;font-size:24px;font-weight:700">Solicitud de presupuesto</h1>
      <p style="margin:8px 0 0;color:#94a3b8;font-size:13px">${date}</p>
    </div>
    <div style="padding:32px">
      <h2 style="margin:0 0 12px;color:#64748b;font-size:11px;text-transform:uppercase;letter-spacing:0.12em">Datos del cliente</h2>
      <table style="width:100%;border-collapse:collapse;margin-bottom:28px;font-size:14px;color:#0f172a">
        <tr><td style="padding:7px 0;color:#64748b;width:150px">Nombre</td><td style="padding:7px 0;font-weight:700">${safeName}</td></tr>
        <tr><td style="padding:7px 0;color:#64748b">Email</td><td style="padding:7px 0"><a href="mailto:${safeEmail}" style="color:#2563eb;text-decoration:none">${safeEmail}</a></td></tr>
        ${safePhone ? `<tr><td style="padding:7px 0;color:#64748b">Telefono</td><td style="padding:7px 0"><a href="tel:${safePhone}" style="color:#0f172a;text-decoration:none">${safePhone}</a></td></tr>` : ""}
        <tr><td style="padding:7px 0;color:#64748b">Tipo proyecto</td><td style="padding:7px 0">${safeProjectType}</td></tr>
        <tr><td style="padding:7px 0;color:#64748b">Session</td><td style="padding:7px 0">${safeSessionId}</td></tr>
      </table>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:24px">
        <div style="background:#f8fafc;border-radius:10px;padding:14px 16px">
          <p style="margin:0;color:#64748b;font-size:11px;text-transform:uppercase;letter-spacing:0.12em">Servicios de interes</p>
          <p style="margin:10px 0 0;color:#0f172a;font-size:14px;line-height:1.6">${escapeHtml(detectedServices.join(", "))}</p>
        </div>
        <div style="background:#f8fafc;border-radius:10px;padding:14px 16px">
          <p style="margin:0;color:#64748b;font-size:11px;text-transform:uppercase;letter-spacing:0.12em">Interes / precio</p>
          <p style="margin:10px 0 0;color:#0f172a;font-size:14px;line-height:1.6">Interes: ${escapeHtml(interestLevel)}<br />Precio: ${escapeHtml(priceFocus)}</p>
        </div>
      </div>

      <div style="background:#f8fafc;border-left:4px solid #2563eb;border-radius:10px;padding:16px 18px;margin-bottom:24px">
        <p style="margin:0;color:#64748b;font-size:11px;text-transform:uppercase;letter-spacing:0.12em">Interes</p>
        <p style="margin:10px 0 0;color:#0f172a;font-size:15px;line-height:1.7;white-space:pre-wrap">${safeInterest}</p>
      </div>

      <div style="background:#f8fafc;border-radius:10px;padding:16px 18px;margin-bottom:24px">
        <p style="margin:0;color:#64748b;font-size:11px;text-transform:uppercase;letter-spacing:0.12em">Presupuesto orientativo del cliente</p>
        <p style="margin:10px 0 0;color:#0f172a;font-size:15px;line-height:1.7">${safeBudget}</p>
        <p style="margin:12px 0 0;color:#64748b;font-size:12px;line-height:1.6">Los importes tratados por el agente son orientativos y sin IVA.</p>
      </div>

      <h2 style="margin:0 0 10px;color:#64748b;font-size:11px;text-transform:uppercase;letter-spacing:0.12em">Dudas detectadas</h2>
      <ul style="margin:0 0 24px;padding-left:18px;color:#1e293b;font-size:14px;line-height:1.7">${listHtml(summary.questions)}</ul>

      <h2 style="margin:0 0 10px;color:#64748b;font-size:11px;text-transform:uppercase;letter-spacing:0.12em">Importes o referencias mencionadas</h2>
      <ul style="margin:0 0 24px;padding-left:18px;color:#1e293b;font-size:14px;line-height:1.7">${listHtml(summary.priceLines)}</ul>

      <h2 style="margin:0 0 10px;color:#64748b;font-size:11px;text-transform:uppercase;letter-spacing:0.12em">Resumen de conversacion</h2>
      <pre style="white-space:pre-wrap;margin:0;background:#0f172a;color:#e2e8f0;border-radius:10px;padding:16px;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.6">${escapeHtml(summary.transcript.join("\n\n"))}</pre>
    </div>
    <div style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:16px 32px;color:#94a3b8;font-size:11px;line-height:1.6">
      Correo interno generado automaticamente desde aplaudia.com. Consentimiento aceptado antes del envio. No se guarda en base de datos. No usar para newsletter, publicidad ni otros fines.
    </div>
  </div>
</body>
</html>`

    const internalResult = await resend.emails.send({
      from,
      to,
      subject: `Solicitud de presupuesto Aplaudia - ${name}`,
      html: internalHtml,
      text: internalText,
      replyTo: email,
    })

    if (internalResult.error) {
      console.error("[api/agent/quote] Error Resend interno:", internalResult.error)
      return NextResponse.json({ error: "No se ha podido enviar la solicitud." }, { status: 500 })
    }

    if (clientCopy) {
      const clientPriceLines = summary.priceLines.length > 0 ? summary.priceLines : []
      const clientText = [
        `Hola ${name},`,
        "",
        "Hemos recibido tu solicitud para Aplaudia.",
        "",
        "Datos enviados:",
        `Nombre: ${name}`,
        `Email: ${email}`,
        phone ? `Telefono: ${phone}` : null,
        `Tipo de negocio/proyecto: ${projectType}`,
        "",
        "Interes principal:",
        interest,
        "",
        `Presupuesto o rango indicado: ${budgetLabel}`,
        clientPriceLines.length > 0 ? "" : null,
        clientPriceLines.length > 0 ? "Referencias comentadas en el chat:" : null,
        ...clientPriceLines.map((line) => `- ${line}`),
        "",
        "Aplaudia revisara el caso y respondera por email.",
        "Los datos se usan solo para gestionar esta consulta y responder por email. No se guardan en una base de datos desde este endpoint ni se usan para newsletter o publicidad.",
        "",
        "Nota: cualquier importe comentado es orientativo y sin IVA.",
      ]
        .filter(Boolean)
        .join("\n")

      const clientHtml = `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:Arial,Helvetica,sans-serif">
  <div style="max-width:640px;margin:32px auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0">
    <div style="background:#0b1220;padding:28px 32px">
      <p style="margin:0;color:#67e8f9;font-size:11px;text-transform:uppercase;letter-spacing:0.16em">Aplaudia</p>
      <h1 style="margin:8px 0 0;color:#ffffff;font-size:22px;font-weight:700">Copia de tu solicitud</h1>
    </div>
    <div style="padding:32px;color:#1e293b;font-size:15px;line-height:1.7">
      <p style="margin:0 0 16px">Hola ${safeName},</p>
      <p style="margin:0 0 20px">Hemos recibido tu solicitud para Aplaudia. Revisaremos el caso y responderemos por email.</p>
      <p style="margin:0 0 20px;color:#64748b;font-size:13px">Los datos se usan solo para gestionar esta consulta y responder por email. No se guardan en una base de datos desde este endpoint ni se usan para newsletter o publicidad.</p>
      <h2 style="margin:0 0 8px;color:#64748b;font-size:11px;text-transform:uppercase;letter-spacing:0.12em">Interes principal</h2>
      <p style="margin:0 0 20px"><strong>Tipo de negocio/proyecto:</strong> ${safeProjectType}</p>
      <p style="margin:0 0 20px;white-space:pre-wrap">${safeInterest}</p>
      <h2 style="margin:0 0 8px;color:#64748b;font-size:11px;text-transform:uppercase;letter-spacing:0.12em">Presupuesto o rango indicado</h2>
      <p style="margin:0 0 20px">${safeBudget}</p>
      ${
        clientPriceLines.length > 0
          ? `<h2 style="margin:0 0 8px;color:#64748b;font-size:11px;text-transform:uppercase;letter-spacing:0.12em">Referencias comentadas en el chat</h2><ul style="margin:0 0 20px;padding-left:18px">${clientPriceLines.map((line) => `<li>${escapeHtml(line)}</li>`).join("")}</ul>`
          : ""
      }
      <p style="margin:0;color:#64748b;font-size:13px">Cualquier importe comentado es orientativo y sin IVA.</p>
    </div>
  </div>
</body>
</html>`

      const clientResult = await resend.emails.send({
        from,
        to: email,
        subject: "Copia de tu solicitud a Aplaudia",
        html: clientHtml,
        text: clientText,
        replyTo: to,
      })

      if (clientResult.error) {
        console.error("[api/agent/quote] Error Resend copia cliente:", clientResult.error)
        return NextResponse.json(
          { error: "La solicitud se ha enviado, pero no se ha podido enviar la copia al cliente." },
          { status: 500 },
        )
      }
    }

    return NextResponse.json({ clientCopySent: clientCopy, ok: true })
  } catch (error) {
    console.error("[api/agent/quote] Error inesperado:", error)
    return NextResponse.json({ error: "No se ha podido enviar la solicitud." }, { status: 500 })
  }
}
