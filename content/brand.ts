import { siteConfig } from "./site"
export { futureRoutes } from "./routes"

export const brand = {
  name: siteConfig.name,
  legalName: siteConfig.legalName,
  officialDomain: siteConfig.officialDomain,
  canonicalUrl: siteConfig.canonicalUrl,
  productionUrl: siteConfig.productionUrl,
  railwayUrl: siteConfig.railwayUrl,
  primaryLanguage: siteConfig.primaryLanguage,
  locale: siteConfig.locale,
  description: siteConfig.description,
  businessCategory: siteConfig.businessCategory,
  audience: siteConfig.audience,
  contactCta: siteConfig.contactCta,
  email: siteConfig.contact.email,
  whatsappHref: siteConfig.contact.whatsappHref,
} as const
