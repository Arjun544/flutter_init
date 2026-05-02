/**
 * matrix.config.ts
 *
 * Single source of truth for the FlutterInit option space.
 * Every test file, CI matrix, and coverage report imports from here.
 *
 * Dimensions (GetX excluded from both state and navigation):
 *   Architecture:       5  (mvc, mvvm, clean, feature-first, layer-first)
 *   State Management:   5  (provider, riverpod, bloc, mobx, none)
 *   Backend:            5  (none, firebase, supabase, appwrite, custom)
 *   Navigation:         3  (imperative, go_router, auto_route)
 *   Misc Profiles:      4  (full, minimal, default, hooks)
 *
 * Primary combos: 5 × 5 × 5 × 3 = 375
 * With misc profiles: 375 × 4 = 1,500 total (minus invalid)
 */

import type {
    ArchitectureStyle,
    BackendConfig,
    BackendProvider,
    MiscConfig,
    NavigationStyle,
    ScaffoldConfig,
    StateManagement,
} from "@/app/lib/config/schema"
import { defaultBackendConfig } from "@/app/lib/config/schema"

// ── Primary dimensions ──────────────────────────────────────────────

export const ARCHITECTURES: readonly ArchitectureStyle[] = [
    "mvc",
    "mvvm",
    "clean",
    "feature-first",
    "layer-first",
] as const satisfies readonly ArchitectureStyle[]

export const STATE_MANAGERS: readonly StateManagement[] = [
    "provider",
    "riverpod",
    "bloc",
    "mobx",
    "none",
] as const satisfies readonly StateManagement[]

export const BACKENDS: readonly BackendProvider[] = [
    "none",
    "firebase",
    "supabase",
    "appwrite",
    "custom",
] as const satisfies readonly BackendProvider[]

export const NAVIGATIONS: readonly NavigationStyle[] = [
    "imperative",
    "go_router",
    "auto_route",
] as const satisfies readonly NavigationStyle[]

// ── Misc flag profiles ──────────────────────────────────────────────

/** All optional features enabled. usesDio is on, usesHttp off (avoid conflict). */
const MISC_FULL: MiscConfig = {
    usesScreenutil: true,
    usesFlutterNativeSplash: true,
    usesDio: true,
    usesHttp: false,
    usesHive: true,
    usesSharedPreferences: true,
    usesSecureStorage: true,
    usesCachedNetworkImage: true,
    usesFlutterSvg: true,
    usesSkeletonizer: true,
    usesDotenv: true as const,
    usesLogger: true,
    usesFlutterHooks: false,
    usesImagePicker: true,
    usesFilePicker: true,
    usesUrlLauncher: true,
    usesPathProvider: true,
    usesSharePlus: true,
    usesPermissionHandler: true,
    usesDeviceInfoPlus: true,
    usesAppVersionUpdate: true,
    usesGeolocator: true,
}

/** All optional features disabled (bare minimum). */
const MISC_MINIMAL: MiscConfig = {
    usesScreenutil: false,
    usesFlutterNativeSplash: false,
    usesDio: false,
    usesHttp: false,
    usesHive: false,
    usesSharedPreferences: false,
    usesSecureStorage: false,
    usesCachedNetworkImage: false,
    usesFlutterSvg: false,
    usesSkeletonizer: false,
    usesDotenv: true as const,
    usesLogger: false,
    usesFlutterHooks: false,
    usesImagePicker: false,
    usesFilePicker: false,
    usesUrlLauncher: false,
    usesPathProvider: false,
    usesSharePlus: false,
    usesPermissionHandler: false,
    usesDeviceInfoPlus: false,
    usesAppVersionUpdate: false,
    usesGeolocator: false,
}

/** Matches the defaultConfig from schema.ts. */
const MISC_DEFAULT: MiscConfig = {
    usesScreenutil: true,
    usesFlutterNativeSplash: true,
    usesDio: false,
    usesHttp: false,
    usesHive: false,
    usesSharedPreferences: true,
    usesSecureStorage: true,
    usesCachedNetworkImage: true,
    usesFlutterSvg: true,
    usesSkeletonizer: true,
    usesDotenv: true as const,
    usesLogger: true,
    usesFlutterHooks: false,
    usesImagePicker: false,
    usesFilePicker: false,
    usesUrlLauncher: true,
    usesPathProvider: true,
    usesSharePlus: false,
    usesPermissionHandler: true,
    usesDeviceInfoPlus: true,
    usesAppVersionUpdate: true,
    usesGeolocator: false,
}

