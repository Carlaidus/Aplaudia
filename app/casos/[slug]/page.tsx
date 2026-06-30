import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { CaseTemplate } from "@/components/cases/case-template"
import { siteConfig } from "@/content/site"
import { caseStudies, getCaseStudy } from "@/lib/cases"

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

  return <CaseTemplate project={project} />
}
