/**
 * dependencies.spec.ts
 *
 * Verifies that pubspec.yaml contains exactly the right dependencies
 * for each combination — no more, no less.
 */

import { describe, it } from "vitest"

import {
    assertDependencyAbsent,
    assertDependencyPresent,
    assertValidPubspec,
} from "../utils/assertions"
import { generateToMap, getPubspecContent } from "../utils/generate"
import {
    ALL_COMBINATIONS,
    buildConfig,
    combinationLabel
} from "../utils/matrix.config"

describe("Dependency Assertions", { timeout: 600_000 }, () => {
    // ── pubspec validity ────────────────────────────────────────

    describe("pubspec.yaml is valid YAML with correct structure", () => {
        it.each(ALL_COMBINATIONS.map((c, i) => [i, combinationLabel(c), c] as const))(
            "combo #%i — %s",
            { timeout: 15_000 },
            async (_i, _label, combo) => {
                const config = buildConfig(combo)
                const files = await generateToMap(config)
                const pubspec = getPubspecContent(files)

                assertValidPubspec(pubspec)
            }
        )
    })

    // ── State management dependencies ───────────────────────────

    describe("State management packages", () => {
        const STATE_PACKAGES: Record<string, { present: string[]; absent: string[] }> = {
            riverpod: {
                present: ["flutter_riverpod"],
                absent: ["provider", "flutter_bloc", "mobx", "flutter_mobx"],
            },
            provider: {
                present: ["provider"],
                absent: ["flutter_riverpod", "flutter_bloc", "mobx", "flutter_mobx"],
            },
            bloc: {
                present: ["flutter_bloc"],
                absent: ["flutter_riverpod", "provider", "mobx", "flutter_mobx"],
            },
            mobx: {
                present: ["mobx", "flutter_mobx"],
                absent: ["flutter_riverpod", "provider", "flutter_bloc"],
            },
            none: {
                present: [],
                absent: ["flutter_riverpod", "provider", "flutter_bloc", "mobx", "flutter_mobx"],
            },
        }

        for (const [stateManager, packages] of Object.entries(STATE_PACKAGES)) {
            it(`${stateManager}: correct packages present and absent`, async () => {
                const config = buildConfig({
                    architecture: "feature-first",
                    stateManagement: stateManager as any,
                    backend: "none",
                    navigation: "go_router",
                    miscProfile: "default",
                })
                const files = await generateToMap(config)
                const pubspec = getPubspecContent(files)

                for (const pkg of packages.present) {
                    assertDependencyPresent(pubspec, pkg)
                }
                for (const pkg of packages.absent) {
                    assertDependencyAbsent(pubspec, pkg)
                }
            })
        }
    })

    // ── Backend dependencies ────────────────────────────────────

    describe("Backend packages", () => {
        it("firebase: firebase_core present", async () => {
            const config = buildConfig({
                architecture: "feature-first",
                stateManagement: "riverpod",
                backend: "firebase",
                navigation: "go_router",
                miscProfile: "default",
            })
            const files = await generateToMap(config)
            const pubspec = getPubspecContent(files)

            assertDependencyPresent(pubspec, "firebase_core")
            assertDependencyAbsent(pubspec, "supabase_flutter")
            assertDependencyAbsent(pubspec, "appwrite")
        })

        it("supabase: supabase_flutter present", async () => {
            const config = buildConfig({
                architecture: "clean",
                stateManagement: "bloc",
                backend: "supabase",
                navigation: "go_router",
                miscProfile: "default",
            })
            const files = await generateToMap(config)
            const pubspec = getPubspecContent(files)

            assertDependencyPresent(pubspec, "supabase_flutter")
            assertDependencyAbsent(pubspec, "firebase_core")
            assertDependencyAbsent(pubspec, "appwrite")
        })

        it("appwrite: appwrite present", async () => {
            const config = buildConfig({
                architecture: "mvvm",
                stateManagement: "provider",
                backend: "appwrite",
                navigation: "auto_route",
                miscProfile: "default",
            })
            const files = await generateToMap(config)
            const pubspec = getPubspecContent(files)

            assertDependencyPresent(pubspec, "appwrite")
            assertDependencyAbsent(pubspec, "firebase_core")
            assertDependencyAbsent(pubspec, "supabase_flutter")
        })

        it("none: no backend packages", async () => {
            const config = buildConfig({
                architecture: "mvc",
                stateManagement: "none",
                backend: "none",
                navigation: "imperative",
                miscProfile: "minimal",
            })
            const files = await generateToMap(config)
            const pubspec = getPubspecContent(files)

            assertDependencyAbsent(pubspec, "firebase_core")
            assertDependencyAbsent(pubspec, "supabase_flutter")
            assertDependencyAbsent(pubspec, "appwrite")
        })
    })

    // ── Navigation dependencies ─────────────────────────────────

    describe("Navigation packages", () => {
        it("go_router: go_router present", async () => {
            const config = buildConfig({
                architecture: "feature-first",
                stateManagement: "riverpod",
                backend: "none",
                navigation: "go_router",
                miscProfile: "default",
            })
            const files = await generateToMap(config)
            const pubspec = getPubspecContent(files)

            assertDependencyPresent(pubspec, "go_router")
            assertDependencyAbsent(pubspec, "auto_route")
        })

        it("auto_route: auto_route + auto_route_generator present", async () => {
            const config = buildConfig({
                architecture: "clean",
                stateManagement: "bloc",
                backend: "none",
                navigation: "auto_route",
                miscProfile: "default",
            })
            const files = await generateToMap(config)
            const pubspec = getPubspecContent(files)

            assertDependencyPresent(pubspec, "auto_route")
            assertDependencyPresent(pubspec, "auto_route_generator")
            assertDependencyAbsent(pubspec, "go_router")
        })

        it("imperative: no routing packages", async () => {
            const config = buildConfig({
                architecture: "mvvm",
                stateManagement: "provider",
                backend: "none",
                navigation: "imperative",
                miscProfile: "default",
            })
            const files = await generateToMap(config)
            const pubspec = getPubspecContent(files)

            assertDependencyAbsent(pubspec, "go_router")
            assertDependencyAbsent(pubspec, "auto_route")
            assertDependencyAbsent(pubspec, "auto_route_generator")
        })
    })

    // ── Networking dependencies ─────────────────────────────────

    describe("Networking packages", () => {
        it("full profile: dio present", async () => {
            const config = buildConfig({
                architecture: "feature-first",
                stateManagement: "riverpod",
                backend: "none",
                navigation: "go_router",
                miscProfile: "full",
            })
            const files = await generateToMap(config)
            const pubspec = getPubspecContent(files)

            assertDependencyPresent(pubspec, "dio")
        })

        it("minimal profile: no networking packages", async () => {
            const config = buildConfig({
                architecture: "layer-first",
                stateManagement: "none",
                backend: "none",
                navigation: "imperative",
                miscProfile: "minimal",
            })
            const files = await generateToMap(config)
            const pubspec = getPubspecContent(files)

            assertDependencyAbsent(pubspec, "dio")
            assertDependencyAbsent(pubspec, "http")
        })
    })

    // ── MobX dev dependencies ───────────────────────────────────

    describe("Build runner for code generation", () => {
        it("mobx: build_runner + mobx_codegen in dev_dependencies", async () => {
            const config = buildConfig({
                architecture: "clean",
                stateManagement: "mobx",
                backend: "none",
                navigation: "go_router",
                miscProfile: "default",
            })
            const files = await generateToMap(config)
            const pubspec = getPubspecContent(files)

            assertDependencyPresent(pubspec, "build_runner")
            assertDependencyPresent(pubspec, "mobx_codegen")
        })

        it("auto_route: build_runner + auto_route_generator in dev_dependencies", async () => {
            const config = buildConfig({
                architecture: "feature-first",
                stateManagement: "riverpod",
                backend: "none",
                navigation: "auto_route",
                miscProfile: "default",
            })
            const files = await generateToMap(config)
            const pubspec = getPubspecContent(files)

            assertDependencyPresent(pubspec, "build_runner")
            assertDependencyPresent(pubspec, "auto_route_generator")
        })
    })
})
