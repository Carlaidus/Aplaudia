"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { ArrowDown, Bot, Loader2, MessageCircle, Mic, MicOff, Send, Sparkles, X } from "lucide-react"

import { cn } from "@/lib/utils"
import type { AgentMessage, AgentWidgetConfig, AgentWidgetTheme } from "@/lib/agent/types"

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

const DEFAULT_THEME: Required<AgentWidgetTheme> = {
  assistantAvatar: "border-primary/30 bg-primary/15 text-primary",
  assistantBubble: "w-full max-w-full rounded-bl-sm bg-card text-foreground",
  floatingButton: "bg-primary text-primary-foreground shadow-primary/30 hover:bg-primary/90",
  floatingSparkle: "text-accent",
  header: "border-border bg-card/80",
  input: "border-border bg-card text-foreground placeholder:text-muted-foreground focus:border-primary",
  micActive: "border-accent/60 bg-accent/15 text-accent shadow-lg shadow-accent/20",
  micIdle: "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground",
  micPing: "bg-accent/20",
  micUnsupported: "border-border/70 bg-card/70 text-muted-foreground/60",
  onlineDot: "bg-accent",
  panel: "border-white/10 bg-background/95 shadow-primary/20",
  scrollHint: "border-white/10 bg-background/60 text-primary/80 shadow-primary/15 hover:border-primary/35 hover:bg-background/80 hover:text-primary",
  sendButton: "bg-primary text-primary-foreground hover:bg-primary/90",
  unreadBadge: "bg-accent text-accent-foreground",
  userBubble: "max-w-[94%] rounded-br-sm bg-primary text-primary-foreground sm:max-w-[88%]",
  voiceStatusActive: "text-accent",
}

function getSpeechRecognitionConstructor() {
  if (typeof window === "undefined") return null

  const speechWindow = window as SpeechRecognitionWindow
  return speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition ?? null
}

