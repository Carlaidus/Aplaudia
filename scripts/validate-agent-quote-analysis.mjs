import fs from "node:fs"
import path from "node:path"
import vm from "node:vm"
import { createRequire } from "node:module"
import { fileURLToPath } from "node:url"
import ts from "typescript"

const nativeRequire = createRequire(import.meta.url)
const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const moduleCache = new Map()

function resolveTsModule(specifier, parentDir) {
  if (!specifier.startsWith(".") && !specifier.startsWith("@/")) return null

  const base = specifier.startsWith("@/")
    ? path.resolve(rootDir, specifier.slice(2))
    : path.resolve(parentDir, specifier)
  const candidates = [base, `${base}.ts`, `${base}.tsx`, path.join(base, "index.ts")]
  const found = candidates.find((candidate) => fs.existsSync(candidate))

  if (!found) throw new Error(`No se ha podido resolver ${specifier} desde ${parentDir}`)

  return found
}

function loadTsModule(filePath) {
  const fullPath = path.resolve(filePath)
  const cached = moduleCache.get(fullPath)
  if (cached) return cached.exports

  const source = fs.readFileSync(fullPath, "utf8")
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      esModuleInterop: true,
      jsx: ts.JsxEmit.ReactJSX,
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
    fileName: fullPath,
  })
  const module = { exports: {} }
  const dirname = path.dirname(fullPath)
  moduleCache.set(fullPath, module)

  const localRequire = (specifier) => {
    const resolved = resolveTsModule(specifier, dirname)

    return resolved ? loadTsModule(resolved) : nativeRequire(specifier)
  }

  vm.runInNewContext(
    outputText,
    {
      __dirname: dirname,
      __filename: fullPath,
      console,
      exports: module.exports,
      module,
      process,
      require: localRequire,
    },
    { filename: fullPath },
  )

  return module.exports
}

const {
  buildInternalLeadEmail,
  buildLeadSummary,
  createLeadDraft,
  markOptionalContactAsked,
  shouldAskOptionalContact,
  shouldHandleLeadMessage,
  shouldSendLead,
  updateLeadDraftFromMessage,
} = loadTsModule(path.join(rootDir, "lib/lead-engine/index.ts"))
const { aplaudiaLeadConfig } = loadTsModule(path.join(rootDir, "content/lead/aplaudia-lead-config.ts"))

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

function assertIncludes(items, expected, label) {
  assert(items.includes(expected), `${label}: falta ${expected}. Recibido: ${items.join(" | ")}`)
}

function assertExcludes(value, patterns, label) {
  for (const pattern of patterns) {
    assert(!pattern.test(value), `${label}: falso positivo ${pattern} en "${value}"`)
  }
}

function analyze({ budget = "", email = "carlosvfx@yahoo.es", history, interest = "", name = "", phone = "", projectType = "" }) {
  return buildLeadSummary({
    budget,
    config: aplaudiaLeadConfig,
    email,
    history,
    interest,
    name,
    phone,
    projectType,
  })
}

function runDraftFlow(messages) {
  let draft = createLeadDraft()
  const history = []

  for (const message of messages) {
    if (message.role === "user") {
      draft = updateLeadDraftFromMessage(draft, message.content, history)
    }
    history.push(message)
  }

  return { draft, history }
}

const mascotasHistory = [
  {
    role: "user",
    content:
      "hola muy buenas me gustaría saber si hacéis páginas web para yo que sé el control de vacunas de mascotas y cosas así y saber precios y tiempos de entrega",
  },
  {
    role: "assistant",
    content:
      "Podría plantearse por fases. Proyecto sencillo con acceso privado, fichas de mascotas y vacunas: desde 1.500 €. Con avisos, varios usuarios y panel interno más completo: desde 2.300 €. Si luego crece con más funciones, permisos o automatizaciones: a medida. Si quieres, puedo enviar un resumen a una persona de Aplaudia.",
  },
  {
    role: "user",
    content:
      "bueno las pantallas de secciones quiero que me digáis vosotros un poco que que hay en panel interno no sé a qué te refieres y sí el registro de Mascotas vacunas avisos todo eso que dices está muy guay y en principio sí sería para accesos a varios usuarios es para una clínica personal y también uso interno mascotas no lo sé si irán ampliando depende de éxito que tengamos",
  },
  { role: "user", content: "vale" },
  { role: "user", content: "si dime" },
  { role: "user", content: "vale hazlo" },
  { role: "assistant", content: aplaudiaLeadConfig.consentText },
  { role: "user", content: "acepto" },
  { role: "user", content: "carlosvfx@yahoo.es" },
  { role: "user", content: "carlos" },
  { role: "user", content: "envialo" },
]
const mascotasFlow = runDraftFlow(mascotasHistory)
const mascotas = analyze({
  history: mascotasHistory,
  name: mascotasFlow.draft.name || "carlos",
})

