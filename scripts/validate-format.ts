/// <reference types="bun-types" />
import { $ } from "bun"
import { existsSync, mkdirSync, unlinkSync, writeFileSync } from "node:fs"
import fs from "node:fs/promises"
import path from "node:path"
import { buildConfig } from "../tests/utils/config-builder"
import { CRITICAL_COMBOS } from "../tests/utils/critical-combos"
import { generateToDisk } from "../tests/utils/generate"
import { COMBO_LABEL, type PrimaryCombo } from "../tests/utils/matrix.config"

import { generatePrimaryCombinations } from "../tests/utils/combinations"
import { MISC_DEFAULT } from "../tests/utils/misc-profiles"
import { resolveEditableTemplate, syncCliTemplates } from "./lib/resolve-template-source"

const MODE = process.argv.includes("--mode") ? process.argv[process.argv.indexOf("--mode") + 1] : "critical"
const KEEP_OUTPUT = process.argv.includes("--keep-output")
const COMBO = process.argv.includes("--combo") ? process.argv[process.argv.indexOf("--combo") + 1] : null

console.log(`⚡ Starting Dart Format Validation (Mode: ${MODE})`)

const TEMP_BASE = "./.temp/flutterinit-format"
await fs.mkdir(TEMP_BASE, { recursive: true })

let combosToRun: Array<typeof CRITICAL_COMBOS[0] | PrimaryCombo> = CRITICAL_COMBOS

if (COMBO) {
    const foundInCritical = CRITICAL_COMBOS.find(c => COMBO_LABEL(c) === COMBO)
    if (foundInCritical) {
        combosToRun = [foundInCritical]
    } else {
        const all = generatePrimaryCombinations()
        const found = all.find(c => COMBO_LABEL(c) === COMBO)
        if (!found) {
            console.error(`Error: Combo '${COMBO}' not found in the matrix.`)
            process.exit(1)
        }
        combosToRun = [found]
    }
    console.log(`🎯 Targeting Combo: ${COMBO}`)
} else if (MODE === "full") {
    combosToRun = generatePrimaryCombinations()
} else if (MODE !== "critical") {
    console.error("Supported modes are critical and full.")
    process.exit(1)
}

/** Paths listed as "Changed ..." by `dart format --set-exit-if-changed`. */
function parseChangedFiles(formatOutput: string): string[] {
    const files: string[] = []
    for (const line of formatOutput.split(/\r?\n/)) {
        const match = line.match(/^Changed\s+(.+)$/)
        if (match) {
            files.push(match[1].trim().replace(/\\/g, "/"))
        }
    }
    return files
}

/** Parse `Formatted 103 files (76 changed) in 0.28 seconds.` from dart format. */
function parseFormatStats(formatOutput: string): { scanned: number; changed: number } | null {
    const match = formatOutput.match(/Formatted\s+(\d+)\s+files?\s+\((\d+)\s+changed\)/i)
    if (!match) return null
    return { scanned: Number(match[1]), changed: Number(match[2]) }
}

let passCount = 0
let failCount = 0
let alreadyCleanCount = 0
let autoFixedCount = 0
let filesNeedingFix = 0
let filesFormatted = 0
let filesChanged = 0
let hbsReplaced = 0
const failedLogs: string[] = []
const startTime = Date.now()
const replacedHbsPaths = new Set<string>()

