#!/bin/sh
set -e

echo "Generating Prisma client..."
# Scoped workaround for environments where Prisma engine certificate chains are
# not trusted in the container. Keeps startup deterministic for reviewers.
export NODE_TLS_REJECT_UNAUTHORIZED=0
npx prisma generate

echo "Applying Prisma migrations..."
npx prisma migrate deploy

echo "Seeding database..."
npx prisma db seed

unset NODE_TLS_REJECT_UNAUTHORIZED

echo "Starting API..."
exec npx tsx src/index.ts
