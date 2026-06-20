import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'
import type { Post, PostFrontmatter } from './types'

const CONTENT_ROOT = path.join(process.cwd(), 'content', 'blog')


/** Recursively find all .mdx files under a directory */
async function findMdxFiles(dir: string): Promise<string[]> {
  let results: string[] = []
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true })
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        results = results.concat(await findMdxFiles(fullPath))
      } else if (entry.name.endsWith('.mdx')) {
        results.push(fullPath)
      }
    }
  } catch {
    return []
  }
  return results
}

/** Compute estimated reading time in minutes (200 wpm) */
function computeReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).length
  return Math.max(1, Math.round(words / 200))
}

/** Derive slug array from file path relative to content/blog */
function deriveSlug(filePath: string): string[] {
  const relative = path.relative(CONTENT_ROOT, filePath)
  // Remove .mdx extension and split by path separator
  return relative.replace(/\.mdx$/, '').split(path.sep)
}

export async function getAllPosts(): Promise<Post[]> {
  const files = await findMdxFiles(CONTENT_ROOT)

  const posts = await Promise.all(
    files.map(async (filePath) => {
      const raw = await fs.readFile(filePath, 'utf-8')
      const { data, content } = matter(raw)
      const frontmatter = data as PostFrontmatter

      return {
        ...frontmatter,
        slug: deriveSlug(filePath),
        readingTime: computeReadingTime(content),
        content,
      } satisfies Post
    })
  )

  // Sort: featured first, then by publishedAt descending
  return posts.sort((a, b) => {
    if (a.featured && !b.featured) return -1
    if (!a.featured && b.featured) return 1
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  })
}
