# FlutterInit — Comprehensive Testing Guide

**Version:** 1.3  
**Scope:** Template integrity, output validation, full combination coverage, and CI/CD integration  
**Stack:** Bun, Vitest, Handlebars.js, Dart, GitHub Actions

---

## Table of Contents

1. [Overview and Philosophy](#1-overview-and-philosophy)
2. [Understanding the Testing Problem](#2-understanding-the-testing-problem)
3. [The Two-Layer Model](#3-the-two-layer-model)
4. [Layer 1 — Template Integrity Testing](#4-layer-1--template-integrity-testing)
5. [Layer 2 — Dart Output Validation](#5-layer-2--dart-output-validation)
6. [Post-Generate Formatting](#6-post-generate-formatting)
7. [Full Combination Coverage](#7-full-combination-coverage)
8. [The Combination Generator](#8-the-combination-generator)
9. [What to Assert in Every Test](#9-what-to-assert-in-every-test)
10. [Test Directory Structure](#10-test-directory-structure)
11. [CI/CD Strategy and Tiering](#11-cicd-strategy-and-tiering)
12. [The Pre-Production Gate](#12-the-pre-production-gate)
13. [Snapshot Testing for Regression Prevention](#13-snapshot-testing-for-regression-prevention)
14. [Combination Coverage Reporting](#14-combination-coverage-reporting)
15. [Failure Handling and Debugging](#15-failure-handling-and-debugging)
16. [Common Pitfalls and How to Avoid Them](#16-common-pitfalls-and-how-to-avoid-them)
17. [Testing Checklist Before Every Release](#17-testing-checklist-before-every-release)

---

## 1. Overview and Philosophy

FlutterInit is a scaffolding engine. Unlike a standard web application or API, it does not serve data or process requests at runtime — it generates code. This fundamentally changes what testing means and what it must guarantee.

A bug in a web app breaks a feature. A bug in FlutterInit breaks every project a developer creates with it. A developer who generates a broken project from FlutterInit may spend hours debugging before realizing the issue was in the tool, not their code. That erosion of trust is irreversible.

**The primary goal of FlutterInit's test suite is a single guarantee:**

> Every valid combination of user choices must produce a Flutter project that compiles, analyzes cleanly, and reflects exactly what the user configured.

Formatting is a **generation concern**, not a test layer: after Handlebars renders real `.dart` files, the pipeline runs `dart format .` when the Dart SDK is available (CLI always; web when `dart` is on PATH). Generated `SETUP.md` also documents `dart format .` after `flutter pub get` for zip downloads from hosts without Dart.

Nothing less is acceptable before a production release.

---

## 2. Understanding the Testing Problem

Most scaffolding tools test only whether their templates compile — meaning, whether the template engine successfully processes the template file without throwing an error. This is a dangerously incomplete definition of "passing."

FlutterInit has a unique testing challenge because it sits at the intersection of two languages and two systems:

**The JavaScript system** is responsible for taking user input, resolving template logic, injecting variables, and producing file strings. Bugs here include unresolved Handlebars tokens, incorrect conditionals, variable name mismatches, wrong file paths, and missing files for certain option combinations.

**The Dart system** is the output of the JavaScript system. Bugs here include syntactically invalid Dart code, incorrect import paths, missing or duplicate dependencies in pubspec.yaml, conflicting package versions, and architectural folder structures that don't match what was requested.

Handlebars `.hbs` files are not valid Dart, so they cannot be `dart format`'d in place. Spacing inconsistencies from template substitution are normalized **after** render on the generated tree.

---

## 3. The Two-Layer Model

Think of FlutterInit's output pipeline as two sequential validation layers, plus a post-generate format step outside the test matrix.

**Layer 1 — The Template Engine (Unit & Integration)**
- **Scope**: All 375 primary valid combinations of architecture, state management, and backend.
- **Tools**: Vitest, Bun.
- **Speed**: Very fast (seconds to minutes).
- **Environment**: Node.js/Bun (no Flutter SDK required).

**Layer 2 — The Generated Flutter Project (E2E)**
- **Goal**: Guarantee that the generated code actually compiles and follows Dart best practices.
- **Tools**: Flutter/Dart SDK (`flutter pub get`, `dart run build_runner`, `dart analyze`, `flutter test`), Bun.
- **Speed**: Slower (minutes).
- **Environment**: Requires Flutter/Dart SDK.

**Post-generate format (not a test layer)**
- **Goal**: Users receive `dart format`-clean Dart when the SDK is available.
- **Where**: CLI after `flutter pub get`; web generator before zip when `dart` is on PATH; `SETUP.md` / README for download users.
- **Helper**: `shared/format-generated.ts` / `bun scripts/format-generated.ts <dir>`.

---

## 4. Layer 1 — Template Integrity Testing

### Purpose
Layer 1 tests verify that the Handlebars templating engine is correctly processing every template file for every valid combination of inputs.

### Running Layer 1 Tests
```bash
# Run all unit and integration tests
npm run test:layer1

# Run unit tests only
npm run test:unit

# Run integration tests only
npm run test:integration
```

### What Layer 1 Tests Verify
- **No unresolved Handlebars tokens**: No `{{variable}}` sequences left in output.
- **No empty output files**: Every file must have substantive content.
- **Presence of required files**: `pubspec.yaml`, `main.dart`, etc.
- **Correct conditional inclusion**: Ensuring no "option bleed" (e.g., Bloc code in a Riverpod project).
- **Valid pubspec.yaml structure**: Parseable as valid YAML.

---

## 5. Layer 2 — Dart Output Validation

### Purpose
Layer 2 tests verify that the files written to disk constitute a valid Flutter project.

### Running Layer 2 Tests
```bash
# Run validation for Critical Combinations
npm run test:layer2
```

### The Validation Pipeline
1.  **Project Generation**: Writes files to a temporary directory (and formats when Dart is available).
2.  **Dependency Resolution**: Runs `dart pub get`.
3.  **Code Generation**: Runs `build_runner` when the normalized configuration
    reports `requiresCodeGeneration` (MobX, AutoRoute, or Hive).
4.  **Static Analysis**: Runs `dart analyze --fatal-infos`.
5.  **Startup smoke test**: Runs `flutter test` against the generated project.
    On Windows, this step is skipped only when the SDK reports that symlink
    support is disabled. Failed projects are retained for diagnosis.

### What Layer 2 Catches
- **Import path errors**: Typographical errors in package imports.
- **pubspec.yaml version conflicts**: Conflicting constraints between packages.
- **Missing platform configuration**: Incomplete setup for services like Firebase.
- **Architectural consistency**: Verifying that imports match the requested folder structure.

---

## 6. Post-Generate Formatting

Formatting is applied on the **generated** project, never by rewriting `.hbs` sources during tests.

| Path | When |
| :--- | :--- |
| CLI (`cli/src/generator.ts`) | After `flutter pub get` via `formatGeneratedProject` |
| Web (`app/lib/generator`) | Before zip, best-effort if `dart` is on PATH (skipped on typical Vercel hosts) |
| Manual / scripts | `bun scripts/format-generated.ts <path-to-generated-project>` |
| Generated docs | `SETUP.md` / README: `dart format .` after `flutter pub get` |

Prefer formatting **after** `pub get` when possible — style can differ before packages resolve. The web zip path skips `pub get` for speed; SETUP covers the post-pub-get format for those users.

---

## 7. Full Combination Coverage

### Why Full Coverage Matters
The interactions between options are where the most subtle bugs live. "None" is a first-class option that must be explicitly tested.

### Defining the Option Space
The file `tests/utils/matrix.config.ts` defines the available options and filters out invalid combinations. Every valid permutation (375 primary combinations) must eventually be tested before a major release.

---

## 8. The Combination Generator

The combination generator (`tests/utils/combinations.ts`) is a shared utility that produces the complete list of valid combinations. It powers the full matrix test suite and ensures consistency across all test tiers.

---

## 9. What to Assert in Every Test

- **Structural**: Does the folder structure match (Clean, Feature-First, MVVM)?
- **Content**: Are the files populated correctly?
- **Dependency**: Is `pubspec.yaml` correct for the selected flags?
- **Token Cleanliness**: No `{{tokens}}` in output.
- **Analysis (Layer 2)**: Zero errors, warnings, or info diagnostics, including
  tests and web code.

---

## 10. Test Directory Structure

```text
tests/
├── unit/               # Layer 1: Specific feature tests
│   ├── backend.spec.ts
│   ├── dependencies.spec.ts
│   └── ...
├── integration/        # Layer 1: Pipeline tests
│   └── full-pipeline.spec.ts
├── results/            # Automated failure logs (gitignored)
│   ├── layer1/failed-tests.log
│   └── layer2/failed-tests.log
├── utils/              # Shared logic
│   ├── matrix.config.ts      # Option definitions
│   ├── critical-combos.ts    # CI subset
│   ├── combinations.ts       # Generator utility
│   └── assertions.ts         # Custom matchers
└── reporters/          # Custom test output formatters
```

---

## 11. CI/CD Strategy and Tiering

### Tier 1 — Every Push (Unit & Integration)
- **Runs**: `npm run test:layer1`
- **Goal**: Immediate feedback on template logic.
- **Duration**: < 3 mins.

### Tier 2 — Every PR to Main (Critical E2E)
- **Runs**: Layer 1 + `npm run test:layer2` (critical combos).
- **Goal**: Verify core architectural integrity.
- **Duration**: < 15 mins (parallelized).

### Tier 3 — Pre-Release Gate (Full Matrix)
- **Runs**: Full Layer 2 validation for all 375 primary combinations.
- **Goal**: Zero-bug guarantee for production.
- **Duration**: 45-90 mins (distributed runners).

---

## 12. The Pre-Production Gate

Before any release, the "Preflight" command must pass:

```bash
npm run test:preflight
```

This chains Layer 1 and Layer 2 validation. If any step fails, the deployment is blocked.

---

## 13. Snapshot Testing for Regression Prevention

We use snapshot testing for critical combinations to catch unintended changes in generated code structure. Snapshots are stored in version control and must be reviewed when updated.

---

## 14. Combination Coverage Reporting

Coverage reporting tracks which option values appear across the test matrix so no flag is under-tested before release.

---

## 15. Failure Handling and Debugging

### Automated Logs
When tests fail, diagnostics are automatically aggregated:
- **Layer 1 Logs**: `tests/results/layer1/failed-tests.log`
- **Layer 2 Logs**: `tests/results/layer2/failed-tests.log`

### CI/CD Artifacts
When a test fails in GitHub Actions, these detailed logs are preserved as artifacts:
1. Navigate to the failed **Action run** in GitHub.
2. Scroll to the **Artifacts** section at the bottom of the summary page.
3. Download the relevant log (e.g., `tier2-layer2-failure-logs`).
4. These logs match your local `tests/results/` structure and contain the full error context.

### Debugging a Specific Combination
If a specific combination fails (e.g., `layer-first|none|none|auto_route`):
```bash
# Generate and debug a specific combo (Layer 2)
bun scripts/validate-dart.ts --combo "mvvm|bloc|supabase|auto_route" --keep-output
```
Inspect Layer 2 output in `./.temp/flutterinit/`.

To format a generated tree manually:
```bash
bun scripts/format-generated.ts ./.temp/flutterinit/<project-dir>
```

---

## 16. Common Pitfalls

- **Testing Only Happy Paths**: Always test the "None" options.
- **Ignoring Infos**: `dart analyze` MUST pass with `--fatal-infos`.
- **Option Bleed**: Accidental inclusion of code from unselected flags.
- **Missing build_runner**: Forgetting to run generation for MobX/AutoRoute.
- **Formatting templates in place**: Do not try to `dart format` `.hbs` files or rewrite format fixes back into templates during CI. Format the generated project instead.

---

## 17. Testing Checklist Before Every Release

- [ ] `npm run test:layer1` passes 100%.
- [ ] `npm run test:layer2` passes for all critical combinations.
- [ ] Unresolved token assertions pass globally for all primary combinations.
- [ ] Every individual option value appears in at least three tested combinations.
- [ ] Snapshot diffs have been reviewed and approved.
- [ ] `tests/results/` logs are clean.

---

*This guide is the source of truth for FlutterInit quality standards. Update it whenever new options are added or the validation pipeline is enhanced.*

