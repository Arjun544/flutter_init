import { HeroSection } from "@/app/components/landing/HeroSection"
import { WhyFlutterInit } from "@/app/components/landing/WhyFlutterInit"
import { Footer } from "@/app/components/landing/Footer"
import { StatsSection, StatsSectionSkeleton } from "@/app/components/landing/StatsSection"
import { Suspense } from "react"

// Re-render this page (and re-fetch stats from Supabase) at most every 60 seconds.
// Without this, Next.js statically renders the page once at build time and the
// stats count would stay frozen forever regardless of new generations.
export const revalidate = 60

export default function Page() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-start bg-zinc-50 font-sans selection:bg-primary/20">
            <HeroSection />
            <Suspense fallback={<StatsSectionSkeleton />}>
                <StatsSection />
            </Suspense>
            <WhyFlutterInit />
            <Footer />
        </main>
    )
}