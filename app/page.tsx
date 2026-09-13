import { FeaturedGuides } from "@/app/components/landing/FeaturedGuides"
import { Footer } from "@/app/components/landing/Footer"
import { GitHubStars, GitHubStarsSkeleton } from "@/app/components/landing/GitHubStars"
import { HeroSection } from "@/app/components/landing/HeroSection"
import { Navbar } from "@/app/components/landing/Navbar"
import { StatsSection, StatsSectionSkeleton } from "@/app/components/landing/StatsSection"
import { WhyFlutterInit } from "@/app/components/landing/WhyFlutterInit"
import type { Metadata } from "next"
import { Suspense } from "react"

export const metadata: Metadata = {
  alternates: {
    canonical: "https://flutterinit.com",
  },
}

export default function Page() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-start bg-zinc-50 font-sans selection:bg-primary/20">
            <Navbar
                githubStars={
                    <Suspense fallback={<GitHubStarsSkeleton variant="sm" />}>
                        <GitHubStars variant="sm" />
                    </Suspense>
                }
            />
            <HeroSection />
            <Suspense fallback={<StatsSectionSkeleton />}>
                <StatsSection />
            </Suspense>
            <WhyFlutterInit />
            <Suspense fallback={null}>
                <FeaturedGuides />
            </Suspense>
            <Footer />
        </main>
    )
}