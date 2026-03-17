#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="$SCRIPT_DIR/.env.production"

if [ ! -f "$ENV_FILE" ]; then
  echo "Missing $ENV_FILE"
  echo "Run ./init-env.sh first."
  exit 1
fi

required_vars=(
  POSTIZ_DOMAIN
  POSTIZ_EMAIL
  MAIN_URL
  FRONTEND_URL
  NEXT_PUBLIC_BACKEND_URL
  BACKEND_INTERNAL_URL
  JWT_SECRET
  POSTIZ_DB_USER
  POSTIZ_DB_PASSWORD
  POSTIZ_DB_NAME
  DATABASE_URL
  REDIS_URL
  TEMPORAL_ADDRESS
  TEMPORAL_DB_USER
  TEMPORAL_DB_PASSWORD
  TEMPORAL_DB_NAME
  STORAGE_PROVIDER
  TIKTOK_CLIENT_ID
  TIKTOK_CLIENT_SECRET
)

missing=0

for key in "${required_vars[@]}"; do
  value=$(grep -E "^${key}=" "$ENV_FILE" | head -n 1 | cut -d '=' -f2- || true)

  if [ -z "$value" ]; then
    echo "Missing value for $key"
    missing=1
    continue
  fi

  if printf '%s' "$value" | grep -Eq 'replace-with-|example.com|admin@example.com|postiz.example.com'; then
    echo "Placeholder still present for $key"
    missing=1
  fi
done

if ! grep -Eq '^MAIN_URL=https://[^/]+$' "$ENV_FILE"; then
  echo "MAIN_URL must use https and must not end with a slash"
  missing=1
fi

if ! grep -Eq '^FRONTEND_URL=https://[^/]+$' "$ENV_FILE"; then
  echo "FRONTEND_URL must use https and must not end with a slash"
  missing=1
fi

if ! grep -Eq '^NEXT_PUBLIC_BACKEND_URL=https://[^/]+/api$' "$ENV_FILE"; then
  echo "NEXT_PUBLIC_BACKEND_URL must look like https://your-domain/api"
  missing=1
fi

if ! grep -Eq '^BACKEND_INTERNAL_URL=http://127\.0\.0\.1:3000$' "$ENV_FILE"; then
  echo "BACKEND_INTERNAL_URL should stay set to http://127.0.0.1:3000 for the bundled container"
  missing=1
fi

if [ "$missing" -ne 0 ]; then
  exit 1
fi

echo "Environment file looks ready."