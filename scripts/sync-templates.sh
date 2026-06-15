#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# sync-templates.sh
# Syncs the monorepo Flutter templates into cli/templates/.
# Run this before publishing: cd cli && bun run sync-templates
# Also run in CI before: bun publish
# ─────────────────────────────────────────────────────────────────────────────

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MONOREPO_ROOT="$(dirname "$SCRIPT_DIR")"
SOURCE="$MONOREPO_ROOT/templates/flutter"
DEST="$MONOREPO_ROOT/cli/templates"

echo "🔄  Syncing templates..."
echo "    From: $SOURCE"
echo "    To:   $DEST"

# Clear existing templates in cli/
rm -rf "$DEST"
mkdir -p "$DEST"

# Copy all templates recursively
cp -r "$SOURCE/." "$DEST/"

echo "✓  Templates synced successfully."
echo "    Run 'cd cli && bun publish' to publish."
