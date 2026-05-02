import type {
    Reporter,
    SerializedError,
    TestCase,
    TestModule,
    TestSpecification,
    Vitest,
} from "vitest/node"

// ─── ANSI ────────────────────────────────────────────────────────────────────

const C = {
    reset: "\x1b[0m",
    bold: "\x1b[1m",
    dim: "\x1b[2m",
    italic: "\x1b[3m",

    black: "\x1b[30m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
    white: "\x1b[37m",
    gray: "\x1b[90m",

    bgBlack: "\x1b[40m",
    bgRed: "\x1b[41m",
    bgGreen: "\x1b[42m",
    bgBlue: "\x1b[44m",
    bgCyan: "\x1b[46m",

    brightRed: "\x1b[91m",
    brightGreen: "\x1b[92m",
    brightYellow: "\x1b[93m",
    brightBlue: "\x1b[94m",
    brightMagenta: "\x1b[95m",
    brightCyan: "\x1b[96m",
    brightWhite: "\x1b[97m",
}

const b = (s: string) => `${C.bold}${s}${C.reset}`
const d = (s: string) => `${C.dim}${s}${C.reset}`
const g = (s: string) => `${C.brightGreen}${s}${C.reset}`
const r = (s: string) => `${C.brightRed}${s}${C.reset}`
const y = (s: string) => `${C.brightYellow}${s}${C.reset}`
const c = (s: string) => `${C.brightCyan}${s}${C.reset}`
const mg = (s: string) => `${C.brightMagenta}${s}${C.reset}`
const gr = (s: string) => `${C.gray}${s}${C.reset}`
const w = (s: string) => `${C.brightWhite}${s}${C.reset}`

// ─── BOX DRAWING ─────────────────────────────────────────────────────────────

const BOX = {
    tl: "╭", tr: "╮",
    bl: "╰", br: "╯",
    h: "─", v: "│",
    ml: "├", mr: "┤",
    mt: "┬", mb: "┴",
}

const TERMINAL_WIDTH = process.stdout.columns || 80

function line(char = BOX.h, width = TERMINAL_WIDTH - 2) {
    return char.repeat(width)
}

function boxTop(width = TERMINAL_WIDTH) { return `${C.gray}${BOX.tl}${line(BOX.h, width - 2)}${BOX.tr}${C.reset}` }
function boxMid(width = TERMINAL_WIDTH) { return `${C.gray}${BOX.ml}${line(BOX.h, width - 2)}${BOX.mr}${C.reset}` }
function boxBottom(width = TERMINAL_WIDTH) { return `${C.gray}${BOX.bl}${line(BOX.h, width - 2)}${BOX.br}${C.reset}` }

function boxRow(content: string, width = TERMINAL_WIDTH) {
    const visible = stripAnsi(content)
    const pad = width - 2 - visible.length
    return `${C.gray}${BOX.v}${C.reset} ${content}${" ".repeat(Math.max(0, pad - 1))}${C.gray}${BOX.v}${C.reset}`
}

