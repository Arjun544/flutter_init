import { PostCard } from './PostCard'
import type { Post } from '@/lib/blog/types'

interface RelatedPostsProps {
  posts: Post[]
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (!posts || posts.length === 0) return null

  return (
    <section className="mt-16 pt-10 border-t border-zinc-200">
      <h2 className="mb-6 text-xl font-bold text-zinc-900">Related guides</h2>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.slug.join('/')} post={post} />
        ))}
      </div>
    </section>
  )
}
