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
                file.includes("lib/src/features/counter/presentation/counter_page.dart")
            )
        ).toBe(true)
    })
})
