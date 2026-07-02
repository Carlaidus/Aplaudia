import type { InternalLeadEmail, LeadAnalysis, LeadEngineConfig } from "./lead-types"

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
  return [title, ...(items.length > 0 ? items : ["No indicado"]).map((item) => `- ${item}`)].join("\n")
}

function listHtml(items: string[]) {
  const source = items.length > 0 ? items : ["No indicado"]

  return source.map((item) => `<li>${escapeHtml(item)}</li>`).join("")
}

function signalRows(analysis: LeadAnalysis) {
  const signals = analysis.commercialSignals

  return [
    signals.urgency,
    signals.timeline,
    signals.complexity,
    signals.clarity,
    signals.priceSensitivity,
    signals.priceConcern,
    signals.friction,
    `Proximo paso recomendado: ${signals.nextAction}`,
  ].filter(Boolean) as string[]
}

export function buildInternalLeadEmail(args: {
  analysis: LeadAnalysis
  clientCopyRequested: boolean
  config: LeadEngineConfig
  date: string
}): InternalLeadEmail {
  const { analysis, clientCopyRequested, config, date } = args
  const subjectName = analysis.contact.name !== "No indicado" ? analysis.contact.name : analysis.contact.email
  const subject = `Nueva solicitud ${config.brandName} - ${analysis.projectType} - ${subjectName}`
  const phoneLabel = analysis.contact.phone || "No indicado"
  const phoneSignal = analysis.contact.phone
    ? "Teléfono facilitado: puede usarse para contacto directo si Aplaudia lo considera oportuno."
    : null
  const signals = signalRows(analysis)
  if (phoneSignal) signals.unshift(phoneSignal)
  const priceLines =
    analysis.priceLines.length > 0
      ? analysis.priceLines
      : ["No hay precio concreto comentado. Usar las referencias internas solo como orientacion."]

  const text = [
    subject,
    "",
    "1. Contacto",
    `Nombre: ${analysis.contact.name}`,
    `Email: ${analysis.contact.email}`,
    `Teléfono: ${phoneLabel}`,
    `Canal: ${config.channelLabel}`,
    "Consentimiento: Si",
    `Fecha/hora: ${date}`,
    "",
    "2. Resumen para responder",
    analysis.summaryForReply,
    "",
    "3. Necesidad detectada",
    `Tipo de proyecto: ${analysis.projectType}`,
    listText("Servicios pedidos", analysis.requestedServices),
    listText("Funciones mencionadas", analysis.requestedServices.filter((service) => service !== "Web / landing")),
    listText("Materiales mencionados", analysis.materials),
    `Objetivo principal: ${analysis.objective}`,
    "",
    "4. Dudas o puntos a responder",
    listText("Puntos", analysis.questions),
    "",
    "5. Precio y alcance",
    listText("Precio orientativo o referencia util", priceLines),
    `Presupuesto maximo del cliente: ${analysis.budgetLabel}`,
    "Nota interna: importes orientativos sin IVA.",
    "",
    "6. Senales comerciales utiles",
    listText("Senales", signals),
    "",
    "7. Frases utiles del cliente",
    listText("Frases", analysis.usefulClientPhrases),
    "",
    "8. Nota legal minima",
    `Consentimiento aceptado. Uso limitado a gestionar esta consulta y responder por email. No newsletter, no publicidad, sin base de datos, sin copia automatica al cliente.${
      clientCopyRequested ? " El cliente ha pedido copia o respuesta por email; gestionarlo manualmente." : ""
    }`,
  ]
    .filter(Boolean)
    .join("\n")

  const html = `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /></head>
<body style="margin:0;padding:0;background:#07111f;font-family:Arial,Helvetica,sans-serif">
  <div style="max-width:760px;margin:32px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 24px 80px rgba(0,0,0,0.24)">
    <div style="background:#0b1220;padding:28px 32px">
      <p style="margin:0;color:#67e8f9;font-size:11px;text-transform:uppercase;letter-spacing:0.16em">${escapeHtml(config.brandName)} · ${escapeHtml(config.channelLabel)}</p>
      <h1 style="margin:8px 0 0;color:#ffffff;font-size:24px;font-weight:700">Nueva solicitud comercial</h1>
      <p style="margin:8px 0 0;color:#94a3b8;font-size:13px">${escapeHtml(date)}</p>
    </div>
    <div style="padding:32px">
      <h2 style="margin:0 0 12px;color:#64748b;font-size:11px;text-transform:uppercase;letter-spacing:0.12em">1. Contacto</h2>
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px;font-size:14px;color:#0f172a">
        <tr><td style="padding:7px 0;color:#64748b;width:170px">Nombre</td><td style="padding:7px 0;font-weight:700">${escapeHtml(analysis.contact.name)}</td></tr>
        <tr><td style="padding:7px 0;color:#64748b">Email</td><td style="padding:7px 0"><a href="mailto:${escapeHtml(analysis.contact.email)}" style="color:#2563eb;text-decoration:none">${escapeHtml(analysis.contact.email)}</a></td></tr>
        <tr><td style="padding:7px 0;color:#64748b">Teléfono</td><td style="padding:7px 0">${escapeHtml(phoneLabel)}</td></tr>
        <tr><td style="padding:7px 0;color:#64748b">Canal</td><td style="padding:7px 0">${escapeHtml(config.channelLabel)}</td></tr>
        <tr><td style="padding:7px 0;color:#64748b">Consentimiento</td><td style="padding:7px 0">Si</td></tr>
      </table>

      <div style="background:#eff6ff;border-left:4px solid #2563eb;border-radius:10px;padding:16px 18px;margin-bottom:24px">
        <p style="margin:0;color:#1d4ed8;font-size:11px;text-transform:uppercase;letter-spacing:0.12em">2. Resumen para responder</p>
        <p style="margin:10px 0 0;color:#0f172a;font-size:15px;line-height:1.7">${escapeHtml(analysis.summaryForReply)}</p>
      </div>

      <h2 style="margin:0 0 12px;color:#64748b;font-size:11px;text-transform:uppercase;letter-spacing:0.12em">3. Necesidad detectada</h2>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:24px">
        <div style="background:#f8fafc;border-radius:10px;padding:14px 16px">
          <p style="margin:0;color:#64748b;font-size:11px;text-transform:uppercase;letter-spacing:0.12em">Tipo de proyecto</p>
          <p style="margin:10px 0 0;color:#0f172a;font-size:14px;line-height:1.6">${escapeHtml(analysis.projectType)}</p>
        </div>
        <div style="background:#f8fafc;border-radius:10px;padding:14px 16px">
          <p style="margin:0;color:#64748b;font-size:11px;text-transform:uppercase;letter-spacing:0.12em">Objetivo principal</p>
          <p style="margin:10px 0 0;color:#0f172a;font-size:14px;line-height:1.6">${escapeHtml(analysis.objective)}</p>
        </div>
      </div>
      <ul style="margin:0 0 18px;padding-left:18px;color:#1e293b;font-size:14px;line-height:1.7">${listHtml(analysis.requestedServices)}</ul>
      <p style="margin:0 0 24px;color:#475569;font-size:14px;line-height:1.7"><strong>Materiales mencionados:</strong> ${escapeHtml(analysis.materials.join(", "))}</p>

      <h2 style="margin:0 0 10px;color:#64748b;font-size:11px;text-transform:uppercase;letter-spacing:0.12em">4. Dudas o puntos a responder</h2>
      <ul style="margin:0 0 24px;padding-left:18px;color:#1e293b;font-size:14px;line-height:1.7">${listHtml(analysis.questions)}</ul>

      <h2 style="margin:0 0 10px;color:#64748b;font-size:11px;text-transform:uppercase;letter-spacing:0.12em">5. Precio y alcance</h2>
      <ul style="margin:0 0 10px;padding-left:18px;color:#1e293b;font-size:14px;line-height:1.7">${listHtml(priceLines)}</ul>
      <p style="margin:0 0 24px;color:#64748b;font-size:13px;line-height:1.6">Presupuesto maximo del cliente: ${escapeHtml(analysis.budgetLabel)}. Nota interna: importes orientativos sin IVA.</p>

      <h2 style="margin:0 0 10px;color:#64748b;font-size:11px;text-transform:uppercase;letter-spacing:0.12em">6. Senales comerciales utiles</h2>
      <ul style="margin:0 0 24px;padding-left:18px;color:#1e293b;font-size:14px;line-height:1.7">${listHtml(signals)}</ul>

      <h2 style="margin:0 0 10px;color:#64748b;font-size:11px;text-transform:uppercase;letter-spacing:0.12em">7. Frases utiles del cliente</h2>
      <ul style="margin:0 0 24px;padding-left:18px;color:#1e293b;font-size:14px;line-height:1.7">${listHtml(analysis.usefulClientPhrases)}</ul>

      <div style="background:#fff7ed;border-radius:10px;padding:16px 18px;color:#7c2d12;font-size:13px;line-height:1.7">
        <strong>8. Nota legal minima:</strong> Consentimiento aceptado. Uso limitado a gestionar esta consulta y responder por email. No newsletter, no publicidad, sin base de datos, sin copia automatica al cliente.${clientCopyRequested ? " El cliente ha pedido copia o respuesta por email; gestionarlo manualmente." : ""}
      </div>
    </div>
  </div>
</body>
</html>`

  return { html, subject, text }
}
