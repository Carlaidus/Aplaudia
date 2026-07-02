"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { CalendarClock, ChevronUp, Sparkles, X } from "lucide-react"
import { siteConfig } from "@/content/site"

const constructionDateFormatter = new Intl.DateTimeFormat("es-ES", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Europe/Madrid",
})

function getConstructionDateLabel() {
  return constructionDateFormatter.format(new Date())
}

export function ConstructionNotice() {
  const { constructionNotice } = siteConfig
  const [isMinimized, setIsMinimized] = useState(false)
  const [dateLabel, setDateLabel] = useState<string>(constructionNotice.dateLabel)

  useEffect(() => {
    if (window.matchMedia("(max-width: 900px)").matches) {
      setIsMinimized(true)
    }
  }, [])

  useEffect(() => {
    const updateDateLabel = () => setDateLabel(getConstructionDateLabel())

    updateDateLabel()
    const intervalId = window.setInterval(updateDateLabel, 60 * 1000)

    return () => window.clearInterval(intervalId)
  }, [])

  if (isMinimized) {
    return (
      <motion.button
        type="button"
        initial={{ opacity: 0, y: 16, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-4 left-4 z-[60] inline-flex max-w-[calc(100vw-6rem)] items-center gap-2 whitespace-nowrap rounded-full border border-white/10 bg-card/90 px-3 py-2.5 text-sm font-medium text-foreground shadow-2xl shadow-primary/20 backdrop-blur-2xl transition-colors hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:max-w-[calc(100vw-2rem)] sm:px-3.5"
        aria-label="Mostrar aviso de construcción"
      >
        <Sparkles className="h-4 w-4 text-primary" aria-hidden="true" />
        <span className="shrink-0">{constructionNotice.status}</span>
        <span className="hidden shrink-0 px-0.5 text-muted-foreground sm:inline" aria-hidden="true">-</span>
        <span className="hidden shrink-0 text-xs text-muted-foreground sm:inline">{dateLabel}</span>
        <ChevronUp
          className="h-4 w-4 text-muted-foreground"
          aria-hidden="true"
        />
      </motion.button>
    )
  }

  return (
    <motion.aside
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay: 1.1, ease: [0.22, 1, 0.36, 1] }}
      className="fixed bottom-4 left-3 right-20 z-[60] max-w-sm rounded-3xl border border-white/10 bg-background/80 p-[1px] shadow-2xl shadow-primary/20 backdrop-blur-2xl sm:bottom-6 sm:left-6 sm:right-auto sm:w-[25rem] sm:max-w-xl"
      role="status"
      aria-live="polite"
    >
      <div className="relative overflow-hidden rounded-[calc(1.5rem-1px)] bg-card/90 px-4 py-3.5 sm:px-5 sm:py-4">
        <div className="absolute -right-12 -top-24 h-44 w-44 rounded-full bg-primary/25 blur-3xl" />
        <div className="absolute -bottom-20 left-4 h-32 w-32 rounded-full bg-accent-cyan/20 blur-3xl" />
        <button
          type="button"
          onClick={() => setIsMinimized(true)}
          className="absolute right-3 top-3 z-20 inline-flex h-8 w-8 items-center justify-center rounded-full border border-border/60 bg-background/60 text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-card"
          aria-label="Minimizar aviso de construcción"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>

        <div className="relative flex items-start gap-4">
          <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-primary/30 bg-primary/15 text-primary glow-blue">
            <Sparkles className="h-5 w-5" aria-hidden="true" />
          </div>

          <div className="min-w-0 pr-8 sm:pr-9">
            <div className="mb-2 flex flex-wrap items-center gap-2 text-xs font-medium uppercase tracking-normal text-muted-foreground">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-background/60 px-2.5 py-1">
                <CalendarClock className="h-3.5 w-3.5" aria-hidden="true" />
                {dateLabel}
              </span>
              <span>{constructionNotice.status}</span>
            </div>

            <h2 className="text-base font-semibold tracking-normal text-foreground">
              {constructionNotice.title}
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              {constructionNotice.body}
            </p>

            <div className="mt-3 hidden rounded-2xl border border-border/60 bg-background/45 px-3 py-2 text-xs text-muted-foreground sm:block">
              {constructionNotice.detail}
            </div>
          </div>
        </div>
      </div>
    </motion.aside>
  )
}
