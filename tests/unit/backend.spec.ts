import { beforeAll, describe, it } from "vitest"
import {
    assertDependencyAbsent,
    assertDependencyPresent
} from "../utils/assertions"
import { buildConfig } from "../utils/config-builder"
import { generateToMap, getPubspecContent } from "../utils/generate"
import { PrimaryCombo } from "../utils/matrix.config"
import { MISC_ALL_ON, MISC_DEFAULT } from "../utils/misc-profiles"

const base: Omit<PrimaryCombo, "backend"> = {
    architecture: "feature-first",
    stateManagement: "riverpod",
    navigation: "go_router",
}

describe("Backend Providers", () => {
    // ── Firebase ────────────────────────────────────────────────
    describe("firebase", () => {
        let pubspec: string

        beforeAll(async () => {
            const files = await generateToMap(buildConfig({ ...base, backend: "firebase" }, MISC_DEFAULT))
            pubspec = getPubspecContent(files)
        })

        it("includes firebase_core", () => {
            assertDependencyPresent(pubspec, "firebase_core")
        })

        it("includes firebase_auth when authEmail enabled", () => {
            assertDependencyPresent(pubspec, "firebase_auth")
        })

        it("includes cloud_firestore when firestore enabled", () => {
            assertDependencyPresent(pubspec, "cloud_firestore")
        })

        it("does not include supabase or appwrite packages", () => {
            assertDependencyAbsent(pubspec, "supabase_flutter")
            assertDependencyAbsent(pubspec, "appwrite")
        })
    })

    // ── Supabase ────────────────────────────────────────────────
    describe("supabase", () => {
        let pubspec: string

        beforeAll(async () => {
            const files = await generateToMap(buildConfig({ ...base, backend: "supabase" }, MISC_DEFAULT))
            pubspec = getPubspecContent(files)
        })

        it("includes supabase_flutter", () => {
            assertDependencyPresent(pubspec, "supabase_flutter")
        })

        it("does not include firebase or appwrite packages", () => {
            assertDependencyAbsent(pubspec, "firebase_core")
            assertDependencyAbsent(pubspec, "appwrite")
        })
    })

    // ── Appwrite ────────────────────────────────────────────────
    describe("appwrite", () => {
        let pubspec: string

        beforeAll(async () => {
            const files = await generateToMap(buildConfig({ ...base, backend: "appwrite" }, MISC_DEFAULT))
            pubspec = getPubspecContent(files)
        })

        it("includes appwrite", () => {
            assertDependencyPresent(pubspec, "appwrite")
        })

        it("does not include firebase or supabase packages", () => {
            assertDependencyAbsent(pubspec, "firebase_core")
            assertDependencyAbsent(pubspec, "supabase_flutter")
        })
    })

    // ── Custom ──────────────────────────────────────────────────
    describe("custom", () => {
        let pubspec: string

        beforeAll(async () => {
            const files = await generateToMap(buildConfig({ ...base, backend: "custom" }, MISC_ALL_ON))
            pubspec = getPubspecContent(files)
        })

        it("requires dio or http — MISC_ALL_ON has dio", () => {
            assertDependencyPresent(pubspec, "dio")
        })

        it("does not include any backend SDK packages", () => {
            assertDependencyAbsent(pubspec, "firebase_core")
            assertDependencyAbsent(pubspec, "supabase_flutter")
            assertDependencyAbsent(pubspec, "appwrite")
        })
    })

    // ── None ────────────────────────────────────────────────────
    describe("none", () => {
        let pubspec: string

        beforeAll(async () => {
            const files = await generateToMap(buildConfig({ ...base, backend: "none" }, MISC_DEFAULT))
            pubspec = getPubspecContent(files)
        })

        it("has no backend SDK packages", () => {
            assertDependencyAbsent(pubspec, "firebase_core")
            assertDependencyAbsent(pubspec, "firebase_auth")
            assertDependencyAbsent(pubspec, "cloud_firestore")
            assertDependencyAbsent(pubspec, "supabase_flutter")
            assertDependencyAbsent(pubspec, "appwrite")
        })
    })
})
