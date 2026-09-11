import { describe, expect, it } from "vitest"

import { buildConfig } from "../utils/config-builder"
import { generateToMap, getFile } from "../utils/generate"
import { MISC_DEFAULT } from "../utils/misc-profiles"

describe("complete project packaging", { timeout: 180_000 }, () => {
    it("includes Flutter platform scaffolding and selected application identity", async () => {
        const files = await generateToMap(buildConfig({
            architecture: "feature-first",
            stateManagement: "riverpod",
            backend: "none",
            navigation: "go_router",
        }, MISC_DEFAULT))

        expect(getFile(files, "android/app/build.gradle.kts")).toBeDefined()
        expect(getFile(files, "ios/Runner/Info.plist")).toBeDefined()
        expect(getFile(files, "web/index.html")).toBeDefined()
        expect(getFile(files, "windows/runner/Runner.rc")).toBeDefined()
        expect(getFile(files, "macos/Runner/Info.plist")).toBeDefined()
        expect(getFile(files, "linux/runner/main.cc")).toBeDefined()
        expect(getFile(files, "android/app/build.gradle.kts")).toContain("com.example.test_app")
    })
})
