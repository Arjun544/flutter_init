// ─────────────────────────────────────────────────────────────────────────────
// FlutterInit CLI — Configuration Types
// Single source of truth for all project configuration options.
// ─────────────────────────────────────────────────────────────────────────────

export type Architecture = 'clean' | 'mvvm' | 'feature-first' | 'mvc' | 'layer-first'

export type StateManager = 'riverpod' | 'bloc' | 'provider' | 'mobx' | 'getx'

export type Backend = 'firebase' | 'supabase' | 'appwrite' | 'custom' | 'none'

export type Navigation = 'gorouter' | 'autoroute' | 'none'

export type ThemeMode = 'light' | 'dark' | 'both'

export interface FlutterInitConfig {
  projectName: string       // validated: lowercase, underscores only e.g. my_app
  orgName: string           // reverse domain e.g. com.example
  description: string       // optional project description
  architecture: Architecture
  stateManager: StateManager
  backend: Backend
  navigation: Navigation
  themeMode: ThemeMode
  primaryColor: string      // hex string e.g. #6750A4
  outputDir: string         // resolved absolute path (cwd/projectName)

  // Icons selection
  usesIconsaxPlus: boolean
  usesFlutterRemix: boolean
  usesHugeicons: boolean

  // Networking
  usesDio: boolean
  usesHttp: boolean
  usesCachedNetworkImage: boolean

  // Persistence
  usesHive: boolean
  usesSharedPreferences: boolean
  usesSecureStorage: boolean

  // Media & Assets
  usesFlutterSvg: boolean
  usesImagePicker: boolean
  usesFilePicker: boolean
  usesCamera: boolean   

  // Essential Utilities
  usesUrlLauncher: boolean
  usesPathProvider: boolean
  usesSharePlus: boolean
  usesPermissionHandler: boolean
  usesGeolocator: boolean
  useLocalization: boolean
  usesNotifications: boolean

  // Device & System
  usesDeviceInfoPlus: boolean
  usesAppVersionUpdate: boolean
  usesFlutterNativeSplash: boolean

  // Advanced Features
  usesFlutterHooks: boolean
  usesSkeletonizer: boolean
  usesScreenutil: boolean
  usesDotenv: boolean
  usesLogger: boolean
  useMaterial3: boolean
}

// ─── Architecture Labels ──────────────────────────────────────────────────────

export const ARCHITECTURE_LABELS: Record<Architecture, string> = {
  'clean': 'Clean Architecture',
  'mvvm': 'MVVM',
  'feature-first': 'Feature-First',
  'mvc': 'MVC',
  'layer-first': 'Layer-First',
}

export const STATE_LABELS: Record<StateManager, string> = {
  'riverpod': 'Riverpod',
  'bloc': 'Bloc / Cubit',
  'provider': 'Provider',
  'mobx': 'MobX',
  'getx': 'GetX',
}

export const BACKEND_LABELS: Record<Backend, string> = {
  'firebase': 'Firebase',
  'supabase': 'Supabase',
  'appwrite': 'Appwrite',
  'custom': 'Custom Backend',
  'none': 'None',
}

export const NAVIGATION_LABELS: Record<Navigation, string> = {
  'gorouter': 'GoRouter',
  'autoroute': 'AutoRoute',
  'none': 'Navigator 2.0',
}

export const THEME_LABELS: Record<ThemeMode, string> = {
  'light': 'Light only',
  'dark': 'Dark only',
  'both': 'Both (system)',
}
