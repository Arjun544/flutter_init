# Configuration Reference

A complete reference of all available options, flags, and values you can configure in FlutterInit before generation.

## Core Options

| Option | Values | Description | Default |
|--------|--------|-------------|---------|
| `appName` | `string` | The display name of your Flutter app. | `Flutter Starter` |
| `packageId` | `string` | The bundled identifier (e.g. `com.example.app`). | *derived* |
| `stateManagement` | `provider`, `riverpod`, `bloc`, `getx`, `mobx`, `none` | State management library for injected controllers. | `riverpod` |
| `navigation` | `imperative`, `go_router`, `getx`, `auto_route` | Strategy used for routing and navigation flow. | `go_router` |
| `architecture` | `mvc`, `mvvm`, `clean`, `feature-first`, `layer-first` | Parent folder structure and logic segregation pattern. | `feature-first` |

## Theme & UI

| Option | Values | Description | Default |
|--------|--------|-------------|---------|
| `theme.preset` | `material3`, `cupertino`, `custom` | Base design language standard. | `material3` |
| `theme.primaryColor` | `string` (Hex) | Primary accent color given to styling widgets. | `#6750A4` |
| `theme.darkMode.enabled` | `boolean` | Generates a parallel dark mode theme map. | `true` |
| `theme.darkMode.system` | `boolean` | Tells the app to match user's device system setting. | `true` |

## Icons

You can select a primary icon pack to be wrapped by the default components.

| Option | Values | Description |
|--------|--------|-------------|
| `icons.default` | `boolean` | Uses standard Material/Cupertino Icons. |
| `icons.iconsax_plus` | `boolean` | Integrates `iconsax_plus`. |
| `icons.flutter_remix` | `boolean` | Integrates `flutter_remix`. |
| `icons.hugeicons` | `boolean` | Integrates `hugeicons`. |

## Backend Providers

You can optionally bind your app to a provider scaffold.

| Provider | Sub-Options (boolean combinations) | Description |
|----------|-----------------------------------|-------------|
| `none` | n/a | Mock services (default state). |
| `firebase`| `authEmail`, `authGoogle`, `authPhone`, `firestore`, `realtimeDb`, `storage`, `analytics`, `crashlytics` | Configures `firebase_core` and corresponding plugins. |
| `supabase`| `auth`, `database`, `edgeFunctions` | Configures `supabase_flutter` with client constants. |
| `appwrite`| `auth`, `database`, `storage` | Installs `appwrite` SDK clients. |
| `custom`| `baseUrl` (string) | Bootstraps networking classes targeted at a given URL (Local/Remote). |

## Localization

| Option | Values | Description | Default |
|--------|--------|-------------|---------|
| `localization.enabled` | `boolean` | Sets up `easy_localization`. | `true` |
| `localization.supportedLocales` | `array<string>` | Locales to support initially (e.g. `en`, `es`, `zh`). | `["en", "es"]` |

## Misc Utility Flags

These boolean flags enable wrapper injections, dependencies, and functional code chunks.

- **Networking:** `usesDio`, `usesHttp`, `usesCachedNetworkImage`
- **Storage:** `usesHive`, `usesSharedPreferences`, `usesSecureStorage`
- **Utilities:** `usesScreenutil`, `usesFlutterNativeSplash`, `usesFlutterSvg`, `usesSkeletonizer`, `usesDotenv`, `usesLogger`, `usesUrlLauncher`, `usesPathProvider`, `usesSharePlus`, `usesPermissionHandler`
- **Hooks & Media:** `usesFlutterHooks`, `usesImagePicker`, `usesFilePicker`
- **Device Features:** `usesDeviceInfoPlus`, `usesAppVersionUpdate`, `usesGeolocator`

## Dependencies & Conflicts

Some inputs strictly depend on others to successfully scaffold:
- **`custom` Backend**: Using a Custom Backend requires that either `usesDio` or `usesHttp` flag is activated. The generator validation process will block you if a networking package isn't enabled to send network requests.

## Re-Generation

Configuration choices change thousands of lines across architecture overlays, `.hbs` logic branches, and native Android/iOS project settings (like Info.plist permission macros).

If you want to swap large infrastructural pieces (e.g. changing from `riverpod` to `getx` or altering architecture styles), **do not attempt to manually switch configurations in the codebase after download.** Due to how tightly integrated barrel exports and wrappers are, it's safer and faster to return to [flutterinit.com](https://flutterinit.com), tweak your selections via the dashboard, and generate a new ZIP.
