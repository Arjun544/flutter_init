import fs from "node:fs/promises"
import os from "node:os"
import path from "node:path"

import JSZip from "jszip"

import { ScaffoldConfig, scaffoldConfigSchema } from "../config/schema"

import { createHandlebarsEnvironment } from "./handlebars"

type TemplateContext = ScaffoldConfig & {
    flags: {
        appSlug: string
        appSnake: string
        routerPackage?: "go_router" | "auto_route"
        usesRouting: boolean
        isRiverpod: boolean
        isProvider: boolean
        isBloc: boolean
        isGetX: boolean
        isMobX: boolean
        usesFirebase: boolean
        usesSupabase: boolean
        usesAppwrite: boolean
        usesCustomRest: boolean
        usesDio: boolean
        usesHttp: boolean
        usesHive: boolean
        usesSharedPreferences: boolean
        usesDotenv: boolean
        usesLogger: boolean
        supportsLocalization: boolean
        hasFlavors: boolean
        hasDarkMode: boolean
        usesGoogleFont: boolean
    }
}

export async function generateFlutterScaffold(input: unknown) {
    const config = scaffoldConfigSchema.parse(input)
    const context = buildTemplateContext(config)

    const templatesRoot = path.join(process.cwd(), "templates", "flutter")
    const baseDir = path.join(templatesRoot, "base")
    const partialsDir = path.join(templatesRoot, "partials")
    const overlayDirs = await resolveOverlayDirs(templatesRoot, config)

    const hbs = await createHandlebarsEnvironment(partialsDir)
    const workingDir = await fs.mkdtemp(
        path.join(os.tmpdir(), "flutter-scaffold-")
    )

    try {
        await composeLayers([baseDir, ...overlayDirs], workingDir, hbs, context)
        const zipBuffer = await zipDirectory(workingDir)
        return zipBuffer
    } finally {
        await fs.rm(workingDir, { recursive: true, force: true }).catch(() => { })
    }
}

function buildTemplateContext(config: ScaffoldConfig): TemplateContext {
    const appSlug = config.appName.trim().replace(/\\s+/g, "-").toLowerCase()
    const appSnake = config.appName.trim().replace(/\\s+/g, "_").toLowerCase()
    const routerPackage =
        config.navigation === "go_router"
            ? "go_router"
            : config.navigation === "auto_route"
                ? "auto_route"
                : undefined

    return {
        ...config,
        flags: {
            appSlug,
            appSnake,
            routerPackage,
            usesRouting: Boolean(routerPackage),
            isRiverpod: config.stateManagement === "riverpod",
            isProvider: config.stateManagement === "provider",
            isBloc: config.stateManagement === "bloc",
            isGetX: config.stateManagement === "getx",
            isMobX: config.stateManagement === "mobx",
            usesFirebase: config.backend.provider === "firebase",
            usesSupabase: config.backend.provider === "supabase",
            usesAppwrite: config.backend.provider === "appwrite",
            usesCustomRest: config.backend.provider === "customRest",
            usesDio: config.commonPackages.dio,
            usesHttp: config.commonPackages.http,

            usesHive: config.commonPackages.hive,
            usesSharedPreferences: config.commonPackages.sharedPreferences,
            usesDotenv: config.commonPackages.flutterDotenv,
            usesLogger: config.commonPackages.logger,
            supportsLocalization: config.extras.localization,
            hasFlavors: config.extras.flavors,
            hasDarkMode: config.theme.darkMode.enabled,
            usesGoogleFont: config.theme.font.choice === "google",
        },
    }
}

async function resolveOverlayDirs(
    root: string,
    config: ScaffoldConfig
): Promise<string[]> {
    const overlays: string[] = []
    const candidates: Array<[string, boolean]> = [
        [path.join(root, "overlays", "architecture", config.architecture), true],
        [path.join(root, "overlays", "state", config.stateManagement), true],
        [path.join(root, "overlays", "backend", config.backend.provider), true],
        [
            path.join(root, "overlays", "routing", "go_router"),
            config.navigation === "go_router",
        ],
        [
            path.join(root, "overlays", "routing", "auto_route"),
            config.navigation === "auto_route",
        ],
        [path.join(root, "overlays", "networking", "dio"), config.commonPackages.dio],
        [path.join(root, "overlays", "networking", "http"), config.commonPackages.http],
        [
            path.join(root, "overlays", "extras", "localization"),
            config.extras.localization,
        ],
        [path.join(root, "overlays", "extras", "flavors"), config.extras.flavors],
    ]

    for (const [candidate, enabled] of candidates) {
        if (!enabled) continue
        const exists = await fs
            .stat(candidate)
            .then((s) => s.isDirectory())
            .catch(() => false)
        if (exists) overlays.push(candidate)
    }

    return overlays
}

async function composeLayers(
    layers: string[],
    targetDir: string,
    hbs: typeof import("handlebars"),
    context: TemplateContext
) {
    for (const layer of layers) {
        await copyAndRenderDirectory(layer, targetDir, hbs, context)
    }
}

async function copyAndRenderDirectory(
    sourceDir: string,
    targetDir: string,
    hbs: typeof import("handlebars"),
    context: TemplateContext
) {
    const denyDirs = new Set([
        "android",
        "ios",
        "web",
        "windows",
        "macos",
        "linux",
        "build",
        ".dart_tool",
    ])

    const entries = await fs.readdir(sourceDir, { withFileTypes: true })
    for (const entry of entries) {
        const sourcePath = path.join(sourceDir, entry.name)
        const targetPath = path.join(
            targetDir,
            entry.name.replace(/\.hbs$/, "")
        )

        if (entry.isDirectory()) {
            if (denyDirs.has(entry.name)) continue
            await fs.mkdir(targetPath, { recursive: true })
            await copyAndRenderDirectory(sourcePath, targetPath, hbs, context)
        } else if (entry.isFile()) {
            if (entry.name.endsWith(".hbs")) {
                const templateContent = await fs.readFile(sourcePath, "utf8")
                const template = hbs.compile(templateContent)
                const rendered = template(context)
                await fs.writeFile(targetPath, rendered, "utf8")
            } else {
                const data = await fs.readFile(sourcePath)
                await fs.mkdir(path.dirname(targetPath), { recursive: true })
                await fs.writeFile(targetPath, data)
            }
        }
    }
}

async function zipDirectory(dir: string) {
    const zip = new JSZip()

    async function walk(current: string) {
        const entries = await fs.readdir(current, { withFileTypes: true })
        for (const entry of entries) {
            const fullPath = path.join(current, entry.name)
            const relPath = path.relative(dir, fullPath).replace(/\\/g, "/")
            if (entry.isDirectory()) {
                await walk(fullPath)
            } else if (entry.isFile()) {
                const data = await fs.readFile(fullPath)
                zip.file(relPath, data)
            }
        }
    }

    await walk(dir)
    return zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" })
}

export type { TemplateContext }

