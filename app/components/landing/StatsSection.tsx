import { StatsShowcase, StatsShowcaseSkeleton, type StatCard } from "@/app/components/landing/StatsShowcase"
import { createPublishableSupabaseClient } from "@/app/lib/supabase/server"

type StatsResponse = {
  total_generated?: number
  unique_sessions?: number
  top_state_mgmt?: string
  top_architecture?: string
  top_navigation?: string
  be_firebase?: number
  be_supabase?: number
  be_appwrite?: number
  be_custom?: number
  be_none?: number
  dark_mode_enabled?: number
}

async function getStats(): Promise<StatsResponse | null> {
  try {
    const supabase = createPublishableSupabaseClient()
    const { data, error } = await supabase
      .from("stats_summary")
      .select("*")
      .single()
    if (error) return null
    return data as StatsResponse
  } catch {
    return null
  }
}

function toTitleCase(value?: string) {
  if (!value) return "—"
  return value
    .replaceAll("_", " ")
    .replaceAll("-", " ")
    .split(" ")
    .filter(Boolean)
    .map((word) => `${word[0].toUpperCase()}${word.slice(1)}`)
    .join(" ")
}

export async function StatsSection() {
  const stats = await getStats()
  const totalGenerated = stats?.total_generated ?? 0
  const darkModeRatio =
    totalGenerated > 0 && stats?.dark_mode_enabled !== undefined
      ? Math.round((stats.dark_mode_enabled / totalGenerated) * 100)
      : undefined
  const backendCounts = [
    { key: "firebase", count: stats?.be_firebase ?? 0 },
    { key: "supabase", count: stats?.be_supabase ?? 0 },
    { key: "appwrite", count: stats?.be_appwrite ?? 0 },
    { key: "custom", count: stats?.be_custom ?? 0 },
    { key: "none", count: stats?.be_none ?? 0 },
  ]
  const topBackend = backendCounts.sort((a, b) => b.count - a.count)[0]
  const topBackendValue =
    totalGenerated > 0 && topBackend.count > 0 ? toTitleCase(topBackend.key) : "—"

  const cards: StatCard[] = [
    {
      title: "Projects",
      eyebrow: "Numbers of projects generated",
      value: totalGenerated > 0 ? totalGenerated.toLocaleString() : "—",
      numericValue: totalGenerated > 0 ? totalGenerated : undefined,
    },
    {
      title: "State Management",
      eyebrow: "Most Popular State Management",
      value: stats?.top_state_mgmt ? toTitleCase(stats.top_state_mgmt) : "—",
    },
    {
      title: "Architecture",
      eyebrow: "Pattern",
      value: stats?.top_architecture ? toTitleCase(stats.top_architecture) : "—",
    },
    {
      title: "Firebase",
      eyebrow: "Usage of Firebase",
      value: stats?.be_firebase !== undefined ? `${stats.be_firebase}%` : "—",
      numericValue: stats?.be_firebase,
    },
    {
      title: "Supabase",
      eyebrow: "Usage of Supabase",
      value: stats?.be_supabase !== undefined ? `${stats.be_supabase}%` : "—",
      numericValue: stats?.be_supabase,
    },
    {
      title: topBackendValue,
      eyebrow: "Most Used Backend",
      value: topBackendValue,
    },
    {
      title: "Navigation",
      eyebrow: "Popular Navigation",
      value: stats?.top_navigation ? toTitleCase(stats.top_navigation) : "—",
    },
    {
      title: "Theme",
      eyebrow: "Usage of dark theme",
      value: darkModeRatio !== undefined ? `${darkModeRatio}%` : "—",
      numericValue: darkModeRatio,
    },
  ]

  return <StatsShowcase cards={cards} />
}

export function StatsSectionSkeleton() {
  return <StatsShowcaseSkeleton />
}
