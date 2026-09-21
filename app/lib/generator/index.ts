import fs from "node:fs/promises"
import os from "node:os"
import path from "node:path"

import JSZip from "jszip"

import { CustomFontEntry, ScaffoldConfig, scaffoldConfigSchema } from "../config/schema"
import { formatGeneratedProject } from "@/shared/format-generated"
import {
    deriveGeneratorCapabilities,
    selectOverlayKeys,
} from "@/shared/generator-contract"

import { createHandlebarsEnvironment } from "./handlebars"

type TemplateContext = ScaffoldConfig & {
    /** Reverse-domain org for `flutter create --org` (derived from packageId). */
    orgName: string
    flags: {
        appSlug: string
        appSnake: string
        routerPackage?: "go_router" | "auto_route" | "getx"
        usesRouting: boolean
        isRiverpod: boolean
        isProvider: boolean
        isBloc: boolean
        isGetX: boolean
        isMobX: boolean
        isNoneState: boolean
        usesFirebase: boolean
        usesSupabase: boolean
        usesAppwrite: boolean
        usesCustomBackend: boolean
        usesDio: boolean
        usesHttp: boolean
        usesHive: boolean
        usesSharedPreferences: boolean
        usesSecureStorage: boolean
        usesCachedNetworkImage: boolean
        usesFlutterSvg: boolean
        usesSkeletonizer: boolean
        usesScreenutil: boolean
        usesFlutterNativeSplash: boolean
        usesLogger: boolean
        usesDotenv: boolean
        usesIconsaxPlus: boolean
        usesFlutterRemix: boolean
        usesHugeicons: boolean
        supportsLocalization: boolean
        supportedLocales: string[]
        fallbackLocale: string
        hasFlavors: boolean
        hasDarkMode: boolean
        isCupertino: boolean
        isCustomTheme: boolean
        isMaterial3: boolean
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
        usesFirebaseAuth: boolean
        usesFirebaseFirestore: boolean
        usesFirebaseRealtimeDb: boolean
        usesFirebaseStorage: boolean
        usesFirebaseAnalytics: boolean
        usesFirebaseCrashlytics: boolean
        usesSupabaseAuth: boolean
        usesSupabaseDb: boolean
        usesSupabaseEdgeFunctions: boolean
        usesAppwriteAuth: boolean
        usesAppwriteDb: boolean
        usesAppwriteStorage: boolean
        requiresCodeGeneration: boolean
        /** True when at least one custom font was uploaded */
        hasCustomFonts: boolean
        /**
         * The first font family name (used as the app-wide fontFamily in ThemeData).
         * Empty string when no custom fonts are uploaded.
         */
        primaryFontFamily: string
        /**
         * Fonts grouped by family name for pubspec.yaml.
         * Each entry = one `family:` block with one or more `fonts:` items.
         * e.g. [{ family: "Inter", fonts: [{ fileName, style, weight }, ...] }]
         */
        fontFamilies: Array<{
            family: string
            fonts: Array<Pick<CustomFontEntry, "fileName" | "style" | "weight">>
        }>
        /** Opt-in shadcn_ui component layer */
        usesShadcn: boolean
        /** Feature screens use ShadApp when true */
        shadcnDefault: boolean
        /** Adaptive / material / cupertino platform style for App widgets */
        platformStyle: "adaptive" | "material" | "cupertino"
    }
}

export type GenerateScaffoldOptions = {
    /** Skip post-render `dart format` (Layer 1 content tests; keeps CI/local fast when Dart is on PATH). */
    skipFormat?: boolean
}

