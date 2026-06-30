import { NextResponse } from "next/server"
import { Resend } from "resend"
import {
  contactNeeds,
  defaultContactDeliveryChannel,
  defaultContactDeliveryChannels,
  defaultContactNeedIds,
  getContactNeeds,
  type ContactDeliveryChannel,
  type ContactNeedId,
} from "@/content/contact"
import { siteConfig } from "@/content/site"

export const runtime = "nodejs"

const FALLBACK_FROM = "Aplaudia <onboarding@resend.dev>"
type ContactDeliveryMode = ContactDeliveryChannel | "both"

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}

function escapeHtml(value: unknown) {
  if (typeof value !== "string") return ""

  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

function normalizeText(value: unknown) {
  return typeof value === "string" ? value.trim() : ""
}

function normalizeDeliveryChannel(value: unknown): ContactDeliveryMode {
  const clean = normalizeText(value)

  if (clean === "whatsapp") return "whatsapp"
  if (clean === "both") return "both"
  if (clean === "email") return "email"

  return defaultContactDeliveryChannel
}

function normalizeDeliveryChannels(value: unknown, legacyValue: unknown): ContactDeliveryChannel[] {
  const validIds = new Set<ContactDeliveryChannel>(["email", "whatsapp"])
  const hasExplicitChannels = Array.isArray(value)
  const source = hasExplicitChannels
    ? value
    : normalizeDeliveryChannel(legacyValue) === "both"
      ? ["email", "whatsapp"]
      : [normalizeDeliveryChannel(legacyValue)]
  const seen = new Set<ContactDeliveryChannel>()

  source.forEach((item) => {
    const id = normalizeText(item) as ContactDeliveryChannel
    if (!validIds.has(id) || seen.has(id)) return
    seen.add(id)
  })

  if (hasExplicitChannels) return Array.from(seen)
  return seen.size > 0 ? Array.from(seen) : [...defaultContactDeliveryChannels]
}

function getDeliveryLabel(channels: ContactDeliveryChannel[]) {
  if (channels.includes("email") && channels.includes("whatsapp")) return "Email y WhatsApp"
  if (channels.includes("whatsapp")) return "WhatsApp"
  return "Email"
}

function normalizeNeeds(value: unknown, legacyProjectType: unknown): ContactNeedId[] {
  const validIds = new Set<ContactNeedId>(contactNeeds.map((need) => need.id))
  const source = Array.isArray(value)
    ? value
    : normalizeText(legacyProjectType)
      ? [legacyProjectType]
      : defaultContactNeedIds
  const seen = new Set<ContactNeedId>()

  source.forEach((item) => {
    const id = normalizeText(item) as ContactNeedId
    if (!validIds.has(id) || seen.has(id)) return
    seen.add(id)
  })

  return Array.from(seen)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const name = normalizeText(body.name)
    const email = normalizeText(body.email)
    const phone = normalizeText(body.phone)
    const needs = normalizeNeeds(body.needs, body.projectType ?? body.service)
    const deliveryChannels = normalizeDeliveryChannels(body.deliveryChannels, body.deliveryChannel)
    const message = normalizeText(body.message)
    const privacy = body.privacy === true
    const honeypot = normalizeText(body.website)
    const selectedNeeds = getContactNeeds(needs)
    const sendsEmail = deliveryChannels.includes("email")
    const sendsWhatsApp = deliveryChannels.includes("whatsapp")
    const deliveryLabel = getDeliveryLabel(deliveryChannels)

    if (honeypot) {
      return NextResponse.json({ ok: true })
    }

    if (!privacy) {
      return NextResponse.json({ error: "Acepta el uso de datos para responder a tu consulta." }, { status: 400 })
    }

    if (selectedNeeds.length === 0) {
      return NextResponse.json({ error: "Marca al menos una necesidad." }, { status: 400 })
    }

    if (deliveryChannels.length === 0) {
      return NextResponse.json({ error: "Selecciona Email, WhatsApp o ambos para enviar la consulta." }, { status: 400 })
    }

    if (!name) {
      return NextResponse.json({ error: "El nombre es obligatorio." }, { status: 400 })
    }

    if (sendsEmail && (!email || !isValidEmail(email))) {
      return NextResponse.json({ error: "Introduce un email válido." }, { status: 400 })
    }

    if (!message || message.length < 10) {
      return NextResponse.json({ error: "Cuéntanos un poco más sobre el proyecto." }, { status: 400 })
    }

    if (!sendsEmail) {
      return NextResponse.json({ ok: true, emailSent: false })
    }

    const apiKey = process.env.RESEND_API_KEY

    if (!apiKey) {
      console.error("[api/contacto] RESEND_API_KEY no configurada")
      return NextResponse.json(
        { error: "El envío por formulario no está configurado todavía." },
        { status: 503 },
      )
    }

    const resend = new Resend(apiKey)
    const from = process.env.EMAIL_FROM?.trim() || FALLBACK_FROM
    const to =
      process.env.CONTACT_RECIPIENT_EMAIL?.trim() ||
      process.env.CONTACT_TO_EMAIL?.trim() ||
      siteConfig.contact.email

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
    const safeDelivery = escapeHtml(deliveryLabel)
    const safeMessage = escapeHtml(message)
    const safeNeeds = selectedNeeds.map((need) => escapeHtml(need.label))
    const primaryNeed = selectedNeeds[0]?.label ?? "consulta"

    const text = [
      "Nuevo mensaje desde Aplaudia",
      "",
      `Fecha: ${date}`,
      `Nombre: ${name}`,
      `Email: ${email}`,
      phone ? `Teléfono: ${phone}` : null,
      `Canal solicitado: ${deliveryLabel}`,
      sendsWhatsApp ? "WhatsApp preparado desde la web." : null,
      "",
      "Necesidades:",
      ...selectedNeeds.map((need) => `- ${need.label}`),
      "",
      "Mensaje:",
      message,
    ]
      .filter(Boolean)
      .join("\n")

    const html = `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /></head>
<body style="margin:0;padding:0;background:#07111f;font-family:Arial,Helvetica,sans-serif">
  <div style="max-width:640px;margin:32px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 24px 80px rgba(0,0,0,0.24)">
    <div style="background:#0b1220;padding:28px 32px">
      <p style="margin:0;color:#67e8f9;font-size:11px;text-transform:uppercase;letter-spacing:0.16em">Aplaudia</p>
      <h1 style="margin:8px 0 0;color:#ffffff;font-size:24px;font-weight:700">Nuevo mensaje de contacto</h1>
      <p style="margin:8px 0 0;color:#94a3b8;font-size:13px">${date}</p>
    </div>
    <div style="padding:32px">
      <div style="background:#f8fafc;border-left:4px solid #2563eb;border-radius:10px;padding:16px 18px;margin-bottom:28px">
        <p style="margin:0;color:#64748b;font-size:11px;text-transform:uppercase;letter-spacing:0.12em">Necesidades marcadas</p>
        <ul style="margin:10px 0 0;padding-left:18px;color:#0f172a;font-size:16px;font-weight:700;line-height:1.7">
          ${safeNeeds.map((need) => `<li>${need}</li>`).join("")}
        </ul>
        <p style="margin:10px 0 0;color:#64748b;font-size:13px">Canal solicitado: <strong>${safeDelivery}</strong></p>
      </div>
      <table style="width:100%;border-collapse:collapse;margin-bottom:28px;font-size:14px;color:#0f172a">
        <tr><td style="padding:7px 0;color:#64748b;width:120px">Nombre</td><td style="padding:7px 0;font-weight:700">${safeName}</td></tr>
        <tr><td style="padding:7px 0;color:#64748b">Email</td><td style="padding:7px 0"><a href="mailto:${safeEmail}" style="color:#2563eb;text-decoration:none">${safeEmail}</a></td></tr>
        ${safePhone ? `<tr><td style="padding:7px 0;color:#64748b">Teléfono</td><td style="padding:7px 0"><a href="tel:${safePhone}" style="color:#0f172a;text-decoration:none">${safePhone}</a></td></tr>` : ""}
      </table>
      <h2 style="margin:0 0 12px;color:#64748b;font-size:11px;text-transform:uppercase;letter-spacing:0.12em;border-bottom:1px solid #e2e8f0;padding-bottom:10px">Mensaje</h2>
      <p style="margin:0 0 28px;color:#1e293b;font-size:15px;line-height:1.8;white-space:pre-wrap">${safeMessage}</p>
      <div style="background:#f8fafc;border-radius:10px;padding:16px 18px">
        <p style="margin:0;color:#475569;font-size:13px;line-height:1.6">Responde directamente a este email para contactar con <strong>${safeName}</strong>${safePhone ? ` · ${safePhone}` : ""}.</p>
      </div>
    </div>
    <div style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:16px 32px;color:#94a3b8;font-size:11px;line-height:1.6">
      Correo generado automáticamente desde aplaudia.com. No contiene datos guardados en base de datos.
    </div>
  </div>
</body>
</html>`

    const { error } = await resend.emails.send({
      from,
      to,
      subject: `Nuevo contacto Aplaudia - ${primaryNeed}`,
      html,
      text,
      replyTo: email,
    })

    if (error) {
      console.error("[api/contacto] Error Resend:", error)
      return NextResponse.json({ error: "No se ha podido enviar el mensaje." }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("[api/contacto] Error inesperado:", error)
    return NextResponse.json({ error: "Error interno del servidor." }, { status: 500 })
  }
}
