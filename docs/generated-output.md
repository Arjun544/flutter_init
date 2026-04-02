# Generated Output Reference

This guide provides an accurate breakdown of the file and folder structure produced by FlutterInit.

## Application Structure

FlutterInit follows a "src-first" encapsulation model. All internal logic, implementation details, and features live inside `lib/src/` to separate private implementation from public API exports.

```text
my_app/
├── android/            # Native Android project and configurations
├── ios/                # Native iOS project, Podfile, and Runner icons
├── web/                # (Optional) Web-build entry point
├── assets/             # Images, JSON translations, and fonts
├── lib/
│   ├── main.dart       # App initialization entry point
│   └── src/            # Core application domain (Encapsulated)
│       ├── app.dart    # Root App widget (MaterialApp/CupertinoApp)
│       ├── config/     # Global app configuration and lifecycle logic
│       ├── features/   # Feature-grouped domains (screens, logic, data)
│       ├── imports/    # Centralized "Barrel File" import registries
│       ├── routing/    # Route definitions, guards, and navigator keys
│       ├── services/   # Abstracted API and third-party SDK connections
│       ├── shared/     # Common widgets, wrappers, hooks, and extensions
│       ├── theme/      # Design system (spacing, colors, borders, shadows)
│       └── utils/      # General utilities, logging, and error handling
├── test/               # Unit and Widget tests
├── pubspec.yaml        # Flutter dependency management
└── SETUP.md            # Post-generation setup instructions
```

## Key File Breakdown

- **`lib/main.dart`**: The designated root of your executable. It handles initial asynchronous tasks (e.g., Environment loading, Native Splash preservation, Localization binding) before invoking the `runApp()` method.
- **`lib/src/app.dart`**: Defines your root visual wrapper. It is responsible for injecting global state providers, setting up the Router delegate, and applying system-wide UI wrappers like Skeletonization or Session monitoring.
- **`lib/src/shared/`**: Contains components that are truly global.
  - **`widgets/`**: Reusable standalone UI components.
  - **`wrappers/`**: Structural widgets that provide context (e.g., `ScreenUtilWrapper`).
  - **`hooks/`**: Custom Flutter Hooks (enabled if `usesFlutterHooks` is true).
- **`lib/src/imports/`**: Houses "Barrel Files" that act as singular entry points for entire modules.
  - `imports.dart`: The primary import you'll use in feature files.
  - `core_imports.dart`: Internal project exports and Flutter SDK.
  - `packages_imports.dart`: Selective exports of third-party dependencies.
- **`lib/src/theme/`**: Centralizes your design tokens. Instead of hardcoding values, you reference `AppSpacing`, `AppBorders`, and `AppColors` derived from here.

## Adaptive Architectures

While the `lib/src/` core remains consistent for internal tools, your selected **Architecture** flag determines how your business logic and UI are organized:

- **Feature-First / Clean**: Logic is segregated into `lib/src/features/` with sub-folders for `auth`, `home`, and domain-specific entities.
- **MVC / MVVM**: Global `lib/src/controllers/`, `lib/src/models/`, and `lib/src/views/` (or `ui/`) directories are created to house logic according to the selected pattern.
- **Layer-First**: Divides implementation into `lib/src/data/`, `lib/src/domain/`, and `lib/src/presentation/` layers.

## Modifying the Codebase

- **Green Light (Edit Freely)**: Everything inside `lib/src/features` (or your architecture's UI folder). This is where you build your application's unique value.
- **Yellow Light (Edit with Care)**: `lib/src/theme/`. These define your brand's look and feel, but changing them will affect the entire application UI immediately.
- **Red Light (Avoid Editing)**: `lib/src/imports/`. These are automatically managed by the generator. Adding manual exports is possible but requires maintaining the existing pattern to avoid broken dependencies.

Refer to the [Configuration Reference](configuration.md) for more details on how toggling flags affects these specific structural outputs.
