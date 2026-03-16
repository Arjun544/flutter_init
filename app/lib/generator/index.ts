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
        usesSecureStorage: boolean
        usesCachedNetworkImage: boolean
        usesFlutterSvg: boolean
        usesSkeletonizer: boolean
        usesScreenutil: boolean
        usesDotenv: boolean
        usesLogger: boolean
        usesIconsaxPlus: boolean
        usesFlutterRemix: boolean
        usesHugeicons: boolean
        supportsLocalization: boolean
        supportedLocales: string[]
        fallbackLocale: string
        hasFlavors: boolean
        hasDarkMode: boolean
        usesFlutterHooks: boolean
        usesImagePicker: boolean
        usesFilePicker: boolean
        usesPathProvider: boolean
        usesSharePlus: boolean
        usesPermissionHandler: boolean
        usesUrlLauncher: boolean
        usesDeviceInfoPlus: boolean
        usesAppVersionUpdate: boolean
        usesGeolocator: boolean
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

        if (context.flags.supportsLocalization) {
            const translationsDir = path.join(workingDir, "assets", "translations")
            await fs.mkdir(translationsDir, { recursive: true })

            // We read the en.json.hbs template and use it to seed all configured locales
            // In a real scenario, these would ideally hit an API to pre-translate or come out empty.
            const baseTransPath = path.join(templatesRoot, "overlays", "extras", "localization", "assets", "translations", "en.json.hbs")
            let templateContent = "{\n}"
            try {
                templateContent = await fs.readFile(baseTransPath, "utf8")
            } catch (e) {
                // fallback
            }

            const template = hbs.compile(templateContent)
            const rendered = template(context)

            for (const locale of context.flags.supportedLocales) {
                await fs.writeFile(path.join(translationsDir, `${locale}.json`), rendered, "utf8")
            }
        }

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
                : "go_router"

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
            usesDio: config.misc.usesDio,
            usesHttp: config.misc.usesHttp,
            usesHive: config.misc.usesHive,
            usesSharedPreferences: config.misc.usesSharedPreferences,
            usesSecureStorage: config.misc.usesSecureStorage,
            usesCachedNetworkImage: config.misc.usesCachedNetworkImage,
            usesFlutterSvg: config.misc.usesFlutterSvg,
            usesSkeletonizer: config.misc.usesSkeletonizer,
            usesScreenutil: config.misc.usesScreenutil,
            usesDotenv: config.misc.usesDotenv,
            usesLogger: config.misc.usesLogger,
            supportsLocalization: config.localization.enabled,
            supportedLocales: config.localization.supportedLocales.length > 0 ? config.localization.supportedLocales : ["en"],
            fallbackLocale: config.localization.supportedLocales.length > 0 ? config.localization.supportedLocales[0] : "en",
            hasFlavors: true,
            hasDarkMode: config.theme.darkMode.enabled,
            usesIconsaxPlus: config.icons.iconsax_plus,
            usesFlutterRemix: config.icons.flutter_remix,
            usesHugeicons: config.icons.hugeicons,
            usesFlutterHooks: config.misc.usesFlutterHooks,
            usesImagePicker: config.misc.usesImagePicker,
            usesFilePicker: config.misc.usesFilePicker,
            usesPathProvider: config.misc.usesPathProvider,
            usesSharePlus: config.misc.usesSharePlus,
            usesPermissionHandler: config.misc.usesPermissionHandler,
            usesUrlLauncher: config.misc.usesUrlLauncher,
            usesDeviceInfoPlus: config.misc.usesDeviceInfoPlus,
            usesAppVersionUpdate: config.misc.usesAppVersionUpdate,
            usesGeolocator: config.misc.usesGeolocator,
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
        [path.join(root, "overlays", "networking", "dio"), config.misc.usesDio],
        [
            path.join(root, "overlays", "networking", "http"),
            config.misc.usesHttp && !config.misc.usesDio,
        ],
        [
            path.join(root, "overlays", "networking", "cached_image"),
            config.misc.usesCachedNetworkImage,
        ],
        [path.join(root, "overlays", "extras", "localization"), config.localization.enabled],
        [path.join(root, "overlays", "storage", "secure_storage"), config.misc.usesSecureStorage],
        [path.join(root, "overlays", "storage", "hive"), config.misc.usesHive],
        [path.join(root, "overlays", "storage", "shared_preferences"), config.misc.usesSharedPreferences],
        [path.join(root, "overlays", "utilities", "path_provider"), config.misc.usesPathProvider],
        [path.join(root, "overlays", "utilities", "share_plus"), config.misc.usesSharePlus],
        [path.join(root, "overlays", "utilities", "permission_handler"), config.misc.usesPermissionHandler],
        [path.join(root, "overlays", "utilities", "url_launcher"), config.misc.usesUrlLauncher],
        [path.join(root, "overlays", "utilities", "geolocator"), config.misc.usesGeolocator],
        [
            path.join(root, "overlays", "media"),
            config.misc.usesImagePicker || config.misc.usesFilePicker,
        ],
        [
            path.join(root, "overlays", "device", "device_info"),
            config.misc.usesDeviceInfoPlus,
        ],
        [
            path.join(root, "overlays", "device", "app_version_update"),
            config.misc.usesAppVersionUpdate,
        ],
        [path.join(root, "overlays", "extras", "flavors"), true],
        [path.join(root, "overlays", "extras", "dotenv"), config.misc.usesDotenv],
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
                let templateContent = ""
                try {
                    templateContent = await fs.readFile(sourcePath, "utf8")
                    const template = hbs.compile(templateContent)
                    const rendered = template(context)
                    await fs.writeFile(targetPath, rendered, "utf8")
                } catch (e: any) {
                    console.error("Template rendering failed for file:", sourcePath)
                    console.error("Template content:", templateContent)
                    throw e;
                }
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

