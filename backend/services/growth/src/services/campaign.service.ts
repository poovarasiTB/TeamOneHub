import { Pool } from 'pg';
import { database } from '../database';
import { AuditService } from './audit.service';

interface Campaign {
  id: string;
  tenantId: string;
  name: string;
  description?: string;
  type?: string;
  status: 'draft' | 'scheduled' | 'active' | 'paused' | 'completed';
  startDate?: Date;
  endDate?: Date;
  budget?: number;
  actualCost?: number;
  targetAudience?: any;
  metrics?: any;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;
  isDeleted: boolean;
  version: number;
}

export class CampaignService {
  private pool: Pool;
  private auditService: AuditService;

  constructor() {
    this.pool = database.getPool();
    this.auditService = new AuditService();
  }

  async findAll(filters: any) {
    const { page = 1, limit = 20, status, type, search, tenantId } = filters;
    const offset = (page - 1) * limit;

    let query = `SELECT * FROM marketing_campaigns WHERE tenant_id = $1 AND is_deleted = FALSE`;
    const values: any[] = [tenantId];
    let paramIndex = 2;

    if (status) {
      query += ` AND status = $${paramIndex}`;
      values.push(status);
      paramIndex++;
    }

    if (type) {
      query += ` AND type = $${paramIndex}`;
      values.push(type);
      paramIndex++;
    }

    if (search) {
      query += ` AND (name ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`;
      values.push(`%${search}%`);
      paramIndex++;
    }

    const countQuery = query.replace('SELECT *', 'SELECT COUNT(*)');
    const countResult = await this.pool.query(countQuery, values);
    const total = parseInt(countResult.rows[0].count);

    query += ` ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    values.push(limit, offset);

    const result = await this.pool.query(query, values);

    return {
      data: result.rows.map(this.mapRowToCampaign),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async findById(id: string, tenantId: string): Promise<Campaign | null> {
    const query = `SELECT * FROM marketing_campaigns WHERE id = $1 AND tenant_id = $2 AND is_deleted = FALSE`;
    const result = await this.pool.query(query, [id, tenantId]);
    return result.rows.length ? this.mapRowToCampaign(result.rows[0]) : null;
  }

  async create(data: Partial<Campaign>, createdBy: string, tenantId: string) {
    const query = `
      INSERT INTO marketing_campaigns (tenant_id, name, description, type, status, start_date, end_date, budget, actual_cost, target_audience, metrics, created_by, updated_by)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *
    `;
    const values = [
      tenantId, data.name, data.description, data.type, data.status || 'draft',
      data.startDate, data.endDate, data.budget, data.actualCost,
      data.targetAudience ? JSON.stringify(data.targetAudience) : null,
      data.metrics ? JSON.stringify(data.metrics) : null,
      createdBy, createdBy,
    ];
    const result = await this.pool.query(query, values);
    await this.auditService.log({ tenantId, userId: createdBy, action: 'CREATE', entityType: 'campaign', entityId: result.rows[0].id, changes: { name: data.name } });
    return this.mapRowToCampaign(result.rows[0]);
  }

  async update(id: string, data: Partial<Campaign>, updatedBy: string, tenantId: string): Promise<Campaign | null> {
    const fields: string[] = [], values: any[] = [];
    let i = 1;
    const setField = (key: string, val: any) => { if (val !== undefined) { fields.push(`${key} = $${i++}`); values.push(val); } };
    setField('name', data.name); setField('description', data.description); setField('type', data.type);
    setField('status', data.status); setField('start_date', data.startDate); setField('end_date', data.endDate);
    setField('budget', data.budget); setField('actual_cost', data.actualCost);
    if (data.targetAudience !== undefined) { fields.push(`target_audience = $${i++}`); values.push(JSON.stringify(data.targetAudience)); }
    if (data.metrics !== undefined) { fields.push(`metrics = $${i++}`); values.push(JSON.stringify(data.metrics)); }
    fields.push(`updated_by = $${i++}`); values.push(updatedBy);
    if (!fields.length) return this.findById(id, tenantId);
    values.push(id, tenantId);
    const query = `UPDATE marketing_campaigns SET ${fields.join(', ')}, updated_at = NOW(), version = version + 1 WHERE id = $${i++} AND tenant_id = $${i} AND is_deleted = FALSE RETURNING *`;
    const result = await this.pool.query(query, values);
    if (!result.rows.length) return null;
    await this.auditService.log({ tenantId, userId: updatedBy, action: 'UPDATE', entityType: 'campaign', entityId: id, changes: data });
    return this.mapRowToCampaign(result.rows[0]);
  }

  async delete(id: string, deletedBy: string, tenantId: string) {
    const query = `UPDATE marketing_campaigns SET is_deleted = TRUE, updated_by = $1, updated_at = NOW() WHERE id = $2 AND tenant_id = $3 AND is_deleted = FALSE`;
    const result = await this.pool.query(query, [deletedBy, id, tenantId]);
    if (!result.rows.length) throw new Error('Campaign not found');
    await this.auditService.log({ tenantId, userId: deletedBy, action: 'DELETE', entityType: 'campaign', entityId: id });
  }

  private mapRowToCampaign(row: any): Campaign {
    return {
      id: row.id, tenantId: row.tenant_id, name: row.name, description: row.description,
      type: row.type, status: row.status, startDate: row.start_date, endDate: row.end_date,
      budget: row.budget ? parseFloat(row.budget) : undefined, actualCost: row.actual_cost ? parseFloat(row.actual_cost) : undefined,
      targetAudience: row.target_audience, metrics: row.metrics,
      createdAt: row.created_at, createdBy: row.created_by, updatedAt: row.updated_at, updatedBy: row.updated_by,
      isDeleted: row.is_deleted, version: row.version,
    };
  }
}
