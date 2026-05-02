/**
 * navigation.spec.ts
 *
 * Focused tests per navigation option.
 * Verifies correct routing packages, router file content,
 * and absence of other navigation code.
 */

import { describe, expect, it } from "vitest"

import {
    assertDependencyAbsent,
    assertDependencyPresent,
    getFileContent
} from "../utils/assertions"
import { generateToMap, getPubspecContent } from "../utils/generate"
import { buildConfig, type Combination } from "../utils/matrix.config"

const base: Omit<Combination, "navigation"> = {
    architecture: "feature-first",
    stateManagement: "riverpod",
    backend: "none",
    miscProfile: "default",
}

describe("Navigation", () => {
    // ── go_router ───────────────────────────────────────────────

    describe("go_router", () => {
        it("includes go_router in pubspec", async () => {
            const files = await generateToMap(buildConfig({ ...base, navigation: "go_router" }))
            const pubspec = getPubspecContent(files)
            assertDependencyPresent(pubspec, "go_router")
        })

        it("does not include auto_route", async () => {
            const files = await generateToMap(buildConfig({ ...base, navigation: "go_router" }))
            const pubspec = getPubspecContent(files)
            assertDependencyAbsent(pubspec, "auto_route")
            assertDependencyAbsent(pubspec, "auto_route_generator")
        })

        it("generates router configuration file", async () => {
            const files = await generateToMap(buildConfig({ ...base, navigation: "go_router" }))
            const routerFile = getFileContent(files, "app_router.dart")
            expect(routerFile).toBeDefined()
        })
    })

    // ── auto_route ──────────────────────────────────────────────

    describe("auto_route", () => {
        it("includes auto_route in pubspec", async () => {
            const files = await generateToMap(buildConfig({ ...base, navigation: "auto_route" }))
            const pubspec = getPubspecContent(files)
            assertDependencyPresent(pubspec, "auto_route")
        })

        it("includes auto_route_generator in dev_dependencies", async () => {
            const files = await generateToMap(buildConfig({ ...base, navigation: "auto_route" }))
            const pubspec = getPubspecContent(files)
            assertDependencyPresent(pubspec, "auto_route_generator")
            assertDependencyPresent(pubspec, "build_runner")
        })

        it("does not include go_router", async () => {
            const files = await generateToMap(buildConfig({ ...base, navigation: "auto_route" }))
            const pubspec = getPubspecContent(files)
            assertDependencyAbsent(pubspec, "go_router")
        })
    })

    // ── imperative ──────────────────────────────────────────────

    describe("imperative (Navigator 1.0)", () => {
        it("does not include any routing package", async () => {
            const files = await generateToMap(buildConfig({ ...base, navigation: "imperative" }))
            const pubspec = getPubspecContent(files)
            assertDependencyAbsent(pubspec, "go_router")
            assertDependencyAbsent(pubspec, "auto_route")
            assertDependencyAbsent(pubspec, "auto_route_generator")
        })

        it("still generates app_router.dart", async () => {
            const files = await generateToMap(buildConfig({ ...base, navigation: "imperative" }))
            // Even imperative navigation should have a router config file
            const routerFile = getFileContent(files, "app_router.dart")
            expect(routerFile).toBeDefined()
        })
    })
})
