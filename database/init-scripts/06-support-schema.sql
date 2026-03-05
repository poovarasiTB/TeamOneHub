-- ═══════════════════════════════════════════════════════════════════
-- TeamOne Support Hub Database Schema
-- ═══════════════════════════════════════════════════════════════════

-- Tickets
CREATE TABLE IF NOT EXISTS tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    ticket_number VARCHAR(50) NOT NULL,
    subject VARCHAR(500) NOT NULL,
    description TEXT NOT NULL,
    type VARCHAR(50) NOT NULL, -- incident, service-request, problem, change
    category VARCHAR(100),
    subcategory VARCHAR(100),
    priority VARCHAR(50) NOT NULL, -- low, medium, high, urgent
    status VARCHAR(50) NOT NULL DEFAULT 'new', -- new, open, pending, on-hold, resolved, closed
    channel VARCHAR(50), -- portal, email, phone, chat, walk-in
    requester_type VARCHAR(50), -- employee, customer, vendor
    requester_id UUID,
    requester_email VARCHAR(255),
    requester_name VARCHAR(200),
    assignee_id UUID,
    group_id UUID,
    asset_id UUID,
    sla_id UUID,
    due_date TIMESTAMPTZ,
    first_response_at TIMESTAMPTZ,
    resolved_at TIMESTAMPTZ,
    closed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_by UUID NOT NULL,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    version INTEGER NOT NULL DEFAULT 1,
    
    CONSTRAINT fk_tickets_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id),
    CONSTRAINT fk_tickets_assignee FOREIGN KEY (assignee_id) REFERENCES users(id),
    CONSTRAINT uk_tickets_number UNIQUE (tenant_id, ticket_number)
);

-- Ticket Comments
CREATE TABLE IF NOT EXISTS ticket_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID NOT NULL,
    user_id UUID NOT NULL,
    comment_type VARCHAR(50) NOT NULL, -- public, internal, system
    content TEXT NOT NULL,
    is_html BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT fk_comments_ticket FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
    CONSTRAINT fk_comments_user FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Ticket Attachments
CREATE TABLE IF NOT EXISTS ticket_attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_size INTEGER NOT NULL,
    mime_type VARCHAR(100),
    file_url VARCHAR(500) NOT NULL,
    uploaded_by UUID NOT NULL,
    uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT fk_attachments_ticket FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE
);

-- SLA Policies
CREATE TABLE IF NOT EXISTS sla_policies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    ticket_type VARCHAR(50),
    priority VARCHAR(50),
    response_time_minutes INTEGER,
    resolution_time_minutes INTEGER,
    business_hours_id UUID,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_by UUID NOT NULL,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    version INTEGER NOT NULL DEFAULT 1,
    
    CONSTRAINT fk_sla_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id)
);

-- Knowledge Base Articles
CREATE TABLE IF NOT EXISTS knowledge_base (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    category_id UUID,
    tags TEXT[],
    author_id UUID NOT NULL,
    status VARCHAR(50) DEFAULT 'draft', -- draft, published, archived
    visibility VARCHAR(50) DEFAULT 'internal', -- public, internal, restricted
    views INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    meta_title VARCHAR(200),
    meta_description TEXT,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_by UUID NOT NULL,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    version INTEGER NOT NULL DEFAULT 1,
    
    CONSTRAINT fk_kb_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id),
    CONSTRAINT fk_kb_author FOREIGN KEY (author_id) REFERENCES users(id),
    CONSTRAINT uk_kb_slug UNIQUE (tenant_id, slug)
);

-- KB Article Feedback
CREATE TABLE IF NOT EXISTS kb_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    article_id UUID NOT NULL,
    user_id UUID NOT NULL,
    rating VARCHAR(20) NOT NULL, -- helpful, not-helpful
    comment TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT fk_feedback_article FOREIGN KEY (article_id) REFERENCES knowledge_base(id) ON DELETE CASCADE,
    CONSTRAINT uk_feedback_user_article UNIQUE (article_id, user_id)
);

-- Create indexes
CREATE INDEX idx_tickets_tenant ON tickets(tenant_id);
CREATE INDEX idx_tickets_status ON tickets(status);
CREATE INDEX idx_tickets_priority ON tickets(priority);
CREATE INDEX idx_tickets_assignee ON tickets(assignee_id);
CREATE INDEX idx_tickets_requester ON tickets(requester_id);
CREATE INDEX idx_tickets_created ON tickets(created_at DESC);
CREATE INDEX idx_ticket_comments_ticket ON ticket_comments(ticket_id);
CREATE INDEX idx_ticket_attachments_ticket ON ticket_attachments(ticket_id);
CREATE INDEX idx_sla_tenant ON sla_policies(tenant_id);
CREATE INDEX idx_sla_active ON sla_policies(is_active);
CREATE INDEX idx_kb_tenant ON knowledge_base(tenant_id);
CREATE INDEX idx_kb_status ON knowledge_base(status);
CREATE INDEX idx_kb_category ON knowledge_base(category_id);
CREATE INDEX idx_kb_slug ON knowledge_base(slug);
CREATE INDEX idx_kb_feedback_article ON kb_feedback(article_id);

-- Create indexes for audit queries
CREATE INDEX idx_tickets_created_by ON tickets(created_by);
CREATE INDEX idx_kb_created_by ON knowledge_base(created_by);
CREATE INDEX idx_sla_created_by ON sla_policies(created_by);
