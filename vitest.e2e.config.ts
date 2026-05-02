import path from "node:path"
import { defineConfig } from "vitest/config"

/**
 * Separate vitest config for e2e tests that require Dart SDK.
 * Used via: vitest run --config vitest.e2e.config.ts
 */
export default defineConfig({
    test: {
        environment: "node",
        include: ["tests/e2e/**/*.spec.ts"],
        testTimeout: 120_000,
        hookTimeout: 30_000,
        isolate: false,
        fileParallelism: false,
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "."),
        },
    },
})
