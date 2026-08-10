import type { ScaffoldConfig } from "@/app/lib/config/schema"

/**
 * Shared FormData builder for ZIP download and code preview.
 */
export function buildGenerateForm(
  config: ScaffoldConfig,
  fontFiles: Map<string, File>
): FormData {
  const form = new FormData()
  form.append("config", JSON.stringify(config))

  for (const [fileName, file] of fontFiles) {
    form.append("font", file, fileName)
  }

  return form
}
