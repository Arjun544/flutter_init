import type { Post } from './types'

/**
 * Returns up to `maxResults` posts related to `current`.
 * Scoring: shared tag = 2pts, same category = 1pt, same kind = 0.5pt.
 */
export function getRelatedPosts(
  current: Post,
  allPosts: Post[],
  maxResults = 3
): Post[] {
  const others = allPosts.filter(
    (p) => p.slug.join('/') !== current.slug.join('/')
  )

  const scored = others.map((post) => {
    let score = 0

    // Shared tags
    for (const tag of current.tags) {
      if (post.tags.includes(tag)) score += 2
    }

    // Same category
    if (post.category === current.category) score += 1

    // Same kind
    if (post.kind === current.kind) score += 0.5

    return { post, score }
  })

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults)
    .map((s) => s.post)
}