for (const combo of combosToRun) {
    const label = COMBO_LABEL(combo)
    const dirName = label.replace(/[|]/g, "_").replace(/\s+/g, "_")
    const targetDir = `${TEMP_BASE}/${dirName}`

    console.log("------------------------------------------------------------")
    console.log(`👉 Validating format: ${label}`)

    try {
        const config = buildConfig(combo, (combo as any).miscProfile || MISC_DEFAULT)
        await generateToDisk(config, targetDir)

        console.log("  Running pub get...")
        const pubGet = await $`cd ${targetDir} && dart pub get`.nothrow().quiet()
        if (pubGet.exitCode !== 0) {
            console.error("  ❌ FAILED: dart pub get")
            console.error(pubGet.stdout.toString())
            console.error(pubGet.stderr.toString())
            failedLogs.push(
                `FAIL: ${label} (dart pub get)\n${pubGet.stdout.toString()}\n${pubGet.stderr.toString()}`
            )
            failCount++
            continue
        }

        console.log("  Running dart format check (before)...")
        const checkBefore = await $`cd ${targetDir} && dart format --output=none --set-exit-if-changed .`.nothrow().quiet()
        const beforeOutput = `${checkBefore.stdout.toString()}\n${checkBefore.stderr.toString()}`.trim()
        const firstCheckDirty = checkBefore.exitCode !== 0
        const dirtyFiles = parseChangedFiles(beforeOutput)

        if (!firstCheckDirty) {
            console.log("  ✓ First check: already formatted")
            console.log("  ✅ PASSED")
            passCount++
            alreadyCleanCount++
            if (!KEEP_OUTPUT) {
                await fs.rm(targetDir, { recursive: true, force: true })
            }
            continue
        }

        filesNeedingFix += dirtyFiles.length
        console.log("  ⚠️  First check: files need formatting")
        console.log(`  ${dirtyFiles.length} generated .dart file(s) need formatting`)

        // Format generated .dart files in place
        console.log("  Running dart format...")
        const formatArgs = dirtyFiles.length > 0 ? dirtyFiles : ["."]
        const apply = await $`cd ${targetDir} && dart format ${formatArgs}`.nothrow().quiet()
        const applyOutput = `${apply.stdout.toString()}\n${apply.stderr.toString()}`.trim()
        if (apply.exitCode !== 0) {
            console.error("  ❌ FAILED: dart format apply")
            failedLogs.push(`FAIL: ${label} (dart format apply)\n${applyOutput}`)
            failCount++
            continue
        }

        const applyStats = parseFormatStats(applyOutput)
        const applyChangedFiles = parseChangedFiles(applyOutput)
        if (applyStats) {
            filesFormatted += applyStats.scanned
            filesChanged += applyStats.changed
        } else {
            filesFormatted += dirtyFiles.length
            filesChanged += applyChangedFiles.length || dirtyFiles.length
        }

        // Replace whole source .hbs / partial files with the formatted .dart contents
        console.log("  Replacing source .hbs files with formatted .dart...")
        for (const rel of dirtyFiles) {
            const hbsPath = await resolveEditableTemplate(config, rel)
            if (!hbsPath) continue
            if (replacedHbsPaths.has(hbsPath)) continue

            const dartPath = path.join(targetDir, rel)
            const formattedDart = await fs.readFile(dartPath, "utf8")
            await fs.writeFile(hbsPath, formattedDart, "utf8")
            replacedHbsPaths.add(hbsPath)
            hbsReplaced++
        }

        // Re-generate from replaced templates and verify
        console.log("  Re-generating from updated templates...")
        await generateToDisk(config, targetDir)
        const pubGet2 = await $`cd ${targetDir} && dart pub get`.nothrow().quiet()
        if (pubGet2.exitCode !== 0) {
            console.error("  ❌ FAILED: dart pub get (after template replace)")
            failedLogs.push(
                `FAIL: ${label} (dart pub get after template replace)\n${pubGet2.stdout.toString()}\n${pubGet2.stderr.toString()}`
            )
            failCount++
            continue
        }

        console.log("  Running dart format check (after)...")
        const checkAfter = await $`cd ${targetDir} && dart format --output=none --set-exit-if-changed .`.nothrow().quiet()
        const afterOutput = `${checkAfter.stdout.toString()}\n${checkAfter.stderr.toString()}`.trim()

        if (checkAfter.exitCode !== 0) {
            // One more format pass on leftover dirty files, then re-check
            const stillDirty = parseChangedFiles(afterOutput)
            if (stillDirty.length > 0) {
                await $`cd ${targetDir} && dart format ${stillDirty}`.nothrow().quiet()
            }
            const checkFinal = await $`cd ${targetDir} && dart format --output=none --set-exit-if-changed .`.nothrow().quiet()
            if (checkFinal.exitCode !== 0) {
                const finalOut = `${checkFinal.stdout.toString()}\n${checkFinal.stderr.toString()}`.trim()
                console.error("  ❌ FAILED: dart format check after replace")
                if (finalOut) console.error(finalOut)
                failedLogs.push(`FAIL: ${label} (dart format check after replace)\n${finalOut}`)
                failCount++
                continue
            }
        }

        autoFixedCount++
        console.log("  ✅ PASSED (hbs replaced with formatted dart)")
        passCount++
        if (!KEEP_OUTPUT) {
            await fs.rm(targetDir, { recursive: true, force: true })
        }
    } catch (e) {
        console.error(`  ❌ ERROR during format validation: ${e}`)
        failedLogs.push(`FAIL: ${label} (Exception)\n${e}`)
        failCount++
    }
}

if (replacedHbsPaths.size > 0) {
    console.log("------------------------------------------------------------")
    console.log(`🔄 Syncing templates (${replacedHbsPaths.size} .hbs replaced) → cli/templates...`)
    await syncCliTemplates()
    console.log("  ✓ cli/templates synced")
}

const duration = Math.floor((Date.now() - startTime) / 1000)
const totalCombos = combosToRun.length

console.log("============================================================")
console.log("📊 Summary")
console.log(`Total Duration: ${duration}s`)
console.log(`Combos: ${totalCombos}`)
console.log(`Passed: ${passCount}`)
console.log(`Failed: ${failCount}`)
console.log(`Already format-clean: ${alreadyCleanCount}`)
console.log(`Combos auto-fixed: ${autoFixedCount}`)
console.log(`Files needing fix (first check): ${filesNeedingFix}`)
console.log(`Files scanned by dart format: ${filesFormatted}`)
console.log(`Files changed by dart format: ${filesChanged}`)
console.log(`.hbs files replaced: ${hbsReplaced}`)
console.log("============================================================")

const outputDir = path.resolve(process.cwd(), "tests/results/layer3")
if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true })
}
const outputFile = path.join(outputDir, "failed-tests.log")

if (failedLogs.length > 0) {
    writeFileSync(outputFile, failedLogs.join("\n\n=========================================\n\n"), "utf-8")
    console.log(`\n[FailedTestsLogger] Logged ${failCount} failed validations to ${outputFile}\n`)
} else {
    if (existsSync(outputFile)) {
        unlinkSync(outputFile)
    }
}

if (failCount > 0) {
    process.exit(1)
} else {
    process.exit(0)
}
