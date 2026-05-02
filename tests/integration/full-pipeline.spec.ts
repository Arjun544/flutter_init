/**
 * full-pipeline.spec.ts
 *
 * Integration tests that exercise the full generation pipeline
 * for the critical combinations. Each test generates a complete
 * project and runs ALL assertion categories against it.
 */

import { describe, expect, it } from "vitest"

import {
    assertArchitectureStructure,
    assertNoEmptyFiles,
    assertNoUnresolvedTokens,
    assertRequiredFilesExist,
    assertValidPubspec,
    getFileContent,
} from "../utils/assertions"
import { generateToMap, getPubspecContent } from "../utils/generate"
import { buildConfig, combinationLabel } from "../utils/matrix.config"
import { CRITICAL_COMBINATIONS } from "../utils/critical-combos"

describe("Full Pipeline — Critical Combinations", () => {
    it.each(
        CRITICAL_COMBINATIONS.map((c, i) => [i, combinationLabel(c), c] as const)
    )(
        "combo #%i — %s passes all assertions",
        { timeout: 30_000 },
        async (_index, _label, combo) => {
            const config = buildConfig(combo)
            const files = await generateToMap(config)

            // 1. Token cleanliness
            assertNoUnresolvedTokens(files)

            // 2. Structural integrity
            assertRequiredFilesExist(files)
            assertNoEmptyFiles(files)
            assertArchitectureStructure(files, combo.architecture)

            // 3. pubspec validity
            const pubspec = getPubspecContent(files)
            assertValidPubspec(pubspec)

            // 4. Variable injection — app name appears correctly
            expect(pubspec).toContain("name: test_app")

            // 5. main.dart has substantive content
            const mainDart = getFileContent(files, "lib/main.dart")
            expect(mainDart).toBeDefined()
            expect(mainDart!.length).toBeGreaterThan(50)
            expect(mainDart).toContain("main()")

            // 6. Reasonable file count (a generated project should have 20+ files)
            expect(files.size).toBeGreaterThan(20)
        }
    )
})
