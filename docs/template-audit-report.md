# FlutterInit Template Production Audit

**Audit date:** 2026-08-30  
**Scope:** Web generator, CLI generator, Flutter templates, Handlebars context, option matrix, generated documentation, and validation pipeline  
**SDK used for generated-project checks:** Flutter 3.41.9, Dart 3.11.5

## Executive summary

FlutterInit's template system has a strong compositional idea and its default/all-features web samples can resolve dependencies and analyze cleanly after required code generation. It is not yet safe to describe every generated project as production-ready.

The highest-risk defects are option-gating and pipeline inconsistencies:

- Disabling dotenv, selecting HTTP, or selecting Firebase without email auth can generate code that does not compile.
- The web ZIP is not a complete Flutter application because platform scaffolding is intentionally absent.
- The CLI applies only base, architecture, backend, and navigation layers; optional service files are not copied even when the base template exports them.
- The critical Dart validation suite does not run `build_runner`, so 11 of 25 critical combinations fail on missing AutoRoute or MobX generated files.
- The CLI context does not provide the nested `theme` object expected by the templates, producing an invalid native-splash color and incorrect theme behavior.

These are trust-breaking issues for a scaffolding product. A generated project should pass dependency resolution, code generation, static analysis, and a startup/widget smoke test for every supported configuration before release.

## Audit method and limitations

The review traced:

- Configuration definitions in `app/lib/config/schema.ts` and `cli/src/config.ts`.
- Derived Handlebars flags in both generator contexts.
- Overlay selection, conditional filenames, barrel files, pubspec dependencies, native configuration, and generated setup documentation.
- The authoritative `templates/flutter` tree versus the packaged `cli/templates` copy.
- The 375 primary web combinations and the 25 critical combinations used by the test suite.

Generated-project checks included dependency resolution, `dart analyze --fatal-infos`, `dart run build_runner build --delete-conflicting-outputs` where applicable, and `flutter test` on representative projects. The Flutter MCP server successfully reported Windows, Chrome, and Edge devices. Its project tools could not analyze the generated projects because the server rejected Windows workspace roots with `Uri d:/flutter_init must have scheme 'file:'`; shell fallback was used for Dart/Flutter validation after recording that limitation.

The report distinguishes confirmed failures from static-review risks. It does not claim that an option is fully functional merely because its package resolves.

## Severity scale

- **P0 — Release blocker:** A supported choice can produce a project that cannot compile, start, or be generated correctly.
- **P1 — High:** A major path, platform, backend option, or quality gate is materially incomplete or misleading.
- **P2 — Medium:** The output works in common cases but is inconsistent, fragile, inefficient, or below production-quality conventions.
- **P3 — Low:** Cleanup, documentation, or maintainability issue with limited immediate user impact.

## Confirmed validation results

### Representative generated projects

- `feature-first | riverpod | none | go_router` with default misc options:
  - `flutter pub get`: passed.
  - `dart analyze --fatal-infos`: passed.
  - `flutter test`: passed.
- `layer-first | none | none | imperative` with bare-minimum misc options:
  - `flutter pub get`: passed.
  - `dart analyze --fatal-infos`: failed with four unused imports in auth and home screens.
  - `flutter test`: hung during `App should build`; the process was stopped after more than eight minutes.
- `clean | bloc | firebase | auto_route` with all misc options enabled:
  - `flutter pub get`: passed.
  - `build_runner`: passed and wrote six outputs.
  - `dart analyze --fatal-infos`: passed.
  - `flutter test`: passed.

### Targeted failures

- `usesDotenv: false`: six analyzer diagnostics, including an unresolved `dotenv` identifier and missing `flutter_dotenv` URI.
- HTTP enabled: one analyzer error because `AppLogger.debug` does not exist.
- Firebase with Firestore enabled and all auth options disabled: four analyzer errors because `firebase_auth` is imported and referenced although it is not a dependency.

### Existing test suite

The root test run completed with **3,384 passing tests, 11 failing tests, and 1 test error** across 3,395 tests. The 11 Dart failures are concentrated in AutoRoute and MobX combinations because the test does not run code generation.

The CLI test run completed with **49 passing tests and 1 failing test/error**. `cli/tests/prompts.test.ts` contains binary NUL bytes at line 1 and cannot be parsed by Bun.

## P0 — Release blockers

### P0-1. Dotenv is not actually optional

**Affected paths:** Web and CLI generators.

**Evidence:**

