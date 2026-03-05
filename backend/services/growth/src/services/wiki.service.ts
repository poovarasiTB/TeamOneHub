import { Pool } from 'pg';
import { database } from '../database';
import { logger } from '../utils/logger';

interface WikiArticle {
  id: string;
  tenantId: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  categoryId?: string;
  tags?: string[];
  authorId: string;
  status: 'draft' | 'published' | 'archived';
  visibility: 'public' | 'internal' | 'restricted';
  views: number;
  likes: number;
  publishedAt?: Date;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;
  isDeleted: boolean;
  version: number;
  metaTitle?: string;
  metaDescription?: string;
  categoryName?: string;
}

export class WikiService {
  private pool: Pool;

  constructor() {
    this.pool = database.getPool();
  }

  async findAll(filters: any) {
    const { page = 1, limit = 20, category, search, status, tenantId } = filters;
    const offset = (page - 1) * limit;

    let query = `
      SELECT a.*, c.name as category_name
      FROM wiki_articles a
      LEFT JOIN wiki_categories c ON c.id = a.category_id
      WHERE a.tenant_id = $1 AND a.is_deleted = FALSE
    `;
    
    const values: any[] = [tenantId];
    let paramIndex = 2;

    if (status) {
      query += ` AND a.status = $${paramIndex}`;
      values.push(status);
      paramIndex++;
    }

    if (category) {
      query += ` AND a.category_id = $${paramIndex}`;
      values.push(category);
      paramIndex++;
    }

    if (search) {
      query += ` AND (a.title ILIKE $${paramIndex} OR a.content ILIKE $${paramIndex})`;
      values.push(`%${search}%`);
      paramIndex++;
    }

    const countQuery = query.replace('SELECT a.*, c.name as category_name', 'SELECT COUNT(*)');
    const countResult = await this.pool.query(countQuery, values);
    const total = parseInt(countResult.rows[0].count);

    query += ` ORDER BY a.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    values.push(limit, offset);

    const result = await this.pool.query(query, values);

    return {
      data: result.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string, tenantId: string): Promise<WikiArticle | null> {
    const query = `
      SELECT a.*, c.name as category_name
      FROM wiki_articles a
      LEFT JOIN wiki_categories c ON c.id = a.category_id
      WHERE a.id = $1 AND a.tenant_id = $2 AND a.is_deleted = FALSE
    `;
    
    const result = await this.pool.query(query, [id, tenantId]);
    return result.rows[0] || null;
  }

  async create(data: Partial<WikiArticle>, userId: string, tenantId: string): Promise<WikiArticle> {
    const query = `
      INSERT INTO wiki_articles (
        tenant_id, title, slug, content, excerpt, category_id,
        tags, author_id, status, visibility, meta_title,
        meta_description, published_at, created_by, updated_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING *
    `;

    const values = [
      tenantId,
      data.title,
      data.slug || this.generateSlug(data.title!),
      data.content,
      data.excerpt,
      data.categoryId,
      data.tags ? JSON.stringify(data.tags) : null,
      userId,
      data.status || 'draft',
      data.visibility || 'internal',
      data.metaTitle,
      data.metaDescription,
      data.publishedAt,
      userId,
      userId,
    ];

    const result = await this.pool.query(query, values);
    logger.info(`Wiki article created: ${result.rows[0].id}`);
    return result.rows[0];
  }

  async update(id: string, data: Partial<WikiArticle>, userId: string, tenantId: string): Promise<WikiArticle> {
    const current = await this.findById(id, tenantId);
    if (!current) throw new Error('Article not found');

    const query = `
      UPDATE wiki_articles 
      SET 
        title = COALESCE($1, title),
        slug = COALESCE($2, slug),
        content = COALESCE($3, content),
        excerpt = COALESCE($4, excerpt),
        category_id = COALESCE($5, category_id),
        tags = COALESCE($6, tags),
        status = COALESCE($7, status),
        visibility = COALESCE($8, visibility),
        meta_title = COALESCE($9, meta_title),
        meta_description = COALESCE($10, meta_description),
        published_at = COALESCE($11, published_at),
        updated_by = $12,
        updated_at = NOW(),
        version = version + 1
      WHERE id = $13 AND tenant_id = $14 AND is_deleted = FALSE
      RETURNING *
    `;

    const values = [
      data.title,
      data.slug,
      data.content,
      data.excerpt,
      data.categoryId,
      data.tags ? JSON.stringify(data.tags) : null,
      data.status,
      data.visibility,
      data.metaTitle,
      data.metaDescription,
      data.publishedAt,
      userId,
      id,
      tenantId,
    ];

    const result = await this.pool.query(query, values);
    logger.info(`Wiki article updated: ${id}`);
    return result.rows[0];
  }

  async delete(id: string, userId: string, tenantId: string): Promise<void> {
    const query = `
      UPDATE wiki_articles
      SET is_deleted = TRUE, deleted_by = $1, deleted_at = NOW()
      WHERE id = $2 AND tenant_id = $3
    `;
    await this.pool.query(query, [userId, id, tenantId]);
    logger.info(`Wiki article deleted: ${id}`);
  }

  async publish(id: string, userId: string, tenantId: string): Promise<WikiArticle | null> {
    return this.update(id, { status: 'published', publishedAt: new Date() }, userId, tenantId);
  }

  async getCategories(tenantId: string) {
    const query = `
      SELECT c.*, COUNT(a.id) as article_count
      FROM wiki_categories c
      LEFT JOIN wiki_articles a ON a.category_id = c.id AND a.is_deleted = FALSE
      WHERE c.tenant_id = $1 AND c.is_deleted = FALSE
      GROUP BY c.id
      ORDER BY c.sort_order, c.name
    `;

    const result = await this.pool.query(query, [tenantId]);
    return result.rows;
  }

  async incrementViews(id: string): Promise<void> {
    const query = `UPDATE wiki_articles SET views = views + 1 WHERE id = $1`;
    await this.pool.query(query, [id]);
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
}
