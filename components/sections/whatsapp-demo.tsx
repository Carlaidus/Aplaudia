"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { CheckCheck, Clock, MessageSquare, Zap, Users, BarChart3 } from "lucide-react"
import { useTranslations } from "@/i18n"

const conversationMessages = [
  {
    id: 1,
    type: "incoming" as const,
    text: "¡Hola! Quería saber si tenéis disponibilidad para el sábado por la noche",
    time: "10:32",
  },
  {
    id: 2,
    type: "outgoing" as const,
    text: "¡Hola! Gracias por escribirnos. Sí, tenemos disponibilidad el sábado. ¿Para cuántas personas sería la reserva?",
    time: "10:32",
  },
  {
    id: 3,
    type: "incoming" as const,
    text: "Somos 4 personas. ¿Tenéis alguna mesa con vistas?",
    time: "10:33",
  },
  {
    id: 4,
    type: "outgoing" as const,
    text: "Perfecto, tenemos una mesa con vistas al jardín para 4 personas a las 20:00 o a las 21:30. ¿Qué horario prefieres?",
    time: "10:33",
  },
]

const suggestedPrompts = [
  "¿Cuál es el horario?",
  "¿Qué servicios ofrecéis?",
  "Quiero reservar",
]

function MessageBubble({ message, index }: { message: (typeof conversationMessages)[0]; index: number }) {
  const isOutgoing = message.type === "outgoing"

  return (
    <motion.div
      initial={{ opacity: 0, x: isOutgoing ? 20 : -20, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.3 + index * 0.18 }}
      className={`flex ${isOutgoing ? "justify-end" : "justify-start"}`}
    >
      <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${isOutgoing ? "bg-primary text-primary-foreground rounded-br-md" : "bg-secondary text-foreground rounded-bl-md"}`}>
        <p className="text-sm leading-relaxed">{message.text}</p>
        <div className={`mt-1 flex items-center justify-end gap-1 ${isOutgoing ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
          <span className="text-[10px]">{message.time}</span>
          {isOutgoing && <CheckCheck className="h-3 w-3" />}
        </div>
      </div>
    </motion.div>
  )
}

function WhatsAppMockup({ t }: { t: (key: string) => string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, rotateY: -12, scale: 0.94 }}
      animate={isInView ? { opacity: 1, rotateY: 0, scale: 1 } : { opacity: 0, rotateY: -12, scale: 0.94 }}
      transition={{ duration: 0.8, type: "spring", stiffness: 60 }}
      style={{ perspective: 1000 }}
      className="relative mx-auto w-full max-w-[320px]"
    >
      <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-primary/20 to-accent-cyan/20 opacity-50 blur-2xl" />
      <div className="relative rounded-[2.5rem] border-4 border-border bg-card p-2 shadow-2xl">
        <div className="overflow-hidden rounded-[2rem] bg-background">
          <div className="flex items-center gap-3 border-b border-border bg-secondary px-4 py-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent-cyan">
              <span className="text-sm font-bold text-foreground">A</span>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-foreground">{t("chatHeader")}</h4>
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                {t("chatOnline")}
              </p>
            </div>
          </div>

          <div className="flex h-[340px] flex-col gap-2.5 overflow-y-auto bg-background p-3">
            {isInView && conversationMessages.map((message, index) => (
              <MessageBubble key={message.id} message={message} index={index} />
            ))}
          </div>

          <div className="border-t border-border bg-card/50 px-3 py-2">
            <p className="mb-1.5 text-[10px] text-muted-foreground">{t("suggestionsLabel")}</p>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {suggestedPrompts.map((prompt) => (
                <span key={prompt} className="shrink-0 rounded-full border border-border bg-secondary px-3 py-1.5 text-xs text-muted-foreground">
                  {prompt}
                </span>
              ))}
            </div>
          </div>

          <div className="border-t border-border bg-card px-3 py-3">
            <div className="flex items-center gap-2">
              <div className="flex-1 rounded-full bg-secondary px-4 py-2.5 text-sm text-muted-foreground">{t("inputPlaceholder")}</div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
                <MessageSquare className="h-5 w-5 text-primary" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          <Clock className="h-3 w-3" />
          {t("comingSoon")}
        </span>
      </div>
    </motion.div>
  )
}

export function WhatsAppDemo() {
  const { t } = useTranslations("whatsappDemo")
  const headerRef = useRef(null)
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-100px" })
  const benefitsRef = useRef(null)
  const isBenefitsInView = useInView(benefitsRef, { once: true, margin: "-100px" })

  const benefits = [
    { icon: MessageSquare, title: t("benefit1") },
    { icon: Zap, title: t("benefit2") },
    { icon: Users, title: t("benefit3") },
    { icon: BarChart3, title: t("benefit4") },
  ]

  return (
    <section id="whatsapp" className="relative overflow-hidden py-32 lg:py-40">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-32 h-96 w-96 rounded-full bg-primary/10 blur-[150px]" />
        <div className="absolute bottom-1/4 -right-32 h-80 w-80 rounded-full bg-accent-cyan/10 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          ref={headerRef}
          className="mx-auto mb-16 max-w-3xl text-center"
          initial={{ opacity: 0, y: 24 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.6 }}
        >
          <span className="mb-4 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-primary">
            <MessageSquare className="h-4 w-4" />
            {t("badge")}
          </span>
          <h2 className="mb-6 text-4xl font-bold tracking-tight text-foreground text-balance md:text-5xl">
            {t("title")} <span className="text-gradient-blue-cyan">{t("titleHighlight")}</span>
          </h2>
          <p className="text-lg text-muted-foreground text-pretty">{t("subtitle")}</p>
        </motion.div>

        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div className="order-2 flex justify-center lg:order-1">
            <WhatsAppMockup t={t} />
          </div>

          <motion.div ref={benefitsRef} className="order-1 lg:order-2">
            <div className="grid gap-6 sm:grid-cols-2">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 24 }}
                  animate={isBenefitsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
                  transition={{ duration: 0.45, delay: index * 0.1 }}
                  className="flex items-start gap-4 rounded-xl border border-border bg-card/50 p-5 backdrop-blur transition-colors hover:border-primary/30"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent-cyan text-foreground">
                    <benefit.icon className="h-6 w-6" />
                  </div>
                  <h4 className="font-semibold text-foreground">{benefit.title}</h4>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
