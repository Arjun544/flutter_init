# Changelog

User-facing changes to FlutterInit (wizard, CLI, scaffolds, and docs that affect builders).
The version on [/create](https://flutterinit.com/create) tracks `cli/package.json` and advances on every push to `main`.

## [1.2.0] - 2026-09-22

Enhanced UI with new widgets and improved changelog management.

### Added

- New UI widgets for improved user experience.
- Extended UI blogs for better content presentation.

### Changed

- Updated GitHub Actions to handle changelog commits and PRs.

### Removed

- Native folders from web wizard generation.

### Internal

- Refactored ChangelogPage for better prerendering and code structure.

## [1.1.0] - 2026-09-21

Extended UI is now a first-class product story: public update + guide, clearer naming across the wizard and scaffolds, and the create-page version set to **1.1.0**.

### Added
- Blog update and guide for Extended UI (`App*` widgets + optional shadcn_ui)
- Skills lock entry for related agent skills

### Changed
- Product version on `/create` bumped to `1.1.0` via `cli/package.json`
- Renamed scaffold UI surface from FlutterInit-prefixed widgets to the `App*` kit naming
- Wizard copy and schema labels aligned with Extended UI / App kit wording
