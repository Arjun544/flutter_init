// ─────────────────────────────────────────────────────────────────────────────
// FlutterInit CLI — Project Generator
// Orchestrates: flutter create → template overlay → folder structure →
//               pub get → dart analyze → outro
// ─────────────────────────────────────────────────────────────────────────────

import { cancel, confirm, isCancel, log, note, outro, spinner } from '@clack/prompts'
import fs from 'fs'
import path from 'path'
import pc from 'picocolors'
import type { FlutterInitConfig } from './config'
import { configureNativeFiles } from './native'
import { buildTemplateContext, renderTemplate, templateExists, TEMPLATE_ROOT } from './templates'
import { exec } from './utils/exec'
import { createGitkeep, isDirNonEmpty, removeDir, writeFile } from './utils/fs'
import { brand, logError, logWarn } from './utils/logger'
import { trackCliGeneration } from './utils/analytics'

// ─── Architecture folder structures ───────────────────────────────────────────

const ARCH_FOLDERS: Record<string, string[]> = {
  clean: [
    'lib/src/features/auth/data/datasources',
    'lib/src/features/auth/data/models',
    'lib/src/features/auth/data/repositories',
    'lib/src/features/auth/domain/entities',
    'lib/src/features/auth/domain/repositories',
    'lib/src/features/auth/domain/usecases',
    'lib/src/features/auth/presentation/pages',
    'lib/src/features/auth/presentation/widgets',
    'lib/src/features/home/data/datasources',
    'lib/src/features/home/data/models',
    'lib/src/features/home/data/repositories',
    'lib/src/features/home/domain/entities',
    'lib/src/features/home/domain/repositories',
    'lib/src/features/home/domain/usecases',
    'lib/src/features/home/presentation/pages',
    'lib/src/features/home/presentation/widgets',
    'lib/src/shared/widgets',
    'lib/src/shared/models',
    'lib/src/theme',
    'lib/src/routing',
    'lib/src/config',
    'lib/src/utils',
  ],
  mvvm: [
    'lib/src/features/auth/model',
    'lib/src/features/auth/view',
    'lib/src/features/auth/viewmodel',
    'lib/src/features/home/model',
    'lib/src/features/home/view',
    'lib/src/features/home/viewmodel',
    'lib/src/shared/widgets',
    'lib/src/shared/models',
    'lib/src/theme',
    'lib/src/routing',
    'lib/src/config',
  ],
  'feature-first': [
    'lib/src/features/auth/screens',
    'lib/src/features/auth/widgets',
    'lib/src/features/auth/controllers',
    'lib/src/features/auth/models',
    'lib/src/features/auth/services',
    'lib/src/features/home/screens',
    'lib/src/features/home/widgets',
    'lib/src/features/home/controllers',
    'lib/src/features/home/models',
    'lib/src/shared/widgets',
    'lib/src/shared/constants',
    'lib/src/theme',
    'lib/src/routing',
  ],
  mvc: [
    'lib/src/models',
    'lib/src/views/auth',
    'lib/src/views/home',
    'lib/src/controllers',
    'lib/src/services',
    'lib/src/widgets',
    'lib/src/theme',
    'lib/src/routing',
    'lib/src/utils',
  ],
  'layer-first': [
    'lib/src/data/datasources',
    'lib/src/data/models',
    'lib/src/data/repositories',
    'lib/src/domain/entities',
    'lib/src/domain/repositories',
    'lib/src/domain/usecases',
    'lib/src/presentation/pages',
    'lib/src/presentation/widgets',
    'lib/src/presentation/state',
    'lib/src/theme',
    'lib/src/routing',
    'lib/src/utils',
  ],
}

// ─── Helper: resolve conditional file names ───────────────────────────────────
//
// Template files (and plain files) may be named with an optional condition
// prefix using the pattern:
//
//   (flag1,flag2,...)@real_filename.ext[.hbs]
//
// ALL listed flags must be truthy in the template context for the file to be
// emitted.  When emitted the output filename is the part after "@" (with the
// ".hbs" suffix already stripped by the caller).
//
// Examples:
//   (usesSupabaseAuth)@auth_service.dart.hbs  →  auth_service.dart  (only when usesSupabaseAuth)
//   (isGetX)@app_bindings.dart.hbs            →  app_bindings.dart  (only when isGetX)
//   (isRiverpod,isProvider)@state.dart.hbs    →  state.dart          (only when both are true)
//   app.dart.hbs                              →  app.dart            (always)
//
// Returns null when the file should be skipped, otherwise the resolved output name.

