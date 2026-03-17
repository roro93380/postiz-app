#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="$SCRIPT_DIR/.env.production"
BACKUP_DIR="$SCRIPT_DIR/backups"
STAMP="$(date +%Y%m%d-%H%M%S)"

if [ ! -f "$ENV_FILE" ]; then
  echo "Missing $ENV_FILE"
  exit 1
fi

mkdir -p "$BACKUP_DIR"

set -a
source "$ENV_FILE"
set +a

docker compose \
  --env-file "$ENV_FILE" \
  -f "$SCRIPT_DIR/docker-compose.public.yml" \
  exec -T postiz-postgres \
  pg_dump -U "$POSTIZ_DB_USER" -d "$POSTIZ_DB_NAME" \
  | gzip > "$BACKUP_DIR/postiz-${STAMP}.sql.gz"

echo "Backup created: $BACKUP_DIR/postiz-${STAMP}.sql.gz"