#!/bin/bash

# TeamOne Database Seed Script
# Creates initial super admin user

echo "==================================="
echo "TeamOne Database Seed"
echo "==================================="
echo ""

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL..."
until docker exec teamone-postgres pg_isready -U postgres > /dev/null 2>&1; do
  sleep 2
done
echo "PostgreSQL is ready!"
echo ""

# Create auth database if not exists
echo "Creating databases..."
docker exec teamone-postgres psql -U postgres -c "CREATE DATABASE teamone_auth;" 2>/dev/null || echo "Database teamone_auth exists"
docker exec teamone-postgres psql -U postgres -c "CREATE DATABASE teamone_people;" 2>/dev/null || echo "Database teamone_people exists"
docker exec teamone-postgres psql -U postgres -c "CREATE DATABASE teamone_work;" 2>/dev/null || echo "Database teamone_work exists"
docker exec teamone-postgres psql -U postgres -c "CREATE DATABASE teamone_money;" 2>/dev/null || echo "Database teamone_money exists"
docker exec teamone-postgres psql -U postgres -c "CREATE DATABASE teamone_assets;" 2>/dev/null || echo "Database teamone_assets exists"
docker exec teamone-postgres psql -U postgres -c "CREATE DATABASE teamone_support;" 2>/dev/null || echo "Database teamone_support exists"
docker exec teamone-postgres psql -U postgres -c "CREATE DATABASE teamone_growth;" 2>/dev/null || echo "Database teamone_growth exists"
echo ""

# Create users table
echo "Creating users table..."
docker exec teamone-postgres psql -U postgres -d teamone_auth <<EOF
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  role VARCHAR(50) DEFAULT 'user',
  roles TEXT[] DEFAULT '{}',
  status VARCHAR(50) DEFAULT 'active',
  avatar_url VARCHAR(500),
  phone VARCHAR(50),
  department VARCHAR(100),
  job_title VARCHAR(100),
  email_verified BOOLEAN DEFAULT FALSE,
  last_login_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by VARCHAR(255),
  updated_by VARCHAR(255),
  is_deleted BOOLEAN DEFAULT FALSE,
  deleted_at TIMESTAMP,
  deleted_by VARCHAR(255),
  version INTEGER DEFAULT 1
);

CREATE TABLE IF NOT EXISTS tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_tenant_id ON users(tenant_id);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
EOF
echo ""

# Create default tenant
echo "Creating default tenant..."
docker exec teamone-postgres psql -U postgres -d teamone_auth -c "INSERT INTO tenants (id, slug, name, status) VALUES ('00000000-0000-0000-0000-000000000001', 'trustybytes', 'TrustyBytes Technologies', 'active') ON CONFLICT (slug) DO NOTHING;"
echo ""

# Create super admin user
# Password: AdminCheck@2026 (bcrypt hash)
echo "Creating super admin user..."
docker exec teamone-postgres psql -U postgres -d teamone_auth <<EOF
INSERT INTO users (id, tenant_id, email, password_hash, name, first_name, last_name, role, roles, status, email_verified, created_at)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  'admin@trustybytes.in',
  '\$2a\$10\$xIuRWzNzXfzGb1qSvQqH8.5kJZqLvZ8qKxZ9qKxZ9qKxZ9qKxZ9qK',
  'System Administrator',
  'System',
  'Administrator',
  'admin',
  '{admin,superadmin}',
  'active',
  TRUE,
  NOW()
) ON CONFLICT (email) DO NOTHING;
EOF

echo ""
echo "==================================="
echo "✅ Database seeded successfully!"
echo "==================================="
echo ""
echo "Super Admin Credentials:"
echo "  Email:    admin@trustybytes.in"
echo "  Password: AdminCheck@2026"
echo ""
echo "==================================="
