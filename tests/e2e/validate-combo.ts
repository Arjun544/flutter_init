/**
 * validate-combo.ts
 *
 * Standalone CLI script that validates a single combination
 * by generating it to disk and running dart pub get + dart analyze.
 *
 * Usage:
 *   bun tests/e2e/validate-combo.ts <combo-index>
 *   bun tests/e2e/validate-combo.ts --json '<combo-json>'
 *
 * Exit codes:
 *   0 — pass
 *   1 — dart pub get or dart analyze failed
 *   2 — generation failed
 */

import { execSync } from "node:child_process"
import fs from "node:fs/promises"
import os from "node:os"
import path from "node:path"

import { buildConfig } from "../utils/config-builder"
import { PRIMARY_COMBINATIONS as ALL_COMBINATIONS, COMBO_LABEL as combinationLabel, type PrimaryCombo as Combination } from "../utils/matrix.config"
import { deriveGeneratorCapabilities } from "../../shared/generator-contract"

// ── Parse CLI args ──────────────────────────────────────────────

function parseCombination(): Combination {
    const args = process.argv.slice(2)

    if (args[0] === "--json") {
        return JSON.parse(args[1]) as Combination
    }

    const index = parseInt(args[0], 10)
    if (isNaN(index) || index < 0 || index >= ALL_COMBINATIONS.length) {
        console.error(`Usage: bun tests/e2e/validate-combo.ts <index 0-${ALL_COMBINATIONS.length - 1}>`)
        console.error(`       bun tests/e2e/validate-combo.ts --json '{"architecture":"clean",...}'`)
        process.exit(2)
    }

    return ALL_COMBINATIONS[index]
}

// ── Helpers ─────────────────────────────────────────────────────

function runCommand(cmd: string, cwd: string): { success: boolean; output: string } {
    try {
        const output = execSync(cmd, {
            cwd,
            encoding: "utf8",
            timeout: 120_000,
            stdio: ["pipe", "pipe", "pipe"],
        })
        return { success: true, output }
    } catch (error: any) {
        const output = (error.stdout || "") + "\n" + (error.stderr || "")
        return { success: false, output }
    }
}

// ── Main ────────────────────────────────────────────────────────

async function main() {
    const combo = parseCombination()
    const label = combinationLabel(combo)
    const config = buildConfig(combo, (combo as any).miscProfile)

    console.log(`\n${"═".repeat(60)}`)
    console.log(`Validating: ${label}`)
    console.log(`${"═".repeat(60)}\n`)

    // 1. Generate project to temp directory
    const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "flutter-test-"))
    const projectDir = path.join(tmpDir, "test_app")
    await fs.mkdir(projectDir, { recursive: true })
    const keepOutput = process.argv.includes("--keep-output")
    let passed = false

    try {
        // Import and run generation
        const { generateToDisk } = await import("../utils/generate")
        await generateToDisk(config, projectDir)
        console.log("✓ Project generated successfully")

        // 2. dart pub get
        console.log("\nRunning dart pub get...")
        const pubGetResult = runCommand("dart pub get", projectDir)
        if (!pubGetResult.success) {
            throw new Error(`dart pub get FAILED\n${pubGetResult.output}`)
        }
        console.log("✓ dart pub get passed")

        // 2.5 dart run build_runner build (if needed)
        const needsBuild = deriveGeneratorCapabilities({
            stateManagement: config.stateManagement,
            navigation: config.navigation,
            backend: {
                provider: config.backend.provider,
                options: config.backend.provider === "none"
                    ? undefined
                    : config.backend.options,
            },
            localizationEnabled: config.localization.enabled,
            usesDotenv: config.misc.usesDotenv,
            usesHive: config.misc.usesHive,
        }).requiresCodeGeneration
        if (needsBuild) {
            console.log("\nRunning build_runner...")
            const buildResult = runCommand("dart run build_runner build --delete-conflicting-outputs", projectDir)
            if (!buildResult.success) {
                throw new Error(`build_runner FAILED\n${buildResult.output}`)
            }
            console.log("✓ build_runner passed")
        }

        // 3. dart analyze --fatal-infos
        console.log("\nRunning dart analyze --fatal-infos...")
        const analyzeResult = runCommand("dart analyze --fatal-infos", projectDir)
        if (!analyzeResult.success) {
            throw new Error(`dart analyze FAILED\n${analyzeResult.output}`)
        }
        console.log("✓ dart analyze passed")

        console.log("\nRunning flutter test...")
        const testResult = runCommand("flutter test", projectDir)
        if (!testResult.success) {
            if (testResult.output.includes("Building with plugins requires symlink support")) {
                console.warn("⚠ flutter test skipped: Windows symlink support is disabled")
            } else {
                throw new Error(`flutter test FAILED\n${testResult.output}`)
            }
        } else {
            console.log("✓ flutter test passed")
        }
        passed = true
        console.log(`\n✅ PASS: ${label}\n`)
    } catch (error) {
        console.error(`\n❌ Generation failed for ${label}:`)
        console.error(error)
        process.exitCode = 2
    } finally {
        if (keepOutput || !passed) {
            console.log(`\nKept generated project at: ${projectDir}`)
        } else {
            await fs.rm(tmpDir, { recursive: true, force: true }).catch(() => { })
        }
    }
}

main()
