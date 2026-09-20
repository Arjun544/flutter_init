import { describe, expect, it } from "vitest"

import { buildConfig } from "../utils/config-builder"
import { generateToMap, getFile } from "../utils/generate"
import { MISC_DEFAULT } from "../utils/misc-profiles"

describe("complete project packaging", { timeout: 180_000 }, () => {
    it("packages Dart scaffold identity without native platform folders", async () => {
        const files = await generateToMap(buildConfig({
            architecture: "feature-first",
            stateManagement: "riverpod",
            backend: "none",
            navigation: "go_router",
        }, MISC_DEFAULT))

        // Web ZIP is a Dart/source overlay — platform runners come from CLI
        // (`flutter create`) only.
        expect(getFile(files, "android/app/build.gradle.kts")).toBeUndefined()
        expect(getFile(files, "ios/Runner/Info.plist")).toBeUndefined()
        expect(getFile(files, "web/index.html")).toBeUndefined()
        expect(getFile(files, "windows/runner/Runner.rc")).toBeUndefined()
        expect(getFile(files, "macos/Runner/Info.plist")).toBeUndefined()
        expect(getFile(files, "linux/runner/main.cc")).toBeUndefined()

        const pubspec = getFile(files, "pubspec.yaml")
        expect(pubspec).toBeDefined()
        expect(pubspec).toContain("name: test_app")

        const setup = getFile(files, "SETUP.md")
        expect(setup).toBeDefined()
        expect(setup).toContain("flutter create . --project-name test_app --org com.example")
        expect(setup).toContain("Platform folders (web download only)")
    })
})
