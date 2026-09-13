import { readdir, readFile } from "node:fs/promises"
import path from "node:path"

const root = process.cwd()
const sourceRoot = path.join(root, "templates", "flutter")
const targetRoot = path.join(root, "cli", "templates")
const ignored = new Set([".DS_Store"])

async function filesUnder(directory: string, prefix = ""): Promise<string[]> {
    const entries = await readdir(directory, { withFileTypes: true })
    const files: string[] = []
    for (const entry of entries) {
        if (ignored.has(entry.name)) continue
        const relative = path.join(prefix, entry.name)
        const absolute = path.join(directory, entry.name)
        if (entry.isDirectory()) {
            files.push(...await filesUnder(absolute, relative))
        } else {
            files.push(relative)
        }
    }
    return files
}

const [sourceFiles, targetFiles] = await Promise.all([
    filesUnder(sourceRoot),
    filesUnder(targetRoot),
])
const sourceSet = new Set(sourceFiles)
const targetSet = new Set(targetFiles)
const missing = sourceFiles.filter((file) => !targetSet.has(file))
const extra = targetFiles.filter((file) => !sourceSet.has(file))
const changed: string[] = []

for (const file of sourceFiles) {
    if (!targetSet.has(file)) continue
    const [source, target] = await Promise.all([
        readFile(path.join(sourceRoot, file)),
        readFile(path.join(targetRoot, file)),
    ])
    if (!source.equals(target)) changed.push(file)
}

if (missing.length || extra.length || changed.length) {
    console.error("CLI templates are out of sync with templates/flutter.")
    if (missing.length) console.error(`Missing: ${missing.join(", ")}`)
    if (extra.length) console.error(`Extra: ${extra.join(", ")}`)
    if (changed.length) console.error(`Changed: ${changed.join(", ")}`)
    process.exit(1)
}

console.log("Template trees are synchronized.")
