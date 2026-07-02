import type { LeadEngineConfig } from "@/lib/lead-engine/lead-types"

export const aplaudiaLeadConfig = {
  brandName: "Aplaudia",
  channelLabel: "Chatbot web Aplaudia",
  consentText:
    "Para enviarlo, necesito que aceptes que Aplaudia trate los datos que has facilitado y el resumen de tu solicitud solo para gestionar esta consulta y responderte por email. No se guardarán en una base de datos. Los importes comentados son orientativos y sin IVA. ¿Aceptas?",
  internalRecipientEnv: "AGENT_QUOTE_RECIPIENT_EMAIL",
  labels: {
    fallbackProjectType: "Por definir",
    fallbackService: "Por definir",
    projectTypes: {
      catalog: "Catálogo / fichas",
      generalWeb: "Web o presencia digital",
      landing: "Landing / web sencilla",
      personal: "Página personal / web sencilla",
      petClinicTool: "Web-app / herramienta interna para clínica o gestión de mascotas",
      restaurant: "Restaurante / bar / cafetería",
      undefined: "Por definir",
      visual: "Proyecto visual",
      webApp: "Web-app / herramienta interna",
    },
    services: {
      agent: "Agente IA / WhatsApp",
      catalog: "Catálogo / fichas",
      data: "Gestión de datos",
      maintenance: "Mantenimiento",
      panel: "Panel interno",
      reminders: "Avisos / recordatorios",
      reservations: "Reservas",
      seo: "SEO",
      users: "Usuarios / permisos",
      visuals: "Visuales / imagen / vídeo",
      web: "Web / landing",
      webApp: "Web-app / herramienta interna",
    },
  },
  priceReferences: [
    {
      lines: [
        "Página personal sencilla: desde 390 €",
      ],
      projectKinds: ["personal", "landing"],
      sensitivity: "high",
    },
    {
      lines: [
        "Landing o web muy sencilla: desde 390 €",
      ],
      projectKinds: ["landing", "generalWeb"],
      sensitivity: "medium",
    },
    {
      lines: [
        "Proyecto sencillo con acceso privado, fichas de mascotas y vacunas: desde 1.500 €",
        "Con avisos, varios usuarios y panel interno más completo: desde 2.300 €",
        "Si luego crece con más funciones, permisos o automatizaciones: a medida",
      ],
      projectKinds: ["petClinicTool"],
    },
  ],
  publicEmail: "hola@aplaudia.com",
  sendClientCopyAutomatically: false,
} satisfies LeadEngineConfig
