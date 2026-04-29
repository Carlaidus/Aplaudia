"use client"

import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { useRef, useState } from "react"
import { MessageCircle, Lightbulb, Rocket, Sparkles } from "lucide-react"
import { useTranslations } from "@/i18n"

type StepKey = "step1" | "step2" | "step3" | "step4"

const stepIcons = {
  step1: MessageCircle,
  step2: Lightbulb,
  step3: Sparkles,
  step4: Rocket,
}

function StepCard({ stepKey, index, totalSteps }: { stepKey: StepKey; index: number; totalSteps: number }) {
  const { t } = useTranslations("howItWorks")
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })
  const [isHovered, setIsHovered] = useState(false)
  
  const Icon = stepIcons[stepKey]
  const stepNumber = String(index + 1).padStart(2, "0")
  const isLast = index === totalSteps - 1

  return (
    <div className="relative">
      {/* Connection line between cards */}
      {!isLast && (
        <motion.div 
          className="hidden lg:block absolute top-10 left-[calc(50%+48px)] w-[calc(100%-96px)] h-px"
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 0.8, delay: 0.5 + index * 0.2 }}
          style={{ transformOrigin: "left" }}
        >
          {/* Gradient line */}
          <div className="w-full h-full bg-gradient-to-r from-primary/50 via-accent-cyan/30 to-transparent" />
          
          {/* Animated dot traveling along the line */}
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-primary rounded-full"
            initial={{ left: 0, opacity: 0 }}
            animate={isInView ? { left: "100%", opacity: [0, 1, 1, 0] } : {}}
            transition={{ duration: 1.5, delay: 0.8 + index * 0.3, ease: "easeInOut" }}
          />
        </motion.div>
      )}

      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 60, rotateY: -15 }}
        animate={isInView ? { opacity: 1, y: 0, rotateY: 0 } : {}}
        transition={{ 
          duration: 0.7, 
          delay: index * 0.15,
          ease: [0.22, 1, 0.36, 1],
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative flex flex-col items-center text-center"
        style={{ perspective: "1000px" }}
      >
        {/* Icon container with 3D hover effect */}
        <motion.div 
          className="relative z-10"
          animate={{ 
            rotateY: isHovered ? 180 : 0,
            scale: isHovered ? 1.1 : 1,
          }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Front face */}
          <div 
            className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent-cyan text-foreground shadow-lg"
            style={{ backfaceVisibility: "hidden" }}
          >
            <Icon className="h-9 w-9" />
          </div>
          
          {/* Back face with number */}
          <div 
            className="absolute inset-0 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-cyan to-accent-violet text-foreground shadow-lg"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            <span className="text-2xl font-bold">{stepNumber}</span>
          </div>
        </motion.div>

        {/* Pulsing ring behind icon */}
        <motion.div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-20 rounded-2xl border-2 border-primary/30"
          animate={{ 
            scale: isHovered ? [1, 1.3, 1] : 1,
            opacity: isHovered ? [0.5, 0, 0.5] : 0,
          }}
          transition={{ duration: 1, repeat: isHovered ? Infinity : 0 }}
        />

        {/* Step number badge */}
        <motion.span 
          className="mt-5 text-xs font-semibold text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.3 + index * 0.15 }}
        >
          {stepNumber}
        </motion.span>

        {/* Title */}
        <motion.h3 
          className="mt-3 text-xl font-bold text-foreground"
          animate={{ y: isHovered ? -3 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {t(`${stepKey}.title`)}
        </motion.h3>
        
        {/* Description */}
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-xs">
          {t(`${stepKey}.description`)}
        </p>

        {/* Bottom accent dot */}
        <motion.div
          className="mt-5 w-2 h-2 bg-primary rounded-full"
          animate={{ 
            scale: isHovered ? [1, 1.5, 1] : 1,
            opacity: isHovered ? 1 : 0.5,
          }}
          transition={{ duration: 0.5, repeat: isHovered ? Infinity : 0 }}
        />
      </motion.div>
    </div>
  )
}

export function HowItWorks() {
  const { t } = useTranslations("howItWorks")
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-100px" })
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })
  
  // Background parallax
  const bgY = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"])

  const stepKeys: StepKey[] = ["step1", "step2", "step3", "step4"]

  return (
    <section ref={sectionRef} id="proceso" className="relative py-24 lg:py-32 bg-background overflow-hidden">
      {/* Subtle background pattern */}
      <motion.div 
        className="absolute inset-0 bg-[linear-gradient(to_right,transparent_49.9%,rgba(255,255,255,0.02)_50%,transparent_50.1%),linear-gradient(to_bottom,transparent_49.9%,rgba(255,255,255,0.02)_50%,transparent_50.1%)] bg-[length:100px_100px]"
        style={{ y: bgY }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          ref={headerRef}
          className="mx-auto max-w-2xl text-center mb-20"
        >
          {/* Badge with animated underline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="relative inline-block mb-6"
          >
            <span className="text-sm font-semibold text-primary uppercase tracking-widest">
              {t("badge")}
            </span>
            <motion.div
              className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent"
              initial={{ scaleX: 0 }}
              animate={isHeaderInView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
            />
          </motion.div>
          
          {/* Title with word reveal */}
          <div className="overflow-hidden">
            <motion.h2 
              className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance"
              initial={{ y: "100%" }}
              animate={isHeaderInView ? { y: 0 } : {}}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            >
              {t("title")}{" "}
              <span className="text-gradient-blue-cyan">{t("titleHighlight")}</span>
            </motion.h2>
          </div>
          
          <motion.p 
            className="mt-4 text-muted-foreground text-pretty"
            initial={{ opacity: 0, y: 20 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {t("subtitle")}
          </motion.p>
        </motion.div>

        {/* Steps grid */}
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {stepKeys.map((key, index) => (
            <StepCard 
              key={key} 
              stepKey={key} 
              index={index} 
              totalSteps={stepKeys.length} 
            />
          ))}
        </div>
      </div>
    </section>
  )
}
