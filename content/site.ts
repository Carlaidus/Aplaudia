import { futureRoutes } from "./routes"
import { services } from "./services"

export const siteConfig = {
  name: "Aplaudia",
  legalName: "Aplaudia",
  officialDomain: "aplaudia.com",
  canonicalUrl: "https://aplaudia.com",
  productionUrl: "https://aplaudia.com",
  railwayUrl: "https://aplaudia-production.up.railway.app",
  primaryLanguage: "es-ES",
  locale: "es_ES",
  businessCategory: "Estudio digital",
  description:
    "Estudio digital boutique para crear páginas web premium, agentes IA para WhatsApp y visuales mejorados con IA.",
  audience:
    "Negocios pequeños, profesionales independientes y marcas que quieren mejorar su presencia digital sin montar un equipo técnico interno.",
  contactCta:
    "Enviar el formulario interno de contacto o escribir por WhatsApp.",
  contact: {
    email: "carlosvfx@gmail.com",
    whatsappNumber: "659304487",
    whatsappInternational: "34659304487",
    whatsappHref:
      "https://wa.me/34659304487?text=Hola%2C%20he%20visto%20la%20web%20de%20Aplaudia%20y%20me%20gustar%C3%ADa%20hablar%20sobre%20un%20proyecto%20web%20o%20digital.",
  },
  seo: {
    title: "Aplaudia | Estudio digital para negocios",
    description:
      "Creamos páginas web premium, agentes IA para WhatsApp y visuales mejorados con IA para negocios que quieren destacar y vender mejor online.",
    keywords: [
      "diseño web",
      "páginas web premium",
      "agentes IA WhatsApp",
      "automatización WhatsApp",
      "visuales con IA",
      "presencia digital",
      "negocios pequeños",
      "Barcelona",
      "España",
    ],
  },
  constructionNotice: {
    dateLabel: "29 junio 2026",
    status: "En construcción",
    title: "Aplaudia está en construcción",
    body:
      "Estamos terminando la web oficial de Aplaudia. La activaremos en breve con contenido, casos y contacto revisados.",
    detail: "Dominio oficial conectado · Producción en revisión",
  },
  services,
  futureRoutes,
} as const

export type SiteConfig = typeof siteConfig
