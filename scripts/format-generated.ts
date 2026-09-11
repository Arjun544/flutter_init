/**
 * format-generated.ts
 *
 * Runs `dart format` on a generated Flutter project directory.
 *
 * Why this exists:
 * Handlebars templates (.hbs) can't be dart-formatted directly — the
 * {{#if}} / {{each}} / {{variable}} syntax isn't valid Dart, so editors
 * and dart_style choke on the raw template. The fix is to format AFTER
 * rendering: once Handlebars writes real .dart files to the output dir,
 * run dart format on that output. This normalizes whatever inconsistent
 * spacing/line breaks came out of the template substitution, and it's
 * the only point in the pipeline where the files are valid Dart.
 *
 * Usage:
 *   bun scripts/format-generated.ts <path-to-generated-project>
 *
 * Or import `formatGeneratedProject(dir)` from `shared/format-generated`
 * and call it from the CLI / web generation pipeline right after templates
 * are written (and after pub get when available).
 */

import {
    formatGeneratedProject,
} from "../shared/format-generated"

export {
    dartIsAvailable,
    formatGeneratedProject,
    type FormatResult,
} from "../shared/format-generated"

if (import.meta.main) {
    const target = process.argv[2]
    if (!target) {
        console.error("Usage: bun scripts/format-generated.ts <path-to-generated-project>")
        process.exit(1)
    }

    formatGeneratedProject(target, { allowSkip: false })
        .then((result) => {
            if (!result.success) {
                console.error("dart format failed:\n", result.stderr || result.stdout)
                process.exit(1)
            }
            console.log(`✔ Formatted ${result.filesChanged} file(s) in ${target}`)
        })
        .catch((err: Error) => {
            console.error(err.message)
            process.exit(1)
        })
}
