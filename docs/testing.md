# FlutterInit — Comprehensive Testing Guide

**Version:** 1.2  
**Scope:** Template integrity, output validation, format gate, full combination coverage, and CI/CD integration  
**Stack:** Bun, Vitest, Handlebars.js, Dart, GitHub Actions

---

## Table of Contents

1. [Overview and Philosophy](#1-overview-and-philosophy)
2. [Understanding the Testing Problem](#2-understanding-the-testing-problem)
3. [The Three-Layer Model](#3-the-three-layer-model)
4. [Layer 1 — Template Integrity Testing](#4-layer-1--template-integrity-testing)
5. [Layer 2 — Dart Output Validation](#5-layer-2--dart-output-validation)
6. [Layer 3 — Dart Format Validation](#6-layer-3--dart-format-validation)
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

> Every valid combination of user choices must produce a Flutter project that compiles, analyzes cleanly, matches `dart format` (VS Code Format Document), and reflects exactly what the user configured.

Nothing less is acceptable before a production release.

---

## 2. Understanding the Testing Problem

Most scaffolding tools test only whether their templates compile — meaning, whether the template engine successfully processes the template file without throwing an error. This is a dangerously incomplete definition of "passing."

FlutterInit has a unique testing challenge because it sits at the intersection of two languages and two systems:

**The JavaScript system** is responsible for taking user input, resolving template logic, injecting variables, and producing file strings. Bugs here include unresolved Handlebars tokens, incorrect conditionals, variable name mismatches, wrong file paths, and missing files for certain option combinations.

**The Dart system** is the output of the JavaScript system. Bugs here include syntactically invalid Dart code, incorrect import paths, missing or duplicate dependencies in pubspec.yaml, conflicting package versions, architectural folder structures that don't match what was requested, and indentation/spacing that doesn't match `dart format`.

---

## 3. The Three-Layer Model

Think of FlutterInit's output pipeline as three sequential layers, each requiring its own validation strategy.

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

**Layer 3 — Dart Format (VS Code parity)**
- **Goal**: Generate from templates, auto-fix dirty Dart with `dart format`, verify the result is clean.
- **Tools**: Flutter/Dart SDK (`dart pub get`, `dart format`), Bun.
- **Speed**: Faster than Layer 2 (no analyze / test / build_runner).
- **Environment**: Requires Flutter/Dart SDK.

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
1.  **Project Generation**: Writes files to a temporary directory.
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

## 6. Layer 3 — Dart Format Validation

### Purpose
Layer 3 generates Dart from templates, checks formatting against `dart format` (VS Code Format Document), **auto-fixes** any dirty files, then re-checks. The combo passes when the project is format-clean after auto-fix.

### Running Layer 3 Tests
```bash
# Run format validation for Critical Combinations
npm run test:layer3
```

### The Validation Pipeline
1. **Project Generation**: Writes files from `.hbs` templates to `.temp/flutterinit-format/<combo>/`.
2. **Dependency Resolution**: Runs `dart pub get` so `analysis_options.yaml` can resolve `package:flutter_lints/...`.
3. **First check**: `dart format --output=none --set-exit-if-changed .` — lists generated `.dart` files that need reformatting.
4. **Auto-fix**: runs `dart format` on those files.
5. **Template write-back**: each dirty `.dart` file **replaces the whole** matching source `.hbs` / partial in `templates/flutter` (then syncs `cli/templates`).
6. **Re-generate + second check**: must be format-clean.

### Pass / fail
A combo **passes** if it is already clean, or if format + whole-file `.hbs` replace + re-generate leaves a clean tree. It **fails** if `pub get`, format, or the final check fails.

### What Layer 3 Catches
- **Unformattable / broken Dart** that `dart format` cannot process.
- **Formatter instability** (second check still dirty after apply — should be rare).

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
- **Format (Layer 3)**: Generated Dart is formattable; auto-fix + re-check must leave the project format-clean.

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
│   ├── layer2/failed-tests.log
│   └── layer3/failed-tests.log
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
- **Runs**: Layer 1 + `npm run test:layer2` + `npm run test:layer3` (critical combos).
- **Goal**: Verify core architectural integrity and format cleanliness.
- **Duration**: < 15 mins (parallelized).

### Tier 3 — Pre-Release Gate (Full Matrix)
- **Runs**: Full Layer 2 validation for all 375 primary combinations, plus Layer 3 format gate on critical combos.
- **Goal**: Zero-bug guarantee for production.
- **Duration**: 45-90 mins (distributed runners).

---

## 12. The Pre-Production Gate

Before any release, the "Preflight" command must pass:

```bash
npm run test:preflight
```

This chains Layer 1, Layer 2, and Layer 3 validation. If any step fails, the deployment is blocked.

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
- **Layer 3 Logs**: `tests/results/layer3/failed-tests.log`

### CI/CD Artifacts
When a test fails in GitHub Actions, these detailed logs are preserved as artifacts:
1. Navigate to the failed **Action run** in GitHub.
2. Scroll to the **Artifacts** section at the bottom of the summary page.
3. Download the relevant log (e.g., `tier2-layer3-failure-logs`).
4. These logs match your local `tests/results/` structure and contain the full error context.

### Debugging a Specific Combination
If a specific combination fails (e.g., `layer-first|none|none|auto_route`):
```bash
# Generate and debug a specific combo (Layer 2)
bun scripts/validate-dart.ts --combo "mvvm|bloc|supabase|auto_route" --keep-output

# Format gate for a specific combo (Layer 3)
bun scripts/validate-format.ts --combo "mvvm|bloc|supabase|auto_route" --keep-output
```
Inspect Layer 2 output in `./.temp/flutterinit/` and Layer 3 output in `./.temp/flutterinit-format/`.

---

## 16. Common Pitfalls

- **Testing Only Happy Paths**: Always test the "None" options.
- **Ignoring Infos**: `dart analyze` MUST pass with `--fatal-infos`.
- **Option Bleed**: Accidental inclusion of code from unselected flags.
- **Missing build_runner**: Forgetting to run generation for MobX/AutoRoute.
- **Format auto-fix**: Layer 3 applies `dart format` when the first check is dirty; it fails only if formatting cannot produce a clean tree.

---

## 17. Testing Checklist Before Every Release

- [ ] `npm run test:layer1` passes 100%.
- [ ] `npm run test:layer2` passes for all critical combinations.
- [ ] `npm run test:layer3` passes for all critical combinations.
- [ ] Unresolved token assertions pass globally for all primary combinations.
- [ ] Every individual option value appears in at least three tested combinations.
- [ ] Snapshot diffs have been reviewed and approved.
- [ ] `tests/results/` logs are clean.

---

*This guide is the source of truth for FlutterInit quality standards. Update it whenever new options are added or the validation pipeline is enhanced.*
