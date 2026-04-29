"use client"

import { motion, useInView, useScroll, useTransform } from "framer-motion"
import { useRef, useState } from "react"
import { Globe, MessageSquare, Image as ImageIcon, ArrowUpRight, Sparkles } from "lucide-react"
import { useTranslations } from "@/i18n"

type ServiceKey = "web" | "whatsapp" | "visuals"

const serviceKeys: ServiceKey[] = ["web", "whatsapp", "visuals"]

const serviceIcons = {
  web: Globe,
  whatsapp: MessageSquare,
  visuals: ImageIcon,
}

const serviceGradients = {
  web: { gradient: "from-primary to-accent-cyan", bg: "bg-primary/10" },
  whatsapp: { gradient: "from-accent-cyan to-accent-violet", bg: "bg-accent-cyan/10" },
  visuals: { gradient: "from-accent-violet to-accent-magenta", bg: "bg-accent-violet/10" },
}

function ServiceCard({
  serviceKey,
  index,
}: {
  serviceKey: ServiceKey
  index: number
}) {
  const { t } = useTranslations("services")
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })
  const [isHovered, setIsHovered] = useState(false)
  
  const Icon = serviceIcons[serviceKey]
  const { gradient, bg } = serviceGradients[serviceKey]
  
  const features = [
    t(`${serviceKey}.feature1`),
    t(`${serviceKey}.feature2`),
    t(`${serviceKey}.feature3`),
    t(`${serviceKey}.feature4`),
  ]

  // Different entrance animations per card
  const getEntrance = () => {
    switch (index) {
      case 0: return { x: -100, rotateY: 15 }
      case 1: return { y: 100, scale: 0.8 }
      case 2: return { x: 100, rotateY: -15 }
      default: return { y: 50 }
    }
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...getEntrance() }}
      animate={isInView ? { opacity: 1, x: 0, y: 0, rotateY: 0, scale: 1 } : {}}
      transition={{ 
        duration: 0.8, 
        delay: index * 0.15,
        ease: [0.22, 1, 0.36, 1],
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex flex-col rounded-2xl bg-card/50 backdrop-blur border border-border overflow-hidden h-full"
      style={{ perspective: "1000px" }}
    >
      {/* Animated border glow on hover */}
      <motion.div 
        className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${gradient} opacity-0`}
        animate={{ opacity: isHovered ? 0.1 : 0 }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Top accent line that animates in */}
      <motion.div
        className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient}`}
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 0.6, delay: 0.3 + index * 0.15 }}
        style={{ transformOrigin: index === 2 ? "right" : "left" }}
      />

      <div className="relative z-10 p-8 flex flex-col h-full">
        {/* Icon with rotation on hover */}
        <motion.div 
          className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} text-foreground shadow-lg mb-6`}
          animate={{ 
            rotateZ: isHovered ? [0, -10, 10, 0] : 0,
            scale: isHovered ? 1.05 : 1,
          }}
          transition={{ duration: 0.5 }}
        >
          <Icon className="h-8 w-8" />
        </motion.div>

        {/* Title with underline animation */}
        <div className="relative mb-4">
          <h3 className="text-2xl font-bold text-foreground">
            {t(`${serviceKey}.title`)}
          </h3>
          <motion.div
            className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r ${gradient}`}
            initial={{ width: 0 }}
            animate={{ width: isHovered ? "60%" : "0%" }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Description */}
        <p className="text-muted-foreground leading-relaxed flex-grow mb-6">
          {t(`${serviceKey}.description`)}
        </p>

        {/* Features with staggered reveal */}
        <ul className="flex flex-col gap-3 mb-6">
          {features.map((feature, featureIndex) => (
            <motion.li
              key={feature}
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ 
                delay: 0.5 + index * 0.15 + featureIndex * 0.08,
                duration: 0.4,
              }}
              className="flex items-center gap-3 text-sm text-muted-foreground"
            >
              <motion.span 
                className={`h-2 w-2 rounded-full bg-gradient-to-r ${gradient}`}
                animate={{ scale: isHovered ? [1, 1.3, 1] : 1 }}
                transition={{ delay: featureIndex * 0.1 }}
              />
              {feature}
            </motion.li>
          ))}
        </ul>

        {/* CTA with arrow animation */}
        <motion.div
          className="flex items-center gap-2 text-primary mt-auto"
          animate={{ x: isHovered ? 8 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <span className="text-sm font-semibold">{t("explore")}</span>
          <motion.div
            animate={{ 
              x: isHovered ? [0, 4, 0] : 0,
              rotate: isHovered ? 45 : 0,
            }}
            transition={{ duration: 0.3 }}
          >
            <ArrowUpRight className="h-4 w-4" />
          </motion.div>
        </motion.div>
      </div>

      {/* Corner decorative element */}
      <motion.div
        className={`absolute bottom-0 right-0 w-32 h-32 ${bg} rounded-tl-full`}
        initial={{ scale: 0, opacity: 0 }}
        animate={isHovered ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
        transition={{ duration: 0.4 }}
      />
    </motion.div>
  )
}

export function Services() {
  const { t } = useTranslations("services")
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-100px" })
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })
  
  // Floating decorative elements
  const floatY1 = useTransform(scrollYProgress, [0, 1], [0, -100])
  const floatY2 = useTransform(scrollYProgress, [0, 1], [0, 100])

  return (
    <section ref={sectionRef} id="servicios" className="relative py-32 lg:py-40 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-1/4 -left-24 w-96 h-96 bg-primary rounded-full mix-blend-screen opacity-5 blur-[100px]"
          style={{ y: floatY1 }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-24 w-80 h-80 bg-accent-cyan rounded-full mix-blend-screen opacity-5 blur-[100px]"
          style={{ y: floatY2 }}
        />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,transparent_49.9%,rgba(255,255,255,0.02)_50%,transparent_50.1%),linear-gradient(to_bottom,transparent_49.9%,rgba(255,255,255,0.02)_50%,transparent_50.1%)] bg-[length:80px_80px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section header with split animation */}
        <motion.div
          ref={headerRef}
          className="mx-auto max-w-3xl text-center mb-20"
        >
          {/* Badge with horizontal line animation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isHeaderInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center gap-3 mb-6"
          >
            <motion.div 
              className="h-px bg-gradient-to-r from-transparent to-primary"
              initial={{ width: 0 }}
              animate={isHeaderInView ? { width: 48 } : { width: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
            <span className="text-sm font-semibold text-primary uppercase tracking-widest flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              {t("badge")}
            </span>
            <motion.div 
              className="h-px bg-gradient-to-l from-transparent to-primary"
              initial={{ width: 0 }}
              animate={isHeaderInView ? { width: 48 } : { width: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
          </motion.div>

          {/* Title with word-by-word reveal */}
          <motion.h2 
            className="text-4xl md:text-5xl font-bold tracking-tight text-foreground text-balance mb-6"
          >
            <motion.span
              initial={{ opacity: 0, y: 30 }}
              animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="inline-block"
            >
              {t("title")}{" "}
            </motion.span>
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isHeaderInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.5, type: "spring" }}
              className="inline-block text-gradient-blue-cyan"
            >
              {t("titleHighlight")}
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: -30 }}
              animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="inline-block"
            >
              {" "}{t("titleEnd")}
            </motion.span>
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-lg text-muted-foreground text-pretty"
          >
            {t("subtitle")}
          </motion.p>
        </motion.div>

        {/* Services grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {serviceKeys.map((key, index) => (
            <ServiceCard key={key} serviceKey={key} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