- [`templates/flutter/base/lib/main.dart.hbs`](../templates/flutter/base/lib/main.dart.hbs):20 always calls `dotenv.load`.
- [`templates/flutter/base/lib/src/config/app_config.dart.hbs`](../templates/flutter/base/lib/src/config/app_config.dart.hbs):23 always imports dotenv, and lines 60–110 use it.
- [`templates/flutter/base/lib/src/imports/packages_imports.dart.hbs`](../templates/flutter/base/lib/src/imports/packages_imports.dart.hbs):69 always exports dotenv.
- `pubspec.yaml.hbs` adds `flutter_dotenv` and `.env` only when `flags.usesDotenv` is true.
- No `.env` or `.env.example` file is emitted by the template tree.

**Reproduction:** The generated `usesDotenv: false` project failed analysis with six diagnostics. The default project also has no `.env` asset even though startup unconditionally loads it.

**Impact:** A user who disables dotenv receives uncompilable code. A user who leaves it enabled can hit a startup asset-loading failure because no environment file is generated.

**Remediation:** Gate every dotenv import, export, load, and lookup on one derived flag. Emit a safe `.env.example`; never treat a bundled Flutter asset as a secret. Provide a typed configuration abstraction with explicit required-value validation.

### P0-2. HTTP overlay calls an undefined logger method

**Affected path:** [`templates/flutter/overlays/networking/http/lib/src/services/(usesHttp)@http_service.dart.hbs`](../templates/flutter/overlays/networking/http/lib/src/services/(usesHttp)@http_service.dart.hbs):77.

**Evidence:** The template calls `AppLogger.debug`, while [`templates/flutter/base/lib/src/utils/logger.dart.hbs`](../templates/flutter/base/lib/src/utils/logger.dart.hbs):4–31 defines only `info`, `success`, `warning`, `error`, and `_log`.

**Reproduction:** The generated HTTP project failed analysis with `The method 'debug' isn't defined for the type 'AppLogger'`.

**Impact:** Any configuration using the HTTP client fails to compile.

**Remediation:** Either add a tested debug API or use an existing logger method. Add a matrix assertion that renders and analyzes the HTTP-only path.

### P0-3. Firebase auth imports do not follow Firebase auth selection

**Affected paths:** [`templates/flutter/base/lib/src/config/app_config.dart.hbs`](../templates/flutter/base/lib/src/config/app_config.dart.hbs):10–15 and 40–50; [`templates/flutter/base/pubspec.yaml.hbs`](../templates/flutter/base/pubspec.yaml.hbs):60–80; [`templates/flutter/overlays/backend/firebase/lib/src/services/(usesFirebaseAuth)@auth_service.dart.hbs`](../templates/flutter/overlays/backend/firebase/lib/src/services/(usesFirebaseAuth)@auth_service.dart.hbs).

**Evidence:**

- `app_config.dart.hbs` imports `firebase_auth` and declares `FirebaseAuth` whenever the provider is Firebase.
- `pubspec.yaml.hbs` adds `firebase_auth` only when `backend.options.authEmail` is true.
- The auth service is emitted when any of email, Google, or phone auth is selected.

**Reproduction:** Firebase with Firestore enabled and `authEmail`, `authGoogle`, and `authPhone` disabled failed analysis because `firebase_auth` was not a dependency. Google-only and phone-only selections have the same gating mismatch.

**Impact:** Non-email Firebase auth choices and Firebase data-only choices can produce uncompilable projects.

**Remediation:** Derive one `usesFirebaseAuth` value and use it consistently for dependency, import, service, and API emission. Implement or remove Google/phone choices; currently the generated auth service only implements email/password methods.

## P1 — High-priority gaps

### P1-1. CLI generation omits optional overlays

**Affected path:** [`cli/src/generator.ts`](../cli/src/generator.ts):214–281.

**Evidence:** The CLI applies base, architecture, backend, and navigation directories only. It does not apply networking, storage, utilities, media, device, localization, flavors, dotenv, or cached-image overlays.

The base CLI barrel [`cli/templates/base/lib/src/services/services.dart.hbs`](../cli/templates/base/lib/src/services/services.dart.hbs):3–43 conditionally exports files such as `dio_service.dart`, `storage_service.dart`, `secure_storage_service.dart`, and `version_update_service.dart`. Those files live in skipped overlay directories. The base widgets barrel similarly depends on the cached-image overlay.

**Impact:** Default CLI selections can generate exports for files that were never copied. The web and CLI products produce materially different projects for the same conceptual configuration.

