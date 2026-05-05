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

const MODE = process.argv.includes("--mode") ? process.argv[process.argv.indexOf("--mode") + 1] : "critical"
const KEEP_OUTPUT = process.argv.includes("--keep-output")
const COMBO = process.argv.includes("--combo") ? process.argv[process.argv.indexOf("--combo") + 1] : null

console.log(`⚡ Starting Dart Validation (Mode: ${MODE})`)

const TEMP_BASE = "./.temp/flutterinit"
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
} else if (MODE !== "critical") {
    console.error("Only critical mode is implemented.")
    process.exit(1)
}

let passCount = 0
let failCount = 0
const failedLogs: string[] = []
const startTime = Date.now()

for (const combo of combosToRun) {
    const label = COMBO_LABEL(combo)
    const dirName = label.replace(/[|]/g, "_").replace(/\s+/g, "_")
    const targetDir = `${TEMP_BASE}/${dirName}`

    console.log("------------------------------------------------------------")
    console.log(`👉 Validating: ${label}`)

    try {
        // Generate project
        const config = buildConfig(combo, (combo as any).miscProfile || MISC_DEFAULT)
        await generateToDisk(config, targetDir)

        // Run pub get
        console.log("  Running pub get...")
        const pubGet = await $`cd ${targetDir} && dart pub get`.nothrow().quiet()
        if (pubGet.exitCode !== 0) {
            console.error("  ❌ FAILED: dart pub get")
            console.error(pubGet.stdout.toString())
            console.error(pubGet.stderr.toString())
            failedLogs.push(`FAIL: ${label} (dart pub get)\n${pubGet.stdout.toString()}\n${pubGet.stderr.toString()}`)
            failCount++
            continue
        }

        // Run build_runner if needed (MobX or AutoRoute)
        const needsBuild = buildConfig(combo).navigation === "auto_route" || buildConfig(combo).stateManagement === "mobx";
        if (needsBuild) {
            console.log("  Running build_runner...");
            const buildRunner = await $`cd ${targetDir} && dart run build_runner build --delete-conflicting-outputs`.nothrow().quiet();
            if (buildRunner.exitCode !== 0) {
                console.error("  ❌ FAILED: build_runner");
                console.error(buildRunner.stdout.toString());
                console.error(buildRunner.stderr.toString());
                failedLogs.push(`FAIL: ${label} (build_runner)\n${buildRunner.stdout.toString()}\n${buildRunner.stderr.toString()}`);
                failCount++;
                continue;
            }
        }

        // Run analyze
        console.log("  Running dart analyze...")
        const analyze = await $`cd ${targetDir} && dart analyze --fatal-infos`.nothrow().quiet()
        if (analyze.exitCode !== 0) {
            console.error("  ❌ FAILED: dart analyze")
            console.error(analyze.stdout.toString())
            console.error(analyze.stderr.toString())
            failedLogs.push(`FAIL: ${label} (dart analyze)\n${analyze.stdout.toString()}\n${analyze.stderr.toString()}`)
            failCount++
        } else {
            console.log("  ✅ PASSED")
            passCount++
            if (!KEEP_OUTPUT) {
                await fs.rm(targetDir, { recursive: true, force: true })
            }
        }
    } catch (e) {
        console.error(`  ❌ ERROR during validation: ${e}`)
        failedLogs.push(`FAIL: ${label} (Exception)\n${e}`)
        failCount++
    }
}

const duration = Math.floor((Date.now() - startTime) / 1000)

console.log("============================================================")
console.log("📊 Summary")
console.log(`Total Duration: ${duration}s`)
console.log(`Passed: ${passCount}`)
console.log(`Failed: ${failCount}`)
console.log("============================================================")

const outputDir = path.resolve(process.cwd(), "tests/results/layer2")
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
