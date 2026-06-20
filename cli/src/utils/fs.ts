// ─────────────────────────────────────────────────────────────────────────────
// FlutterInit CLI — Filesystem Utilities
// File write helpers, .gitkeep creation, and cleanup on error.
// ─────────────────────────────────────────────────────────────────────────────

import fs from 'fs'
import path from 'path'

/**
 * Write content to a file, creating any missing parent directories.
 */
export function writeFile(filePath: string, content: string): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  fs.writeFileSync(filePath, content, 'utf-8')
}

/**
 * Create a directory with a .gitkeep file inside so it's tracked by git.
 */
export function createGitkeep(dirPath: string): void {
  fs.mkdirSync(dirPath, { recursive: true })
  const keepFile = path.join(dirPath, '.gitkeep')
  if (!fs.existsSync(keepFile)) {
    fs.writeFileSync(keepFile, '', 'utf-8')
  }
}

/**
 * Recursively remove a directory. Used for cleanup when generation fails.
 * Silently ignores errors if the directory doesn't exist.
 */
export function removeDir(dirPath: string): void {
  try {
    fs.rmSync(dirPath, { recursive: true, force: true })
  } catch {
    // Ignore — directory may not exist yet
  }
}

/**
 * Check if a directory exists and is non-empty.
 */
export function isDirNonEmpty(dirPath: string): boolean {
  if (!fs.existsSync(dirPath)) return false
  const entries = fs.readdirSync(dirPath)
  return entries.length > 0
}

/**
 * Copy a directory recursively from src to dest.
 */
export function copyDir(src: string, dest: string): void {
  fs.mkdirSync(dest, { recursive: true })
  const entries = fs.readdirSync(src, { withFileTypes: true })
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name)
    const destPath = path.join(dest, entry.name)
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath)
    } else {
      fs.copyFileSync(srcPath, destPath)
    }
  }
}