**Remediation:** Centralize overlay resolution and use the same option-to-overlay map in both generators. Add a CLI integration test that generates the default and all-features configurations and verifies every export target exists.

### P1-2. Web ZIP output is not a complete Flutter project

**Affected paths:** [`app/lib/generator/index.ts`](../app/lib/generator/index.ts):85–140 and 315–324.

**Evidence:** The web generator composes templates directly and explicitly denies `android`, `ios`, `web`, `windows`, `macos`, and `linux` directories. It does not run `flutter create`.

**Impact:** The ZIP lacks platform scaffolding while [`templates/flutter/base/README.md.hbs`](../templates/flutter/base/README.md.hbs):12–18 tells users to run `flutter run`. Native features, platform permissions, and direct web execution cannot work without an additional manual `flutter create .` step.

**Remediation:** Choose and document one contract: either generate a complete project by starting from `flutter create`, or explicitly label the ZIP as a Dart source overlay and provide a reliable installation command. Add checks for the selected target platforms.

### P1-3. Firebase initialization and setup documentation disagree

**Affected paths:** [`templates/flutter/base/lib/src/config/app_config.dart.hbs`](../templates/flutter/base/lib/src/config/app_config.dart.hbs):55–58 and [`templates/flutter/base/SETUP.md.hbs`](../templates/flutter/base/SETUP.md.hbs):200–212.

**Evidence:** Setup says `firebase_options.dart` is generated and already wired. The template only calls `Firebase.initializeApp()` and emits no `firebase_options.dart` or import.

**Impact:** Firebase web and many mobile configurations require manual repair, and the generated documentation gives a false sense that configuration is complete.

**Remediation:** Either generate/wire `DefaultFirebaseOptions.currentPlatform` after FlutterFire configuration, or state precisely that the user must add the file and modify initialization. Do not claim an integration is wired when it is not.

### P1-4. Code-generation validation is incomplete

**Affected paths:** [`tests/e2e/dart-validation.spec.ts`](../tests/e2e/dart-validation.spec.ts):63–91 and [`docs/testing.md`](testing.md):100–115.

**Evidence:** The test runs `dart pub get` and then `dart analyze`, but never invokes `build_runner`. The documentation says the validation pipeline runs code generation.

**Reproduction:** 11 of 25 critical combinations failed. AutoRoute combinations reported missing `app_router.gr.dart` and route classes; MobX combinations reported missing `.g.dart` files. The all-features AutoRoute sample passed after manually running build_runner.

**Impact:** CI results are noisy and the declared production gate is not measuring the generated project users actually receive after following setup instructions.

**Remediation:** Run code generation based on a derived `requiresCodeGeneration` flag before analysis, then analyze both generated and source code. Keep a separate check that verifies the project is intentionally usable before generation if that is the product contract.

### P1-5. CLI template context emits invalid theme output

**Affected paths:** [`cli/src/templates.ts`](../cli/src/templates.ts):154–264 and [`cli/templates/base/flutter_native_splash.yaml.hbs`](../cli/templates/base/flutter_native_splash.yaml.hbs):1–8.

**Evidence:** CLI config stores `primaryColor` and `themeMode` at the top level but the shared templates read `theme.primaryColor`, `theme.preset`, and `theme.darkMode.system`. The CLI context never creates `theme`.

**Reproduction:** Rendering the CLI splash template produced `color: "#"` and `icon_background_color: "#"`. The CLI `both` theme mode also renders with an absent `theme.darkMode.system` value, so the shared app template cannot preserve system brightness semantics.

**Impact:** CLI projects have invalid splash configuration and diverge from the selected theme.

**Remediation:** Use a shared normalized context shape or separate CLI templates. Add snapshot assertions for every theme mode and the splash config.

### P1-6. Backend feature selections are mostly dependency-only

**Affected paths:** [`app/lib/config/schema.ts`](../app/lib/config/schema.ts):144–176; [`templates/flutter/base/pubspec.yaml.hbs`](../templates/flutter/base/pubspec.yaml.hbs):59–90; [`templates/flutter/base/lib/src/config/app_config.dart.hbs`](../templates/flutter/base/lib/src/config/app_config.dart.hbs):40–71.

**Evidence:** Firebase analytics, Crashlytics, Realtime Database, and Storage options add packages or getters but do not provide corresponding initialization/service flows. Supabase `edgeFunctions` has no generated implementation. Appwrite database and storage options have no generated service implementation.

**Impact:** Users can select features that appear configured but receive no usable API surface or initialization. This is an option-consistency failure rather than merely missing convenience code.

