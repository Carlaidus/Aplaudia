import { siteConfig } from "@/content/site"

const organization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${siteConfig.url}/#organization`,
  name: siteConfig.name,
  url: siteConfig.url,
  description: siteConfig.description,
  areaServed: "España",
  inLanguage: siteConfig.language,
  knowsAbout: siteConfig.keywords,
}

const website = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteConfig.url}/#website`,
  name: siteConfig.name,
  url: siteConfig.url,
  inLanguage: siteConfig.language,
  publisher: {
    "@id": `${siteConfig.url}/#organization`,
  },
}

const services = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "@id": `${siteConfig.url}/#services`,
  name: "Servicios digitales de Aplaudia",
  itemListElement: siteConfig.services.map((service, index) => ({
    "@type": "ListItem",
    position: index + 1,
    item: {
      "@type": "Service",
      name: service.name,
      description: service.description,
      url: `${siteConfig.url}/servicios/${service.slug}`,
      provider: {
        "@id": `${siteConfig.url}/#organization`,
      },
      areaServed: "España",
    },
  })),
}

const structuredData = [organization, website, services]

export function StructuredData() {
  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}
