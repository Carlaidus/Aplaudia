"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Bot, Loader2, MessageCircle, Mic, MicOff, Send, Sparkles, X } from "lucide-react"

type AgentMessage = {
  role: "user" | "assistant"
  content: string
}

type SpeechRecognitionAlternativeLike = {
  transcript: string
}

type SpeechRecognitionResultLike = {
  readonly isFinal: boolean
  readonly length: number
  [index: number]: SpeechRecognitionAlternativeLike
}

type SpeechRecognitionResultListLike = {
  readonly length: number
  [index: number]: SpeechRecognitionResultLike
}

type SpeechRecognitionEventLike = Event & {
  results: SpeechRecognitionResultListLike
}

type SpeechRecognitionErrorEventLike = Event & {
  error?: string
}

type SpeechRecognitionLike = {
  lang: string
  continuous: boolean
  interimResults: boolean
  onstart: (() => void) | null
  onresult: ((event: SpeechRecognitionEventLike) => void) | null
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null
  onend: (() => void) | null
  start: () => void
  stop: () => void
}

type SpeechRecognitionConstructorLike = new () => SpeechRecognitionLike

type SpeechRecognitionWindow = Window & {
  SpeechRecognition?: SpeechRecognitionConstructorLike
  webkitSpeechRecognition?: SpeechRecognitionConstructorLike
}

const WELCOME_MESSAGE: AgentMessage = {
  role: "assistant",
  content:
    "Hola, soy el asistente de Aplaudia. Puedo orientarte sobre webs, agentes para WhatsApp, visuales y casos reales como Cronoras, Arik Custom o Aventuras Pixeladas. ¿Qué tienes en mente?",
}

const SESSION_KEY = "aplaudia_agent_session"

function getSpeechRecognitionConstructor() {
  if (typeof window === "undefined") return null

  const speechWindow = window as SpeechRecognitionWindow
  return speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition ?? null
}

