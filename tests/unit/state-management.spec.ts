import { beforeAll, describe, expect, it } from "vitest"
import { assertFileContains, assertFileNotContains, getFileContent } from "../utils/assertions"
import { buildConfig } from "../utils/config-builder"
import { generateToMap, getPubspecContent } from "../utils/generate"
import { PrimaryCombo } from "../utils/matrix.config"
import { MISC_ALL_ON, MISC_DEFAULT } from "../utils/misc-profiles"

const base: Omit<PrimaryCombo, "stateManagement"> = {
    architecture: "feature-first",
    backend: "none",
    navigation: "go_router",
}

describe("State Management", () => {
    // ── Riverpod ────────────────────────────────────────────────
    describe("riverpod", () => {
        let files: Map<string, string>

        beforeAll(async () => {
            files = await generateToMap(buildConfig({ ...base, stateManagement: "riverpod" }, MISC_DEFAULT))
        })

        it("wraps app with ProviderScope", () => {
            assertFileContains(files, "state_wrapper.dart", "ProviderScope")
        })

        it("does not contain Bloc or Provider patterns", () => {
            assertFileNotContains(files, "state_wrapper.dart", "MultiBlocProvider")
            assertFileNotContains(files, "state_wrapper.dart", "MultiProvider")
        })

        it("includes hooks_riverpod when hooks enabled", async () => {
            const filesWithHooks = await generateToMap(
                buildConfig({ ...base, stateManagement: "riverpod" }, MISC_ALL_ON)
            )
            const pubspec = getPubspecContent(filesWithHooks)
            expect(pubspec).toContain("hooks_riverpod")
        })
    })

    // ── Provider ────────────────────────────────────────────────
    describe("provider", () => {
        let files: Map<string, string>

        beforeAll(async () => {
            files = await generateToMap(buildConfig({ ...base, stateManagement: "provider" }, MISC_DEFAULT))
        })

        it("wraps app with MultiProvider", () => {
            assertFileContains(files, "state_wrapper.dart", "MultiProvider")
        })

        it("does not contain Riverpod or Bloc patterns", () => {
            assertFileNotContains(files, "state_wrapper.dart", "ProviderScope")
            assertFileNotContains(files, "state_wrapper.dart", "MultiBlocProvider")
        })
    })

    // ── Bloc ────────────────────────────────────────────────────
    describe("bloc", () => {
        let files: Map<string, string>

        beforeAll(async () => {
            files = await generateToMap(buildConfig({ ...base, stateManagement: "bloc" }, MISC_DEFAULT))
        })

        it("wraps app with MultiBlocProvider", () => {
            assertFileContains(files, "state_wrapper.dart", "MultiBlocProvider")
        })

        it("does not contain Riverpod or Provider patterns", () => {
            assertFileNotContains(files, "state_wrapper.dart", "ProviderScope")
            assertFileNotContains(files, "state_wrapper.dart", "MultiProvider")
        })
    })

    // ── MobX ────────────────────────────────────────────────────
    describe("mobx", () => {
        let files: Map<string, string>
        let pubspec: string

        beforeAll(async () => {
            files = await generateToMap(buildConfig({ ...base, stateManagement: "mobx" }, MISC_DEFAULT))
            pubspec = getPubspecContent(files)
        })

        it("includes mobx and flutter_mobx in pubspec", () => {
            expect(pubspec).toContain("mobx:")
            expect(pubspec).toContain("flutter_mobx:")
        })

        it("includes build_runner and mobx_codegen in dev_dependencies", () => {
            expect(pubspec).toContain("build_runner:")
            expect(pubspec).toContain("mobx_codegen:")
        })

        it("hides mobx Interceptor when dio is enabled (avoids ambiguous export)", async () => {
            const mobxDioFiles = await generateToMap(
                buildConfig(
                    {
                        architecture: "mvc",
                        stateManagement: "mobx",
                        backend: "custom",
                        navigation: "imperative",
                    },
                    MISC_DEFAULT,
                ),
            )
            assertFileContains(
                mobxDioFiles,
                "lib/src/imports/packages_imports.dart",
                "hide version, StringExtension, Action, Listener, Listenable, Interceptor, Interceptors",
            )
            assertFileContains(mobxDioFiles, "lib/src/imports/packages_imports.dart", "export 'package:dio/dio.dart'")
        })
    })

    // ── None (setState) ─────────────────────────────────────────
    describe("none (setState)", () => {
        let files: Map<string, string>
        let pubspec: string

        beforeAll(async () => {
            files = await generateToMap(buildConfig({ ...base, stateManagement: "none" }, MISC_DEFAULT))
            pubspec = getPubspecContent(files)
        })

        it("does not generate StateWrapper", () => {
            const mainDart = getFileContent(files, "lib/main.dart")
            expect(mainDart).toBeDefined()
            expect(mainDart).not.toContain("StateWrapper")
        })

        it("has no state management packages in pubspec", () => {
            expect(pubspec).not.toContain("flutter_riverpod:")
            // Use regex to match standalone "provider:" (not "path_provider:" or "shared_preferences:")
            expect(pubspec).not.toMatch(/^\s+provider:\s/m)
            expect(pubspec).not.toContain("flutter_bloc:")
            expect(pubspec).not.toMatch(/^\s+mobx:\s/m)
            expect(pubspec).not.toContain("flutter_mobx:")
        })
    })
})
