#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TARGET_ENV="$SCRIPT_DIR/.env.production"
SOURCE_ENV="$SCRIPT_DIR/.env.production.example"

if [ -f "$TARGET_ENV" ]; then
  echo ".env.production already exists: $TARGET_ENV"
  exit 0
fi

cp "$SOURCE_ENV" "$TARGET_ENV"
echo "Created $TARGET_ENV from template."
echo "Edit the file and replace every placeholder before starting the stack."