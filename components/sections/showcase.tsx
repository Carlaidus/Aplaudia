"use client"

import { motion, useInView, useScroll, useTransform } from "framer-motion"
import { useRef, useState } from "react"
import { ArrowUpRight, ExternalLink, Layers } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useTranslations } from "@/i18n"

// Conceptual case studies (demos/examples of what Aplaudia can create)
const conceptualCases = [
  {
    titleKey: "Restaurante Elegante",
    categoryKey: "Sitio Web + WhatsApp IA",
    descriptionKey: "Concepto de sitio web para restaurante premium con sistema de reservas y asistente WhatsApp para pedidos.",
    image: "/placeholder-restaurant.jpg",
    accent: "from-primary to-accent-cyan",
  },
  {
    titleKey: "Estudio de Yoga",
    categoryKey: "Sitio Web + Booking",
    descriptionKey: "Diseño conceptual para estudio de bienestar con agenda de clases integrada y pagos en línea.",
    image: "/placeholder-yoga.jpg",
    accent: "from-accent-cyan to-accent-violet",
  },
  {
    titleKey: "Boutique de Moda",
    categoryKey: "E-commerce + Visuales",
    descriptionKey: "Tienda en línea conceptual con visuales mejorados en IA y composiciones fotográficas de producto.",
    image: "/placeholder-fashion.jpg",
    accent: "from-accent-violet to-accent-magenta",
  },
]

// Real projects built by Aplaudia (modular - easy to add more)
const realProjects = [
  {
    name: "Proyecto Demo 1",
    businessType: "Consultoría",
    description: "Sitio web corporativo con diseño moderno y sistema de contacto inteligente.",
    image: "/placeholder-project1.jpg",
    url: "#",
  },
  {
    name: "Proyecto Demo 2",
    businessType: "Gastronomía",
    description: "Presencia digital completa incluyendo menú interactivo y asistente WhatsApp.",
    image: "/placeholder-project2.jpg",
    url: "#",
  },
]

