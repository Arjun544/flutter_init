import { StatsShowcase, StatsShowcaseSkeleton } from "@/app/components/landing/StatsShowcase"

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
    const res = await fetch(`${process.env.NEXT_PUBLIC_VERCEL_URL}/api/stats`, {
      next: {
        revalidate: 300,
        tags: ["generator-stats"],
      },
    })
    if (!res.ok) return null
    return (await res.json()) as StatsResponse
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

  const cards = [
    {
      eyebrow: "Volume",
      label: "Projects Generated",
      value: totalGenerated > 0 ? totalGenerated.toLocaleString() : "—",
      numericValue: totalGenerated > 0 ? totalGenerated : undefined,
    },
    {
      eyebrow: "State",
      label: "Popular State Management",
      value: toTitleCase(stats?.top_state_mgmt),
    },
    {
      eyebrow: "Pattern",
      label: "Architecture",
      value: toTitleCase(stats?.top_architecture),
    },
    {
      eyebrow: "Backend",
      label: "Backend",
      value: topBackendValue,
    },
    {
      eyebrow: "Supabase",
      label: "Supabase",
      value: toTitleCase(stats?.be_supabase?.toString()),
      numericValue: stats?.be_supabase,
    },
    {
      eyebrow: "Firebase",
      label: "Firebase",
      value: toTitleCase(stats?.be_firebase?.toString()),
      numericValue: stats?.be_firebase,
    },
    {
      eyebrow: "Navigation",
      label: "Popular Navigation",
      value: toTitleCase(stats?.top_navigation),
    },
    {
      eyebrow: "Theme",
      label: "Theme",
      value: darkModeRatio !== undefined ? `${darkModeRatio}%` : "—",
      numericValue: darkModeRatio,
      suffix: darkModeRatio !== undefined ? "%" : "",
    },
  ]

  return <StatsShowcase cards={cards} />
}

export function StatsSectionSkeleton() {
  return <StatsShowcaseSkeleton />
}
