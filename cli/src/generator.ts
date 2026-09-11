// ─────────────────────────────────────────────────────────────────────────────
// FlutterInit CLI — Project Generator
// Orchestrates: flutter create → template overlays → native config →
//               pub get → code generation → dart analyze → outro
// ─────────────────────────────────────────────────────────────────────────────

import { cancel, confirm, isCancel, note, outro, spinner } from '@clack/prompts'
import fs from 'fs'
import path from 'path'
import pc from 'picocolors'
import type { FlutterInitConfig } from './config'
import { configureNativeFiles } from './native'
import { buildTemplateContext, renderTemplate, TEMPLATE_ROOT } from './templates'
import { formatGeneratedProject } from '../../shared/format-generated'
import { selectOverlayKeys } from '../../shared/generator-contract'
import { trackCliGeneration } from './utils/analytics'
import { exec } from './utils/exec'
import { isDirNonEmpty, removeDir, writeFile } from './utils/fs'
import { brand, logError, logWarn } from './utils/logger'

// ─── Helper: resolve conditional file names ───────────────────────────────────
//
// Template files (and plain files) may be named with an optional condition
// prefix using the pattern:
//
//   (flag1,flag2,...)@real_filename.ext[.hbs]
//
// ANY listed flag may be truthy in the template context for the file to be
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
  if (backend === 'custom' && !config.usesDio && !config.usesHttp) {
    throw new Error('Custom backend requires either Dio or the HTTP client.')
  }
  const overlays = selectOverlayKeys({
    architecture,
    stateManagement: config.stateManager,
    navigation,
    backend: { provider: backend },
    localizationEnabled: config.useLocalization,
    usesDotenv: config.usesDotenv,
    usesHive: config.usesHive,
    usesDio: config.usesDio,
    usesHttp: config.usesHttp,
    usesCachedNetworkImage: config.usesCachedNetworkImage,
    usesSecureStorage: config.usesSecureStorage,
    usesSharedPreferences: config.usesSharedPreferences,
    usesPathProvider: config.usesPathProvider,
    usesSharePlus: config.usesSharePlus,
    usesPermissionHandler: config.usesPermissionHandler,
    usesUrlLauncher: config.usesUrlLauncher,
    usesGeolocator: config.usesGeolocator,
    usesImagePicker: config.usesImagePicker,
    usesFilePicker: config.usesFilePicker,
    usesDeviceInfoPlus: config.usesDeviceInfoPlus,
    usesAppVersionUpdate: config.usesAppVersionUpdate,
  })

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

  // ── Step 3: Overlay architecture and state templates ──────────────────────
  s.start('Applying architecture templates...')
  try {
    const archTemplateDir = path.join(TEMPLATE_ROOT, 'overlays', 'architecture', overlays.architecture)
    overlayTemplateDir(archTemplateDir, outputDir, config)
    overlayTemplateDir(
      path.join(TEMPLATE_ROOT, 'overlays', 'state', overlays.state),
      outputDir,
      config,
    )
    s.stop(`${pc.green('✓')} Architecture templates applied`)
  } catch (err) {
    s.stop(pc.red('✗ Architecture template overlay failed'))
    logError(`Architecture templates failed: ${(err as Error).message}`)
    removeDir(outputDir)
    process.exit(1)
  }

  // ── Step 4: Apply all selected feature overlays ───────────────────────────
  const selectedOverlays: Array<[string, string]> = [
    ['backend', path.join('overlays', 'backend', overlays.backend)],
    ...(overlays.routing
      ? [['routing', path.join('overlays', 'routing', overlays.routing)] as [string, string]]
      : []),
    ...(overlays.networking
      ? [['networking', path.join('overlays', 'networking', overlays.networking)] as [string, string]]
      : []),
    ...(overlays.cachedImage
      ? [['cached images', path.join('overlays', 'networking', 'cached_image')] as [string, string]]
      : []),
    ...(overlays.localization
      ? [['localization', path.join('overlays', 'extras', 'localization')] as [string, string]]
      : []),
    ...overlays.storage.map((name) => ['storage', path.join('overlays', 'storage', name)] as [string, string]),
    ...overlays.utilities.map((name) => ['utilities', path.join('overlays', 'utilities', name)] as [string, string]),
    ...(overlays.media
      ? [['media', path.join('overlays', 'media')] as [string, string]]
      : []),
    ...overlays.device.map((name) => ['device', path.join('overlays', 'device', name)] as [string, string]),
    ...(overlays.flavors
      ? [['flavors', path.join('overlays', 'extras', 'flavors')] as [string, string]]
      : []),
    ...(overlays.dotenv
      ? [['dotenv', path.join('overlays', 'extras', 'dotenv')] as [string, string]]
      : []),
  ]

  for (const [label, relativePath] of selectedOverlays) {
    const templateDir = path.join(TEMPLATE_ROOT, relativePath)
    if (!fs.existsSync(templateDir)) continue

    s.start(`Applying ${label} templates...`)
    try {
      overlayTemplateDir(templateDir, outputDir, config)
      s.stop(`${pc.green('✓')} ${label} templates applied`)
    } catch (err) {
      s.stop(pc.red(`✗ ${label} template overlay failed`))
      logError(`${label} templates failed: ${(err as Error).message}`)
      removeDir(outputDir)
      process.exit(1)
    }
  }

  // ── Step 5: Configure native permissions ──────────────────────────────────
  const ns = spinner()
  ns.start('Configuring native permissions...')
  try {
    await configureNativeFiles(config)
    ns.stop(`${pc.green('✓')} Native permissions configured`)
  } catch (err) {
    ns.stop(pc.red('✗ Native configuration failed'))
    logError(`Native configuration failed: ${String(err)}`)
    removeDir(outputDir)
    process.exit(1)
  }

  // ── Step 6: Validate the generated project ────────────────────────────────
  const vs = spinner()
  vs.start('Resolving and analyzing generated project...')
  try {
    exec('flutter pub get', { cwd: outputDir })
    // Format after pub get — page width / style can differ before packages resolve
    const formatResult = await formatGeneratedProject(outputDir)
    if (formatResult.skipped) {
      logWarn('dart not on PATH — skipped formatting generated project')
    } else if (!formatResult.success) {
      logWarn(`dart format failed:\n${formatResult.stderr || formatResult.stdout}`)
    }
    const context = buildTemplateContext(config)
    if (context.flags.requiresCodeGeneration) {
      exec('dart run build_runner build --delete-conflicting-outputs', { cwd: outputDir })
    }
    exec('dart analyze --fatal-infos', { cwd: outputDir })
    vs.stop(`${pc.green('✓')} Generated project passed validation`)
  } catch (err) {
    vs.stop(pc.red('✗ Generated project validation failed'))
    logError(`Generated project validation failed: ${(err as Error).message}`)
    removeDir(outputDir)
    process.exit(1)
  }

  // ── Step 7: Upload Generation Telemetry ───────────────────────────────────
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
