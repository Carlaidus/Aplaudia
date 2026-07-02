import fs from "node:fs"
import vm from "node:vm"
import ts from "typescript"

const source = fs.readFileSync(new URL("../lib/agent/quote-analysis.ts", import.meta.url), "utf8")
const { outputText } = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2020,
  },
})

const module = { exports: {} }
vm.runInNewContext(outputText, { module, exports: module.exports }, { filename: "quote-analysis.cjs" })

const { analyzeAgentQuote } = module.exports

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

function analyzeUserMessage(content, overrides = {}) {
  return analyzeAgentQuote({
    budget: "",
    email: "carlosvfx@gmail.com",
    history: [
      {
        role: "assistant",
        content:
          "Podemos hacer webs, agentes WhatsApp, visuales, mantenimiento, catalogo y proyectos para restaurantes.",
      },
      { role: "user", content },
    ],
    interest: "",
    name: "",
    phone: "",
    projectType: "",
    sessionId: "quote-analysis-test",
    ...overrides,
  })
}

function hasAny(value, patterns) {
  return patterns.some((pattern) => pattern.test(value))
}

const personal = analyzeUserMessage(
  "quiero presupuesto para una página pequeña personal de lo más barato que tengas me llamo Carlos ya te pasó mi correo y nada no tengo fotos ni nada quiero que me pases un presupuesto de eso y muy sencillito todo lo más barato que tengas",
  { projectType: "Restaurante, bar o cafetería" },
)
const personalServices = personal.detectedServices.join(" | ")
const personalCombined = [personal.projectType, personal.clientType, personalServices].join(" | ")

assert(personal.name === "Carlos", `Nombre esperado Carlos; recibido ${personal.name}`)
assert(
  personal.projectType === "Página personal / web sencilla",
  `Tipo esperado Página personal / web sencilla; recibido ${personal.projectType}`,
)
assert(
  personal.detectedServices.length === 1 && personal.detectedServices[0] === "Web / landing",
  `Servicios esperados Web / landing; recibido ${personalServices}`,
)
assert(personal.materials.includes("No tiene fotos"), `Materiales esperados No tiene fotos; recibido ${personal.materials}`)
assert(personal.priceSensitivity === "Alta", `Sensibilidad esperada Alta; recibida ${personal.priceSensitivity}`)
assert(
  !hasAny(personalCombined, [
    /\brestaurante\b/i,
    /\bbar\b/i,
    /\bcafeter/i,
    /cat[aá]logo/i,
    /whatsapp/i,
    /agente/i,
    /visual/i,
    /v[ií]deo|video/i,
    /mantenimiento/i,
  ]),
  `Falso positivo en caso personal: ${personalCombined}`,
)

const restaurant = analyzeUserMessage(
  "necesito presupuesto urgente para una web de un restaurante para hacer reservas, no tengo web ni carta ni fotos",
)
const restaurantServices = restaurant.detectedServices.join(" | ")

assert(
  restaurant.projectType === "Restaurante / bar / cafetería",
  `Tipo esperado Restaurante / bar / cafetería; recibido ${restaurant.projectType}`,
)
assert(restaurant.detectedServices.includes("Web / landing"), `Falta Web / landing: ${restaurantServices}`)
assert(restaurant.detectedServices.includes("Reservas"), `Falta Reservas: ${restaurantServices}`)
assert(restaurant.detectedServices.length === 2, `Servicios extra no esperados: ${restaurantServices}`)
assert(restaurant.materials.includes("No tiene web"), `Falta material No tiene web: ${restaurant.materials}`)
assert(restaurant.materials.includes("No tiene carta"), `Falta material No tiene carta: ${restaurant.materials}`)
assert(restaurant.materials.includes("No tiene fotos"), `Falta material No tiene fotos: ${restaurant.materials}`)
assert(restaurant.urgency === "Alta", `Urgencia esperada Alta; recibida ${restaurant.urgency}`)
assert(!/visual|imagen|v[ií]deo|video/i.test(restaurantServices), `Falso positivo visual: ${restaurantServices}`)

console.log("quote-analysis regression tests OK")
