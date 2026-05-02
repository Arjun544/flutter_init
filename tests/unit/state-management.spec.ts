/**
 * state-management.spec.ts
 *
 * Focused tests per state management option.
 * Verifies that the correct wrapper patterns, imports, and file structures
 * are generated for each state manager, and that other state managers' code
 * is completely absent (no option bleed).
 */

import { describe, expect, it } from "vitest"

import { assertFileContains, assertFileNotContains, getFileContent } from "../utils/assertions"
import { generateToMap, getPubspecContent } from "../utils/generate"
import { buildConfig, type Combination } from "../utils/matrix.config"

/** Base combo — we vary only the stateManagement field */
const base: Omit<Combination, "stateManagement"> = {
    architecture: "feature-first",
    backend: "none",
    navigation: "go_router",
    miscProfile: "default",
}

describe("State Management", () => {
    // ── Riverpod ────────────────────────────────────────────────

    describe("riverpod", () => {
        it("wraps app with ProviderScope", async () => {
            const files = await generateToMap(buildConfig({ ...base, stateManagement: "riverpod" }))
            assertFileContains(files, "state_wrapper.dart", "ProviderScope")
        })

        it("does not contain Bloc or Provider patterns", async () => {
            const files = await generateToMap(buildConfig({ ...base, stateManagement: "riverpod" }))
            assertFileNotContains(files, "state_wrapper.dart", "MultiBlocProvider")
            assertFileNotContains(files, "state_wrapper.dart", "MultiProvider")
        })

        it("includes hooks_riverpod when hooks enabled", async () => {
            const files = await generateToMap(
                buildConfig({ ...base, stateManagement: "riverpod", miscProfile: "hooks" })
            )
            const pubspec = getPubspecContent(files)
            expect(pubspec).toContain("hooks_riverpod")
        })
    })

    // ── Provider ────────────────────────────────────────────────

    describe("provider", () => {
        it("wraps app with MultiProvider", async () => {
            const files = await generateToMap(buildConfig({ ...base, stateManagement: "provider" }))
            assertFileContains(files, "state_wrapper.dart", "MultiProvider")
        })

        it("does not contain Riverpod or Bloc patterns", async () => {
            const files = await generateToMap(buildConfig({ ...base, stateManagement: "provider" }))
            assertFileNotContains(files, "state_wrapper.dart", "ProviderScope")
            assertFileNotContains(files, "state_wrapper.dart", "MultiBlocProvider")
        })
    })

    // ── Bloc ────────────────────────────────────────────────────

    describe("bloc", () => {
        it("wraps app with MultiBlocProvider", async () => {
            const files = await generateToMap(buildConfig({ ...base, stateManagement: "bloc" }))
            assertFileContains(files, "state_wrapper.dart", "MultiBlocProvider")
        })

        it("does not contain Riverpod or Provider patterns", async () => {
            const files = await generateToMap(buildConfig({ ...base, stateManagement: "bloc" }))
            assertFileNotContains(files, "state_wrapper.dart", "ProviderScope")
            assertFileNotContains(files, "state_wrapper.dart", "MultiProvider")
        })
    })

    // ── MobX ────────────────────────────────────────────────────

    describe("mobx", () => {
        it("includes mobx and flutter_mobx in pubspec", async () => {
            const files = await generateToMap(buildConfig({ ...base, stateManagement: "mobx" }))
            const pubspec = getPubspecContent(files)
            expect(pubspec).toContain("mobx:")
            expect(pubspec).toContain("flutter_mobx:")
        })

        it("includes build_runner and mobx_codegen in dev_dependencies", async () => {
            const files = await generateToMap(buildConfig({ ...base, stateManagement: "mobx" }))
            const pubspec = getPubspecContent(files)
            expect(pubspec).toContain("build_runner:")
            expect(pubspec).toContain("mobx_codegen:")
        })
    })

    // ── None (setState) ─────────────────────────────────────────

    describe("none (setState)", () => {
        it("does not generate StateWrapper", async () => {
            const files = await generateToMap(buildConfig({ ...base, stateManagement: "none" }))

            // main.dart should NOT wrap with StateWrapper
            const mainDart = getFileContent(files, "lib/main.dart")
            expect(mainDart).toBeDefined()
            expect(mainDart).not.toContain("StateWrapper")
        })

        it("has no state management packages in pubspec", async () => {
            const files = await generateToMap(buildConfig({ ...base, stateManagement: "none" }))
            const pubspec = getPubspecContent(files)

            expect(pubspec).not.toContain("flutter_riverpod:")
            // Use regex to match standalone "provider:" (not "path_provider:" or "shared_preferences:")
            expect(pubspec).not.toMatch(/^\s+provider:\s/m)
            expect(pubspec).not.toContain("flutter_bloc:")
            expect(pubspec).not.toMatch(/^\s+mobx:\s/m)
            expect(pubspec).not.toContain("flutter_mobx:")
        })
    })
})