**Remediation:** Define the contract for each backend option. Generate typed services and initialization where supported, or remove/defer the option and make the UI say “dependency only” or “manual setup required.”

### P1-7. Mock and custom authentication incorrectly require network access

**Affected paths:** [`templates/flutter/base/lib/src/services/auth_service.dart.hbs`](../templates/flutter/base/lib/src/services/auth_service.dart.hbs):16–58 and [`templates/flutter/overlays/backend/custom/lib/src/services/auth_service.dart.hbs`](../templates/flutter/overlays/backend/custom/lib/src/services/auth_service.dart.hbs):51–65, 98–108, 121–137.

**Evidence:** Mock auth methods call `runTask(..., requiresNetwork: true)`. Custom-backend mock branches do the same even though no network request occurs.

**Impact:** Offline/demo projects can reject local login and signup before executing their mock implementation. This contradicts the “none/offline” backend choice.

**Remediation:** Remove the network requirement from local branches. Separate mock services from production auth contracts so mock behavior cannot accidentally ship as the default backend implementation.

### P1-8. Custom backend validation differs between web and CLI

**Affected paths:** [`app/lib/config/schema.ts`](../app/lib/config/schema.ts):261–269 and [`cli/src/prompts.ts`](../cli/src/prompts.ts):274–455.

**Evidence:** The web schema rejects custom backend configurations without Dio or HTTP. The CLI permits the user to select Custom Backend while disabling both, causing the custom service to fall into its mock branch.

**Impact:** The same product choice can be valid in one generator and silently change behavior in the other.

**Remediation:** Share validation rules or normalize CLI output through the same schema before generation.

### P1-9. Optional native services are not web-compatible

**Affected paths:**

- [`templates/flutter/overlays/media/lib/src/services/(usesImagePicker,usesFilePicker)@media_service.dart.hbs`](../templates/flutter/overlays/media/lib/src/services/(usesImagePicker,usesFilePicker)@media_service.dart.hbs):1 and 37–145.
- [`templates/flutter/overlays/utilities/path_provider/lib/src/services/(usesPathProvider)@path_service.dart.hbs`](../templates/flutter/overlays/utilities/path_provider/lib/src/services/(usesPathProvider)@path_service.dart.hbs):1.
- [`templates/flutter/overlays/utilities/url_launcher/lib/src/services/(usesUrlLauncher)@url_launcher_service.dart.hbs`](../templates/flutter/overlays/utilities/url_launcher/lib/src/services/(usesUrlLauncher)@url_launcher_service.dart.hbs):1 and 31.
- [`templates/flutter/overlays/device/device_info/lib/src/services/(usesDeviceInfoPlus)@device_info_service.dart.hbs`](../templates/flutter/overlays/device/device_info/lib/src/services/(usesDeviceInfoPlus)@device_info_service.dart.hbs):1 and 15–49.

**Evidence:** These services import `dart:io` or use `Platform`. Several packages support web, but these service implementations do not.

**Impact:** A user selecting one of these options cannot target web without a compile failure.

**Remediation:** Provide conditional implementations using platform interfaces, `kIsWeb`, or package-supported web APIs. Test each optional service on Chrome and Windows as well as a native target.

### P1-10. Native permission configuration is stale and internally inconsistent

**Affected paths:** [`cli/src/native.ts`](../cli/src/native.ts):105–140, 203–242 and [`templates/flutter/overlays/media/lib/src/services/(usesImagePicker,usesFilePicker)@media_service.dart.hbs`](../templates/flutter/overlays/media/lib/src/services/(usesImagePicker,usesFilePicker)@media_service.dart.hbs):29–43, 115–131.

**Evidence:** The CLI adds `READ_EXTERNAL_STORAGE` and `WRITE_EXTERNAL_STORAGE` for camera/image selection while the template requests `Permission.photos`. The code comments acknowledge Android 13 media-specific behavior but do not implement it. The iOS file-picker path adds photo-library entries despite its own comment saying document picking does not require them.

**Impact:** Native permissions can be over-requested, missing, or rejected by current platform policy. The generated setup instructions and runtime requests do not describe one consistent permission model.

**Remediation:** Maintain a platform/version permission matrix, generate only required declarations, and test Android API 32/33+ and current iOS targets. Keep package-specific Podfile macro configuration aligned with runtime calls.

### P1-11. Native platform trees are ignored by the CLI package

**Affected path:** [`cli/templates/.gitignore`](../cli/templates/.gitignore):7–13.

**Evidence:** The CLI starts with `flutter create` and then ignores `android`, `ios`, `web`, and desktop directories.

