import { Pool } from 'pg';
import { database } from '../database';
import { AuditService } from './audit.service';

interface KnowledgeBase {
  id: string;
  tenantId: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  categoryId?: string;
  tags: string[];
  authorId: string;
  status: 'draft' | 'published' | 'archived';
  visibility: 'public' | 'internal' | 'restricted';
  views: number;
  likes: number;
  metaTitle?: string;
  metaDescription?: string;
  publishedAt?: Date;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;
  isDeleted: boolean;
  version: number;
}

interface KBFilters {
  page: number;
  limit: number;
  status?: string;
  categoryId?: string;
  search?: string;
  tags?: string[];
  sort: string;
  order: 'ASC' | 'DESC';
  tenantId: string;
}

export class KnowledgeBaseService {
  private pool: Pool;
  private auditService: AuditService;

  constructor() {
    this.pool = database.getPool();
    this.auditService = new AuditService();
  }

  async findAll(filters: KBFilters) {
    const { page, limit, status, categoryId, search, tags, sort, order, tenantId } = filters;
    const offset = (page - 1) * limit;

    let query = `
      SELECT kb.*, u.name as author_name, c.name as category_name
      FROM knowledge_base kb
      LEFT JOIN users u ON u.id = kb.author_id
      LEFT JOIN kb_categories c ON c.id = kb.category_id
      WHERE kb.tenant_id = $1 AND kb.is_deleted = FALSE
    `;

    const values: any[] = [tenantId];
    let paramIndex = 2;

    if (status) {
      query += ` AND kb.status = $${paramIndex}`;
      values.push(status);
      paramIndex++;
    }

    if (categoryId) {
      query += ` AND kb.category_id = $${paramIndex}`;
      values.push(categoryId);
      paramIndex++;
    }

    if (search) {
      query += ` AND (kb.title ILIKE $${paramIndex} OR kb.content ILIKE $${paramIndex})`;
      values.push(`%${search}%`);
      paramIndex++;
    }

    if (tags && tags.length > 0) {
      query += ` AND kb.tags && $${paramIndex}`;
      values.push(tags);
      paramIndex++;
    }

    const countQuery = query.replace('SELECT kb.*, u.name as author_name, c.name as category_name', 'SELECT COUNT(*)');
    const countResult = await this.pool.query(countQuery, values);
    const total = parseInt(countResult.rows[0].count);

    query += ` ORDER BY kb.${sort} ${order} LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    values.push(limit, offset);

    const result = await this.pool.query(query, values);

    return {
      data: result.rows.map(this.mapRowToKB),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string, tenantId: string): Promise<KnowledgeBase | null> {
    const query = `
      SELECT kb.*, u.name as author_name, c.name as category_name
      FROM knowledge_base kb
      LEFT JOIN users u ON u.id = kb.author_id
      LEFT JOIN kb_categories c ON c.id = kb.category_id
      WHERE kb.id = $1 AND kb.tenant_id = $2 AND kb.is_deleted = FALSE
    `;

    const result = await this.pool.query(query, [id, tenantId]);

    if (result.rows.length === 0) {
      return null;
    }

    return this.mapRowToKB(result.rows[0]);
  }

  async findBySlug(slug: string, tenantId: string): Promise<KnowledgeBase | null> {
    const query = `
      SELECT kb.*, u.name as author_name, c.name as category_name
      FROM knowledge_base kb
      LEFT JOIN users u ON u.id = kb.author_id
      LEFT JOIN kb_categories c ON c.id = kb.category_id
      WHERE kb.slug = $1 AND kb.tenant_id = $2 AND kb.is_deleted = FALSE
    `;

    const result = await this.pool.query(query, [slug, tenantId]);

    if (result.rows.length === 0) {
      return null;
    }

    return this.mapRowToKB(result.rows[0]);
  }

  async create(data: Partial<KnowledgeBase>, createdBy: string, tenantId: string) {
    const query = `
      INSERT INTO knowledge_base (
        tenant_id, title, slug, content, excerpt, category_id,
        tags, author_id, status, visibility, meta_title, meta_description,
        created_by, updated_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *
    `;

    const values = [
      tenantId,
      data.title,
      data.slug,
      data.content,
      data.excerpt || null,
      data.categoryId || null,
      data.tags ? JSON.stringify(data.tags) : '[]',
      data.authorId || createdBy,
      data.status || 'draft',
      data.visibility || 'internal',
      data.metaTitle || null,
      data.metaDescription || null,
      createdBy,
      createdBy,
    ];

    const result = await this.pool.query(query, values);

    await this.auditService.log({
      tenantId,
      userId: createdBy,
      action: 'CREATE',
      resourceType: 'knowledge_base',
      resourceId: result.rows[0].id,
      changes: { after: { title: data.title, slug: data.slug } },
    });

    return this.mapRowToKB(result.rows[0]);
  }

  async update(id: string, data: Partial<KnowledgeBase>, updatedBy: string, tenantId: string): Promise<KnowledgeBase | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (data.title !== undefined) {
      fields.push(`title = $${paramIndex++}`);
      values.push(data.title);
    }

    if (data.slug !== undefined) {
      fields.push(`slug = $${paramIndex++}`);
      values.push(data.slug);
    }

    if (data.content !== undefined) {
      fields.push(`content = $${paramIndex++}`);
      values.push(data.content);
    }

    if (data.excerpt !== undefined) {
      fields.push(`excerpt = $${paramIndex++}`);
      values.push(data.excerpt);
    }

    if (data.categoryId !== undefined) {
      fields.push(`category_id = $${paramIndex++}`);
      values.push(data.categoryId);
    }

    if (data.tags !== undefined) {
      fields.push(`tags = $${paramIndex++}`);
      values.push(JSON.stringify(data.tags));
    }

    if (data.status !== undefined) {
      fields.push(`status = $${paramIndex++}`);
      values.push(data.status);
    }

    if (data.visibility !== undefined) {
      fields.push(`visibility = $${paramIndex++}`);
      values.push(data.visibility);
    }

    if (data.metaTitle !== undefined) {
      fields.push(`meta_title = $${paramIndex++}`);
      values.push(data.metaTitle);
    }

    if (data.metaDescription !== undefined) {
      fields.push(`meta_description = $${paramIndex++}`);
      values.push(data.metaDescription);
    }

    if (data.publishedAt !== undefined) {
      fields.push(`published_at = $${paramIndex++}`);
      values.push(data.publishedAt);
    }

    fields.push(`updated_by = $${paramIndex++}`);
    values.push(updatedBy);

    if (fields.length === 0) {
      return this.findById(id, tenantId);
    }

    values.push(id, tenantId);
    const query = `
      UPDATE knowledge_base
      SET ${fields.join(', ')}, updated_at = NOW(), version = version + 1
      WHERE id = $${paramIndex++} AND tenant_id = $${paramIndex} AND is_deleted = FALSE
      RETURNING *
    `;

    const result = await this.pool.query(query, values);

    if (result.rows.length === 0) {
      return null;
    }

    await this.auditService.log({
      tenantId,
      userId: updatedBy,
      action: 'UPDATE',
      resourceType: 'knowledge_base',
      resourceId: id,
      changes: { after: data },
    });

    return this.mapRowToKB(result.rows[0]);
  }

  async delete(id: string, deletedBy: string, tenantId: string): Promise<void> {
    const query = `
      UPDATE knowledge_base
      SET is_deleted = TRUE, updated_by = $1, updated_at = NOW()
      WHERE id = $2 AND tenant_id = $3 AND is_deleted = FALSE
    `;

    const result = await this.pool.query(query, [deletedBy, id, tenantId]);

    if (result.rows.length === 0) {
      throw new Error('Article not found');
    }

    await this.auditService.log({
      tenantId,
      userId: deletedBy,
      action: 'DELETE',
      resourceType: 'knowledge_base',
      resourceId: id,
    });
  }

  async incrementViews(id: string, tenantId: string): Promise<void> {
    const query = `
      UPDATE knowledge_base
      SET views = views + 1
      WHERE id = $1 AND tenant_id = $2 AND is_deleted = FALSE
    `;

    await this.pool.query(query, [id, tenantId]);
  }

  async addFeedback(id: string, userId: string, rating: 'helpful' | 'not-helpful', comment?: string): Promise<void> {
    const query = `
      INSERT INTO kb_feedback (article_id, user_id, rating, comment)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (article_id, user_id) DO UPDATE SET rating = $3, comment = $4
    `;

    await this.pool.query(query, [id, userId, rating, comment || null]);

    // Update likes count
    if (rating === 'helpful') {
      const updateQuery = `
        UPDATE knowledge_base
        SET likes = likes + 1
        WHERE id = $1
      `;
      await this.pool.query(updateQuery, [id]);
    }
  }

  async getCategories(tenantId: string): Promise<any[]> {
    const query = `
      SELECT c.*, COUNT(kb.id) as article_count
      FROM kb_categories c
      LEFT JOIN knowledge_base kb ON kb.category_id = c.id AND kb.is_deleted = FALSE
      WHERE c.tenant_id = $1 AND c.is_deleted = FALSE
      GROUP BY c.id
      ORDER BY c.name
    `;

    const result = await this.pool.query(query, [tenantId]);
    return result.rows;
  }

  private mapRowToKB(row: any): KnowledgeBase {
    return {
      id: row.id,
      tenantId: row.tenant_id,
      title: row.title,
      slug: row.slug,
      content: row.content,
      excerpt: row.excerpt,
      categoryId: row.category_id,
      tags: row.tags || [],
      authorId: row.author_id,
      status: row.status,
      visibility: row.visibility,
      views: row.views || 0,
      likes: row.likes || 0,
      metaTitle: row.meta_title,
      metaDescription: row.meta_description,
      publishedAt: row.published_at,
      createdAt: row.created_at,
      createdBy: row.created_by,
      updatedAt: row.updated_at,
      updatedBy: row.updated_by,
      isDeleted: row.is_deleted,
      version: row.version,
    };
  }
}
