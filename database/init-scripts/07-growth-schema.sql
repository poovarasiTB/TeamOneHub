-- ═══════════════════════════════════════════════════════════════════
-- TeamOne Growth Hub Database Schema
-- ═══════════════════════════════════════════════════════════════════

-- Wiki Articles
CREATE TABLE IF NOT EXISTS wiki_articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    content_html TEXT,
    excerpt TEXT,
    category_id UUID,
    parent_id UUID,
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
    
    CONSTRAINT fk_wiki_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id),
    CONSTRAINT fk_wiki_author FOREIGN KEY (author_id) REFERENCES users(id),
    CONSTRAINT fk_wiki_parent FOREIGN KEY (parent_id) REFERENCES wiki_articles(id),
    CONSTRAINT uk_wiki_slug UNIQUE (tenant_id, slug)
);

-- Wiki Categories
CREATE TABLE IF NOT EXISTS wiki_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(200) NOT NULL,
    parent_id UUID,
    description TEXT,
    icon VARCHAR(100),
    color VARCHAR(50),
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_by UUID NOT NULL,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    
    CONSTRAINT fk_wiki_cat_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id),
    CONSTRAINT fk_wiki_cat_parent FOREIGN KEY (parent_id) REFERENCES wiki_categories(id),
    CONSTRAINT uk_wiki_cat_slug UNIQUE (tenant_id, slug)
);

-- Meetings
CREATE TABLE IF NOT EXISTS meetings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    meeting_type VARCHAR(50), -- one-on-one, team, client, interview, other
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    timezone VARCHAR(50) DEFAULT 'UTC',
    location_type VARCHAR(50), -- office, video, phone
    location VARCHAR(200),
    video_link VARCHAR(500),
    organizer_id UUID NOT NULL,
    status VARCHAR(50) DEFAULT 'scheduled', -- scheduled, completed, cancelled
    recording_url VARCHAR(500),
    transcript TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_by UUID NOT NULL,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    version INTEGER NOT NULL DEFAULT 1,
    
    CONSTRAINT fk_meetings_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id),
    CONSTRAINT fk_meetings_organizer FOREIGN KEY (organizer_id) REFERENCES users(id)
);

-- Meeting Attendees
CREATE TABLE IF NOT EXISTS meeting_attendees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    meeting_id UUID NOT NULL,
    user_id UUID NOT NULL,
    status VARCHAR(50) DEFAULT 'pending', -- pending, accepted, declined
    response_at TIMESTAMPTZ,
    
    CONSTRAINT fk_attendees_meeting FOREIGN KEY (meeting_id) REFERENCES meetings(id) ON DELETE CASCADE,
    CONSTRAINT fk_attendees_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT uk_attendees UNIQUE (meeting_id, user_id)
);

-- Meeting Action Items
CREATE TABLE IF NOT EXISTS meeting_action_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    meeting_id UUID NOT NULL,
    description TEXT NOT NULL,
    assignee_id UUID,
    due_date DATE,
    status VARCHAR(50) DEFAULT 'open', -- open, in-progress, completed
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID NOT NULL,
    
    CONSTRAINT fk_action_items_meeting FOREIGN KEY (meeting_id) REFERENCES meetings(id) ON DELETE CASCADE,
    CONSTRAINT fk_action_items_assignee FOREIGN KEY (assignee_id) REFERENCES users(id)
);

-- Marketing Campaigns
CREATE TABLE IF NOT EXISTS marketing_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    type VARCHAR(50), -- email, social, multi-channel
    status VARCHAR(50) DEFAULT 'draft', -- draft, scheduled, active, paused, completed
    start_date DATE,
    end_date DATE,
    budget DECIMAL(15,2),
    actual_cost DECIMAL(15,2),
    target_audience JSONB,
    metrics JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_by UUID NOT NULL,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    version INTEGER NOT NULL DEFAULT 1,
    
    CONSTRAINT fk_campaigns_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id)
);

-- Ideas (Innovation)
CREATE TABLE IF NOT EXISTS ideas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    title VARCHAR(500) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100),
    submitter_id UUID NOT NULL,
    status VARCHAR(50) DEFAULT 'submitted', -- submitted, under-review, approved, in-progress, implemented, rejected
    upvotes INTEGER DEFAULT 0,
    downvotes INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    implemented_at TIMESTAMPTZ,
    impact_score INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_by UUID NOT NULL,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    version INTEGER NOT NULL DEFAULT 1,
    
    CONSTRAINT fk_ideas_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id),
    CONSTRAINT fk_ideas_submitter FOREIGN KEY (submitter_id) REFERENCES users(id)
);

-- Idea Votes
CREATE TABLE IF NOT EXISTS idea_votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    idea_id UUID NOT NULL,
    user_id UUID NOT NULL,
    vote_type VARCHAR(10) NOT NULL, -- up, down
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT fk_votes_idea FOREIGN KEY (idea_id) REFERENCES ideas(id) ON DELETE CASCADE,
    CONSTRAINT fk_votes_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT uk_votes UNIQUE (idea_id, user_id)
);

-- Create indexes
CREATE INDEX idx_wiki_tenant ON wiki_articles(tenant_id);
CREATE INDEX idx_wiki_status ON wiki_articles(status);
CREATE INDEX idx_wiki_category ON wiki_articles(category_id);
CREATE INDEX idx_wiki_slug ON wiki_articles(slug);
CREATE INDEX idx_wiki_categories_tenant ON wiki_categories(tenant_id);
CREATE INDEX idx_meetings_tenant ON meetings(tenant_id);
CREATE INDEX idx_meetings_organizer ON meetings(organizer_id);
CREATE INDEX idx_meetings_start_time ON meetings(start_time);
CREATE INDEX idx_meeting_attendees_meeting ON meeting_attendees(meeting_id);
CREATE INDEX idx_meeting_action_items_meeting ON meeting_action_items(meeting_id);
CREATE INDEX idx_campaigns_tenant ON marketing_campaigns(tenant_id);
CREATE INDEX idx_campaigns_status ON marketing_campaigns(status);
CREATE INDEX idx_ideas_tenant ON ideas(tenant_id);
CREATE INDEX idx_ideas_status ON ideas(status);
CREATE INDEX idx_idea_votes_idea ON idea_votes(idea_id);

-- Create indexes for audit queries
CREATE INDEX idx_wiki_created_by ON wiki_articles(created_by);
CREATE INDEX idx_meetings_created_by ON meetings(created_by);
CREATE INDEX idx_campaigns_created_by ON marketing_campaigns(created_by);
CREATE INDEX idx_ideas_created_by ON ideas(created_by);