/** Flutter Hooks enabled — triggers hook pattern instead of service pattern. */
const MISC_HOOKS: MiscConfig = {
    usesScreenutil: true,
    usesFlutterNativeSplash: true,
    usesDio: true,
    usesHttp: false,
    usesHive: false,
    usesSharedPreferences: true,
    usesSecureStorage: true,
    usesCachedNetworkImage: true,
    usesFlutterSvg: true,
    usesSkeletonizer: true,
    usesDotenv: true as const,
    usesLogger: true,
    usesFlutterHooks: true,
    usesImagePicker: true,
    usesFilePicker: false,
    usesUrlLauncher: true,
    usesPathProvider: true,
    usesSharePlus: true,
    usesPermissionHandler: true,
    usesDeviceInfoPlus: true,
    usesAppVersionUpdate: true,
    usesGeolocator: false,
}

export type MiscProfileName = "full" | "minimal" | "default" | "hooks"

export const MISC_PROFILES: Record<MiscProfileName, MiscConfig> = {
    full: MISC_FULL,
    minimal: MISC_MINIMAL,
    default: MISC_DEFAULT,
    hooks: MISC_HOOKS,
} as const

export const MISC_PROFILE_NAMES = Object.keys(MISC_PROFILES) as readonly MiscProfileName[]

// ── Combination type ────────────────────────────────────────────────

export interface Combination {
    architecture: ArchitectureStyle
    stateManagement: StateManagement
    backend: BackendProvider
    navigation: NavigationStyle
    miscProfile: MiscProfileName
}

export function combinationLabel(c: Combination): string {
    return `${c.architecture}/${c.stateManagement}/${c.backend}/${c.navigation}/${c.miscProfile}`
}

// ── Invalid combination rules ───────────────────────────────────────

/**
 * Returns a reason string if the combination is invalid, or null if valid.
 *
 * Invalid rules:
 *   1. backend "custom" requires usesDio or usesHttp (schema .refine())
 */
export function invalidReason(c: Combination): string | null {
    const misc = MISC_PROFILES[c.miscProfile]

    // Rule 1: custom backend requires a networking client
    if (c.backend === "custom" && !misc.usesDio && !misc.usesHttp) {
        return "Custom backend requires usesDio or usesHttp to be enabled"
    }

    return null
}

export function isValidCombination(c: Combination): boolean {
    return invalidReason(c) === null
}

// ── Combination generator ───────────────────────────────────────────

/** Generate all mathematically possible combinations (unfiltered). */
function allCombinationsUnfiltered(): Combination[] {
    const result: Combination[] = []
    for (const architecture of ARCHITECTURES) {
        for (const stateManagement of STATE_MANAGERS) {
            for (const backend of BACKENDS) {
                for (const navigation of NAVIGATIONS) {
                    for (const miscProfile of MISC_PROFILE_NAMES) {
                        result.push({ architecture, stateManagement, backend, navigation, miscProfile })
                    }
                }
            }
        }
    }
    return result
}

/** All valid combinations after filtering out invalid ones. */
export const ALL_COMBINATIONS: Combination[] = allCombinationsUnfiltered().filter(isValidCombination)

/** Combinations that were excluded, with reasons. */
export const INVALID_COMBINATIONS: Array<{ combo: Combination; reason: string }> =
    allCombinationsUnfiltered()
        .filter((c) => !isValidCombination(c))
        .map((c) => ({ combo: c, reason: invalidReason(c)! }))

// ── ScaffoldConfig builder ──────────────────────────────────────────

/** Build a full ScaffoldConfig from a Combination. */
export function buildConfig(c: Combination): ScaffoldConfig {
    const misc = MISC_PROFILES[c.miscProfile]
    const backendConfig: BackendConfig = defaultBackendConfig(c.backend)

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
        stateManagement: c.stateManagement,
        backend: backendConfig,
        localization: { enabled: true, supportedLocales: ["en", "es"] },
        navigation: c.navigation,
        architecture: c.architecture,
        misc,
    }
}

// ── Stats ───────────────────────────────────────────────────────────

export const TOTAL_UNFILTERED =
    ARCHITECTURES.length *
    STATE_MANAGERS.length *
    BACKENDS.length *
    NAVIGATIONS.length *
    MISC_PROFILE_NAMES.length

export const TOTAL_VALID = ALL_COMBINATIONS.length
export const TOTAL_INVALID = INVALID_COMBINATIONS.length
