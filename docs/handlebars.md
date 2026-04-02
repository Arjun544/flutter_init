# Handlebars Guide

FlutterInit uses **Handlebars.js** to dynamically generate Dart code. This guide covers the custom helpers and logical patterns used throughout our `.hbs` templates.

## Basic Conditionals

Use standard Handlebars `{{#if}}` and `{{#unless}}` blocks to toggle code sections based on configuration flags.

```handlebars
{{#if flags.isRiverpod}}
// This code only appears if Riverpod is selected
ProviderScope(child: MyApp())
{{/if}}

{{#unless flags.usesScreenutil}}
// This code only appears if ScreenUtil is disabled
const double padding = 16.0;
{{/unless}}
```

## Custom Logical Helpers

Standard Handlebars does not support complex logic inside `{{#if}}`. We provide several helpers to handle multi-flag conditions.

| Helper | Syntax | Description |
| :--- | :--- | :--- |
| `eq` | `{{#if (eq a b)}}` | Checks for strict equality (`===`). useful for `architecture` or `stateManagement` strings. |
| `and` | `{{#if (and a b c)}}` | Returns true if ALL arguments are truthy. |
| `or` | `{{#if (or a b)}}` | Returns true if ANY argument is truthy. |
| `not` | `{{#if (not a)}}` | Inverts the boolean value. |
| `when` | `{{#when condition}}...{{/when}}` | A block helper for inline logic. |

### Logic Example:
```handlebars
{{#if (and flags.usesDio (not flags.usesHttp))}}
// Dio is on, but Http is off
final dio = Dio();
{{/if}}

{{#if (eq backend.provider "firebase")}}
// Firebase specific implementation
Firebase.initializeApp();
{{/if}}
```

## String Transformation Helpers

Use these to ensure your class names and filenames match your project's naming conventions.

- `{{pascalCase appName}}`: `my cool app` -> `MyCoolApp` (Use for Classes)
- `{{snakeCase appName}}`: `my cool app` -> `my_cool_app` (Use for Filenames/Packages)
- `{{kebabCase appName}}`: `my cool app` -> `my-cool-app` (Use for URLs/IDs)

## Scaling with the `res` Helper

**Important:** Never hardcode pixel values like `16.0` if you want to support ScreenUtil. Use the `res` helper to automatically map to `.w`, `.h`, or `.sp` based on the user's preference.

- **Syntax**: `{{res VALUE UNIT_TYPE usesScreenutilFlag}}`
- **Units**: `'w'` (width), `'h'` (height), `'sp'` (font/icon size)

```handlebars
// Template
EdgeInsets.all({{res 16 'w' flags.usesScreenutil}})

// Output (if usesScreenutil: true)
EdgeInsets.all(16.w)

// Output (if usesScreenutil: false)
EdgeInsets.all(16.0)
```

## Advanced Utilities

### `json` Helper
Serializes an object or array into a pretty-printed JSON string. Useful for `SETUP.md` or configuration files.
```handlebars
const config = {{json backend.options}};
```

### `indent` Helper
Ensures that partials or multi-line strings maintain the correct indentation level when injected into a parent file.
```handlebars
{{#if flags.usesAuth}}
  {{indent (partial "login_logic") 2}}
{{/if}}
```

### Partials
Reusable code blocks are stored in `templates/flutter/partials/`. You can include them using the standard Handlebars syntax:
```handlebars
{{> features/auth/login_screen }}
```

---

**Next Step:** See [CONTRIBUTING.md](../CONTRIBUTING.md) to learn how to add your own patterns using these helpers.
