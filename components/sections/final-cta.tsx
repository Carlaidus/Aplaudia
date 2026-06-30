"use client"

import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { useRef } from "react"
import { useTranslations } from "@/i18n"
import { useLightweightMotion } from "@/components/motion-performance-provider"
import { ContactForm } from "@/components/contact/contact-form"

export function FinalCTA() {
  const { t } = useTranslations("finalCta")
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(contentRef, { once: true, margin: "-100px" })
  const lightweightMotion = useLightweightMotion()
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })
  
  // Background animations
  const bgScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 1.1])
  const bgOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0])

  return (
    <section
      ref={sectionRef}
      id="contacto"
      className="relative py-32 lg:py-40 bg-background overflow-hidden"
    >
      {/* Animated gradient background */}
      <motion.div 
        className="absolute inset-0"
        style={lightweightMotion ? undefined : { scale: bgScale, opacity: bgOpacity }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-transparent to-transparent" />
        
        {/* Animated orbs */}
        <div
          className="absolute top-1/3 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[150px]"
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent-cyan/15 rounded-full blur-[120px]"
        />
      </motion.div>

      {/* Decorative lines */}
      <motion.div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-32 bg-gradient-to-b from-transparent via-primary/30 to-transparent"
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          ref={contentRef}
          className="mx-auto max-w-5xl text-center"
        >
          {/* Title with perspective entrance */}
          <div className="mx-auto mb-6 max-w-3xl overflow-hidden" style={{ perspective: "1000px" }}>
            <motion.h2 
              className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl text-balance"
              initial={{ opacity: 0, rotateX: -20, y: 50 }}
              animate={isInView ? { opacity: 1, rotateX: 0, y: 0 } : {}}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              {t("title")}{" "}
              <motion.span 
                className="inline-block text-gradient-blue-cyan"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.3, type: "spring" }}
              >
                {t("titleHighlight")}
              </motion.span>
            </motion.h2>
          </div>

          <ContactForm />
        </motion.div>
      </div>

      {/* Bottom decorative line */}
      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-32 bg-gradient-to-t from-transparent via-primary/30 to-transparent"
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      />
    </section>
  )
}
