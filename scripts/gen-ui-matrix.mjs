import fs from "node:fs/promises"
import path from "node:path"
import JSZip from "jszip"
import { defaultConfig } from "./app/lib/config/schema.ts"
import { generateFlutterScaffold } from "./app/lib/generator/index.ts"

const profiles = JSON.parse(process.argv[2] || "[]")
const outRoot = path.join(process.cwd(), "dev_out_ui_matrix")
await fs.rm(outRoot, { recursive: true, force: true })
await fs.mkdir(outRoot, { recursive: true })

for (const p of profiles) {
  const config = {
    ...defaultConfig,
    appName: "ui_matrix_app",
    packageId: "com.example.ui_matrix_app",
    theme: { ...defaultConfig.theme, preset: p.themePreset },
    stateManagement: p.state,
    navigation: p.nav,
    ui: p.ui,
    localization: { enabled: false, supportedLocales: ["en"] },
    misc: { ...defaultConfig.misc, usesScreenutil: false, usesSkeletonizer: false },
  }
  console.log("Generating", p.name, "...")
  const zipBuffer = await generateFlutterScaffold(config, [], { skipFormat: true })
  const zip = await JSZip.loadAsync(zipBuffer)
  const dest = path.join(outRoot, p.name)
  await fs.mkdir(dest, { recursive: true })
  for (const [filename, file] of Object.entries(zip.files)) {
    if (file.dir) continue
    const target = path.join(dest, filename)
    await fs.mkdir(path.dirname(target), { recursive: true })
    await fs.writeFile(target, await file.async("nodebuffer"))
  }
  console.log("Wrote", dest)
}
console.log("DONE")
