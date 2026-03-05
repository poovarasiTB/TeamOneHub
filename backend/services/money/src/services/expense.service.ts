import { Pool } from 'pg';
import { database } from '../database';

interface Expense {
  id: string;
  tenantId: string;
  employeeId: string;
  category: string;
  description: string;
  amount: number;
  date: Date;
  status: 'pending' | 'approved' | 'rejected';
  receiptUrl?: string;
  approvedBy?: string;
  approvedAt?: Date;
  rejectedBy?: string;
  rejectedAt?: Date;
  rejectionReason?: string;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;
  isDeleted: boolean;
  version: number;
}

interface ExpenseFilters {
  page: number;
  limit: number;
  status?: string;
  category?: string;
  tenantId: string;
}

export class ExpenseService {
  private pool: Pool;

  constructor() {
    this.pool = database.getPool();
  }

  async findAll(filters: ExpenseFilters) {
    const { page, limit, status, category, tenantId } = filters;
    const offset = (page - 1) * limit;

    let query = `
      SELECT e.*, u.name as employee_name 
      FROM expenses e
      LEFT JOIN users u ON u.id = e.employee_id
      WHERE e.tenant_id = $1 AND e.is_deleted = FALSE
    `;
    
    const values: any[] = [tenantId];
    let paramIndex = 2;

    if (status) {
      query += ` AND e.status = $${paramIndex}`;
      values.push(status);
      paramIndex++;
    }

    if (category) {
      query += ` AND e.category = $${paramIndex}`;
      values.push(category);
      paramIndex++;
    }

    const countQuery = query.replace('SELECT e.*, u.name as employee_name', 'SELECT COUNT(*)');
    const countResult = await this.pool.query(countQuery, values);
    const total = parseInt(countResult.rows[0].count);

    query += ` ORDER BY e.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
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

  async findById(id: string, tenantId: string): Promise<Expense | null> {
    const query = `
      SELECT e.*, u.name as employee_name 
      FROM expenses e
      LEFT JOIN users u ON u.id = e.employee_id
      WHERE e.id = $1 AND e.tenant_id = $2 AND e.is_deleted = FALSE
    `;
    
    const result = await this.pool.query(query, [id, tenantId]);
    return result.rows[0] || null;
  }

  async create(data: Partial<Expense>, userId: string, tenantId: string): Promise<Expense> {
    const query = `
      INSERT INTO expenses (
        tenant_id, employee_id, category, description, amount,
        date, receipt_url, created_by, updated_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;

    const values = [
      tenantId,
      userId,
      data.category,
      data.description,
      data.amount,
      data.date,
      data.receiptUrl,
      userId,
      userId,
    ];

    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async update(id: string, data: Partial<Expense>, userId: string, tenantId: string): Promise<Expense> {
    const current = await this.findById(id, tenantId);
    if (!current) {
      throw new Error('Expense not found');
    }

    const query = `
      UPDATE expenses 
      SET 
        category = COALESCE($1, category),
        description = COALESCE($2, description),
        amount = COALESCE($3, amount),
        date = COALESCE($4, date),
        receipt_url = COALESCE($5, receipt_url),
        updated_by = $6,
        updated_at = NOW(),
        version = version + 1
      WHERE id = $7 AND tenant_id = $8 AND is_deleted = FALSE
      RETURNING *
    `;

    const values = [
      data.category,
      data.description,
      data.amount,
      data.date,
      data.receiptUrl,
      userId,
      id,
      tenantId,
    ];

    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async approve(id: string, userId: string, tenantId: string): Promise<Expense> {
    const current = await this.findById(id, tenantId);
    if (!current) {
      throw new Error('Expense not found');
    }

    const query = `
      UPDATE expenses 
      SET 
        status = 'approved',
        approved_by = $1,
        approved_at = NOW(),
        updated_by = $2,
        updated_at = NOW()
      WHERE id = $3 AND tenant_id = $4
      RETURNING *
    `;

    const result = await this.pool.query(query, [userId, userId, id, tenantId]);
    return result.rows[0];
  }

  async reject(id: string, reason: string, userId: string, tenantId: string): Promise<Expense> {
    const current = await this.findById(id, tenantId);
    if (!current) {
      throw new Error('Expense not found');
    }

    const query = `
      UPDATE expenses 
      SET 
        status = 'rejected',
        rejected_by = $1,
        rejected_at = NOW(),
        rejection_reason = $2,
        updated_by = $3,
        updated_at = NOW()
      WHERE id = $4 AND tenant_id = $5
      RETURNING *
    `;

    const result = await this.pool.query(query, [userId, reason, userId, id, tenantId]);
    return result.rows[0];
  }

  async delete(id: string, userId: string, tenantId: string): Promise<void> {
    const current = await this.findById(id, tenantId);
    if (!current) {
      throw new Error('Expense not found');
    }

    const query = `
      UPDATE expenses 
      SET is_deleted = TRUE, deleted_by = $1, deleted_at = NOW(), updated_at = NOW()
      WHERE id = $2 AND tenant_id = $3
    `;

    await this.pool.query(query, [userId, id, tenantId]);
  }

  async getStats(tenantId: string) {
    const query = `
      SELECT 
        status,
        category,
        COUNT(*) as count,
        COALESCE(SUM(amount), 0) as total_amount
      FROM expenses
      WHERE tenant_id = $1 AND is_deleted = FALSE
      GROUP BY status, category
    `;

    const result = await this.pool.query(query, [tenantId]);
    
    const stats = {
      total: 0,
      totalAmount: 0,
      byStatus: {} as Record<string, { count: number; amount: number }>,
      byCategory: {} as Record<string, { count: number; amount: number }>,
    };

    result.rows.forEach((row: any) => {
      stats.byStatus[row.status] = {
        count: parseInt(row.count),
        amount: parseFloat(row.total_amount),
      };
      stats.byCategory[row.category] = {
        count: parseInt(row.count),
        amount: parseFloat(row.total_amount),
      };
      stats.total += parseInt(row.count);
      stats.totalAmount += parseFloat(row.total_amount);
    });

    return stats;
  }
}
