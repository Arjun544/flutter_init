# Architecture Overview

This document describes the internal system design of FlutterInit, explaining how a user's selection on the dashboard travels through the generator to produce a production-ready Flutter project.

## System Overview

FlutterInit follows a layered pipeline where configuration data is transformed into a functional filesystem.

```text
+-----------------------+      (Next.js Dashboard)
|   Web UI (Wizard)     | 
+-----------+-----------+
            |
            v
+-----------+-----------+      (app/lib/config/schema.ts)
|     Config Schema     | 
+-----------+-----------+
            |
            v
+-----------+-----------+      (app/lib/generator/index.ts)
|    Generator Logic    | 
+-----------+-----------+
            |
            v
+-----------+-----------+      (templates/flutter/)
| Handlebars Templates  | 
+-----------+-----------+
            |
            v
+-----------+-----------+      (ZIP / dev_out/)
| Generated Dart Output | 
+-----------------------+
```

## Layers

### 1. Web UI (Dashboard)
The front-end wizard built with Next.js allows users to visually configure their project. It collects user inputs and validates them against the shared Zod schema.

### 2. Config Schema (`app/lib/config/schema.ts`)
The single source of truth for all project options. It defines the `ScaffoldConfig` interface using Zod, ensuring that only valid combinations of flags (like `usesRiverpod` or `navigation: 'go_router'`) reach the generator.

### 3. Generator Logic (`app/lib/generator/`)
The engine of the system. 
- `index.ts`: Orchestrates the generation by resolving which "Architecture Overlays" should be applied based on the config.
- `handlebars.ts`: Configures the Handlebars environment with custom helpers like `res` (for ScreenUtil scaling) and case conversion utilities.
- It performs a **Layered Merge**: it starts with the `base/` directory and overlays specific architecture, state management, and plugin folders on top.

### 4. Handlebars Templates (`templates/flutter/`)
The raw material of the generated app.
- **`base/`**: The fundamental Flutter project structure shared by everyone.
- **`overlays/`**: Conditional logic blocks (State Management, Auth providers, etc.) that replace or add files to the base structure.
- **`partials/`**: Reusable code snippets (e.g., standard login form UI) included via `{{> partial_name }}`.

### 5. Output (`dev_out/` or ZIP)
The final product. During production, the generator produces a `JSZip` buffer for the user to download. During development, the `scripts/template-dev.ts` script extracts this into `dev_out/` for real-time debugging.

## Flag Flow: `usesRiverpod` Example

To understand the end-to-end flow, consider toggling the Riverpod state management flag:

1. **Dashboard**: User selects "Riverpod" in the State Management step.
2. **Schema**: The `stateManagement` field in `ScaffoldConfig` is set to `'riverpod'`.
3. **Generator**: `buildTemplateContext()` sees this and sets `flags.isRiverpod = true`.
4. **Overlays**: `resolveOverlayDirs()` adds `templates/flutter/overlays/state/riverpod` to the merge list.
5. **Templates**: 
   - `pubspec.yaml.hbs` adds `flutter_riverpod` to dependencies.
   - `main.dart.hbs` wraps the `App` in a `ProviderScope`.
   - Architectural blocks use `ConsumerWidget` instead of `StatelessWidget`.
6. **Output**: The generated project contains a fully reactive Riverpod setup.

## Key Files & Roles

| File | Role |
| :--- | :--- |
| `app/lib/config/schema.ts` | Defines every available option and its default value. |
| `app/lib/generator/index.ts` | The main `generateFlutterScaffold` function. |
| `app/lib/generator/handlebars.ts` | Custom logic for templates (e.g. `isRiverpod` checks). |
| `templates/flutter/base/` | The "skeleton" of the generated app. |
| `scripts/template-dev.ts` | The bridge between template changes and a running `dev_out` project. |

## Adding a New Feature

When adding a new architectural pattern or plugin support:
1. **Define the Flag**: Add the new boolean flag to `miscSchema` in `schema.ts`.
2. **Update Context**: Wire the flag in `buildTemplateContext()` inside `generator/index.ts`.
3. **Create Overlay**: Add a new folder in `templates/flutter/overlays/` to house the specific files.
4. **Register Overlay**: Add the new folder path to `candidates` in `resolveOverlayDirs()`.
5. **Update Barrels**: Ensure any new services/widgets are exported in `core_imports.dart.hbs` or `services.dart.hbs`.

---

**Next Step:** See [Template Development Guide](template-development.md) to start building.
