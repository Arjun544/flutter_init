#!/usr/bin/env node
/**
 * Bumps cli/package.json version and prepends a Keep-a-Changelog section
 * using OpenAI, based on commits/diffs since the previous push tip.
 *
 * Env:
 *   OPENAI_API_KEY  (required)
 *   OPENAI_MODEL    (optional, default gpt-4o-mini)
 *   BEFORE_SHA      (optional) previous tip; empty/zeros → last commit only
 *   AFTER_SHA       (optional) current tip; default HEAD
 */
import { execFileSync } from "node:child_process"
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const CLI_PKG_PATH = path.join(ROOT, "cli", "package.json")
const CHANGELOG_PATH = path.join(ROOT, "CHANGELOG.md")
const MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini"
const API_KEY = process.env.OPENAI_API_KEY

if (!API_KEY) {
  console.error("OPENAI_API_KEY is required")
  process.exit(1)
}

function git(args) {
  return execFileSync("git", args, {
    cwd: ROOT,
    encoding: "utf8",
    maxBuffer: 20 * 1024 * 1024,
  }).trim()
}

function isZeroSha(sha) {
  return !sha || /^0+$/.test(sha)
}

function bumpSemver(version, bump) {
  const parts = version.split(".").map((n) => Number.parseInt(n, 10))
  if (parts.length !== 3 || parts.some((n) => Number.isNaN(n))) {
    throw new Error(`Invalid semver in cli/package.json: ${version}`)
  }
  let [major, minor, patch] = parts
  if (bump === "major") {
    major += 1
    minor = 0
    patch = 0
  } else if (bump === "minor") {
    minor += 1
    patch = 0
  } else {
    patch += 1
  }
  return `${major}.${minor}.${patch}`
}

function todayUTC() {
  return new Date().toISOString().slice(0, 10)
}

function collectRange() {
  const after = process.env.AFTER_SHA || git(["rev-parse", "HEAD"])
  const before = process.env.BEFORE_SHA || ""

  if (isZeroSha(before)) {
    // First push / empty before — summarize only the tip commit.
    return { range: `${after}^!`, after }
  }

  // Inclusive of commits reachable from after but not before.
  return { range: `${before}..${after}`, after }
}

function collectGitContext(range) {
  let log = ""
  let diff = ""
  try {
    log = git(["log", "--pretty=format:%h %s%n%b%n---", range])
  } catch {
    log = git(["log", "-1", "--pretty=format:%h %s%n%b"])
  }

  try {
    if (range.endsWith("^!")) {
      diff = git(["show", "--stat", "-U2", "--format=", range.slice(0, -2)])
    } else {
      diff = git(["diff", "--stat", "-U2", range])
    }
  } catch {
    try {
      diff = git(["show", "--stat", "-U2", "--format=", "HEAD"])
    } catch {
      diff = "(diff unavailable)"
    }
  }

  // Cap payload size for the API.
  const MAX = 60_000
  if (diff.length > MAX) {
    diff = `${diff.slice(0, MAX)}\n…(truncated)`
  }
  if (log.length > 20_000) {
    log = `${log.slice(0, 20_000)}\n…(truncated)`
  }

  return { log, diff }
}

const SYSTEM_PROMPT = `You maintain the FlutterInit product changelog and version bumps.

FlutterInit is a Flutter project scaffolder (web wizard at /create + CLI create-flutterinit).
The public product version lives in cli/package.json and is shown on /create.

Return ONLY valid JSON with this shape:
{
  "bump": "patch" | "minor" | "major",
  "lede": "1-2 sentence user-facing summary",
  "sections": {
    "Added": ["…"],
    "Changed": ["…"],
    "Fixed": ["…"],
    "Removed": ["…"],
    "Internal": ["…"]
  }
}

Rules:
- Default bump is "patch". Use "minor" for new user-facing capability. Use "major" only for clearly breaking product changes.
- Always bump on every push; if changes are internal-only, set bump "patch", put one short bullet under Internal, and leave other arrays empty.
- Write for builders using FlutterInit — outcomes, not file lists. Name wizard steps, CLI flags, or paths only when useful.
- No filler ("various improvements", "updated files", "misc changes"). No emoji.
- Bullets ≤ ~100 characters, one idea each.
- Omit empty section keys you do not need; Internal only when there is nothing user-facing.
- Never invent features that are not evidenced by the commits/diff.`

