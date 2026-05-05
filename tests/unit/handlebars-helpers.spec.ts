import { createHandlebarsEnvironment } from "@/app/lib/generator/handlebars"
import path from "node:path"
import { beforeAll, describe, expect, it } from "vitest"

const partialsDir = path.join(process.cwd(), "templates", "flutter", "partials")

describe("Handlebars Helpers", () => {
    let hbs: any

    beforeAll(async () => {
        hbs = await createHandlebarsEnvironment(partialsDir)
    })

    // ── Case conversion helpers ─────────────────────────────────

    describe("kebabCase", () => {
        it("converts space-separated words", () => {
            const template = hbs.compile("{{kebabCase value}}")
            expect(template({ value: "Hello World" })).toBe("hello-world")
        })

        it("converts camelCase", () => {
            const template = hbs.compile("{{kebabCase value}}")
            expect(template({ value: "myAppName" })).toBe("my-app-name")
        })

        it("converts PascalCase", () => {
            const template = hbs.compile("{{kebabCase value}}")
            expect(template({ value: "MyAppName" })).toBe("my-app-name")
        })

        it("handles underscores", () => {
            const template = hbs.compile("{{kebabCase value}}")
            expect(template({ value: "my_app_name" })).toBe("my-app-name")
        })

        it("handles already kebab-case", () => {
            const template = hbs.compile("{{kebabCase value}}")
            expect(template({ value: "my-app-name" })).toBe("my-app-name")
        })
    })

    describe("snakeCase", () => {
        it("converts space-separated words", () => {
            const template = hbs.compile("{{snakeCase value}}")
            expect(template({ value: "Hello World" })).toBe("hello_world")
        })

        it("converts camelCase", () => {
            const template = hbs.compile("{{snakeCase value}}")
            expect(template({ value: "myAppName" })).toBe("my_app_name")
        })

        it("converts kebab-case", () => {
            const template = hbs.compile("{{snakeCase value}}")
            expect(template({ value: "my-app-name" })).toBe("my_app_name")
        })
    })

    describe("pascalCase", () => {
        it("converts space-separated words", () => {
            const template = hbs.compile("{{pascalCase value}}")
            expect(template({ value: "hello world" })).toBe("HelloWorld")
        })

        it("converts snake_case", () => {
            const template = hbs.compile("{{pascalCase value}}")
            expect(template({ value: "my_app_name" })).toBe("MyAppName")
        })

        it("converts kebab-case", () => {
            const template = hbs.compile("{{pascalCase value}}")
            expect(template({ value: "my-app-name" })).toBe("MyAppName")
        })
    })

    // ── Boolean logic helpers ───────────────────────────────────

    describe("eq", () => {
        it("returns true for equal strings", () => {
            const template = hbs.compile('{{#if (eq a "hello")}}yes{{else}}no{{/if}}')
            expect(template({ a: "hello" })).toBe("yes")
        })

        it("returns false for different strings", () => {
            const template = hbs.compile('{{#if (eq a "hello")}}yes{{else}}no{{/if}}')
            expect(template({ a: "world" })).toBe("no")
        })

        it("strict equality — no type coercion", () => {
            const template = hbs.compile('{{#if (eq a "1")}}yes{{else}}no{{/if}}')
            expect(template({ a: 1 })).toBe("no")
        })
    })

    describe("and", () => {
        it("returns true when all args truthy", () => {
            const template = hbs.compile("{{#if (and a b)}}yes{{else}}no{{/if}}")
            expect(template({ a: true, b: true })).toBe("yes")
        })

        it("returns false when any arg falsy", () => {
            const template = hbs.compile("{{#if (and a b)}}yes{{else}}no{{/if}}")
            expect(template({ a: true, b: false })).toBe("no")
        })
    })

    describe("or", () => {
        it("returns true when any arg truthy", () => {
            const template = hbs.compile("{{#if (or a b)}}yes{{else}}no{{/if}}")
            expect(template({ a: false, b: true })).toBe("yes")
        })

        it("returns false when all args falsy", () => {
            const template = hbs.compile("{{#if (or a b)}}yes{{else}}no{{/if}}")
            expect(template({ a: false, b: false })).toBe("no")
        })
    })

    describe("not", () => {
        it("negates true to false", () => {
            const template = hbs.compile("{{#if (not a)}}yes{{else}}no{{/if}}")
            expect(template({ a: true })).toBe("no")
        })

        it("negates false to true", () => {
            const template = hbs.compile("{{#if (not a)}}yes{{else}}no{{/if}}")
            expect(template({ a: false })).toBe("yes")
        })
    })

    // ── res helper ──────────────────────────────────────────────

    describe("res", () => {
        it("appends .w when ScreenUtil enabled", () => {
            const template = hbs.compile("{{res 16 'w' usesScreenutil}}")
            expect(template({ usesScreenutil: true })).toBe("16.w")
        })

        it("appends .h when ScreenUtil enabled", () => {
            const template = hbs.compile("{{res 16 'h' usesScreenutil}}")
            expect(template({ usesScreenutil: true })).toBe("16.h")
        })

        it("appends .sp when ScreenUtil enabled", () => {
            const template = hbs.compile("{{res 14 'sp' usesScreenutil}}")
            expect(template({ usesScreenutil: true })).toBe("14.sp")
        })

        it("returns plain double when ScreenUtil disabled (number input)", () => {
            const template = hbs.compile("{{res 16 'w' usesScreenutil}}")
            expect(template({ usesScreenutil: false })).toBe("16")
        })

        it("returns expression as-is when ScreenUtil disabled (string input)", () => {
            const template = hbs.compile("{{res 'AppSpacing.lg' 'w' usesScreenutil}}")
            expect(template({ usesScreenutil: false })).toBe("AppSpacing.lg")
        })
    })

    // ── when helper ─────────────────────────────────────────────

    describe("when", () => {
        it("renders fn block when condition is true", () => {
            const template = hbs.compile("{{#when show}}visible{{else}}hidden{{/when}}")
            expect(template({ show: true })).toBe("visible")
        })

        it("renders inverse block when condition is false", () => {
            const template = hbs.compile("{{#when show}}visible{{else}}hidden{{/when}}")
            expect(template({ show: false })).toBe("hidden")
        })
    })

    // ── json helper ─────────────────────────────────────────────

    describe("json", () => {
        it("serializes an object to pretty JSON", () => {
            const template = hbs.compile("{{{json data}}}")
            const result = template({ data: { key: "value" } })
            expect(result).toContain('"key": "value"')
        })
    })

    // ── indent helper ───────────────────────────────────────────

    describe("indent", () => {
        it("indents each line by the specified number of spaces", () => {
            const template = hbs.compile("{{{indent text 4}}}")
            const result = template({ text: "line1\nline2" })
            expect(result).toBe("    line1\n    line2")
        })

        it("does not indent empty lines", () => {
            const template = hbs.compile("{{{indent text 2}}}")
            const result = template({ text: "line1\n\nline2" })
            expect(result).toBe("  line1\n\n  line2")
        })
    })
})
