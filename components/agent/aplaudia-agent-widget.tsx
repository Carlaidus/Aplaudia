"use client"

import { GenericAgentWidget } from "@/components/agent/generic-agent-widget"

export function AplaudiaAgentWidget() {
  return (
    <GenericAgentWidget
      config={{
        apiEndpoint: "/api/agent",
        assistantSubtitle: "Orientación rápida - sin datos sensibles",
        assistantTitle: "Asistente Aplaudia",
        brandName: "Aplaudia",
        connectionErrorReply:
          "No he podido conectar con el asistente. La web sigue funcionando; puedes escribir desde la sección de contacto.",
        dialogLabel: "Asistente Aplaudia",
        fallbackReply:
          "No he podido responder ahora mismo. Escríbenos desde contacto y lo vemos con calma.",
        floatingButtonLabel: "Abrir asistente de Aplaudia",
        floatingButtonText: "¿Dudas?",
        inputMaxLength: 500,
        leadRequest: {
          apiEndpoint: "/api/agent/quote",
          enabled: true,
        },
        listeningPlaceholder: "Escuchando...",
        placeholder: "Cuéntame qué necesitas...",
        sessionStorageKey: "aplaudia_agent_session",
        theme: {
          floatingSparkle: "text-accent-cyan",
          micActive:
            "border-accent-magenta/60 bg-accent-magenta/15 text-accent-magenta shadow-lg shadow-accent-magenta/20",
          micPing: "bg-accent-magenta/20",
          onlineDot: "bg-accent-cyan",
          unreadBadge: "bg-accent-magenta",
          voiceStatusActive: "text-accent-magenta",
        },
        unavailableVoiceMessage: "El dictado por voz no está disponible en este navegador.",
        voiceLanguage: "es-ES",
        welcomeMessage:
          "Hola, soy el asistente de Aplaudia. Puedo orientarte sobre webs, agentes para WhatsApp, visuales, mantenimiento y presencia digital. ¿Qué tienes en mente?",
      }}
    />
  )
}
