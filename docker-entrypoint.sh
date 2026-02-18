#!/bin/sh
set -e

MAX_RETRIES=30
SLEEP_INTERVAL=2
ATTEMPT=0

echo "==> Waiting for database to be ready..."
while [ "$ATTEMPT" -lt "$MAX_RETRIES" ]; do
  if echo "SELECT 1" | npx prisma db execute --stdin >/dev/null 2>&1; then
    echo "==> Database is ready."
    break
  fi
  ATTEMPT=$((ATTEMPT + 1))
  echo "    Attempt $ATTEMPT/$MAX_RETRIES - DB not ready, retrying in ${SLEEP_INTERVAL}s..."
  sleep "$SLEEP_INTERVAL"
done

if [ "$ATTEMPT" -ge "$MAX_RETRIES" ]; then
  echo "ERROR: Database did not become ready after $((MAX_RETRIES * SLEEP_INTERVAL))s. Exiting."
  exit 1
fi

echo "==> Running Prisma migrations..."
npx prisma migrate deploy

echo "==> Seeding database..."
npx prisma db seed
echo "==> Seed completed successfully."

echo "==> Starting Next.js server..."
exec node server.js
