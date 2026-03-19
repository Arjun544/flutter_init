import fs from "node:fs/promises"
import path from "node:path"
import { watch } from "node:fs"
import { exec } from "node:child_process"
import { promisify } from "node:util"
import { defaultConfig } from "../app/lib/config/schema"
import { generateFlutterScaffold } from "../app/lib/generator"
import JSZip from "jszip"

const execAsync = promisify(exec)
const OUTPUT_DIR = path.join(process.cwd(), "dev_out")
const TEMPLATES_ROOT = path.join(process.cwd(), "templates", "flutter")
const APP_LIB_ROOT = path.join(process.cwd(), "app", "lib")
const SCRIPTS_ROOT = path.join(process.cwd(), "scripts")

let isFirstBuild = true

async function ensureOutputDir() {
    // Only rm on the very first start to ensure a clean state
    if (isFirstBuild) {
        await fs.rm(OUTPUT_DIR, { recursive: true, force: true }).catch(() => { })
        await fs.mkdir(OUTPUT_DIR, { recursive: true })
    }
}

async function rebuild() {
    console.log(`\n🚀 [${new Date().toLocaleTimeString()}] Syncing Changes...`)
    
    try {
        // Use UI config if it exists, otherwise fallback to defaultConfig
        let currentConfig = defaultConfig
        const configPath = path.join(process.cwd(), "scripts", "dev_config.json")
        try {
            const devConfigStr = await fs.readFile(configPath, "utf-8")
            currentConfig = JSON.parse(devConfigStr)
        } catch (e) {
            // Use defaults if file doesn't exist or is invalid
        }

        const zipBuffer = await generateFlutterScaffold(currentConfig)
        const zip = await JSZip.loadAsync(zipBuffer)
        
        // Clean output directory before extraction to remove old files
        // We keep .dart_tool and pubspec.lock to speed up flutter pub get
        const itemsToClean = ["lib", "assets", "test"]
        for (const item of itemsToClean) {
            await fs.rm(path.join(OUTPUT_DIR, item), { recursive: true, force: true }).catch(() => {})
        }

        // For now, we just overwrite
        for (const [filename, file] of Object.entries(zip.files)) {
            if (file.dir) continue
            const targetPath = path.join(OUTPUT_DIR, filename)
            
            // Read existing content to avoid unnecessary writes which trigger IDE lag
            const newContent = await file.async("nodebuffer")
            try {
                const existingContent = await fs.readFile(targetPath)
                if (existingContent.equals(newContent)) continue 
            } catch (e) {}

            await fs.mkdir(path.dirname(targetPath), { recursive: true })
            await fs.writeFile(targetPath, newContent)
        }
        
        if (isFirstBuild) {
            console.log("📦 Initializing project (flutter pub get)...")
            try {
                await execAsync("flutter pub get", { cwd: OUTPUT_DIR })
                isFirstBuild = false
            } catch (err: any) {
                console.warn("⚠️ flutter pub get failed.")
            }
        }

        // Run analysis and report errors to terminal
        console.log("🔍 Analyzing for errors...")
        try {
            await execAsync("dart analyze .", { cwd: OUTPUT_DIR })
            console.log("✅ No Dart errors found!")
        } catch (err: any) {
            // dart analyze returns non-zero code if errors exist
            const output = (err.stdout || err.stderr || "") as string
            const errorLines = output.split('\n')
                .filter(l => l.includes('error •') || l.includes('warning •') || l.includes('error -'))
                .map(l => l.trim())
            
            if (errorLines.length > 0) {
                console.log(`❌ Found ${errorLines.length} issues in generated code:`)
                errorLines.slice(0, 10).forEach(l => console.log(`   - ${l}`))
                if (errorLines.length > 10) {
                    console.log(`   ... and ${errorLines.length - 10} more.`)
                }
            } else {
                console.log("❌ Analysis failed. Full output:")
                console.log(output)
            }
        }
    } catch (e: any) {
        console.error(`❌ Sync failed:`, e.message)
    }
}

// Simple debounce
let timeout: ReturnType<typeof setTimeout> | null = null
function debounceRebuild() {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(rebuild, 500)
}

async function main() {
    await ensureOutputDir()
    await rebuild()

    console.log(`👀 Watching templates and app/lib for changes...`)
    
    const watcher = (event: string, filename: string | null) => {
        if (!filename) return
        if (filename.includes(".dart_tool") || filename.includes(".git") || filename.includes("dev_out")) return
        debounceRebuild()
    }

    watch(TEMPLATES_ROOT, { recursive: true }, watcher)
    watch(APP_LIB_ROOT, { recursive: true }, watcher)
    watch(SCRIPTS_ROOT, { recursive: false }, watcher)
}

main().catch(console.error)
