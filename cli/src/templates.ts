// ─────────────────────────────────────────────────────────────────────────────
// FlutterInit CLI — Template Loader & Renderer
// Loads Handlebars .hbs templates from cli/templates/, registers helpers,
// computes derived booleans, and renders against FlutterInitConfig.
// ─────────────────────────────────────────────────────────────────────────────

import fs from 'fs'
import Handlebars from 'handlebars'
import path from 'path'
import { fileURLToPath } from 'url'
import type { FlutterInitConfig } from './config'

// ── Resolve template root ──────────────────────────────────────────────────
// Works both in monorepo (bun run dev) and as published npm package
// (templates/ is bundled alongside the package via "files" in package.json)

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// When compiled: dist/ sits next to templates/
// When running via bun run dev: src/ → cli root → templates/
const TEMPLATE_ROOT = (() => {
  // Try relative to current file first (works from src/ in monorepo, pointing to templates/flutter)
  const fromSrc = path.resolve(__dirname, '../../templates/flutter')
  if (fs.existsSync(fromSrc)) return fromSrc
  // Then try from dist/ or when templates are synced to cli/templates
  const fromDist = path.resolve(__dirname, '../templates')
  if (fs.existsSync(fromDist)) return fromDist
  // Fallback to cwd-relative (running from cli/ root with bun)
  return path.resolve(process.cwd(), 'templates')
})()

// ── Register Handlebars partials ───────────────────────────────────────────

const PARTIALS_ROOT = path.join(TEMPLATE_ROOT, 'partials')

function registerPartialsSync(dir: string) {
  if (!fs.existsSync(dir)) return

  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      registerPartialsSync(fullPath)
    } else if (entry.isFile() && entry.name.endsWith('.hbs')) {
      const contents = fs.readFileSync(fullPath, 'utf8')
      const rel = path.relative(PARTIALS_ROOT, fullPath)
      const name = rel.replace(/\\/g, '/').replace(/\.hbs$/, '')
      Handlebars.registerPartial(name, contents)
    }
  }
}

registerPartialsSync(PARTIALS_ROOT)

// ── Helpers ────────────────────────────────────────────────────────────────

function kebabCase(value: string) {
  return value
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()
}

function snakeCase(value: string) {
  return value
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .toLowerCase()
}

function pascalCase(value: string) {
  return value
    .replace(/(^\w|[-_\s]+\w)/g, (match) =>
      match.replace(/[-_\s]/g, '').toUpperCase()
    )
    .replace(/[^a-zA-Z0-9]/g, '')
}

function indentLines(text: string, spaces: number) {
  const pad = ' '.repeat(spaces)
  return text
    .split('\n')
    .map((line) => (line.length ? pad + line : line))
    .join('\n')
}

// ── Register Handlebars helpers ────────────────────────────────────────────

Handlebars.registerHelper('eq', (a: unknown, b: unknown) => a === b)

Handlebars.registerHelper('includes', (arr: unknown[], val: unknown) =>
  Array.isArray(arr) && arr.includes(val),
)

Handlebars.registerHelper('capitalize', (str: string) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1) : '',
)

Handlebars.registerHelper('and', function (...args: unknown[]) {
  return args.slice(0, -1).every(Boolean)
})

Handlebars.registerHelper('or', function (...args: unknown[]) {
  return args.slice(0, -1).some(Boolean)
})

Handlebars.registerHelper('not', (value: unknown) => !value)
Handlebars.registerHelper('kebabCase', kebabCase)
Handlebars.registerHelper('snakeCase', snakeCase)
Handlebars.registerHelper('pascalCase', pascalCase)
Handlebars.registerHelper('json', (value) => JSON.stringify(value, null, 2))
Handlebars.registerHelper('indent', (text: string, spaces = 2) =>
  indentLines(text, Number(spaces))
)
Handlebars.registerHelper('res', (value: unknown, unit: string, usesScreenutil: boolean) => {
  if (usesScreenutil) return `${value}.${unit}`
  return String(value)
})
Handlebars.registerHelper('when', function (this: unknown, condition, options) {
  return condition ? options.fn(this) : options.inverse(this)
})

// ── Derived boolean context ────────────────────────────────────────────────

export interface TemplateContext extends Omit<FlutterInitConfig, 'backend'> {
  appName: string
  backend: any
  isRiverpod: boolean
  isBloc: boolean
  isProvider: boolean
  isMobX: boolean
  isGetX: boolean
  isCleanArch: boolean
  isMvvm: boolean
  isFeatureFirst: boolean
  isMvc: boolean
  isLayerFirst: boolean
  hasFirebase: boolean
  hasSupabase: boolean
  hasAppwrite: boolean
  hasBackend: boolean
  hasGoRouter: boolean
  hasAutoRoute: boolean
  hasNavigation: boolean
  hasDarkMode: boolean
  hasLightMode: boolean
  hasBothModes: boolean
  flags: any
}

