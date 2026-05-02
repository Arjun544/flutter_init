/**
 * overlay-composition.spec.ts
 *
 * Tests that overlay files correctly replace base files,
 * and that the overlay resolution logic includes/excludes
 * the right directories based on configuration.
 */

import { describe, expect, it } from "vitest"

import { getFileContent } from "../utils/assertions"
import { generateToMap, getPubspecContent, getFile } from "../utils/generate"
import { buildConfig, type Combination } from "../utils/matrix.config"

const base: Combination = {
    architecture: "feature-first",
    stateManagement: "riverpod",
    backend: "none",
    navigation: "go_router",
    miscProfile: "default",
}

describe("Overlay Composition", () => {
    // ── State overlays replace base wrappers ─────────────────────

    describe("State overlay replaces base state_wrapper.dart", () => {
        it("riverpod overlay produces ProviderScope wrapper", async () => {
            const files = await generateToMap(
                buildConfig({ ...base, stateManagement: "riverpod" })
            )
            const wrapper = getFileContent(files, "state_wrapper.dart")
            expect(wrapper).toBeDefined()
            expect(wrapper).toContain("ProviderScope")
        })

        it("bloc overlay produces MultiBlocProvider wrapper", async () => {
            const files = await generateToMap(
                buildConfig({ ...base, stateManagement: "bloc" })
            )
            const wrapper = getFileContent(files, "state_wrapper.dart")
            expect(wrapper).toBeDefined()
            expect(wrapper).toContain("MultiBlocProvider")
        })

        it("provider overlay produces MultiProvider wrapper", async () => {
            const files = await generateToMap(
                buildConfig({ ...base, stateManagement: "provider" })
            )
            const wrapper = getFileContent(files, "state_wrapper.dart")
            expect(wrapper).toBeDefined()
            expect(wrapper).toContain("MultiProvider")
        })
    })

    // ── Backend overlays inject service files ────────────────────

    describe("Backend overlay injects service files", () => {
        it("firebase overlay adds auth_service when auth enabled", async () => {
            const files = await generateToMap(
                buildConfig({ ...base, backend: "firebase" })
            )
            // Firebase backend produces auth_service.dart via (usesFirebaseAuth)@ gate
            const pubspec = getPubspecContent(files)
            expect(pubspec).toContain("firebase_core:")
            // auth_service.dart should exist (since default firebase has authEmail: true)
            const authService = getFileContent(files, "auth_service.dart")
            expect(authService).toBeDefined()
        })

        it("supabase overlay adds auth_service when auth enabled", async () => {
            const files = await generateToMap(
                buildConfig({ ...base, backend: "supabase" })
            )
            const pubspec = getPubspecContent(files)
            expect(pubspec).toContain("supabase_flutter:")
            // auth_service.dart should exist (since default supabase has auth: true)
            const authService = getFileContent(files, "auth_service.dart")
            expect(authService).toBeDefined()
        })

        it("none backend does NOT produce backend service files", async () => {
            const files = await generateToMap(
                buildConfig({ ...base, backend: "none" })
            )
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
        it("when enabled: translation JSON files are present", async () => {
            const files = await generateToMap(buildConfig(base))
            const translationFiles = [...files.keys()].filter(
                (f) => f.includes("translations/") && f.endsWith(".json")
            )
            expect(translationFiles.length).toBeGreaterThanOrEqual(2)
        })

        it("when enabled: easy_localization in pubspec", async () => {
            const files = await generateToMap(buildConfig(base))
            const pubspec = getPubspecContent(files)
            expect(pubspec).toContain("easy_localization")
        })
    })

    // ── Networking overlays ─────────────────────────────────────

    describe("Networking overlays", () => {
        it("dio overlay: dio service files present when usesDio=true", async () => {
            const files = await generateToMap(
                buildConfig({ ...base, miscProfile: "full" })
            )
            const dioFiles = [...files.keys()].filter((f) =>
                f.toLowerCase().includes("dio")
            )
            expect(dioFiles.length).toBeGreaterThan(0)
        })

        it("no dio overlay: no dio files when usesDio=false", async () => {
            const files = await generateToMap(
                buildConfig({ ...base, miscProfile: "minimal" })
            )
            // Should not have dio-specific service files (excluding pubspec references)
            const dioServiceFiles = [...files.keys()].filter(
                (f) => f.toLowerCase().includes("dio") && f.endsWith(".dart")
            )
            expect(dioServiceFiles).toEqual([])
        })
    })

    // ── Storage overlays ────────────────────────────────────────

    describe("Storage overlays", () => {
        it("hive overlay produces hive service when usesHive=true", async () => {
            const files = await generateToMap(
                buildConfig({ ...base, miscProfile: "full" })
            )
            const hiveFiles = [...files.keys()].filter((f) =>
                f.toLowerCase().includes("hive")
            )
            expect(hiveFiles.length).toBeGreaterThan(0)
        })

        it("no hive files when usesHive=false", async () => {
            const files = await generateToMap(
                buildConfig({ ...base, miscProfile: "minimal" })
            )
            const hiveFiles = [...files.keys()].filter(
                (f) => f.toLowerCase().includes("hive") && f.endsWith(".dart")
            )
            expect(hiveFiles).toEqual([])
        })
    })

    // ── Architecture overlays ───────────────────────────────────

    describe("Architecture overlay produces correct folder structure", () => {
        it("clean architecture has domain/data/presentation layers", async () => {
            const files = await generateToMap(
                buildConfig({ ...base, architecture: "clean" })
            )
            const paths = [...files.keys()]

            expect(paths.some((p) => p.includes("/domain/"))).toBe(true)
            expect(paths.some((p) => p.includes("/data/"))).toBe(true)
            expect(paths.some((p) => p.includes("/presentation/"))).toBe(true)
        })

        it("feature-first has features directory", async () => {
            const files = await generateToMap(
                buildConfig({ ...base, architecture: "feature-first" })
            )
            const paths = [...files.keys()]
            expect(paths.some((p) => p.includes("/features/"))).toBe(true)
        })
    })
})