function resolveConditionalFilename(
  rawName: string,   // already has .hbs stripped if applicable
  config: FlutterInitConfig,
): string | null {
  const match = rawName.match(/^\(([^)]+)\)@(.+)$/)
  if (!match) return rawName  // no condition prefix — always emit as-is

  const flags = match[1]!.split(',').map((f) => f.trim())
  const realName = match[2]!

  // Build the context to access context.flags
  const ctx = buildTemplateContext(config)
  const flagsObj = (ctx.flags ?? {}) as Record<string, unknown>

  const shouldInclude = flags.some((flag) => Boolean(flagsObj[flag]))
  return shouldInclude ? realName : null
}

// ─── Helper: walk a template directory and render/write all .hbs files ────────

function overlayTemplateDir(
  templateDir: string,
  outputDir: string,
  config: FlutterInitConfig,
): void {
  if (!fs.existsSync(templateDir)) return

  const entries = fs.readdirSync(templateDir, { withFileTypes: true })

  for (const entry of entries) {
    const srcPath = path.join(templateDir, entry.name)

    if (entry.isDirectory()) {
      const destDir = path.join(outputDir, entry.name)
      overlayTemplateDir(srcPath, destDir, config)
    } else if (entry.name.endsWith('.hbs')) {
      // Strip .hbs extension, then resolve any (condition)@name prefix
      const nameWithoutHbs = entry.name.slice(0, -4)
      const outputName = resolveConditionalFilename(nameWithoutHbs, config)
      if (outputName === null) continue  // condition not met — skip file

      const outputPath = path.join(outputDir, outputName)

      // Compute the relative template path for renderTemplate()
      const relPath = path.relative(TEMPLATE_ROOT, srcPath)
      const rendered = renderTemplate(relPath, config)
      writeFile(outputPath, rendered)
    } else {
      // Non-HBS files (e.g. .gitignore, .yaml) — still resolve conditional names
      const outputName = resolveConditionalFilename(entry.name, config)
      if (outputName === null) continue  // condition not met — skip file

      const outputPath = path.join(outputDir, outputName)
      fs.mkdirSync(path.dirname(outputPath), { recursive: true })
      fs.copyFileSync(srcPath, outputPath)
    }
  }
}

// ─── Main generator ───────────────────────────────────────────────────────────

