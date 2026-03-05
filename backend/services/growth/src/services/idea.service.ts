import { Pool } from 'pg';
import { database } from '../database';
import { AuditService } from './audit.service';

interface Idea {
  id: string;
  tenantId: string;
  title: string;
  description: string;
  category?: string;
  submitterId: string;
  status: 'submitted' | 'under-review' | 'approved' | 'in-progress' | 'implemented' | 'rejected';
  upvotes: number;
  downvotes: number;
  commentsCount: number;
  implementedAt?: Date;
  impactScore?: number;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;
  isDeleted: boolean;
  version: number;
}

export class IdeaService {
  private pool: Pool;
  private auditService: AuditService;

  constructor() {
    this.pool = database.getPool();
    this.auditService = new AuditService();
  }

  async findAll(filters: any) {
    const { page = 1, limit = 20, status, category, search, sort = 'created_at', order = 'DESC', tenantId } = filters;
    const offset = (page - 1) * limit;

    let query = `SELECT i.*, u.name as submitter_name FROM ideas i LEFT JOIN users u ON u.id = i.submitter_id WHERE i.tenant_id = $1 AND i.is_deleted = FALSE`;
    const values: any[] = [tenantId];
    let paramIndex = 2;

    if (status) { query += ` AND i.status = $${paramIndex}`; values.push(status); paramIndex++; }
    if (category) { query += ` AND i.category = $${paramIndex}`; values.push(category); paramIndex++; }
    if (search) { query += ` AND (i.title ILIKE $${paramIndex} OR i.description ILIKE $${paramIndex})`; values.push(`%${search}%`); paramIndex++; }

    const countQuery = query.replace('SELECT i.*, u.name as submitter_name', 'SELECT COUNT(*)');
    const countResult = await this.pool.query(countQuery, values);
    const total = parseInt(countResult.rows[0].count);

    query += ` ORDER BY ${sort} ${order} LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    values.push(limit, offset);

    const result = await this.pool.query(query, values);
    return {
      data: result.rows.map(this.mapRowToIdea),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async findById(id: string, tenantId: string): Promise<Idea | null> {
    const query = `SELECT i.*, u.name as submitter_name FROM ideas i LEFT JOIN users u ON u.id = i.submitter_id WHERE i.id = $1 AND tenant_id = $2 AND i.is_deleted = FALSE`;
    const result = await this.pool.query(query, [id, tenantId]);
    return result.rows.length ? this.mapRowToIdea(result.rows[0]) : null;
  }

  async create(data: Partial<Idea>, createdBy: string, tenantId: string) {
    const query = `
      INSERT INTO ideas (tenant_id, title, description, category, submitter_id, status, created_by, updated_by)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *
    `;
    const values = [tenantId, data.title, data.description, data.category, data.submitterId || createdBy, data.status || 'submitted', createdBy, createdBy];
    const result = await this.pool.query(query, values);
    await this.auditService.log({ tenantId, userId: createdBy, action: 'CREATE', entityType: 'idea', entityId: result.rows[0].id, changes: { title: data.title } });
    return this.mapRowToIdea(result.rows[0]);
  }

  async update(id: string, data: Partial<Idea>, updatedBy: string, tenantId: string): Promise<Idea | null> {
    const fields: string[] = [], values: any[] = [];
    let i = 1;
    const setField = (key: string, val: any) => { if (val !== undefined) { fields.push(`${key} = $${i++}`); values.push(val); } };
    setField('title', data.title); setField('description', data.description); setField('category', data.category);
    setField('status', data.status); setField('impact_score', data.impactScore);
    if (data.implementedAt !== undefined) { fields.push(`implemented_at = $${i++}`); values.push(data.implementedAt); }
    fields.push(`updated_by = $${i++}`); values.push(updatedBy);
    if (!fields.length) return this.findById(id, tenantId);
    values.push(id, tenantId);
    const query = `UPDATE ideas SET ${fields.join(', ')}, updated_at = NOW(), version = version + 1 WHERE id = $${i++} AND tenant_id = $${i} AND is_deleted = FALSE RETURNING *`;
    const result = await this.pool.query(query, values);
    if (!result.rows.length) return null;
    await this.auditService.log({ tenantId, userId: updatedBy, action: 'UPDATE', entityType: 'idea', entityId: id, changes: data });
    return this.mapRowToIdea(result.rows[0]);
  }

  async delete(id: string, deletedBy: string, tenantId: string) {
    const query = `UPDATE ideas SET is_deleted = TRUE, updated_by = $1, updated_at = NOW() WHERE id = $2 AND tenant_id = $3 AND is_deleted = FALSE`;
    const result = await this.pool.query(query, [deletedBy, id, tenantId]);
    if (!result.rows.length) throw new Error('Idea not found');
    await this.auditService.log({ tenantId, userId: deletedBy, action: 'DELETE', entityType: 'idea', entityId: id });
  }

  async vote(id: string, userId: string, voteType: 'up' | 'down', tenantId: string) {
    // Check existing vote
    const existingQuery = `SELECT * FROM idea_votes WHERE idea_id = $1 AND user_id = $2`;
    const existing = await this.pool.query(existingQuery, [id, userId]);
    
    if (existing.rows.length) {
      // Update existing vote
      const updateQuery = `UPDATE idea_votes SET vote_type = $1, created_at = NOW() WHERE idea_id = $2 AND user_id = $3`;
      await this.pool.query(updateQuery, [voteType, id, userId]);
    } else {
      // Insert new vote
      const insertQuery = `INSERT INTO idea_votes (idea_id, user_id, vote_type) VALUES ($1, $2, $3)`;
      await this.pool.query(insertQuery, [id, userId, voteType]);
    }

    // Recalculate votes
    const votesQuery = `SELECT vote_type, COUNT(*) as count FROM idea_votes WHERE idea_id = $1 GROUP BY vote_type`;
    const votesResult = await this.pool.query(votesQuery, [id]);
    const upvotes = votesResult.rows.find((r: any) => r.vote_type === 'up')?.count || 0;
    const downvotes = votesResult.rows.find((r: any) => r.vote_type === 'down')?.count || 0;

    // Update idea vote counts
    const updateIdeaQuery = `UPDATE ideas SET upvotes = $1, downvotes = $2, updated_at = NOW() WHERE id = $3`;
    await this.pool.query(updateIdeaQuery, [upvotes, downvotes, id]);

    return this.findById(id, tenantId);
  }

  async removeVote(id: string, userId: string, tenantId: string) {
    const deleteQuery = `DELETE FROM idea_votes WHERE idea_id = $1 AND user_id = $2`;
    await this.pool.query(deleteQuery, [id, userId]);

    // Recalculate votes
    const votesQuery = `SELECT vote_type, COUNT(*) as count FROM idea_votes WHERE idea_id = $1 GROUP BY vote_type`;
    const votesResult = await this.pool.query(votesQuery, [id]);
    const upvotes = votesResult.rows.find((r: any) => r.vote_type === 'up')?.count || 0;
    const downvotes = votesResult.rows.find((r: any) => r.vote_type === 'down')?.count || 0;

    const updateIdeaQuery = `UPDATE ideas SET upvotes = $1, downvotes = $2, updated_at = NOW() WHERE id = $3`;
    await this.pool.query(updateIdeaQuery, [upvotes, downvotes, id]);

    return this.findById(id, tenantId);
  }

  private mapRowToIdea(row: any): Idea {
    return {
      id: row.id, tenantId: row.tenant_id, title: row.title, description: row.description,
      category: row.category, submitterId: row.submitter_id, status: row.status,
      upvotes: row.upvotes || 0, downvotes: row.downvotes || 0, commentsCount: row.comments_count || 0,
      implementedAt: row.implemented_at, impactScore: row.impact_score,
      createdAt: row.created_at, createdBy: row.created_by, updatedAt: row.updated_at, updatedBy: row.updated_by,
      isDeleted: row.is_deleted, version: row.version,
    };
  }
}
