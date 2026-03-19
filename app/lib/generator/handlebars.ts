import fs from "node:fs/promises"
import path from "node:path"

import Handlebars from "handlebars"

type Hbs = typeof Handlebars

function kebabCase(value: string) {
    return value
        .replace(/([a-z])([A-Z])/g, "$1-$2")
        .replace(/[^a-zA-Z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .toLowerCase()
}

function snakeCase(value: string) {
    return value
        .replace(/([a-z])([A-Z])/g, "$1_$2")
        .replace(/[^a-zA-Z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "")
        .toLowerCase()
}

function pascalCase(value: string) {
    return value
        .replace(/(^\w|[-_\s]+\w)/g, (match) =>
            match.replace(/[-_\s]/g, "").toUpperCase()
        )
        .replace(/[^a-zA-Z0-9]/g, "")
}

function indentLines(text: string, spaces: number) {
    const pad = " ".repeat(spaces)
    return text
        .split("\n")
        .map((line) => (line.length ? pad + line : line))
        .join("\n")
}

export async function registerPartials(hbs: Hbs, partialsDir: string) {
    const exists = await fs
        .stat(partialsDir)
        .then((stats) => stats.isDirectory())
        .catch(() => false)

    if (!exists) return

    async function walk(dir: string) {
        const entries = await fs.readdir(dir, { withFileTypes: true })
        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name)
            if (entry.isDirectory()) {
                await walk(fullPath)
            } else if (entry.isFile() && entry.name.endsWith(".hbs")) {
                const contents = await fs.readFile(fullPath, "utf8")
                const rel = path.relative(partialsDir, fullPath)
                const name = rel.replace(/\\/g, "/").replace(/\.hbs$/, "")
                hbs.registerPartial(name, contents)
            }
        }
    }

    await walk(partialsDir)
}

export function registerHelpers(hbs: Hbs) {
    hbs.registerHelper("eq", (a, b) => a === b)
    hbs.registerHelper("and", function (...args: unknown[]) {
        return args.slice(0, -1).every(Boolean)
    })
    hbs.registerHelper("or", function (...args: unknown[]) {
        return args.slice(0, -1).some(Boolean)
    })
    hbs.registerHelper("not", (value) => !value)
    hbs.registerHelper("kebabCase", kebabCase)
    hbs.registerHelper("snakeCase", snakeCase)
    hbs.registerHelper("pascalCase", pascalCase)
    hbs.registerHelper("json", (value) => JSON.stringify(value, null, 2))
    hbs.registerHelper("indent", (text: string, spaces = 2) =>
        indentLines(text, Number(spaces))
    )
    hbs.registerHelper("res", (value: number, unit: string, usesScreenutil: boolean) => {
        if (usesScreenutil) {
            return `${value}.${unit}`
        }
        return `${value}.0`
    })
    hbs.registerHelper("when", function (this: unknown, condition, options) {
        return condition ? options.fn(this) : options.inverse(this)
    })
}

export async function createHandlebarsEnvironment(partialsDir: string) {
    const hbs = Handlebars.create()
    registerHelpers(hbs)
    await registerPartials(hbs, partialsDir)
    return hbs
}