**Impact:** A normal Git workflow omits the native files that contain the generated permissions and platform build configuration. A production project can appear to have native support locally while those changes are absent from source control.

**Remediation:** Do not ignore generated platform directories. Ignore build artifacts inside them instead.

### P1-12. Appwrite enables self-signed certificates by default

**Affected path:** [`templates/flutter/base/lib/src/config/app_config.dart.hbs`](../templates/flutter/base/lib/src/config/app_config.dart.hbs):66–71.

**Evidence:** The Appwrite client always calls `setSelfSigned(status: true)` and uses placeholder endpoint/project defaults.

**Impact:** A production app can be configured to trust self-signed certificates, weakening transport security. Placeholder values can also survive into a release build.

**Remediation:** Default self-signed mode to false and expose it only as an explicit local-development setting. Fail fast when required endpoint/project configuration is missing.

### P1-13. CLI does not enforce the validation promised by its generator header

**Affected path:** [`cli/src/generator.ts`](../cli/src/generator.ts):1–4 and 294–315.

**Evidence:** The header promises `pub get` and `dart analyze`, but generation ends after telemetry and instructions. Backend and navigation overlay errors are downgraded to warnings and generation continues.

**Impact:** The CLI can announce a ready project without checking whether it resolves or analyzes. Failures in optional paths are hidden until the user opens the project.

**Remediation:** Run the promised checks, make compile-critical failures fatal, and report a clear post-generation validation result. Use explicit manual-setup warnings only for services that are intentionally incomplete.

### P1-14. Template synchronization is destructive and can erase CLI-only behavior

**Affected path:** [`scripts/sync-templates.sh`](../scripts/sync-templates.sh):20–25.

**Evidence:** The script deletes `cli/templates` and copies `templates/flutter`. The current CLI copy contains camera/notification dependencies and native documentation that are not present in the authoritative web source tree.

**Impact:** A publish-time sync can silently remove CLI-specific functionality, while a non-synced package can drift from the dashboard generator.

**Remediation:** Make one source of truth. If platform-specific differences are required, model them as explicit overlays and test the synchronization output rather than deleting the destination wholesale.

## P2 — Medium-quality and maintainability gaps

### P2-1. Bare state-management path emits unused imports

**Affected paths:** [`templates/flutter/partials/features/auth/login_screen.hbs`](../templates/flutter/partials/features/auth/login_screen.hbs), `signup_screen.hbs`, `forgot_password_screen.hbs`, and `home_page.hbs`.

**Evidence:** The bare `none | imperative` project reported unused `packages_imports.dart` imports in four generated screens. The import is useful for package-backed state/router branches but unnecessary in the vanilla branch.

**Impact:** The default `--fatal-infos` quality gate rejects a valid minimal configuration, and generated projects contain avoidable noise.

**Remediation:** Gate imports with the same conditions as the APIs they support or replace the large barrel import with focused imports.

### P2-2. Analyzer configuration is permissive and partially invalid

**Affected path:** [`templates/flutter/base/analysis_options.yaml`](../templates/flutter/base/analysis_options.yaml):12–38.

**Evidence:** `strict-casts` is false while legacy `strong-mode.implicit-casts` is true. Tests and integration tests are excluded from analysis. `custom_lint` is listed as an analyzer plugin, but no `custom_lint` package is declared in pubspec.

**Impact:** Unsafe dynamic boundaries and broken generated tests can pass the advertised analysis gate. The custom lint configuration has no declared implementation.

**Remediation:** Remove legacy settings, enable strict casts where compatible, analyze tests, and either add/configure the custom-lint package or remove the plugin entry.

### P2-3. The analyzer/test contract excludes important output

**Affected paths:** [`templates/flutter/base/analysis_options.yaml`](../templates/flutter/base/analysis_options.yaml):17–31 and [`tests/e2e/dart-validation.spec.ts`](../tests/e2e/dart-validation.spec.ts):47–97.

**Evidence:** The analyzer excludes `test/**`, `integration_test/**`, and `web/**`. The E2E test checks critical combinations only and does not compile every primary combination.

**Impact:** Platform-specific and test-only breakage is invisible. The documented 375-combination guarantee is not enforced by a full compile/analyze gate.

**Remediation:** Analyze tests and web code, separate generated-code exclusions from authored-code exclusions, and run the full matrix in a pre-release job.

### P2-4. Architecture output contains duplicate domain/data models

