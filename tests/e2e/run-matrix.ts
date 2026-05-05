/**
 * run-matrix.ts
 *
 * Orchestrator script that runs validate-combo.ts across multiple combinations.
 *
 * Usage:
 *   bun tests/e2e/run-matrix.ts                    # Run ALL valid combos
 *   bun tests/e2e/run-matrix.ts --critical          # Run critical combos only
 *   bun tests/e2e/run-matrix.ts --range 0-50        # Run combos 0 through 50
 *   bun tests/e2e/run-matrix.ts --concurrency 4     # Parallel workers (default: 1)
 */

import path from "node:path"

import { CRITICAL_COMBOS as CRITICAL_COMBINATIONS } from "../utils/critical-combos"
import { PRIMARY_COMBINATIONS as ALL_COMBINATIONS, COMBO_LABEL as combinationLabel, type PrimaryCombo as Combination } from "../utils/matrix.config"

// ── Parse args ──────────────────────────────────────────────────

interface RunConfig {
    combinations: Combination[]
    concurrency: number
    label: string
}

function parseArgs(): RunConfig {
    const args = process.argv.slice(2)
    let combinations = ALL_COMBINATIONS
    let concurrency = 1
    let label = "all"

    for (let i = 0; i < args.length; i++) {
        switch (args[i]) {
            case "--critical":
                combinations = CRITICAL_COMBINATIONS
                label = "critical"
                break
            case "--range": {
                const range = args[++i]
                const [start, end] = range.split("-").map(Number)
                combinations = ALL_COMBINATIONS.slice(start, end + 1)
                label = `range-${start}-${end}`
                break
            }
            case "--concurrency":
                concurrency = parseInt(args[++i], 10)
                break
        }
    }

    return { combinations, concurrency, label }
}

// ── Runner ──────────────────────────────────────────────────────

interface Result {
    combo: Combination
    label: string
    passed: boolean
    output: string
    durationMs: number
}

import { spawnSync } from "node:child_process"

function validateCombo(combo: Combination): Result {
    const label = combinationLabel(combo)
    const comboJson = JSON.stringify(combo)
    const scriptPath = path.join(__dirname, "validate-combo.ts")
    const start = Date.now()

    try {
        const result = spawnSync(
            "bun",
            [scriptPath, "--json", comboJson],
            {
                encoding: "utf8",
                timeout: 180_000,
                stdio: ["pipe", "pipe", "pipe"],
            }
        )

        const output = (result.stdout || "") + "\n" + (result.stderr || "")

        return {
            combo,
            label,
            passed: result.status === 0,
            output,
            durationMs: Date.now() - start,
        }
    } catch (error: any) {
        const output = error.message || "Unknown error"
        return {
            combo,
            label,
            passed: false,
            output,
            durationMs: Date.now() - start,
        }
    }
}

// ── Main ────────────────────────────────────────────────────────

async function main() {
    const config = parseArgs()

    console.log(`\n${"═".repeat(60)}`)
    console.log(`FlutterInit Matrix Test Runner`)
    console.log(`Mode: ${config.label}`)
    console.log(`Combinations: ${config.combinations.length}`)
    console.log(`Concurrency: ${config.concurrency}`)
    console.log(`${"═".repeat(60)}\n`)

    const results: Result[] = []
    const startTime = Date.now()

    // Sequential execution (concurrency is handled by CI matrix jobs)
    for (let i = 0; i < config.combinations.length; i++) {
        const combo = config.combinations[i]
        const label = combinationLabel(combo)
        console.log(`[${i + 1}/${config.combinations.length}] Testing: ${label}`)

        const result = validateCombo(combo)
        results.push(result)

        const icon = result.passed ? "✅" : "❌"
        console.log(`  ${icon} ${result.durationMs}ms\n`)
    }

    // ── Summary ─────────────────────────────────────────────

    const totalMs = Date.now() - startTime
    const passed = results.filter((r) => r.passed)
    const failed = results.filter((r) => !r.passed)

    console.log(`\n${"═".repeat(60)}`)
    console.log(`Results: ${passed.length}/${results.length} passed (${(totalMs / 1000).toFixed(1)}s)`)

    if (failed.length > 0) {
        console.log(`\n❌ ${failed.length} FAILED:`)
        for (const f of failed) {
            console.log(`  • ${f.label}`)
            // Show first few lines of output for debugging
            const lines = f.output.trim().split("\n").slice(-10)
            for (const line of lines) {
                console.log(`    ${line}`)
            }
        }
        console.log(`${"═".repeat(60)}\n`)
        process.exit(1)
    }

    console.log(`\n✅ All ${results.length} combinations passed!`)
    console.log(`${"═".repeat(60)}\n`)
}

main()
