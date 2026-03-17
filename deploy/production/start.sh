#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if ! command -v docker >/dev/null 2>&1; then
  echo "Docker is required but not installed."
  exit 1
fi

"$SCRIPT_DIR/validate-env.sh"

docker compose \
  --env-file "$SCRIPT_DIR/.env.production" \
  -f "$SCRIPT_DIR/docker-compose.public.yml" \
  config >/dev/null

docker compose \
  --env-file "$SCRIPT_DIR/.env.production" \
  -f "$SCRIPT_DIR/docker-compose.public.yml" \
  pull

docker compose \
  --env-file "$SCRIPT_DIR/.env.production" \
  -f "$SCRIPT_DIR/docker-compose.public.yml" \
  up -d

docker compose \
  --env-file "$SCRIPT_DIR/.env.production" \
  -f "$SCRIPT_DIR/docker-compose.public.yml" \
  ps