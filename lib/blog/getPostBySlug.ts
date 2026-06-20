import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'
import type { Post, PostFrontmatter } from './types'

const CONTENT_ROOT = path.join(process.cwd(), 'content', 'blog')

function computeReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).length
  return Math.max(1, Math.round(words / 200))
}

/**
 * Accepts slug segments from the catch-all route params and resolves
 * the corresponding MDX file. Returns null on miss (→ 404).
 *
 * Slug shapes:
 *  - ['updates', 'welcome-to-flutterinit']           → content/blog/updates/welcome-to-flutterinit.mdx
 *  - ['guides', 'state-management', 'riverpod-clean-firebase'] → content/blog/guides/state-management/riverpod-clean-firebase.mdx
 */
export async function getPostBySlug(slug: string[]): Promise<Post | null> {
  const filePath = path.join(CONTENT_ROOT, ...slug) + '.mdx'

  let raw: string
  try {
    raw = await fs.readFile(filePath, 'utf-8')
  } catch {
    return null
  }

  const { data, content } = matter(raw)
  const frontmatter = data as PostFrontmatter

  return {
    ...frontmatter,
    slug,
    readingTime: computeReadingTime(content),
    content,
  } satisfies Post
}
