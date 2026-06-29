import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ConstructionNotice } from "@/components/sections/construction-notice"
import { Footer } from "@/components/sections/footer"
import { Header } from "@/components/sections/header"
import { siteConfig } from "@/content/site"
import { portfolioProjects, showcaseLabels } from "@/content/showcase"

export const metadata: Metadata = {
  title: `Casos reales | ${siteConfig.name}`,
  description:
    "Portfolio real de Aplaudia con proyectos publicados: SaaS, catálogo comercial y experiencia editorial modular.",
  alternates: {
    canonical: "/casos",
  },
}

export default function CasesPage() {
  return (
    <>
      <Header />
      <ConstructionNotice />
      <main className="min-h-screen bg-background text-foreground">
        <section className="border-b border-border bg-card py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <p className="text-sm font-medium uppercase tracking-wider text-primary">
              Portfolio real
            </p>
            <h1 className="mt-4 max-w-3xl text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
              Casos construidos y publicados
            </h1>
            <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
              Una selección de proyectos reales desarrollados por Aplaudia para enseñar producto,
              criterio visual, estructura comercial y capacidad técnica sin inventar ejemplos.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="mx-auto grid max-w-7xl gap-8 px-6 md:grid-cols-2 lg:grid-cols-3 lg:px-8">
            {portfolioProjects.map((project) => (
              <article
                key={project.slug}
                className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card"
              >
                <div className="relative aspect-[16/10] bg-secondary">
                  <Image
                    src={project.image}
                    alt={project.imageAlt}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="text-xs font-medium uppercase tracking-wider text-primary">
                    {project.businessType}
                  </p>
                  <h2 className="mt-3 text-2xl font-semibold tracking-tight">
                    {project.name}
                  </h2>
                  <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                    {project.shortDescription}
                  </p>
                  <div className="mt-4 border-l border-primary/50 pl-4">
                    <p className="text-xs font-medium uppercase tracking-wider text-foreground/70">
                      {showcaseLabels.takeawayLabel}
                    </p>
                    <p className="mt-2 text-base leading-relaxed text-muted-foreground">
                      {project.cardTakeaway}
                    </p>
                  </div>
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                    <Button asChild size="sm" className="w-full sm:w-auto">
                      <Link href={project.caseHref}>
                        Ver caso
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
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