assert(mascotas.contact.name.toLowerCase() === "carlos", `Mascotas nombre incorrecto: ${mascotas.contact.name}`)
assert(mascotas.contact.email === "carlosvfx@yahoo.es", `Mascotas email incorrecto: ${mascotas.contact.email}`)
assert(
  mascotas.projectType === "Web-app / herramienta interna para clínica o gestión de mascotas",
  `Mascotas proyecto incorrecto: ${mascotas.projectType}`,
)
for (const service of [
  "Web-app / herramienta interna",
  "Panel interno",
  "Gestión de datos",
  "Usuarios / permisos",
  "Avisos / recordatorios",
]) {
  assertIncludes(mascotas.requestedServices, service, "Mascotas servicios")
}
for (const price of ["1.500", "2.300", "a medida"]) {
  assert(mascotas.priceLines.some((line) => line.includes(price)), `Mascotas precio ausente: ${price}`)
}
const mascotasUseful = mascotas.usefulClientPhrases.join(" | ").toLowerCase()
assertExcludes(mascotasUseful, [/acepto/, /env[ií]alo/, /carlosvfx@yahoo\.es/, /^carlos$/], "Mascotas frases útiles")
assert(
  mascotas.commercialSignals.timeline === "Pregunta por plazos, sin urgencia concreta.",
  `Mascotas plazos incorrectos: ${mascotas.commercialSignals.timeline}`,
)
assert(mascotas.commercialSignals.nextAction.includes("propuesta por fases"), "Mascotas próximo paso sin fases")

const personalMessages = [
  {
    role: "user",
    content:
      "quiero presupuesto para una página pequeña personal de lo más barato que tengas me llamo Carlos ya te pasó mi correo y nada no tengo fotos ni nada quiero que me pases un presupuesto de eso y muy sencillito todo lo más barato que tengas",
  },
  { role: "user", content: "si enviado por favor a carlosvfx@yahoo.es" },
  { role: "user", content: "acepto acepto" },
]
const personalFlow = runDraftFlow(personalMessages)
const personal = analyze({ history: personalMessages, name: personalFlow.draft.name, email: personalFlow.draft.email })
const personalCombined = [personal.projectType, personal.requestedServices.join(" | ")].join(" | ")

assert(personalFlow.draft.name === "Carlos", `Personal nombre esperado Carlos; recibido ${personalFlow.draft.name}`)
assert(personal.projectType === "Página personal / web sencilla", `Personal proyecto incorrecto: ${personal.projectType}`)
assert(
  personal.requestedServices.length === 1 && personal.requestedServices[0] === "Web / landing",
  `Personal servicios incorrectos: ${personal.requestedServices.join(" | ")}`,
)
assertIncludes(personal.materials, "No tiene fotos", "Personal materiales")
assert(personal.commercialSignals.priceSensitivity === "Sensibilidad al precio alta.", "Personal sensibilidad incorrecta")
assert(personal.priceLines.some((line) => line.includes("390")), `Personal precio 390 ausente: ${personal.priceLines}`)
assertExcludes(
  personalCombined,
  [/restaurante/i, /\bbar\b/i, /cafeter/i, /cat[aá]logo/i, /whatsapp/i, /agente/i, /visual/i, /v[ií]deo|video/i, /mantenimiento/i],
  "Personal falsos positivos",
)

const restaurantMessage =
  "necesito presupuesto urgente para una web de un restaurante para hacer reservas, no tengo web ni carta ni fotos, mi email es carlosvfx@yahoo.es, acepto"
