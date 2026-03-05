import { Pool, QueryResult } from 'pg';
import { database } from '../database';
import { AuditService } from './audit.service';

interface User {
  id: string;
  tenantId: string;
  email: string;
  name: string;
  role?: string;
  status: 'pending' | 'active' | 'suspended' | 'inactive';
  avatarUrl?: string;
  phone?: string;
  department?: string;
  jobTitle?: string;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;
  isDeleted: boolean;
  version: number;
}

interface UserFilters {
  page: number;
  limit: number;
  status?: string;
  role?: string;
  search?: string;
  sort: string;
  order: 'ASC' | 'DESC';
  tenantId: string;
}

export class UserService {
  private pool: Pool;
  private auditService: AuditService;

  constructor() {
    this.pool = database.getPool();
    this.auditService = new AuditService();
  }

  async findAll(filters: UserFilters) {
    const { page, limit, status, role, search, sort, order, tenantId } = filters;
    const offset = (page - 1) * limit;

    let query = `
      SELECT * FROM users
      WHERE tenant_id = $1 AND is_deleted = FALSE
    `;

    const values: any[] = [tenantId];
    let paramIndex = 2;

    if (status) {
      query += ` AND status = $${paramIndex}`;
      values.push(status);
      paramIndex++;
    }

    if (role) {
      query += ` AND role = $${paramIndex}`;
      values.push(role);
      paramIndex++;
    }

    if (search) {
      query += ` AND (name ILIKE $${paramIndex} OR email ILIKE $${paramIndex})`;
      values.push(`%${search}%`);
      paramIndex++;
    }

    const countQuery = query.replace('SELECT *', 'SELECT COUNT(*)');
    const countResult: QueryResult = await this.pool.query(countQuery, values);
    const total = parseInt(countResult.rows[0].count);

    query += ` ORDER BY ${sort} ${order} LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    values.push(limit, offset);

    const result: QueryResult = await this.pool.query(query, values);

    return {
      data: result.rows.map(this.mapRowToUser),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string, tenantId: string): Promise<User | null> {
    const query = `
      SELECT * FROM users
      WHERE id = $1 AND tenant_id = $2 AND is_deleted = FALSE
    `;

    const result: QueryResult = await this.pool.query(query, [id, tenantId]);

    if (result.rows.length === 0) {
      return null;
    }

    return this.mapRowToUser(result.rows[0]);
  }

  async findByEmail(email: string, tenantId: string): Promise<User | null> {
    const query = `
      SELECT * FROM users
      WHERE email = $1 AND tenant_id = $2 AND is_deleted = FALSE
    `;

    const result: QueryResult = await this.pool.query(query, [email, tenantId]);

    if (result.rows.length === 0) {
      return null;
    }

    return this.mapRowToUser(result.rows[0]);
  }

  async create(data: Partial<User>, createdBy: string, tenantId: string) {
    const query = `
      INSERT INTO users (
        tenant_id, email, name, role, status, avatar_url,
        phone, department, job_title, created_by, updated_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `;

    const values = [
      tenantId,
      data.email,
      data.name,
      data.role || 'user',
      data.status || 'pending',
      data.avatarUrl || null,
      data.phone || null,
      data.department || null,
      data.jobTitle || null,
      createdBy,
      createdBy,
    ];

    const result: QueryResult = await this.pool.query(query, values);

    await this.auditService.log({
      tenantId,
      userId: createdBy,
      action: 'CREATE',
      entityType: 'user',
      entityId: result.rows[0].id,
      changes: { email: data.email, name: data.name },
    });

    return this.mapRowToUser(result.rows[0]);
  }

  async update(id: string, data: Partial<User>, updatedBy: string, tenantId: string): Promise<User | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (data.name !== undefined) {
      fields.push(`name = $${paramIndex++}`);
      values.push(data.name);
    }

    if (data.email !== undefined) {
      fields.push(`email = $${paramIndex++}`);
      values.push(data.email);
    }

    if (data.role !== undefined) {
      fields.push(`role = $${paramIndex++}`);
      values.push(data.role);
    }

    if (data.status !== undefined) {
      fields.push(`status = $${paramIndex++}`);
      values.push(data.status);
    }

    if (data.avatarUrl !== undefined) {
      fields.push(`avatar_url = $${paramIndex++}`);
      values.push(data.avatarUrl);
    }

    if (data.phone !== undefined) {
      fields.push(`phone = $${paramIndex++}`);
      values.push(data.phone);
    }

    if (data.department !== undefined) {
      fields.push(`department = $${paramIndex++}`);
      values.push(data.department);
    }

    if (data.jobTitle !== undefined) {
      fields.push(`job_title = $${paramIndex++}`);
      values.push(data.jobTitle);
    }

    fields.push(`updated_by = $${paramIndex++}`);
    values.push(updatedBy);

    if (fields.length === 0) {
      return this.findById(id, tenantId);
    }

    values.push(id, tenantId);
    const query = `
      UPDATE users
      SET ${fields.join(', ')}, updated_at = NOW(), version = version + 1
      WHERE id = $${paramIndex++} AND tenant_id = $${paramIndex} AND is_deleted = FALSE
      RETURNING *
    `;

    const result: QueryResult = await this.pool.query(query, values);

    if (result.rows.length === 0) {
      return null;
    }

    await this.auditService.log({
      tenantId,
      userId: updatedBy,
      action: 'UPDATE',
      entityType: 'user',
      entityId: id,
      changes: data,
    });

    return this.mapRowToUser(result.rows[0]);
  }

  async delete(id: string, deletedBy: string, tenantId: string): Promise<void> {
    const query = `
      UPDATE users
      SET is_deleted = TRUE, updated_by = $1, updated_at = NOW()
      WHERE id = $2 AND tenant_id = $3 AND is_deleted = FALSE
    `;

    const result: QueryResult = await this.pool.query(query, [deletedBy, id, tenantId]);

    if (result.rows.length === 0) {
      throw new Error('User not found');
    }

    await this.auditService.log({
      tenantId,
      userId: deletedBy,
      action: 'DELETE',
      entityType: 'user',
      entityId: id,
    });
  }

  async suspend(id: string, suspendedBy: string, tenantId: string): Promise<User | null> {
    return this.update(id, { status: 'suspended' }, suspendedBy, tenantId);
  }

  async activate(id: string, activatedBy: string, tenantId: string): Promise<User | null> {
    return this.update(id, { status: 'active' }, activatedBy, tenantId);
  }

  private mapRowToUser(row: any): User {
    return {
      id: row.id,
      tenantId: row.tenant_id,
      email: row.email,
      name: row.name,
      role: row.role,
      status: row.status,
      avatarUrl: row.avatar_url,
      phone: row.phone,
      department: row.department,
      jobTitle: row.job_title,
      createdAt: row.created_at,
      createdBy: row.created_by,
      updatedAt: row.updated_at,
      updatedBy: row.updated_by,
      isDeleted: row.is_deleted,
      version: row.version,
    };
  }
}
