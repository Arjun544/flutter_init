// ─────────────────────────────────────────────────────────────────────────────
// FlutterInit CLI — Main Orchestrator
// Thin entry point: runs preflight → prompts → generation in sequence.
// ─────────────────────────────────────────────────────────────────────────────

import { runPreflight } from './preflight'
import { runPrompts } from './prompts'
import { generateProject } from './generator'
import { printBanner } from './utils/logger'

export async function main(): Promise<void> {
  printBanner()
  await runPreflight()
  const config = await runPrompts()
  await generateProject(config)
}
