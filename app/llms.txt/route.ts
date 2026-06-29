import { siteConfig } from "@/content/site"

export function GET() {
  const services = siteConfig.services
    .map((service) => `- ${service.name}: ${service.description}`)
    .join("\n")

  const body = [
    `# ${siteConfig.name}`,
    "",
    siteConfig.description,
    "",
    `Dominio oficial: ${siteConfig.canonicalUrl}`,
    "",
    `Idioma principal: español de España (${siteConfig.primaryLanguage}).`,
    "",
    "Público objetivo:",
    "",
    siteConfig.audience,
    "",
    "Servicios principales:",
    "",
    services,
    "",
    "Estado actual:",
    "",
    "La web mantiene visible el aviso de construcción hasta que Carlos valide el lanzamiento.",
    "",
    "Contacto:",
    "",
    siteConfig.contactCta,
  ].join("\n")

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  })
}
