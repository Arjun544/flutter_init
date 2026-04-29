import { HeroSection } from "@/app/components/landing/HeroSection"
import { WhyFlutterInit } from "@/app/components/landing/WhyFlutterInit"
import { Footer } from "@/app/components/landing/Footer"
import { StatsSection, StatsSectionSkeleton } from "@/app/components/landing/StatsSection"
import { Suspense } from "react"

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