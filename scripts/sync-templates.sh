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

mkdir -p "$DEST"

# Keep the CLI package as a faithful, deletions-included mirror of the
# authoritative source without maintaining a second template tree by hand.
if command -v rsync >/dev/null 2>&1; then
  rsync -a --delete "$SOURCE/" "$DEST/"
else
  echo "Error: rsync is required to synchronize templates safely." >&2
  exit 1
fi

echo "✓  Templates synced successfully."
echo "    Run 'cd cli && bun publish' to publish."
