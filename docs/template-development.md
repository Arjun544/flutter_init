# 🛠️ Template Development & Debugging Guide

This guide explains how to efficiently develop, test, and debug Flutter templates within the **FlutterInit** project.

## 🚀 The Development Loop

The project uses a specialized script `scripts/template-dev.ts` that provides a "Hot Reload" experience for template development.

### 1. Start the Dev Script
In your terminal, run:
```bash
bun run --watch scripts/template-dev.ts
```

**What this does:**
- 📁 **Watches** the `templates/flutter/` and `app/lib/` directories.
- 🔄 **Auto-Restarts** the script if you change the config schema or generator logic.
- ⚡ **Generates** a complete Flutter project into the `dev_out/` folder using the latest configuration.
- 📦 **Runs** `flutter pub get` (on first run).
- 🔍 **Analyzes** the generated code using `dart analyze` and reports errors directly to your terminal.

### 2. IDE Integration
To get the best experience, open the `dev_out` folder as a separate workspace in your IDE (VS Code, IntelliJ, etc.).

- **Real-time Squiggles:** Your IDE will show red lines for syntax or type errors in the generated Dart files.
- **Trace to Template:** When you see an error in `dev_out/lib/src/.../file.dart`, find the corresponding `.hbs` file in `templates/flutter/.../file.dart.hbs` and fix the logic there.

---

## 📂 Understanding the Workflow

### File Syncing
The script is smart. It only writes files to `dev_out` if the content has actually changed. This prevents the IDE from lagging or constantly re-indexing files that haven't been modified.

### Debouncing
Changes are debounced by **500ms**. This ensures that if you save multiple files rapidly, the generator only runs once.

### Error Reporting
When a Dart error occurs, the script will:
1. Catch the output of `dart analyze`.
2. Filter for `error` and `warning` tags.
3. Print them in a clean, readable format in your terminal.

Example output:
```text
❌ Found 1 issues in generated code
```

---

## 💡 Best Practices for Contributors

### 1. Mentally Trace Flags
Every Handlebars template must produce valid Dart for *every* flag combination. When adding a feature:
- Check `if (flags.usesFeature)` logic.
- Check the `else` path or `{{#unless}}` path.

### 2. Use the `res` Helper
Never hardcode pixel values. Use the `res` helper for ScreenUtil compatibility:
- `{{res 16 'w' flags.usesScreenutil}}` -> `16.w` or `16.0`

### 3. Check Barrel Files
If you add a new service or widget, ensure it's exported in the correct barrel file (e.g., `services.dart.hbs`, `widgets.dart.hbs`).

### 4. Fix "Cannot find name 'Timer'"
If you encounter TypeScript errors regarding `Timer`, use `ReturnType<typeof setTimeout>` to ensure compatibility across Node.js and Bun runtimes.

---

## 🛠️ Troubleshooting

| Issue | Solution |
| :--- | :--- |
| **`dev_out` is out of sync** | Restart the script. On the first build, it performs a clean `rm -rf`. |
| **`pub get` fails** | Ensure you have Flutter installed and in your PATH. Try running `flutter doctor`. |
| **Too many errors** | Focus on one file at a time. The terminal output filters for the most critical issues. |
| **Test different options** | Modify `defaultConfig` in `app/lib/config/schema.ts`. The script will auto-restart and regenerate. |

---

> [!TIP]
> Keep your main IDE window on the `templates/` folder and a secondary window (or file explorer) on `dev_out/` to witness the magic in real-time.