function padCenter(text: string, width: number): string {
    const vis = stripAnsi(text)
    const total = Math.max(0, width - vis.length)
    const left = Math.floor(total / 2)
    const right = total - left
    return " ".repeat(left) + text + " ".repeat(right)
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function stripAnsi(s: string): string {
    return s.replace(/\x1b\[[0-9;]*m/g, "")
}

function formatDuration(ms: number): string {
    if (!ms || !isFinite(ms) || ms <= 0) return "0s"
    const s = Math.floor(ms / 1000)
    const m = Math.floor(s / 60)
    const h = Math.floor(m / 60)
    if (h > 0) return `${h}h ${m % 60}m ${s % 60}s`
    if (m > 0) return `${m}m ${s % 60}s`
    return `${s}s`
}

function formatMs(ms: number): string {
    if (ms < 1000) return `${Math.round(ms)}ms`
    return formatDuration(ms)
}

function shortPath(fullPath: string): string {
    // Show only last 2 path segments
    const parts = fullPath.replace(/\\/g, "/").split("/")
    return parts.slice(-2).join("/")
}

function progressBar(percent: number, width = 28): string {
    const filled = Math.round((percent / 100) * width)
    const empty = width - filled

    const fill = percent === 100
        ? `${C.brightGreen}${"█".repeat(filled)}${C.reset}`
        : filled > 0
            ? `${C.brightCyan}${"█".repeat(filled - 1)}${C.brightWhite}▓${C.reset}`
            : ""

    const emp = `${C.gray}${"░".repeat(empty)}${C.reset}`
    return fill + emp
}

function sparkline(history: number[], width = 10): string {
    const bars = ["▁", "▂", "▃", "▄", "▅", "▆", "▇", "█"]
    const slice = history.slice(-width)
    if (slice.length === 0) return ""
    const max = Math.max(...slice, 1)
    return slice.map(v => {
        const idx = Math.min(7, Math.floor((v / max) * 7))
        return `${C.cyan}${bars[idx]}${C.reset}`
    }).join("")
}

// ─── REPORTER ────────────────────────────────────────────────────────────────

interface FailedTest {
    file: string
    name: string
    error: string
}

interface FileStat {
    name: string
    total: number
    passed: number
    failed: number
    durationMs: number
}

export default class MatrixReporter implements Reporter {
    private startTime = 0
    private totalTests = 0
    private completedTests = 0
    private passedTests = 0
    private failedTests = 0
    private skippedTests = 0

    private currentFile = ""
    private currentTest = ""
    private failures: FailedTest[] = []
    private fileStats: FileStat[] = []
    private activeFileStart = 0

    // Speed tracking
    private speedHistory: number[] = []   // tests/sec samples
    private lastSpeedSample = 0
    private lastSpeedCount = 0

    // Dynamic line tracking
    private progressLines = 0
    private lastRenderLen = 0

    onInit(_vitest: Vitest) {
        this.startTime = Date.now()
        this.render_header()
    }

    onTestRunStart(_specs: ReadonlyArray<TestSpecification>) {
        // total accumulates in onTestModuleCollected
    }

    onTestModuleCollected(mod: TestModule) {
        const count = Array.from(mod.children.allTests()).length
        this.totalTests += count
    }

    onTestModuleStart(mod: TestModule) {
        this.currentFile = shortPath(mod.relativeModuleId)
        this.activeFileStart = Date.now()
    }

    onTestModuleEnd(mod: TestModule) {
        const tests = Array.from(mod.children.allTests())
        const passed = tests.filter(t => t.result()?.state === "passed").length
        const failed = tests.filter(t => t.result()?.state === "failed").length
        const dur = Date.now() - this.activeFileStart

        this.fileStats.push({
            name: shortPath(mod.relativeModuleId),
            total: tests.length,
            passed,
            failed,
            durationMs: dur,
        })
    }

    onTestCaseResult(testCase: TestCase) {
        const state = testCase.result()?.state

        this.completedTests++
        this.currentTest = testCase.name

        if (state === "passed") this.passedTests++
        else if (state === "failed") {
            this.failedTests++
            const err = testCase.result()?.errors?.[0]
            this.failures.push({
                file: this.currentFile,
                name: testCase.name,
                error: err?.message?.split("\n")[0] ?? "Unknown error",
            })
        } else if (state === "skipped") this.skippedTests++

        // Speed sampling every 500ms
        const now = Date.now()
        if (now - this.lastSpeedSample >= 500) {
            const dt = (now - this.lastSpeedSample) / 1000
            const delta = this.completedTests - this.lastSpeedCount
            const tps = delta / dt
            this.speedHistory.push(tps)
            if (this.speedHistory.length > 20) this.speedHistory.shift()
            this.lastSpeedSample = now
            this.lastSpeedCount = this.completedTests
        }

        this.render_progress()
    }

    onTestRunEnd(
        _modules: ReadonlyArray<TestModule>,
        unhandledErrors: ReadonlyArray<SerializedError>
    ) {
        this.clearProgress()
        this.render_summary(unhandledErrors)
    }

    // ─── RENDER: HEADER ────────────────────────────────────────────────────

    private render_header() {
        const W = TERMINAL_WIDTH

        const subtitle = `${C.reset} ${C.brightWhite}FlutterInit Tests${C.reset} ${C.dim}`
        const timestamp = new Date().toLocaleTimeString()

        console.log()
        console.log(boxTop(W))
        console.log(boxRow(""))
        console.log(boxRow(padCenter(subtitle, W - 2)))
        console.log(boxRow(""))
        console.log(boxRow(
            padCenter(
                `${gr("TIMELINE")} ${c(timestamp)}  ${gr("PROCESS")} ${c(String(process.pid))}  ${gr("TARGET")} ${c("Flutter")}`,
                W - 2
            )
        ))
        console.log(boxRow(""))
        console.log(boxBottom(W))
        console.log()
    }

    // ─── RENDER: LIVE PROGRESS ─────────────────────────────────────────────

    private render_progress() {
        const W = TERMINAL_WIDTH
        const now = Date.now()

        const elapsed = now - this.startTime
        const pct = this.totalTests > 0
            ? (this.completedTests / this.totalTests) * 100
            : 0

        const msPerTest = this.completedTests > 0 ? elapsed / this.completedTests : 0
        const remaining = msPerTest * (this.totalTests - this.completedTests)

        const speed = this.speedHistory.length > 0
            ? this.speedHistory[this.speedHistory.length - 1]
            : 0

        // Truncate test name to fit
        const maxName = W - 20
        const testName = this.currentTest.length > maxName
            ? "…" + this.currentTest.slice(-(maxName - 1))
            : this.currentTest

        // Build lines
        const bar = progressBar(pct, 30)
        const pctStr = `${pct.toFixed(1)}%`
        const countStr = `${c(String(this.completedTests))}${gr("/")}${w(String(this.totalTests))}`
        const timeStr = `${g(formatDuration(elapsed))} ${gr("elapsed")}  ~${y(formatDuration(remaining))} ${gr("left")}`
        const speedStr = speed > 0
            ? `${c(speed.toFixed(1))} ${gr("t/s")}  ${sparkline(this.speedHistory, 12)}`
            : gr("calculating…")

        const passStr = `${C.brightGreen}✔ ${this.passedTests}${C.reset}`
        const failStr = this.failedTests > 0
            ? `${C.brightRed}✖ ${this.failedTests}${C.reset}`
            : `${C.gray}✖ 0${C.reset}`
        const skipStr = `${C.yellow}⊘ ${this.skippedTests}${C.reset}`

        const fileStr = `${gr("▸")} ${c(this.currentFile)}`
        const nameStr = `${gr("  ›")} ${d(testName)}`

        // Clear previous render
        this.clearProgress()

        const lines: string[] = [
            "",
            ` ${bar}  ${b(pctStr.padStart(6))}   ${countStr}`,
            ` ${timeStr}`,
            ` ${speedStr}   ${passStr}   ${failStr}   ${skipStr}`,
            "",
            ` ${fileStr}`,
            ` ${nameStr}`,
            "",
        ]

        // Show last failure inline if any
        if (this.failures.length > 0) {
            const last = this.failures[this.failures.length - 1]
            const errLine = `${r("✖ FAIL")}  ${gr(last.file)}  ${d("›")}  ${w(last.name)}`
            const errMsg = `  ${C.red}${C.dim}${last.error.slice(0, W - 6)}${C.reset}`
            lines.push(` ${errLine}`)
            lines.push(` ${errMsg}`)
            lines.push("")
        }

        lines.forEach(l => process.stdout.write(l + "\n"))
        this.progressLines = lines.length
    }

    private clearProgress() {
        if (this.progressLines === 0) return
        // Move cursor up and clear each line
        for (let i = 0; i < this.progressLines; i++) {
            process.stdout.write("\x1b[1A\x1b[2K")
        }
        this.progressLines = 0
    }

    // ─── RENDER: FINAL SUMMARY ─────────────────────────────────────────────

    private render_summary(unhandledErrors: ReadonlyArray<SerializedError>) {
        const W = TERMINAL_WIDTH
        const elapsed = Date.now() - this.startTime
        const allPass = this.failedTests === 0 && unhandledErrors.length === 0

        // ── Header band
        console.log()
        if (allPass) {
            console.log(`${C.bgGreen}${C.black}${C.bold}${padCenter(" ALL TESTS PASSED ", W)}${C.reset}`)
        } else {
            console.log(`${C.bgRed}${C.brightWhite}${C.bold}${padCenter(` ${this.failedTests} TEST${this.failedTests !== 1 ? "S" : ""} FAILED `, W)}${C.reset}`)
        }
        console.log()

        // ── Stats box
        const avgSpeed = this.speedHistory.length > 0
            ? (this.speedHistory.reduce((a, b) => a + b, 0) / this.speedHistory.length).toFixed(1)
            : "—"

        const statRows = [
            [gr("Total Tests"), w(String(this.totalTests))],
            [gr("Passed"), g(`✔  ${this.passedTests}`)],
            [gr("Failed"), this.failedTests > 0 ? r(`✖  ${this.failedTests}`) : gr("✖  0")],
            [gr("Skipped"), y(`⊘  ${this.skippedTests}`)],
            [gr("Duration"), c(formatDuration(elapsed))],
            [gr("Avg Speed"), c(`${avgSpeed} tests/sec`)],
        ]

        console.log(boxTop(W))
        console.log(boxRow(padCenter(b("  RUN SUMMARY  "), W - 2)))
        console.log(boxMid(W))
        statRows.forEach(([label, value]) => {
            const row = `${label}${" ".repeat(18 - stripAnsi(label).length)}${value}`
            console.log(boxRow(row))
        })

        // ── Sparkline trend
        if (this.speedHistory.length > 3) {
            console.log(boxRow(""))
            const trend = `${gr("Speed trend")}   ${sparkline(this.speedHistory, 30)}`
            console.log(boxRow(trend))
        }
        console.log(boxBottom(W))
        console.log()

        // ── File breakdown
        if (this.fileStats.length > 0) {
            console.log(boxTop(W))
            console.log(boxRow(padCenter(b("  FILE BREAKDOWN  "), W - 2)))
            console.log(boxMid(W))

            const nameW = 36
            const numW = 6
            const header = `${gr("File".padEnd(nameW))}  ${gr("Tests".padStart(numW))}  ${gr("Pass".padStart(numW))}  ${gr("Fail".padStart(numW))}  ${gr("Time".padStart(8))}`
            console.log(boxRow(header))
            console.log(boxRow(gr(line("─", W - 4))))

            this.fileStats.forEach(stat => {
                const nameTrunc = stat.name.length > nameW
                    ? "…" + stat.name.slice(-(nameW - 1))
                    : stat.name.padEnd(nameW)

                const statusIcon = stat.failed > 0 ? r("✖") : g("✔")
                const nameStr = stat.failed > 0 ? r(nameTrunc) : gr(nameTrunc)
                const passStr = g(String(stat.passed).padStart(numW))
                const failStr = stat.failed > 0
                    ? r(String(stat.failed).padStart(numW))
                    : gr(String(0).padStart(numW))
                const timeStr = c(formatMs(stat.durationMs).padStart(8))
                const totalStr = w(String(stat.total).padStart(numW))

                const row = `${statusIcon} ${nameStr}  ${totalStr}  ${passStr}  ${failStr}  ${timeStr}`
                console.log(boxRow(row))
            })
            console.log(boxBottom(W))
            console.log()
        }

        // ── Failures detail
        if (this.failures.length > 0) {
            console.log(boxTop(W))
            console.log(boxRow(padCenter(r(`  ✖  ${this.failures.length} FAILURE${this.failures.length !== 1 ? "S" : ""}  `), W - 2)))
            console.log(boxMid(W))
            console.log(boxRow(""))

            this.failures.forEach((fail, i) => {
                const idx = r(`[${String(i + 1).padStart(2, "0")}]`)
                const file = c(fail.file)
                const name = w(fail.name)
                const errText = fail.error.slice(0, W - 8)
                const err = `${C.red}${C.dim}${errText}${C.reset}`

                console.log(boxRow(`${idx}  ${file}`))
                console.log(boxRow(`      ${name}`))
                console.log(boxRow(`      ${err}`))
                if (i < this.failures.length - 1) {
                    console.log(boxRow(gr(line("╌", W - 6))))
                }
            })
            console.log(boxRow(""))
            console.log(boxBottom(W))
            console.log()
        }

        // ── Unhandled errors
        if (unhandledErrors.length > 0) {
            console.log(boxTop(W))
            console.log(boxRow(padCenter(mg(`  ⚡  ${unhandledErrors.length} UNHANDLED ERROR${unhandledErrors.length !== 1 ? "S" : ""}  `), W - 2)))
            console.log(boxMid(W))
            unhandledErrors.forEach((err, i) => {
                const msg = (err.message ?? "Unknown").split("\n")[0].slice(0, W - 6)
                console.log(boxRow(`${mg(`[${i + 1}]`)}  ${r(msg)}`))
            })
            console.log(boxBottom(W))
            console.log()
        }

        // ── Final verdict
        const verdict = allPass
            ? `${C.brightGreen}${C.bold}  ✔  All ${this.totalTests} tests passed in ${formatDuration(elapsed)}  ${C.reset}`
            : `${C.brightRed}${C.bold}  ✖  ${this.failedTests} failed · ${this.passedTests} passed · ${formatDuration(elapsed)}  ${C.reset}`

        console.log(padCenter(verdict, W))
        console.log()
    }
}