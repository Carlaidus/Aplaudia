import { normalizeSource } from "./extract-lead-data"
import type { LeadEngineConfig, LeadProjectKind, LeadServiceId } from "./lead-types"

function unique<T>(items: T[]) {
  return Array.from(new Set(items))
}

function hasHostelryContext(normalized: string) {
  return /\b(restaurantes?|bar|bares|cafeteria|cafeterias|hosteleria|menu|menus|reservas?)\b/.test(normalized)
}

function hasRestaurantType(normalized: string) {
  if (/\brestaurantes?\b/.test(normalized)) return true
  if (/\bbar\b|\bbares\b/.test(normalized)) return true
  if (/\bcafeteria\b|\bcafeterias\b/.test(normalized)) return true
  if (/\bcafe\b/.test(normalized) && /\b(negocio|local|hosteleria|bar|restaurante|cafeteria)\b/.test(normalized)) {
    return true
  }

  return /\bcarta\b/.test(normalized) && hasHostelryContext(normalized)
}

function hasPersonalPage(normalized: string) {
  return /\b(pagina personal|web personal|portfolio personal|landing personal|pagina pequena personal|pagina pequena y personal)\b/.test(
    normalized,
  )
}

function hasWebAppContext(normalized: string) {
  return (
    /\b(panel|interno|herramienta|control|registro|gestion|datos|usuarios?|permisos?|dashboard|vacunas?|mascotas?|avisos?|recordatorios?)\b/.test(
      normalized,
    ) && /\b(web|pagina|herramienta|panel|app|aplicacion|control|registro|gestion)\b/.test(normalized)
  )
}

function hasPetClinicContext(normalized: string) {
  return /\b(mascotas?|vacunas?|clinica|veterinaria|veterinario|uso interno)\b/.test(normalized)
}

function asksVisualCreation(normalized: string) {
  const action = "(hacer|crear|generar|mejorar|editar|retocar|preparar|producir|disenar|diseñar)"
  const object = "(imagenes?|fotos?|visuales?|creatividades?|graficas?|banners?|video|videos|reels?|audiovisual)"
  const actionBeforeObject = new RegExp(`\\b${action}\\b([\\s\\S]{0,60})\\b${object}\\b`, "g")
  const objectBeforeAction = new RegExp(`\\b${object}\\b([\\s\\S]{0,60})\\b${action}\\b`)

  for (const match of normalized.matchAll(actionBeforeObject)) {
    const bridge = match[2] ?? ""

    if (!/\b(no tengo|no tiene|no tenemos|sin|falta|faltan|reservas?)\b/.test(bridge)) return true
  }

  return objectBeforeAction.test(normalized)
}

export function inferLeadProjectKind(clientOnlyText: string, leadProjectType = ""): LeadProjectKind {
  const normalized = normalizeSource(clientOnlyText)
  const normalizedLead = normalizeSource(leadProjectType)

  if (hasPersonalPage(normalized)) return "personal"
  if (/\b(landing sencilla|web sencilla|pagina sencilla)\b/.test(normalized)) return "landing"
  if (hasPetClinicContext(normalized) && hasWebAppContext(normalized)) return "petClinicTool"
  if (hasRestaurantType(normalized)) return "restaurant"
  if (hasWebAppContext(normalized)) return "webApp"
  if (/\b(catalogo|productos?|fichas?|tienda|ecommerce|e-commerce|comercio online|venta online)\b/.test(normalized)) {
    return "catalog"
  }
  if (asksVisualCreation(normalized)) return "visual"
  if (/\b(web|pagina|landing|sitio|presencia digital)\b/.test(normalized)) return "generalWeb"

  if (/restaurante|bar|cafeteria/.test(normalizedLead) && hasRestaurantType(normalized)) return "restaurant"
  if (/catalogo|comercio|tienda/.test(normalizedLead)) return "catalog"
  if (/web|landing|pagina/.test(normalizedLead)) return "generalWeb"

  return "undefined"
}