export function GenericAgentWidget({ config }: { config: AgentWidgetConfig }) {
  const {
    apiEndpoint = "/api/agent",
    closeLabel = "Cerrar asistente",
    inputMaxLength = 500,
    listeningPlaceholder = "Escuchando...",
    maxHistoryItems = 8,
    sendLabel = "Enviar mensaje",
    showFloatingSparkle = true,
  unavailableVoiceMessage = "El dictado por voz no está disponible en este navegador.",
    voiceLanguage = "es-ES",
  } = config

  const theme = useMemo(
    () => ({
      ...DEFAULT_THEME,
      ...config.theme,
    }),
    [config.theme],
  )

  const welcomeMessage = useMemo<AgentMessage>(
    () => ({ role: "assistant", content: config.welcomeMessage }),
    [config.welcomeMessage],
  )

  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<AgentMessage[]>([welcomeMessage])
  const [hasText, setHasText] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [hasUnread, setHasUnread] = useState(false)
  const [supportsVoiceInput, setSupportsVoiceInput] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [voiceMessage, setVoiceMessage] = useState("")
  const [hasMoreMessagesBelow, setHasMoreMessagesBelow] = useState(false)

  const messagesViewportRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null)
  const pendingUserAnchorIndexRef = useRef<number | null>(null)
  const voiceBaseTextRef = useRef("")

  useEffect(() => {
    setMessages((current) => {
      if (current.length === 1 && current[0]?.role === "assistant") return [welcomeMessage]
      return current
    })
  }, [welcomeMessage])

  useEffect(() => {
    let id = sessionStorage.getItem(config.sessionStorageKey)
    if (!id) {
      id = crypto.randomUUID()
      sessionStorage.setItem(config.sessionStorageKey, id)
    }
    setSessionId(id)
  }, [config.sessionStorageKey])

  useEffect(() => {
    setSupportsVoiceInput(Boolean(getSpeechRecognitionConstructor()))
  }, [])

  const updateMessagesScrollHint = useCallback(() => {
    const viewport = messagesViewportRef.current
    if (!viewport) {
      setHasMoreMessagesBelow(false)
      return
    }

    const remaining = viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight
    setHasMoreMessagesBelow(remaining > 12)
  }, [])

  const scrollUserMessageToTop = useCallback(
    (messageIndex: number) => {
      const viewport = messagesViewportRef.current
      const message = viewport?.querySelector<HTMLElement>(
        `[data-chat-message-index="${messageIndex}"]`,
      )

      if (!viewport || !message) return

      const viewportRect = viewport.getBoundingClientRect()
      const messageRect = message.getBoundingClientRect()
      const nextTop = viewport.scrollTop + messageRect.top - viewportRect.top

      viewport.scrollTo({
        top: Math.max(0, nextTop - 2),
        behavior: "smooth",
      })

      window.setTimeout(updateMessagesScrollHint, 260)
    },
    [updateMessagesScrollHint],
  )

  useEffect(() => {
    if (!isOpen) {
      setHasMoreMessagesBelow(false)
      return
    }

    const frame = window.requestAnimationFrame(() => {
      const pendingUserIndex = pendingUserAnchorIndexRef.current

      if (pendingUserIndex !== null) {
        scrollUserMessageToTop(pendingUserIndex)

        if (!isLoading && messages[pendingUserIndex + 1]?.role === "assistant") {
          pendingUserAnchorIndexRef.current = null
        }
      } else {
        updateMessagesScrollHint()
      }
    })

    return () => window.cancelAnimationFrame(frame)
  }, [isLoading, isOpen, messages, scrollUserMessageToTop, updateMessagesScrollHint])

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

  const resetInput = useCallback(() => {
    const input = inputRef.current

    if (input) {
      input.value = ""
      input.scrollTop = 0
      input.style.height = "auto"
    }

    voiceBaseTextRef.current = ""
    setHasText(false)
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
      setVoiceMessage(unavailableVoiceMessage)
      return
    }

    const recognition = new SpeechRecognitionConstructor()
    recognition.lang = voiceLanguage
    recognition.continuous = false
    recognition.interimResults = true

    voiceBaseTextRef.current = inputRef.current?.value.trim() ?? ""

    recognition.onstart = () => {
      setIsListening(true)
      setVoiceMessage(listeningPlaceholder)
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
      setVoiceMessage((current) => (current === listeningPlaceholder ? "" : current))
    }

    recognitionRef.current = recognition

    try {
      recognition.start()
    } catch {
      recognitionRef.current = null
      setIsListening(false)
      setVoiceMessage("No se ha podido iniciar el dictado por voz.")
    }
  }, [isListening, listeningPlaceholder, setInputValue, unavailableVoiceMessage, voiceLanguage])

  const sendMessage = useCallback(async () => {
    const text = inputRef.current?.value.trim() ?? ""
    if (!text || isLoading || !sessionId) return

    recognitionRef.current?.stop()
    setVoiceMessage("")
    resetInput()

    const userMessage: AgentMessage = { role: "user", content: text }
    setMessages((current) => {
      pendingUserAnchorIndexRef.current = current.length
      return [...current, userMessage]
    })
    setIsLoading(true)

    try {
      const res = await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, sessionId, history: messages.slice(-maxHistoryItems) }),
      })
      const data = await res.json()
      const reply = data.reply ?? config.fallbackReply

      setMessages((current) => [...current, { role: "assistant", content: reply }])
      if (!isOpen) setHasUnread(true)
    } catch {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: config.connectionErrorReply,
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }, [
    apiEndpoint,
    config.connectionErrorReply,
    config.fallbackReply,
    isLoading,
    isOpen,
    maxHistoryItems,
    messages,
    resetInput,
    sessionId,
  ])

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      sendMessage()
    }
  }

  return (
    <>
      {isOpen && (
        <div
          className={cn(
            "fixed inset-x-1.5 bottom-1.5 top-1.5 z-[70] flex max-h-[calc(100dvh-0.75rem)] flex-col overflow-hidden rounded-2xl border shadow-2xl backdrop-blur-xl transition-all duration-200 sm:inset-x-6 sm:bottom-6 sm:top-6 sm:max-h-[calc(100dvh-3rem)] lg:inset-x-[8vw] xl:inset-x-[10vw]",
            theme.panel,
          )}
          role="dialog"
          aria-label={config.dialogLabel}
        >
          <div className={cn("flex items-center justify-between border-b px-3 py-2.5 sm:px-4 sm:py-3", theme.header)}>
            <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
              <div
                className={cn(
                  "relative flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border sm:h-10 sm:w-10",
                  theme.assistantAvatar,
                )}
              >
                <Bot className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
                <span className={cn("absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-card", theme.onlineDot)} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold leading-none text-foreground">{config.assistantTitle}</p>
                <p className="mt-1 text-xs text-muted-foreground">{config.assistantSubtitle}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label={closeLabel}
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <div className="relative min-h-0 flex-1">
            <div
              ref={messagesViewportRef}
              data-chat-scroll-viewport="true"
              onScroll={updateMessagesScrollHint}
              className="h-full min-h-0 space-y-2.5 overflow-y-auto px-2.5 py-3 sm:space-y-3 sm:px-4 sm:py-4"
            >
              {messages.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  data-chat-message-index={index}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <p
                    className={cn(
                      "whitespace-pre-wrap break-words rounded-2xl px-3 py-2 text-base leading-[1.45] sm:px-3.5 sm:text-[16.5px] sm:leading-[1.45]",
                      message.role === "user" ? theme.userBubble : theme.assistantBubble,
                    )}
                  >
                    {message.content}
                  </p>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex max-w-full items-center gap-1.5 rounded-2xl rounded-bl-sm bg-card px-3.5 py-2.5">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:0ms]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:160ms]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:320ms]" />
                  </div>
                </div>
              )}
            </div>

            {hasMoreMessagesBelow && (
              <button
                type="button"
                onClick={() => {
                  const viewport = messagesViewportRef.current
                  if (!viewport) return

                  viewport.scrollBy({
                    top: Math.max(160, viewport.clientHeight * 0.72),
                    behavior: "smooth",
                  })
                  window.setTimeout(updateMessagesScrollHint, 260)
                }}
                className={cn(
                  "absolute bottom-3 right-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full border shadow-xl backdrop-blur-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  theme.scrollHint,
                )}
                aria-label="Hay más respuesta hacia abajo"
              >
                <ArrowDown className="h-4 w-4 animate-bounce" aria-hidden="true" />
              </button>
            )}
          </div>

          <div className="flex items-end gap-2 border-t border-border bg-background/95 p-2.5 sm:p-3">
            <textarea
              ref={inputRef}
              rows={1}
              maxLength={inputMaxLength}
              onInput={(event) => {
                setHasText(event.currentTarget.value.trim().length > 0)
                setVoiceMessage("")
                resizeInput()
              }}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              placeholder={isListening ? listeningPlaceholder : config.placeholder}
              className={cn(
                "min-h-12 flex-1 resize-none rounded-xl border px-3.5 py-2.5 text-base leading-6 outline-none transition-colors disabled:opacity-50",
                theme.input,
              )}
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
                    : unavailableVoiceMessage
              }
              aria-pressed={isListening}
              className={cn(
                "relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-40",
                isListening ? theme.micActive : supportsVoiceInput ? theme.micIdle : theme.micUnsupported,
              )}
              title={supportsVoiceInput ? "Dictar mensaje por voz" : unavailableVoiceMessage}
            >
              {isListening ? (
                <MicOff className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Mic className="h-4 w-4" aria-hidden="true" />
              )}
              {isListening && (
                <span className={cn("absolute inset-0 animate-ping rounded-xl", theme.micPing)} aria-hidden="true" />
              )}
            </button>
            <button
              type="button"
              onClick={sendMessage}
              disabled={!hasText || isLoading || !sessionId}
              className={cn(
                "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-transform active:scale-95 disabled:cursor-not-allowed disabled:opacity-40",
                theme.sendButton,
              )}
              aria-label={sendLabel}
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
              className={cn(
                "border-t border-border/60 px-4 pb-3 text-xs",
                isListening ? theme.voiceStatusActive : "text-muted-foreground",
              )}
              aria-live="polite"
            >
              {voiceMessage}
            </p>
          )}
        </div>
      )}

      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className={cn(
            "fixed bottom-4 right-4 z-[55] flex h-14 w-14 items-center justify-center rounded-full border border-white/15 shadow-2xl transition-all hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-95 sm:bottom-6 sm:right-6",
            theme.floatingButton,
          )}
          aria-label={config.floatingButtonLabel}
        >
          {hasUnread && (
            <span
              className={cn(
                "absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-background text-[10px] font-bold",
                theme.unreadBadge,
              )}
            >
              1
            </span>
          )}
          <MessageCircle className="h-6 w-6" aria-hidden="true" />
          {showFloatingSparkle && <Sparkles className={cn("absolute -right-1 -top-1 h-4 w-4", theme.floatingSparkle)} aria-hidden="true" />}
        </button>
      )}
    </>
  )
}
