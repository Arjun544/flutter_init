/**
 * Runs `dart format` on a generated Flutter project directory.
 *
 * Handlebars templates (.hbs) can't be dart-formatted directly — the
 * {{#if}} / {{each}} / {{variable}} syntax isn't valid Dart. Format AFTER
 * rendering: once real .dart files exist on disk, run dart format on that
 * output. Prefer calling this after `dart pub get` / `flutter pub get` when
 * possible — format style can differ before packages resolve.
 */

import { spawn } from "node:child_process"
import { existsSync } from "node:fs"
import { resolve } from "node:path"

export interface FormatResult {
    success: boolean
    /** True when `dart` was not on PATH — formatting was skipped. */
    skipped: boolean
    filesChanged: number
    stdout: string
    stderr: string
}

function runCommand(
    command: string,
    args: string[],
    cwd?: string,
): Promise<{ exitCode: number; stdout: string; stderr: string }> {
    return new Promise((resolvePromise, reject) => {
        const proc = spawn(command, args, {
            cwd,
            shell: process.platform === "win32",
            windowsHide: true,
        })

        let stdout = ""
        let stderr = ""
        proc.stdout?.on("data", (chunk: Buffer | string) => {
            stdout += chunk.toString()
        })
        proc.stderr?.on("data", (chunk: Buffer | string) => {
            stderr += chunk.toString()
        })
        proc.on("error", (err) => reject(err))
        proc.on("close", (code) => {
            resolvePromise({
                exitCode: code ?? 1,
                stdout,
                stderr,
            })
        })
    })
}

export async function dartIsAvailable(): Promise<boolean> {
    try {
        const { exitCode } = await runCommand("dart", ["--version"])
        return exitCode === 0
    } catch {
        return false
    }
}

function countChangedFiles(stdout: string, stderr: string): number {
    const text = `${stdout}\n${stderr}`
    const changedLines = text
        .split(/\r?\n/)
        .filter((line) => /^Changed\s+/i.test(line) || /^Formatted\s+\S+/i.test(line) && !/^Formatted\s+\d+\s+files?/i.test(line))
    if (changedLines.length > 0) return changedLines.length

    const summary = text.match(/Formatted\s+\d+\s+files?\s+\((\d+)\s+changed\)/i)
    if (summary) return Number(summary[1])
    return 0
}

export async function formatGeneratedProject(
    projectDir: string,
    opts: {
        lineLength?: number
        setExitIfChanged?: boolean
        /** When true (default), missing dart returns skipped instead of throwing. */
        allowSkip?: boolean
    } = {},
): Promise<FormatResult> {
    const dir = resolve(projectDir)
    const allowSkip = opts.allowSkip !== false

    if (!existsSync(dir)) {
        throw new Error(`Directory does not exist: ${dir}`)
    }

    if (!(await dartIsAvailable())) {
        if (allowSkip) {
            return {
                success: true,
                skipped: true,
                filesChanged: 0,
                stdout: "",
                stderr: "dart executable not found on PATH — formatting skipped",
            }
        }
        throw new Error(
            "dart executable not found on PATH. Formatting skipped — generated project will keep raw template spacing.",
        )
    }

    const args = ["format"]
    if (opts.lineLength) {
        args.push("--line-length", String(opts.lineLength))
    }
    if (opts.setExitIfChanged) {
        args.push("--set-exit-if-changed")
    }
    args.push(".")

    const { exitCode, stdout, stderr } = await runCommand("dart", args, dir)

    return {
        success: exitCode === 0,
        skipped: false,
        filesChanged: countChangedFiles(stdout, stderr),
        stdout,
        stderr,
    }
}
