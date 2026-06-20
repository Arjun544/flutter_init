// ─────────────────────────────────────────────────────────────────────────────
// FlutterInit CLI — Preflight Checks
// Runs before any prompt. Verifies Flutter is installed and configured.
// ─────────────────────────────────────────────────────────────────────────────

import { cancel, confirm, isCancel, log, spinner } from '@clack/prompts'
import pc from 'picocolors'
import { exec, execVisible } from './utils/exec'
import { brand, logError, logInfo, logWarn } from './utils/logger'

/**
 * Run all preflight checks in order.
 * Exits the process on any hard failure.
 */
export async function runPreflight(): Promise<void> {
  // ── 1. Check Flutter is on PATH ────────────────────────────────────────────
  const flutterSpinner = spinner()
  flutterSpinner.start('Checking Flutter installation...')

  try {
    const version = exec('flutter --version')
    // Extract the version line for a clean display
    const versionLine = version.split('\n')[0]?.trim() ?? 'Flutter (version unknown)'
    flutterSpinner.stop(`${pc.green('✓')} ${versionLine}`)
  } catch {
    flutterSpinner.stop(pc.red('✗ Flutter not found on PATH'))
    logError('Flutter SDK is required but was not found.')
    log.message(
      `  Install Flutter: ${pc.cyan('https://flutter.dev/docs/get-started/install')}`,
    )
    process.exit(1)
  }

  // ── 2. Check Bun version ──────────────────────────────────────────────────
  try {
    const bunVersion = exec('bun --version').trim()
    const [major] = bunVersion.split('.').map(Number)
    if (major < 1) {
      logWarn(`Bun v${bunVersion} detected. Bun 1.0.0+ is recommended.`)
    } else {
      logInfo(`Bun v${bunVersion}`)
    }
  } catch {
    logWarn('Could not detect Bun version. Continuing anyway.')
  }

  // ── 3. Run flutter doctor ─────────────────────────────────────────────────
  console.log()
  log.message(
    `${brand('─────────────────────────────────────────────────────────────')}\n` +
    `  Running ${pc.bold('flutter doctor')} to check your environment...\n` +
    `${brand('─────────────────────────────────────────────────────────────')}`
  )
  console.log()

  try {
    execVisible('flutter doctor')
  } catch {
    // flutter doctor itself can exit non-zero with warnings — we still continue
  }

  console.log()

  // ── 4. Ask user to confirm they want to continue ──────────────────────────
  const shouldContinue = await confirm({
    message: 'Flutter doctor ran above. Do you want to continue?',
    initialValue: true,
  })

  if (isCancel(shouldContinue) || !shouldContinue) {
    cancel('Fix any Flutter issues first, then run create-flutterinit again.')
    log.message(`  ${pc.cyan('https://flutter.dev/docs/get-started/install')}`)
    process.exit(0)
  }
}
