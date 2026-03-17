#!/bin/bash
set -e
echo "=== REBUILD START $(date) ==="
cd /opt/postiz-build
echo "=== Verifying source files ==="
head -3 apps/frontend/src/components/new-layout/layout.component.tsx
echo "=== Building Docker image ==="
docker build --no-cache -f Dockerfile.dev -t postiz-custom:latest --build-arg NEXT_PUBLIC_VERSION=roro-tiktok . 2>&1 | tee /tmp/docker-build-final.log
echo "=== BUILD COMPLETE $(date) ==="
echo "=== Restarting containers ==="
cd /opt/postiz-live
bash stop.sh 2>&1 | tail -3
docker compose --env-file .env.production -f docker-compose.public.yml up -d 2>&1 | tail -15
echo "=== ALL DONE $(date) ==="
