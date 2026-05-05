import { MiscConfig } from "../../app/lib/config/schema"
import { PrimaryCombo } from "./matrix.config"
import { MISC_ALL_ON, MISC_BARE_MINIMUM, MISC_DEFAULT, MISC_HIGH_RISK } from "./misc-profiles"

interface CriticalCombo extends PrimaryCombo {
    miscProfile: MiscConfig
    label: string
}

/**
 * The 25 critical combinations for Layer 2 Dart validation.
 * Each represents a real developer archetype.
 */
export const CRITICAL_COMBOS: CriticalCombo[] = [
    // --- Architecture Coverage ---
    {
        architecture: "clean",
        stateManagement: "riverpod",
        backend: "firebase",
        navigation: "go_router",
        miscProfile: MISC_DEFAULT,
        label: "Enterprise app, most common combo",
    },
    {
        architecture: "mvvm",
        stateManagement: "bloc",
        backend: "supabase",
        navigation: "auto_route",
        miscProfile: MISC_DEFAULT,
        label: "Reactive architecture, Postgres backend",
    },
    {
        architecture: "feature-first",
        stateManagement: "riverpod",
        backend: "none",
        navigation: "go_router",
        miscProfile: MISC_BARE_MINIMUM,
        label: "Indie hacker, offline first",
    },
    {
        architecture: "mvc",
        stateManagement: "provider",
        backend: "none",
        navigation: "imperative",
        miscProfile: MISC_DEFAULT,
        label: "Beginner project, minimal setup",
    },
    {
        architecture: "layer-first",
        stateManagement: "mobx",
        backend: "appwrite",
        navigation: "go_router",
        miscProfile: MISC_DEFAULT,
        label: "Reactive observables, open backend",
    },

    // --- State Management Gaps ---
    {
        architecture: "clean",
        stateManagement: "bloc",
        backend: "firebase",
        navigation: "auto_route",
        miscProfile: MISC_DEFAULT,
        label: "BLoC with Firebase",
    },
    {
        architecture: "feature-first",
        stateManagement: "mobx",
        backend: "supabase",
        navigation: "imperative",
        miscProfile: MISC_DEFAULT,
        label: "MobX with Supabase",
    },
    {
        architecture: "mvvm",
        stateManagement: "provider",
        backend: "appwrite",
        navigation: "go_router",
        miscProfile: MISC_DEFAULT,
        label: "Provider with Appwrite",
    },
    {
        architecture: "layer-first",
        stateManagement: "none",
        backend: "none",
        navigation: "auto_route",
        miscProfile: MISC_DEFAULT,
        label: "setState only, no backend",
    },

    // --- Backend Gaps ---
    {
        architecture: "clean",
        stateManagement: "riverpod",
        backend: "custom",
        navigation: "go_router",
        miscProfile: MISC_DEFAULT, // MISC_DEFAULT has usesDio or usesHttp? No, let me double check.
        label: "Custom API (requires Dio/HTTP)",
    },
    {
        architecture: "feature-first",
        stateManagement: "bloc",
        backend: "appwrite",
        navigation: "imperative",
        miscProfile: MISC_DEFAULT,
        label: "Appwrite with BLoC",
    },

    // --- Navigation Gaps ---
    {
        architecture: "mvvm",
        stateManagement: "riverpod",
        backend: "none",
        navigation: "imperative",
        miscProfile: MISC_DEFAULT,
        label: "Imperative nav with Riverpod",
    },
    {
        architecture: "layer-first",
        stateManagement: "bloc",
        backend: "firebase",
        navigation: "auto_route",
        miscProfile: MISC_DEFAULT,
        label: "AutoRoute with Firebase",
    },

    // --- High Risk Interaction ---
    {
        architecture: "feature-first",
        stateManagement: "riverpod",
        backend: "firebase",
        navigation: "auto_route",
        miscProfile: MISC_ALL_ON,
        label: "Most feature-rich combo",
    },
    {
        architecture: "clean",
        stateManagement: "bloc",
        backend: "supabase",
        navigation: "go_router",
        miscProfile: MISC_HIGH_RISK,
        label: "Two popular choices together (High Risk)",
    },
    {
        architecture: "mvc",
        stateManagement: "mobx",
        backend: "firebase",
        navigation: "auto_route",
        miscProfile: MISC_DEFAULT,
        label: "MobX observables with Firebase",
    },
    {
        architecture: "layer-first",
        stateManagement: "riverpod",
        backend: "custom",
        navigation: "imperative",
        miscProfile: MISC_ALL_ON,
        label: "Custom backend, no router",
    },
    {
        architecture: "mvvm",
        stateManagement: "none",
        backend: "appwrite",
        navigation: "go_router",
        miscProfile: MISC_DEFAULT,
        label: "setState with backend",
    },
    {
        architecture: "feature-first",
        stateManagement: "provider",
        backend: "supabase",
        navigation: "auto_route",
        miscProfile: MISC_DEFAULT,
        label: "Provider with typed routes",
    },
    {
        architecture: "clean",
        stateManagement: "riverpod",
        backend: "none",
        navigation: "auto_route",
        miscProfile: MISC_DEFAULT,
        label: "No backend, type-safe routing",
    },
    {
        architecture: "mvc",
        stateManagement: "bloc",
        backend: "supabase",
        navigation: "imperative",
        miscProfile: MISC_DEFAULT,
        label: "Classic MVC with BLoC",
    },
    {
        architecture: "layer-first",
        stateManagement: "provider",
        backend: "firebase",
        navigation: "go_router",
        miscProfile: MISC_DEFAULT,
        label: "Simple state, complex backend",
    },
    {
        architecture: "mvvm",
        stateManagement: "riverpod",
        backend: "appwrite",
        navigation: "imperative",
        miscProfile: MISC_DEFAULT,
        label: "Riverpod with Appwrite",
    },
    {
        architecture: "feature-first",
        stateManagement: "bloc",
        backend: "none",
        navigation: "imperative",
        miscProfile: MISC_DEFAULT,
        label: "Offline BLoC app",
    },
    {
        architecture: "clean",
        stateManagement: "riverpod",
        backend: "supabase",
        navigation: "go_router",
        miscProfile: MISC_DEFAULT,
        label: "Standard Clean + Riverpod + Supabase",
    }
]
