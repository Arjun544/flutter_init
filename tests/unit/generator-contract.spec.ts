import { describe, expect, it } from "vitest"

import {
    deriveGeneratorCapabilities,
    selectOverlayKeys,
} from "@/shared/generator-contract"

describe("generator capability contract", () => {
    const base = {
        stateManagement: "riverpod",
        navigation: "go_router",
        localizationEnabled: false,
        usesDotenv: true,
        usesHive: false,
    }

    it("enables Firebase auth for any selected auth provider", () => {
        for (const option of ["authEmail", "authGoogle", "authPhone"]) {
            const capabilities = deriveGeneratorCapabilities({
                ...base,
                backend: { provider: "firebase", options: { [option]: true } },
            })
            expect(capabilities.usesFirebaseAuth).toBe(true)
        }
    })

    it("does not enable backend capabilities for the none provider", () => {
        const capabilities = deriveGeneratorCapabilities({
            ...base,
            backend: { provider: "none" },
        })
        expect(capabilities.usesFirebaseAuth).toBe(false)
        expect(capabilities.usesSupabaseDatabase).toBe(false)
        expect(capabilities.usesAppwriteStorage).toBe(false)
    })

    it("identifies every code-generation source", () => {
        expect(deriveGeneratorCapabilities({
            ...base,
            navigation: "auto_route",
            backend: { provider: "none" },
        }).requiresCodeGeneration).toBe(true)
        expect(deriveGeneratorCapabilities({
            ...base,
            backend: { provider: "none" },
            usesHive: true,
        }).requiresCodeGeneration).toBe(true)
    })

    it("selects optional overlays independently", () => {
        const selection = selectOverlayKeys({
            ...base,
            architecture: "clean",
            backend: { provider: "none" },
            usesDio: false,
            usesHttp: true,
            usesCachedNetworkImage: true,
            usesSecureStorage: true,
            usesSharedPreferences: false,
            usesPathProvider: false,
            usesSharePlus: false,
            usesPermissionHandler: false,
            usesUrlLauncher: true,
            usesGeolocator: false,
            usesImagePicker: false,
            usesFilePicker: false,
            usesDeviceInfoPlus: false,
            usesAppVersionUpdate: false,
        })
        expect(selection.networking).toBe("http")
        expect(selection.storage).toEqual(["secure_storage"])
        expect(selection.utilities).toEqual(["url_launcher"])
        expect(selection.cachedImage).toBe(true)
    })
})
