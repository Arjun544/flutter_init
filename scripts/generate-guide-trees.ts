/**
 * scripts/generate-guide-trees.ts
 *
 * Reads all guide MDX files, extracts their stackConfig frontmatter,
 * and writes a .tree.json file next to each guide containing the
 * expected generated file paths.
 *
 * Usage: bun scripts/generate-guide-trees.ts
 *
 * In CI: run this on any PR touching content/blog/guides/** or templates/**
 * and fail if git diff shows stale .tree.json files.
 */

import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'
import type { StackConfig } from '../lib/blog/types'

const GUIDES_ROOT = path.join(process.cwd(), 'content', 'blog', 'guides')
const GENERATED_DIR = path.join(GUIDES_ROOT, '.generated')

/** Recursively find all .mdx files under a directory */
async function findMdxFiles(dir: string): Promise<string[]> {
  let results: string[] = []
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true })
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)
      if (entry.isDirectory() && entry.name !== '.generated') {
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

/**
 * Generates a representative file tree for a given stack config.
 * In a full implementation this would run the actual FlutterInit generation engine.
 * For now, this produces a deterministic placeholder based on the config.
 */
function generateFileTree(slug: string, config: StackConfig): string[] {
  const lines: string[] = []
  const { architecture, stateManagement, backend, navigation } = config

  lines.push('lib/')

  // Core
  lines.push('├── core/')
  lines.push('│   ├── di/')
  lines.push('│   │   └── providers.dart')

  if (backend !== 'none') {
    lines.push('│   ├── network/')
    lines.push('│   │   ├── dio_client.dart')
    lines.push('│   │   └── network_info.dart')
  }

  lines.push('│   └── errors/')
  lines.push('│       ├── failures.dart')
  lines.push('│       └── exceptions.dart')

  // Feature structure
  lines.push('├── features/')
  lines.push('│   └── auth/')

  if (architecture === 'clean') {
    lines.push('│       ├── data/')
    lines.push('│       │   ├── datasources/')
    if (backend === 'firebase') {
      lines.push('│       │   │   └── firebase_auth_datasource.dart')
    } else if (backend === 'supabase') {
      lines.push('│       │   │   └── supabase_auth_datasource.dart')
    } else {
      lines.push('│       │   │   └── auth_datasource.dart')
    }
    lines.push('│       │   ├── models/')
    lines.push('│       │   │   └── user_model.dart')
    lines.push('│       │   └── repositories/')
    lines.push('│       │       └── auth_repository_impl.dart')
    lines.push('│       ├── domain/')
    lines.push('│       │   ├── entities/')
    lines.push('│       │   │   └── user_entity.dart')
    lines.push('│       │   ├── repositories/')
    lines.push('│       │   │   └── auth_repository.dart')
    lines.push('│       │   └── usecases/')
    lines.push('│       │       ├── sign_in_usecase.dart')
    lines.push('│       │       └── sign_up_usecase.dart')
  } else if (architecture === 'mvvm') {
    lines.push('│       ├── models/')
    lines.push('│       │   └── user_model.dart')
    lines.push('│       ├── services/')
    lines.push('│       │   └── auth_service.dart')
    lines.push('│       └── viewmodels/')
    lines.push('│           └── auth_viewmodel.dart')
  } else {
    // feature-first
    lines.push('│       ├── data/')
    lines.push('│       │   └── auth_repository.dart')
  }

  // Presentation — consistent across architectures
  lines.push('│       └── presentation/')

  if (stateManagement === 'riverpod') {
    lines.push('│           ├── providers/')
    lines.push('│           │   └── auth_provider.dart')
  } else if (stateManagement === 'bloc') {
    lines.push('│           ├── bloc/')
    lines.push('│           │   ├── auth_bloc.dart')
    lines.push('│           │   ├── auth_event.dart')
    lines.push('│           │   └── auth_state.dart')
  } else if (stateManagement === 'getx') {
    lines.push('│           ├── controllers/')
    lines.push('│           │   └── auth_controller.dart')
  } else {
    lines.push('│           ├── notifiers/')
    lines.push('│           │   └── auth_notifier.dart')
  }

  lines.push('│           ├── pages/')
  lines.push('│           │   ├── sign_in_page.dart')
  lines.push('│           │   └── sign_up_page.dart')
  lines.push('│           └── widgets/')
  lines.push('│               └── auth_form.dart')

  // Router
  if (navigation !== 'none') {
    lines.push('├── router/')
    if (navigation === 'go_router') {
      lines.push('│   └── app_router.dart')
    } else {
      lines.push('│   └── app_router.gr.dart  # auto-generated')
    }
  }

  lines.push('└── main.dart')

  return lines
}

async function main() {
  console.log('🌳  FlutterInit — generating guide trees...\n')

  await fs.mkdir(GENERATED_DIR, { recursive: true })

  const files = await findMdxFiles(GUIDES_ROOT)

  if (files.length === 0) {
    console.log('  No guide MDX files found under', GUIDES_ROOT)
    process.exit(0)
  }

  let errors = 0

  for (const filePath of files) {
    const raw = await fs.readFile(filePath, 'utf-8')
    const { data } = matter(raw)

    if (!data.stackConfig) {
      console.log(`  ⏭  Skipping (no stackConfig): ${path.relative(process.cwd(), filePath)}`)
      continue
    }

    const slug = path.basename(filePath, '.mdx')
    const config = data.stackConfig as StackConfig

    try {
      const tree = generateFileTree(slug, config)
      const outPath = path.join(GENERATED_DIR, `${slug}.tree.json`)
      await fs.writeFile(outPath, JSON.stringify({ slug, config, tree }, null, 2), 'utf-8')
      console.log(`  ✅  ${slug}.tree.json  (${tree.length} lines)`)
    } catch (err) {
      console.error(`  ❌  ${slug}:`, err)
      errors++
    }
  }

  if (errors > 0) {
    console.error(`\n${errors} error(s). Check guide frontmatter.`)
    process.exit(1)
  }

  console.log('\n✔  Done. All guide trees up to date.')
}

main()
