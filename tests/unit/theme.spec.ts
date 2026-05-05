import { beforeAll, describe, expect, it } from "vitest"
import { getFileContent } from "../utils/assertions"
import { buildConfig } from "../utils/config-builder"
import { generateToMap, getPubspecContent } from "../utils/generate"
import { PrimaryCombo } from "../utils/matrix.config"

const base: PrimaryCombo = {
    architecture: "feature-first",
    stateManagement: "riverpod",
    backend: "none",
    navigation: "go_router",
}

describe("Theme Flags", () => {
    let defaultFiles: Map<string, string>
    let defaultPubspec: string

    let cupertinoFiles: Map<string, string>
    let cupertinoPubspec: string

    let customFontFiles: Map<string, string>
    let customFontPubspec: string

    beforeAll(async () => {
        const defaultConfig = buildConfig(base)

        const cupertinoConfig = buildConfig(base)
        cupertinoConfig.theme.preset = "cupertino"

        const customFontConfig = buildConfig(base)
        customFontConfig.theme.customFonts = [
            { family: "Inter", fileName: "Inter-Regular.ttf", style: "normal", weight: "400" },
            { family: "Inter", fileName: "Inter-Bold.ttf", style: "normal", weight: "700" },
            { family: "Roboto", fileName: "Roboto-Italic.ttf", style: "italic", weight: "400" },
        ]

        const [defMap, cupMap, fontMap] = await Promise.all([
            generateToMap(defaultConfig),
            generateToMap(cupertinoConfig),
            generateToMap(customFontConfig),
        ])

        defaultFiles = defMap
        defaultPubspec = getPubspecContent(defMap)

        cupertinoFiles = cupMap
        cupertinoPubspec = getPubspecContent(cupMap)

        customFontFiles = fontMap
        customFontPubspec = getPubspecContent(fontMap)
    })

    describe("Theme Preset", () => {
        it("when preset is material3 (default), generates material design defaults", () => {
            const appDart = getFileContent(defaultFiles, "lib/src/app.dart")
            expect(appDart).toBeDefined()
            expect(appDart).toContain("MaterialApp")
        })

        it("when preset is cupertino, generates cupertino defaults", () => {
            const appDart = getFileContent(cupertinoFiles, "lib/src/app.dart")
            expect(appDart).toBeDefined()
            // Should contain CupertinoThemeData or similar
            expect(appDart).toContain("Cupertino")
        })
    })

    describe("Custom Fonts", () => {
        it("when no fonts are provided, fonts section is omitted from pubspec", () => {
            expect(defaultPubspec).not.toMatch(/^  fonts:/m)
            expect(defaultPubspec).not.toMatch(/- assets\/fonts\//g)
        })

        it("when fonts are provided, fonts block is properly constructed in pubspec", () => {
            expect(customFontPubspec).toMatch(/^  fonts:/m)
            expect(customFontPubspec).toMatch(/- family: Inter/g)
            expect(customFontPubspec).toMatch(/- asset: assets\/fonts\/Inter-Regular.ttf/g)
            expect(customFontPubspec).toMatch(/- asset: assets\/fonts\/Inter-Bold.ttf/g)
            expect(customFontPubspec).toMatch(/weight: 700/g)
            expect(customFontPubspec).toMatch(/- family: Roboto/g)
            expect(customFontPubspec).toMatch(/- asset: assets\/fonts\/Roboto-Italic.ttf/g)
            expect(customFontPubspec).toMatch(/style: italic/g)
        })

        it("when fonts are provided, assets/fonts/ is in pubspec assets", () => {
            expect(customFontPubspec).toMatch(/- assets\/fonts\//g)
        })
    })
})
