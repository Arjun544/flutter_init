import { describe, expect, it } from "vitest"

import { defaultConfig, scaffoldConfigSchema } from "@/app/lib/config/schema"
import { getFileContent } from "../utils/assertions"
import { buildConfig } from "../utils/config-builder"
import { generateToMap, getFile, getPubspecContent } from "../utils/generate"
import type { PrimaryCombo } from "../utils/matrix.config"

const base: PrimaryCombo = {
    architecture: "feature-first",
    stateManagement: "riverpod",
    backend: "none",
    navigation: "go_router",
}

describe("UI component library config", () => {
    it("defaults to adaptive App kit without shadcn", () => {
        expect(defaultConfig.ui).toEqual({
            platformStyle: "adaptive",
            shadcn: false,
            defaultKit: "app",
        })
        const parsed = scaffoldConfigSchema.parse(defaultConfig)
        expect(parsed.ui.shadcn).toBe(false)
    })

    it("rejects defaultKit=shadcn when shadcn is false", () => {
        const result = scaffoldConfigSchema.safeParse({
            ...defaultConfig,
            ui: { platformStyle: "adaptive", shadcn: false, defaultKit: "shadcn" },
        })
        expect(result.success).toBe(false)
    })

    it("accepts shadcn with defaultKit=shadcn", () => {
        const result = scaffoldConfigSchema.safeParse({
            ...defaultConfig,
            ui: { platformStyle: "material", shadcn: true, defaultKit: "shadcn" },
        })
        expect(result.success).toBe(true)
    })
})

describe("UI component library generation", () => {
    it("always emits App platform core and AppButton under ui/app", async () => {
        const files = await generateToMap(buildConfig(base))
        expect(getFile(files, "lib/src/shared/widgets/ui/app/app_platform.dart")).toBeDefined()
        expect(getFile(files, "lib/src/shared/widgets/ui/app/actions/app_button.dart")).toBeDefined()
        expect(getFile(files, "lib/src/shared/widgets/ui/ui_showcase_screen.dart")).toBeDefined()
        const app = getFileContent(files, "lib/src/app.dart")
        expect(app).toContain("AppPlatformScope")
        expect(app).toContain("AppPlatformStyle.adaptive")
        expect(app).not.toContain("ShadApp.custom")
        const pubspec = getPubspecContent(files)
        expect(pubspec).not.toContain("shadcn_ui:")
        expect(pubspec).toContain('sdk: ">=3.5.0 <4.0.0"')
    })

    it("merges shadcn overlay and raises SDK floor when enabled", async () => {
        const config = {
            ...buildConfig(base),
            ui: {
                platformStyle: "adaptive" as const,
                shadcn: true,
                defaultKit: "app" as const,
            },
        }
        const files = await generateToMap(config)
        expect(
            getFile(files, "lib/src/shared/widgets/ui/shadcn/shad_theme.dart"),
        ).toBeDefined()
        expect(
            getFile(files, "lib/src/shared/widgets/ui/shadcn/shad_app_button.dart"),
        ).toBeDefined()
        const pubspec = getPubspecContent(files)
        expect(pubspec).toContain("shadcn_ui:")
        expect(pubspec).toContain('sdk: ">=3.11.0 <4.0.0"')
        const app = getFileContent(files, "lib/src/app.dart")
        expect(app).toContain("ShadApp.custom")
        expect(app).toContain("ShadAppBuilder")
        expect(app).toContain("GlobalShadLocalizations")
    })

    it("uses ShadApp names in login when defaultKit is shadcn", async () => {
        const config = {
            ...buildConfig(base),
            ui: {
                platformStyle: "cupertino" as const,
                shadcn: true,
                defaultKit: "shadcn" as const,
            },
        }
        const files = await generateToMap(config)
        const login = getFileContent(files, "login_screen.dart")
        expect(login).toContain("ShadAppButton")
        expect(login).toContain("ShadAppTextField")
        expect(login).not.toMatch(/\bAppButton\(/)
        const app = getFileContent(files, "lib/src/app.dart")
        expect(app).toContain("AppPlatformStyle.cupertino")
    })

    it("documents UI components in AGENTS.md", async () => {
        const files = await generateToMap(buildConfig(base))
        const agents = getFileContent(files, "AGENTS.md")
        expect(agents).toContain("UI component library")
        expect(agents).toContain("AppButton")
        expect(agents).toContain("AppPlatformScope")
    })
})
