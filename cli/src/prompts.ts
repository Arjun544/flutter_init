// ─────────────────────────────────────────────────────────────────────────────
// FlutterInit CLI — Interactive Prompts
// Full Clack.js prompt flow. Returns a completed FlutterInitConfig.
// Every prompt is followed by an isCancel() check — no exceptions.
// ─────────────────────────────────────────────────────────────────────────────

import {
  cancel,
  confirm,
  groupMultiselect,
  isCancel,
  note,
  select,
  text
} from '@clack/prompts'
import path from 'path'
import pc from 'picocolors'
import {
  ARCHITECTURE_LABELS,
  BACKEND_LABELS,
  NAVIGATION_LABELS,
  STATE_LABELS,
  THEME_LABELS,
  type Architecture,
  type Backend,
  type FlutterInitConfig,
  type Navigation,
  type StateManager,
  type ThemeMode,
} from './config'
import { printBanner, printStep } from './utils/logger'

// ─── Cancel helper ────────────────────────────────────────────────────────────

function checkCancel(value: unknown): asserts value is NonNullable<typeof value> {
  if (isCancel(value)) {
    cancel('Cancelled. Run create-flutterinit again whenever you\'re ready.')
    process.exit(0)
  }
}

// ─── Main prompt orchestrator ─────────────────────────────────────────────────

