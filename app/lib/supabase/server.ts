import { createClient } from "@supabase/supabase-js"

function getEnv(name: string) {
    const value = process.env[name]
    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`)
    }
    return value
}

export function createServiceSupabaseClient() {
    const supabaseUrl =
        process.env.SUPABASE_URL ??
        process.env.NEXT_PUBLIC_SUPABASE_URL ??
        ""

    return createClient(
        supabaseUrl || getEnv("SUPABASE_URL"),
        getEnv("SUPABASE_SERVICE_ROLE_KEY"),
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
            },
        }
    )
}

export function createPublishableSupabaseClient() {
    const supabaseUrl =
        process.env.SUPABASE_URL ??
        process.env.NEXT_PUBLIC_SUPABASE_URL ??
        ""
    const publishableKey =
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    return createClient(
        supabaseUrl || getEnv("SUPABASE_URL"),
        publishableKey || getEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"),
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
            },
        }
    )
}
