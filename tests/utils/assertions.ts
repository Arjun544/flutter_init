/**
 * assertions.ts
 *
 * Shared assertion helpers used across all test layers.
 * Each helper is designed to produce clear, actionable failure messages.
 */

import { parse as parseYaml } from "yaml"

// ── Token cleanliness ───────────────────────────────────────────────

/**
 * Patterns that indicate unresolved Handlebars tokens.
 * Triple-braces ({{{ }}}) are checked first since they are a superset.
 */
const HANDLEBARS_PATTERNS = [
    /\{\{\{[^}]+\}\}\}/g, // triple-brace (unescaped)
    /\{\{[#/][^}]+\}\}/g, // block helpers ({{#if ...}}, {{/if}})
    /\{\{[^!][^}]*\}\}/g, // regular tokens (excludes {{! comments }})
]

export interface TokenViolation {
    file: string
    match: string
    line: number
}

/**
 * Scans all files for unresolved Handlebars tokens.
 * Returns an array of violations — empty means clean.
 */
export function findUnresolvedTokens(
    files: Map<string, string>
): TokenViolation[] {
    const violations: TokenViolation[] = []

    for (const [filePath, content] of files) {
        // Skip binary-looking files
        if (filePath.endsWith(".png") || filePath.endsWith(".jpg") || filePath.endsWith(".ico")) {
            continue
        }

        const lines = content.split("\n")
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i]
            for (const pattern of HANDLEBARS_PATTERNS) {
                // Reset regex state
                pattern.lastIndex = 0
                let match: RegExpExecArray | null
                while ((match = pattern.exec(line)) !== null) {
                    violations.push({
                        file: filePath,
                        match: match[0],
                        line: i + 1,
                    })
                }
            }
        }
    }

    return violations
}

/**
 * Assert helper: throws with a descriptive message if unresolved tokens found.
 */
export function assertNoUnresolvedTokens(files: Map<string, string>): void {
    const violations = findUnresolvedTokens(files)
    if (violations.length > 0) {
        const details = violations
            .slice(0, 10) // cap output for readability
            .map((v) => `  ${v.file}:${v.line} → ${v.match}`)
            .join("\n")
        const extra = violations.length > 10 ? `\n  ... and ${violations.length - 10} more` : ""
        throw new Error(
            `Found ${violations.length} unresolved Handlebars token(s):\n${details}${extra}`
        )
    }
}

// ── Empty file detection ────────────────────────────────────────────

export function findEmptyFiles(files: Map<string, string>): string[] {
    const empty: string[] = []
    const ignorableNames = [
        ".keep",
        ".gitkeep",
        "flutter_native_splash.yaml",
        "screen_util_wrapper.dart",
        "hooks.dart",
        "services.dart",
        "widgets.dart",
        "wrappers.dart",
        "imports.dart",
        "core_imports.dart",
        "packages_imports.dart",
    ]

    for (const [filePath, content] of files) {
        const basename = filePath.split("/").pop()!
        if (ignorableNames.includes(basename)) {
            continue
        }
        // Skip anything in hooks directory
        if (filePath.includes("/shared/hooks/")) {
            continue
        }

        if (content.trim().length === 0) {
            empty.push(filePath)
        }
    }
    return empty
}

export function assertNoEmptyFiles(files: Map<string, string>): void {
    const empty = findEmptyFiles(files)
    if (empty.length > 0) {
        throw new Error(
            `Found ${empty.length} empty file(s):\n${empty.map((f) => `  ${f}`).join("\n")}`
        )
    }
}

// ── Required files ──────────────────────────────────────────────────

const ALWAYS_REQUIRED_FILES = [
    "pubspec.yaml",
    "lib/main.dart",
    "analysis_options.yaml",
    "AGENTS.md",
    "DESIGN.md",
    ".cursor/rules/flutter-project.mdc",
]

export function assertRequiredFilesExist(files: Map<string, string>): void {
    const filePaths = [...files.keys()]
    const missing: string[] = []

    for (const required of ALWAYS_REQUIRED_FILES) {
        const found = filePaths.some(
            (f) => f === required || f.endsWith(`/${required}`)
        )
        if (!found) {
            missing.push(required)
        }
    }

    if (missing.length > 0) {
        throw new Error(
            `Missing required file(s):\n${missing.map((f) => `  ${f}`).join("\n")}`
        )
    }
}

// ── Dependency assertions ───────────────────────────────────────────

/**
 * Parse the pubspec.yaml content and return the dependency names as Sets.
 */
export function parsePubspecDeps(pubspecContent: string): {
    dependencies: Set<string>
    devDependencies: Set<string>
} {
    const doc = parseYaml(pubspecContent) as Record<string, unknown>
    const deps = doc.dependencies as Record<string, unknown> | undefined
    const devDeps = doc.dev_dependencies as Record<string, unknown> | undefined

    return {
        dependencies: new Set(deps ? Object.keys(deps) : []),
        devDependencies: new Set(devDeps ? Object.keys(devDeps) : []),
    }
}

/**
 * Assert a package IS present in the dependencies section.
 */
