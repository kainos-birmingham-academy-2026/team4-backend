#!/bin/bash
set -e

echo "Waiting for database to be ready..."
until pg_isready -h "$DB_HOST" -U postgres; do
  sleep 1
done

echo "Running Prisma migrations..."
npx prisma migrate deploy

echo "Seeding database..."
npx prisma db seed

echo "Database setup complete!"
