# Blog Implementation Guide

> A complete reference for the FlutterInit blog system — file-based MDX content, Next.js App Router pages, and all supporting components.

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Content Layer](#content-layer)
  - [Directory Structure](#directory-structure)
  - [Frontmatter Schema](#frontmatter-schema)
  - [Writing a Post](#writing-a-post)
  - [Writing a Guide](#writing-a-guide)
- [Data Layer (`lib/blog`)](#data-layer-libblog)
  - [Types](#types)
  - [Authors](#authors)
  - [getAllPosts](#getallposts)
  - [getPostBySlug](#getpostbyslug)
  - [getRelatedPosts](#getrelatedposts)
- [App Layer (`app/blogs`)](#app-layer-appblog)
  - [Layout](#layout)
  - [Blog Index Page](#blog-index-page)
  - [Post Detail Page](#post-detail-page)
  - [ToC Extraction](#toc-extraction)
- [Blog Components](#blog-components)
  - [FeaturedPost](#featuredpost)
  - [PostCard](#postcard)
  - [AuthorByline](#authorbyline)
  - [TagPill](#tagpill)
  - [GuideConfigBlock](#guideconfigblock)
  - [TableOfContents](#tableofcontents)
  - [RelatedPosts](#relatedposts)
  - [MDXComponents](#mdxcomponents)
- [MDX Authoring Reference](#mdx-authoring-reference)
  - [Code Blocks](#code-blocks)
  - [Callouts](#callouts)
  - [File Trees](#file-trees)
  - [Images](#images)
  - [Tables](#tables)
- [Adding a New Author](#adding-a-new-author)
- [Adding New Stack Options](#adding-new-stack-options)
- [Pagination](#pagination)
- [SEO & Open Graph](#seo--open-graph)
- [Revalidation Strategy](#revalidation-strategy)

---

## Overview

The blog is a **file-based MDX** system built on Next.js App Router. There is no CMS or database — every post is a `.mdx` file under `content/blog/`. The file path directly determines the URL slug.

Two post kinds exist:

| Kind | Purpose | Extra Fields |
|------|---------|-------------|
| `update` | Announcements, changelogs, release notes | — |
| `guide` | Deep-dive technical guides for each stack combination | `stackConfig`, `whenToChoose` |

---

## Architecture

```
content/blog/            ← raw MDX files (source of truth)
lib/blog/                ← server-side data utilities
  types.ts               ← Post, StackConfig, Author interfaces
  authors.ts             ← author registry
  getAllPosts.ts          ← reads + parses all MDX files
  getPostBySlug.ts       ← fetches a single post by slug
  getRelatedPosts.ts     ← finds posts with shared tags/category
app/blogs/
  layout.tsx             ← shared metadata template
  page.tsx               ← blog index (paginated list + featured)
  [...slug]/page.tsx     ← individual post page
  components/            ← all blog-specific React components
```

---

## Content Layer

### Directory Structure

Posts live under `content/blog/`. The **sub-path relative to that root** becomes the URL slug:

```
content/blog/
├── updates/
│   └── welcome-to-flutterinit.mdx     → /blogs/updates/welcome-to-flutterinit
└── guides/
    └── state-management/
        └── riverpod-clean-firebase.mdx → /blogs/guides/state-management/riverpod-clean-firebase
```

You can nest as deep as you like — all `.mdx` files are discovered recursively.

### Frontmatter Schema

Every `.mdx` file must start with a YAML frontmatter block. All fields are defined in [`lib/blog/types.ts`](../lib/blog/types.ts).

#### Common fields (all posts)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | `string` | ✅ | Post title (used in `<h1>` and `<title>`) |
| `description` | `string` | ✅ | Short summary (used in meta description and cards) |
| `kind` | `"update" \| "guide"` | ✅ | Controls which UI chrome is shown |
| `category` | `string` | ✅ | Used in `TagPill` and related-post matching |
| `tags` | `string[]` | ✅ | Used in related-post matching |
| `publishedAt` | `string` (ISO date) | ✅ | e.g. `"2026-06-20"` |
| `author` | `string` | ✅ | Key into `AUTHORS` map in `authors.ts` |
| `updatedAt` | `string` (ISO date) | ❌ | Shown in byline if present |
| `coverImage` | `string` | ❌ | Absolute URL or `/public`-relative path |
| `featured` | `boolean` | ❌ | First featured post is shown in the hero slot |

#### Guide-only fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `stackConfig` | `StackConfig` | ❌ | Renders the `GuideConfigBlock` banner |
| `whenToChoose` | `string` | ❌ | Renders a green "when to choose" callout |

#### `StackConfig` shape

```yaml
stackConfig:
  architecture: clean       # clean | mvvm | feature-first
  stateManagement: riverpod # riverpod | bloc | provider | getx | signals
  backend: firebase         # firebase | supabase | appwrite | none
  navigation: go_router     # go_router | auto_route | none
```

### Writing a Post

Create `content/blog/updates/my-post.mdx`:

```mdx
---
title: "My Post Title"
description: "A short summary of what this post is about."
kind: update
category: announcements
tags: [flutter, news]
publishedAt: "2026-07-01"
author: arjun
featured: false
---

Your MDX content starts here.

## First Section

Regular markdown with **bold**, _italic_, and `inline code`.
```

### Writing a Guide

Create `content/blog/guides/state-management/bloc-clean-supabase.mdx`:

```mdx
---
title: "Bloc + Clean Architecture + Supabase"
description: "A step-by-step guide to building a production Flutter app with Bloc, Clean Architecture, and Supabase as your backend."
kind: guide
category: state-management
tags: [bloc, clean-architecture, supabase, flutter]
publishedAt: "2026-07-15"
author: arjun
stackConfig:
  architecture: clean
  stateManagement: bloc
  backend: supabase
  navigation: go_router
whenToChoose: "Choose this stack when you need strong separation of concerns, predictable state via events/states, and a scalable Postgres-backed backend with real-time support."
---

## Introduction

Your guide content here...
```

The `stackConfig` and `whenToChoose` fields render the coloured banner and emerald "when to choose" card automatically at the top of the article — no extra MDX needed.

---

## Data Layer (`lib/blog`)

### Types

[`lib/blog/types.ts`](../lib/blog/types.ts) — all shared TypeScript interfaces.

**Key types:**

```ts
type Kind = 'update' | 'guide'

interface StackConfig {
  architecture: 'clean' | 'mvvm' | 'feature-first'
  stateManagement: 'riverpod' | 'bloc' | 'provider' | 'getx' | 'signals'
  backend: 'firebase' | 'supabase' | 'appwrite' | 'none'
  navigation: 'go_router' | 'auto_route' | 'none'
}

interface Post extends PostFrontmatter {
  slug: string[]        // path segments derived from file path
  readingTime: number   // computed from word count (200 wpm)
  content: string       // raw MDX string
}
```

### Authors

[`lib/blog/authors.ts`](../lib/blog/authors.ts) — a plain object registry keyed by author slug.

```ts
export const AUTHORS: Record<string, Author> = {
  arjun: {
    name: 'Arjun Mahar',
    avatar: 'https://avatars.githubusercontent.com/u/38013590?v=4',
    twitter: '@arjun_mahar1',
    github: 'arjun544',
  },
}
```

The `author` field in frontmatter must match a key here. If no match is found, `AuthorByline` falls back to the raw string with a default GitHub avatar.

### getAllPosts

[`lib/blog/getAllPosts.ts`](../lib/blog/getAllPosts.ts) — recursively scans `content/blog/**/*.mdx`, parses frontmatter with `gray-matter`, computes reading time, and returns all posts sorted by:

1. `featured: true` posts first
2. `publishedAt` descending (newest first)

**Usage:**
```ts
import { getAllPosts } from '@/lib/blog/getAllPosts'
const posts = await getAllPosts()
```

### getPostBySlug

[`lib/blog/getPostBySlug.ts`](../lib/blog/getPostBySlug.ts) — resolves a slug array (from the `[...slug]` catch-all route) to the corresponding `.mdx` file.

**Slug mapping examples:**
```
['updates', 'welcome-to-flutterinit']
  → content/blog/updates/welcome-to-flutterinit.mdx

['guides', 'state-management', 'riverpod-clean-firebase']
  → content/blog/guides/state-management/riverpod-clean-firebase.mdx
```

Returns `null` on a miss (page calls `notFound()`).

**Usage:**
```ts
import { getPostBySlug } from '@/lib/blog/getPostBySlug'
const post = await getPostBySlug(['guides', 'state-management', 'riverpod-clean-firebase'])
```

### getRelatedPosts

[`lib/blog/getRelatedPosts.ts`](../lib/blog/getRelatedPosts.ts) — scores all other posts by tag overlap and category match, returns the top 3. Used by the post detail page to populate the "Related Posts" section at the bottom.

---

## App Layer (`app/blogs`)

### Layout

[`app/blogs/layout.tsx`](../app/blogs/layout.tsx) — sets a metadata title template so every page gets a `"Post Title | FlutterInit Blog"` title automatically.

### Blog Index Page

[`app/blogs/page.tsx`](../app/blogs/page.tsx)

- Accepts a `?page=N` query param for pagination
- Shows the first (featured) post in a `<FeaturedPost>` hero
- Shows remaining posts in a 3-column `<PostCard>` grid (24 per page)
- Renders a simple Previous / Next paginator if more than one page
- `export const revalidate = 3600` — ISR, re-fetches content every hour

### Post Detail Page

[`app/blogs/[...slug]/page.tsx`](../app/blogs/[...slug]/page.tsx)

Key responsibilities:

| Responsibility | Implementation |
|---|---|
| Static params | `generateStaticParams` enumerates all posts at build time |
| SEO metadata | `generateMetadata` fills `<title>`, `description`, OG image via `/api/og` |
| MDX rendering | `<MDXRemote>` with `remarkGfm` + `rehypeSlug` plugins |
| Table of Contents | `extractTocItems()` parses `##` and `###` headings from raw content |
| Guide extras | Renders `<GuideConfigBlock>` and "when to choose" callout when `post.kind === 'guide'` |
| Related posts | `getRelatedPosts()` + `<RelatedPosts>` at page bottom |
| Breadcrumb | Shadcn `<Breadcrumb>` component: Home → Blog → Post Title |

### ToC Extraction

The `extractTocItems(content: string)` function in the post page extracts `##` and `###` headings from the raw MDX source and converts them to anchor IDs using the same algorithm as `rehype-slug` (lowercase → strip punctuation → spaces to hyphens, underscores preserved). This ensures the IDs in the sidebar match the IDs added to the DOM by `rehypeSlug`.

---

## Blog Components

All components live in [`app/blogs/components/`](../app/blogs/components/).

### FeaturedPost

**File:** [`FeaturedPost.tsx`](../app/blogs/components/FeaturedPost.tsx)  
**Props:** `{ post: Post }`

Renders a large two-column card (image left, content right on `lg:` screens). If no `coverImage` is provided, shows a gradient placeholder with a Hugeicons icon (`BookOpen02Icon` for guides, `Megaphone01Icon` for updates). Displays a "Featured" badge if `post.featured` is true.

### PostCard

**File:** [`PostCard.tsx`](../app/blogs/components/PostCard.tsx)  
**Props:** `{ post: Post }`  
**Client Component** (`'use client'`)

Compact card used in the grid. Shows cover image (or icon placeholder), `TagPill`, title, description excerpt, author avatar, date, and reading time. Uses `motion.article` from `motion/react` for subtle hover transitions.

### AuthorByline

**File:** [`AuthorByline.tsx`](../app/blogs/components/AuthorByline.tsx)  
**Props:** `{ post: Pick<Post, 'author' | 'publishedAt' | 'readingTime' | 'updatedAt'> }`

Displays the author avatar, name, Twitter handle (linked), publish date, reading time, and optional "Updated" date. Looks up the author in the `AUTHORS` registry — falls back gracefully if the key is missing.

### TagPill

**File:** [`TagPill.tsx`](../app/blogs/components/TagPill.tsx)  
**Props:** `{ kind: Kind; category: string; tags?: string[]; className?: string }`

Small coloured badge. `kind` determines the colour:
- `guide` → violet
- `update` → amber

### GuideConfigBlock

**File:** [`GuideConfigBlock.tsx`](../app/blogs/components/GuideConfigBlock.tsx)  
**Props:** `{ stackConfig: StackConfig }`

Renders a 4-column grid banner showing the stack configuration for a guide (Architecture, State Management, Backend, Navigation). Each cell uses a Hugeicons icon and a coloured badge. Only shown when `post.kind === 'guide' && post.stackConfig`.

**Icon mapping:**
| Field | Icon |
|-------|------|
| Architecture | `Layers01Icon` (blue) |
| State Management | `FlashIcon` (violet) |
| Backend | `Database01Icon` (orange) |
| Navigation | `GitForkIcon` (emerald) |

To add a new stack option (e.g. a new backend), update both `StackConfig` in `types.ts` and the corresponding `BACKEND_LABELS` map in `GuideConfigBlock.tsx`.

### TableOfContents

**File:** [`TableOfContents.tsx`](../app/blogs/components/TableOfContents.tsx)  
**Props:** `{ items: TocItem[] }`  
**Client Component** (`'use client'`)

Sticky sidebar navigation that highlights the currently-visible heading. Uses `IntersectionObserver` with a 10% threshold — the active item is the topmost visible heading, falling back to the last heading that has scrolled above the viewport. Supports:

- Animated active bar (slides between items via `layoutId="toc-active-bar"`)
- Ancestor highlight (parent `##` dimly highlighted when a `###` child is active)
- Smooth scroll on click + URL hash update
- Hash restoration on back/forward navigation

`TocItem` shape:
```ts
interface TocItem {
  id: string    // heading anchor (matches rehype-slug output)
  text: string  // raw heading text
  depth: number // 2 for ##, 3 for ###
}
```

The sidebar is hidden below `xl` breakpoint.

### RelatedPosts

**File:** [`RelatedPosts.tsx`](../app/blogs/components/RelatedPosts.tsx)  
**Props:** `{ posts: Post[] }`

Renders up to 3 related post cards (uses `PostCard`) in a horizontal row below the article.

### MDXComponents

**File:** [`MDXComponents.tsx`](../app/blogs/components/MDXComponents.tsx)

The component map passed to `<MDXRemote components={mdxComponents}>`. Overrides the following HTML elements:

| Element | Behaviour |
|---------|-----------|
| `pre` | Server-rendered code block with Shiki syntax highlighting (GitHub Light theme). Extracts language from className, optionally extracts a filename from the first line comment. |
| `code` | Inline: styled pill. Fenced: passthrough to `pre`. |
| `blockquote` | Callout if first line matches `[!NOTE]`, `[!TIP]`, `[!WARNING]`, `[!CAUTION]`, `[!IMPORTANT]` — otherwise standard blockquote. |
| `h2` | Bold with bottom border + anchor link icon on hover. Includes `scroll-mt-24` for sticky nav offset. |
| `h3` | Semi-bold + anchor link on hover. |
| `h4` | Smaller semi-bold. |
| `p` | Relaxed zinc-600 body text. |
| `ul` | Custom dash bullets (`–`). |
| `ol` | Decimal list. |
| `img` | Wrapped in `next/image` with rounded border. |
| `hr` | Thin zinc-200 divider. |
| `a` | Primary-coloured underline, opens external links in new tab. |
| `table / thead / th / td` | Rounded border table with sticky header. |

Additionally, the following components from Animate UI and Radix are registered and usable directly in MDX:

| MDX Tag | Component |
|---------|-----------|
| `<Code>` | `animate-ui/components/animate/code` Code wrapper |
| `<CodeHeader>` | Code block header with copy button |
| `<CodeBlock>` | Highlighted code body |
| `<Files>` | Animated file tree root |
| `<FolderItem>` | Collapsible folder node |
| `<FolderTrigger>` | Folder label/chevron |
| `<FolderContent>` | Folder children container |
| `<FileItem>` | Leaf file node |
| `<SubFiles>` | Nested file list wrapper |

---

## MDX Authoring Reference

### Code Blocks

**Basic fenced block** (language auto-detected):
````md
```dart
void main() => runApp(const MyApp());
```
````

**With filename** (first line comment is extracted as the header title):
````md
```dart
// lib/main.dart
void main() => runApp(const MyApp());
```
````

**Supported languages** (anything Shiki supports): `dart`, `yaml`, `json`, `typescript`, `bash`, `sh`, `text`, etc.

### Callouts

Use GitHub-flavoured blockquote callouts:

```md
> [!NOTE]
> This is a note with blue styling.

> [!TIP]
> Performance tip with green styling.

> [!WARNING]
> Warning with amber styling.

> [!CAUTION]
> Critical caution with red styling.

> [!IMPORTANT]
> Important info with violet styling.
```

### File Trees

Use the registered Animate UI `Files` components directly in MDX:

```mdx
<Files defaultOpen={["lib", "core"]}>
  <FolderItem value="lib">
    <FolderTrigger>lib</FolderTrigger>
    <FolderContent>
      <SubFiles>
        <FolderItem value="core">
          <FolderTrigger>core</FolderTrigger>
          <FolderContent>
            <SubFiles>
              <FileItem>di.dart</FileItem>
            </SubFiles>
          </FolderContent>
        </FolderItem>
        <FileItem>main.dart</FileItem>
      </SubFiles>
    </FolderContent>
  </FolderItem>
</Files>
```

`defaultOpen` takes an array of `value` props for folders that should be expanded by default.

### Images

Standard markdown syntax — wrapped automatically in `next/image`:

```md
![Alt text](/images/my-diagram.png)
```

Place images under `public/images/` or use an external URL.

### Tables

Standard GFM tables (enabled via `remark-gfm`):

```md
| Column A | Column B | Column C |
|----------|----------|----------|
| value    | value    | value    |
```

---

## Adding a New Author

1. Add an entry to [`lib/blog/authors.ts`](../lib/blog/authors.ts):

```ts
export const AUTHORS: Record<string, Author> = {
  arjun: { ... },
  jane: {
    name: 'Jane Smith',
    avatar: 'https://avatars.githubusercontent.com/u/9999999?v=4',
    twitter: '@janesmith',
    github: 'janesmith',
  },
}
```

2. Use the key in frontmatter: `author: jane`

---

## Adding New Stack Options

To add a new `stateManagement` value (e.g. `mobx`):

1. **`lib/blog/types.ts`** — extend the union:
```ts
stateManagement: 'riverpod' | 'bloc' | 'provider' | 'getx' | 'signals' | 'mobx'
```

2. **`app/blogs/components/GuideConfigBlock.tsx`** — add the display label:
```ts
const STATE_LABELS: Record<StackConfig['stateManagement'], string> = {
  ...
  mobx: 'MobX',
}
```

3. Create your guide MDX file with `stateManagement: mobx` in the frontmatter.

The same pattern applies to `architecture`, `backend`, and `navigation`.

---

## Pagination

The blog index supports `?page=N` query params. Configuration:

```ts
// app/blogs/page.tsx
const POSTS_PER_PAGE = 24
```

The featured post (index 0 in the sorted list) is always excluded from the paginated grid and only shown on page 1. Pagination controls only appear when there is more than one page of grid posts.

---

## SEO & Open Graph

### Blog Index

Set in `app/blogs/page.tsx` via the exported `metadata` object. Static title and description.

### Individual Posts

`generateMetadata` in `app/blogs/[...slug]/page.tsx` generates:

- `title`: post title
- `description`: post description
- `og:type`: `article`
- `og:publishedTime` / `og:modifiedTime`
- `og:image`: dynamic image via `/api/og?title=...&kind=...&category=...`
- `twitter:card`: `summary_large_image`

### Layout Title Template

`app/blogs/layout.tsx` sets `title.template: '%s | FlutterInit Blog'` so all child pages automatically get the ` | FlutterInit Blog` suffix without repeating it.

---

## Revalidation Strategy

Both the index page and post detail pages use:

```ts
export const revalidate = 3600 // 1 hour
```

This means Next.js will cache the page and regenerate it in the background at most every hour. New posts added to `content/blog/` will appear within an hour in production without a redeploy.

For immediate updates in development, content is always fresh because the dev server does not cache.

To force an immediate revalidation in production, call the Next.js `revalidatePath('/blogs')` API from a webhook or the server dashboard.
