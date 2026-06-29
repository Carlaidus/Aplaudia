import { siteConfig } from "./site"

export const siteSeo = siteConfig.seo

const serviceListItems = siteConfig.services.map((service, index) => ({
  "@type": "ListItem",
  position: index + 1,
  name: service.name,
  url: `${siteConfig.canonicalUrl}/${service.landingAnchor}`,
}))

const serviceNodes = siteConfig.services.map((service) => ({
  "@type": "Service",
  "@id": `${siteConfig.canonicalUrl}/#service-${service.id}`,
  name: service.name,
  description: service.description,
  serviceType: service.serviceType,
  provider: {
    "@id": `${siteConfig.canonicalUrl}/#organization`,
  },
  availableLanguage: [siteConfig.primaryLanguage],
  url: `${siteConfig.canonicalUrl}/${service.landingAnchor}`,
}))

export const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteConfig.canonicalUrl}/#organization`,
      name: siteConfig.name,
      legalName: siteConfig.legalName,
      url: siteConfig.canonicalUrl,
      description: siteConfig.description,
      knowsAbout: siteConfig.services.map((service) => service.name),
    },
    {
      "@type": "WebSite",
      "@id": `${siteConfig.canonicalUrl}/#website`,
      name: siteConfig.name,
      url: siteConfig.canonicalUrl,
      inLanguage: siteConfig.primaryLanguage,
      description: siteSeo.description,
      publisher: {
        "@id": `${siteConfig.canonicalUrl}/#organization`,
      },
    },
    ...serviceNodes,
    {
      "@type": "ItemList",
      "@id": `${siteConfig.canonicalUrl}/#services`,
      name: "Servicios de Aplaudia",
      itemListElement: serviceListItems,
    },
  ],
} as const
