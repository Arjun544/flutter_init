import type {
    BackendConfig,
    ScaffoldConfig,
} from "../../app/lib/config/schema"
import { defaultBackendConfig, MiscConfig } from "../../app/lib/config/schema"
import { PrimaryCombo } from "./matrix.config"
import { MISC_DEFAULT, safeProfile } from "./misc-profiles"

/**
 * Build a full ScaffoldConfig from a PrimaryCombo and an optional MiscProfile.
 */
export function buildConfig(
    combo: PrimaryCombo,
    miscProfile: MiscConfig = MISC_DEFAULT
): ScaffoldConfig {
    const safeMisc = safeProfile(miscProfile, combo)
    const backendConfig: BackendConfig = defaultBackendConfig(combo.backend)

    return {
        appName: "test_app",
        packageId: "com.example.test_app",
        description: "Test scaffold for combination testing.",
        theme: {
            preset: "material3",
            primaryColor: "#6750A4",
            darkMode: { enabled: true, system: true },
            customFonts: [],
        },
        icons: {
            default: true,
            iconsax_plus: false,
            flutter_remix: false,
            hugeicons: false,
        },
        stateManagement: combo.stateManagement,
        backend: backendConfig,
        localization: { enabled: true, supportedLocales: ["en", "es"] },
        navigation: combo.navigation,
        architecture: combo.architecture,
        misc: safeMisc,
    }
}