**Affected paths:** Clean and Feature-first auth model templates under [`templates/flutter/overlays/architecture/clean`](../templates/flutter/overlays/architecture/clean) and [`templates/flutter/overlays/architecture/feature-first`](../templates/flutter/overlays/architecture/feature-first).

**Evidence:** Both data `user_model.dart` and domain `user.dart` include the same `AppUser` partial. Repository implementations import the domain entity, leaving the data model unused.

**Impact:** The generated Clean/Feature-first structures claim entity/model separation but do not implement it. Future mapping, serialization, and persistence work has no clear boundary.

**Remediation:** Define separate API/data models and domain entities, add explicit mapping, and remove unused duplicate files.

### P2-5. ScreenUtil can scale image dimensions twice

**Affected paths:** [`templates/flutter/base/lib/src/shared/widgets/common_image.dart.hbs`](../templates/flutter/base/lib/src/shared/widgets/common_image.dart.hbs):32–48 and [`templates/flutter/overlays/networking/cached_image/lib/src/shared/widgets/app_cached_image.dart.hbs`](../templates/flutter/overlays/networking/cached_image/lib/src/shared/widgets/app_cached_image.dart.hbs):69–84.

**Evidence:** `CommonImage` computes adjusted dimensions but passes the original `width` and `height` into `AppCachedImage`. `AppCachedImage` applies `.w` and `.h` itself.

**Impact:** Cached images can be sized differently from network/local images when ScreenUtil is enabled. Error and placeholder containers also use unadjusted dimensions.

**Remediation:** Normalize dimensions at one boundary and use the adjusted values consistently for image, placeholder, and error widgets.

### P2-6. MobX session listeners can leak reactions

**Affected path:** [`templates/flutter/base/lib/src/shared/wrappers/session_listener_wrapper.dart.hbs`](../templates/flutter/base/lib/src/shared/wrappers/session_listener_wrapper.dart.hbs):148–188.

**Evidence:** `didChangeDependencies` creates a new `reaction` and overwrites `_disposer`. Only the latest disposer is called in `dispose`.

**Impact:** Repeated dependency changes can leave old reactions active, causing duplicate navigation and retained widget state.

**Remediation:** Initialize the reaction once in `initState` when possible, or dispose the previous reaction before replacing it.

### P2-7. Theme options are not fully honored

**Affected paths:** [`app/lib/generator/index.ts`](../app/lib/generator/index.ts):204–207 and [`templates/flutter/base/lib/src/theme/theme.dart.hbs`](../templates/flutter/base/lib/src/theme/theme.dart.hbs):88–98.

**Evidence:** `isCustomTheme` is derived but not used to change theme generation. The theme always sets `useMaterial3: true`; the CLI's `useMaterial3` option is not consumed. Cupertino mode still wraps Material widgets and applies a Material theme in the builder.

**Impact:** “Custom” and Material 3 choices do not describe the actual generated behavior, and Cupertino projects are a mixed implementation rather than a consistent Cupertino stack.

**Remediation:** Decide which theme choices are supported, apply them explicitly, and add generated-output assertions for preset and Material 3 behavior.

### P2-8. The logger selection does not control the generated logger

**Affected paths:** [`templates/flutter/base/lib/src/utils/logger.dart.hbs`](../templates/flutter/base/lib/src/utils/logger.dart.hbs):1–37 and [`templates/flutter/base/pubspec.yaml.hbs`](../templates/flutter/base/pubspec.yaml.hbs):142–145.

**Evidence:** The custom `AppLogger` is always emitted and used. The `logger` package is only exported when selected and is not used by the generated services.

**Impact:** Enabling the option adds an unused dependency; disabling it does not disable the custom logging behavior. Generated dependency sets are larger than necessary.

**Remediation:** Use one logging abstraction. Either make the option select the implementation or remove the external package and keep the built-in developer logger.

### P2-9. Runtime task handling is too broad for production services

**Affected paths:** [`templates/flutter/base/lib/src/utils/task_runner.dart.hbs`](../templates/flutter/base/lib/src/utils/task_runner.dart.hbs):10–40 and [`templates/flutter/base/lib/src/utils/error_handler.dart.hbs`](../templates/flutter/base/lib/src/utils/error_handler.dart.hbs):1–13.

**Evidence:** Every exception becomes `ServerFailure`, including local/cache/permission failures. Error formatting relies on `dynamic` member access. Network availability is checked separately for every network task, with no timeout policy, cancellation, retry strategy, or status-to-domain mapping.

**Impact:** Consumers cannot reliably distinguish auth, validation, cache, permission, transport, and server failures. Repeated connectivity checks add latency and can produce false negatives before a request.

