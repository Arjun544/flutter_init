import JSZip from "jszip"

const BINARY_EXTENSIONS = new Set([
  "png",
  "jpg",
  "jpeg",
  "gif",
  "webp",
  "ico",
  "svg",
  "ttf",
  "otf",
  "woff",
  "woff2",
  "eot",
  "bin",
  "zip",
  "jar",
  "so",
  "dylib",
  "dll",
  "exe",
  "pdf",
])

/** Dotfiles / marker files that aren't useful as code previews. */
const NON_PREVIEW_BASENAMES = new Set([
  ".keep",
  ".gitkeep",
  ".DS_Store",
  "Thumbs.db",
])

const BINARY_PLACEHOLDER_PREFIX = "// Binary file"

function extensionOf(filePath: string): string {
  const base = filePath.split("/").pop() ?? filePath
  const dot = base.lastIndexOf(".")
  if (dot <= 0) return ""
  return base.slice(dot + 1).toLowerCase()
}

function basenameOf(filePath: string): string {
  const parts = filePath.replace(/\\/g, "/").split("/")
  return parts[parts.length - 1] ?? filePath
}

function looksBinary(content: string): boolean {
  // NUL bytes are a reliable binary signal for text decoding
  return content.includes("\0")
}

/** True when the file can be shown as text / syntax-highlighted code. */
export function canPreviewAsText(filePath: string, content?: string): boolean {
  const base = basenameOf(filePath)
  if (NON_PREVIEW_BASENAMES.has(base)) return false
  if (BINARY_EXTENSIONS.has(extensionOf(filePath))) return false
  if (content?.startsWith(BINARY_PLACEHOLDER_PREFIX)) return false
  if (content?.startsWith("// Unable to read file contents")) return false
  return true
}

/**
 * Unzip a scaffold ZIP into a path → text content map.
 * Binary / non-text files are omitted (or stored as a short placeholder).
 */
export async function unzipScaffold(
  blob: Blob
): Promise<Record<string, string>> {
  const buffer = await blob.arrayBuffer()
  const zip = await JSZip.loadAsync(buffer)
  const files: Record<string, string> = {}

  const entries = Object.entries(zip.files)
  for (const [filePath, zipEntry] of entries) {
    if (zipEntry.dir) continue

    const normalized = filePath.replace(/\\/g, "/")
    const ext = extensionOf(normalized)

    if (
      BINARY_EXTENSIONS.has(ext) ||
      NON_PREVIEW_BASENAMES.has(basenameOf(normalized))
    ) {
      files[normalized] =
        `${BINARY_PLACEHOLDER_PREFIX} (${ext || basenameOf(normalized)}) — not shown in preview`
      continue
    }

    try {
      const content = await zipEntry.async("string")
      if (looksBinary(content)) {
        files[normalized] =
          `${BINARY_PLACEHOLDER_PREFIX} — not shown in preview`
        continue
      }
      files[normalized] = content
    } catch {
      files[normalized] = "// Unable to read file contents"
    }
  }

  return files
}

export function preferInitialFile(paths: string[]): string | null {
  const preferred = [
    "lib/main.dart",
    "lib/src/app.dart",
    "pubspec.yaml",
    "README.md",
  ]
  for (const path of preferred) {
    if (paths.includes(path)) return path
  }
  const dart = paths.find((p) => p.endsWith(".dart"))
  if (dart) return dart
  return paths[0] ?? null
}
