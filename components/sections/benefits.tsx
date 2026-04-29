"use client"

import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { useRef, useState } from "react"
import { Zap, Shield, HeartHandshake, Sparkles, Clock, Headphones } from "lucide-react"
import { useTranslations } from "@/i18n"

type BenefitKey = "benefit1" | "benefit2" | "benefit3" | "benefit4" | "benefit5" | "benefit6"

const benefitIcons = {
  benefit1: Sparkles,
  benefit2: Zap,
  benefit3: Clock,
  benefit4: HeartHandshake,
  benefit5: Shield,
  benefit6: Headphones,
}

const benefitGradients: Record<BenefitKey, string> = {
  benefit1: "from-primary to-accent-cyan",
  benefit2: "from-accent-cyan to-accent-violet",
  benefit3: "from-accent-violet to-accent-magenta",
  benefit4: "from-accent-magenta to-primary",
  benefit5: "from-primary to-accent-cyan",
  benefit6: "from-accent-cyan to-accent-violet",
}

function BenefitCard({ benefitKey, index }: { benefitKey: BenefitKey; index: number }) {
  const { t } = useTranslations("benefits")
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })
  const [isHovered, setIsHovered] = useState(false)
  
  const Icon = benefitIcons[benefitKey]
  const gradient = benefitGradients[benefitKey]

  // Varied entrances: alternating from left/right with different delays
  const row = Math.floor(index / 3)
  const col = index % 3
  const direction = col === 0 ? -1 : col === 2 ? 1 : 0
  const verticalOffset = row === 0 ? -1 : 1

  return (
    <motion.div
      ref={ref}
      initial={{ 
        opacity: 0, 
        x: direction * 80,
        y: verticalOffset * 40,
        scale: 0.9,
      }}
      animate={isInView ? { 
        opacity: 1, 
        x: 0,
        y: 0,
        scale: 1,
      } : {}}
      transition={{ 
        duration: 0.7, 
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative"
    >
      {/* Background glow */}
      <motion.div 
        className={`absolute -inset-px bg-gradient-to-br ${gradient} rounded-2xl opacity-0 blur`}
        animate={{ opacity: isHovered ? 0.2 : 0 }}
        transition={{ duration: 0.3 }}
      />

      <div className="relative p-8 rounded-2xl bg-card/50 backdrop-blur border border-border group-hover:border-primary/30 transition-all duration-300 h-full overflow-hidden">
        {/* Animated corner accent */}
        <motion.div
          className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${gradient} opacity-0 rounded-bl-full`}
          animate={{ 
            opacity: isHovered ? 0.1 : 0,
            scale: isHovered ? 1 : 0.5,
          }}
          transition={{ duration: 0.4 }}
          style={{ transformOrigin: "top right" }}
        />

        {/* Icon with rotation and scale */}
        <motion.div 
          className={`flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} text-foreground mb-5`}
          animate={{ 
            rotate: isHovered ? [0, -10, 10, 0] : 0,
            scale: isHovered ? 1.1 : 1,
          }}
          transition={{ duration: 0.4 }}
        >
          <Icon className="h-7 w-7" />
        </motion.div>

        {/* Title with letter-spacing animation */}
        <motion.h3 
          className="text-xl font-bold text-foreground mb-3"
          animate={{ letterSpacing: isHovered ? "0.02em" : "0em" }}
          transition={{ duration: 0.3 }}
        >
          {t(`${benefitKey}.title`)}
        </motion.h3>
        
        <p className="text-muted-foreground leading-relaxed">
          {t(`${benefitKey}.description`)}
        </p>

        {/* Bottom progress bar that fills on hover */}
        <motion.div
          className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${gradient}`}
          initial={{ width: 0 }}
          animate={{ width: isHovered ? "100%" : "0%" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </motion.div>
  )
}

export function Benefits() {
  const { t } = useTranslations("benefits")
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-100px" })
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })
  
  // Parallax decorations
  const decorY = useTransform(scrollYProgress, [0, 1], [-80, 80])
  const decorRotate = useTransform(scrollYProgress, [0, 1], [0, 90])

  const benefitKeys: BenefitKey[] = ["benefit1", "benefit2", "benefit3", "benefit4", "benefit5", "benefit6"]

  return (
    <section ref={sectionRef} className="relative py-32 lg:py-40 overflow-hidden">
      {/* Decorative rotating elements */}
      <motion.div
        className="absolute -top-32 -left-32 w-64 h-64 border border-primary/10 rounded-full"
        style={{ y: decorY, rotate: decorRotate }}
      />
      <motion.div
        className="absolute -bottom-48 -right-48 w-96 h-96 border border-accent-violet/10 rounded-full"
        style={{ y: decorY, rotate: decorRotate }}
      />
      
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute -top-96 -left-96 w-[600px] h-[600px] bg-primary rounded-full mix-blend-screen opacity-5 blur-[200px]"
          animate={{ y: [0, 60, 0] }}
          transition={{ duration: 14, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-96 -right-96 w-[500px] h-[500px] bg-accent-violet rounded-full mix-blend-screen opacity-5 blur-[180px]"
          animate={{ y: [0, -60, 0] }}
          transition={{ duration: 16, repeat: Infinity }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          ref={headerRef}
          className="mx-auto max-w-3xl text-center mb-20"
        >
          {/* Animated badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-card/60 border border-border/50"
          >
            <motion.span 
              className="w-2 h-2 bg-primary rounded-full"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-xs font-semibold text-primary uppercase tracking-widest">
              {t("badge")}
            </span>
          </motion.div>

          {/* Title with split reveal */}
          <div className="overflow-hidden mb-6">
            <motion.h2 
              className="text-4xl md:text-5xl font-bold tracking-tight text-foreground text-balance"
              initial={{ y: "100%" }}
              animate={isHeaderInView ? { y: 0 } : {}}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            >
              {t("title")}{" "}
              <span className="text-gradient-blue-cyan">{t("titleHighlight")}</span>
            </motion.h2>
          </div>

          <motion.p 
            className="text-lg text-muted-foreground text-pretty"
            initial={{ opacity: 0, y: 20 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {t("subtitle")}
          </motion.p>
        </motion.div>

        {/* Benefits grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {benefitKeys.map((key, index) => (
            <BenefitCard key={key} benefitKey={key} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
