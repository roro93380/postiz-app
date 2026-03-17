#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="$SCRIPT_DIR/.env.production"

if [ $# -ne 1 ]; then
  echo "Usage: ./restore-postgres.sh <backup-file.sql.gz>"
  exit 1
fi

BACKUP_FILE="$1"

if [ ! -f "$ENV_FILE" ]; then
  echo "Missing $ENV_FILE"
  exit 1
fi

if [ ! -f "$BACKUP_FILE" ]; then
  echo "Backup file not found: $BACKUP_FILE"
  exit 1
fi

set -a
source "$ENV_FILE"
set +a

gunzip -c "$BACKUP_FILE" | docker compose \
  --env-file "$ENV_FILE" \
  -f "$SCRIPT_DIR/docker-compose.public.yml" \
  exec -T postiz-postgres \
  psql -U "$POSTIZ_DB_USER" -d "$POSTIZ_DB_NAME"

echo "Restore completed from: $BACKUP_FILE"