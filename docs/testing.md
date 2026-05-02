# FlutterInit Testing Guide

This guide explains the testing infrastructure for **FlutterInit**, covering the two-layer validation strategy, the automated matrix runner, and CI/CD integration.

---

## 1. Testing Philosophy

We use a two-layer approach to ensure that the template generator produces reliable, production-grade Flutter code.

### Layer 1: Template Integrity (Unit & Integration)
- **Goal**: Fast, in-memory validation of the generator engine and Handlebars templates.
- **Scope**: All 1,350+ valid combinations of architecture, state management, and backend.
- **Speed**: Very fast (seconds to minutes).
- **Environment**: Node.js/Bun (no Flutter SDK required).

### Layer 2: Output Validation (E2E)
- **Goal**: Guarantee that the generated code actually compiles and follows Dart best practices.
- **Scope**: Critical combinations and full matrix validation.
- **Speed**: Slow (minutes to hours).
- **Environment**: Requires Flutter/Dart SDK.

---

## 2. Directory Structure

```text
tests/
├── unit/               # Layer 1: Specific feature tests
│   ├── backend.spec.ts
│   ├── dependencies.spec.ts
│   ├── token-cleanliness.spec.ts  # Scans for unresolved {{tokens}}
│   └── ...
├── integration/        # Layer 1: Pipeline tests
│   └── full-pipeline.spec.ts      # Generates full project in-memory
├── e2e/                # Layer 2: Dart SDK validation
│   ├── validate-combo.ts          # CLI tool for single combo
│   ├── run-matrix.ts              # Matrix orchestrator
│   └── dart-validation.spec.ts    # Vitest wrapper for E2E
└── utils/              # Shared logic
    ├── matrix.config.ts           # Source of truth for options
    └── assertions.ts              # Custom Flutter/Dart assertions
```

---

## 3. The Matrix Configuration

The file `tests/utils/matrix.config.ts` defines the available options and filters out invalid combinations.

- **`ALL_COMBINATIONS`**: Every valid permutation of the configuration space (~1,350).
- **`CRITICAL_COMBINATIONS`**: A curated subset (~30) that covers the most diverse and high-risk edge cases.

Whenever you add a new feature or flag to `schema.ts`, you **must** update the constants in `matrix.config.ts`.

---

## 4. Running Tests Locally

### Fast Checks (Layer 1)
```bash
# Run all unit and integration tests
npm run test:unit

# Run a specific test file
npx vitest tests/unit/backend.spec.ts
```

### Full Validation (Layer 1 + Layer 2)
Requires Flutter/Dart SDK installed and available in your PATH.

```bash
# Run the "Critical Gate" (Unit + 30 Critical E2E Combos)
npm run test:gate

# Run E2E for critical combos only
npm run test:e2e

# Run E2E for the ENTIRE matrix (Caution: Takes hours)
npm run test:matrix
```

---

## 5. CI/CD Pipeline

The project uses GitHub Actions with a tiered strategy:

1.  **Tier 1 (Every Push)**: Runs all unit and integration tests (Layer 1). Target: < 3 minutes.
2.  **Tier 2 (PR to Main)**: Runs Layer 1 + Layer 2 for the **30 Critical Combinations**. Target: < 15 minutes.
3.  **Tier 3 (Release Gate)**: Runs the full Layer 1 + Layer 2 validation for all 1,350+ combinations in parallel.

---

## 6. Debugging Failures

### Layer 1 Failures
Usually mean a Handlebars helper failed, a file is missing from an overlay, or a token like `{{name}}` was found in the output. The test output will typically show the exact file and line number of the unresolved token.

### Layer 2 Failures
Usually mean the generated Dart code has a syntax error or a version mismatch in `pubspec.yaml`. 
To debug a specific failing combo:
```bash
# Use the CLI validator for the failing combo index (e.g. #42)
bun tests/e2e/validate-combo.ts 42
```
This will generate the project to a temporary directory and show the raw output from `dart analyze`.

---

## 7. Best Practices for Template Changes

1.  **Check Tokens**: If you add a new variable, ensure it's handled in `index.ts` and that it appears in `token-cleanliness.spec.ts`.
2.  **Add Assertions**: If a package is mandatory for a flag, add a dependency assertion in `tests/unit/dependencies.spec.ts`.
3.  **Verify Structure**: If you change the folder structure (e.g., adding a `services` folder), update `tests/unit/structural.spec.ts`.
4.  **Run the Gate**: Always run `npm run test:gate` before pushing a PR.