**Remediation:** Introduce typed failure mapping at service/repository boundaries, allow cancellation and request timeouts, and make connectivity checks an explicit policy rather than a mandatory preflight for every call.

### P2-10. Custom font metadata is not sufficiently validated or escaped

**Affected paths:** [`app/lib/config/schema.ts`](../app/lib/config/schema.ts):44–51 and [`app/lib/generator/index.ts`](../app/lib/generator/index.ts):159–170, 122–133.

**Evidence:** Font family and file name accept arbitrary non-empty strings. Binary output uses a basename, but pubspec references the original `fileName`. Handlebars emits family and asset values without YAML quoting/escaping.

**Impact:** Unusual filenames or family names can produce invalid pubspec YAML or point the generated project at a file name different from the written asset.

**Remediation:** Validate filename characters, normalize once before both writing and rendering, and quote/escape YAML values.

### P2-11. Asset declarations include directories that are not emitted

**Affected path:** [`templates/flutter/base/pubspec.yaml.hbs`](../templates/flutter/base/pubspec.yaml.hbs):216–231.

**Evidence:** The pubspec declares `assets/images/`, but the base tree contains only `assets/icons/`; there is no image directory or placeholder.

**Impact:** Flutter build output can warn about missing asset directories and users do not have the documented splash image location until they create it manually.

**Remediation:** Emit required directories with placeholders, or declare only directories that exist and update setup instructions.

### P2-12. SDK constraints do not communicate the actual Flutter API floor

**Affected path:** [`templates/flutter/base/pubspec.yaml.hbs`](../templates/flutter/base/pubspec.yaml.hbs):6–7 and [`templates/flutter/base/lib/src/theme/theme.dart.hbs`](../templates/flutter/base/lib/src/theme/theme.dart.hbs):140–172.

**Evidence:** The package accepts Dart `>=3.5.0`, while the template uses newer Flutter APIs such as `WidgetStateProperty`, `CardThemeData`, and `Color.withValues`.

**Impact:** A Flutter installation with a Dart version satisfying the declared constraint may still fail to compile the generated project.

**Remediation:** Pin or document a tested Flutter SDK range and validate against the oldest supported SDK, not only the newest local SDK.

### P2-13. Shared service exports are coupled to Flutter Hooks

**Affected path:** [`templates/flutter/base/lib/src/services/services.dart.hbs`](../templates/flutter/base/lib/src/services/services.dart.hbs):24–44.

**Evidence:** `usesFlutterHooks` suppresses exports for copy, sharing, permissions, URL launching, media, device info, and app-version services even though those services are unrelated to hooks.

**Impact:** Selecting hooks silently changes the public service API and can make selected utilities inaccessible.

**Remediation:** Gate each export on its own feature flag. Hooks should affect hook helpers, not unrelated service visibility.

### P2-14. Generated startup is not tested

**Affected path:** [`templates/flutter/base/test/widget_test.dart.hbs`](../templates/flutter/base/test/widget_test.dart.hbs):15–55.

**Evidence:** The test pumps `App` directly and does not invoke `main`, `AppConfig.init`, dotenv loading, Firebase initialization, Hive initialization, or native splash behavior.

**Impact:** The test can pass while the actual executable entry point fails at startup. This is exactly how the no-dotenv compile/runtime path escapes the default widget test.

**Remediation:** Add a startup test with injectable configuration and separate tests for backend initialization. Do not require live credentials; use platform/backend fakes.

## P3 — Low-priority cleanup

### P3-1. Dead and misleading template branches remain

**Affected paths:** [`templates/flutter/base/README.md.hbs`](../templates/flutter/base/README.md.hbs):15–17; [`templates/flutter/base/lib/main.dart.hbs`](../templates/flutter/base/lib/main.dart.hbs):3–22; [`app/lib/generator/index.ts`](../app/lib/generator/index.ts):204 and 240–283; [`cli/src/templates.ts`](../cli/src/templates.ts):175, 198.

**Evidence:** `flags.usesJsonSerializable`, `extras.flavors`, `overlays/state`, and `overlays/routing` are referenced even though they are absent, always false, or not present in the tree. The web context hardcodes `hasFlavors: true` although flavor files are only conditionally copied from a path that is always selected.

**Impact:** Contributors cannot infer which paths are real, and changes can appear covered while actually being unreachable.

**Remediation:** Remove dead branches or add explicit tests for them. Generate a flag inventory from the schema and fail CI on unknown flags.

