"use client"

import { motion, useInView, useScroll, useTransform } from "framer-motion"
import { useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, CheckCircle2, ExternalLink, Layers } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTranslations } from "@/i18n"
import { useLightweightMotion } from "@/components/motion-performance-provider"
import {
  portfolioProjects,
  showcaseLabels,
  type PortfolioProject,
} from "@/content/showcase"

function ProjectCaseCard({
  project,
  index,
  lightweightMotion,
}: {
  project: PortfolioProject
  index: number
  lightweightMotion: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.article
      ref={ref}
      onMouseEnter={lightweightMotion ? undefined : () => setIsHovered(true)}
      onMouseLeave={lightweightMotion ? undefined : () => setIsHovered(false)}
      initial={{ opacity: 0, y: 32 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.65,
        delay: index * 0.12,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-colors hover:border-primary/30"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-secondary">
        <Image
          src={project.image}
          alt={project.imageAlt}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />

        <motion.div
          className={`absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r ${project.accent}`}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          style={{ transformOrigin: "left" }}
        />
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <span className={`bg-gradient-to-r ${project.accent} bg-clip-text text-xs font-medium uppercase tracking-wider text-transparent`}>
            {project.businessType}
          </span>
          <span className="rounded-full bg-card-elevated px-2 py-0.5 text-xs text-muted-foreground">
            {showcaseLabels.projectStatus}
          </span>
        </div>

        <h3 className="text-xl font-semibold leading-tight text-foreground">
          {project.name}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {project.shortDescription}
        </p>

        <div className="mt-5">
          <p className="text-xs font-medium uppercase tracking-wider text-foreground/70">
            {showcaseLabels.evidenceLabel}
          </p>
          <ul className="mt-3 grid gap-2 text-sm leading-relaxed text-muted-foreground">
            {project.highlights.map((highlight) => (
              <li key={highlight} className="flex gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Button asChild size="sm" className="w-full sm:w-auto">
            <Link href={project.caseHref}>
              {showcaseLabels.caseLink}
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>

          <Button asChild variant="outline" size="sm" className="w-full sm:w-auto">
            <Link href={project.url} target="_blank" rel="noopener noreferrer">
              {project.visitLabel}
              <ExternalLink className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </motion.article>
  )
}

export function Showcase() {
  const { t } = useTranslations("showcase")
  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)
  const lightweightMotion = useLightweightMotion()

  const isHeadingInView = useInView(headingRef, { once: true, margin: "-100px" })

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  const decorY = useTransform(scrollYProgress, [0, 1], [100, -100])

  return (
    <section ref={sectionRef} id="portfolio" className="relative overflow-hidden bg-card py-24 lg:py-32">
      <motion.div
        className="absolute -right-32 -top-32 h-64 w-64 rounded-full border border-border/20"
        style={lightweightMotion ? undefined : { y: decorY }}
      />
      <motion.div
        className="absolute -bottom-48 -left-48 h-96 w-96 rounded-full border border-border/10"
        style={lightweightMotion ? undefined : { y: decorY }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          ref={headingRef}
          className="mx-auto mb-16 max-w-2xl text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isHeadingInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, type: "spring" }}
            className="mb-4 inline-flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-primary"
          >
            <Layers className="h-4 w-4" />
            {t("conceptual.badge")}
          </motion.div>

          <motion.h2
            className="text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
            initial={{ opacity: 0, rotateX: -15 }}
            animate={isHeadingInView ? { opacity: 1, rotateX: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            style={{ perspective: "1000px" }}
          >
            {t("conceptual.title")}{" "}
            <span className="text-gradient-blue-cyan">{t("conceptual.titleHighlight")}</span>
          </motion.h2>

          <motion.p
            className="mt-4 text-pretty text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={isHeadingInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {t("conceptual.subtitle")}
          </motion.p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {portfolioProjects.map((project, index) => (
            <ProjectCaseCard
              key={project.slug}
              project={project}
              index={index}
              lightweightMotion={lightweightMotion}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
