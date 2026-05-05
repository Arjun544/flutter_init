import { describe, expect, it } from "vitest"
import {
    assertArchitectureStructure,
    assertNoEmptyFiles,
    assertNoUnresolvedTokens,
    assertRequiredFilesExist,
    assertValidPubspec,
} from "../utils/assertions"
import { buildConfig } from "../utils/config-builder"
import { CRITICAL_COMBOS } from "../utils/critical-combos"
import { generateToMap, getFile, getPubspecContent } from "../utils/generate"
import { COMBO_LABEL } from "../utils/matrix.config"

describe("Full Pipeline — Critical Combinations", () => {
    it.each(
        CRITICAL_COMBOS.map((c, i) => [i, COMBO_LABEL(c), c] as const)
    )(
        "combo #%i — %s passes all assertions",
        { timeout: 30_000 },
        async (_index, _label, combo) => {
            const config = buildConfig(combo, combo.miscProfile)
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
            const mainDart = getFile(files, "lib/main.dart")
            expect(mainDart).toBeDefined()
            expect(mainDart!.length).toBeGreaterThan(50)
            expect(mainDart).toContain("main()")

            // 6. Reasonable file count (a generated project should have 20+ files)
            expect(files.size).toBeGreaterThan(20)
        }
    )
})
