/**
 * generate.ts
 *
 * Thin wrapper around the FlutterInit generator for use in tests.
 * Provides two modes:
 *   - generateToMap(): returns files as a Map<path, content> for in-memory assertions
 *   - generateToDisk(): writes files to disk for Layer 2 Dart validation
 */

import fs from "node:fs/promises"
import path from "node:path"

import JSZip from "jszip"

import type { ScaffoldConfig } from "@/app/lib/config/schema"
import { generateFlutterScaffold } from "@/app/lib/generator"

/**
 * Generate a Flutter scaffold and return all files as a Map.
 * Used by Layer 1 tests for in-memory assertions.
 */
export async function generateToMap(
    config: ScaffoldConfig
): Promise<Map<string, string>> {
    const buffer = await generateFlutterScaffold(config)
    const zip = await JSZip.loadAsync(buffer)

    const files = new Map<string, string>()
    const entries = Object.entries(zip.files)

    for (const [filePath, zipEntry] of entries) {
        if (zipEntry.dir) continue

        // Try to read as text; skip binary files
        try {
            const content = await zipEntry.async("string")
            files.set(filePath, content)
        } catch {
            // Binary file — store empty string to indicate presence
            files.set(filePath, "")
        }
    }

    return files
}

/**
 * Generate a Flutter scaffold and write all files to disk.
 * Used by Layer 2 tests for dart pub get + dart analyze.
 * Returns the list of file paths written.
 */
export async function generateToDisk(
    config: ScaffoldConfig,
    outputDir: string
): Promise<string[]> {
    // Clear directory to avoid stale files from previous runs
    await fs.rm(outputDir, { recursive: true, force: true })
    await fs.mkdir(outputDir, { recursive: true })

    const buffer = await generateFlutterScaffold(config)
    const zip = await JSZip.loadAsync(buffer)

    const writtenPaths: string[] = []

    for (const [filePath, zipEntry] of Object.entries(zip.files)) {
        if (zipEntry.dir) {
            await fs.mkdir(path.join(outputDir, filePath), { recursive: true })
            continue
        }

        const fullPath = path.join(outputDir, filePath)
        await fs.mkdir(path.dirname(fullPath), { recursive: true })

        const data = await zipEntry.async("nodebuffer")
        await fs.writeFile(fullPath, data)
        writtenPaths.push(fullPath)
    }

    return writtenPaths
}

/**
 * Get the pubspec.yaml content from a generated file map.
 * Convenience helper used frequently in tests.
 */
export function getPubspecContent(files: Map<string, string>): string {
    for (const [filePath, content] of files) {
        if (filePath === "pubspec.yaml" || filePath.endsWith("/pubspec.yaml")) {
            return content
        }
    }
    throw new Error("pubspec.yaml not found in generated files")
}

/**
 * Get a specific file's content from a generated file map.
 * Matches on exact path or suffix.
 */
export function getFile(files: Map<string, string>, name: string): string | undefined {
    for (const [filePath, content] of files) {
        if (filePath === name || filePath.endsWith(`/${name}`)) {
            return content
        }
    }
    return undefined
}
