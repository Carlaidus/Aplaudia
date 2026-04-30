"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowRight, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useTranslations } from "@/i18n"

// Character reveal animation for text
function AnimatedText({ text, delay = 0, className = "" }: { text: string; delay?: number; className?: string }) {
  const characters = text.split("")
  
  return (
    <span className={className}>
      {characters.map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 50, rotateX: -90 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{
            duration: 0.5,
            delay: delay + index * 0.025,
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{ display: "inline-block", transformOrigin: "bottom" }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  )
}

// Word reveal with clip-path mask
function MaskedWord({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <span className="relative inline-block overflow-hidden">
      <motion.span
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        transition={{
          duration: 0.8,
          delay,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="inline-block"
      >
        {children}
      </motion.span>
    </span>
  )
}

export function Hero() {
  const { t } = useTranslations("hero")
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  // Parallax transforms
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const textY = useTransform(scrollYProgress, [0, 0.5], ["0%", "20%"])
  const scaleDown = useTransform(scrollYProgress, [0, 0.5], [1, 0.95])
  const scrollIndicatorOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0])

  const techStack = ["Next.js", "Claude AI", "Vercel", "WhatsApp API"]

  return (
    <section ref={containerRef} className="relative min-h-[110vh] flex items-center justify-center overflow-hidden pt-20">
      {/* Layered animated backgrounds */}
      <div className="absolute inset-0">
        {/* Deep background layer with parallax */}
        <motion.div 
          className="absolute inset-0"
          style={{ y: backgroundY }}
        >
          {/* Radial gradient base */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-card via-background to-background" />
          
          {/* Animated gradient orbs with different motion patterns */}
          <motion.div
            className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary/20 rounded-full mix-blend-screen blur-[120px]"
            animate={{
              scale: [1, 1.2, 1],
              x: [0, 50, 0],
              y: [0, -30, 0],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          />
          
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-accent-cyan/15 rounded-full mix-blend-screen blur-[100px]"
            animate={{
              scale: [1.2, 1, 1.2],
              x: [0, -40, 0],
              y: [0, 40, 0],
            }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          />
          
          <motion.div
            className="absolute top-1/3 right-1/3 w-[400px] h-[400px] bg-accent-violet/10 rounded-full mix-blend-screen blur-[80px]"
            animate={{
              rotate: [0, 180, 360],
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>

        {/* Noise texture overlay */}
        <div className="absolute inset-0 opacity-[0.015] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNhKSIvPjwvc3ZnPg==')]" />
      </div>

      {/* Main content with scroll-based opacity and scale */}
      <motion.div 
        className="relative z-10 mx-auto max-w-7xl px-6 py-32 lg:px-8 w-full"
        style={{ opacity: textOpacity, y: textY, scale: scaleDown }}
      >
        <div className="flex flex-col items-center text-center">
          {/* Animated badge with shimmer effect */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative mb-8"
          >
            <div className="relative overflow-hidden rounded-full bg-card/80 backdrop-blur-sm border border-border-accent/30 px-5 py-2">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              />
              <span className="relative flex items-center gap-2 text-sm font-medium text-foreground">
                <motion.span 
                  className="w-2 h-2 bg-primary rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                {t("badge")}
              </span>
            </div>
          </motion.div>

          {/* Main headline with character-by-character reveal */}
          <div className="max-w-5xl mb-8">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-foreground leading-[1.1]">
              <MaskedWord delay={0.3}>
                <AnimatedText text={t("title")} delay={0.3} />
              </MaskedWord>
              <br />
              <MaskedWord delay={0.6}>
                <motion.span
                  className="inline-block bg-gradient-to-r from-primary via-accent-cyan to-primary bg-[length:200%_100%] bg-clip-text text-transparent"
                  animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                >
                  {t("titleHighlight")}
                </motion.span>
              </MaskedWord>
              <br />
              <MaskedWord delay={0.9}>
                <AnimatedText text={t("titleEnd")} delay={0.9} />
              </MaskedWord>
            </h1>
          </div>

          {/* Subtitle with fade up */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl text-pretty leading-relaxed mb-12"
          >
            {t("subtitle")}
          </motion.p>

          {/* CTA buttons with staggered entrance from different directions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            className="flex flex-col sm:flex-row items-center gap-5"
          >
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 1.5, ease: [0.22, 1, 0.36, 1] }}
              className="group relative"
            >
              <motion.div
                className="absolute -inset-1 bg-gradient-to-r from-primary via-accent-cyan to-primary rounded-xl opacity-0 group-hover:opacity-70 blur transition-opacity duration-500"
                animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                transition={{ duration: 3, repeat: Infinity }}
                style={{ backgroundSize: "200% 200%" }}
              />
              <Button
                asChild
                size="lg"
                className="relative bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-base font-semibold rounded-xl"
              >
                <Link href="#contacto" className="flex items-center gap-2">
                  {t("cta")}
                  <motion.span
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="h-5 w-5" />
                  </motion.span>
                </Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 1.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <Button
                asChild
                variant="ghost"
                size="lg"
                className="text-muted-foreground hover:text-foreground border border-border hover:border-border-accent/50 px-8 py-6 text-base font-semibold rounded-xl"
              >
                <Link href="#portafolio">{t("ctaSecondary")}</Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Tech stack with horizontal slide-in */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8 }}
            className="mt-20 flex flex-col items-center gap-6"
          >
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.9 }}
              className="text-sm text-muted-foreground font-medium"
            >
              {t("techLabel")}
            </motion.p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              {techStack.map((tech, index) => (
                <motion.div
                  key={tech}
                  initial={{ opacity: 0, scale: 0.8, x: index % 2 === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  transition={{ 
                    delay: 2 + index * 0.1,
                    type: "spring",
                    stiffness: 200,
                    damping: 20,
                  }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/60 backdrop-blur border border-border/50 hover:border-primary/30 transition-colors"
                >
                  <motion.span 
                    className="w-1.5 h-1.5 bg-primary rounded-full"
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                  />
                  <span className="text-sm font-medium text-foreground/80">{tech}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator with bounce animation */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
        style={{ opacity: scrollIndicatorOpacity }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.5 }}
      >
        <motion.span 
          className="text-xs text-muted-foreground font-medium uppercase tracking-widest"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {t("scroll")}
        </motion.span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="p-2 rounded-full border border-border/50 bg-card/30 backdrop-blur-sm"
        >
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        </motion.div>
      </motion.div>
    </section>
  )
}
