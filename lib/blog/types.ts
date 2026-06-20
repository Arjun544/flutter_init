export type Kind = 'update' | 'guide'

export interface StackConfig {
  architecture: 'clean' | 'mvvm' | 'feature-first'
  stateManagement: 'riverpod' | 'bloc' | 'provider' | 'getx' | 'signals'
  backend: 'firebase' | 'supabase' | 'appwrite' | 'none'
  navigation: 'go_router' | 'auto_route' | 'none'
}

export interface PostFrontmatter {
  title: string
  description: string
  kind: Kind
  category: string
  tags: string[]
  publishedAt: string
  updatedAt?: string
  author: string           // slug — maps to AUTHORS constant in getAllPosts.ts
  coverImage?: string
  featured?: boolean
  // Guide-only
  stackConfig?: StackConfig
  whenToChoose?: string
}

export interface Post extends PostFrontmatter {
  slug: string[]           // path segments — e.g. ['riverpod-clean-firebase'] or ['guides', 'state-management', 'riverpod-clean-firebase']
  readingTime: number      // minutes, computed from content length
  content: string          // raw MDX string — passed to next-mdx-remote
}

export interface Author {
  name: string
  avatar: string
  twitter?: string
  github?: string
}
