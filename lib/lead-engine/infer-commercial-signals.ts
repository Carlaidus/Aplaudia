import { normalizeSource } from "./extract-lead-data"
import type { LeadCommercialSignals, LeadProjectKind } from "./lead-types"

export function detectQuestions(projectContextText: string) {
  const normalized = normalizeSource(projectContextText)
  const questions: string[] = []

  if (/\b(precio|precios|coste|presupuesto|cuanto cuesta|desde cuanto|barato|barata)\b/.test(normalized)) {
    questions.push("Quiere saber precios.")
  }
  if (/\b(tiempos? de entrega|plazos?|cuanto tarda|cuando estaria|entrega)\b/.test(normalized)) {
    questions.push("Quiere saber tiempos de entrega.")
  }
  if (/\b(no se a que te refieres|que es panel interno|panel interno no se|no se que es.*panel)\b/.test(normalized)) {
    questions.push("No tenia claro que significa panel interno.")
  }
  if (/\b(pantallas?|secciones?)\b/.test(normalized)) {
    questions.push("Quiere orientacion sobre pantallas o secciones.")
  }
  if (/\b(fase|fases|ampliar|ampliando|depende de exito|crecer|escala)\b/.test(normalized)) {
    questions.push("Quiere saber como empezar por fases.")
  }
  if (/\b(barato|barata|economico|economica|lo mas barato|minimo)\b/.test(normalized)) {
    questions.push("Quiere la opcion mas barata posible.")
  }
  if (/\b(no tengo fotos|no tengo web|no tengo carta|no tengo textos|sin fotos|sin web|sin carta)\b/.test(normalized)) {
    questions.push("No tiene materiales preparados.")
  }

  return questions.length > 0 ? questions : ["No plantea dudas concretas; pide orientacion general."]
}

export function inferCommercialSignals(args: {
  projectContextText: string
  projectKind: LeadProjectKind
  requestedServices: string[]
}): LeadCommercialSignals {
  const normalized = normalizeSource(args.projectContextText)
  const signals: LeadCommercialSignals = {
    nextAction: buildNextAction(args.projectKind, normalized),
  }

  if (/\b(urgente|cuanto antes|prisa|esta semana|hoy|manana|rapido|lo antes posible)\b/.test(normalized)) {
    signals.urgency = "Urgencia alta."
  } else if (/\b(tiempos? de entrega|plazos?|cuanto tarda|entrega)\b/.test(normalized)) {
    signals.timeline = "Pregunta por plazos, sin urgencia concreta."
  }

  if (/\b(caro|cara|poco presupuesto|barato|barata|economico|economica|ajustar|lo mas barato|no superar|maximo|limite|minimo)\b/.test(normalized)) {
    signals.priceSensitivity = "Sensibilidad al precio alta."
  } else if (/\b(precio|coste|presupuesto|tarifa|mensualidad|desde cuanto)\b/.test(normalized)) {
    signals.priceSensitivity = "Sensibilidad al precio media."
  }

  if (/\b(me estas hablando demasiado|ya te lo he dicho|no se por que preguntas|bloqueado|raro|no funciona|no entiendo)\b/.test(
    normalized,
  )) {
    signals.friction = "Friccion real: conviene responder breve y directo."
  }

  if (args.projectKind !== "undefined" && args.requestedServices.length >= 2) {
    signals.clarity = "Claridad alta: negocio, servicio u objetivo bastante definidos."
  } else if (args.requestedServices.length > 0 || /\b(quiero|necesito|busco|gustaria)\b/.test(normalized)) {
    signals.clarity = "Claridad media: hay objetivo, pero falta acotar alcance."
  } else {
    signals.clarity = "Claridad baja: esta explorando."
  }

  return signals
}

function buildNextAction(projectKind: LeadProjectKind, normalized: string) {
  if (projectKind === "petClinicTool") {
    return "Responder con una propuesta por fases: fase 1 con usuarios, fichas de mascotas, vacunas y avisos basicos; despues valorar panel mas completo, filtros y automatizaciones. Dar horquilla de precio y pedir solo confirmacion de alcance minimo."
  }

  if (projectKind === "personal" || /\b(lo mas barato|barato|barata|economico|economica|minimo)\b/.test(normalized)) {
    return "Responder con una opcion basica desde 390 €, muy acotada, y pedir solo textos/fotos si quiere avanzar. Evitar pedir demasiados datos de inicio."
  }

  if (projectKind === "restaurant") {
    return "Responder con una primera propuesta para web con reservas y estructura minima. Pedir solo si la carta sera simple o editable y si quiere empezar sin materiales propios."
  }

  return "Responder con orientacion comercial breve y pedir solo los datos imprescindibles para acotar una primera fase."
}
