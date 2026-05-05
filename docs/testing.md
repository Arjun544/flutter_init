# FlutterInit — Comprehensive Testing Guide

**Version:** 1.1  
**Scope:** Template integrity, output validation, full combination coverage, and CI/CD integration  
**Stack:** Bun, Vitest, Handlebars.js, Dart, GitHub Actions

---

## Table of Contents

1. [Overview and Philosophy](#1-overview-and-philosophy)
2. [Understanding the Testing Problem](#2-understanding-the-testing-problem)
3. [The Two-Layer Model](#3-the-two-layer-model)
4. [Layer 1 — Template Integrity Testing](#4-layer-1--template-integrity-testing)
5. [Layer 2 — Dart Output Validation](#5-layer-2--dart-output-validation)
6. [Full Combination Coverage](#6-full-combination-coverage)
7. [The Combination Generator](#7-the-combination-generator)
8. [What to Assert in Every Test](#8-what-to-assert-in-every-test)
9. [Test Directory Structure](#9-test-directory-structure)
10. [CI/CD Strategy and Tiering](#10-cicd-strategy-and-tiering)
11. [The Pre-Production Gate](#11-the-pre-production-gate)
12. [Snapshot Testing for Regression Prevention](#12-snapshot-testing-for-regression-prevention)
13. [Combination Coverage Reporting](#13-combination-coverage-reporting)
14. [Failure Handling and Debugging](#14-failure-handling-and-debugging)
15. [Common Pitfalls and How to Avoid Them](#15-common-pitfalls-and-how-to-avoid-them)
16. [Testing Checklist Before Every Release](#16-testing-checklist-before-every-release)

---

## 1. Overview and Philosophy

FlutterInit is a scaffolding engine. Unlike a standard web application or API, it does not serve data or process requests at runtime — it generates code. This fundamentally changes what testing means and what it must guarantee.

A bug in a web app breaks a feature. A bug in FlutterInit breaks every project a developer creates with it. A developer who generates a broken project from FlutterInit may spend hours debugging before realizing the issue was in the tool, not their code. That erosion of trust is irreversible.

**The primary goal of FlutterInit's test suite is a single guarantee:**

> Every valid combination of user choices must produce a Flutter project that compiles, analyzes cleanly, and reflects exactly what the user configured.

Nothing less is acceptable before a production release.

---

## 2. Understanding the Testing Problem

Most scaffolding tools test only whether their templates compile — meaning, whether the template engine successfully processes the template file without throwing an error. This is a dangerously incomplete definition of "passing."

FlutterInit has a unique testing challenge because it sits at the intersection of two languages and two systems:

**The JavaScript system** is responsible for taking user input, resolving template logic, injecting variables, and producing file strings. Bugs here include unresolved Handlebars tokens, incorrect conditionals, variable name mismatches, wrong file paths, and missing files for certain option combinations.

**The Dart system** is the output of the JavaScript system. Bugs here include syntactically invalid Dart code, incorrect import paths, missing or duplicate dependencies in pubspec.yaml, conflicting package versions, and architectural folder structures that don't match what was requested.

---

## 3. The Two-Layer Model

Think of FlutterInit's output pipeline as two sequential layers, each requiring its own validation strategy.

**Layer 1 — The Template Engine (Unit & Integration)**
- **Scope**: All 375 primary valid combinations of architecture, state management, and backend.
- **Tools**: Vitest, Bun.
- **Speed**: Very fast (seconds to minutes).
- **Environment**: Node.js/Bun (no Flutter SDK required).

**Layer 2 — The Generated Flutter Project (E2E)**
- **Goal**: Guarantee that the generated code actually compiles and follows Dart best practices.
- **Tools**: Dart SDK (`dart pub get`, `dart analyze`), Bun.
- **Speed**: Slower (minutes).
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
3.  **Code Generation**: Runs `build_runner` (if MobX or AutoRoute is used).
4.  **Static Analysis**: Runs `dart analyze --fatal-infos`.

### What Layer 2 Catches
- **Import path errors**: Typographical errors in package imports.
- **pubspec.yaml version conflicts**: Conflicting constraints between packages.
- **Missing platform configuration**: Incomplete setup for services like Firebase.
- **Architectural consistency**: Verifying that imports match the requested folder structure.

---

## 6. Full Combination Coverage

### Why Full Coverage Matters
The interactions between options are where the most subtle bugs live. "None" is a first-class option that must be explicitly tested.

### Defining the Option Space
The file `tests/utils/matrix.config.ts` defines the available options and filters out invalid combinations. Every valid permutation (375 primary combinations) must eventually be tested before a major release.

---

## 7. The Combination Generator

The combination generator (`tests/utils/combinations.ts`) is a shared utility that produces the complete list of valid combinations. It powers the full matrix test suite and ensures consistency across all test tiers.

---

## 8. What to Assert in Every Test

- **Structural**: Does the folder structure match (Clean, Feature-First, MVVM)?
- **Content**: Are the files populated correctly?
- **Dependency**: Is `pubspec.yaml` correct for the selected flags?
- **Token Cleanliness**: No `{{tokens}}` in output.
- **Analysis (Layer 2)**: Zero errors, warnings, or info diagnostics.

---

## 9. Test Directory Structure

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

## 10. CI/CD Strategy and Tiering

### Tier 1 — Every Push (Unit & Integration)
- **Runs**: `npm run test:layer1`
- **Goal**: Immediate feedback on template logic.
- **Duration**: < 3 mins.

### Tier 2 — Every PR to Main (Critical E2E)
- **Runs**: Layer 1 + `npm run test:layer2` (30 Critical Combos).
- **Goal**: Verify core architectural integrity.
- **Duration**: < 15 mins (parallelized).

### Tier 3 — Pre-Release Gate (Full Matrix)
- **Runs**: Full validation for all 375 primary combinations.
- **Goal**: Zero-bug guarantee for production.
- **Duration**: 45-90 mins (distributed runners).

---

## 11. The Pre-Production Gate

Before any release, the "Preflight" command must pass:

```bash
npm run test:preflight
```

This chains Layer 1 and Layer 2 validation. If any step fails, the deployment is blocked.

---

## 12. Snapshot Testing for Regression Prevention

We use snapshot testing for critical combinations to catch unintended changes in generated code structure. Snapshots are stored in version control and must be reviewed when updated.

---

## 13. Failure Handling and Debugging

### Automated Logs
When tests fail, diagnostics are automatically aggregated:
- **Layer 1 Logs**: `tests/results/layer1/failed-tests.log`
- **Layer 2 Logs**: `tests/results/layer2/failed-tests.log`

### CI/CD Artifacts
When a test fails in GitHub Actions, these detailed logs are preserved as artifacts:
1. Navigate to the failed **Action run** in GitHub.
2. Scroll to the **Artifacts** section at the bottom of the summary page.
3. Download the relevant log (e.g., `tier2-failure-logs`).
4. These logs match your local `tests/results/` structure and contain the full error context.

### Debugging a Specific Combination
If a specific combination fails (e.g., `layer-first|none|none|auto_route`):
```bash
# Generate and debug a specific combo
bun scripts/validate-dart.ts --combo "layer-first|none|none|auto_route" --keep-output
```
Inspect the generated code in `./.temp/flutterinit/` and run `dart analyze` manually.

---

## 14. Common Pitfalls

- **Testing Only Happy Paths**: Always test the "None" options.
- **Ignoring Infos**: `dart analyze` MUST pass with `--fatal-infos`.
- **Option Bleed**: Accidental inclusion of code from unselected flags.
- **Missing build_runner**: Forgetting to run generation for MobX/AutoRoute.

---

## 15. Testing Checklist Before Every Release

- [ ] `npm run test:layer1` passes 100%.
- [ ] `npm run test:layer2` passes for all 25 critical combinations.
- [ ] Unresolved token assertions pass globally for all primary combinations.
- [ ] Every individual option value appears in at least three tested combinations.
- [ ] Snapshot diffs have been reviewed and approved.
- [ ] `tests/results/` logs are clean.

---

*This guide is the source of truth for FlutterInit quality standards. Update it whenever new options are added or the validation pipeline is enhanced.*