const restaurantFlow = runDraftFlow([{ role: "user", content: restaurantMessage }])
const restaurant = analyze({
  history: [{ role: "user", content: restaurantMessage }],
  email: restaurantFlow.draft.email,
})
assert(restaurant.projectType === "Restaurante / bar / cafetería", `Restaurante proyecto incorrecto: ${restaurant.projectType}`)
assertIncludes(restaurant.requestedServices, "Web / landing", "Restaurante servicios")
assertIncludes(restaurant.requestedServices, "Reservas", "Restaurante servicios")
assert(restaurant.requestedServices.length === 2, `Restaurante servicios extra: ${restaurant.requestedServices.join(" | ")}`)
for (const material of ["No tiene web", "No tiene carta", "No tiene fotos"]) {
  assertIncludes(restaurant.materials, material, "Restaurante materiales")
}
assert(restaurant.commercialSignals.urgency === "Urgencia alta.", "Restaurante urgencia incorrecta")
assert(!restaurant.requestedServices.some((service) => /visual|imagen|v[ií]deo|video/i.test(service)), "Restaurante marcó visuales")
assert(shouldHandleLeadMessage(restaurantMessage, [], restaurantFlow.draft), "Restaurante debería manejar lead")
assert(shouldSendLead(restaurantMessage, restaurantFlow.draft), "Restaurante debería enviar sin pedir más datos")

const optionalPrompt = aplaudiaLeadConfig.leadOptionalContactPrompt
const optionalStart = "Quiero presupuesto para una web de restaurante con reservas. Mi email es carlosvfx@yahoo.es. Acepto."
let optionalDraft = updateLeadDraftFromMessage(createLeadDraft(), optionalStart, [])
assert(optionalDraft.email === "carlosvfx@yahoo.es", `Opcionales email incorrecto: ${optionalDraft.email}`)
assert(optionalDraft.consentAccepted, "Opcionales debería guardar consentimiento")
assert(shouldAskOptionalContact(optionalStart, optionalDraft, optionalPrompt), "Debe preguntar opcionales una vez")
markOptionalContactAsked(optionalDraft)
optionalDraft = updateLeadDraftFromMessage(optionalDraft, "Carlos 659304487", [{ role: "user", content: optionalStart }])
assert(optionalDraft.name === "Carlos", `Opcionales nombre incorrecto: ${optionalDraft.name}`)
assert(optionalDraft.phone === "659304487", `Opcionales teléfono incorrecto: ${optionalDraft.phone}`)
assert(!shouldAskOptionalContact("Carlos 659304487", optionalDraft, optionalPrompt), "No debe repetir opcionales tras responder")
assert(shouldSendLead("Carlos 659304487", optionalDraft), "Debe enviar tras capturar nombre y teléfono")

let commaOptionalDraft = updateLeadDraftFromMessage(createLeadDraft(), optionalStart, [])
markOptionalContactAsked(commaOptionalDraft)
commaOptionalDraft = updateLeadDraftFromMessage(commaOptionalDraft, "Carlos, 659304487", [
  { role: "user", content: optionalStart },
])
assert(commaOptionalDraft.name === "Carlos", `Opcionales con coma nombre incorrecto: ${commaOptionalDraft.name}`)
assert(commaOptionalDraft.phone === "659304487", `Opcionales con coma teléfono incorrecto: ${commaOptionalDraft.phone}`)

let noOptionalDraft = updateLeadDraftFromMessage(createLeadDraft(), "Quiero presupuesto para una web. Mi email es carlosvfx@yahoo.es. Acepto.", [])
assert(shouldAskOptionalContact("Quiero presupuesto para una web. Mi email es carlosvfx@yahoo.es. Acepto.", noOptionalDraft, optionalPrompt), "Debe preguntar opcionales si faltan")
markOptionalContactAsked(noOptionalDraft)
noOptionalDraft = updateLeadDraftFromMessage(noOptionalDraft, "envíalo", [
  { role: "user", content: "Quiero presupuesto para una web. Mi email es carlosvfx@yahoo.es. Acepto." },
])
assert(!noOptionalDraft.name, "No debe inventar nombre")
assert(!noOptionalDraft.phone, "No debe inventar teléfono")
assert(!shouldAskOptionalContact("envíalo", noOptionalDraft, optionalPrompt), "No debe insistir si el usuario pide enviar")
assert(shouldSendLead("envíalo", noOptionalDraft), "Debe enviar sin opcionales")

const impatientDraft = {
  ...createLeadDraft(),
  consentAccepted: true,
  email: "carlosvfx@yahoo.es",
  interest: "Quiero una web sencilla",
  isActive: true,
}
assert(
  !shouldAskOptionalContact("envíalo ya, no quiero dar más datos", impatientDraft, optionalPrompt),
  "Usuario impaciente no debe recibir prompt opcional",
)
assert(shouldSendLead("envíalo ya, no quiero dar más datos", impatientDraft), "Usuario impaciente debe enviar")

