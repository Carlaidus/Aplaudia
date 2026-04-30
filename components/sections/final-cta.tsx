"use client"

import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { useRef, useState } from "react"
import { ArrowRight, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useTranslations } from "@/i18n"

export function FinalCTA() {
  const { t } = useTranslations("finalCta")
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(contentRef, { once: true, margin: "-100px" })
  const [isPrimaryHovered, setIsPrimaryHovered] = useState(false)
  const [isSecondaryHovered, setIsSecondaryHovered] = useState(false)
  
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
        style={{ scale: bgScale, opacity: bgOpacity }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-transparent to-transparent" />
        
        {/* Animated orbs */}
        <motion.div
          className="absolute top-1/3 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[150px]"
          animate={{
            y: [0, -30, 0],
            x: [0, 20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent-cyan/15 rounded-full blur-[120px]"
          animate={{
            y: [0, 30, 0],
            x: [0, -20, 0],
            scale: [1.1, 1, 1.1],
          }}
          transition={{ duration: 12, repeat: Infinity }}
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
          className="mx-auto max-w-3xl text-center"
        >
          {/* Title with perspective entrance */}
          <div className="overflow-hidden mb-6" style={{ perspective: "1000px" }}>
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
          
          <motion.p 
            className="text-lg md:text-xl text-muted-foreground text-pretty leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {t("subtitle")}
          </motion.p>

          {/* CTA buttons with advanced hover effects */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-5"
          >
            {/* Primary CTA */}
            <motion.div
              onMouseEnter={() => setIsPrimaryHovered(true)}
              onMouseLeave={() => setIsPrimaryHovered(false)}
              className="relative group"
            >
              {/* Glow effect */}
              <motion.div
                className="absolute -inset-1 bg-gradient-to-r from-primary via-accent-cyan to-primary rounded-xl opacity-0 blur-lg"
                animate={{ 
                  opacity: isPrimaryHovered ? 0.6 : 0,
                  backgroundPosition: isPrimaryHovered ? ["0% 50%", "100% 50%", "0% 50%"] : "0% 50%",
                }}
                transition={{ duration: isPrimaryHovered ? 2 : 0.3 }}
                style={{ backgroundSize: "200% 200%" }}
              />
              
              <Button
                asChild
                size="lg"
                className="relative bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-base font-semibold rounded-xl"
              >
                <Link href="mailto:carlosvfx@gmail.com" className="flex items-center gap-2">
                  {t("cta")}
                  <motion.span
                    animate={{ x: isPrimaryHovered ? [0, 5, 0] : 0 }}
                    transition={{ duration: 0.5, repeat: isPrimaryHovered ? Infinity : 0 }}
                  >
                    <ArrowRight className="h-5 w-5" />
                  </motion.span>
                </Link>
              </Button>
            </motion.div>

            {/* Secondary CTA */}
            <motion.div
              onMouseEnter={() => setIsSecondaryHovered(true)}
              onMouseLeave={() => setIsSecondaryHovered(false)}
              className="relative"
            >
              <Button
                asChild
                variant="outline"
                size="lg"
                className="relative border-border text-foreground hover:bg-card px-8 py-6 text-base font-semibold rounded-xl overflow-hidden"
              >
                <Link
                  href="https://wa.me/521234567890"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  {/* Animated background fill */}
                  <motion.span
                    className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent-cyan/10"
                    initial={{ x: "-100%" }}
                    animate={{ x: isSecondaryHovered ? 0 : "-100%" }}
                    transition={{ duration: 0.3 }}
                  />
                  <span className="relative flex items-center gap-2">
                    <motion.span
                      animate={{ rotate: isSecondaryHovered ? [0, -10, 10, 0] : 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <MessageCircle className="h-5 w-5" />
                    </motion.span>
                    {t("ctaSecondary")}
                  </span>
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Trust indicator with animated appearance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-10 flex items-center justify-center gap-3"
          >
            <motion.span 
              className="w-2 h-2 bg-green-500 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <p className="text-sm text-muted-foreground">
              {t("trustNote")}
            </p>
          </motion.div>
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
