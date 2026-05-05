import {
    ARCHITECTURES,
    BACKEND_OPTIONS,
    NAVIGATION_OPTIONS,
    STATE_OPTIONS,
} from "./matrix.config";

/**
 * Cartesian product generator for any number of dimensions.
 * Pure function with no side effects.
 */
export function generateCombinations<T extends Record<string, any[]>>(
    dimensions: T
): Array<{ [K in keyof T]: T[K][number] }> {
    const keys = Object.keys(dimensions) as Array<keyof T>
    if (keys.length === 0) return []

    // Check for empty dimensions
    for (const key of keys) {
        if (dimensions[key].length === 0) return []
    }

    const result: any[] = [{}];

    for (const key of keys) {
        const nextResult: any[] = [];
        for (const val of dimensions[key]) {
            for (const item of result) {
                nextResult.push({ ...item, [key]: val });
            }
        }
        result.length = 0;
        result.push(...nextResult);
    }

    return result
}

/**
 * Convenience function for primary combinations.
 */
export function generatePrimaryCombinations() {
    return generateCombinations({
        architecture: ARCHITECTURES,
        stateManagement: STATE_OPTIONS,
        backend: BACKEND_OPTIONS,
        navigation: NAVIGATION_OPTIONS,
    })
}

// Sanity check
const primaryCount = generatePrimaryCombinations().length
if (primaryCount !== 375) {
    throw new Error(`Sanity check failed: Expected 375 combinations, but got ${primaryCount}. (5x5x5x3)`)
}
