import { Pool } from 'pg';
import { database } from '../database';
import { AuditService } from './audit.service';

interface SLAPolicy {
  id: string;
  tenantId: string;
  name: string;
  description?: string;
  ticketType?: string;
  priority?: string;
  responseTimeMinutes?: number;
  resolutionTimeMinutes?: number;
  businessHoursId?: string;
  isActive: boolean;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;
  isDeleted: boolean;
  version: number;
}

interface SLAFilters {
  page: number;
  limit: number;
  ticketType?: string;
  priority?: string;
  isActive?: boolean;
  search?: string;
  sort: string;
  order: 'ASC' | 'DESC';
  tenantId: string;
}

export class SLAService {
  private pool: Pool;
  private auditService: AuditService;

  constructor() {
    this.pool = database.getPool();
    this.auditService = new AuditService();
  }

  async findAll(filters: SLAFilters) {
    const { page, limit, ticketType, priority, isActive, search, sort, order, tenantId } = filters;
    const offset = (page - 1) * limit;

    let query = `
      SELECT * FROM sla_policies
      WHERE tenant_id = $1 AND is_deleted = FALSE
    `;

    const values: any[] = [tenantId];
    let paramIndex = 2;

    if (ticketType) {
      query += ` AND ticket_type = $${paramIndex}`;
      values.push(ticketType);
      paramIndex++;
    }

    if (priority) {
      query += ` AND priority = $${paramIndex}`;
      values.push(priority);
      paramIndex++;
    }

    if (isActive !== undefined) {
      query += ` AND is_active = $${paramIndex}`;
      values.push(isActive);
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

    query += ` ORDER BY ${sort} ${order} LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    values.push(limit, offset);

    const result = await this.pool.query(query, values);

    return {
      data: result.rows.map(this.mapRowToSLA),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string, tenantId: string): Promise<SLAPolicy | null> {
    const query = `
      SELECT * FROM sla_policies
      WHERE id = $1 AND tenant_id = $2 AND is_deleted = FALSE
    `;

    const result = await this.pool.query(query, [id, tenantId]);

    if (result.rows.length === 0) {
      return null;
    }

    return this.mapRowToSLA(result.rows[0]);
  }

  async create(data: Partial<SLAPolicy>, createdBy: string, tenantId: string) {
    const query = `
      INSERT INTO sla_policies (
        tenant_id, name, description, ticket_type, priority,
        response_time_minutes, resolution_time_minutes, business_hours_id,
        is_active, created_by, updated_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `;

    const values = [
      tenantId,
      data.name,
      data.description || null,
      data.ticketType || null,
      data.priority || null,
      data.responseTimeMinutes || null,
      data.resolutionTimeMinutes || null,
      data.businessHoursId || null,
      data.isActive !== undefined ? data.isActive : true,
      createdBy,
      createdBy,
    ];

    const result = await this.pool.query(query, values);

    await this.auditService.log({
      tenantId,
      userId: createdBy,
      action: 'CREATE',
      resourceType: 'sla_policy',
      resourceId: result.rows[0].id,
      changes: { after: { name: data.name } },
    });

    return this.mapRowToSLA(result.rows[0]);
  }

  async update(id: string, data: Partial<SLAPolicy>, updatedBy: string, tenantId: string): Promise<SLAPolicy | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (data.name !== undefined) {
      fields.push(`name = $${paramIndex++}`);
      values.push(data.name);
    }

    if (data.description !== undefined) {
      fields.push(`description = $${paramIndex++}`);
      values.push(data.description);
    }

    if (data.ticketType !== undefined) {
      fields.push(`ticket_type = $${paramIndex++}`);
      values.push(data.ticketType);
    }

    if (data.priority !== undefined) {
      fields.push(`priority = $${paramIndex++}`);
      values.push(data.priority);
    }

    if (data.responseTimeMinutes !== undefined) {
      fields.push(`response_time_minutes = $${paramIndex++}`);
      values.push(data.responseTimeMinutes);
    }

    if (data.resolutionTimeMinutes !== undefined) {
      fields.push(`resolution_time_minutes = $${paramIndex++}`);
      values.push(data.resolutionTimeMinutes);
    }

    if (data.businessHoursId !== undefined) {
      fields.push(`business_hours_id = $${paramIndex++}`);
      values.push(data.businessHoursId);
    }

    if (data.isActive !== undefined) {
      fields.push(`is_active = $${paramIndex++}`);
      values.push(data.isActive);
    }

    fields.push(`updated_by = $${paramIndex++}`);
    values.push(updatedBy);

    if (fields.length === 0) {
      return this.findById(id, tenantId);
    }

    values.push(id, tenantId);
    const query = `
      UPDATE sla_policies
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
      resourceType: 'sla_policy',
      resourceId: id,
      changes: { after: data },
    });

    return this.mapRowToSLA(result.rows[0]);
  }

  async delete(id: string, deletedBy: string, tenantId: string): Promise<void> {
    const query = `
      UPDATE sla_policies
      SET is_deleted = TRUE, updated_by = $1, updated_at = NOW()
      WHERE id = $2 AND tenant_id = $3 AND is_deleted = FALSE
    `;

    const result = await this.pool.query(query, [deletedBy, id, tenantId]);

    if (result.rows.length === 0) {
      throw new Error('SLA policy not found');
    }

    await this.auditService.log({
      tenantId,
      userId: deletedBy,
      action: 'DELETE',
      resourceType: 'sla_policy',
      resourceId: id,
    });
  }

  async getActiveSLA(tenantId: string, ticketType?: string, priority?: string): Promise<SLAPolicy | null> {
    let query = `
      SELECT * FROM sla_policies
      WHERE tenant_id = $1 AND is_deleted = FALSE AND is_active = TRUE
    `;

    const values: any[] = [tenantId];
    let paramIndex = 2;

    if (ticketType) {
      query += ` AND (ticket_type = $${paramIndex} OR ticket_type IS NULL)`;
      values.push(ticketType);
      paramIndex++;
    }

    if (priority) {
      query += ` AND (priority = $${paramIndex} OR priority IS NULL)`;
      values.push(priority);
      paramIndex++;
    }

    query += ` ORDER BY created_at DESC LIMIT 1`;

    const result = await this.pool.query(query, values);

    if (result.rows.length === 0) {
      return null;
    }

    return this.mapRowToSLA(result.rows[0]);
  }

  async calculateDueDate(slaId: string, createdAt: Date): Promise<{ responseDue: Date; resolutionDue: Date } | null> {
    const sla = await this.findById(slaId, '');
    if (!sla || !sla.responseTimeMinutes || !sla.resolutionTimeMinutes) {
      return null;
    }

    const responseDue = new Date(createdAt.getTime() + sla.responseTimeMinutes * 60000);
    const resolutionDue = new Date(createdAt.getTime() + sla.resolutionTimeMinutes * 60000);

    return { responseDue, resolutionDue };
  }

  private mapRowToSLA(row: any): SLAPolicy {
    return {
      id: row.id,
      tenantId: row.tenant_id,
      name: row.name,
      description: row.description,
      ticketType: row.ticket_type,
      priority: row.priority,
      responseTimeMinutes: row.response_time_minutes,
      resolutionTimeMinutes: row.resolution_time_minutes,
      businessHoursId: row.business_hours_id,
      isActive: row.is_active,
      createdAt: row.created_at,
      createdBy: row.created_by,
      updatedAt: row.updated_at,
      updatedBy: row.updated_by,
      isDeleted: row.is_deleted,
      version: row.version,
    };
  }
}
