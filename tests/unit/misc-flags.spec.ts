/**
 * misc-flags.spec.ts
 *
 * Tests for each miscellaneous boolean flag.
 * Verifies that toggling a flag correctly adds/removes:
 *  - pubspec.yaml dependencies
 *  - Overlay files (services, hooks, widgets)
 *  - ScreenUtil extensions (.w/.h/.sp)
 *  - Flutter Hooks patterns
 */

import { describe, expect, it } from "vitest"

import { assertDependencyAbsent, assertDependencyPresent, getFileContent } from "../utils/assertions"
import { generateToMap, getPubspecContent } from "../utils/generate"
import { buildConfig, type Combination } from "../utils/matrix.config"

const base: Combination = {
    architecture: "feature-first",
    stateManagement: "riverpod",
    backend: "none",
    navigation: "go_router",
    miscProfile: "default",
}

describe("Misc Flags", () => {
    // ── ScreenUtil ──────────────────────────────────────────────

    describe("usesScreenutil", () => {
        it("when enabled: flutter_screenutil in pubspec", async () => {
            const files = await generateToMap(buildConfig({ ...base, miscProfile: "full" }))
            const pubspec = getPubspecContent(files)
            assertDependencyPresent(pubspec, "flutter_screenutil")
        })

        it("when disabled: no flutter_screenutil", async () => {
            const files = await generateToMap(buildConfig({ ...base, miscProfile: "minimal" }))
            const pubspec = getPubspecContent(files)
            assertDependencyAbsent(pubspec, "flutter_screenutil")
        })

        it("when disabled: no .w/.h/.sp extensions in dart files", async () => {
            const files = await generateToMap(buildConfig({ ...base, miscProfile: "minimal" }))
            const dartFiles = [...files.entries()].filter(([f]) => f.endsWith(".dart"))

            const offenders = dartFiles
                .filter(([, text]) => /\b\d+\.(w|h|sp|r)\b/.test(text))
                .map(([f]) => f)

            expect(
                offenders,
                `Found ScreenUtil extensions in: ${offenders.join(", ")}`
            ).toEqual([])
        })
    })

    // ── Flutter Hooks ───────────────────────────────────────────

    describe("usesFlutterHooks", () => {
        it("when enabled: flutter_hooks in pubspec", async () => {
            const files = await generateToMap(buildConfig({ ...base, miscProfile: "hooks" }))
            const pubspec = getPubspecContent(files)
            assertDependencyPresent(pubspec, "flutter_hooks")
        })

        it("when disabled: no flutter_hooks in pubspec", async () => {
            const files = await generateToMap(buildConfig({ ...base, miscProfile: "default" }))
            const pubspec = getPubspecContent(files)
            assertDependencyAbsent(pubspec, "flutter_hooks")
        })
    })

    // ── Hive ────────────────────────────────────────────────────

    describe("usesHive", () => {
        it("when enabled: hive_ce + hive_ce_flutter in pubspec", async () => {
            const files = await generateToMap(buildConfig({ ...base, miscProfile: "full" }))
            const pubspec = getPubspecContent(files)
            assertDependencyPresent(pubspec, "hive_ce")
            assertDependencyPresent(pubspec, "hive_ce_flutter")
        })

        it("when enabled: hive_ce_generator in dev_dependencies", async () => {
            const files = await generateToMap(buildConfig({ ...base, miscProfile: "full" }))
            const pubspec = getPubspecContent(files)
            assertDependencyPresent(pubspec, "hive_ce_generator")
        })

        it("when disabled: no hive packages", async () => {
            const files = await generateToMap(buildConfig({ ...base, miscProfile: "minimal" }))
            const pubspec = getPubspecContent(files)
            assertDependencyAbsent(pubspec, "hive_ce")
            assertDependencyAbsent(pubspec, "hive_ce_flutter")
        })

        it("when enabled: HiveService.instance.init() in main.dart", async () => {
            const files = await generateToMap(buildConfig({ ...base, miscProfile: "full" }))
            const mainDart = getFileContent(files, "lib/main.dart")
            expect(mainDart).toBeDefined()
            expect(mainDart!).toContain("HiveService")
        })
    })

    // ── Cached Network Image ────────────────────────────────────

    describe("usesCachedNetworkImage", () => {
        it("when enabled: cached_network_image in pubspec", async () => {
            const files = await generateToMap(buildConfig({ ...base, miscProfile: "default" }))
            const pubspec = getPubspecContent(files)
            assertDependencyPresent(pubspec, "cached_network_image")
        })

        it("when disabled: no cached_network_image", async () => {
            const files = await generateToMap(buildConfig({ ...base, miscProfile: "minimal" }))
            const pubspec = getPubspecContent(files)
            assertDependencyAbsent(pubspec, "cached_network_image")
        })
    })

    // ── Skeletonizer ────────────────────────────────────────────

    describe("usesSkeletonizer", () => {
        it("when enabled: skeletonizer in pubspec", async () => {
            const files = await generateToMap(buildConfig({ ...base, miscProfile: "default" }))
            const pubspec = getPubspecContent(files)
            assertDependencyPresent(pubspec, "skeletonizer")
        })

        it("when disabled: no skeletonizer", async () => {
            const files = await generateToMap(buildConfig({ ...base, miscProfile: "minimal" }))
            const pubspec = getPubspecContent(files)
            assertDependencyAbsent(pubspec, "skeletonizer")
        })
    })

    // ── Dio ─────────────────────────────────────────────────────

    describe("usesDio", () => {
        it("when enabled: dio in pubspec", async () => {
            const files = await generateToMap(buildConfig({ ...base, miscProfile: "full" }))
            const pubspec = getPubspecContent(files)
            assertDependencyPresent(pubspec, "dio")
        })

        it("when disabled: no dio", async () => {
            const files = await generateToMap(buildConfig({ ...base, miscProfile: "minimal" }))
            const pubspec = getPubspecContent(files)
            assertDependencyAbsent(pubspec, "dio")
        })
    })

    // ── Shared Preferences ──────────────────────────────────────

    describe("usesSharedPreferences", () => {
        it("when enabled: shared_preferences in pubspec", async () => {
            const files = await generateToMap(buildConfig({ ...base, miscProfile: "default" }))
            const pubspec = getPubspecContent(files)
            assertDependencyPresent(pubspec, "shared_preferences")
        })

        it("when disabled: no shared_preferences", async () => {
            const files = await generateToMap(buildConfig({ ...base, miscProfile: "minimal" }))
            const pubspec = getPubspecContent(files)
            assertDependencyAbsent(pubspec, "shared_preferences")
        })
    })

    // ── Secure Storage ──────────────────────────────────────────

    describe("usesSecureStorage", () => {
        it("when enabled: flutter_secure_storage in pubspec", async () => {
            const files = await generateToMap(buildConfig({ ...base, miscProfile: "default" }))
            const pubspec = getPubspecContent(files)
            assertDependencyPresent(pubspec, "flutter_secure_storage")
        })

        it("when disabled: no flutter_secure_storage", async () => {
            const files = await generateToMap(buildConfig({ ...base, miscProfile: "minimal" }))
            const pubspec = getPubspecContent(files)
            assertDependencyAbsent(pubspec, "flutter_secure_storage")
        })
    })

    // ── Flutter SVG ─────────────────────────────────────────────

    describe("usesFlutterSvg", () => {
        it("when enabled: flutter_svg in pubspec", async () => {
            const files = await generateToMap(buildConfig({ ...base, miscProfile: "default" }))
            const pubspec = getPubspecContent(files)
            assertDependencyPresent(pubspec, "flutter_svg")
        })

        it("when disabled: no flutter_svg", async () => {
            const files = await generateToMap(buildConfig({ ...base, miscProfile: "minimal" }))
            const pubspec = getPubspecContent(files)
            assertDependencyAbsent(pubspec, "flutter_svg")
        })
    })

    // ── Native Splash ───────────────────────────────────────────

    describe("usesFlutterNativeSplash", () => {
        it("when enabled: flutter_native_splash in pubspec", async () => {
            const files = await generateToMap(buildConfig({ ...base, miscProfile: "default" }))
            const pubspec = getPubspecContent(files)
            assertDependencyPresent(pubspec, "flutter_native_splash")
        })

        it("when enabled: FlutterNativeSplash.preserve in main.dart", async () => {
            const files = await generateToMap(buildConfig({ ...base, miscProfile: "default" }))
            const mainDart = getFileContent(files, "lib/main.dart")
            expect(mainDart).toContain("FlutterNativeSplash.preserve")
        })

        it("when disabled: no flutter_native_splash", async () => {
            const files = await generateToMap(buildConfig({ ...base, miscProfile: "minimal" }))
            const pubspec = getPubspecContent(files)
            assertDependencyAbsent(pubspec, "flutter_native_splash")
        })
    })

    // ── Localization ────────────────────────────────────────────

    describe("localization", () => {
        it("when enabled: easy_localization in pubspec", async () => {
            // Default buildConfig has localization.enabled: true
            const files = await generateToMap(buildConfig(base))
            const pubspec = getPubspecContent(files)
            assertDependencyPresent(pubspec, "easy_localization")
        })

        it("when enabled: EasyLocalization.ensureInitialized in main.dart", async () => {
            const files = await generateToMap(buildConfig(base))
            const mainDart = getFileContent(files, "lib/main.dart")
            expect(mainDart).toContain("EasyLocalization.ensureInitialized")
        })

        it("when enabled: translation JSON files exist", async () => {
            const files = await generateToMap(buildConfig(base))
            const translationFiles = [...files.keys()].filter((f) =>
                f.includes("translations/") && f.endsWith(".json")
            )
            expect(translationFiles.length).toBeGreaterThanOrEqual(2) // en.json + es.json
        })
    })
})