export async function generateFlutterScaffold(
    input: unknown,
    fontEntries: File[] = [],
    options: GenerateScaffoldOptions = {},
) {
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
        // Native platform trees (android/ios/web/desktop) are intentionally
        // omitted from the web ZIP — create them with `flutter create` (CLI
        // does this automatically). See SETUP.md in the generated project.
        await composeLayers([baseDir, ...overlayDirs], workingDir, hbs, context)

        if (context.flags.supportsLocalization) {
            const translationsDir = path.join(workingDir, "assets", "translations")
            await fs.mkdir(translationsDir, { recursive: true })

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

        // Write font binary files into assets/fonts/ one at a time to keep
        // peak memory bounded (sequential rather than Promise.all).
        if (fontEntries.length > 0) {
            const fontsDir = path.join(workingDir, "assets", "fonts")
            await fs.mkdir(fontsDir, { recursive: true })
            const configuredFontNames = new Set(
                (config.theme.customFonts ?? []).map((font) => font.fileName),
            )

            for (const fontFile of fontEntries) {
                const safeName = path.basename(fontFile.name) // strip any path component
                if (!configuredFontNames.has(safeName)) {
                    throw new Error(`Uploaded font "${safeName}" is not declared in the configuration`)
                }
                const destPath = path.join(fontsDir, safeName)
                const buffer = Buffer.from(await fontFile.arrayBuffer())
                await fs.writeFile(destPath, buffer)
            }
        }

        // Best-effort format when Dart is on PATH (local/dev/CI). Production
        // web hosts typically skip this; SETUP.md documents `dart format .`
        // after flutter pub get for download users. Layer 1 tests pass
        // skipFormat so content assertions stay fast with Dart installed.
        if (!options.skipFormat) {
            const formatResult = await formatGeneratedProject(workingDir)
            if (!formatResult.skipped && !formatResult.success) {
                console.warn(
                    "dart format failed on generated scaffold:",
                    formatResult.stderr || formatResult.stdout,
                )
            }
        }

        const zipBuffer = await zipDirectory(workingDir)
        return zipBuffer
    } finally {
        await fs.rm(workingDir, { recursive: true, force: true }).catch(() => { })
    }
}

function buildTemplateContext(config: ScaffoldConfig): TemplateContext {
    const appSlug = config.appName.trim().replace(/\s+/g, "-").toLowerCase()
    const appSnake = config.appName.trim().replace(/\s+/g, "_").toLowerCase()
    const packageParts = config.packageId.split(".").filter(Boolean)
    const orgName =
        packageParts.length > 1
            ? packageParts.slice(0, -1).join(".")
            : "com.example"
    let routerPackage: "go_router" | "auto_route" | "getx" | undefined
    if (config.stateManagement === "getx") {
        routerPackage = "getx"
    } else if (config.navigation === "go_router") {
        routerPackage = "go_router"
    } else if (config.navigation === "auto_route") {
        routerPackage = "auto_route"
    } else if (config.navigation === "getx") {
        routerPackage = "getx"
    } else {
        routerPackage = undefined
    }

    // Group fonts by family name for pubspec.yaml emission.
    // Multiple files with the same family (e.g. Inter-Regular + Inter-Bold)
    // collapse into one `family:` block with multiple `fonts:` entries.
    const customFonts = config.theme.customFonts ?? []
    const familyMap = new Map<string, Array<Pick<CustomFontEntry, "fileName" | "style" | "weight">>>()
    for (const font of customFonts) {
        const existing = familyMap.get(font.family) ?? []
        familyMap.set(font.family, [...existing, { fileName: font.fileName, style: font.style, weight: font.weight }])
    }
    const fontFamilies = Array.from(familyMap.entries()).map(([family, fonts]) => ({ family, fonts }))
    // First unique family becomes the app-wide fontFamily in ThemeData
    const primaryFontFamily = fontFamilies.length > 0 ? fontFamilies[0].family : ""
    const capabilities = deriveGeneratorCapabilities({
        stateManagement: config.stateManagement,
        navigation: config.navigation,
        backend: {
            provider: config.backend.provider,
            options: config.backend.provider === "none" ? undefined : config.backend.options,
        },
        localizationEnabled: config.localization.enabled,
        usesDotenv: config.misc.usesDotenv,
        usesHive: config.misc.usesHive,
    })

    return {
        ...config,
        orgName,
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
            isNoneState: config.stateManagement === "none",
            usesFirebase: capabilities.usesFirebase,
            usesSupabase: capabilities.usesSupabase,
            usesAppwrite: capabilities.usesAppwrite,
            usesCustomBackend: capabilities.usesCustomBackend,
            usesDio: config.misc.usesDio,
            usesHttp: config.misc.usesHttp,
            usesHive: config.misc.usesHive,
            usesSharedPreferences: config.misc.usesSharedPreferences,
            usesSecureStorage: config.misc.usesSecureStorage,
            usesCachedNetworkImage: config.misc.usesCachedNetworkImage,
            usesFlutterSvg: config.misc.usesFlutterSvg,
            usesSkeletonizer: config.misc.usesSkeletonizer,
            usesScreenutil: config.misc.usesScreenutil,
            usesFlutterNativeSplash: config.misc.usesFlutterNativeSplash,
            usesLogger: config.misc.usesLogger,
            usesDotenv: config.misc.usesDotenv,
            supportsLocalization: config.localization.enabled,
            supportedLocales: config.localization.supportedLocales.length > 0 ? config.localization.supportedLocales : ["en"],
            fallbackLocale: config.localization.supportedLocales.length > 0 ? config.localization.supportedLocales[0] : "en",
            hasFlavors: true,
            hasDarkMode: config.theme.darkMode.enabled,
            isCupertino: config.theme.preset === "cupertino",
            isCustomTheme: config.theme.preset === "custom",
            isMaterial3: config.theme.preset === "material3",
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
            usesFirebaseAuth: capabilities.usesFirebaseAuth,
            usesFirebaseFirestore: capabilities.usesFirebaseFirestore,
            usesFirebaseRealtimeDb: capabilities.usesFirebaseRealtimeDb,
            usesFirebaseStorage: capabilities.usesFirebaseStorage,
            usesFirebaseAnalytics: capabilities.usesFirebaseAnalytics,
            usesFirebaseCrashlytics: capabilities.usesFirebaseCrashlytics,
            usesSupabaseAuth: capabilities.usesSupabaseAuth,
            usesSupabaseDb: capabilities.usesSupabaseDatabase,
            usesSupabaseEdgeFunctions: capabilities.usesSupabaseEdgeFunctions,
            usesAppwriteAuth: capabilities.usesAppwriteAuth,
            usesAppwriteDb: capabilities.usesAppwriteDatabase,
            usesAppwriteStorage: capabilities.usesAppwriteStorage,
            requiresCodeGeneration: capabilities.requiresCodeGeneration,
            hasCustomFonts: fontFamilies.length > 0,
            primaryFontFamily,
            fontFamilies,
            usesShadcn: config.ui.shadcn,
            shadcnDefault: config.ui.shadcn && config.ui.defaultKit === "shadcn",
            platformStyle: config.ui.platformStyle,
        },
    }
}

