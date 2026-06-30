import { readFile } from "node:fs/promises"
import path from "node:path"

export async function readAgentInstructions(relativePath: string) {
  try {
    return await readFile(path.join(process.cwd(), relativePath), "utf8")
  } catch (error) {
    console.error(`[agent] No se pudieron leer las instrucciones ${relativePath}:`, error)
    return ""
  }
}
