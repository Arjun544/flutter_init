/**
 * backend.spec.ts
 *
 * Focused tests per backend provider.
 * Verifies correct backend-specific packages, initialization code,
 * and absence of other backend code.
 */

import { describe, it } from "vitest"

import {
    assertDependencyAbsent,
    assertDependencyPresent
} from "../utils/assertions"
import { generateToMap, getPubspecContent } from "../utils/generate"
import { buildConfig, type Combination } from "../utils/matrix.config"

const base: Omit<Combination, "backend"> = {
    architecture: "feature-first",
    stateManagement: "riverpod",
    navigation: "go_router",
    miscProfile: "default",
}

describe("Backend Providers", () => {
    // ── Firebase ────────────────────────────────────────────────

    describe("firebase", () => {
        it("includes firebase_core", async () => {
            const files = await generateToMap(buildConfig({ ...base, backend: "firebase" }))
            const pubspec = getPubspecContent(files)
            assertDependencyPresent(pubspec, "firebase_core")
        })

        it("includes firebase_auth when authEmail enabled", async () => {
            const files = await generateToMap(buildConfig({ ...base, backend: "firebase" }))
            const pubspec = getPubspecContent(files)
            // Default firebase config has authEmail: true
            assertDependencyPresent(pubspec, "firebase_auth")
        })

        it("includes cloud_firestore when firestore enabled", async () => {
            const files = await generateToMap(buildConfig({ ...base, backend: "firebase" }))
            const pubspec = getPubspecContent(files)
            assertDependencyPresent(pubspec, "cloud_firestore")
        })

        it("does not include supabase or appwrite packages", async () => {
            const files = await generateToMap(buildConfig({ ...base, backend: "firebase" }))
            const pubspec = getPubspecContent(files)
            assertDependencyAbsent(pubspec, "supabase_flutter")
            assertDependencyAbsent(pubspec, "appwrite")
        })
    })

    // ── Supabase ────────────────────────────────────────────────

    describe("supabase", () => {
        it("includes supabase_flutter", async () => {
            const files = await generateToMap(buildConfig({ ...base, backend: "supabase" }))
            const pubspec = getPubspecContent(files)
            assertDependencyPresent(pubspec, "supabase_flutter")
        })

        it("does not include firebase or appwrite packages", async () => {
            const files = await generateToMap(buildConfig({ ...base, backend: "supabase" }))
            const pubspec = getPubspecContent(files)
            assertDependencyAbsent(pubspec, "firebase_core")
            assertDependencyAbsent(pubspec, "appwrite")
        })
    })

    // ── Appwrite ────────────────────────────────────────────────

    describe("appwrite", () => {
        it("includes appwrite", async () => {
            const files = await generateToMap(buildConfig({ ...base, backend: "appwrite" }))
            const pubspec = getPubspecContent(files)
            assertDependencyPresent(pubspec, "appwrite")
        })

        it("does not include firebase or supabase packages", async () => {
            const files = await generateToMap(buildConfig({ ...base, backend: "appwrite" }))
            const pubspec = getPubspecContent(files)
            assertDependencyAbsent(pubspec, "firebase_core")
            assertDependencyAbsent(pubspec, "supabase_flutter")
        })
    })

    // ── Custom ──────────────────────────────────────────────────

    describe("custom", () => {
        it("requires dio or http — full profile has dio", async () => {
            const files = await generateToMap(
                buildConfig({
                    ...base,
                    backend: "custom",
                    miscProfile: "full", // full has usesDio: true
                })
            )
            const pubspec = getPubspecContent(files)
            assertDependencyPresent(pubspec, "dio")
        })

        it("does not include any backend SDK packages", async () => {
            const files = await generateToMap(
                buildConfig({
                    ...base,
                    backend: "custom",
                    miscProfile: "full",
                })
            )
            const pubspec = getPubspecContent(files)
            assertDependencyAbsent(pubspec, "firebase_core")
            assertDependencyAbsent(pubspec, "supabase_flutter")
            assertDependencyAbsent(pubspec, "appwrite")
        })
    })

    // ── None ────────────────────────────────────────────────────

    describe("none", () => {
        it("has no backend SDK packages", async () => {
            const files = await generateToMap(buildConfig({ ...base, backend: "none" }))
            const pubspec = getPubspecContent(files)
            assertDependencyAbsent(pubspec, "firebase_core")
            assertDependencyAbsent(pubspec, "firebase_auth")
            assertDependencyAbsent(pubspec, "cloud_firestore")
            assertDependencyAbsent(pubspec, "supabase_flutter")
            assertDependencyAbsent(pubspec, "appwrite")
        })
    })
})