export function buildTemplateContext(config: FlutterInitConfig): TemplateContext {
  const routerPackage =
    config.navigation === 'gorouter'
      ? 'go_router'
      : config.navigation === 'autoroute'
        ? 'auto_route'
        : undefined

  const appSnake = config.projectName.trim().replace(/\s+/g, '_').toLowerCase()
  const appSlug = config.projectName.trim().replace(/\s+/g, '-').toLowerCase()

  const flags = {
    appSlug,
    appSnake,
    routerPackage,
    usesRouting: Boolean(routerPackage),
    isRiverpod: config.stateManager === 'riverpod',
    isProvider: config.stateManager === 'provider',
    isBloc: config.stateManager === 'bloc',
    isGetX: config.stateManager === 'getx',
    isMobX: config.stateManager === 'mobx',
    isNoneState: false,
    usesFirebase: config.backend === 'firebase',
    usesSupabase: config.backend === 'supabase',
    usesAppwrite: config.backend === 'appwrite',
    usesCustomBackend: config.backend === 'custom',
    usesDio: config.usesDio,
    usesHttp: config.usesHttp,
    usesHive: config.usesHive,
    usesSharedPreferences: config.usesSharedPreferences,
    usesSecureStorage: config.usesSecureStorage,
    usesCachedNetworkImage: config.usesCachedNetworkImage,
    usesFlutterSvg: config.usesFlutterSvg,
    usesSkeletonizer: config.usesSkeletonizer,
    usesScreenutil: config.usesScreenutil,
    usesFlutterNativeSplash: config.usesFlutterNativeSplash,
    usesLogger: config.usesLogger,
    usesDotenv: config.usesDotenv,
    usesIconsaxPlus: config.usesIconsaxPlus,
    usesFlutterRemix: config.usesFlutterRemix,
    usesHugeicons: config.usesHugeicons,
    supportsLocalization: config.useLocalization,
    supportedLocales: config.useLocalization ? ['en', 'es'] : ['en'],
    fallbackLocale: 'en',
    hasFlavors: true,
    hasDarkMode: config.themeMode !== 'light',
    isCupertino: false,
    isCustomTheme: true,
    usesFlutterHooks: config.usesFlutterHooks,
    usesImagePicker: config.usesImagePicker,
    usesCamera: config.usesCamera,
    usesFilePicker: config.usesFilePicker,
    usesPathProvider: config.usesPathProvider,
    usesSharePlus: config.usesSharePlus,
    usesPermissionHandler: config.usesPermissionHandler,
    usesUrlLauncher: config.usesUrlLauncher,
    usesDeviceInfoPlus: config.usesDeviceInfoPlus,
    usesAppVersionUpdate: config.usesAppVersionUpdate,
    usesGeolocator: config.usesGeolocator,
    usesNotifications: config.usesNotifications,
    usesFirebaseAuth: config.backend === 'firebase',
    usesFirebaseFirestore: config.backend === 'firebase',
    usesFirebaseStorage: config.backend === 'firebase',
    usesSupabaseAuth: config.backend === 'supabase',
    usesSupabaseDb: config.backend === 'supabase',
    usesAppwriteAuth: config.backend === 'appwrite',
    usesAppwriteDb: config.backend === 'appwrite',
    hasCustomFonts: false,
    primaryFontFamily: '',
    fontFamilies: [] as any[],
  }

  const backend = {
    provider: config.backend,
    options: {
      authEmail: config.backend === 'firebase',
      firestore: config.backend === 'firebase',
      realtimeDb: false,
      storage: config.backend === 'firebase',
      analytics: config.backend === 'firebase',
      crashlytics: config.backend === 'firebase',
      auth: config.backend !== 'none',
      database: config.backend !== 'none',
    }
  }

  return {
    ...config,
    appName: config.projectName,
    backend,
    flags,
    isRiverpod: config.stateManager === 'riverpod',
    isBloc: config.stateManager === 'bloc',
    isProvider: config.stateManager === 'provider',
    isMobX: config.stateManager === 'mobx',
    isGetX: config.stateManager === 'getx',
    isCleanArch: config.architecture === 'clean',
    isMvvm: config.architecture === 'mvvm',
    isFeatureFirst: config.architecture === 'feature-first',
    isMvc: config.architecture === 'mvc',
    isLayerFirst: config.architecture === 'layer-first',
    hasFirebase: config.backend === 'firebase',
    hasSupabase: config.backend === 'supabase',
    hasAppwrite: config.backend === 'appwrite',
    hasBackend: config.backend !== 'none',
    hasGoRouter: config.navigation === 'gorouter',
    hasAutoRoute: config.navigation === 'autoroute',
    hasNavigation: config.navigation !== 'none',
    hasDarkMode: config.themeMode !== 'light',
    hasLightMode: config.themeMode !== 'dark',
    hasBothModes: config.themeMode === 'both',
  }
}

// ── Template renderer ──────────────────────────────────────────────────────

/**
 * Load and render a Handlebars template by name.
 *
 * @param templatePath  Relative path within templates/ — e.g. 'base/pubspec.yaml.hbs'
 * @param config        FlutterInitConfig to render against
 * @returns             Rendered string output
 */
export function renderTemplate(templatePath: string, config: FlutterInitConfig): string {
  const fullPath = path.join(TEMPLATE_ROOT, templatePath)

  if (!fs.existsSync(fullPath)) {
    throw new Error(`Template not found: ${fullPath}`)
  }

  const source = fs.readFileSync(fullPath, 'utf-8')
  const template = Handlebars.compile(source, { noEscape: true })
  const context = buildTemplateContext(config)
  return template(context)
}

/**
 * Check if a template file exists (useful for optional templates).
 */
export function templateExists(templatePath: string): boolean {
  return fs.existsSync(path.join(TEMPLATE_ROOT, templatePath))
}

export { TEMPLATE_ROOT }
