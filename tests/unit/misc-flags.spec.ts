import { beforeAll, describe, expect, it } from "vitest"
import { assertDependencyAbsent, assertDependencyPresent, getFileContent } from "../utils/assertions"
import { buildConfig } from "../utils/config-builder"
import { generateToMap, getPubspecContent } from "../utils/generate"
import { PrimaryCombo } from "../utils/matrix.config"
import { MISC_ALL_ON, MISC_BARE_MINIMUM, MISC_DEFAULT } from "../utils/misc-profiles"

const base: PrimaryCombo = {
    architecture: "feature-first",
    stateManagement: "riverpod",
    backend: "none",
    navigation: "go_router",
}

describe("Misc Flags", () => {
    let fullFiles: Map<string, string>
    let fullPubspec: string
    let minimalFiles: Map<string, string>
    let minimalPubspec: string
    let defaultFiles: Map<string, string>
    let defaultPubspec: string
    let noDotenvFiles: Map<string, string>
    let noDotenvPubspec: string

    beforeAll(async () => {
        [fullFiles, minimalFiles, defaultFiles, noDotenvFiles] = await Promise.all([
            generateToMap(buildConfig(base, MISC_ALL_ON)),
            generateToMap(buildConfig(base, MISC_BARE_MINIMUM)),
            generateToMap(buildConfig(base, MISC_DEFAULT)),
            generateToMap(buildConfig(base, { ...MISC_DEFAULT, usesDotenv: false })),
        ])
        fullPubspec = getPubspecContent(fullFiles)
        minimalPubspec = getPubspecContent(minimalFiles)
        defaultPubspec = getPubspecContent(defaultFiles)
        noDotenvPubspec = getPubspecContent(noDotenvFiles)
    })

    // ── ScreenUtil ──────────────────────────────────────────────
    describe("usesScreenutil", () => {
        it("when enabled: flutter_screenutil in pubspec", () => {
            assertDependencyPresent(fullPubspec, "flutter_screenutil")
        })

        it("when disabled: no flutter_screenutil", () => {
            assertDependencyAbsent(minimalPubspec, "flutter_screenutil")
        })

        it("when disabled: no .w/.h/.sp extensions in dart files", () => {
            const dartFiles = [...minimalFiles.entries()].filter(([f]) => f.endsWith(".dart"))
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
        it("when enabled: flutter_hooks in pubspec", () => {
            assertDependencyPresent(fullPubspec, "flutter_hooks")
        })

        it("when disabled: no flutter_hooks in pubspec", () => {
            assertDependencyAbsent(defaultPubspec, "flutter_hooks")
        })
    })

    // ── Hive ────────────────────────────────────────────────────
    describe("usesHive", () => {
        it("when enabled: hive_ce + hive_ce_flutter in pubspec", () => {
            assertDependencyPresent(fullPubspec, "hive_ce")
            assertDependencyPresent(fullPubspec, "hive_ce_flutter")
        })

        it("when enabled: hive_ce_generator in dev_dependencies", () => {
            assertDependencyPresent(fullPubspec, "hive_ce_generator")
        })

        it("when disabled: no hive packages", () => {
            assertDependencyAbsent(minimalPubspec, "hive_ce")
            assertDependencyAbsent(minimalPubspec, "hive_ce_flutter")
        })

        it("when enabled: HiveService.instance.init() in main.dart", () => {
            const mainDart = getFileContent(fullFiles, "lib/main.dart")
            expect(mainDart).toBeDefined()
            expect(mainDart!).toContain("HiveService")
        })
    })

    // ── Cached Network Image ────────────────────────────────────
    describe("usesCachedNetworkImage", () => {
        it("when enabled: cached_network_image in pubspec", () => {
            assertDependencyPresent(defaultPubspec, "cached_network_image")
        })

        it("when disabled: no cached_network_image", () => {
            assertDependencyAbsent(minimalPubspec, "cached_network_image")
        })
    })

    // ── Skeletonizer ────────────────────────────────────────────
    describe("usesSkeletonizer", () => {
        it("when enabled: skeletonizer in pubspec", () => {
            assertDependencyPresent(defaultPubspec, "skeletonizer")
        })

        it("when disabled: no skeletonizer", () => {
            assertDependencyAbsent(minimalPubspec, "skeletonizer")
        })
    })

    // ── Dio ─────────────────────────────────────────────────────
    describe("usesDio", () => {
        it("when enabled: dio in pubspec", () => {
            assertDependencyPresent(fullPubspec, "dio")
        })

        it("when disabled: no dio", () => {
            assertDependencyAbsent(minimalPubspec, "dio")
        })
    })

    // ── Shared Preferences ──────────────────────────────────────
    describe("usesSharedPreferences", () => {
        it("when enabled: shared_preferences in pubspec", () => {
            assertDependencyPresent(defaultPubspec, "shared_preferences")
        })

        it("when disabled: no shared_preferences", () => {
            assertDependencyAbsent(minimalPubspec, "shared_preferences")
        })
    })

    // ── Secure Storage ──────────────────────────────────────────
    describe("usesSecureStorage", () => {
        it("when enabled: flutter_secure_storage in pubspec", () => {
            assertDependencyPresent(defaultPubspec, "flutter_secure_storage")
        })

        it("when disabled: no flutter_secure_storage", () => {
            assertDependencyAbsent(minimalPubspec, "flutter_secure_storage")
        })
    })

    // ── Flutter SVG ─────────────────────────────────────────────
    describe("usesFlutterSvg", () => {
        it("when enabled: flutter_svg in pubspec", () => {
            assertDependencyPresent(defaultPubspec, "flutter_svg")
        })

        it("when disabled: no flutter_svg", () => {
            assertDependencyAbsent(minimalPubspec, "flutter_svg")
        })
    })

    // ── Native Splash ───────────────────────────────────────────
    describe("usesFlutterNativeSplash", () => {
        it("when enabled: flutter_native_splash in pubspec", () => {
            assertDependencyPresent(defaultPubspec, "flutter_native_splash")
        })

        it("when enabled: FlutterNativeSplash.preserve in main.dart", () => {
            const mainDart = getFileContent(defaultFiles, "lib/main.dart")
            expect(mainDart).toContain("FlutterNativeSplash.preserve")
        })

        it("when disabled: no flutter_native_splash", () => {
            assertDependencyAbsent(minimalPubspec, "flutter_native_splash")
        })
    })

    // ── Localization ────────────────────────────────────────────
    describe("localization", () => {
        it("when enabled: easy_localization in pubspec", () => {
            assertDependencyPresent(defaultPubspec, "easy_localization")
        })

        it("when enabled: EasyLocalization.ensureInitialized in main.dart", () => {
            const mainDart = getFileContent(defaultFiles, "lib/main.dart")
            expect(mainDart).toContain("EasyLocalization.ensureInitialized")
        })

        it("when enabled: translation JSON files exist", () => {
            const translationFiles = [...defaultFiles.keys()].filter((f) =>
                f.includes("translations/") && f.endsWith(".json")
            )
            expect(translationFiles.length).toBeGreaterThanOrEqual(2) // en.json + es.json
        })
    })

    // ── Dotenv ──────────────────────────────────────────────────
    describe("usesDotenv", () => {
        it("when enabled: flutter_dotenv in pubspec", () => {
            assertDependencyPresent(defaultPubspec, "flutter_dotenv")
        })

        it("when enabled: .env is in pubspec assets", () => {
            expect(defaultPubspec).toMatch(/- \.env/g)
        })

        it("when disabled: no flutter_dotenv in pubspec", () => {
            assertDependencyAbsent(noDotenvPubspec, "flutter_dotenv")
        })

        it("when disabled: .env is not in pubspec assets", () => {
            expect(noDotenvPubspec).not.toMatch(/- \.env/g)
        })
    })
})