export async function runPrompts(): Promise<FlutterInitConfig> {

  // ── Section: Project Identity ──────────────────────────────────────────────
  printStep(
    'Project Identity',
    'Basic information about your Flutter application.',
  )

  const projectName = await text({
    message: `Project name ${pc.dim('(lowercase letters, numbers, and underscores)')}`,
    placeholder: 'my_app',
    validate(value) {
      if (!value || value.trim().length === 0) return 'Project name is required.'
      if (!/^[a-z][a-z0-9_]*$/.test(value.trim()))
        return 'Must be lowercase with underscores only — e.g. my_app'
      return undefined
    },
  })
  checkCancel(projectName)
  const name = (projectName as string).trim()

  const orgName = await text({
    message: `Organisation name ${pc.dim('(reverse domain format — e.g. com.yourcompany)')}`,
    placeholder: 'com.example',
    defaultValue: 'com.example',
    validate(value) {
      const v = value || 'com.example'
      if (!/^[a-z][a-z0-9]*(\.[a-z][a-z0-9]*)+$/.test(v))
        return 'Use reverse domain format — e.g. com.example or com.acme.mobile'
      return undefined
    },
  })
  checkCancel(orgName)

  const description = await text({
    message: 'Project description',
    placeholder: 'A new Flutter project',
    defaultValue: 'A new Flutter project',
  })
  checkCancel(description)

  // ── Section: Architecture ──────────────────────────────────────────────────
  printStep(
    'Architecture',
    'Choose how your project folders and layers are organized.',
  )

  const architecture = await select<Architecture>({
    message: 'Architecture pattern',
    options: [
      {
        value: 'clean',
        label: 'Clean Architecture',
        hint: 'Data → Domain → Presentation layers. Best for large teams.',
      },
      {
        value: 'mvvm',
        label: 'MVVM',
        hint: 'Model-View-ViewModel. Great with Riverpod or Provider.',
      },
      {
        value: 'feature-first',
        label: 'Feature-First',
        hint: 'Organized by feature, not layer. Scales well for medium apps.',
      },
      {
        value: 'mvc',
        label: 'MVC',
        hint: 'Model-View-Controller. Familiar pattern for most developers.',
      },
      {
        value: 'layer-first',
        label: 'Layer-First',
        hint: 'Global shared layers. Simple, good for smaller apps.',
      },
    ],
  })
  checkCancel(architecture)

  // ── Section: State Management ──────────────────────────────────────────────
  printStep(
    'State Management',
    'The state management solution wired throughout your app.',
  )

  const stateManager = await select<StateManager>({
    message: 'State manager',
    options: [
      {
        value: 'riverpod',
        label: 'Riverpod',
        hint: 'AsyncNotifier + Riverpod Generator. Compile-safe & testable.',
      },
      {
        value: 'bloc',
        label: 'Bloc / Cubit',
        hint: 'Event-driven. Strict separation, excellent for large teams.',
      },
      {
        value: 'provider',
        label: 'Provider',
        hint: 'Simple InheritedWidget wrapper. Great for smaller apps.',
      },
      {
        value: 'mobx',
        label: 'MobX',
        hint: 'Reactive observables with code generation.',
      },
      {
        value: 'getx',
        label: 'GetX',
        hint: 'All-in-one: state, routing, DI. Opinionated but fast.',
      },
    ],
  })
  checkCancel(stateManager)

  // ── Section: Backend ───────────────────────────────────────────────────────
  printStep(
    'Backend',
    'Backend-as-a-service to wire into your data layer.',
  )

  const backend = await select<Backend>({
    message: 'Backend service',
    options: [
      {
        value: 'firebase',
        label: 'Firebase',
        hint: 'Auth, Firestore, Storage, FCM. Google ecosystem.',
      },
      {
        value: 'supabase',
        label: 'Supabase',
        hint: 'Open-source Firebase alternative. Postgres + realtime.',
      },
      {
        value: 'appwrite',
        label: 'Appwrite',
        hint: 'Self-hostable BaaS. Full ownership of your data.',
      },
      {
        value: 'custom',
        label: 'Custom Backend',
        hint: 'Connect to your own REST API/service via AppConfig.',
      },
      {
        value: 'none',
        label: 'None',
        hint: 'No backend wired in. Add your own later.',
      },
    ],
  })
  checkCancel(backend)

  // ── Section: Navigation ────────────────────────────────────────────────────
  printStep(
    'Navigation',
    'Routing solution for navigating between screens.',
  )

  const navigation = await select<Navigation>({
    message: 'Navigation package',
    options: [
      {
        value: 'gorouter',
        label: 'GoRouter',
        hint: 'Official Flutter routing. URL-based, deep-link ready.',
      },
      {
        value: 'autoroute',
        label: 'AutoRoute',
        hint: 'Code-generated typed routes. Zero string-based navigation.',
      },
      {
        value: 'none',
        label: 'Navigator 2.0',
        hint: 'Vanilla Flutter navigation. No extra dependency.',
      },
    ],
  })
  checkCancel(navigation)

  // ── Section: Theme ────────────────────────────────────────────────────────
  printStep(
    'Theme & Appearance',
    'Material 3 color scheme and theme mode for your app.',
  )

  const themeMode = await select<ThemeMode>({
    message: 'Theme mode',
    options: [
      {
        value: 'both',
        label: 'Both (system default)',
        hint: 'App respects the device light/dark preference.',
      },
      {
        value: 'light',
        label: 'Light only',
        hint: 'Always renders in light mode.',
      },
      {
        value: 'dark',
        label: 'Dark only',
        hint: 'Always renders in dark mode.',
      },
    ],
  })
  checkCancel(themeMode)

  const primaryColor = await text({
    message: `Primary color ${pc.dim('(hex seed color for color scheme)')}`,
    placeholder: '#027DFD',
    defaultValue: '#027DFD',
    validate(value) {
      const v = value || '#027DFD'
      if (!/^#[0-9A-Fa-f]{6}$/.test(v))
        return 'Enter a valid 6-digit hex color — e.g. #6750A4'
      return undefined
    },
  })
  checkCancel(primaryColor)

  // ── Section: Optional Utilities (Consolidated using groupMultiselect) ──────
  printStep(
    'Optional Utilities & Features',
    'Select additional packages and features to pre-configure in your codebase.',
  )

  const selectedMiscResult = await groupMultiselect<string>({
    message: 'Select packages to include (Press Space to select & Enter to confirm)',
    options: {
      'Icon Packs': [
        {
          value: 'usesIconsaxPlus',
          label: 'Iconsax Plus',
          hint: 'Modern icon set with 6 distinct styles (linear, bold, etc.)',
        },
        {
          value: 'usesFlutterRemix',
          label: 'Flutter Remix',
          hint: 'Remix Icon library package wrapper',
        },
        {
          value: 'usesHugeicons',
          label: 'Hugeicons',
          hint: 'Free stroke outline icons pack',
        },
      ],
      'Networking & Storage': [
        {
          value: 'usesDio',
          label: 'Dio',
          hint: 'Powerful HTTP client with interceptors, form data & caching [Recommended]',
        },
        {
          value: 'usesHttp',
          label: 'HTTP Client',
          hint: 'Official lightweight Dart http package',
        },
        {
          value: 'usesCachedNetworkImage',
          label: 'Cached Network Image',
          hint: 'Download, render and cache network images automatically [Popular]',
        },
        {
          value: 'usesHive',
          label: 'Hive Database',
          hint: 'Lightweight & blazing fast key-value NoSQL database',
        },
        {
          value: 'usesSharedPreferences',
          label: 'Shared Preferences',
          hint: 'Platform-persistent key-value pairs storage [Essential]',
        },
        {
          value: 'usesSecureStorage',
          label: 'Secure Storage',
          hint: 'Store credentials/sensitive data securely (Keychain/Keystore)',
        },
      ],
      'Media & Assets': [
        {
          value: 'usesFlutterSvg',
          label: 'Flutter SVG',
          hint: 'Vector SVG rendering support [Popular]',
        },
        {
          value: 'usesImagePicker',
          label: 'Image Picker',
          hint: 'Pick images/videos from gallery or shoot new ones with camera',
        },
        {
          value: 'usesCamera',
          label: 'Camera',
          hint: 'camera package — full camera control + recording',
        },
        {
          value: 'usesFilePicker',
          label: 'File Picker',
          hint: 'Native file explorer to upload files/documents',
        },
        {
          value: 'usesFlutterNativeSplash',
          label: 'Flutter Native Splash',
          hint: 'Automatic native splash screens config',
        },
      ],
      'Essential Utilities': [
        {
          value: 'usesUrlLauncher',
          label: 'URL Launcher',
          hint: 'Trigger browser URLs, map locations, SMS, and telephone calls [Essential]',
        },
        {
          value: 'usesPathProvider',
          label: 'Path Provider',
          hint: 'Locate commonly used app folders on device filesystem [Essential]',
        },
        {
          value: 'usesSharePlus',
          label: 'Share Plus',
          hint: 'Trigger native system share panels for links, images & text',
        },
        {
          value: 'usesPermissionHandler',
          label: 'Permission Handler',
          hint: 'Query and request system hardware permissions dynamically [Essential]',
        },
        {
          value: 'usesDeviceInfoPlus',
          label: 'Device Info',
          hint: 'Access deep hardware model/OS version properties',
        },
        {
          value: 'usesGeolocator',
          label: 'Geolocator',
          hint: 'Acquire and track device GPS location updates',
        },
        {
          value: 'usesNotifications',
          label: 'Local Notifications',
          hint: 'flutter_local_notifications — schedule and display local alerts',
        },
        {
          value: 'usesAppVersionUpdate',
          label: 'App Version Update',
          hint: 'Verify and alert users when an app update is available',
        },
      ],
      'Advanced Features': [
        {
          value: 'usesFlutterHooks',
          label: 'Flutter Hooks',
          hint: 'React-style code structure for widget lifecycle states [Popular]',
        },
        {
          value: 'usesSkeletonizer',
          label: 'Skeletonizer',
          hint: 'Transform simple widgets into custom shimmering loader states [UI]',
        },
        {
          value: 'usesScreenutil',
          label: 'ScreenUtil',
          hint: 'Sizing & font scaling adapter for responsive layouts [Popular]',
        },
        {
          value: 'usesDotenv',
          label: 'Environment Config (.env)',
          hint: 'Pre-configure flutter_dotenv for configuration files support',
        },
        {
          value: 'usesLogger',
          label: 'Console Logger',
          hint: 'Logger package for clean output filters',
        },
        {
          value: 'useLocalization',
          label: 'Localization (intl)',
          hint: 'Integrate native multi-language supported structures',
        },
        {
          value: 'useMaterial3',
          label: 'Material 3 support',
          hint: 'Configure global ThemeData to support M3 guidelines',
        },
      ],
    },
    required: false,
    initialValues: [
      'usesIconsaxPlus',
      'usesDio',
      'usesSharedPreferences',
      'usesSecureStorage',
      'usesCachedNetworkImage',
      'usesFlutterSvg',
      'usesFlutterNativeSplash',
      'usesUrlLauncher',
      'usesPathProvider',
      'usesPermissionHandler',
      'usesDeviceInfoPlus',
      'usesAppVersionUpdate',
      'usesScreenutil',
      'usesDotenv',
      'usesLogger',
      'useLocalization',
      'useMaterial3',
    ],
  })
  checkCancel(selectedMiscResult)
  const selectedMisc = selectedMiscResult as string[]

  // ── Derive native feature flags ────────────────────────────────────────────
  const usesCamera       = selectedMisc.includes('usesCamera')
  const usesImagePicker  = selectedMisc.includes('usesImagePicker')
  const usesFilePicker   = selectedMisc.includes('usesFilePicker')
  const usesGeolocator   = selectedMisc.includes('usesGeolocator')
  const usesNotifications = selectedMisc.includes('usesNotifications')

  // Auto-enable permission_handler if any native feature requiring runtime permissions is selected
  const needsPermissionHandler =
    usesCamera || usesImagePicker || usesFilePicker || usesGeolocator || usesNotifications
  const usesPermissionHandler =
    selectedMisc.includes('usesPermissionHandler') || needsPermissionHandler

  const allSelected = [
    ...(selectedMisc.includes('usesIconsaxPlus') ? ['Iconsax Plus'] : []),
    ...(selectedMisc.includes('usesFlutterRemix') ? ['Flutter Remix'] : []),
    ...(selectedMisc.includes('usesHugeicons') ? ['Hugeicons'] : []),
    ...(selectedMisc.includes('usesDio') ? ['Dio'] : []),
    ...(selectedMisc.includes('usesHttp') ? ['HTTP'] : []),
    ...(selectedMisc.includes('usesCachedNetworkImage') ? ['Cached Image'] : []),
    ...(selectedMisc.includes('usesHive') ? ['Hive'] : []),
    ...(selectedMisc.includes('usesSharedPreferences') ? ['SharedPreferences'] : []),
    ...(selectedMisc.includes('usesSecureStorage') ? ['SecureStorage'] : []),
    ...(selectedMisc.includes('usesFlutterSvg') ? ['Flutter SVG'] : []),
    ...(usesImagePicker ? ['Image Picker'] : []),
    ...(usesCamera ? ['Camera'] : []),
    ...(usesFilePicker ? ['File Picker'] : []),
    ...(selectedMisc.includes('usesFlutterNativeSplash') ? ['Native Splash'] : []),
    ...(selectedMisc.includes('usesUrlLauncher') ? ['URL Launcher'] : []),
    ...(selectedMisc.includes('usesPathProvider') ? ['Path Provider'] : []),
    ...(selectedMisc.includes('usesSharePlus') ? ['Share Plus'] : []),
    ...(usesPermissionHandler ? ['Permission Handler'] : []),
    ...(selectedMisc.includes('usesDeviceInfoPlus') ? ['Device Info'] : []),
    ...(usesGeolocator ? ['Geolocator'] : []),
    ...(usesNotifications ? ['Local Notifications'] : []),
    ...(selectedMisc.includes('usesAppVersionUpdate') ? ['App Version Update'] : []),
    ...(selectedMisc.includes('usesFlutterHooks') ? ['Flutter Hooks'] : []),
    ...(selectedMisc.includes('usesSkeletonizer') ? ['Skeletonizer'] : []),
    ...(selectedMisc.includes('usesScreenutil') ? ['ScreenUtil'] : []),
    ...(selectedMisc.includes('usesDotenv') ? ['Dotenv'] : []),
    ...(selectedMisc.includes('usesLogger') ? ['Logger'] : []),
    ...(selectedMisc.includes('useLocalization') ? ['Localization'] : []),
    ...(selectedMisc.includes('useMaterial3') ? ['Material 3'] : []),
  ]

  // ── Resolve output directory ───────────────────────────────────────────────
  const outputDir = path.resolve(process.cwd(), name)

  // ── Summary ───────────────────────────────────────────────────────────────
  const nativeFeatures = [
    usesCamera && 'Camera',
    usesImagePicker && 'Image Picker',
    usesFilePicker && 'File Picker',
    usesGeolocator && 'Location',
    usesNotifications && 'Notifications',
  ].filter(Boolean).join(', ')

  note(
    [
      `${pc.bold('Project')}       ${pc.cyan(name)}`,
      `${pc.bold('Org')}           ${orgName as string || 'com.example'}`,
      `${pc.bold('Description')}   ${description as string || 'A new Flutter project'}`,
      ``,
      `${pc.bold('Architecture')} ${ARCHITECTURE_LABELS[architecture as Architecture]}`,
      `${pc.bold('State')}         ${STATE_LABELS[stateManager as StateManager]}`,
      `${pc.bold('Backend')}       ${BACKEND_LABELS[backend as Backend]}`,
      `${pc.bold('Navigation')}    ${NAVIGATION_LABELS[navigation as Navigation]}`,
      ``,
      `${pc.bold('Theme')}         ${THEME_LABELS[themeMode as ThemeMode]}`,
      `${pc.bold('Color')}         ${primaryColor as string || '#027DFD'}`,
      `${pc.bold('Utilities')}     ${allSelected.length > 0 ? allSelected.join(', ') : 'none'}`,
      `${pc.bold('Native')}        ${nativeFeatures || 'None'}`,
      ``,
      `${pc.bold('Output')}        ${pc.dim(outputDir)}`,
    ].join('\n'),
    'Your FlutterInit Configuration',
  )

  const confirmed = await confirm({
    message: 'Generate this project?',
    initialValue: true,
  })

  if (isCancel(confirmed) || !confirmed) {
    cancel('Generation cancelled. Run create-flutterinit again to start over.')
    process.exit(0)
  }

  // ── Build and return config ────────────────────────────────────────────────
  return {
    projectName: name,
    orgName: (orgName as string) || 'com.example',
    description: (description as string) || 'A new Flutter project',
    architecture: architecture as Architecture,
    stateManager: stateManager as StateManager,
    backend: backend as Backend,
    navigation: navigation as Navigation,
    themeMode: themeMode as ThemeMode,
    primaryColor: (primaryColor as string) || '#027DFD',
    outputDir,

    // Icons
    usesIconsaxPlus: selectedMisc.includes('usesIconsaxPlus'),
    usesFlutterRemix: selectedMisc.includes('usesFlutterRemix'),
    usesHugeicons: selectedMisc.includes('usesHugeicons'),

    // Networking & Storage
    usesDio: selectedMisc.includes('usesDio'),
    usesHttp: selectedMisc.includes('usesHttp'),
    usesCachedNetworkImage: selectedMisc.includes('usesCachedNetworkImage'),
    usesHive: selectedMisc.includes('usesHive'),
    usesSharedPreferences: selectedMisc.includes('usesSharedPreferences'),
    usesSecureStorage: selectedMisc.includes('usesSecureStorage'),

    // Media & Assets
    usesFlutterSvg: selectedMisc.includes('usesFlutterSvg'),
    usesImagePicker,
    usesCamera,
    usesFilePicker,
    usesFlutterNativeSplash: selectedMisc.includes('usesFlutterNativeSplash'),

    // Essential Utilities
    usesUrlLauncher: selectedMisc.includes('usesUrlLauncher'),
    usesPathProvider: selectedMisc.includes('usesPathProvider'),
    usesSharePlus: selectedMisc.includes('usesSharePlus'),
    usesPermissionHandler,  // auto-derived from native features
    usesDeviceInfoPlus: selectedMisc.includes('usesDeviceInfoPlus'),
    usesGeolocator,
    usesNotifications,
    usesAppVersionUpdate: selectedMisc.includes('usesAppVersionUpdate'),

    // Advanced Features
    usesFlutterHooks: selectedMisc.includes('usesFlutterHooks'),
    usesSkeletonizer: selectedMisc.includes('usesSkeletonizer'),
    usesScreenutil: selectedMisc.includes('usesScreenutil'),
    usesDotenv: selectedMisc.includes('usesDotenv'),
    usesLogger: selectedMisc.includes('usesLogger'),
    useLocalization: selectedMisc.includes('useLocalization'),
    useMaterial3: selectedMisc.includes('useMaterial3'),
  }
}
