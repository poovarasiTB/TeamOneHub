import { Pool } from 'pg';
import { database } from '../database';
import { AuditService } from './audit.service';

interface Whiteboard {
  id: string;
  tenantId: string;
  projectId?: string;
  name: string;
  content?: any;
  collaborators: string[];
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;
  isDeleted: boolean;
  version: number;
}

interface WhiteboardFilters {
  page: number;
  limit: number;
  projectId?: string;
  search?: string;
  sort: string;
  order: 'ASC' | 'DESC';
  tenantId: string;
}

export class WhiteboardService {
  private pool: Pool;
  private auditService: AuditService;

  constructor() {
    this.pool = database.getPool();
    this.auditService = new AuditService();
  }

  /**
   * Find all whiteboards with filtering and pagination
   */
  async findAll(filters: WhiteboardFilters) {
    const { page, limit, projectId, search, sort, order, tenantId } = filters;
    const offset = (page - 1) * limit;

    let query = `
      SELECT * FROM whiteboards
      WHERE tenant_id = $1
        AND is_deleted = FALSE
    `;

    const values: any[] = [tenantId];
    let paramIndex = 2;

    if (projectId) {
      query += ` AND (project_id = $${paramIndex} OR project_id IS NULL)`;
      values.push(projectId);
      paramIndex++;
    }

    if (search) {
      query += ` AND name ILIKE $${paramIndex}`;
      values.push(`%${search}%`);
      paramIndex++;
    }

    // Get total count
    const countQuery = query.replace('SELECT *', 'SELECT COUNT(*)');
    const countResult = await this.pool.query(countQuery, values);
    const total = parseInt(countResult.rows[0].count);

    // Add pagination and sorting
    query += ` ORDER BY ${sort} ${order} LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    values.push(limit, offset);

    const result = await this.pool.query(query, values);

    return {
      data: result.rows.map(this.mapRowToWhiteboard),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Find whiteboard by ID
   */
  async findById(id: string, tenantId: string): Promise<Whiteboard | null> {
    const query = `
      SELECT * FROM whiteboards
      WHERE id = $1 AND tenant_id = $2 AND is_deleted = FALSE
    `;

    const result = await this.pool.query(query, [id, tenantId]);

    if (result.rows.length === 0) {
      return null;
    }

    return this.mapRowToWhiteboard(result.rows[0]);
  }

  /**
   * Create new whiteboard
   */
  async create(data: Partial<Whiteboard>, createdBy: string, tenantId: string) {
    const query = `
      INSERT INTO whiteboards (
        tenant_id, project_id, name, content, collaborators,
        created_by, updated_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;

    const values = [
      tenantId,
      data.projectId || null,
      data.name,
      data.content ? JSON.stringify(data.content) : null,
      data.collaborators ? JSON.stringify(data.collaborators) : '[]',
      createdBy,
      createdBy,
    ];

    const result = await this.pool.query(query, values);

    // Audit log
    await this.auditService.log({
      tenantId,
      userId: createdBy,
      action: 'CREATE',
      resourceType: 'whiteboard',
      resourceId: result.rows[0].id,
      changes: { after: { name: data.name } },
    });

    return this.mapRowToWhiteboard(result.rows[0]);
  }

  /**
   * Update whiteboard
   */
  async update(
    id: string,
    data: Partial<Whiteboard>,
    updatedBy: string,
    tenantId: string
  ): Promise<Whiteboard | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (data.name !== undefined) {
      fields.push(`name = $${paramIndex++}`);
      values.push(data.name);
    }

    if (data.content !== undefined) {
      fields.push(`content = $${paramIndex++}`);
      values.push(JSON.stringify(data.content));
    }

    if (data.collaborators !== undefined) {
      fields.push(`collaborators = $${paramIndex++}`);
      values.push(JSON.stringify(data.collaborators));
    }

    if (data.projectId !== undefined) {
      fields.push(`project_id = $${paramIndex++}`);
      values.push(data.projectId);
    }

    fields.push(`updated_by = $${paramIndex++}`);
    values.push(updatedBy);

    if (fields.length === 0) {
      return this.findById(id, tenantId);
    }

    values.push(id, tenantId);
    const query = `
      UPDATE whiteboards
      SET ${fields.join(', ')}, updated_at = NOW(), version = version + 1
      WHERE id = $${paramIndex++} AND tenant_id = $${paramIndex} AND is_deleted = FALSE
      RETURNING *
    `;

    const result = await this.pool.query(query, values);

    if (result.rows.length === 0) {
      return null;
    }

    // Audit log
    await this.auditService.log({
      tenantId,
      userId: updatedBy,
      action: 'UPDATE',
      resourceType: 'whiteboard',
      resourceId: id,
      changes: { after: data },
    });

    return this.mapRowToWhiteboard(result.rows[0]);
  }

  /**
   * Delete whiteboard (soft delete)
   */
  async delete(id: string, deletedBy: string, tenantId: string): Promise<void> {
    const query = `
      UPDATE whiteboards
      SET is_deleted = TRUE, updated_by = $1, updated_at = NOW()
      WHERE id = $2 AND tenant_id = $3 AND is_deleted = FALSE
    `;

    const result = await this.pool.query(query, [deletedBy, id, tenantId]);

    if (result.rows.length === 0) {
      throw new Error('Whiteboard not found');
    }

    // Audit log
    await this.auditService.log({
      tenantId,
      userId: deletedBy,
      action: 'DELETE',
      resourceType: 'whiteboard',
      resourceId: id,
    });
  }

  /**
   * Add collaborator to whiteboard
   */
  async addCollaborator(
    id: string,
    userId: string,
    actorId: string,
    tenantId: string
  ): Promise<Whiteboard | null> {
    const whiteboard = await this.findById(id, tenantId);
    if (!whiteboard) {
      return null;
    }

    const collaborators = whiteboard.collaborators.includes(userId)
      ? whiteboard.collaborators
      : [...whiteboard.collaborators, userId];

    return this.update(id, { collaborators }, actorId, tenantId);
  }

  /**
   * Remove collaborator from whiteboard
   */
  async removeCollaborator(
    id: string,
    userId: string,
    actorId: string,
    tenantId: string
  ): Promise<Whiteboard | null> {
    const whiteboard = await this.findById(id, tenantId);
    if (!whiteboard) {
      return null;
    }

    const collaborators = whiteboard.collaborators.filter((c) => c !== userId);

    return this.update(id, { collaborators }, actorId, tenantId);
  }

  /**
   * Get whiteboard content
   */
  async getContent(id: string, tenantId: string): Promise<any | null> {
    const whiteboard = await this.findById(id, tenantId);
    return whiteboard?.content || null;
  }

  /**
   * Update whiteboard content (for real-time collaboration)
   */
  async updateContent(
    id: string,
    content: any,
    updatedBy: string,
    tenantId: string
  ): Promise<Whiteboard | null> {
    return this.update(id, { content }, updatedBy, tenantId);
  }

  private mapRowToWhiteboard(row: any): Whiteboard {
    return {
      id: row.id,
      tenantId: row.tenant_id,
      projectId: row.project_id,
      name: row.name,
      content: row.content,
      collaborators: row.collaborators || [],
      createdAt: row.created_at,
      createdBy: row.created_by,
      updatedAt: row.updated_at,
      updatedBy: row.updated_by,
      isDeleted: row.is_deleted,
      version: row.version,
    };
  }
}
