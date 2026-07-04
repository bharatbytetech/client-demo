#!/bin/sh
set -e

echo "[entrypoint] Syncing Prisma schema to MongoDB..."
node_modules/.bin/prisma db push --skip-generate --accept-data-loss || \
  echo "[entrypoint] WARNING: prisma db push failed; starting server anyway."

# Backfill isDeleted=false on any documents that predate the boolean migration.
echo "[entrypoint] Running isDeleted migration..."
node_modules/.bin/ts-node scripts/migrate-isdeleted.ts || \
  echo "[entrypoint] WARNING: isDeleted migration failed; starting server anyway."

if [ -n "$SEED_ADMIN_EMAIL" ] && [ -n "$SEED_ADMIN_PASSWORD" ]; then
  echo "[entrypoint] Running admin seed..."
  node_modules/.bin/ts-node prisma/seed.ts || \
    echo "[entrypoint] WARNING: seed script failed; starting server anyway."
fi

echo "[entrypoint] Starting ArtsDiva API..."
exec node dist/server.js
