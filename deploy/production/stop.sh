#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [ ! -f "$SCRIPT_DIR/.env.production" ]; then
  echo "Missing $SCRIPT_DIR/.env.production"
  exit 1
fi

docker compose \
  --env-file "$SCRIPT_DIR/.env.production" \
  -f "$SCRIPT_DIR/docker-compose.public.yml" \
  down