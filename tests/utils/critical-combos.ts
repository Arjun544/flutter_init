/**
 * critical-combos.ts
 *
 * Hand-selected ~30 combinations for Tier 2 CI (PR checks).
 * Selection criteria:
 *   - Every individual option value appears in at least 3 combinations
 *   - Covers the most commonly used combos (riverpod + go_router + feature-first)
 *   - Includes edge cases ("none" options, complex backend combos)
 *   - Includes all 4 misc profiles
 */

import type { Combination } from "./matrix.config"

/**
 * Critical combinations for Tier 2 testing.
 * Each combo is selected to maximize coverage per option value.
 */
export const CRITICAL_COMBINATIONS: Combination[] = [
    // ── Most popular combos ────────────────────────────────────────

    // 1. The "golden path" — most common user choice
    { architecture: "feature-first", stateManagement: "riverpod", backend: "firebase", navigation: "go_router", miscProfile: "default" },

    // 2. Second most popular setup
    { architecture: "clean", stateManagement: "bloc", backend: "supabase", navigation: "go_router", miscProfile: "default" },

    // 3. Provider + simple setup
    { architecture: "mvvm", stateManagement: "provider", backend: "none", navigation: "go_router", miscProfile: "default" },

    // ── Full misc profile ──────────────────────────────────────────

    // 4. Everything on
    { architecture: "feature-first", stateManagement: "riverpod", backend: "firebase", navigation: "go_router", miscProfile: "full" },

    // 5. Full + auto_route
    { architecture: "clean", stateManagement: "bloc", backend: "supabase", navigation: "auto_route", miscProfile: "full" },

    // 6. Full + imperative
    { architecture: "mvc", stateManagement: "provider", backend: "appwrite", navigation: "imperative", miscProfile: "full" },

    // ── Minimal misc profile ───────────────────────────────────────

    // 7. Bare minimum — no backend (custom+minimal is invalid)
    { architecture: "layer-first", stateManagement: "none", backend: "none", navigation: "imperative", miscProfile: "minimal" },

    // 8. Minimal with firebase
    { architecture: "mvvm", stateManagement: "riverpod", backend: "firebase", navigation: "auto_route", miscProfile: "minimal" },

    // 9. Minimal with supabase
    { architecture: "feature-first", stateManagement: "bloc", backend: "supabase", navigation: "go_router", miscProfile: "minimal" },

    // ── Hooks misc profile ─────────────────────────────────────────

    // 10. Hooks + riverpod
    { architecture: "clean", stateManagement: "riverpod", backend: "none", navigation: "go_router", miscProfile: "hooks" },

    // 11. Hooks + provider
    { architecture: "feature-first", stateManagement: "provider", backend: "firebase", navigation: "auto_route", miscProfile: "hooks" },

    // 12. Hooks + bloc
    { architecture: "mvvm", stateManagement: "bloc", backend: "appwrite", navigation: "imperative", miscProfile: "hooks" },

    // ── "None" state management ────────────────────────────────────

    // 13. None state + go_router
    { architecture: "feature-first", stateManagement: "none", backend: "none", navigation: "go_router", miscProfile: "default" },

    // 14. None state + auto_route
    { architecture: "clean", stateManagement: "none", backend: "supabase", navigation: "auto_route", miscProfile: "full" },

    // 15. None state + firebase
    { architecture: "mvc", stateManagement: "none", backend: "firebase", navigation: "imperative", miscProfile: "hooks" },

    // ── MobX coverage ──────────────────────────────────────────────

    // 16. MobX + clean
    { architecture: "clean", stateManagement: "mobx", backend: "none", navigation: "go_router", miscProfile: "default" },

    // 17. MobX + feature-first
    { architecture: "feature-first", stateManagement: "mobx", backend: "firebase", navigation: "auto_route", miscProfile: "full" },

    // 18. MobX + mvvm
    { architecture: "mvvm", stateManagement: "mobx", backend: "supabase", navigation: "imperative", miscProfile: "minimal" },

    // ── Appwrite backend ───────────────────────────────────────────

    // 19. Appwrite + riverpod
    { architecture: "layer-first", stateManagement: "riverpod", backend: "appwrite", navigation: "go_router", miscProfile: "default" },

    // 20. Appwrite + bloc
    { architecture: "feature-first", stateManagement: "bloc", backend: "appwrite", navigation: "auto_route", miscProfile: "minimal" },

    // ── Custom backend ─────────────────────────────────────────────

    // 21. Custom + full (full has usesDio: true)
    { architecture: "clean", stateManagement: "riverpod", backend: "custom", navigation: "go_router", miscProfile: "full" },

    // 22. Custom + hooks (hooks has usesDio: true)
    { architecture: "mvvm", stateManagement: "provider", backend: "custom", navigation: "auto_route", miscProfile: "hooks" },

    // 23. Custom + default (default has usesDio: false, usesHttp: false — but we need dio for custom)
    // NOTE: default profile doesn't have a networking client, so we use full instead
    { architecture: "layer-first", stateManagement: "bloc", backend: "custom", navigation: "imperative", miscProfile: "full" },

    // ── Architecture coverage ──────────────────────────────────────

    // 24. MVC + various
    { architecture: "mvc", stateManagement: "riverpod", backend: "supabase", navigation: "auto_route", miscProfile: "default" },

    // 25. MVC + bloc
    { architecture: "mvc", stateManagement: "bloc", backend: "none", navigation: "go_router", miscProfile: "hooks" },

    // 26. Layer-first + provider
    { architecture: "layer-first", stateManagement: "provider", backend: "firebase", navigation: "go_router", miscProfile: "default" },

    // 27. Layer-first + mobx
    { architecture: "layer-first", stateManagement: "mobx", backend: "appwrite", navigation: "auto_route", miscProfile: "hooks" },

    // ── Edge cases ─────────────────────────────────────────────────

    // 28. Localization off (handled internally by all combos — but let's confirm a clean build)
    // This uses the same combos above which all have localization: true;
    // A dedicated test will override localization.enabled = false

    // 29. MVVM + none state + imperative (absolute minimum)
    { architecture: "mvvm", stateManagement: "none", backend: "none", navigation: "imperative", miscProfile: "minimal" },

    // 30. Layer-first + none + auto_route
    { architecture: "layer-first", stateManagement: "none", backend: "appwrite", navigation: "auto_route", miscProfile: "default" },
]

/**
 * Verify coverage: count how many times each option value appears.
 * Returns a map of dimension → value → count.
 */
export function getCoverageReport(): Record<string, Record<string, number>> {
    const report: Record<string, Record<string, number>> = {
        architecture: {},
        stateManagement: {},
        backend: {},
        navigation: {},
        miscProfile: {},
    }

    for (const combo of CRITICAL_COMBINATIONS) {
        for (const dimension of Object.keys(report)) {
            const value = combo[dimension as keyof Combination]
            report[dimension][value] = (report[dimension][value] || 0) + 1
        }
    }

    return report
}
