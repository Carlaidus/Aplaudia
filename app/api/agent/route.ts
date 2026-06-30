import { readFile } from "node:fs/promises"
import path from "node:path"
import { NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"

const FALLBACK_REPLY =
  "Ahora mismo el asistente de Aplaudia no está conectado. Puedes escribirnos desde la sección de contacto y te orientaremos con el proyecto."

async function readAgentInstructions() {
  try {
    return await readFile(
      path.join(process.cwd(), "content", "agent", "aplaudia-agent.md"),
      "utf8",
    )
  } catch (error) {
    console.error("[api/agent] No se pudieron leer las instrucciones:", error)
    return ""
  }
}

export async function POST(req: NextRequest) {
  const agentUrl = process.env.APLAUDIA_AGENT_API_URL
  const secret = process.env.APLAUDIA_AGENT_API_SECRET

  let message = ""
  let sessionId = ""

  try {
    const body = await req.json()
    message = body.message?.trim() ?? ""
    sessionId = body.sessionId?.trim() ?? ""
  } catch {
    return NextResponse.json({ error: "Petición inválida" }, { status: 400 })
  }

  if (!message || !sessionId) {
    return NextResponse.json({ error: "Parámetros inválidos" }, { status: 400 })
  }

  if (!agentUrl || !secret) {
    return NextResponse.json({
      reply: FALLBACK_REPLY,
      unavailable: true,
    })
  }

  const instructions = await readAgentInstructions()

  try {
    const res = await fetch(`${agentUrl.replace(/\/$/, "")}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${secret}`,
      },
      body: JSON.stringify({
        message,
        sessionId,
        instructions,
        source: "aplaudia.com",
      }),
    })

    const data = await res.json().catch(() => ({}))

    if (!res.ok) {
      console.error("[api/agent] Respuesta no OK del agente:", res.status, data)
      return NextResponse.json({
        reply: FALLBACK_REPLY,
        unavailable: true,
      })
    }

    return NextResponse.json({
      reply: data.reply ?? FALLBACK_REPLY,
      unavailable: false,
    })
  } catch (error) {
    console.error("[api/agent] Error llamando al agente:", error)
    return NextResponse.json({
      reply: FALLBACK_REPLY,
      unavailable: true,
    })
  }
}
