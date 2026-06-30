"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { useTranslations } from "@/i18n"
import { useLightweightMotion } from "@/components/motion-performance-provider"

// Word-by-word reveal with 3D perspective and blur effect
function RevealWord({
  children,
  index,
  lightweightMotion,
}: {
  children: React.ReactNode
  index: number
  lightweightMotion: boolean
}) {
  if (lightweightMotion) {
    return <span className="inline-block mr-[0.3em]">{children}</span>
  }

  return (
    <motion.span
      className="inline-block mr-[0.3em]"
      initial={{ opacity: 0, y: 30, rotateX: -20, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0, filter: "blur(0px)" }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.08,
        type: "spring",
        stiffness: 100,
      }}
      viewport={{ once: true, margin: "-100px" }}
      style={{ perspective: "1200px" }}
    >
      {children}
    </motion.span>
  )
}

export function ScrollStory() {
  const { t } = useTranslations("scrollStory")
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })
  const lightweightMotion = useLightweightMotion()
  
  const benefits = [
    { label: t("benefit1"), desc: t("benefit1Desc") },
    { label: t("benefit2"), desc: t("benefit2Desc") },
    { label: t("benefit3"), desc: t("benefit3Desc") },
  ]

  // Split text into words for reveal animation
  const line1Words = t("line1").split(" ")
  const line2Words = t("line2").split(" ")
  const line3Words = t("line3").split(" ")
  const highlightText = t("highlight")

  return (
    <section 
      ref={containerRef} 
      className="relative overflow-hidden py-20 sm:py-28 lg:py-40"
    >
      {/* Animated background with parallax depth and scan line */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary/8 rounded-full blur-[150px]"
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-accent-violet/8 rounded-full blur-[120px]"
        />
        
        {/* Horizontal scan line effect */}
        <div className="absolute left-0 right-0 top-1/2 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-40" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-6 lg:px-8 text-center">
        {/* Main statement with word-by-word 3D perspective reveal */}
        <motion.div 
          className="mb-10 sm:mb-16"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: lightweightMotion ? 0.3 : 0.6 }}
        >
          <h2
            className="mx-auto max-w-[22rem] text-[2.125rem] font-bold tracking-normal text-foreground leading-[1.14] text-balance sm:max-w-3xl sm:text-4xl sm:leading-tight md:text-5xl lg:text-6xl"
            style={{ perspective: "1200px" }}
            aria-label={`${t("line1")} ${t("line2")} ${t("line3")} ${highlightText}`}
          >
            {/* Line 1 */}
            <div className="block mb-2">
              {line1Words.map((word, i) => (
                <RevealWord key={`${word}-${i}`} index={i} lightweightMotion={lightweightMotion}>
                  {word}
                </RevealWord>
              ))}
            </div>
            
            {/* Line 2 */}
            <div className="block mb-2">
              {line2Words.map((word, i) => (
                <RevealWord key={`${word}-${i}`} index={line1Words.length + i} lightweightMotion={lightweightMotion}>
                  {word}
                </RevealWord>
              ))}
            </div>
            
            {/* Line 3 with rotating highlight and glow */}
            <div className="block">
              {line3Words.map((word, i) => (
                <RevealWord key={`${word}-${i}`} index={line1Words.length + line2Words.length + i} lightweightMotion={lightweightMotion}>
                  {word}
                </RevealWord>
              ))}
              {" "}
              <motion.span 
                className="relative inline-block"
                initial={lightweightMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: lightweightMotion ? 0 : (line1Words.length + line2Words.length + line3Words.length) * 0.08 + 0.2,
                  duration: lightweightMotion ? 0.25 : 0.6,
                }}
                viewport={{ once: true, margin: "-100px" }}
              >
                {/* Animated gradient text */}
                <motion.span
                  className="relative z-10 font-bold"
                  style={{
                    backgroundImage: "linear-gradient(90deg, var(--primary), var(--accent-cyan), var(--primary))",
                    backgroundSize: "200% 100%",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {highlightText}
                </motion.span>
                {/* Rotating glow behind highlight */}
                <motion.span
                  className="absolute inset-0 bg-gradient-to-r from-primary via-accent-cyan to-primary rounded-lg blur-2xl -z-10"
                />
              </motion.span>
            </div>
          </h2>
        </motion.div>

        {/* Benefits grid with directional slide-in animations */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => {
            // Different entry directions for each card
            const directions = [
              { x: -80, y: 0 }, // Left
              { x: 0, y: 40 },   // Bottom
              { x: 80, y: 0 },   // Right
            ]
            const direction = directions[index]
            
            return (
              <motion.div
                key={benefit.label}
                initial={lightweightMotion
                  ? { opacity: 0, x: 0, y: 14 }
                  : {
                      opacity: 0,
                      x: direction.x,
                      y: direction.y,
                    }}
                whileInView={{ 
                  opacity: 1, 
                  x: 0,
                  y: 0,
                }}
                whileHover={{ 
                  y: -12,
                  boxShadow: "0 20px 40px rgba(102, 51, 153, 0.15)",
                }}
                transition={{ 
                  duration: lightweightMotion ? 0.35 : 0.8,
                  delay: lightweightMotion ? index * 0.06 : (line1Words.length + line2Words.length + line3Words.length) * 0.08 + 0.35 + index * 0.15,
                  type: "spring",
                  stiffness: 100,
                }}
                viewport={{ once: true, margin: "-100px" }}
                className="relative p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/40 transition-all group overflow-hidden"
              >
                {/* Gradient background overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent-violet/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                
                {/* Animated 3D flip number */}
                <motion.div 
                  className="relative z-10 text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-primary to-accent-cyan mb-3"
                  whileHover={{ rotateY: 360 }}
                  transition={{ duration: 0.6 }}
                  style={{ perspective: "1000px" }}
                >
                  0{index + 1}
                </motion.div>
                
                <h3 className="relative z-10 font-semibold text-foreground text-lg mb-2 group-hover:text-primary transition-colors">
                  {benefit.label}
                </h3>
                <p className="relative z-10 text-sm text-muted-foreground leading-relaxed">
                  {benefit.desc}
                </p>
                
                {/* Animated line that draws from left to right */}
                <motion.div 
                  className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-primary/60 via-accent-cyan/60 to-transparent"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  transition={{ 
                    duration: lightweightMotion ? 0.3 : 0.6,
                    delay: lightweightMotion ? 0.1 + index * 0.05 : (line1Words.length + line2Words.length + line3Words.length) * 0.08 + 0.5 + index * 0.15,
                  }}
                  viewport={{ once: true, margin: "-100px" }}
                  style={{ transformOrigin: "left" }}
                />
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