export function assertDependencyPresent(
    pubspecContent: string,
    packageName: string
): void {
    const { dependencies, devDependencies } = parsePubspecDeps(pubspecContent)
    if (!dependencies.has(packageName) && !devDependencies.has(packageName)) {
        throw new Error(
            `Expected package "${packageName}" to be in pubspec.yaml dependencies, but it was not found.`
        )
    }
}

/**
 * Assert a package IS NOT present in the dependencies section.
 */
export function assertDependencyAbsent(
    pubspecContent: string,
    packageName: string
): void {
    const { dependencies, devDependencies } = parsePubspecDeps(pubspecContent)
    if (dependencies.has(packageName) || devDependencies.has(packageName)) {
        throw new Error(
            `Expected package "${packageName}" to NOT be in pubspec.yaml, but it was found. (Option bleed)`
        )
    }
}

/**
 * Assert the pubspec.yaml content is valid YAML and has the basic structure.
 */
export function assertValidPubspec(pubspecContent: string): void {
    let doc: Record<string, unknown>
    try {
        doc = parseYaml(pubspecContent) as Record<string, unknown>
    } catch (e) {
        throw new Error(`pubspec.yaml is not valid YAML: ${(e as Error).message}`)
    }

    if (!doc.name || typeof doc.name !== "string") {
        throw new Error("pubspec.yaml missing 'name' field")
    }
    if (!doc.environment) {
        throw new Error("pubspec.yaml missing 'environment' field")
    }
    if (!doc.dependencies) {
        throw new Error("pubspec.yaml missing 'dependencies' field")
    }

    // Verify all dependency versions match semver-ish pattern
    const deps = doc.dependencies as Record<string, unknown>
    for (const [pkg, version] of Object.entries(deps)) {
        if (typeof version === "string") {
            // Must start with ^ or >= or be a semver range
            if (!version.match(/^[\^~>=<\s]*\d+\.\d+/)) {
                throw new Error(
                    `pubspec.yaml dependency "${pkg}" has invalid version: "${version}"`
                )
            }
        }
        // SDK dependencies (like flutter) are objects — skip those
    }
}

// ── Architecture structure assertions ───────────────────────────────

const ARCHITECTURE_MARKERS: Record<string, { required: string[]; forbidden: string[] }> = {
    clean: {
        required: ["domain", "data", "presentation"],
        forbidden: [],
    },
    mvvm: {
        required: ["ui", "data"],
        forbidden: [],
    },
    mvc: {
        required: ["models", "views", "controllers"],
        forbidden: [],
    },
    "feature-first": {
        required: ["features"],
        forbidden: [],
    },
    "layer-first": {
        required: ["data", "domain", "presentation"],
        forbidden: [],
    },
}

/**
 * Assert the generated file tree contains architecture-appropriate directories.
 */
export function assertArchitectureStructure(
    files: Map<string, string>,
    architecture: string
): void {
    const markers = ARCHITECTURE_MARKERS[architecture]
    if (!markers) return // no markers defined for this architecture

    const filePaths = [...files.keys()]

    for (const required of markers.required) {
        const found = filePaths.some((f) => f.includes(`/${required}/`) || f.includes(`/${required}`))
        if (!found) {
            throw new Error(
                `Architecture "${architecture}" should contain "${required}" in the file tree, but it was not found.`
            )
        }
    }
}

// ── Content assertions ──────────────────────────────────────────────

/**
 * Assert that a specific file contains a pattern (string or regex).
 */
export function assertFileContains(
    files: Map<string, string>,
    filePath: string,
    pattern: string | RegExp
): void {
    const matchingEntry = [...files.entries()].find(
        ([f]) => f === filePath || f.endsWith(`/${filePath}`)
    )

    if (!matchingEntry) {
        throw new Error(`File "${filePath}" not found in generated output.`)
    }

    const [, content] = matchingEntry
    const matches =
        typeof pattern === "string"
            ? content.includes(pattern)
            : pattern.test(content)

    if (!matches) {
        throw new Error(
            `File "${filePath}" does not contain expected pattern: ${pattern}`
        )
    }
}

/**
 * Assert that a specific file does NOT contain a pattern.
 */
export function assertFileNotContains(
    files: Map<string, string>,
    filePath: string,
    pattern: string | RegExp
): void {
    const matchingEntry = [...files.entries()].find(
        ([f]) => f === filePath || f.endsWith(`/${filePath}`)
    )

    if (!matchingEntry) return // File not found = not containing the pattern

    const [, content] = matchingEntry
    const matches =
        typeof pattern === "string"
            ? content.includes(pattern)
            : pattern.test(content)

    if (matches) {
        throw new Error(
            `File "${filePath}" should NOT contain pattern: ${pattern}`
        )
    }
}

/**
 * Get the content of a file from the generated file map.
 * Matches on exact path or suffix.
 */
export function getFileContent(
    files: Map<string, string>,
    filePath: string
): string | undefined {
    for (const [f, content] of files) {
        if (f === filePath || f.endsWith(`/${filePath}`)) {
            return content
        }
    }
    return undefined
}
