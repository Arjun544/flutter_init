/**
 * Resolve a generated lib/*.dart path back to the winning templates/flutter .hbs
 * (and unwrap {{> partial }} wrappers).
 */
import fs from "node:fs/promises"
import path from "node:path"

import type { ScaffoldConfig } from "@/app/lib/config/schema"
import { selectOverlayKeys } from "@/shared/generator-contract"

export function templatesFlutterRoot(): string {
    return path.join(process.cwd(), "templates", "flutter")
}

export async function resolveOverlayLayerDirs(
    config: ScaffoldConfig,
    templatesRoot = templatesFlutterRoot()
): Promise<string[]> {
    const selection = selectOverlayKeys({
        architecture: config.architecture,
        stateManagement: config.stateManagement,
        navigation: config.navigation,
        backend: {
            provider: config.backend.provider,
            options: config.backend.provider === "none" ? undefined : config.backend.options,
        },
        localizationEnabled: config.localization.enabled,
        usesDotenv: config.misc.usesDotenv,
        usesHive: config.misc.usesHive,
        usesDio: config.misc.usesDio,
        usesHttp: config.misc.usesHttp,
        usesCachedNetworkImage: config.misc.usesCachedNetworkImage,
        usesSecureStorage: config.misc.usesSecureStorage,
        usesSharedPreferences: config.misc.usesSharedPreferences,
        usesPathProvider: config.misc.usesPathProvider,
        usesSharePlus: config.misc.usesSharePlus,
        usesPermissionHandler: config.misc.usesPermissionHandler,
        usesUrlLauncher: config.misc.usesUrlLauncher,
        usesGeolocator: config.misc.usesGeolocator,
        usesImagePicker: config.misc.usesImagePicker,
        usesFilePicker: config.misc.usesFilePicker,
        usesDeviceInfoPlus: config.misc.usesDeviceInfoPlus,
        usesAppVersionUpdate: config.misc.usesAppVersionUpdate,
    })

    const dirs = [path.join(templatesRoot, "base")]
    const candidates: Array<[string, boolean]> = [
        [path.join(templatesRoot, "overlays", "architecture", selection.architecture), true],
        [path.join(templatesRoot, "overlays", "state", selection.state), true],
        [path.join(templatesRoot, "overlays", "backend", selection.backend), true],
        [path.join(templatesRoot, "overlays", "routing", "go_router"), selection.routing === "go_router"],
        [path.join(templatesRoot, "overlays", "routing", "auto_route"), selection.routing === "auto_route"],
        [path.join(templatesRoot, "overlays", "networking", "dio"), selection.networking === "dio"],
        [path.join(templatesRoot, "overlays", "networking", "http"), selection.networking === "http"],
        [path.join(templatesRoot, "overlays", "networking", "cached_image"), selection.cachedImage],
        [path.join(templatesRoot, "overlays", "extras", "localization"), selection.localization],
        ...selection.storage.map(
            (name) => [path.join(templatesRoot, "overlays", "storage", name), true] as [string, boolean]
        ),
        ...selection.utilities.map(
            (name) => [path.join(templatesRoot, "overlays", "utilities", name), true] as [string, boolean]
        ),
        [path.join(templatesRoot, "overlays", "media"), selection.media],
        ...selection.device.map(
            (name) => [path.join(templatesRoot, "overlays", "device", name), true] as [string, boolean]
        ),
        [path.join(templatesRoot, "overlays", "extras", "flavors"), selection.flavors],
        [path.join(templatesRoot, "overlays", "extras", "dotenv"), selection.dotenv],
    ]

    for (const [candidate, enabled] of candidates) {
        if (!enabled) continue
        const exists = await fs
            .stat(candidate)
            .then((s) => s.isDirectory())
            .catch(() => false)
        if (exists) dirs.push(candidate)
    }
    return dirs
}

async function findTemplateInLayer(layerDir: string, relDartPath: string): Promise<string | null> {
    const dir = path.join(layerDir, path.dirname(relDartPath))
    const base = path.basename(relDartPath) // e.g. main.dart
    let entries: string[]
    try {
        entries = await fs.readdir(dir)
    } catch {
        return null
    }
    let found: string | null = null
    for (const entry of entries) {
        if (entry === `${base}.hbs` || entry.endsWith(`@${base}.hbs`)) {
            found = path.join(dir, entry)
        }
    }
    return found
}

/** Last-wins template path for a generated relative dart file. */
export async function resolveWinningTemplate(
    config: ScaffoldConfig,
    relDartPath: string,
    templatesRoot = templatesFlutterRoot()
): Promise<string | null> {
    const normalized = relDartPath.replace(/\\/g, "/")
    const layers = await resolveOverlayLayerDirs(config, templatesRoot)
    let found: string | null = null
    for (const layer of layers) {
        const hit = await findTemplateInLayer(layer, normalized)
        if (hit) found = hit
    }
    return found
}

/** If the template is only `{{> name }}`, return the partial path; else the template itself. */
export async function resolveEditableTemplate(
    config: ScaffoldConfig,
    relDartPath: string,
    templatesRoot = templatesFlutterRoot()
): Promise<string | null> {
    const winning = await resolveWinningTemplate(config, relDartPath, templatesRoot)
    if (!winning) return null

    const content = (await fs.readFile(winning, "utf8")).trim()
    const partialMatch = content.match(/^\{\{>\s*([\w/.\-]+)\s*\}\}$/)
    if (partialMatch) {
        const partialPath = path.join(templatesRoot, "partials", `${partialMatch[1]}.hbs`)
        const exists = await fs
            .stat(partialPath)
            .then((s) => s.isFile())
            .catch(() => false)
        return exists ? partialPath : winning
    }
    return winning
}

/** Copy templates/flutter → cli/templates (Node, no rsync required). */
export async function syncCliTemplates(): Promise<void> {
    const source = templatesFlutterRoot()
    const dest = path.join(process.cwd(), "cli", "templates")

    async function rimraf(dir: string) {
        await fs.rm(dir, { recursive: true, force: true })
    }

    async function copyDir(from: string, to: string) {
        await fs.mkdir(to, { recursive: true })
        const entries = await fs.readdir(from, { withFileTypes: true })
        for (const entry of entries) {
            const src = path.join(from, entry.name)
            const dst = path.join(to, entry.name)
            if (entry.isDirectory()) {
                await copyDir(src, dst)
            } else if (entry.isFile()) {
                await fs.copyFile(src, dst)
            }
        }
    }

    await rimraf(dest)
    await copyDir(source, dest)
}
