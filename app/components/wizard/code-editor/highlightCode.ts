export function langFromPath(filePath: string): string {
  const base = filePath.split("/").pop() ?? filePath
  const lower = base.toLowerCase()

  if (lower === "dockerfile" || lower.startsWith("dockerfile.")) return "dockerfile"
  if (lower === "makefile") return "makefile"
  if (lower === "pubspec.lock") return "yaml"

  const ext = lower.includes(".") ? lower.slice(lower.lastIndexOf(".") + 1) : ""

  switch (ext) {
    case "dart":
      return "dart"
    case "yaml":
    case "yml":
      return "yaml"
    case "json":
      return "json"
    case "xml":
    case "plist":
      return "xml"
    case "md":
    case "mdx":
      return "markdown"
    case "html":
    case "htm":
      return "html"
    case "css":
      return "css"
    case "scss":
      return "scss"
    case "js":
    case "mjs":
    case "cjs":
      return "javascript"
    case "ts":
      return "typescript"
    case "tsx":
      return "tsx"
    case "jsx":
      return "jsx"
    case "sh":
    case "bash":
      return "bash"
    case "gradle":
    case "kt":
    case "kts":
      return "kotlin"
    case "swift":
      return "swift"
    case "properties":
      return "properties"
    case "gitignore":
    case "gitattributes":
      return "plaintext"
    default:
      return "plaintext"
  }
}

/** Curated Shiki themes for the code preview style picker. */
export const SHIKI_THEMES = [
  { id: "github-dark", label: "GitHub Dark", type: "dark" },
  { id: "github-light", label: "GitHub Light", type: "light" },
  { id: "one-dark-pro", label: "One Dark Pro", type: "dark" },
  { id: "one-light", label: "One Light", type: "light" },
  { id: "dracula", label: "Dracula", type: "dark" },
  { id: "nord", label: "Nord", type: "dark" },
  { id: "catppuccin-mocha", label: "Catppuccin Mocha", type: "dark" },
  { id: "catppuccin-latte", label: "Catppuccin Latte", type: "light" },
  { id: "tokyo-night", label: "Tokyo Night", type: "dark" },
  { id: "vitesse-dark", label: "Vitesse Dark", type: "dark" },
  { id: "vitesse-light", label: "Vitesse Light", type: "light" },
  { id: "material-theme-ocean", label: "Material Ocean", type: "dark" },
  { id: "monokai", label: "Monokai", type: "dark" },
  { id: "rose-pine", label: "Rosé Pine", type: "dark" },
  { id: "rose-pine-dawn", label: "Rosé Pine Dawn", type: "light" },
  { id: "solarized-dark", label: "Solarized Dark", type: "dark" },
  { id: "solarized-light", label: "Solarized Light", type: "light" },
  { id: "min-dark", label: "Min Dark", type: "dark" },
  { id: "min-light", label: "Min Light", type: "light" },
  { id: "poimandres", label: "Poimandres", type: "dark" },
] as const

export type ShikiThemeId = (typeof SHIKI_THEMES)[number]["id"]

export const DEFAULT_SHIKI_THEME: ShikiThemeId = "github-light"

export function getShikiThemeLabel(id: string): string {
  return SHIKI_THEMES.find((t) => t.id === id)?.label ?? id
}

/**
 * Keep Shiki token colors; drop theme background / root foreground so the
 * pane can use global.css `--background` / `--foreground`.
 */
function stripThemeSurfaceStyles(html: string): string {
  return html.replace(/<pre\b([^>]*)>/i, (match, attrs: string) => {
    const styleMatch = attrs.match(/\sstyle="([^"]*)"/i)
    if (!styleMatch) return match

    const nextStyle = styleMatch[1]
      .split(";")
      .map((part) => part.trim())
      .filter(Boolean)
      .filter(
        (part) =>
          !/^background(-color)?\s*:/i.test(part) && !/^color\s*:/i.test(part)
      )
      .join("; ")

    const withoutStyle = attrs.replace(/\sstyle="[^"]*"/i, "")
    if (!nextStyle) {
      return `<pre${withoutStyle}>`
    }
    return `<pre${withoutStyle} style="${nextStyle}">`
  })
}

/**
 * Highlight source with a single Shiki theme (token colors only).
 * @see https://shiki.style/
 */
export async function highlightCode(
  code: string,
  lang: string,
  theme: string = DEFAULT_SHIKI_THEME
): Promise<string> {
  const { codeToHtml } = await import("shiki")

  try {
    const html = await codeToHtml(code, {
      lang,
      theme,
    })
    return stripThemeSurfaceStyles(html)
  } catch {
    if (lang === "plaintext") {
      return `<pre class="shiki"><code>${escapeHtml(code)}</code></pre>`
    }
    try {
      const html = await codeToHtml(code, {
        lang: "plaintext",
        theme,
      })
      return stripThemeSurfaceStyles(html)
    } catch {
      return `<pre class="shiki"><code>${escapeHtml(code)}</code></pre>`
    }
  }
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
}
