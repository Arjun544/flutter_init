import path from "node:path"
import { defineConfig } from "vitest/config"

export default defineConfig({
    test: {
        environment: "node",
        include: ["tests/**/*.spec.ts"],
        // Exclude e2e tests from default `vitest run` — they need Dart SDK
        exclude: ["tests/e2e/**"],
        testTimeout: 30_000,
        hookTimeout: 30_000,
        reporters: ["default"],
        // Vitest 4: pool options are top-level
        isolate: false,
        fileParallelism: false,
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "."),
        },
    },
})
