#!/bin/sh
set -e

echo "==> Running Prisma migrations..."
npx prisma migrate deploy

echo "==> Seeding database..."
npx prisma db seed || echo "Seed completed (or already seeded)."

echo "==> Starting Next.js server..."
exec node server.js
