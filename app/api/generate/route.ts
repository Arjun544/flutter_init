import { NextRequest } from "next/server"

import { scaffoldConfigSchema } from "@/app/lib/config/schema"
import { generateFlutterScaffold } from "@/app/lib/generator"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
    try {
        // Payload arrives as multipart/form-data so that binary font blobs can
        // be transmitted alongside the JSON config without serialization.
        const form = await request.formData()

        const configRaw = form.get("config")
        if (typeof configRaw !== "string") {
            return new Response(
                JSON.stringify({ error: "Missing config field in form data" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            )
        }

        const config = scaffoldConfigSchema.parse(JSON.parse(configRaw))

        // Collect font blobs — each File entry's name corresponds to the
        // fileName stored in config.theme.customFonts[].fileName.
        // We process them one at a time to limit peak memory usage.
        const fontEntries = form.getAll("font") as File[]

        const zipBuffer = await generateFlutterScaffold(config, fontEntries)
        const fileName = `${config.appName.replace(/\s+/g, "-").toLowerCase()}.zip`

        return new Response(zipBuffer as any, {
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
