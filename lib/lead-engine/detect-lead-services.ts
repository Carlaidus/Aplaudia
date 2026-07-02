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

export function hasPetClinicContext(normalized: string) {
  return /\b(mascotas?|vacunas?|veterinaria|veterinario|clinica veterinaria|animales)\b/.test(normalized)
}

export function hasMunicipalInstitutionalContext(normalized: string) {
  return /\b(ayuntamientos?|municipal|municipio|administracion publica|administracion|institucional|ciudadania|vecinos|tramites?|instancias?|documentacion municipal|fiestas? del pueblo|agenda municipal|servicios municipales|sede electronica|varios ayuntamientos|otros pueblos|red de municipios|red municipal|base de datos entre pueblos|pueblo de al lado)\b/.test(
    normalized,
  )
}

export function hasPriceTooLowConcern(normalized: string) {
  return /\b(me parece muy barato|eso es muy barato|demasiado barato|muy poco para todo|para todo lo que hay que hacer es poco|me parece poco presupuesto|eso no cubre el alcance|puede quedarse corto|se queda corto)\b/.test(
    normalized,
  )
}

export function hasCheapSeekingContext(normalized: string) {
  if (hasPriceTooLowConcern(normalized)) return false

  return /\b(lo mas barato|algo barato|opcion barata|economico|economica|muy sencillito|presupuesto ajustado|minimo posible|no quiero gastar mucho|quiero gastar poco|poco presupuesto|lo minimo)\b/.test(
    normalized,
  )
}

export function hasHighComplexityContext(normalized: string) {
  return (
    hasMunicipalInstitutionalContext(normalized) ||
    /\b(documentacion amplia|muchas secciones|panel de control amplio|cms propio|wordpress personalizado|tipo wordpress personalizado|chatbot con base de datos|chatbot[\s\S]{0,80}base de datos|ia que consulta|cruza datos|automatizacion de instagram|automatizacion de redes|base de datos multi[-\s]?pueblo|varios ayuntamientos|tramites?|instancias?|formularios automaticos|gestion documental|permisos de usuarios|proyecto escalable|red de municipios|proyecto ambicioso|web entera|muchas cosas|plataforma a medida)\b/.test(
      normalized,
    )
  )
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

  if (hasMunicipalInstitutionalContext(normalized) || hasMunicipalInstitutionalContext(normalizedLead)) {
    return "municipalInstitutional"
  }
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

  if (hasMunicipalInstitutionalContext(normalizedLead)) return "municipalInstitutional"
  if (/restaurante|bar|cafeteria/.test(normalizedLead) && hasRestaurantType(normalized)) return "restaurant"
  if (/catalogo|comercio|tienda/.test(normalizedLead)) return "catalog"
  if (/web|landing|pagina/.test(normalizedLead)) return "generalWeb"

  return "undefined"
}

export function detectLeadServiceIds(clientOnlyText: string): LeadServiceId[] {
  const normalized = normalizeSource(clientOnlyText)
  const services: LeadServiceId[] = []
  const projectKind = inferLeadProjectKind(clientOnlyText)

  if (projectKind === "municipalInstitutional") services.push("institutionalWeb")
  if (
    projectKind !== "municipalInstitutional" &&
    (projectKind === "personal" ||
      projectKind === "landing" ||
      projectKind === "generalWeb" ||
      /\b(web|pagina|landing)\b/.test(normalized))
  ) {
    services.push("web")
  }
  if (projectKind === "petClinicTool" || projectKind === "webApp") services.push("webApp")
  if (/\b(panel|dashboard|zona interna|area privada|área privada|interno|cms|wordpress|control)\b/.test(normalized)) {
    services.push("panel")
  }
  if (/\b(reserva|reservas|reservar|sistema de reservas)\b/.test(normalized)) services.push("reservations")
  if (/\b(catalogo|productos?|fichas?|tienda|ecommerce|e-commerce|comercio online|venta online)\b/.test(normalized)) {
    services.push("catalog")
  }
  if (
    projectKind !== "municipalInstitutional" &&
    /\b(control|registro|gestion|datos|base de datos|fichas?|vacunas?|mascotas?)\b/.test(normalized)
  ) {
    services.push("data")
  }
  if (/\b(base de datos|bases de datos|datos entre pueblos|red de datos)\b/.test(normalized)) services.push("database")
  if (/\b(usuarios?|accesos?|permisos?|roles?)\b/.test(normalized)) services.push("users")
  if (/\b(avisos?|recordatorios?|notificaciones?)\b/.test(normalized)) services.push("reminders")
  if (/\b(agente|chatbot|asistente)\b/.test(normalized)) services.push("agentWeb")
  if (/\b(whatsapp|asistente para whatsapp|automatizacion de whatsapp)\b/.test(normalized)) services.push("whatsapp")
  if (projectKind === "municipalInstitutional" || /\b(documentacion|documentos|gestion documental|documentacion municipal)\b/.test(normalized)) {
    services.push("documents")
  }
  if (/\b(agenda|eventos?|fiestas?|calendario)\b/.test(normalized)) services.push("events")
  if (
    /\b(automatizacion|automaticamente|automatizar|ia que|cruza datos|analice|generar posts?|publicaciones?)\b/.test(
      normalized,
    ) ||
    (projectKind === "municipalInstitutional" && /\b(instagram|carteles?|ia|posts?|publicaciones?)\b/.test(normalized))
  ) {
    services.push("automation")
  }
  if (/\b(instagram|redes sociales|publicaciones?|posts?)\b/.test(normalized)) services.push("socialPublishing")
  if (/\b(instancias?|tramites?|formularios?)\b/.test(normalized)) services.push("forms")
  if (/\b(varios ayuntamientos|otros pueblos|pueblo de al lado|red de municipios|multi[-\s]?municipio|base de datos entre pueblos)\b/.test(normalized)) {
    services.push("multiMunicipality")
  }
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
  if (/\b(web municipal actual|web oficial|web actual|visita la web)\b/.test(normalized)) {
    materials.push("Web municipal actual como referencia")
  }
  if (/\b(carteles?|cartel)\b/.test(normalized)) materials.push("Carteles de fiestas como entrada visual")
  if (/\b(documentacion|documentos|contenido actual|web entera|informacion necesaria)\b/.test(normalized)) {
    materials.push("Documentacion existente")
  }

  return materials.length > 0 ? unique(materials) : ["No indicado"]
}
