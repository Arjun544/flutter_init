import { describe, expect, it } from "vitest"

import type { ScaffoldConfig } from "@/app/lib/config/schema"
import { defaultBackendConfig } from "@/app/lib/config/schema"
import {
    assertNoUnresolvedTokens,
    assertRequiredFilesExist,
} from "../utils/assertions"
import { buildConfig } from "../utils/config-builder"
import { generateToMap, getFile } from "../utils/generate"
import type { PrimaryCombo } from "../utils/matrix.config"

function buildLlmConfig(overrides: Partial<ScaffoldConfig> = {}): ScaffoldConfig {
    const base = buildConfig({
        architecture: "clean",
        stateManagement: "riverpod",
        navigation: "go_router",
        backend: "supabase",
    })
    return { ...base, ...overrides }
}

describe("LLM context files", () => {
    it("emits AGENTS.md, DESIGN.md, and Cursor rule on every generation", async () => {
        const files = await generateToMap(buildLlmConfig())
        assertRequiredFilesExist(files)
        assertNoUnresolvedTokens(files)

        expect(getFile(files, "AGENTS.md")).toBeDefined()
        expect(getFile(files, "DESIGN.md")).toBeDefined()
        expect(getFile(files, ".cursor/rules/flutter-project.mdc")).toBeDefined()
    })

    it("renders stack-specific content for clean + riverpod + supabase + go_router", async () => {
        const agents = getFile(
            await generateToMap(buildLlmConfig()),
            "AGENTS.md"
        )!
        expect(agents).toContain("clean")
        expect(agents).toContain("riverpod")
        expect(agents).toContain("supabase")
        expect(agents).toContain("go_router")
        expect(agents).toContain("lib/src/features/")
        expect(agents).toContain("ref.watch")
        expect(agents).toContain("Supabase")
    })

    it("renders mvc + bloc + firebase content", async () => {
        const config = buildLlmConfig({
            architecture: "mvc",
            stateManagement: "bloc",
            navigation: "auto_route",
            backend: defaultBackendConfig("firebase"),
        })
        const agents = getFile(await generateToMap(config), "AGENTS.md")!
        expect(agents).toContain("mvc")
        expect(agents).toContain("lib/src/controllers/")
        expect(agents).toContain("BlocBuilder")
        expect(agents).toContain("Firebase")
        expect(agents).toContain("build_runner")
    })

    it("omits backend section when provider is none", async () => {
        const config = buildLlmConfig({
            architecture: "feature-first",
            stateManagement: "getx",
            navigation: "getx",
            backend: { provider: "none" },
        })
        const agents = getFile(await generateToMap(config), "AGENTS.md")!
        expect(agents).toContain("feature-first")
        expect(agents).not.toContain("## Backend (none)")
        expect(agents).not.toContain("Row Level Security")
    })

    it("DESIGN.md includes ScreenUtil when enabled", async () => {
        const withUtil = getFile(
            await generateToMap(
                buildLlmConfig({
                    misc: { ...buildLlmConfig().misc, usesScreenutil: true },
                })
            ),
            "DESIGN.md"
        )!
        expect(withUtil).toContain("ScreenUtil")
        expect(withUtil).toContain("390×844")

        const withoutUtil = getFile(
            await generateToMap(
                buildLlmConfig({
                    misc: { ...buildLlmConfig().misc, usesScreenutil: false },
                })
            ),
            "DESIGN.md"
        )!
        expect(withoutUtil).not.toContain("ScreenUtilInit")
        expect(withoutUtil).toContain("Responsive layout")
    })

    it("DESIGN.md includes primary color from config", async () => {
        const design = getFile(await generateToMap(buildLlmConfig()), "DESIGN.md")!
        expect(design).toContain("#6750A4")
    })

    it("Cursor rule has alwaysApply frontmatter and embedded stack details", async () => {
        const mdc = getFile(
            await generateToMap(buildLlmConfig()),
            ".cursor/rules/flutter-project.mdc"
        )!
        expect(mdc).toMatch(/^---/)
        expect(mdc).toContain("alwaysApply: true")
        expect(mdc).toContain("AGENTS.md")
        expect(mdc).toContain("DESIGN.md")
        expect(mdc).toContain("SETUP.md")
        // Embedded context (not only pointers)
        expect(mdc).toContain("Architecture (`clean`)")
        expect(mdc).toContain("lib/src/features/")
        expect(mdc).toContain("State management (riverpod)")
        expect(mdc).toContain("ref.watch")
        expect(mdc).toContain("AppSpacing")
        expect(mdc).toContain("Safe to modify")
        expect(mdc).toContain("go_router")
    })

    it("does not mention build_runner when stack does not need codegen", async () => {
        const config = buildLlmConfig({
            stateManagement: "provider",
            navigation: "go_router",
            backend: { provider: "none" },
            misc: {
                ...buildLlmConfig().misc,
                usesHive: false,
            },
        })
        const agents = getFile(await generateToMap(config), "AGENTS.md")!
        expect(agents).toContain("No `build_runner` step is required")
    })

    it("passes token check across critical architecture combos", async () => {
        const combos: PrimaryCombo[] = [
            { architecture: "layer-first", stateManagement: "mobx", navigation: "auto_route", backend: "firebase" },
            { architecture: "mvvm", stateManagement: "none", navigation: "imperative", backend: "none" },
        ]
        for (const combo of combos) {
            const files = await generateToMap(buildConfig(combo))
            assertNoUnresolvedTokens(files)
            expect(getFile(files, "AGENTS.md")).toBeDefined()
        }
    })
})
