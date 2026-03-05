import { Pool } from 'pg';
import { database } from '../database';
import { AuditService } from './audit.service';

interface Account {
  id: string;
  tenantId: string;
  code: string;
  name: string;
  type: 'asset' | 'liability' | 'equity' | 'income' | 'expense';
  parentId?: string;
  balance: number;
  currency: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;
  isDeleted: boolean;
  version: number;
}

interface AccountFilters {
  page: number;
  limit: number;
  type?: string;
  parentId?: string;
  search?: string;
  isActive?: boolean;
  sort: string;
  order: 'ASC' | 'DESC';
  tenantId: string;
}

export class AccountService {
  private pool: Pool;
  private auditService: AuditService;

  constructor() {
    this.pool = database.getPool();
    this.auditService = new AuditService();
  }

  /**
   * Find all accounts with filtering and pagination
   */
  async findAll(filters: AccountFilters) {
    const { page, limit, type, parentId, search, isActive, sort, order, tenantId } = filters;
    const offset = (page - 1) * limit;

    let query = `
      SELECT a.*, p.name as parent_name
      FROM accounts a
      LEFT JOIN accounts p ON p.id = a.parent_id
      WHERE a.tenant_id = $1 AND a.is_deleted = FALSE
    `;

    const values: any[] = [tenantId];
    let paramIndex = 2;

    if (type) {
      query += ` AND a.type = $${paramIndex}`;
      values.push(type);
      paramIndex++;
    }

    if (parentId) {
      query += ` AND a.parent_id = $${paramIndex}`;
      values.push(parentId);
      paramIndex++;
    }

    if (isActive !== undefined) {
      query += ` AND a.is_active = $${paramIndex}`;
      values.push(isActive);
      paramIndex++;
    }

    if (search) {
      query += ` AND (a.name ILIKE $${paramIndex} OR a.code ILIKE $${paramIndex})`;
      values.push(`%${search}%`);
      paramIndex++;
    }

    const countQuery = query.replace('SELECT a.*, p.name as parent_name', 'SELECT COUNT(*)');
    const countResult = await this.pool.query(countQuery, values);
    const total = parseInt(countResult.rows[0].count);

    query += ` ORDER BY a.${sort} ${order} LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    values.push(limit, offset);

    const result = await this.pool.query(query, values);

    return {
      data: result.rows.map(this.mapRowToAccount),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Find account by ID
   */
  async findById(id: string, tenantId: string): Promise<Account | null> {
    const query = `
      SELECT a.*, p.name as parent_name
      FROM accounts a
      LEFT JOIN accounts p ON p.id = a.parent_id
      WHERE a.id = $1 AND a.tenant_id = $2 AND a.is_deleted = FALSE
    `;

    const result = await this.pool.query(query, [id, tenantId]);

    if (result.rows.length === 0) {
      return null;
    }

    return this.mapRowToAccount(result.rows[0]);
  }

  /**
   * Create new account
   */
  async create(data: Partial<Account>, createdBy: string, tenantId: string) {
    const query = `
      INSERT INTO accounts (
        tenant_id, code, name, type, parent_id, balance,
        currency, description, is_active, created_by, updated_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `;

    const values = [
      tenantId,
      data.code,
      data.name,
      data.type,
      data.parentId || null,
      data.balance || 0,
      data.currency || 'USD',
      data.description || null,
      data.isActive !== undefined ? data.isActive : true,
      createdBy,
      createdBy,
    ];

    const result = await this.pool.query(query, values);

    await this.auditService.log({
      tenantId,
      userId: createdBy,
      action: 'CREATE',
      resourceType: 'account',
      resourceId: result.rows[0].id,
      changes: { after: { code: data.code, name: data.name, type: data.type } },
    });

    return this.mapRowToAccount(result.rows[0]);
  }

  /**
   * Update account
   */
  async update(
    id: string,
    data: Partial<Account>,
    updatedBy: string,
    tenantId: string
  ): Promise<Account | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (data.code !== undefined) {
      fields.push(`code = $${paramIndex++}`);
      values.push(data.code);
    }

    if (data.name !== undefined) {
      fields.push(`name = $${paramIndex++}`);
      values.push(data.name);
    }

    if (data.type !== undefined) {
      fields.push(`type = $${paramIndex++}`);
      values.push(data.type);
    }

    if (data.parentId !== undefined) {
      fields.push(`parent_id = $${paramIndex++}`);
      values.push(data.parentId);
    }

    if (data.balance !== undefined) {
      fields.push(`balance = $${paramIndex++}`);
      values.push(data.balance);
    }

    if (data.currency !== undefined) {
      fields.push(`currency = $${paramIndex++}`);
      values.push(data.currency);
    }

    if (data.description !== undefined) {
      fields.push(`description = $${paramIndex++}`);
      values.push(data.description);
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
      UPDATE accounts
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
      resourceType: 'account',
      resourceId: id,
      changes: { after: data },
    });

    return this.mapRowToAccount(result.rows[0]);
  }

  /**
   * Delete account (soft delete)
   */
  async delete(id: string, deletedBy: string, tenantId: string): Promise<void> {
    const query = `
      UPDATE accounts
      SET is_deleted = TRUE, updated_by = $1, updated_at = NOW()
      WHERE id = $2 AND tenant_id = $3 AND is_deleted = FALSE
    `;

    const result = await this.pool.query(query, [deletedBy, id, tenantId]);

    if (result.rows.length === 0) {
      throw new Error('Account not found');
    }

    await this.auditService.log({
      tenantId,
      userId: deletedBy,
      action: 'DELETE',
      resourceType: 'account',
      resourceId: id,
    });
  }

  /**
   * Get account tree (hierarchical structure)
   */
  async getTree(tenantId: string): Promise<any[]> {
    const query = `
      WITH RECURSIVE account_tree AS (
        SELECT a.*, p.name as parent_name, 0 as level
        FROM accounts a
        LEFT JOIN accounts p ON p.id = a.parent_id
        WHERE a.tenant_id = $1 AND a.is_deleted = FALSE AND a.parent_id IS NULL
        UNION ALL
        SELECT a.*, p.name as parent_name, at.level + 1
        FROM accounts a
        INNER JOIN account_tree at ON a.parent_id = at.id
        WHERE a.tenant_id = $1 AND a.is_deleted = FALSE
      )
      SELECT * FROM account_tree ORDER BY level, code
    `;

    const result = await this.pool.query(query, [tenantId]);
    return result.rows.map(this.mapRowToAccount);
  }

  /**
   * Get account balance
   */
  async getBalance(id: string, tenantId: string): Promise<number | null> {
    const account = await this.findById(id, tenantId);
    return account?.balance || 0;
  }

  private mapRowToAccount(row: any): Account {
    return {
      id: row.id,
      tenantId: row.tenant_id,
      code: row.code,
      name: row.name,
      type: row.type,
      parentId: row.parent_id,
      balance: parseFloat(row.balance),
      currency: row.currency,
      description: row.description,
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
