"use client"

import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { useRef, useState } from "react"
import { useTranslations } from "@/i18n"

function StatCard({ value, label, index }: { value: string; label: string; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ 
        duration: 0.5, 
        delay: 0.4 + index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative text-center group"
    >
      {/* Background glow on hover */}
      <motion.div
        className="absolute -inset-4 bg-primary/10 rounded-xl"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.8 }}
        transition={{ duration: 0.3 }}
      />
      
      <motion.p 
        className="relative text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent-cyan"
        animate={{ scale: isHovered ? 1.1 : 1 }}
        transition={{ duration: 0.2 }}
      >
        {value}
      </motion.p>
      <p className="relative mt-2 text-sm text-muted-foreground">
        {label}
      </p>
    </motion.div>
  )
}

export function About() {
  const { t } = useTranslations("about")
  const sectionRef = useRef<HTMLElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  
  const isImageInView = useInView(imageRef, { once: true, margin: "-100px" })
  const isContentInView = useInView(contentRef, { once: true, margin: "-100px" })
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })
  
  // Parallax transforms
  const imageY = useTransform(scrollYProgress, [0, 1], [50, -50])
  const imageRotate = useTransform(scrollYProgress, [0, 1], [-3, 3])
  const contentY = useTransform(scrollYProgress, [0, 1], [-30, 30])

  const stats = [
    { value: "100%", label: t("stat1") },
    { value: "24/7", label: t("stat2") },
    { value: "BCN", label: t("stat3") },
  ]

  return (
    <section ref={sectionRef} id="nosotros" className="relative py-24 lg:py-32 bg-card overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />
      
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-2 items-center">
          {/* Image with parallax and reveal */}
          <motion.div
            ref={imageRef}
            className="relative"
            style={{ y: imageY }}
          >
            {/* Main image container with clip-path reveal */}
            <motion.div
              initial={{ clipPath: "polygon(0 0, 0 0, 0 100%, 0 100%)" }}
              animate={isImageInView ? { clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" } : {}}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="relative aspect-[4/3] rounded-2xl bg-secondary border border-border overflow-hidden"
              style={{ rotate: imageRotate }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-muted-foreground text-sm">
                  {t("imageAlt")}
                </span>
              </div>
              
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-accent-cyan/10" />
            </motion.div>
            
            {/* Floating accent card */}
            <motion.div
              initial={{ opacity: 0, x: -30, y: 30 }}
              animate={isImageInView ? { opacity: 1, x: 0, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="absolute -bottom-6 -right-6 p-4 rounded-xl bg-card border border-border shadow-lg"
            >
              <div className="flex items-center gap-3">
                <motion.div 
                  className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent-cyan flex items-center justify-center"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <span className="text-lg font-bold text-foreground">A</span>
                </motion.div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Aplaudia</p>
                  <p className="text-xs text-muted-foreground">{t("tagline")}</p>
                </div>
              </div>
            </motion.div>
            
            {/* Decorative corner lines */}
            <motion.div
              initial={{ scaleY: 0 }}
              animate={isImageInView ? { scaleY: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="absolute -left-4 top-8 w-px h-24 bg-gradient-to-b from-primary to-transparent"
              style={{ transformOrigin: "top" }}
            />
            <motion.div
              initial={{ scaleX: 0 }}
              animate={isImageInView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="absolute -top-4 left-8 w-24 h-px bg-gradient-to-r from-primary to-transparent"
              style={{ transformOrigin: "left" }}
            />
          </motion.div>

          {/* Content with staggered reveals */}
          <motion.div
            ref={contentRef}
            style={{ y: contentY }}
          >
            {/* Badge */}
            <motion.span 
              initial={{ opacity: 0, x: 20 }}
              animate={isContentInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="inline-block text-sm font-semibold text-primary uppercase tracking-widest mb-4"
            >
              {t("badge")}
            </motion.span>
            
            {/* Title with split reveal */}
            <div className="overflow-hidden mb-6">
              <motion.h2 
                initial={{ y: "100%" }}
                animate={isContentInView ? { y: 0 } : {}}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance"
              >
                {t("title")}{" "}
                <span className="text-gradient-blue-cyan">{t("titleHighlight")}</span>
              </motion.h2>
            </div>
            
            {/* Paragraphs with staggered fade-in */}
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              {[t("paragraph1"), t("paragraph2"), t("paragraph3")].map((text, index) => (
                <motion.p
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isContentInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                >
                  {text}
                </motion.p>
              ))}
            </div>

            {/* Stats with individual animations */}
            <div className="mt-10 grid grid-cols-3 gap-6">
              {stats.map((stat, index) => (
                <StatCard key={stat.value} value={stat.value} label={stat.label} index={index} />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