async function resolveOverlayDirs(
    root: string,
    config: ScaffoldConfig
): Promise<string[]> {
    const overlays: string[] = []
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
        usesShadcn: config.ui.shadcn,
    })
    const candidates: Array<[string, boolean]> = [
        [path.join(root, "overlays", "architecture", selection.architecture), true],
        [path.join(root, "overlays", "state", selection.state), true],
        [path.join(root, "overlays", "backend", selection.backend), true],
        [
            path.join(root, "overlays", "routing", "go_router"),
            selection.routing === "go_router",
        ],
        [
            path.join(root, "overlays", "routing", "auto_route"),
            selection.routing === "auto_route",
        ],
        [path.join(root, "overlays", "networking", "dio"), selection.networking === "dio"],
        [
            path.join(root, "overlays", "networking", "http"),
            selection.networking === "http",
        ],
        [
            path.join(root, "overlays", "networking", "cached_image"),
            selection.cachedImage,
        ],
        [path.join(root, "overlays", "extras", "localization"), selection.localization],
        ...selection.storage.map((name) => [path.join(root, "overlays", "storage", name), true] as [string, boolean]),
        ...selection.utilities.map((name) => [path.join(root, "overlays", "utilities", name), true] as [string, boolean]),
        [
            path.join(root, "overlays", "media"),
            selection.media,
        ],
        ...selection.device.map((name) => [path.join(root, "overlays", "device", name), true] as [string, boolean]),
        [path.join(root, "overlays", "extras", "flavors"), selection.flavors],
        [path.join(root, "overlays", "extras", "dotenv"), selection.dotenv],
        [path.join(root, "overlays", "ui", "shadcn"), selection.shadcn],
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
        let fileName = entry.name
        const condMatch = fileName.match(/^\(([^)]+)\)@(.*)$/)

        if (condMatch) {
            const flagsString = condMatch[1]
            const actualFileName = condMatch[2]

            const flags = flagsString.split(",")
            const shouldInclude = flags.some(flag => !!(context.flags as any)[flag.trim()])

            if (!shouldInclude) {
                continue
            }
            fileName = actualFileName
        }

        const sourcePath = path.join(sourceDir, entry.name)
        const targetPath = path.join(
            targetDir,
            fileName.replace(/\.hbs$/, "")
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