const consentOnlyDraft = {
  ...createLeadDraft(),
  consentAccepted: true,
  email: "carlosvfx@yahoo.es",
  hasAskedForConsent: true,
  interest: "Quiero una web sencilla",
  isActive: true,
}
assert(shouldAskOptionalContact("acepto", consentOnlyDraft, optionalPrompt), "Aceptar privacidad no debe saltarse opcionales")

const missingEmailDraft = {
  ...createLeadDraft(),
  consentAccepted: true,
  interest: "Quiero una web sencilla",
  isActive: true,
}
assert(!shouldAskOptionalContact("envíalo", missingEmailDraft, optionalPrompt), "Sin email no debe preguntar opcionales")
assert(!shouldSendLead("envíalo", missingEmailDraft), "Sin email no debe enviar")

const missingConsentDraft = {
  ...createLeadDraft(),
  email: "carlosvfx@yahoo.es",
  interest: "Quiero una web sencilla",
  isActive: true,
}
assert(!shouldAskOptionalContact("envíalo", missingConsentDraft, optionalPrompt), "Sin consentimiento no debe preguntar opcionales")
assert(!shouldSendLead("envíalo", missingConsentDraft), "Sin consentimiento no debe enviar")

const alreadyAskedDraft = {
  ...createLeadDraft(),
  consentAccepted: true,
  email: "carlosvfx@yahoo.es",
  hasAskedForOptionalContact: true,
  interest: "Quiero una web sencilla",
  isActive: true,
  optionalContactAskCount: 1,
}
assert(!shouldAskOptionalContact("sigo con la web", alreadyAskedDraft, optionalPrompt), "No debe repetir opcionales")

const onlyPrice = "Quiero precio de una landing."
const onlyPriceDraft = updateLeadDraftFromMessage(createLeadDraft(), onlyPrice, [])
assert(!shouldHandleLeadMessage(onlyPrice, [], onlyPriceDraft), "Solo precio no debe iniciar envío")
assert(!shouldSendLead(onlyPrice, onlyPriceDraft), "Solo precio no debe enviar")

const quickSendMessage = "Quiero presupuesto para una web. Mi email es carlosvfx@yahoo.es. Acepto."
const quickSendDraft = updateLeadDraftFromMessage(createLeadDraft(), quickSendMessage, [])
assert(quickSendDraft.email === "carlosvfx@yahoo.es", `Envío rápido email incorrecto: ${quickSendDraft.email}`)
assert(quickSendDraft.consentAccepted, "Envío rápido debería guardar consentimiento")
assert(shouldHandleLeadMessage(quickSendMessage, [], quickSendDraft), "Envío rápido debería activar lead")
assert(shouldSendLead(quickSendMessage, quickSendDraft), "Envío rápido debería enviar aunque no haya nombre")

const emailContent = buildInternalLeadEmail({
  analysis: personal,
  clientCopyRequested: false,
  config: aplaudiaLeadConfig,
  date: "02/07/2026, 12:00",
})
assert(!/transcript|ultimos mensajes|últimos mensajes/i.test(emailContent.html), "El email no debe incluir transcript")
assert(!/acepto acepto|envialo/i.test(emailContent.text), "El email no debe incluir trámites como frases útiles")
assert(emailContent.text.includes("sin copia automatica al cliente"), "El email debe documentar que no hay copia automática")
assert(emailContent.text.includes("Teléfono: No indicado"), "El email debe indicar teléfono no indicado si falta")

const phoneEmailContent = buildInternalLeadEmail({
  analysis: {
    ...personal,
    contact: {
      ...personal.contact,
      phone: "659 304 487",
    },
  },
  clientCopyRequested: false,
  config: aplaudiaLeadConfig,
  date: "02/07/2026, 12:00",
})
assert(phoneEmailContent.text.includes("Teléfono: 659 304 487"), "El email debe incluir teléfono si existe")
assert(
  phoneEmailContent.text.includes("Teléfono facilitado: puede usarse para contacto directo"),
  "El email debe destacar que el teléfono puede usarse si Aplaudia lo considera oportuno",
)

console.log("lead-engine regression tests OK")
