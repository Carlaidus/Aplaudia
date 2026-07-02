import fs from "node:fs"
import vm from "node:vm"
import ts from "typescript"

const source = fs.readFileSync(new URL("../lib/email/cloudflare-email.ts", import.meta.url), "utf8")
const { outputText } = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2020,
  },
})

const module = { exports: {} }
vm.runInNewContext(outputText, { module, exports: module.exports, process: { env: {} } }, { filename: "cloudflare-email.cjs" })

const { encodeHtmlForEmail } = module.exports
const encoded = encodeHtmlForEmail("<p>más aquí orientación envíamelo estás · €</p>")

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

assert(!/[^\u0009\u000A\u000D\u0020-\u007E]/.test(encoded), `HTML no ASCII detectado: ${encoded}`)
assert(encoded.includes("m&#225;s"), `Falta entidad para más: ${encoded}`)
assert(encoded.includes("aqu&#237;"), `Falta entidad para aquí: ${encoded}`)
assert(encoded.includes("orientaci&#243;n"), `Falta entidad para orientación: ${encoded}`)
assert(encoded.includes("env&#237;amelo"), `Falta entidad para envíamelo: ${encoded}`)
assert(encoded.includes("est&#225;s"), `Falta entidad para estás: ${encoded}`)
assert(encoded.includes("&#183;"), `Falta entidad para separador: ${encoded}`)
assert(encoded.includes("&#8364;"), `Falta entidad para euro: ${encoded}`)

console.log("email encoding regression tests OK")
