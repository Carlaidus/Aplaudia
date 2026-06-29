import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ConstructionNotice } from "@/components/sections/construction-notice"
import { Footer } from "@/components/sections/footer"
import { Header } from "@/components/sections/header"
import { siteConfig } from "@/content/site"
import { caseStudies, getCaseStudy, showcaseLabels } from "@/content/showcase"

type CasePageProps = {
  params: Promise<{
    slug: string
  }>
}

export function generateStaticParams() {
  return caseStudies.map((project) => ({
    slug: project.slug,
  }))
}

export async function generateMetadata({ params }: CasePageProps): Promise<Metadata> {
  const { slug } = await params
  const project = getCaseStudy(slug)

  if (!project) {
    return {
      title: `Caso no encontrado | ${siteConfig.name}`,
    }
  }

  return {
    title: `${project.name} | Caso real de ${siteConfig.name}`,
    description: project.shortDescription,
    alternates: {
      canonical: project.caseHref,
    },
    openGraph: {
      title: `${project.name} | Caso real de ${siteConfig.name}`,
      description: project.shortDescription,
      url: project.caseHref,
      images: [
        {
          url: project.image,
          alt: project.imageAlt,
        },
      ],
      type: "article",
    },
  }
}

export default async function CasePage({ params }: CasePageProps) {
  const { slug } = await params
  const project = getCaseStudy(slug)

  if (!project) notFound()

  return (
    <>
      <Header />
      <ConstructionNotice />
      <main className="min-h-screen bg-background text-foreground">
        <section className="border-b border-border bg-card py-10">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <Button asChild variant="ghost" size="sm" className="-ml-3">
              <Link href="/casos">
                <ArrowLeft className="h-4 w-4" />
                Volver a casos
              </Link>
            </Button>

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

        {project.gallery.length > 0 && (
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

              <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {project.gallery.map((image) => (
                  <article
                    key={image.src}
                    className="overflow-hidden rounded-2xl border border-border bg-card"
                  >
                    <div className="relative aspect-[16/10] bg-secondary">
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                        className="object-contain"
                      />
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-semibold tracking-tight">
                        {image.title}
                      </h3>
                      <p className="mt-2 text-base leading-relaxed text-muted-foreground">
                        {image.description}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

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
      </main>
      <Footer />
    </>
  )
}
