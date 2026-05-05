import { beforeAll, describe, it } from "vitest"
import {
    assertArchitectureStructure,
    assertDependencyAbsent,
    assertDependencyPresent,
    assertNoEmptyFiles,
    assertNoUnresolvedTokens,
    assertRequiredFilesExist,
    assertValidPubspec,
} from "./assertions"
import { buildConfig } from "./config-builder"
import { generateToMap, getPubspecContent } from "./generate"
import { COMBO_LABEL, PrimaryCombo } from "./matrix.config"

export function runMatrixTests(combos: PrimaryCombo[]) {
    for (const combo of combos) {
        describe(`[${COMBO_LABEL(combo)}]`, () => {
            let files: Map<string, string>
            let pubspec: string

            beforeAll(async () => {
                files = await generateToMap(buildConfig(combo))
                pubspec = getPubspecContent(files)
            })

            // ── Structural Integrity ─────────────────────────────────
            it("has all required files", () => {
                assertRequiredFilesExist(files)
            })

            it("has no empty files", () => {
                assertNoEmptyFiles(files)
            })

            it("has correct architecture structure", () => {
                assertArchitectureStructure(files, combo.architecture)
            })

            // ── Token Cleanliness ────────────────────────────────────
            it("has zero unresolved tokens", () => {
                assertNoUnresolvedTokens(files)
            })

            // ── Dependency Assertions ────────────────────────────────
            it("has valid pubspec.yaml structure", () => {
                assertValidPubspec(pubspec)
            })

            describe("Packages", () => {
                it("has correct state management packages", () => {
                    const stateManager = combo.stateManagement
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
                            present: ["mobx", "flutter_mobx", "provider"],
                            absent: ["flutter_riverpod", "flutter_bloc"],
                        },
                        none: {
                            present: [],
                            absent: ["flutter_riverpod", "provider", "flutter_bloc", "mobx", "flutter_mobx"],
                        },
                    }
                    const packages = STATE_PACKAGES[stateManager]
                    for (const pkg of packages.present) {
                        assertDependencyPresent(pubspec, pkg)
                    }
                    for (const pkg of packages.absent) {
                        assertDependencyAbsent(pubspec, pkg)
                    }
                })

                it("has correct backend packages", () => {
                    if (combo.backend === "firebase") {
                        assertDependencyPresent(pubspec, "firebase_core")
                        assertDependencyAbsent(pubspec, "supabase_flutter")
                        assertDependencyAbsent(pubspec, "appwrite")
                    } else if (combo.backend === "supabase") {
                        assertDependencyPresent(pubspec, "supabase_flutter")
                        assertDependencyAbsent(pubspec, "firebase_core")
                        assertDependencyAbsent(pubspec, "appwrite")
                    } else if (combo.backend === "appwrite") {
                        assertDependencyPresent(pubspec, "appwrite")
                        assertDependencyAbsent(pubspec, "firebase_core")
                        assertDependencyAbsent(pubspec, "supabase_flutter")
                    } else if (combo.backend === "none") {
                        assertDependencyAbsent(pubspec, "firebase_core")
                        assertDependencyAbsent(pubspec, "supabase_flutter")
                        assertDependencyAbsent(pubspec, "appwrite")
                    }
                })

                it("has correct navigation packages", () => {
                    if (combo.navigation === "go_router") {
                        assertDependencyPresent(pubspec, "go_router")
                        assertDependencyAbsent(pubspec, "auto_route")
                    } else if (combo.navigation === "auto_route") {
                        assertDependencyPresent(pubspec, "auto_route")
                        assertDependencyPresent(pubspec, "auto_route_generator")
                        assertDependencyAbsent(pubspec, "go_router")
                    } else if (combo.navigation === "imperative") {
                        assertDependencyAbsent(pubspec, "go_router")
                        assertDependencyAbsent(pubspec, "auto_route")
                        assertDependencyAbsent(pubspec, "auto_route_generator")
                    }
                })

                if (combo.stateManagement === "mobx" || combo.navigation === "auto_route") {
                    it("has build_runner for code generation", () => {
                        assertDependencyPresent(pubspec, "build_runner")
                        if (combo.stateManagement === "mobx") {
                            assertDependencyPresent(pubspec, "mobx_codegen")
                        }
                        if (combo.navigation === "auto_route") {
                            assertDependencyPresent(pubspec, "auto_route_generator")
                        }
                    })
                }
            })
        })
    }
}