async function askOpenAI({ version, log, diff }) {
  const user = `Current version: ${version}

Commits:
${log || "(none)"}

Diff summary:
${diff || "(none)"}`

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: user },
      ],
    }),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`OpenAI API error ${res.status}: ${text}`)
  }

  const data = await res.json()
  const content = data.choices?.[0]?.message?.content
  if (!content) throw new Error("OpenAI returned empty content")

  const parsed = JSON.parse(content)
  const bump = ["major", "minor", "patch"].includes(parsed.bump)
    ? parsed.bump
    : "patch"
  const lede =
    typeof parsed.lede === "string" && parsed.lede.trim()
      ? parsed.lede.trim()
      : "Maintenance update."
  const sections = parsed.sections && typeof parsed.sections === "object"
    ? parsed.sections
    : { Internal: ["Maintenance update."] }

  return { bump, lede, sections }
}

function formatSection(version, date, lede, sections) {
  const order = ["Added", "Changed", "Fixed", "Removed", "Internal"]
  const lines = [`## [${version}] - ${date}`, "", lede, ""]

  for (const key of order) {
    const items = sections[key]
    if (!Array.isArray(items) || items.length === 0) continue
    lines.push(`### ${key}`, "")
    for (const item of items) {
      const text = String(item).replace(/^\s*[-*]\s*/, "").trim()
      if (text) lines.push(`- ${text}`)
    }
    lines.push("")
  }

  return lines.join("\n").trimEnd() + "\n"
}

function upsertChangelog(sectionMarkdown) {
  const header = `# Changelog

User-facing changes to FlutterInit (wizard, CLI, scaffolds, and docs that affect builders).
The version on [/create](https://flutterinit.com/create) tracks \`cli/package.json\` and advances on every push to \`main\`.

`

  let existing = ""
  if (fs.existsSync(CHANGELOG_PATH)) {
    existing = fs.readFileSync(CHANGELOG_PATH, "utf8")
    // Drop the top title/intro so we re-seed a stable header.
    existing = existing.replace(/^# Changelog\r?\n[\s\S]*?(?=\n## )/, "")
  }

  const next = header + sectionMarkdown + (existing.startsWith("\n") ? existing : `\n${existing}`)
  fs.writeFileSync(CHANGELOG_PATH, next.replace(/\n{3,}/g, "\n\n"), "utf8")
}

function writeVersion(pkg, nextVersion) {
  pkg.version = nextVersion
  fs.writeFileSync(CLI_PKG_PATH, `${JSON.stringify(pkg, null, 2)}\n`, "utf8")
}

async function main() {
  const pkg = JSON.parse(fs.readFileSync(CLI_PKG_PATH, "utf8"))
  const current = pkg.version
  const { range } = collectRange()
  const { log, diff } = collectGitContext(range)

  console.log(`Analyzing range: ${range}`)
  console.log(`Current version: ${current}`)

  const { bump, lede, sections } = await askOpenAI({ version: current, log, diff })
  const nextVersion = bumpSemver(current, bump)
  const date = todayUTC()
  const section = formatSection(nextVersion, date, lede, sections)

  writeVersion(pkg, nextVersion)
  upsertChangelog(section)

  // Machine-readable outputs for the workflow.
  const outPath = process.env.GITHUB_OUTPUT
  if (outPath) {
    fs.appendFileSync(
      outPath,
      `version=${nextVersion}\nbump=${bump}\n`,
      "utf8",
    )
  }

  console.log(`Bumped ${current} → ${nextVersion} (${bump})`)
  console.log(section)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
