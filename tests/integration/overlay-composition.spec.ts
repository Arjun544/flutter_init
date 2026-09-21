import { beforeAll, describe, expect, it } from "vitest"
import { getFileContent } from "../utils/assertions"
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

describe("Overlay Composition", () => {
    // ── State overlays replace base wrappers ─────────────────────
    describe("State overlay replaces base state_wrapper.dart", () => {
        it("riverpod overlay produces ProviderScope wrapper", async () => {
            const files = await generateToMap(buildConfig({ ...base, stateManagement: "riverpod" }))
            const wrapper = getFileContent(files, "state_wrapper.dart")
            expect(wrapper).toContain("ProviderScope")
        })

        it("bloc overlay produces MultiBlocProvider wrapper", async () => {
            const files = await generateToMap(buildConfig({ ...base, stateManagement: "bloc" }))
            const wrapper = getFileContent(files, "state_wrapper.dart")
            expect(wrapper).toContain("MultiBlocProvider")
        })

        it("provider overlay produces MultiProvider wrapper", async () => {
            const files = await generateToMap(buildConfig({ ...base, stateManagement: "provider" }))
            const wrapper = getFileContent(files, "state_wrapper.dart")
            expect(wrapper).toContain("MultiProvider")
        })
    })

    // ── Backend overlays inject service files ────────────────────
    describe("Backend overlay injects service files", () => {
        let firebaseFiles: Map<string, string>
        let supabaseFiles: Map<string, string>

        beforeAll(async () => {
            [firebaseFiles, supabaseFiles] = await Promise.all([
                generateToMap(buildConfig({ ...base, backend: "firebase" })),
                generateToMap(buildConfig({ ...base, backend: "supabase" })),
            ])
        })

        it("firebase overlay adds auth_service when auth enabled", () => {
            const pubspec = getPubspecContent(firebaseFiles)
            expect(pubspec).toContain("firebase_core:")
            expect(getFileContent(firebaseFiles, "auth_service.dart")).toBeDefined()
        })

        it("supabase overlay adds auth_service when auth enabled", () => {
            const pubspec = getPubspecContent(supabaseFiles)
            expect(pubspec).toContain("supabase_flutter:")
            expect(getFileContent(supabaseFiles, "auth_service.dart")).toBeDefined()
        })

        it("none backend does NOT produce backend service files", async () => {
            const files = await generateToMap(buildConfig({ ...base, backend: "none" }))
            const backendFiles = [...files.keys()].filter(
                (f) =>
                    f.toLowerCase().includes("firebase") ||
                    f.toLowerCase().includes("supabase") ||
                    f.toLowerCase().includes("appwrite")
            )
            expect(backendFiles).toEqual([])
        })
    })

    // ── Localization overlay ────────────────────────────────────
    describe("Localization overlay", () => {
        let files: Map<string, string>

        beforeAll(async () => {
            files = await generateToMap(buildConfig(base, MISC_DEFAULT))
        })

        it("when enabled: translation JSON files are present", () => {
            const translationFiles = [...files.keys()].filter(
                (f) => f.includes("translations/") && f.endsWith(".json")
            )
            expect(translationFiles.length).toBeGreaterThanOrEqual(2)
        })

        it("when enabled: easy_localization in pubspec", () => {
            const pubspec = getPubspecContent(files)
            expect(pubspec).toContain("easy_localization")
        })
    })

    // ── Networking overlays ─────────────────────────────────────
    describe("Networking overlays", () => {
        it("dio overlay: dio service files present when usesDio=true", async () => {
            const files = await generateToMap(buildConfig(base, MISC_ALL_ON))
            // Match path segments / file stems named "dio", not substrings like "radio"
            const dioFiles = [...files.keys()].filter((f) =>
                /(^|[\\/._-])dio([\\/._-]|$)/i.test(f)
            )
            expect(dioFiles.length).toBeGreaterThan(0)
        })

        it("no dio overlay: no dio files when usesDio=false", async () => {
            const files = await generateToMap(buildConfig(base, MISC_BARE_MINIMUM))
            const dioServiceFiles = [...files.keys()].filter(
                (f) => /(^|[\\/._-])dio([\\/._-]|$)/i.test(f) && f.endsWith(".dart")
            )
            expect(dioServiceFiles).toEqual([])
        })
    })

    // ── Storage overlays ────────────────────────────────────────
    describe("Storage overlays", () => {
        it("hive overlay produces hive service when usesHive=true", async () => {
            const files = await generateToMap(buildConfig(base, MISC_ALL_ON))
            const hiveFiles = [...files.keys()].filter((f) => f.toLowerCase().includes("hive"))
            expect(hiveFiles.length).toBeGreaterThan(0)
        })

        it("no hive files when usesHive=false", async () => {
            const files = await generateToMap(buildConfig(base, MISC_BARE_MINIMUM))
            const hiveFiles = [...files.keys()].filter(
                (f) => f.toLowerCase().includes("hive") && f.endsWith(".dart")
            )
            expect(hiveFiles).toEqual([])
        })
    })

    // ── UI / shadcn overlay ─────────────────────────────────────
    describe("UI shadcn overlay", () => {
        it("does not emit shadcn files when ui.shadcn is false", async () => {
            const files = await generateToMap(buildConfig(base))
            const shadcnFiles = [...files.keys()].filter((f) =>
                f.includes("/widgets/ui/shadcn/"),
            )
            expect(shadcnFiles).toEqual([])
            expect(getPubspecContent(files)).not.toContain("shadcn_ui:")
        })

        it("merges shadcn overlay when ui.shadcn is true", async () => {
            const files = await generateToMap({
                ...buildConfig(base),
                ui: {
                    platformStyle: "adaptive",
                    shadcn: true,
                    defaultKit: "app",
                },
            })
            expect(
                [...files.keys()].some((f) => f.endsWith("/widgets/ui/shadcn/shad_theme.dart")),
            ).toBe(true)
            expect(
                [...files.keys()].some((f) =>
                    f.endsWith("/widgets/ui/shadcn/shad_app_button.dart"),
                ),
            ).toBe(true)
            expect(getPubspecContent(files)).toContain("shadcn_ui:")
        })
    })
})
