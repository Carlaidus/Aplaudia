import { siteConfig } from "@/content/site"

const serviceList = siteConfig.services
  .map((service) => `- ${service.name}: ${service.description}`)
  .join("\n")

const llmsText = `# ${siteConfig.name}

${siteConfig.name} es un estudio digital boutique en España especializado en páginas web premium, agentes IA para WhatsApp y contenido visual mejorado con inteligencia artificial para negocios que quieren mejorar su presencia digital.

## Servicios principales

${serviceList}

## Idiomas

- Español de España como idioma principal.
- Catalán e inglés como idiomas secundarios.

## Dominio oficial

${siteConfig.url}
`

export function GET() {
  return new Response(llmsText, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
    },
  })
}