function ConceptCard({
  concept,
  index,
}: {
  concept: (typeof conceptualCases)[0]
  index: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })
  const [isHovered, setIsHovered] = useState(false)

  // Split reveal: image slides from one direction, content from another
  const imageDirection = index % 2 === 0 ? -1 : 1

  return (
    <motion.div
      ref={ref}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative overflow-hidden rounded-2xl bg-card border border-border hover:border-primary/30 transition-colors"
    >
      {/* Image with reveal animation */}
      <div className="aspect-[16/10] bg-secondary overflow-hidden relative">
        <motion.div
          className="absolute inset-0 bg-secondary flex items-center justify-center"
          initial={{ x: `${imageDirection * 100}%` }}
          animate={isInView ? { x: 0 } : {}}
          transition={{ duration: 0.8, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="text-muted-foreground text-sm">Vista previa conceptual</span>
        </motion.div>
        
        {/* Gradient overlay on hover */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-t ${concept.accent} opacity-0`}
          animate={{ opacity: isHovered ? 0.2 : 0 }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Reveal mask */}
        <motion.div
          className="absolute inset-0 bg-card"
          initial={{ x: 0 }}
          animate={isInView ? { x: `${-imageDirection * 100}%` } : {}}
          transition={{ duration: 0.8, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>

      {/* Content with slide-up animation */}
      <motion.div 
        className="p-6 relative"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
      >
        {/* Category badge */}
        <motion.span 
          className={`inline-block text-xs font-medium uppercase tracking-wider bg-gradient-to-r ${concept.accent} bg-clip-text text-transparent`}
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.4 + index * 0.1 }}
        >
          {concept.categoryKey}
        </motion.span>
        
        <h3 className="mt-2 text-lg font-semibold text-foreground">
          {concept.titleKey}
        </h3>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          {concept.descriptionKey}
        </p>
        
        {/* Animated underline */}
        <motion.div
          className={`absolute bottom-0 left-6 right-6 h-0.5 bg-gradient-to-r ${concept.accent}`}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          style={{ transformOrigin: "left" }}
        />
      </motion.div>
    </motion.div>
  )
}

function ProjectCard({
  project,
  index,
}: {
  project: (typeof realProjects)[0]
  index: number
}) {
  const { t } = useTranslations("showcase")
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })
  const [isHovered, setIsHovered] = useState(false)

  // Zoom and fade entrance
  return (
    <motion.div
      ref={ref}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.15,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group relative overflow-hidden rounded-2xl bg-card border border-border hover:border-primary/30 transition-colors"
    >
      {/* Image with zoom effect */}
      <div className="aspect-[16/10] bg-secondary overflow-hidden relative">
        <motion.div
          className="absolute inset-0 bg-secondary flex items-center justify-center"
          animate={{ scale: isHovered ? 1.05 : 1 }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-muted-foreground text-sm">Imagen del proyecto</span>
        </motion.div>
        
        {/* Hover overlay with CTA */}
        <motion.div 
          className="absolute inset-0 bg-background/90 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: isHovered ? 1 : 0.8, opacity: isHovered ? 1 : 0 }}
            transition={{ delay: 0.1 }}
          >
            <Button asChild variant="secondary" size="sm">
              <Link href={project.url} target="_blank" rel="noopener noreferrer">
                {t("portfolio.viewSite")}
                <ExternalLink className="ml-2 h-3 w-3" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-primary uppercase tracking-wider">
            {project.businessType}
          </span>
          <motion.span 
            className="text-xs text-muted-foreground bg-card-elevated px-2 py-0.5 rounded-full"
            animate={{ opacity: isHovered ? 1 : 0.6 }}
          >
            Proyecto real
          </motion.span>
        </div>
        
        <h3 className="text-lg font-semibold text-foreground">
          {project.name}
        </h3>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          {project.description}
        </p>
        
        {/* Link with arrow animation */}
        <motion.div 
          className="mt-4 flex items-center gap-2 text-primary"
          animate={{ x: isHovered ? 4 : 0 }}
        >
          <Link 
            href={project.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm font-medium flex items-center gap-1"
          >
            Ver proyecto
            <motion.span
              animate={{ rotate: isHovered ? 45 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ArrowUpRight className="h-4 w-4" />
            </motion.span>
          </Link>
        </motion.div>
      </div>
    </motion.div>
  )
}

export function Showcase() {
  const { t } = useTranslations("showcase")
  const sectionRef = useRef<HTMLElement>(null)
  const conceptualRef = useRef<HTMLDivElement>(null)
  const portfolioRef = useRef<HTMLDivElement>(null)
  
  const isConceptualInView = useInView(conceptualRef, { once: true, margin: "-100px" })
  const isPortfolioInView = useInView(portfolioRef, { once: true, margin: "-100px" })
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })
  
  // Parallax for decorative elements
  const decorY = useTransform(scrollYProgress, [0, 1], [100, -100])

  return (
    <section ref={sectionRef} id="portafolio" className="relative py-24 lg:py-32 bg-card overflow-hidden">
      {/* Decorative elements */}
      <motion.div
        className="absolute -top-32 -right-32 w-64 h-64 border border-border/20 rounded-full"
        style={{ y: decorY }}
      />
      <motion.div
        className="absolute -bottom-48 -left-48 w-96 h-96 border border-border/10 rounded-full"
        style={{ y: decorY }}
      />
      
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        {/* Conceptual Cases Section */}
        <motion.div
          ref={conceptualRef}
          className="mx-auto max-w-2xl text-center mb-16"
        >
          {/* Animated badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isConceptualInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, type: "spring" }}
            className="inline-flex items-center gap-2 text-sm font-medium text-primary uppercase tracking-wider mb-4"
          >
            <Layers className="w-4 h-4" />
            {t("conceptual.badge")}
          </motion.div>
          
          {/* Title with perspective animation */}
          <motion.h2 
            className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl text-balance"
            initial={{ opacity: 0, rotateX: -15 }}
            animate={isConceptualInView ? { opacity: 1, rotateX: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            style={{ perspective: "1000px" }}
          >
            {t("conceptual.title")}{" "}
            <span className="text-gradient-blue-cyan">{t("conceptual.titleHighlight")}</span>
          </motion.h2>
          
          <motion.p 
            className="mt-4 text-muted-foreground text-pretty"
            initial={{ opacity: 0, y: 20 }}
            animate={isConceptualInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {t("conceptual.subtitle")}
          </motion.p>
        </motion.div>

        {/* Conceptual cases grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-24">
          {conceptualCases.map((concept, index) => (
            <ConceptCard key={concept.titleKey} concept={concept} index={index} />
          ))}
        </div>

        {/* Animated divider */}
        <motion.div
          className="relative h-px bg-border mb-24 overflow-hidden"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-primary via-accent-cyan to-primary"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>

        {/* Real Projects Section */}
        <motion.div
          ref={portfolioRef}
          className="mx-auto max-w-2xl text-center mb-16"
        >
          <motion.span 
            className="text-sm font-medium text-primary uppercase tracking-wider"
            initial={{ opacity: 0, y: -10 }}
            animate={isPortfolioInView ? { opacity: 1, y: 0 } : {}}
          >
            {t("portfolio.badge")}
          </motion.span>
          
          <motion.h2 
            className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl text-balance"
            initial={{ opacity: 0 }}
            animate={isPortfolioInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.1 }}
          >
            {t("portfolio.title")}{" "}
            <span className="text-gradient-violet-magenta">{t("portfolio.titleHighlight")}</span>
          </motion.h2>
          
          <motion.p 
            className="mt-4 text-muted-foreground text-pretty"
            initial={{ opacity: 0, y: 20 }}
            animate={isPortfolioInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
          >
            {t("portfolio.subtitle")}
          </motion.p>
        </motion.div>

        {/* Real projects grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {realProjects.map((project, index) => (
            <ProjectCard key={project.name} project={project} index={index} />
          ))}
          
          {/* Placeholder card */}
          {realProjects.length < 3 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex items-center justify-center rounded-2xl border-2 border-dashed border-border p-8 text-center min-h-[300px]"
            >
              <div>
                <motion.div
                  className="w-12 h-12 mx-auto mb-4 rounded-full bg-card-elevated flex items-center justify-center"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <Layers className="w-6 h-6 text-muted-foreground" />
                </motion.div>
                <p className="text-muted-foreground text-sm font-medium">
                  {t("portfolio.comingSoon")}
                </p>
                <p className="mt-2 text-xs text-muted-foreground/60">
                  Tu proyecto podría estar aquí
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}
