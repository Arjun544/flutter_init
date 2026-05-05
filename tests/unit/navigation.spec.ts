import { beforeAll, describe, expect, it } from "vitest"
import {
    assertDependencyAbsent,
    assertDependencyPresent,
    getFileContent
} from "../utils/assertions"
import { buildConfig } from "../utils/config-builder"
import { generateToMap, getPubspecContent } from "../utils/generate"
import { PrimaryCombo } from "../utils/matrix.config"
import { MISC_DEFAULT } from "../utils/misc-profiles"

const base: Omit<PrimaryCombo, "navigation"> = {
    architecture: "feature-first",
    stateManagement: "riverpod",
    backend: "none",
}

describe("Navigation", () => {
    // ── go_router ───────────────────────────────────────────────
    describe("go_router", () => {
        let files: Map<string, string>
        let pubspec: string

        beforeAll(async () => {
            files = await generateToMap(buildConfig({ ...base, navigation: "go_router" }, MISC_DEFAULT))
            pubspec = getPubspecContent(files)
        })

        it("includes go_router in pubspec", () => {
            assertDependencyPresent(pubspec, "go_router")
        })

        it("does not include auto_route", () => {
            assertDependencyAbsent(pubspec, "auto_route")
            assertDependencyAbsent(pubspec, "auto_route_generator")
        })

        it("generates router configuration file", () => {
            const routerFile = getFileContent(files, "app_router.dart")
            expect(routerFile).toBeDefined()
        })
    })

    // ── auto_route ──────────────────────────────────────────────
    describe("auto_route", () => {
        let pubspec: string

        beforeAll(async () => {
            const files = await generateToMap(buildConfig({ ...base, navigation: "auto_route" }, MISC_DEFAULT))
            pubspec = getPubspecContent(files)
        })

        it("includes auto_route in pubspec", () => {
            assertDependencyPresent(pubspec, "auto_route")
        })

        it("includes auto_route_generator in dev_dependencies", () => {
            assertDependencyPresent(pubspec, "auto_route_generator")
            assertDependencyPresent(pubspec, "build_runner")
        })

        it("does not include go_router", () => {
            assertDependencyAbsent(pubspec, "go_router")
        })
    })

    // ── imperative ──────────────────────────────────────────────
    describe("imperative (Navigator 1.0)", () => {
        let files: Map<string, string>
        let pubspec: string

        beforeAll(async () => {
            files = await generateToMap(buildConfig({ ...base, navigation: "imperative" }, MISC_DEFAULT))
            pubspec = getPubspecContent(files)
        })

        it("does not include any routing package", () => {
            assertDependencyAbsent(pubspec, "go_router")
            assertDependencyAbsent(pubspec, "auto_route")
            assertDependencyAbsent(pubspec, "auto_route_generator")
        })

        it("still generates app_router.dart", () => {
            const routerFile = getFileContent(files, "app_router.dart")
            expect(routerFile).toBeDefined()
        })
    })
})