export async function generateProject(config: FlutterInitConfig): Promise<void> {
  const { outputDir, projectName, orgName, architecture, backend, navigation } = config

  // ── Guard: check for existing non-empty directory ──────────────────────────
  if (isDirNonEmpty(outputDir)) {
    logWarn(`Directory already exists and is not empty: ${pc.dim(outputDir)}`)
    const overwrite = await confirm({
      message: 'Overwrite the existing directory?',
      initialValue: false,
    })
    if (isCancel(overwrite) || !overwrite) {
      cancel('Generation cancelled. cd to an empty directory and try again.')
      process.exit(0)
    }
    removeDir(outputDir)
  }

  const s = spinner()

  // ── Step 1: flutter create ─────────────────────────────────────────────────
  s.start('Running flutter create...')
  try {
    exec(
      `flutter create --org ${orgName} --project-name ${projectName} "${outputDir}"`,
    )
    s.stop(`${pc.green('✓')} Flutter project scaffolded`)
  } catch (err) {
    s.stop(pc.red('✗ flutter create failed'))
    logError(`flutter create failed: ${(err as Error).message}`)
    removeDir(outputDir)
    process.exit(1)
  }

  // ── Step 2: Overlay base templates ────────────────────────────────────────
  s.start('Applying FlutterInit base templates...')
  try {
    const baseTemplateDir = path.join(TEMPLATE_ROOT, 'base')
    overlayTemplateDir(baseTemplateDir, outputDir, config)
    s.stop(`${pc.green('✓')} Base templates applied`)
  } catch (err) {
    s.stop(pc.red('✗ Template overlay failed'))
    logError(`Template rendering failed: ${(err as Error).message}`)
    removeDir(outputDir)
    process.exit(1)
  }

  // ── Step 3: Create architecture folder structure ───────────────────────────
  s.start(`Creating ${architecture} folder structure...`)
  try {
    const folders = ARCH_FOLDERS[architecture] ?? []
    for (const folder of folders) {
      createGitkeep(path.join(outputDir, folder))
    }
    s.stop(`${pc.green('✓')} ${ARCH_FOLDERS[architecture]?.length ?? 0} directories created`)
  } catch (err) {
    s.stop(pc.red('✗ Folder creation failed'))
    logError(`Failed to create architecture folders: ${(err as Error).message}`)
    removeDir(outputDir)
    process.exit(1)
  }

  // ── Step 4: Overlay architecture-specific templates ───────────────────────
  s.start('Applying architecture templates...')
  try {
    const archTemplateDir = path.join(TEMPLATE_ROOT, 'overlays', 'architecture', architecture)
    overlayTemplateDir(archTemplateDir, outputDir, config)
    s.stop(`${pc.green('✓')} Architecture templates applied`)
  } catch (err) {
    s.stop(pc.red('✗ Architecture template overlay failed'))
    logError(`Architecture templates failed: ${(err as Error).message}`)
    removeDir(outputDir)
    process.exit(1)
  }

  // ── Step 5: Overlay backend templates (if selected) ───────────────────────
  if (backend !== 'none') {
    s.start(`Applying ${backend} backend templates...`)
    try {
      const backendTemplateDir = path.join(TEMPLATE_ROOT, 'overlays', 'backend', backend)
      overlayTemplateDir(backendTemplateDir, outputDir, config)
      s.stop(`${pc.green('✓')} ${backend} templates applied`)
    } catch (err) {
      s.stop(pc.yellow(`⚠ Backend templates had issues — ${(err as Error).message}`))
      // Non-fatal: warn but don't block
    }
  }

  // ── Step 6: Overlay navigation templates (if selected) ────────────────────
  if (navigation !== 'none') {
    const navName = navigation === 'gorouter' ? 'go_router' : 'auto_route'
    s.start(`Applying ${navName} navigation templates...`)
    try {
      const navTemplateDir = path.join(TEMPLATE_ROOT, 'overlays', 'navigation', navName)
      if (fs.existsSync(navTemplateDir)) {
        overlayTemplateDir(navTemplateDir, outputDir, config)
      }
      s.stop(`${pc.green('✓')} Navigation templates applied`)
    } catch (err) {
      s.stop(pc.yellow(`⚠ Navigation templates had issues — ${(err as Error).message}`))
    }
  }

  // ── Step 7: Configure native permissions ──────────────────────────────────
  const ns = spinner()
  ns.start('Configuring native permissions...')
  try {
    await configureNativeFiles(config)
    ns.stop(`${pc.green('✓')} Native permissions configured`)
  } catch (err) {
    ns.stop(pc.yellow('⚠ Native configuration skipped — check AndroidManifest.xml and Info.plist manually'))
    logWarn(String(err))
  }

  // ── Step 8: Upload Generation Telemetry ────────────────────────────────────
  await trackCliGeneration(config)

  // ── Outro ─────────────────────────────────────────────────────────────────
  note(
    [
      `${pc.bold('cd')} "${outputDir}"`,
      `${pc.bold('flutter pub get')}`,
      `${pc.bold('flutter run')}`,
      ``,
      `${pc.dim('Or open in VS Code:')}`,
      `${pc.bold('code')} "${outputDir}"`,
      ``,
      `${pc.dim('Docs & templates:')} ${pc.cyan('https://flutterinit.com')}`,
    ].join('\n'),
    'Next steps',
  )

  outro(
    `${brand(' FlutterInit ')} ${pc.dim('—')} ${pc.green('Your Flutter project is ready. Happy coding! 🚀')}`,
  )
}
