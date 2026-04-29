import { NextResponse } from "next/server"

import { createPublishableSupabaseClient } from "@/app/lib/supabase/server"

export const runtime = "nodejs"
export const revalidate = 300

export async function GET() {
    try {
        const supabase = createPublishableSupabaseClient()
        const { data, error } = await supabase
            .from("stats_summary")
            .select("*")
            .single()

        if (error) {
            return NextResponse.json({ error: "unavailable" }, { status: 503 })
        }

        return NextResponse.json(data, {
            headers: {
                "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
            },
        })
    } catch {
        return NextResponse.json({ error: "unavailable" }, { status: 503 })
    }
}
