#!/bin/sh
set -e

PRISMA="./node_modules/.bin/prisma"
MAX_RETRIES=60
SLEEP_INTERVAL=2
ATTEMPT=0

echo "==> Waiting for database to be ready..."
while [ "$ATTEMPT" -lt "$MAX_RETRIES" ]; do
  if echo "SELECT 1" | "$PRISMA" db execute --stdin --url "$DATABASE_URL" 2>&1; then
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
"$PRISMA" migrate deploy

echo "==> Seeding database..."
"$PRISMA" db seed || { echo "ERROR: Seed failed"; exit 1; }
echo "==> Seed completed successfully."

echo "==> Starting Next.js server..."
exec node server.js
