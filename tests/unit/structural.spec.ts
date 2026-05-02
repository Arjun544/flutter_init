/**
 * structural.spec.ts
 *
 * Verifies that every generated project has the correct file structure:
 *  - Required files always present (pubspec.yaml, lib/main.dart, etc.)
 *  - No empty files
 *  - Architecture-appropriate directories exist
 */

import { describe, it } from "vitest"

import {
    assertArchitectureStructure,
    assertNoEmptyFiles,
    assertRequiredFilesExist,
} from "../utils/assertions"
import { generateToMap } from "../utils/generate"
import {
    ALL_COMBINATIONS,
    buildConfig,
    combinationLabel,
} from "../utils/matrix.config"

describe("Structural Integrity", { timeout: 600_000 }, () => {
    const combinations = ALL_COMBINATIONS

    it.each(combinations.map((c, i) => [i, combinationLabel(c), c] as const))(
        "combo #%i — %s has all required files",
        { timeout: 15_000 },
        async (_index, _label, combo) => {
            const config = buildConfig(combo)
            const files = await generateToMap(config)

            assertRequiredFilesExist(files)
        }
    )

    it.each(combinations.map((c, i) => [i, combinationLabel(c), c] as const))(
        "combo #%i — %s has no empty files",
        { timeout: 15_000 },
        async (_index, _label, combo) => {
            const config = buildConfig(combo)
            const files = await generateToMap(config)

            assertNoEmptyFiles(files)
        }
    )

    it.each(combinations.map((c, i) => [i, combinationLabel(c), c] as const))(
        "combo #%i — %s has correct architecture structure",
        { timeout: 15_000 },
        async (_index, _label, combo) => {
            const config = buildConfig(combo)
            const files = await generateToMap(config)

            assertArchitectureStructure(files, combo.architecture)
        }
    )
})