export function AplaudiaAgentWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<AgentMessage[]>([WELCOME_MESSAGE])
  const [hasText, setHasText] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [hasUnread, setHasUnread] = useState(false)
  const [supportsVoiceInput, setSupportsVoiceInput] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [voiceMessage, setVoiceMessage] = useState("")

  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null)
  const voiceBaseTextRef = useRef("")

  useEffect(() => {
    let id = sessionStorage.getItem(SESSION_KEY)
    if (!id) {
      id = crypto.randomUUID()
      sessionStorage.setItem(SESSION_KEY, id)
    }
    setSessionId(id)
  }, [])

  useEffect(() => {
    setSupportsVoiceInput(Boolean(getSpeechRecognitionConstructor()))
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isLoading])

  useEffect(() => {
    if (!isOpen) {
      recognitionRef.current?.stop()
      setVoiceMessage("")
      return
    }

    setHasUnread(false)
    const timeout = window.setTimeout(() => inputRef.current?.focus(), 200)

    return () => window.clearTimeout(timeout)
  }, [isOpen])

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop()
      recognitionRef.current = null
    }
  }, [])

  const resizeInput = useCallback(() => {
    const input = inputRef.current
    if (!input) return

    input.style.height = "auto"
    input.style.height = `${Math.min(input.scrollHeight, 96)}px`
  }, [])

  const setInputValue = useCallback(
    (value: string) => {
      const input = inputRef.current
      if (!input) return

      input.value = value
      input.scrollTop = input.scrollHeight
      setHasText(value.trim().length > 0)
      resizeInput()
    },
    [resizeInput],
  )

  const toggleVoiceInput = useCallback(() => {
    if (isListening) {
      recognitionRef.current?.stop()
      return
    }

    const SpeechRecognitionConstructor = getSpeechRecognitionConstructor()

    if (!SpeechRecognitionConstructor) {
      setSupportsVoiceInput(false)
      setVoiceMessage("El dictado por voz no está disponible en este navegador.")
      return
    }

    const recognition = new SpeechRecognitionConstructor()
    recognition.lang = "es-ES"
    recognition.continuous = false
    recognition.interimResults = true

    voiceBaseTextRef.current = inputRef.current?.value.trim() ?? ""

    recognition.onstart = () => {
      setIsListening(true)
      setVoiceMessage("Escuchando...")
    }

    recognition.onresult = (event) => {
      const transcript = Array.from({ length: event.results.length }, (_, index) => {
        return event.results[index]?.[0]?.transcript ?? ""
      })
        .join("")
        .trim()

      const baseText = voiceBaseTextRef.current
      const nextValue = [baseText, transcript].filter(Boolean).join(" ").trim()
      setInputValue(nextValue)
    }

    recognition.onerror = (event) => {
      setIsListening(false)
      recognitionRef.current = null

      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        setVoiceMessage("No se ha podido acceder al micrófono.")
      } else if (event.error === "no-speech") {
        setVoiceMessage("No se ha detectado voz. Puedes intentarlo de nuevo.")
      } else {
        setVoiceMessage("El dictado por voz no está disponible ahora mismo.")
      }
    }

    recognition.onend = () => {
      setIsListening(false)
      recognitionRef.current = null
      voiceBaseTextRef.current = inputRef.current?.value.trim() ?? ""
      setVoiceMessage((current) => (current === "Escuchando..." ? "" : current))
    }

    recognitionRef.current = recognition

    try {
      recognition.start()
    } catch {
      recognitionRef.current = null
      setIsListening(false)
      setVoiceMessage("No se ha podido iniciar el dictado por voz.")
    }
  }, [isListening, setInputValue])

  const sendMessage = useCallback(async () => {
    const text = inputRef.current?.value.trim() ?? ""
    if (!text || isLoading || !sessionId) return

    recognitionRef.current?.stop()
    setVoiceMessage("")

    const userMessage: AgentMessage = { role: "user", content: text }
    setMessages((current) => [...current, userMessage])
    setHasText(false)
    setIsLoading(true)

    if (inputRef.current) {
      inputRef.current.value = ""
      inputRef.current.style.height = "auto"
    }

    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, sessionId, history: messages.slice(-8) }),
      })
      const data = await res.json()
      const reply =
        data.reply ??
        "No he podido responder ahora mismo. Escríbenos desde contacto y lo vemos con calma."

      setMessages((current) => [...current, { role: "assistant", content: reply }])
      if (!isOpen) setHasUnread(true)
    } catch {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content:
            "No he podido conectar con el asistente. La web sigue funcionando; puedes escribir desde la sección de contacto.",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }, [isLoading, isOpen, messages, sessionId])

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      sendMessage()
    }
  }

  return (
    <>
      <div
        className={`fixed bottom-24 left-2 right-2 z-[55] flex h-[calc(100dvh-7rem)] max-h-[44rem] flex-col overflow-hidden rounded-2xl border border-white/10 bg-background/95 shadow-2xl shadow-primary/20 backdrop-blur-xl transition-all duration-200 sm:bottom-24 sm:left-auto sm:right-6 sm:h-auto sm:max-h-[calc(100dvh-7rem)] sm:w-[390px] ${
          isOpen
            ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
            : "pointer-events-none translate-y-2 scale-95 opacity-0"
        }`}
        aria-hidden={!isOpen}
      >
        <div className="flex items-center justify-between border-b border-border bg-card/80 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl border border-primary/30 bg-primary/15 text-primary">
              <Bot className="h-5 w-5" aria-hidden="true" />
              <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-card bg-accent-cyan" />
            </div>
            <div>
              <p className="text-sm font-semibold leading-none text-foreground">Asistente Aplaudia</p>
              <p className="mt-1 text-xs text-muted-foreground">Orientación rápida · sin datos sensibles</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Cerrar asistente"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="min-h-0 flex-1 space-y-3.5 overflow-y-auto px-3.5 py-4 sm:max-h-[390px] sm:px-4">
          {messages.map((message, index) => (
            <div
              key={`${message.role}-${index}`}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {message.role === "assistant" && (
                <div className="mr-2 mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                  <Bot className="h-3.5 w-3.5" aria-hidden="true" />
                </div>
              )}
              <p
                className={`max-w-[88%] whitespace-pre-wrap break-words rounded-2xl px-3.5 py-2.5 text-base leading-7 sm:max-w-[82%] sm:text-sm sm:leading-relaxed ${
                  message.role === "user"
                    ? "rounded-br-sm bg-primary text-primary-foreground"
                    : "rounded-bl-sm bg-card text-foreground"
                }`}
              >
                {message.content}
              </p>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-end gap-2">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                <Bot className="h-3.5 w-3.5" aria-hidden="true" />
              </div>
              <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-sm bg-card px-4 py-3">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:0ms]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:160ms]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:320ms]" />
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        <div className="flex items-end gap-2 border-t border-border bg-background/95 p-2.5 sm:p-3">
          <textarea
            ref={inputRef}
            rows={1}
            maxLength={500}
            onInput={(event) => {
              setHasText(event.currentTarget.value.trim().length > 0)
              setVoiceMessage("")
              resizeInput()
            }}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            placeholder={isListening ? "Escuchando..." : "Cuéntame qué necesitas..."}
            className="min-h-12 flex-1 resize-none rounded-xl border border-border bg-card px-3.5 py-2.5 text-base leading-6 text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary disabled:opacity-50 sm:min-h-11 sm:text-sm"
          />
          <button
            type="button"
            onClick={toggleVoiceInput}
            disabled={isLoading}
            aria-disabled={!supportsVoiceInput}
            aria-label={
              isListening
                ? "Parar dictado por voz"
                : supportsVoiceInput
                  ? "Dictar mensaje por voz"
                  : "Dictado por voz no disponible en este navegador"
            }
            aria-pressed={isListening}
            className={`relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 sm:h-11 sm:w-11 ${
              isListening
                ? "border-accent-magenta/60 bg-accent-magenta/15 text-accent-magenta shadow-lg shadow-accent-magenta/20"
                : supportsVoiceInput
                  ? "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground"
                  : "border-border/70 bg-card/70 text-muted-foreground/60"
            }`}
            title={supportsVoiceInput ? "Dictar mensaje por voz" : "El dictado por voz no está disponible en este navegador"}
          >
            {isListening ? (
              <MicOff className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Mic className="h-4 w-4" aria-hidden="true" />
            )}
            {isListening && (
              <span className="absolute inset-0 rounded-xl bg-accent-magenta/20 animate-ping" aria-hidden="true" />
            )}
          </button>
          <button
            type="button"
            onClick={sendMessage}
            disabled={!hasText || isLoading || !sessionId}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-transform hover:bg-primary/90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 sm:h-11 sm:w-11"
            aria-label="Enviar mensaje"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <Send className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        </div>

        {(isListening || voiceMessage) && (
          <p
            className={`border-t border-border/60 px-4 pb-3 text-xs ${
              isListening ? "text-accent-magenta" : "text-muted-foreground"
            }`}
            aria-live="polite"
          >
            {voiceMessage}
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="fixed bottom-4 right-4 z-[55] flex h-14 w-14 items-center justify-center rounded-full border border-white/15 bg-primary text-primary-foreground shadow-2xl shadow-primary/30 transition-all hover:scale-105 hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-95 sm:bottom-6 sm:right-6"
        aria-label={isOpen ? "Cerrar asistente de Aplaudia" : "Abrir asistente de Aplaudia"}
      >
        {hasUnread && !isOpen && (
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-background bg-accent-magenta text-[10px] font-bold">
            1
          </span>
        )}
        <span className={`absolute transition-all ${isOpen ? "scale-100 rotate-0 opacity-100" : "scale-75 rotate-90 opacity-0"}`}>
          <X className="h-5 w-5" aria-hidden="true" />
        </span>
        <span className={`absolute transition-all ${isOpen ? "scale-75 -rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100"}`}>
          <MessageCircle className="h-6 w-6" aria-hidden="true" />
        </span>
        <Sparkles className="absolute -right-1 -top-1 h-4 w-4 text-accent-cyan" aria-hidden="true" />
      </button>
    </>
  )
}
