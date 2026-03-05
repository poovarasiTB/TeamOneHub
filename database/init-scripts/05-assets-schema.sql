-- ═══════════════════════════════════════════════════════════════════
-- TeamOne Assets Hub Database Schema
-- ═══════════════════════════════════════════════════════════════════

-- Assets
CREATE TABLE IF NOT EXISTS assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    asset_code VARCHAR(50) NOT NULL,
    name VARCHAR(200) NOT NULL,
    type VARCHAR(50) NOT NULL, -- hardware, software, cloud, digital
    category VARCHAR(100),
    status VARCHAR(50) DEFAULT 'active', -- active, inactive, maintenance, retired
    serial_number VARCHAR(200),
    manufacturer VARCHAR(200),
    model VARCHAR(200),
    purchase_date DATE,
    purchase_cost DECIMAL(15,2),
    warranty_end_date DATE,
    assigned_to_type VARCHAR(50), -- employee, department, location
    assigned_to_id UUID,
    location VARCHAR(200),
    specifications JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_by UUID NOT NULL,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    version INTEGER NOT NULL DEFAULT 1,
    
    CONSTRAINT fk_assets_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id),
    CONSTRAINT uk_assets_code UNIQUE (tenant_id, asset_code)
);

-- Software Licenses
CREATE TABLE IF NOT EXISTS software_licenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    license_key VARCHAR(500),
    software_name VARCHAR(200) NOT NULL,
    publisher VARCHAR(200),
    license_type VARCHAR(50), -- perpetual, subscription, concurrent
    total_seats INTEGER NOT NULL,
    used_seats INTEGER DEFAULT 0,
    purchase_date DATE,
    expiry_date DATE,
    auto_renew BOOLEAN DEFAULT FALSE,
    cost DECIMAL(15,2),
    currency VARCHAR(3) DEFAULT 'USD',
    status VARCHAR(50) DEFAULT 'active',
    compliance_status VARCHAR(50) DEFAULT 'compliant', -- compliant, overallocated, expiring-soon, expired
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_by UUID NOT NULL,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    version INTEGER NOT NULL DEFAULT 1,
    
    CONSTRAINT fk_licenses_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id),
    CONSTRAINT uk_licenses_key UNIQUE (tenant_id, license_key)
);

-- License Assignments
CREATE TABLE IF NOT EXISTS license_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    license_id UUID NOT NULL,
    user_id UUID,
    device_id UUID,
    assigned_date DATE NOT NULL,
    unassigned_date DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID NOT NULL,
    
    CONSTRAINT fk_assignments_license FOREIGN KEY (license_id) REFERENCES software_licenses(id),
    CONSTRAINT fk_assignments_user FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Domains
CREATE TABLE IF NOT EXISTS domains (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    domain_name VARCHAR(255) NOT NULL,
    registrar VARCHAR(200),
    registration_date DATE,
    expiry_date DATE NOT NULL,
    auto_renew BOOLEAN DEFAULT FALSE,
    status VARCHAR(50) DEFAULT 'active', -- active, expiring-soon, expired
    name_servers TEXT[],
    dns_provider VARCHAR(200),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_by UUID NOT NULL,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    version INTEGER NOT NULL DEFAULT 1,
    
    CONSTRAINT fk_domains_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id),
    CONSTRAINT uk_domains_name UNIQUE (tenant_id, domain_name)
);

-- SSL Certificates
CREATE TABLE IF NOT EXISTS ssl_certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    domain_id UUID,
    common_name VARCHAR(255) NOT NULL,
    issuer VARCHAR(200),
    issued_date DATE,
    expiry_date DATE NOT NULL,
    certificate_type VARCHAR(50), -- single, wildcard, multi-domain
    validation_type VARCHAR(50), -- DV, OV, EV
    status VARCHAR(50) DEFAULT 'valid', -- valid, expiring-soon, expired, revoked
    installed_on TEXT[],
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_by UUID NOT NULL,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    version INTEGER NOT NULL DEFAULT 1,
    
    CONSTRAINT fk_ssl_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id),
    CONSTRAINT fk_ssl_domain FOREIGN KEY (domain_id) REFERENCES domains(id)
);

-- Asset Maintenance
CREATE TABLE IF NOT EXISTS asset_maintenance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_id UUID NOT NULL,
    maintenance_type VARCHAR(100), -- preventive, corrective, upgrade
    description TEXT,
    scheduled_date DATE,
    completed_date DATE,
    cost DECIMAL(15,2),
    vendor VARCHAR(200),
    notes TEXT,
    status VARCHAR(50) DEFAULT 'scheduled', -- scheduled, in-progress, completed, cancelled
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_by UUID NOT NULL,
    
    CONSTRAINT fk_maintenance_asset FOREIGN KEY (asset_id) REFERENCES assets(id)
);

-- Create indexes
CREATE INDEX idx_assets_tenant ON assets(tenant_id);
CREATE INDEX idx_assets_type ON assets(type);
CREATE INDEX idx_assets_status ON assets(status);
CREATE INDEX idx_assets_assigned ON assets(assigned_to_type, assigned_to_id);
CREATE INDEX idx_licenses_tenant ON software_licenses(tenant_id);
CREATE INDEX idx_licenses_status ON software_licenses(status);
CREATE INDEX idx_licenses_expiry ON software_licenses(expiry_date);
CREATE INDEX idx_licenses_compliance ON software_licenses(compliance_status);
CREATE INDEX idx_domains_tenant ON domains(tenant_id);
CREATE INDEX idx_domains_expiry ON domains(expiry_date);
CREATE INDEX idx_domains_status ON domains(status);
CREATE INDEX idx_ssl_tenant ON ssl_certificates(tenant_id);
CREATE INDEX idx_ssl_expiry ON ssl_certificates(expiry_date);
CREATE INDEX idx_ssl_status ON ssl_certificates(status);
CREATE INDEX idx_maintenance_asset ON asset_maintenance(asset_id);
CREATE INDEX idx_maintenance_status ON asset_maintenance(status);

-- Create indexes for audit queries
CREATE INDEX idx_assets_created_by ON assets(created_by);
CREATE INDEX idx_licenses_created_by ON software_licenses(created_by);
CREATE INDEX idx_domains_created_by ON domains(created_by);
CREATE INDEX idx_ssl_created_by ON ssl_certificates(created_by);
