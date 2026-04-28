import path from "node:path"

import JSZip from "jszip"
import { describe, expect, it } from "vitest"

import { defaultConfig } from "@/app/lib/config/schema"
import { generateFlutterScaffold } from "@/app/lib/generator"
import { createHandlebarsEnvironment } from "@/app/lib/generator/handlebars"

describe("handlebars helpers", () => {
    it("converts text to kebab-case", async () => {
        const hbs = await createHandlebarsEnvironment(
            path.join(process.cwd(), "templates", "flutter", "partials")
        )
        const template = hbs.compile("{{kebabCase value}}")
        expect(template({ value: "Hello World" })).toBe("hello-world")
    })
})

describe("generator", () => {
    it("produces a zip with core flutter files", async () => {
        const buffer = await generateFlutterScaffold(defaultConfig)
        const zip = await JSZip.loadAsync(buffer)
        const files = Object.keys(zip.files)

        expect(files.some((file) => file.endsWith("pubspec.yaml"))).toBe(true)
        expect(files.some((file) => file.endsWith("lib/main.dart"))).toBe(true)
        expect(
            files.some((file) =>
                file.includes("lib/src/theme/app_spacing.dart")
            )
        ).toBe(true)
    })

    it("does not emit ScreenUtil num extensions when disabled", async () => {
        const buffer = await generateFlutterScaffold({
            ...defaultConfig,
            misc: {
                ...defaultConfig.misc,
                usesScreenutil: false,
            },
        })
        const zip = await JSZip.loadAsync(buffer)

        const dartFiles = Object.keys(zip.files).filter((f) => f.endsWith(".dart"))
        const contents = await Promise.all(
            dartFiles.map(async (f) => ({
                file: f,
                text: await zip.file(f)!.async("string"),
            }))
        )

        // When ScreenUtil is disabled we should NOT generate `AppSpacing.xxx.0`
        // (or `AppSpacing.xxx.w/h/...`). `AppSpacing.xxx` should remain a plain double.
        const offenders = contents
            .filter(({ text }) => /AppSpacing\.\w+\.\s*(0|w|h|sp|r)\b/.test(text))
            .map(({ file }) => file)

        expect(offenders, `Found ScreenUtil extensions in: ${offenders.join(", ")}`).toEqual([])
    })
})
