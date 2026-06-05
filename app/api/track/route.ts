import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"

import { architectureSchema, navigationSchema, stateManagementSchema } from "@/app/lib/config/schema"
import { createPublishableSupabaseClient } from "@/app/lib/supabase/server"

const validBackendProviders = ["none", "firebase", "supabase", "appwrite", "custom"] as const
const validNetworking = ["dio", "http", "none"] as const

type TrackPayload = {
    session_id: string
    architecture: string
    state_mgmt: string
    backend_provider: string
    navigation: string
    networking: string
    dark_mode: boolean
    features: string[]
}

function coerceString(value: unknown, maxLen = 64) {
    if (typeof value !== "string") return null
    const trimmed = value.trim()
    if (!trimmed) return null
    return trimmed.slice(0, maxLen)
}

function buildTrackPayload(input: unknown): TrackPayload | null {
    if (!input || typeof input !== "object") return null
    const body = input as Record<string, unknown>
    const sessionId = coerceString(body.session_id, 64)
    if (!sessionId) return null

    const architecture = architectureSchema.safeParse(body.architecture).success
        ? String(body.architecture)
        : "feature-first"
    const stateMgmt = stateManagementSchema.safeParse(body.state_mgmt).success
        ? String(body.state_mgmt)
        : "none"
    const navigation = navigationSchema.safeParse(body.navigation).success
        ? String(body.navigation)
        : "imperative"
    const backendProvider = validBackendProviders.includes(
        body.backend_provider as (typeof validBackendProviders)[number]
    )
        ? String(body.backend_provider)
        : "none"
    const networking = validNetworking.includes(
        body.networking as (typeof validNetworking)[number]
    )
        ? String(body.networking)
        : "none"
    const darkMode = typeof body.dark_mode === "boolean" ? body.dark_mode : false
    const features = Array.isArray(body.features)
        ? body.features
            .filter((feature) => typeof feature === "string")
            .map((feature) => feature.trim())
            .filter(Boolean)
        : []

    return {
        session_id: sessionId,
        architecture,
        state_mgmt: stateMgmt,
        backend_provider: backendProvider,
        navigation,
        networking,
        dark_mode: darkMode,
        features,
    }
}

export const runtime = "nodejs"

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const payload = buildTrackPayload(body)
        if (!payload) {
            return NextResponse.json({ error: "invalid_payload" }, { status: 400 })
        }

        const supabase = createPublishableSupabaseClient()
        const { error } = await supabase.from("generation_events").insert(payload)

        if (error) {
            return NextResponse.json({ error: "track_failed" }, { status: 503 })
        }

        // Bust the landing page ISR cache so the next visitor sees updated stats
        // immediately rather than waiting up to 60 seconds.
        revalidatePath("/")

        return NextResponse.json({ ok: true }, { status: 202 })
    } catch {
        return NextResponse.json({ error: "track_failed" }, { status: 503 })
    }
}
