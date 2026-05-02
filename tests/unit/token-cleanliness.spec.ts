/**
 * token-cleanliness.spec.ts
 *
 * The highest-value Layer 1 test.
 * Scans every file in every generated project for unresolved Handlebars tokens.
 * A single unresolved token means the template engine failed to process a variable,
 * which will cause a Dart compilation failure.
 *
 * Runs against ALL valid combinations. This is the most comprehensive guard.
 */

import { describe, it } from "vitest"

import { assertNoUnresolvedTokens } from "../utils/assertions"
import { generateToMap } from "../utils/generate"
import {
    ALL_COMBINATIONS,
    buildConfig
} from "../utils/matrix.config"

describe("Token Cleanliness — No Unresolved Handlebars Tokens", { timeout: 600_000 }, () => {
    // Use a subset for faster iteration during development.
    // In CI Tier 1, the full ALL_COMBINATIONS array runs.
    const combinations = ALL_COMBINATIONS

    it.each(combinations.map((c, i) => [i, c] as const))(
        "combo #%i — %s has zero unresolved tokens",
        { timeout: 15_000 },
        async (_index, combo) => {
            const config = buildConfig(combo)
            const files = await generateToMap(config)

            // This will throw with a detailed message if any tokens remain
            assertNoUnresolvedTokens(files)
        }
    )
}) // 10 minute overall timeout for the full suite
