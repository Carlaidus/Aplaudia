"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { Check, CheckCheck, Clock, MessageSquare, Zap, Users, BarChart3 } from "lucide-react"
import { useTranslations } from "@/i18n"

// Static conversation data - easy to edit for future updates
const conversationMessages = [
  {
    id: 1,
    type: "incoming" as const,
    text: "Hola! Quisiera saber si tienen disponibilidad para el sábado en la noche",
    time: "10:32",
  },
  {
    id: 2,
    type: "outgoing" as const,
    text: "¡Hola! Gracias por contactarnos. Sí, tenemos disponibilidad el sábado. ¿Para cuántas personas sería la reservación?",
    time: "10:32",
    status: "read" as const,
  },
  {
    id: 3,
    type: "incoming" as const,
    text: "Somos 4 personas. ¿Tienen alguna mesa con vista?",
    time: "10:33",
  },
  {
    id: 4,
    type: "outgoing" as const,
    text: "Perfecto, tenemos una mesa disponible con vista al jardín para 4 personas a las 8:00 PM o 9:30 PM. ¿Cuál horario prefiere?",
    time: "10:33",
    status: "read" as const,
  },
]

// Suggested prompts - visual only, not interactive
const suggestedPrompts = [
  "¿Cuál es el horario?",
  "¿Qué servicios ofrecen?",
  "Quiero reservar",
]

// Reusable message bubble component (modular for future dynamic use)
function MessageBubble({
  message,
  index,
}: {
  message: (typeof conversationMessages)[0]
  index: number
}) {
  const isOutgoing = message.type === "outgoing"

  return (
    <motion.div
      initial={{ opacity: 0, x: isOutgoing ? 20 : -20, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.3 + index * 0.2, type: "spring", stiffness: 100 }}
      className={`flex ${isOutgoing ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
          isOutgoing
            ? "bg-primary text-primary-foreground rounded-br-md"
            : "bg-secondary text-foreground rounded-bl-md"
        }`}
      >
        <p className="text-sm leading-relaxed">{message.text}</p>
        <div
          className={`flex items-center justify-end gap-1 mt-1 ${
            isOutgoing ? "text-primary-foreground/70" : "text-muted-foreground"
          }`}
        >
          <span className="text-[10px]">{message.time}</span>
          {isOutgoing && message.status === "read" && (
            <CheckCheck className="h-3 w-3" />
          )}
          {isOutgoing && message.status === "sent" && (
            <Check className="h-3 w-3" />
          )}
        </div>
      </div>
    </motion.div>
  )
}

// WhatsApp-inspired phone mockup component
function WhatsAppMockup({ t }: { t: (key: string) => string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, rotateY: -15, scale: 0.9 }}
      animate={isInView ? { opacity: 1, rotateY: 0, scale: 1 } : { opacity: 0, rotateY: -15, scale: 0.9 }}
      transition={{ duration: 0.8, type: "spring", stiffness: 60 }}
      style={{ perspective: 1000 }}
      className="relative mx-auto w-full max-w-[320px]"
    >
      {/* Phone frame with glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent-cyan/20 rounded-[2.5rem] blur-2xl opacity-50" />
      
      <div className="relative rounded-[2.5rem] bg-card border-4 border-border p-2 shadow-2xl">
        {/* Screen */}
        <div className="rounded-[2rem] bg-background overflow-hidden">
          {/* WhatsApp header */}
          <div className="bg-secondary px-4 py-3 flex items-center gap-3 border-b border-border">
            <motion.div 
              className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent-cyan flex items-center justify-center"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="text-foreground text-sm font-bold">A</span>
            </motion.div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-foreground">
                {t("chatHeader")}
              </h4>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <motion.span 
                  className="h-1.5 w-1.5 rounded-full bg-green-500"
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                {t("chatOnline")}
              </p>
            </div>
          </div>

          {/* Messages area */}
          <div className="h-[340px] overflow-y-auto p-3 flex flex-col gap-2.5 bg-background">
            {isInView &&
              conversationMessages.map((message, index) => (
                <MessageBubble key={message.id} message={message} index={index} />
              ))}
          </div>

          {/* Suggested prompts - visual only */}
          <div className="px-3 py-2 border-t border-border bg-card/50">
            <p className="text-[10px] text-muted-foreground mb-1.5">{t("suggestionsLabel")}</p>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {suggestedPrompts.map((prompt, i) => (
                <motion.span
                  key={prompt}
                  initial={{ opacity: 0, y: 10 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                  transition={{ delay: 1.2 + i * 0.1 }}
                  className="shrink-0 text-xs px-3 py-1.5 rounded-full bg-secondary text-muted-foreground border border-border hover:border-primary/30 transition-colors cursor-default"
                >
                  {prompt}
                </motion.span>
              ))}
            </div>
          </div>

          {/* Input area - decorative, not functional */}
          <div className="px-3 py-3 border-t border-border bg-card">
            <div className="flex items-center gap-2">
              <div className="flex-1 rounded-full bg-secondary px-4 py-2.5 text-sm text-muted-foreground">
                {t("inputPlaceholder")}
              </div>
              <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-primary" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Coming soon badge */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        transition={{ duration: 0.4, delay: 1.5 }}
        className="absolute -bottom-4 left-1/2 -translate-x-1/2"
      >
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-medium text-primary">
          <Clock className="h-3 w-3" />
          {t("comingSoon")}
        </span>
      </motion.div>
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
    <section id="whatsapp" className="relative py-32 lg:py-40 overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-[150px]"
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-32 w-80 h-80 bg-accent-cyan/10 rounded-full blur-[120px]"
          animate={{ x: [0, -30, 0], y: [0, 20, 0] }}
          transition={{ duration: 12, repeat: Infinity }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section header with horizontal reveal */}
        <motion.div
          ref={headerRef}
          className="mx-auto max-w-3xl text-center mb-16"
        >
          <motion.span 
            initial={{ opacity: 0, x: -30 }}
            animate={isHeaderInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary uppercase tracking-widest mb-4"
          >
            <MessageSquare className="w-4 h-4" />
            {t("badge")}
          </motion.span>
          
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold tracking-tight text-foreground text-balance mb-6"
          >
            {t("title")}{" "}
            <span className="text-gradient-blue-cyan">{t("titleHighlight")}</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-muted-foreground text-pretty"
          >
            {t("subtitle")}
          </motion.p>
        </motion.div>

        {/* Main content: Phone mockup + Benefits */}
        <div className="grid gap-16 lg:grid-cols-2 items-center">
          {/* Phone mockup */}
          <div className="order-2 lg:order-1 flex justify-center">
            <WhatsAppMockup t={t} />
          </div>

          {/* Benefits with staggered slide-in */}
          <motion.div
            ref={benefitsRef}
            className="order-1 lg:order-2"
          >
            <div className="grid gap-6 sm:grid-cols-2">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40, y: 20 }}
                  animate={isBenefitsInView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x: index % 2 === 0 ? -40 : 40, y: 20 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
                  className="flex items-start gap-4 p-5 rounded-xl bg-card/50 backdrop-blur border border-border hover:border-primary/30 transition-colors"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent-cyan text-foreground">
                    <benefit.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{benefit.title}</h4>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
