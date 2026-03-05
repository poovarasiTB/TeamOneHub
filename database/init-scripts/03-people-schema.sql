-- ═══════════════════════════════════════════════════════════════════
-- TeamOne People Hub Database Schema
-- ═══════════════════════════════════════════════════════════════════

-- Employees
CREATE TABLE IF NOT EXISTS employees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    user_id UUID NOT NULL,
    employee_code VARCHAR(50) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    department VARCHAR(100),
    designation VARCHAR(100),
    manager_id UUID,
    join_date DATE NOT NULL,
    end_date DATE,
    status VARCHAR(50) DEFAULT 'active', -- active, on-leave, terminated, resigned
    location VARCHAR(200),
    employment_type VARCHAR(50), -- full-time, part-time, contract, intern
    salary DECIMAL(15,2),
    currency VARCHAR(3) DEFAULT 'USD',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_by UUID NOT NULL,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    version INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT fk_employees_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id),
    CONSTRAINT fk_employees_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_employees_manager FOREIGN KEY (manager_id) REFERENCES employees(id),
    CONSTRAINT uk_employees_code UNIQUE (tenant_id, employee_code),
    CONSTRAINT uk_employees_user UNIQUE (tenant_id, user_id)
);

-- Attendance
CREATE TABLE IF NOT EXISTS attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    employee_id UUID NOT NULL,
    date DATE NOT NULL,
    check_in TIMESTAMPTZ,
    check_out TIMESTAMPTZ,
    status VARCHAR(50) DEFAULT 'present', -- present, absent, late, half-day, work-from-home
    work_hours DECIMAL(5,2),
    location VARCHAR(200),
    ip_address VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_attendance_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id),
    CONSTRAINT fk_attendance_employee FOREIGN KEY (employee_id) REFERENCES employees(id),
    CONSTRAINT uk_attendance_date UNIQUE (tenant_id, employee_id, date)
);

-- Leave Types
CREATE TABLE IF NOT EXISTS leave_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    name VARCHAR(100) NOT NULL, -- Annual, Sick, Casual, Maternity, Paternity, etc.
    code VARCHAR(50) NOT NULL,
    days_allowed INTEGER NOT NULL DEFAULT 0,
    paid BOOLEAN DEFAULT TRUE,
    carry_forward BOOLEAN DEFAULT FALSE,
    max_carry_forward INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,

    CONSTRAINT fk_leave_types_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id),
    CONSTRAINT uk_leave_types_code UNIQUE (tenant_id, code)
);

-- Leave Requests
CREATE TABLE IF NOT EXISTS leave_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    employee_id UUID NOT NULL,
    leave_type_id UUID NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_days INTEGER NOT NULL,
    reason TEXT,
    status VARCHAR(50) DEFAULT 'pending', -- pending, approved, rejected, cancelled
    approved_by UUID,
    approved_at TIMESTAMPTZ,
    rejection_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_leave_requests_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id),
    CONSTRAINT fk_leave_requests_employee FOREIGN KEY (employee_id) REFERENCES employees(id),
    CONSTRAINT fk_leave_requests_type FOREIGN KEY (leave_type_id) REFERENCES leave_types(id),
    CONSTRAINT fk_leave_requests_approved FOREIGN KEY (approved_by) REFERENCES employees(id)
);

-- Leave Balance
CREATE TABLE IF NOT EXISTS leave_balances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    employee_id UUID NOT NULL,
    leave_type_id UUID NOT NULL,
    year INTEGER NOT NULL,
    opening_balance INTEGER DEFAULT 0,
    allocated INTEGER DEFAULT 0,
    taken INTEGER DEFAULT 0,
    closing_balance INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_leave_balances_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id),
    CONSTRAINT fk_leave_balances_employee FOREIGN KEY (employee_id) REFERENCES employees(id),
    CONSTRAINT fk_leave_balances_type FOREIGN KEY (leave_type_id) REFERENCES leave_types(id),
    CONSTRAINT uk_leave_balances UNIQUE (tenant_id, employee_id, leave_type_id, year)
);

-- Payroll
CREATE TABLE IF NOT EXISTS payroll_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    employee_id UUID NOT NULL,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    basic_salary DECIMAL(15,2) NOT NULL,
    allowances JSONB DEFAULT '{}', -- { housing: 1000, transport: 500, ... }
    deductions JSONB DEFAULT '{}', -- { tax: 500, insurance: 200, ... }
    gross_salary DECIMAL(15,2) NOT NULL,
    net_salary DECIMAL(15,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'draft', -- draft, processed, paid, cancelled
    payment_date DATE,
    payment_reference VARCHAR(200),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_by UUID NOT NULL,

    CONSTRAINT fk_payroll_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id),
    CONSTRAINT fk_payroll_employee FOREIGN KEY (employee_id) REFERENCES employees(id),
    CONSTRAINT uk_payroll_period UNIQUE (tenant_id, employee_id, period_start, period_end)
);

-- Performance Reviews
CREATE TABLE IF NOT EXISTS performance_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    employee_id UUID NOT NULL,
    reviewer_id UUID NOT NULL,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    rating INTEGER, -- 1-5 scale
    strengths TEXT,
    weaknesses TEXT,
    goals TEXT,
    comments TEXT,
    status VARCHAR(50) DEFAULT 'draft', -- draft, in-progress, completed
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_by UUID NOT NULL,

    CONSTRAINT fk_reviews_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id),
    CONSTRAINT fk_reviews_employee FOREIGN KEY (employee_id) REFERENCES employees(id),
    CONSTRAINT fk_reviews_reviewer FOREIGN KEY (reviewer_id) REFERENCES employees(id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_employees_tenant ON employees(tenant_id);
CREATE INDEX IF NOT EXISTS idx_employees_status ON employees(status);
CREATE INDEX IF NOT EXISTS idx_attendance_employee ON attendance(employee_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(date);
CREATE INDEX IF NOT EXISTS idx_leave_requests_employee ON leave_requests(employee_id);
CREATE INDEX IF NOT EXISTS idx_leave_requests_status ON leave_requests(status);
CREATE INDEX IF NOT EXISTS idx_payroll_employee ON payroll_records(employee_id);

-- Triggers
CREATE TRIGGER update_employees_updated_at BEFORE UPDATE ON employees
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_attendance_updated_at BEFORE UPDATE ON attendance
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leave_requests_updated_at BEFORE UPDATE ON leave_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payroll_records_updated_at BEFORE UPDATE ON payroll_records
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
