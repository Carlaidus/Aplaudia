import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ExternalLink, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ConstructionNotice } from "@/components/sections/construction-notice"
import { Footer } from "@/components/sections/footer"
import { Header } from "@/components/sections/header"
import { CaseGallery } from "@/components/cases/case-gallery"
import { showcaseLabels, type PortfolioProject } from "@/lib/cases"

type CaseTemplateProps = {
  project: PortfolioProject
}

export function CaseTemplate({ project }: CaseTemplateProps) {
  const hasStack = project.stack && project.stack.length > 0
  const hasResults = project.results && project.results.length > 0

  return (
    <>
      <Header />
      <ConstructionNotice />
      <main className="min-h-screen bg-background text-foreground">
        <section className="border-b border-border bg-card pb-10 pt-28 sm:pt-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button asChild variant="outline" size="sm" className="w-full justify-start sm:w-auto">
                <Link href="/casos">
                  <ArrowLeft className="h-4 w-4" />
                  Volver a casos
                </Link>
              </Button>
              <Button asChild variant="ghost" size="sm" className="w-full justify-start sm:w-auto">
                <Link href="/">
                  <Home className="h-4 w-4" />
                  Volver a la home
                </Link>
              </Button>
            </div>

            <div className="mt-10 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div>
                <p className="text-sm font-medium uppercase tracking-wider text-primary">
                  {project.businessType}
                </p>
                <h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
                  {project.name}
                </h1>
                <p className="mt-6 text-pretty text-lg leading-relaxed text-muted-foreground">
                  {project.description}
                </p>

                {hasStack && (
                  <ul className="mt-6 flex flex-wrap gap-2" aria-label="Stack y capacidades del caso">
                    {project.stack?.map((item) => (
                      <li
                        key={item}
                        className="rounded-full border border-border bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                )}

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <Button asChild className="w-full sm:w-auto">
                    <Link href={project.url} target="_blank" rel="noopener noreferrer">
                      {project.visitLabel}
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full sm:w-auto">
                    <Link href="/#contacto">Hablar de un proyecto parecido</Link>
                  </Button>
                </div>
              </div>

              <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-border bg-secondary">
                <Image
                  src={project.image}
                  alt={project.imageAlt}
                  fill
                  priority
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-border/60 py-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="max-w-2xl">
              <p className="text-sm font-medium uppercase tracking-wider text-primary">
                {showcaseLabels.galleryLabel}
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
                Lo que se ve en este proyecto
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                Capturas seleccionadas para explicar mejor la experiencia real, no solo para decorar el portfolio.
              </p>
            </div>

            <CaseGallery images={project.gallery} label={showcaseLabels.galleryLabel} />
          </div>
        </section>

        <section className="py-16">
          <div className="mx-auto grid max-w-7xl gap-8 px-6 lg:grid-cols-3 lg:px-8">
            <article className="rounded-2xl border border-border bg-card p-6">
              <h2 className="text-sm font-medium uppercase tracking-wider text-primary">
                Qué es
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                {project.whatItIs}
              </p>
            </article>

            <article className="rounded-2xl border border-border bg-card p-6">
              <h2 className="text-sm font-medium uppercase tracking-wider text-primary">
                Para quién es
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                {project.audience}
              </p>
            </article>

            <article className="rounded-2xl border border-border bg-card p-6">
              <h2 className="text-sm font-medium uppercase tracking-wider text-primary">
                Por qué vende bien
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                {project.whyItWorks}
              </p>
            </article>
          </div>
        </section>

        <section className="pb-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
              <p className="text-sm font-medium uppercase tracking-wider text-primary">
                {showcaseLabels.proofLabel}
              </p>
              <div className="mt-6 grid gap-6 lg:grid-cols-3">
                {project.proofPoints.map((point) => (
                  <div key={point.title} className="border-l border-primary/50 pl-4">
                    <h2 className="text-lg font-semibold tracking-tight">
                      {point.title}
                    </h2>
                    <p className="mt-2 text-base leading-relaxed text-muted-foreground">
                      {point.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="pb-20">
          <div className="mx-auto grid max-w-7xl gap-8 px-6 lg:grid-cols-2 lg:px-8">
            <article className="rounded-2xl border border-border bg-card p-6 sm:p-8">
              <h2 className="text-2xl font-semibold tracking-tight">Qué se hizo</h2>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                {project.whatWasDone}
              </p>
              <ul className="mt-6 grid gap-3 text-base leading-relaxed text-muted-foreground">
                {project.deliverables.map((item) => (
                  <li key={item} className="border-l border-primary/50 pl-4">
                    {item}
                  </li>
                ))}
              </ul>
            </article>

            <article className="rounded-2xl border border-border bg-card p-6 sm:p-8">
              <h2 className="text-2xl font-semibold tracking-tight">Qué destaca</h2>
              <ul className="mt-6 grid gap-3 text-base leading-relaxed text-muted-foreground">
                {project.highlights.map((item) => (
                  <li key={item} className="border-l border-primary/50 pl-4">
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </section>

        {hasResults && (
          <section className="pb-20">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
                <h2 className="text-2xl font-semibold tracking-tight">Resultado visible</h2>
                <ul className="mt-6 grid gap-3 text-base leading-relaxed text-muted-foreground md:grid-cols-2">
                  {project.results?.map((item) => (
                    <li key={item} className="border-l border-primary/50 pl-4">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  )
}
