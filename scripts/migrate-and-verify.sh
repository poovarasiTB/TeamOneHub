#!/bin/bash

# TeamOne Database Migration & Verification Script
# This script executes all database migrations and verifies they completed successfully

set -e

echo "══════════════════════════════════════════════════════════════"
echo "  TeamOne Database Migration & Verification"
echo "══════════════════════════════════════════════════════════════"
echo ""

# Configuration
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
DB_USER="${DB_USER:-postgres}"
DB_NAME="${DB_NAME:-teamone}"
DB_PASSWORD="${DB_PASSWORD:-postgres}"

export PGPASSWORD=$DB_PASSWORD

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print status
print_status() {
  if [ $1 -eq 0 ]; then
    echo -e "${GREEN}✓${NC} $2"
  else
    echo -e "${RED}✗${NC} $2"
    exit 1
  fi
}

print_warning() {
  echo -e "${YELLOW}⚠${NC} $1"
}

# Check database connection
echo "Checking database connection..."
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d postgres -c "SELECT 1" > /dev/null 2>&1
print_status $? "Database connection successful"

# Create database if not exists
echo ""
echo "Creating database if not exists..."
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d postgres -c "CREATE DATABASE $DB_NAME" > /dev/null 2>&1 || true
print_status $? "Database $DB_NAME ready"

# Execute migrations in order
echo ""
echo "Executing migrations..."

MIGRATION_DIR="./database/init-scripts"
MIGRATIONS=(
  "01-initial-schema.sql"
  "02-people-schema.sql"
  "03-work-schema.sql"
  "04-money-schema.sql"
  "05-assets-schema.sql"
  "06-support-schema.sql"
  "07-growth-schema.sql"
  "08-audit-triggers.sql"
  "09-seed-data.sql"
)

for migration in "${MIGRATIONS[@]}"; do
  if [ -f "$MIGRATION_DIR/$migration" ]; then
    echo "  Executing $migration..."
    psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f "$MIGRATION_DIR/$migration" > /dev/null 2>&1
    print_status $? "  $migration completed"
  else
    print_warning "$migration not found, skipping..."
  fi
done

# Verify tables created
echo ""
echo "Verifying tables..."

REQUIRED_TABLES=(
  "users"
  "projects"
  "tasks"
  "employees"
  "invoices"
  "customers"
  "expenses"
  "assets"
  "tickets"
  "wiki_articles"
)

for table in "${REQUIRED_TABLES[@]}"; do
  psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "SELECT 1 FROM $table LIMIT 1" > /dev/null 2>&1
  print_status $? "  Table $table exists"
done

# Verify indexes
echo ""
echo "Verifying indexes..."

INDEX_COUNT=$(psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -t -c "SELECT COUNT(*) FROM pg_indexes WHERE schemaname = 'public'" | tr -d ' ')
if [ "$INDEX_COUNT" -gt 50 ]; then
  print_status 0 "  Indexes created ($INDEX_COUNT indexes)"
else
  print_status 1 "  Indexes verification failed (expected > 50, got $INDEX_COUNT)"
fi

# Verify triggers
echo ""
echo "Verifying triggers..."

TRIGGER_COUNT=$(psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -t -c "SELECT COUNT(*) FROM pg_trigger WHERE tgname LIKE '%audit%'" | tr -d ' ')
if [ "$TRIGGER_COUNT" -gt 10 ]; then
  print_status 0 "  Audit triggers created ($TRIGGER_COUNT triggers)"
else
  print_status 1 "  Audit triggers verification failed (expected > 10, got $TRIGGER_COUNT)"
fi

# Verify foreign keys
echo ""
echo "Verifying foreign keys..."

FK_COUNT=$(psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -t -c "SELECT COUNT(*) FROM information_schema.table_constraints WHERE constraint_type = 'FOREIGN KEY'" | tr -d ' ')
if [ "$FK_COUNT" -gt 30 ]; then
  print_status 0 "  Foreign keys created ($FK_COUNT constraints)"
else
  print_status 1 "  Foreign keys verification failed (expected > 30, got $FK_COUNT)"
fi

# Summary
echo ""
echo "══════════════════════════════════════════════════════════════"
echo -e "${GREEN}✓ Database migration and verification completed successfully!${NC}"
echo "══════════════════════════════════════════════════════════════"
echo ""
echo "Database: $DB_NAME"
echo "Host: $DB_HOST:$DB_PORT"
echo "Tables: ${#REQUIRED_TABLES[@]}+ verified"
echo "Indexes: $INDEX_COUNT"
echo "Triggers: $TRIGGER_COUNT"
echo "Foreign Keys: $FK_COUNT"
echo ""
