-- Clear existing data for a clean seed
TRUNCATE TABLE sessions CASCADE;
TRUNCATE TABLE users CASCADE;
TRUNCATE TABLE tenants CASCADE;

-- Insert Tenant
INSERT INTO tenants (id, name, slug, status)
VALUES ('00000000-0000-0000-0000-000000000001', 'TeamOne', 'teamone', 'active');

-- Insert User (admin@teamone.local / Admin123!)
INSERT INTO users (
    id, tenant_id, email, password_hash, first_name, last_name, 
    role, status, email_verified, created_by, updated_by
) VALUES (
    '00000000-0000-0000-0000-000000000002', 
    '00000000-0000-0000-0000-000000000001', 
    'admin@teamone.local', 
    '$2a$10$cUdjFUncXjMQJaO5pEHnkulXo4Fd6NDySfjwbxqZ.bwF7rfXtisSG', 
    'Admin', 
    'User', 
    'super_admin', 
    'active', 
    true, 
    '00000000-0000-0000-0000-000000000002', 
    '00000000-0000-0000-0000-000000000002'
);

