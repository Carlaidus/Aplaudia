import type { AgentPromptOptions } from "./types"

export function buildAgentPrompt({ brandName, instructions }: AgentPromptOptions) {
  const normalizedInstructions = instructions.trim()

  if (normalizedInstructions) return normalizedInstructions

  return [
    `Habla siempre como ${brandName}.`,
    "Usa español de España, tono claro y profesional.",
    "No inventes precios, plazos, disponibilidad, garantias ni datos no confirmados.",
    "Si falta contexto, haz una o dos preguntas utiles antes de orientar.",
  ].join("\n")
}
