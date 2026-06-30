import { NextResponse } from "next/server"
import { Resend } from "resend"
import {
  defaultContactDeliveryChannel,
  defaultContactProjectType,
  getContactDeliveryOption,
  getContactProjectOption,
  type ContactDeliveryChannel,
  type ContactProjectType,
} from "@/content/contact"
import { siteConfig } from "@/content/site"

export const runtime = "nodejs"

const FALLBACK_FROM = "Aplaudia <onboarding@resend.dev>"

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

function normalizeDeliveryChannel(value: unknown): ContactDeliveryChannel {
  const clean = normalizeText(value)

  if (clean === "email" || clean === "whatsapp" || clean === "both") {
    return clean
  }

  return defaultContactDeliveryChannel
}

function normalizeProjectType(value: unknown): ContactProjectType {
  const clean = normalizeText(value)

  if (
    clean === "web" ||
    clean === "whatsapp-agent" ||
    clean === "visuals" ||
    clean === "portfolio" ||
    clean === "general"
  ) {
    return clean
  }

  return defaultContactProjectType
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const name = normalizeText(body.name)
    const email = normalizeText(body.email)
    const phone = normalizeText(body.phone)
    const projectType = normalizeProjectType(body.projectType ?? body.service)
    const deliveryChannel = normalizeDeliveryChannel(body.deliveryChannel)
    const message = normalizeText(body.message)
    const privacy = body.privacy === true
    const honeypot = normalizeText(body.website)
    const project = getContactProjectOption(projectType)
    const delivery = getContactDeliveryOption(deliveryChannel)
    const sendsEmail = deliveryChannel === "email" || deliveryChannel === "both"

    if (honeypot) {
      return NextResponse.json({ ok: true })
    }

    if (!privacy) {
      return NextResponse.json({ error: "Acepta el uso de datos para responder a tu consulta." }, { status: 400 })
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
    const safeProject = escapeHtml(project.label)
    const safeDelivery = escapeHtml(delivery.label)
    const safeMessage = escapeHtml(message)

    const text = [
      "Nuevo mensaje desde Aplaudia",
      "",
      `Fecha: ${date}`,
      `Nombre: ${name}`,
      `Email: ${email}`,
      phone ? `Telefono: ${phone}` : null,
      `Tipo de proyecto: ${project.label}`,
      `Canal solicitado: ${delivery.label}`,
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
        <p style="margin:0;color:#64748b;font-size:11px;text-transform:uppercase;letter-spacing:0.12em">Tipo de proyecto</p>
        <p style="margin:6px 0 0;color:#0f172a;font-size:18px;font-weight:700">${safeProject}</p>
        <p style="margin:8px 0 0;color:#64748b;font-size:13px">Canal solicitado: <strong>${safeDelivery}</strong></p>
      </div>
      <table style="width:100%;border-collapse:collapse;margin-bottom:28px;font-size:14px;color:#0f172a">
        <tr><td style="padding:7px 0;color:#64748b;width:120px">Nombre</td><td style="padding:7px 0;font-weight:700">${safeName}</td></tr>
        <tr><td style="padding:7px 0;color:#64748b">Email</td><td style="padding:7px 0"><a href="mailto:${safeEmail}" style="color:#2563eb;text-decoration:none">${safeEmail}</a></td></tr>
        ${safePhone ? `<tr><td style="padding:7px 0;color:#64748b">Telefono</td><td style="padding:7px 0"><a href="tel:${safePhone}" style="color:#0f172a;text-decoration:none">${safePhone}</a></td></tr>` : ""}
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
      subject: `Nuevo contacto Aplaudia - ${project.label}`,
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