### P3-2. CLI architecture folder scaffolding disagrees with emitted files

**Affected path:** [`cli/src/generator.ts`](../cli/src/generator.ts):21–98.

**Evidence:** The CLI creates `presentation/pages`, `model/view/viewmodel`, `screens/widgets/controllers`, and `presentation/state`, while templates emit `presentation/screens`, `ui/data`, `presentation/providers`, and other paths.

**Impact:** Generated projects contain misleading empty `.gitkeep` directories and users cannot trust the selected architecture tree.

**Remediation:** Derive folder creation from actual template output or remove pre-created empty folders.

### P3-3. CLI prompts and web schema expose different product choices

**Affected paths:** [`cli/src/config.ts`](../cli/src/config.ts):6–14 and [`app/lib/config/schema.ts`](../app/lib/config/schema.ts):3–94.

**Evidence:** Web supports `none` state, GetX navigation, and theme presets including Cupertino/custom. CLI omits none state, GetX navigation, and nested theme presets, while retaining template branches for some unavailable values.

**Impact:** Documentation, generated output, and user expectations differ by entry point.

**Remediation:** Share option definitions and schema validation between web and CLI, or clearly version the products as different configuration surfaces.

### P3-4. CLI prompt test source is corrupted

**Affected path:** [`cli/tests/prompts.test.ts`](../cli/tests/prompts.test.ts):1.

**Evidence:** Bun reports `Unexpected 0` because the file begins with binary NUL bytes.

**Impact:** The CLI test suite reports an error even though the other 49 tests pass.

**Remediation:** Restore the test as valid UTF-8 TypeScript and add a source-integrity check for test files.

### P3-5. Setup documentation contains inaccurate commands and paths

**Affected path:** [`templates/flutter/base/SETUP.md.hbs`](../templates/flutter/base/SETUP.md.hbs):14–29, 64–169, and 173–180.

**Evidence:** Firebase is listed as requiring build_runner even though Firebase alone does not add build_runner. Localization instructions write to `lib/src/core/i18n`, which is not part of the generated tree. The environment section calls dotenv values secrets even though Flutter assets are extractable from the client.

**Impact:** Users follow commands that fail or build incorrect assumptions into production apps.

**Remediation:** Generate setup content from the same capability model as dependencies and code generation. Review security language for client-side configuration.

## Recommended remediation roadmap

### Phase 0: Stop broken releases

1. Fix dotenv gating.
2. Fix HTTP logger call.
3. Fix Firebase auth dependency/import gating.
4. Make the CLI apply the same overlays as the web generator.
5. Decide whether the web output is a complete Flutter project or a source overlay.
6. Repair the CLI theme context and stop emitting invalid splash YAML.

### Phase 1: Make validation represent reality

1. Add a normalized configuration/capability model shared by web and CLI.
2. Derive `requiresCodeGeneration` and run build_runner before analysis.
3. Add startup smoke tests and analyze generated tests.
4. Run representative web/native platform checks for optional services.
5. Keep generated artifacts for failed combinations so diagnostics are reproducible.

### Phase 2: Complete selected feature contracts

1. Implement or remove backend sub-options.
2. Replace insecure Appwrite defaults and clarify client configuration.
3. Correct native permission declarations and runtime requests.
4. Separate data models from domain entities.
5. Tighten typed error handling and resource lifecycle management.

### Phase 3: Reduce drift and maintenance cost

1. Remove dead flags and nonexistent overlay paths.
2. Make `templates/flutter` the only source of truth, with explicit target-specific overlays if needed.
3. Generate architecture folders from emitted files.
4. Add SDK compatibility checks and dependency update policy.
5. Add snapshots for baseline, bare, all-features, and every backend/navigation/code-generation family.

## Regression gate for the next template release

A release should not be marked stable until all of the following pass:

- Every valid primary combination renders with zero unresolved Handlebars tokens.
- Every selected export points to an emitted file.
- Every dependency imported by generated Dart is present in pubspec.
- Every dependency selected by a feature is either used or explicitly documented as dependency-only.
- Every code-generation combination runs its generator and then passes `dart analyze --fatal-infos`.
- Tests are analyzed and executed for state, localization, backend, and startup paths.
- Web-compatible combinations compile on Chrome; native-only combinations fail with a clear documented reason or receive a conditional implementation.
- CLI and web generation produce the same normalized file/dependency contract.
- No generated project loads missing assets or placeholder credentials during startup.
- The full 375-combination matrix is run before a major template release, with the 25 critical combinations required on every pull request.
