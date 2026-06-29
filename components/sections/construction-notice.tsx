"use client"

import { motion } from "framer-motion"
import { CalendarClock, Sparkles } from "lucide-react"
import { siteConfig } from "@/content/site"

export function ConstructionNotice() {
  const { constructionNotice } = siteConfig

  return (
    <motion.aside
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay: 1.1, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-4 bottom-5 z-[60] mx-auto max-w-xl rounded-3xl border border-white/10 bg-background/80 p-[1px] shadow-2xl shadow-primary/20 backdrop-blur-2xl sm:bottom-6 sm:left-auto sm:right-6 sm:mx-0 sm:w-[25rem]"
      role="status"
      aria-live="polite"
    >
      <div className="relative overflow-hidden rounded-[calc(1.5rem-1px)] bg-card/90 px-5 py-4">
        <div className="absolute -right-12 -top-24 h-44 w-44 rounded-full bg-primary/25 blur-3xl" />
        <div className="absolute -bottom-20 left-4 h-32 w-32 rounded-full bg-accent-cyan/20 blur-3xl" />

        <div className="relative flex items-start gap-4">
          <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-primary/30 bg-primary/15 text-primary glow-blue">
            <Sparkles className="h-5 w-5" aria-hidden="true" />
          </div>

          <div className="min-w-0">
            <div className="mb-2 flex flex-wrap items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-background/60 px-2.5 py-1">
                <CalendarClock className="h-3.5 w-3.5" aria-hidden="true" />
                {constructionNotice.dateLabel}
              </span>
              <span>{constructionNotice.status}</span>
            </div>

            <h2 className="text-base font-semibold tracking-tight text-foreground">
              {constructionNotice.title}
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              {constructionNotice.body}
            </p>

            <div className="mt-3 rounded-2xl border border-border/60 bg-background/45 px-3 py-2 text-xs text-muted-foreground">
              {constructionNotice.detail}
            </div>
          </div>
        </div>
      </div>
    </motion.aside>
  )
}