export function detectLeadServiceIds(clientOnlyText: string): LeadServiceId[] {
  const normalized = normalizeSource(clientOnlyText)
  const services: LeadServiceId[] = []
  const projectKind = inferLeadProjectKind(clientOnlyText)

  if (projectKind === "personal" || projectKind === "landing" || projectKind === "generalWeb" || /\b(web|pagina|landing)\b/.test(normalized)) {
    services.push("web")
  }
  if (projectKind === "petClinicTool" || projectKind === "webApp") services.push("webApp")
  if (/\b(panel|dashboard|zona interna|area privada|área privada|interno)\b/.test(normalized)) services.push("panel")
  if (/\b(reserva|reservas|reservar|sistema de reservas)\b/.test(normalized)) services.push("reservations")
  if (/\b(catalogo|productos?|fichas?|tienda|ecommerce|e-commerce|comercio online|venta online)\b/.test(normalized)) {
    services.push("catalog")
  }
  if (/\b(control|registro|gestion|datos|fichas?|vacunas?|mascotas?)\b/.test(normalized)) services.push("data")
  if (/\b(usuarios?|accesos?|permisos?|roles?)\b/.test(normalized)) services.push("users")
  if (/\b(avisos?|recordatorios?|notificaciones?)\b/.test(normalized)) services.push("reminders")
  if (/\b(agente|chatbot|whatsapp|asistente para whatsapp|automatizacion de whatsapp)\b/.test(normalized)) services.push("agent")
  if (asksVisualCreation(normalized)) services.push("visuals")
  if (/\b(mantenimiento|soporte|cambios mensuales|actualizacion continua|actualizaciones continuas|mantenimiento mensual)\b/.test(normalized)) {
    services.push("maintenance")
  }
  if (/\b(seo|posicionamiento|buscadores)\b/.test(normalized)) services.push("seo")

  return unique(services)
}

export function detectLeadServices(clientOnlyText: string, config: LeadEngineConfig) {
  const ids = detectLeadServiceIds(clientOnlyText)

  return ids.length > 0 ? ids.map((id) => config.labels.services[id]) : [config.labels.fallbackService]
}

export function getLeadProjectType(clientOnlyText: string, config: LeadEngineConfig, leadProjectType = "") {
  const kind = inferLeadProjectKind(clientOnlyText, leadProjectType)

  return {
    kind,
    label: kind === "undefined" ? config.labels.fallbackProjectType : config.labels.projectTypes[kind],
  }
}

export function detectMaterials(clientOnlyText: string) {
  const normalized = normalizeSource(clientOnlyText)
  const materials: string[] = []

  if (/\b(no tengo|no tiene|no tenemos|sin|falta(?:n)?)\b[\s\S]{0,40}\bfotos?\b/.test(normalized)) {
    materials.push("No tiene fotos")
  }
  if (/\b(no tengo|no tiene|no tenemos|sin|falta(?:n)?)\b[\s\S]{0,40}\bcarta\b/.test(normalized)) {
    materials.push("No tiene carta")
  }
  if (/\b(no tengo|no tiene|no tenemos|sin|falta(?:n)?)\b[\s\S]{0,40}\bweb\b/.test(normalized)) {
    materials.push("No tiene web")
  }
  if (/\b(no tengo|no tiene|no tenemos|sin|falta(?:n)?)\b[\s\S]{0,40}\b(textos?|copy|contenido)\b/.test(normalized)) {
    materials.push("No tiene textos")
  }
  if (/\b(tengo|tenemos|tiene)\b[\s\S]{0,40}\blogo\b/.test(normalized)) materials.push("Tiene logo")
  if (/\b(tengo|tenemos|tiene)\b[\s\S]{0,40}\bproductos?\b/.test(normalized)) materials.push("Tiene productos")

  return materials.length > 0 ? unique(materials) : ["No indicado"]
}
