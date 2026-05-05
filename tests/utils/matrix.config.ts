import type {
    ArchitectureStyle,
    BackendProvider,
    NavigationStyle,
    StateManagement,
} from "../../app/lib/config/schema"

/**
 * ARCHITECTURES: array of 5 architecture strings
 */
export const ARCHITECTURES: ArchitectureStyle[] = [
    "mvc",
    "mvvm",
    "clean",
    "feature-first",
    "layer-first",
]

/**
 * STATE_OPTIONS: array of 5 state management strings
 */
export const STATE_OPTIONS: StateManagement[] = [
    "provider",
    "riverpod",
    "bloc",
    "mobx",
    "none",
]

/**
 * BACKEND_OPTIONS: array of 5 backend strings
 */
export const BACKEND_OPTIONS: BackendProvider[] = [
    "none",
    "firebase",
    "supabase",
    "appwrite",
    "custom",
]

/**
 * NAVIGATION_OPTIONS: array of 3 navigation strings
 */
export const NAVIGATION_OPTIONS: NavigationStyle[] = [
    "imperative",
    "go_router",
    "auto_route",
]

export interface PrimaryCombo {
    architecture: ArchitectureStyle
    stateManagement: StateManagement
    backend: BackendProvider
    navigation: NavigationStyle
}

/**
 * Generates the full 375 combo array at module load time
 */
function generatePrimaryCombos(): PrimaryCombo[] {
    const combos: PrimaryCombo[] = []
    for (const architecture of ARCHITECTURES) {
        for (const stateManagement of STATE_OPTIONS) {
            for (const backend of BACKEND_OPTIONS) {
                for (const navigation of NAVIGATION_OPTIONS) {
                    combos.push({
                        architecture,
                        stateManagement,
                        backend,
                        navigation,
                    })
                }
            }
        }
    }
    return combos
}

export const PRIMARY_COMBINATIONS = generatePrimaryCombos()

/**
 * Returns a readable string like clean|riverpod|firebase|go_router
 */
export function COMBO_LABEL(combo: PrimaryCombo): string {
    return `${combo.architecture}|${combo.stateManagement}|${combo.backend}|${combo.navigation}`
}

// NOTE: The custom backend requires either usesDio or usesHttp to be true
// (enforced by the Zod refine). The matrix config does not handle misc flags,
// but the Layer 2 critical combos file must account for this.
