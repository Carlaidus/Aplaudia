import { readFile } from "node:fs/promises"
import path from "node:path"
import { NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"

type AgentHistoryMessage = {
  role: "user" | "assistant"
  content: string
}

type OpenAIResponseBody = {
  output_text?: unknown
  output?: Array<{
    content?: Array<{
      text?: unknown
      type?: string
    }>
  }>
  error?: {
    message?: string
    type?: string
  }
}

const FALLBACK_REPLY =
  "Ahora mismo el asistente de Aplaudia no está conectado. Puedes escribirnos desde la sección de contacto y te orientaremos con el proyecto."
const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses"
const DEFAULT_OPENAI_MODEL = "gpt-5.4-mini"
const MAX_MESSAGE_LENGTH = 900
const MAX_HISTORY_ITEMS = 8
const OPENAI_TIMEOUT_MS = 20_000

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

function normalizeText(value: unknown, maxLength = MAX_MESSAGE_LENGTH) {
  if (typeof value !== "string") return ""

  return value.trim().slice(0, maxLength)
}

function normalizeHistory(value: unknown): AgentHistoryMessage[] {
  if (!Array.isArray(value)) return []

  return value
    .map((item) => {
      if (!item || typeof item !== "object") return null

      const role = "role" in item ? item.role : null
      const content = "content" in item ? normalizeText(item.content, 700) : ""

      if ((role !== "user" && role !== "assistant") || !content) return null

      return { role, content }
    })
    .filter((item): item is AgentHistoryMessage => Boolean(item))
    .slice(-MAX_HISTORY_ITEMS)
}

function buildOpenAIInput(message: string, history: AgentHistoryMessage[]) {
  if (history.length === 0) return message

  const conversation = history
    .map((item) => `${item.role === "user" ? "Visitante" : "Asistente"}: ${item.content}`)
    .join("\n\n")

  return `Contexto reciente de la conversación:\n${conversation}\n\nNuevo mensaje del visitante:\n${message}`
}

function extractOpenAIReply(data: OpenAIResponseBody) {
  if (typeof data.output_text === "string" && data.output_text.trim()) {
    return data.output_text.trim()
  }

  const outputText = data.output
    ?.flatMap((item) => item.content ?? [])
    .map((part) => (typeof part.text === "string" ? part.text : ""))
    .join("")
    .trim()

  return outputText || ""
}

async function fetchWithTimeout(url: string, init: RequestInit) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), OPENAI_TIMEOUT_MS)

  try {
    return await fetch(url, { ...init, signal: controller.signal })
  } finally {
    clearTimeout(timeout)
  }
}

async function requestOpenAIReply(message: string, history: AgentHistoryMessage[], instructions: string) {
  const apiKey = process.env.OPENAI_API_KEY?.trim()

  if (!apiKey) return null

  const model = process.env.OPENAI_AGENT_MODEL?.trim() || DEFAULT_OPENAI_MODEL

  try {
    const res = await fetchWithTimeout(OPENAI_RESPONSES_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        instructions,
        input: buildOpenAIInput(message, history),
        max_output_tokens: 550,
        store: false,
      }),
    })

    const data = (await res.json().catch(() => ({}))) as OpenAIResponseBody

    if (!res.ok) {
      console.error("[api/agent] Respuesta no OK de OpenAI:", res.status, data.error?.type ?? data.error?.message)
      return null
    }

    return extractOpenAIReply(data) || null
  } catch (error) {
    console.error("[api/agent] Error llamando a OpenAI:", error)
    return null
  }
}

async function requestLegacyAgentReply(
  message: string,
  sessionId: string,
  instructions: string,
) {
  const agentUrl = process.env.APLAUDIA_AGENT_API_URL
  const secret = process.env.APLAUDIA_AGENT_API_SECRET

  if (!agentUrl || !secret) return null

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
      console.error("[api/agent] Respuesta no OK del agente legado:", res.status, data)
      return null
    }

    return typeof data.reply === "string" && data.reply.trim() ? data.reply.trim() : null
  } catch (error) {
    console.error("[api/agent] Error llamando al agente legado:", error)
    return null
  }
}

export async function POST(req: NextRequest) {
  let message = ""
  let sessionId = ""
  let history: AgentHistoryMessage[] = []

  try {
    const body = await req.json()
    message = normalizeText(body.message)
    sessionId = normalizeText(body.sessionId, 120)
    history = normalizeHistory(body.history)
  } catch {
    return NextResponse.json({ error: "Petición inválida" }, { status: 400 })
  }

  if (!message || !sessionId) {
    return NextResponse.json({ error: "Parámetros inválidos" }, { status: 400 })
  }

  const instructions = await readAgentInstructions()
  const openAIReply = await requestOpenAIReply(message, history, instructions)

  if (openAIReply) {
    return NextResponse.json({
      reply: openAIReply,
      unavailable: false,
      provider: "openai",
    })
  }

  const legacyReply = await requestLegacyAgentReply(message, sessionId, instructions)

  if (legacyReply) {
    return NextResponse.json({
      reply: legacyReply,
      unavailable: false,
      provider: "legacy",
    })
  }

  return NextResponse.json({
    reply: FALLBACK_REPLY,
    unavailable: true,
  })
}
