import { NextResponse } from "next/server"
import { aplaudiaLeadConfig } from "@/content/lead/aplaudia-lead-config"
import {
  buildInternalLeadEmail,
  buildLeadSummary,
  isValidEmail,
  normalizeHistory,
  normalizeText,
} from "@/lib/lead-engine"
import {
  CloudflareEmailConfigurationError,
  getInternalEmailRecipient,
  sendInternalEmail,
} from "@/lib/email/cloudflare-email"

export const runtime = "nodejs"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const rawName = normalizeText(body.name, 120)
    const email = normalizeText(body.email, 180)
    const phone = normalizeText(body.phone, 80)
    const rawProjectType = normalizeText(body.projectType, 900)
    const rawInterest = normalizeText(body.interest, 3600)
    const budget = normalizeText(body.budget, 300)
    const consent = body.consent === true
    const clientCopy = body.clientCopy === true
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

    const analysis = buildLeadSummary({
      budget,
      config: aplaudiaLeadConfig,
      email,
      history,
      interest: rawInterest,
      name: rawName,
      phone,
      projectType: rawProjectType,
    })
    const date = new Date().toLocaleString("es-ES", {
      timeZone: "Europe/Madrid",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
    const emailContent = buildInternalLeadEmail({
      analysis,
      clientCopyRequested: clientCopy,
      config: aplaudiaLeadConfig,
      date,
    })

    try {
      const to = getInternalEmailRecipient(aplaudiaLeadConfig.internalRecipientEnv)

      await sendInternalEmail({
        html: emailContent.html,
        replyTo: email,
        subject: emailContent.subject,
        text: emailContent.text,
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

    return NextResponse.json({
      clientCopyRequested: clientCopy,
      clientCopySent: false,
      ok: true,
    })
  } catch (error) {
    console.error("[api/agent/quote] Error inesperado:", error)
    return NextResponse.json({ error: "No se ha podido enviar la solicitud." }, { status: 500 })
  }
}
