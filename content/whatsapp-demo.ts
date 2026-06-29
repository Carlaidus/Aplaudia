export type WhatsAppConversationMessage = {
  id: number
  type: "incoming" | "outgoing"
  text: string
  time: string
  status?: "sent" | "read"
}

export const whatsappConversationMessages = [
  {
    id: 1,
    type: "incoming",
    text: "¡Hola! Quería saber si tenéis disponibilidad para el sábado por la noche",
    time: "10:32",
  },
  {
    id: 2,
    type: "outgoing",
    text: "¡Hola! Gracias por escribirnos. Sí, tenemos disponibilidad el sábado. ¿Para cuántas personas sería la reserva?",
    time: "10:32",
    status: "read",
  },
  {
    id: 3,
    type: "incoming",
    text: "Somos 4 personas. ¿Tenéis alguna mesa con vistas?",
    time: "10:33",
  },
  {
    id: 4,
    type: "outgoing",
    text: "Perfecto, tenemos una mesa disponible con vistas al jardín para 4 personas a las 20:00 o 21:30. ¿Qué horario preferís?",
    time: "10:33",
    status: "read",
  },
] as const satisfies readonly WhatsAppConversationMessage[]

export const whatsappSuggestedPrompts = [
  "¿Cuál es el horario?",
  "¿Qué servicios ofrecéis?",
  "Quiero reservar",
] as const
