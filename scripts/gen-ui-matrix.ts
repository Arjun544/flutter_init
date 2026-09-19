import fs from "node:fs/promises"
import path from "node:path"
import JSZip from "jszip"
import { defaultConfig } from "../app/lib/config/schema"
import { generateFlutterScaffold } from "../app/lib/generator"

const profiles = [
  {
    name: "app-kit",
    ui: { platformStyle: "adaptive" as const, shadcn: false, defaultKit: "app" as const },
    themePreset: "material3" as const,
    state: "riverpod" as const,
    nav: "go_router" as const,
  },
  {
    name: "shadcn-app",
    ui: { platformStyle: "adaptive" as const, shadcn: true, defaultKit: "app" as const },
    themePreset: "material3" as const,
    state: "riverpod" as const,
    nav: "go_router" as const,
  },
  {
    name: "shadcn-default",
    ui: { platformStyle: "adaptive" as const, shadcn: true, defaultKit: "shadcn" as const },
    themePreset: "material3" as const,
    state: "riverpod" as const,
    nav: "go_router" as const,
  },
  {
    name: "cupertino-shadcn",
    ui: { platformStyle: "cupertino" as const, shadcn: true, defaultKit: "app" as const },
    themePreset: "cupertino" as const,
    state: "riverpod" as const,
    nav: "go_router" as const,
  },
  {
    name: "getx",
    ui: { platformStyle: "material" as const, shadcn: true, defaultKit: "app" as const },
    themePreset: "material3" as const,
    state: "getx" as const,
    nav: "getx" as const,
  },
]

async function main() {
  const outRoot = path.join(process.cwd(), "dev_out_ui_verify")
  // Overwrite in place; avoid wiping locked sibling folders.
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
      misc: {
        ...defaultConfig.misc,
        usesScreenutil: false,
        usesSkeletonizer: false,
      },
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
    const btnPath = path.join(dest, "lib/src/shared/widgets/ui/app/actions/app_button.dart")
    const firstLine = (await fs.readFile(btnPath, "utf8")).split("\n")[0]
    console.log("Wrote", dest)
    console.log("  import:", firstLine)
  }
  console.log("DONE")
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
