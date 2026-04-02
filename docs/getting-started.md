# Getting Started with FlutterInit

FlutterInit is an open-source scaffolding tool that generates production-ready Flutter projects tailored to your architecture and tooling preferences. It exists to eliminate repetitive setup tasks by providing pre-wired boilerplate for routing, state management, and base system configurations right out of the box.

## Prerequisites

- Flutter SDK installed.

## Step-by-Step Guide

1. Open [flutterinit.com](https://flutterinit.com).
2. Configure your project options (e.g., state management, routing, theme).
3. Click **Generate**.
4. Download the `.zip` archive.
5. Unzip the archive into your development directory.
6. Install dependencies:
   ```bash
   flutter pub get
   ```
7. Run the application:
   ```bash
   flutter run
   ```

## Post-Generation Structure

After extracting the archive, you'll find a structured Flutter application instead of the default counter app. The core logic and flow are built on a layered setup that adapts to your configuration choices:

1. **`lib/main.dart`**: The application's entry point. Initializes critical core services like `WidgetsFlutterBinding`, splash screens, localization, environment variables, and flavor configurations before booting the app.
2. **`lib/src/app.dart`**: Houses your root `App` widget. It directly wires up your chosen routing package (GoRouter, AutoRoute, or GetX) into the `MaterialApp` or `CupertinoApp` builder. It also injects global widgets like `SkeletonWrapper` and `SessionListenerWrapper`.
3. **Adaptive Architecture**: The remainder of the folder structure maps dynamically to your selected architecture standard (`Layer-First`, `Feature-First`, `Clean`, `MVC`, or `MVVM`). This dictates where logic controllers, UI views, data models, and domain layers live.
4. **Third-Party Integrations**: Dependencies selected through the dashboard (networking, storage, media, state management) are naturally integrated. Their respective services and hooks are pre-configured through organized module extensions.

Code references utilize generated "barrel file" registries (e.g. `imports.dart`, `services.dart`) ensuring clean imports across your growing codebase.

## Next Steps

- **Read your generated `SETUP.md`**: Found at the root of your extracted project, this generated document contains the exact steps to configure your selected backend (e.g., Firebase, Supabase), native app permissions, and environment variables.
- [Configuration Options](configuration.md) *(coming soon)*
