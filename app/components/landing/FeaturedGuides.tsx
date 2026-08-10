import Link from "next/link"
import { getAllPosts } from "@/lib/blog/getAllPosts"
import type { Post } from "@/lib/blog/types"
import { FeaturedPost } from "@/app/blogs/components/FeaturedPost"
import { PostCard } from "@/app/blogs/components/PostCard"
import { Badge } from "@/components/ui/badge"
import { Blur } from "@/components/animate-ui/primitives/effects/blur"
import { KineticText } from "@/components/ui/kinetic-text"
import { ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

const SIDE_SLUGS = [
  "guides/ai-context/why-claude-and-agents-md",
  "guides/ai-context/cursor-with-structured-ai-context",
] as const

function bySlug(posts: Post[], slugPath: string): Post | undefined {
  return posts.find((post) => post.slug.join("/") === slugPath)
}

export async function FeaturedGuides() {
  const allPosts = await getAllPosts()

  // Same rule as /blogs: latest post marked featured: true
  const featured = allPosts
    .filter((post) => post.featured)
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    )[0]

  const featuredKey = featured?.slug.join("/")

  const sidePosts = SIDE_SLUGS.map((slug) => bySlug(allPosts, slug))
    .filter((post): post is Post => Boolean(post))
    .filter((post) => post.slug.join("/") !== featuredKey)
    .slice(0, 2)

  if (!featured && sidePosts.length === 0) {
    return null
  }

  return (
    <section id="blogs" className="relative w-full overflow-hidden bg-zinc-50/50 py-24">
      <div className="pointer-events-none absolute top-0 left-1/2 h-full w-full -translate-x-1/2 bg-[radial-gradient(circle_at_50%_0%,var(--color-primary)_0.03,transparent_50%)] opacity-5" />

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-12 px-6 md:px-12">
        <div className="flex flex-col items-center gap-4 text-center">
          <Badge
            variant="outline"
            className="rounded-full border-primary/10 bg-primary/5 px-3 py-3 text-[11px] font-bold uppercase tracking-wider text-primary"
          >
            <span
              aria-hidden="true"
              className="mr-2 inline-flex size-1.5 animate-pulse rounded-full bg-primary"
            />
            From the Blog
          </Badge>
          <Blur inView={true}>
            <h2 className="text-4xl leading-[1.1] font-bold tracking-tight text-zinc-400 md:text-5xl lg:text-6xl">
              Guides from{" "}
              <KineticText
                as="span"
                text="FlutterInit"
                className="pointer-events-auto font-extrabold tracking-wider text-primary"
              />
            </h2>
          </Blur>
          <p className="max-w-2xl text-lg font-medium leading-relaxed text-zinc-500">
            Featured updates, AI context deep-dives and tips.
          </p>
        </div>

        {/*
          lg: featured spans 2 rows; each side card is one row.
          Featured height = card1 + gap + card2.
        */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-5 lg:grid-rows-2">
          {featured && (
            <div className="min-h-0 h-full lg:col-span-3 lg:row-span-2">
              <FeaturedPost post={featured} fillHeight hideMeta />
            </div>
          )}
          {sidePosts.map((post) => (
            <div key={post.slug.join("/")} className="min-h-0 lg:col-span-2">
              <PostCard post={post} fillHeight hideMeta />
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <Link
            href="/blogs"
            className="group inline-flex h-12 items-center gap-2 rounded-2xl border border-zinc-200 bg-white px-5 text-sm font-semibold text-zinc-700 shadow-xs transition-all duration-300 hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-900"
          >
            Browse all posts
            <HugeiconsIcon
              icon={ArrowRight01Icon}
              size={16}
              className="text-zinc-400 transition-transform group-hover:translate-x-0.5 group-hover:text-zinc-700"
            />
          </Link>
        </div>
      </div>
    </section>
  )
}
