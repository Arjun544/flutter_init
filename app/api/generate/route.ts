import { NextRequest } from "next/server"

import { scaffoldConfigSchema } from "@/app/lib/config/schema"
import { generateFlutterScaffold } from "@/app/lib/generator"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
    try {
        const payload = await request.json()
        const config = scaffoldConfigSchema.parse(payload)

        const zipBuffer = await generateFlutterScaffold(config)
        const fileName = `${config.appName.replace(/\s+/g, "-").toLowerCase()}.zip`

        return new Response(zipBuffer, {
            status: 200,
            headers: {
                "Content-Type": "application/zip",
                "Content-Disposition": `attachment; filename="${fileName}"`,
            },
        })
    } catch (error) {
        console.error("Failed to generate scaffold", error)
        const message =
            error instanceof Error ? error.message : "Failed to generate scaffold"
        return new Response(
            JSON.stringify({ error: message }),
            {
                status: 400,
                headers: { "Content-Type": "application/json" },
            }
        )
    }
}
