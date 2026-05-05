/**
 * dart-validation.spec.ts
 *
 * Vitest wrapper around Layer 2 Dart validation for the critical combos.
 * Skipped automatically if Flutter/Dart SDK is not available.
 *
 * This runs in Tier 2 CI (PR checks) where Flutter is installed.
 */

import { execSync } from "node:child_process"
import fs from "node:fs/promises"
import os from "node:os"
import path from "node:path"

import { beforeAll, describe, it } from "vitest"

import { buildConfig } from "../utils/config-builder"
import { CRITICAL_COMBOS as CRITICAL_COMBINATIONS } from "../utils/critical-combos"
import { generateToDisk } from "../utils/generate"
import { COMBO_LABEL as combinationLabel } from "../utils/matrix.config"

// ── Check if Dart SDK is available ──────────────────────────────

let dartAvailable = false

function checkDart(): boolean {
    try {
        execSync("dart --version", { encoding: "utf8", stdio: "pipe" })
        return true
    } catch {
        return false
    }
}

beforeAll(() => {
    dartAvailable = checkDart()
    if (!dartAvailable) {
        console.warn(
            "\n⚠️  Dart SDK not found. Skipping Layer 2 Dart validation tests.\n" +
            "   Install Flutter/Dart SDK to run these tests locally.\n"
        )
    }
})

// ── Tests ───────────────────────────────────────────────────────

describe("Layer 2 — Dart Validation (Critical Combinations)", { timeout: 3_600_000 }, () => {
    it.each(
        CRITICAL_COMBINATIONS.map((c, i) => [i, combinationLabel(c), c] as const)
    )(
        "combo #%i — %s passes dart analyze",
        { timeout: 120_000 },
        async (_index, _label, combo) => {
            if (!dartAvailable) {
                return // Skip gracefully
            }

            const config = buildConfig(combo)
            const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "flutter-e2e-"))
            const projectDir = path.join(tmpDir, "test_app")
            await fs.mkdir(projectDir, { recursive: true })

            try {
                // Generate to disk
                await generateToDisk(config, projectDir)

                // dart pub get
                try {
                    execSync("dart pub get", {
                        cwd: projectDir,
                        encoding: "utf8",
                        timeout: 120_000,
                        stdio: "pipe",
                    })
                } catch (error: any) {
                    const output = (error.stdout || "") + "\n" + (error.stderr || "")
                    throw new Error(`dart pub get failed:\n${output}`)
                }

                // dart analyze --fatal-infos
                try {
                    execSync("dart analyze --fatal-infos", {
                        cwd: projectDir,
                        encoding: "utf8",
                        timeout: 120_000,
                        stdio: "pipe",
                    })
                } catch (error: any) {
                    const output = (error.stdout || "") + "\n" + (error.stderr || "")
                    throw new Error(`dart analyze failed:\n${output}`)
                }
            } finally {
                await fs.rm(tmpDir, { recursive: true, force: true }).catch(() => { })
            }
        }
    )
}) // 1 hour total for all critical combos
