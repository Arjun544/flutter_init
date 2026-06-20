// ─────────────────────────────────────────────────────────────────────────────
// FlutterInit CLI — Exec Utilities
// Wrappers around execSync with consistent error handling.
// Use exec() for silent commands. Use execVisible() for user-facing output.
// ─────────────────────────────────────────────────────────────────────────────

import { execSync } from 'child_process'

/**
 * Run a command silently, capturing stdout/stderr as a string.
 * Throws if the command exits with a non-zero code.
 */
export function exec(command: string, options?: { cwd?: string }): string {
  return execSync(command, {
    stdio: 'pipe',
    cwd: options?.cwd,
    encoding: 'utf-8',
  }) as string
}

/**
 * Run a command with stdio inherited — the user sees the full output in their
 * terminal. Used for `flutter doctor` where transparency is intentional.
 */
export function execVisible(command: string, options?: { cwd?: string }): void {
  execSync(command, {
    stdio: 'inherit',
    cwd: options?.cwd,
  })
}
