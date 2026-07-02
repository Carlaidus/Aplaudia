import { NextResponse } from "next/server"
import {
  CloudflareEmailConfigurationError,
  getInternalEmailRecipient,
  sendInternalEmail,
} from "@/lib/email/cloudflare-email"
import {
  analyzeAgentQuote,
  isValidEmail,
  normalizeHistory,
  normalizeText,
} from "@/lib/agent/quote-analysis"

export const runtime = "nodejs"

function escapeHtml(value: unknown) {
  if (typeof value !== "string") return ""

  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
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

    const analysis = analyzeAgentQuote({
      budget,
      email,
      history,
      interest: rawInterest,
      name: rawName,
      phone,
      projectType: rawProjectType,
      sessionId,
    })
    const date = new Date().toLocaleString("es-ES", {
      timeZone: "Europe/Madrid",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })

    const safeName = escapeHtml(analysis.name)
    const safeEmail = escapeHtml(email)
    const safePhone = escapeHtml(phone)
    const safeProjectType = escapeHtml(analysis.projectType)
    const safeInterest = escapeHtml(analysis.interest)
    const safeBudget = escapeHtml(analysis.budgetLabel)
    const safeSessionId = escapeHtml(sessionId || "No disponible")

    const internalText = [
      "Solicitud de presupuesto desde el chatbot de Aplaudia",
      "",
      `Fecha: ${date}`,
      `Nombre: ${analysis.name}`,
      `Email: ${email}`,
      phone ? `Telefono: ${phone}` : null,
      `Tipo de negocio/proyecto: ${analysis.projectType}`,
      `Servicios de interes: ${analysis.detectedServices.join(", ")}`,
      `Materiales mencionados: ${analysis.materials.join(", ")}`,
      `Tipo de cliente: ${analysis.clientType}`,
      `Urgencia: ${analysis.urgency}`,
      `Interes aproximado: ${analysis.clarity}`,
      `Sensibilidad a precio: ${analysis.priceSensitivity}`,
      `Friccion detectada: ${analysis.friction}`,
      `Foco en precios: ${analysis.priceFocus}`,
      `Siguiente accion recomendada: ${analysis.nextAction}`,
      `Session: ${sessionId || "No disponible"}`,
      "",
      "Resumen ejecutivo:",
      ...analysis.executiveSummary.map((line) => `- ${line}`),
      "",
      "Interes principal indicado/inferido:",
      analysis.interest,
      "",
      "Presupuesto orientativo indicado por el cliente:",
      analysis.budgetLabel,
      "",
      listText("Servicios de interes", analysis.detectedServices),
      "",
      listText("Materiales mencionados", analysis.materials),
      "",
      listText("Dudas u objeciones detectadas", analysis.objections),
      "",
      listText("Importes o referencias de presupuesto mencionadas por el agente", analysis.summary.priceLines),
      "",
      listText("Ultimos mensajes relevantes", analysis.summary.latestRelevantMessages),
      "",
      "Bloque legal:",
      "Consentimiento: aceptado antes de enviar.",
      "Finalidad: gestionar esta consulta y responder por email. No newsletter, publicidad ni otros fines.",
      "Persistencia: no se guarda en base de datos desde este endpoint.",
      clientCopy
        ? "Peticion del cliente: quiere recibir copia o respuesta por email. No se envia copia automatica desde el chatbot."
        : "Peticion del cliente: no ha pedido copia. No se envia copia automatica desde el chatbot.",
      "",
      listText("Resumen completo de conversacion", analysis.summary.transcript),
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
        <ul style="margin:10px 0 0;padding-left:18px;color:#0f172a;font-size:14px;line-height:1.7">${listHtml(analysis.executiveSummary)}</ul>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:24px">
        <div style="background:#f8fafc;border-radius:10px;padding:14px 16px">
          <p style="margin:0;color:#64748b;font-size:11px;text-transform:uppercase;letter-spacing:0.12em">Servicios de interes</p>
          <p style="margin:10px 0 0;color:#0f172a;font-size:14px;line-height:1.6">${escapeHtml(analysis.detectedServices.join(", "))}</p>
        </div>
        <div style="background:#f8fafc;border-radius:10px;padding:14px 16px">
          <p style="margin:0;color:#64748b;font-size:11px;text-transform:uppercase;letter-spacing:0.12em">Materiales mencionados</p>
          <p style="margin:10px 0 0;color:#0f172a;font-size:14px;line-height:1.6">${escapeHtml(analysis.materials.join(", "))}</p>
        </div>
      </div>

      <div style="background:#f8fafc;border-radius:10px;padding:16px 18px;margin-bottom:24px">
        <p style="margin:0;color:#64748b;font-size:11px;text-transform:uppercase;letter-spacing:0.12em">Senales comerciales</p>
        <p style="margin:10px 0 0;color:#0f172a;font-size:14px;line-height:1.7">Urgencia: ${escapeHtml(analysis.urgency)}<br />Claridad: ${escapeHtml(analysis.clarity)}<br />Precio: ${escapeHtml(analysis.priceSensitivity)}<br />Friccion: ${escapeHtml(analysis.friction)}</p>
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
        <p style="margin:10px 0 0;color:#0f172a;font-size:15px;line-height:1.7">${escapeHtml(analysis.nextAction)}</p>
      </div>

      <h2 style="margin:0 0 10px;color:#64748b;font-size:11px;text-transform:uppercase;letter-spacing:0.12em">Dudas u objeciones</h2>
      <ul style="margin:0 0 24px;padding-left:18px;color:#1e293b;font-size:14px;line-height:1.7">${listHtml(analysis.objections)}</ul>

      <h2 style="margin:0 0 10px;color:#64748b;font-size:11px;text-transform:uppercase;letter-spacing:0.12em">Precios comentados</h2>
      <ul style="margin:0 0 24px;padding-left:18px;color:#1e293b;font-size:14px;line-height:1.7">${listHtml(analysis.summary.priceLines.length > 0 ? analysis.summary.priceLines : ["No hay importes concretos en el historial."])}</ul>

      <h2 style="margin:0 0 10px;color:#64748b;font-size:11px;text-transform:uppercase;letter-spacing:0.12em">Ultimos mensajes relevantes</h2>
      <pre style="white-space:pre-wrap;margin:0;background:#0f172a;color:#e2e8f0;border-radius:10px;padding:16px;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.6">${escapeHtml(analysis.summary.latestRelevantMessages.join("\n\n"))}</pre>

      <div style="background:#fff7ed;border-radius:10px;padding:16px 18px;margin-top:24px;color:#7c2d12;font-size:13px;line-height:1.7">
        <strong>Legal:</strong> consentimiento aceptado antes del envio. Finalidad: gestionar esta consulta y responder por email. No newsletter, publicidad ni otros fines. No se guarda en base de datos. ${
          clientCopy
            ? "El cliente ha pedido copia o respuesta por email; queda como nota interna, sin copia automatica."
            : "El chatbot no envia copia automatica al cliente."
        }
      </div>
    </div>
  </div>
</body>
</html>`

    try {
      const to = getInternalEmailRecipient("AGENT_QUOTE_RECIPIENT_EMAIL")

      await sendInternalEmail({
        subject: `Solicitud Aplaudia - ${analysis.projectType} - ${email}`,
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
