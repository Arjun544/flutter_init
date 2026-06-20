// ─────────────────────────────────────────────────────────────────────────────
// FlutterInit CLI — Branded Logger
// ASCII banner in #027DFD blue, styled section headers, and consistent output.
// ─────────────────────────────────────────────────────────────────────────────

import pc from 'picocolors'
import { log } from '@clack/prompts'
import process from 'node:process'

// FlutterInit brand blue: #027DFD → closest ANSI approximation via picocolors cyan/blue
const brand = (str: string) => pc.bold(pc.blue(str))
const dim = (str: string) => pc.dim(str)
const accent = (str: string) => pc.cyan(str)
const success = (str: string) => pc.green(str)
const warn = (str: string) => pc.yellow(str)
const error = (str: string) => pc.red(str)

// ─── Unicode Detection ────────────────────────────────────────────────────────
export function isUnicodeSupported(): boolean {
  if (process.platform !== 'win32') {
    return process.env.TERM !== 'linux' // Linux console (kernel)
  }

  return Boolean(process.env.WT_SESSION) // Windows Terminal
    || Boolean(process.env.TERMINUS_SUBLIME) // Terminus (<0.2.27)
    || process.env.ConEmuTask === '{cmd::Cmder}' // ConEmu and cmder
    || process.env.TERM_PROGRAM === 'Terminus-Sublime'
    || process.env.TERM_PROGRAM === 'vscode'
    || process.env.TERM === 'xterm-256color'
    || process.env.TERM === 'alacritty'
    || process.env.TERMINAL_EMULATOR === 'JetBrains-JediTerm'
}

// ─── ASCII Logo ───────────────────────────────────────────────────────────────
// Rendered from the FlutterInit "F" mark + logotype

const BANNER_UNICODE = `
${brand('  ███████╗██╗     ██╗   ██╗████████╗████████╗███████╗██████╗  ██╗███╗   ██╗██╗████████╗')}
${brand('  ██╔════╝██║     ██║   ██║╚══██╔══╝╚══██╔══╝██╔════╝██╔══██╗ ██║████╗  ██║██║╚══██╔══╝')}
${brand('  █████╗  ██║     ██║   ██║   ██║      ██║   █████╗  ██████╔╝ ██║██╔██╗ ██║██║   ██║   ')}
${brand('  ██╔══╝  ██║     ██║   ██║   ██║      ██║   ██╔══╝  ██╔══██╗ ██║██║╚██╗██║██║   ██║   ')}
${brand('  ██║     ███████╗╚██████╔╝   ██║      ██║   ███████╗██║  ██║ ██║██║ ╚████║██║   ██║   ')}
${brand('  ╚═╝     ╚══════╝ ╚═════╝    ╚═╝      ╚═╝   ╚══════╝╚═╝  ╚═╝ ╚═╝╚═╝  ╚═══╝╚═╝   ╚═╝   ')}

  ${dim('Scaffold production-ready Flutter projects from your terminal')}
  ${dim('─────────────────────────────────────────────────────────────')}
  ${dim('v0.1.0')}  ${pc.bold('·')}  ${accent('flutterinit.com')}  ${pc.bold('·')}  ${dim('by Arjun Mahar')}
`

const BANNER_ASCII = `
${brand('  ####### ##      ##    ## ######## ######## ####### ######   ## ###    ## ## ########')}
${brand('  ##       ##      ##    ##    ##       ##    ##      ##  ##   ## ####   ## ##    ##   ')}
${brand('  #####    ##      ##    ##    ##       ##    #####   ######   ## ## ##  ## ##    ##   ')}
${brand('  ##       ##      ##    ##    ##       ##    ##      ##  ##   ## ##  ## ## ##    ##   ')}
${brand('  ##       #######  ######     ##       ##    ####### ##  ##   ## ##   #### ##    ##   ')}

  ${dim('Scaffold production-ready Flutter projects from your terminal')}
  ${dim('-------------------------------------------------------------')}
  ${dim('v0.1.0')}  ${pc.bold('-')}  ${accent('flutterinit.com')}  ${pc.bold('-')}  ${dim('by Arjun Mahar')}
`

/**
 * Print the FlutterInit branded ASCII banner.
 * Call this before `intro()`.
 */
export function printBanner(): void {
  console.log(isUnicodeSupported() ? BANNER_UNICODE : BANNER_ASCII)
}

/**
 * Print a styled section header before a group of prompts.
 * Explains what the user is about to configure.
 *
 * @param title   Short section name
 * @param detail  One-line explanation shown below the title
 */
export function printStep(title: string, detail: string): void {
  const bullet = isUnicodeSupported() ? '◆' : '>'
  console.log()
  console.log(`  ${brand(bullet)} ${pc.bold(title)}`)
  console.log(`  ${dim(detail)}`)
  console.log()
}

/**
 * Print a success message (outside of a spinner context).
 */
export function logSuccess(message: string): void {
  log.success(success(message))
}

/**
 * Print a warning message.
 */
export function logWarn(message: string): void {
  log.warn(warn(message))
}

/**
 * Print an error message.
 */
export function logError(message: string): void {
  log.error(error(message))
}

/**
 * Print a branded info message with context.
 */
export function logInfo(message: string): void {
  log.info(dim(message))
}

export { brand, dim, accent, success, warn, error }
