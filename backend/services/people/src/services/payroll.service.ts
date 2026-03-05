import { Pool } from 'pg';
import { database } from '../database';
import { logger } from '../utils/logger';

interface PayrollRecord {
  id: string;
  tenantId: string;
  employeeId: string;
  periodStart: string;
  periodEnd: string;
  basicSalary: number;
  allowances?: any;
  deductions?: any;
  grossSalary: number;
  netSalary: number;
  status: 'draft' | 'processed' | 'paid' | 'cancelled';
  paymentDate?: string;
  paymentReference?: string;
  notes?: string;
}

interface PayrollFilters {
  page: number;
  limit: number;
  employeeId?: string;
  status?: string;
  periodStart?: string;
  periodEnd?: string;
  tenantId: string;
}

export class PayrollService {
  private pool: Pool;

  constructor() {
    this.pool = database.getPool();
  }

  async findAll(filters: PayrollFilters) {
    const { page, limit, employeeId, status, periodStart, periodEnd, tenantId } = filters;
    const offset = (page - 1) * limit;

    let query = `
      SELECT * FROM payroll_records
      WHERE tenant_id = $1
    `;

    const values: any[] = [tenantId];
    let paramIndex = 2;

    if (employeeId) {
      query += ` AND employee_id = $${paramIndex}`;
      values.push(employeeId);
      paramIndex++;
    }

    if (status) {
      query += ` AND status = $${paramIndex}`;
      values.push(status);
      paramIndex++;
    }

    if (periodStart) {
      query += ` AND period_start >= $${paramIndex}`;
      values.push(periodStart);
      paramIndex++;
    }

    if (periodEnd) {
      query += ` AND period_end <= $${paramIndex}`;
      values.push(periodEnd);
      paramIndex++;
    }

    const countQuery = query.replace('SELECT *', 'SELECT COUNT(*)');
    const countResult = await this.pool.query(countQuery, values);
    const total = parseInt(countResult.rows[0].count);

    query += ` ORDER BY period_start DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
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

  async findById(id: string, tenantId: string): Promise<PayrollRecord | null> {
    const query = `
      SELECT * FROM payroll_records
      WHERE id = $1 AND tenant_id = $2
    `;

    const result = await this.pool.query(query, [id, tenantId]);
    return result.rows[0] || null;
  }

  async generatePayroll(data: Partial<PayrollRecord>, userId: string, tenantId: string): Promise<PayrollRecord> {
    const query = `
      INSERT INTO payroll_records (
        tenant_id, employee_id, period_start, period_end,
        basic_salary, allowances, deductions, gross_salary, net_salary,
        status, notes, created_by, updated_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *
    `;

    const values = [
      tenantId,
      data.employeeId,
      data.periodStart,
      data.periodEnd,
      data.basicSalary || 0,
      JSON.stringify(data.allowances || {}),
      JSON.stringify(data.deductions || {}),
      data.grossSalary || 0,
      data.netSalary || 0,
      data.status || 'draft',
      data.notes,
      userId,
      userId,
    ];

    const result = await this.pool.query(query, values);
    logger.info(`Payroll generated: ${result.rows[0].id}`);
    return result.rows[0];
  }

  async processPayroll(id: string, userId: string, tenantId: string): Promise<PayrollRecord> {
    const query = `
      UPDATE payroll_records
      SET
        status = 'processed',
        updated_by = $1,
        updated_at = NOW()
      WHERE id = $2 AND tenant_id = $3
      RETURNING *
    `;

    const result = await this.pool.query(query, [userId, id, tenantId]);
    logger.info(`Payroll processed: ${id}`);
    return result.rows[0];
  }

  async markPaid(id: string, paymentDate: string, paymentReference: string, userId: string, tenantId: string): Promise<PayrollRecord> {
    const query = `
      UPDATE payroll_records
      SET
        status = 'paid',
        payment_date = $1,
        payment_reference = $2,
        updated_by = $3,
        updated_at = NOW()
      WHERE id = $4 AND tenant_id = $5
      RETURNING *
    `;

    const result = await this.pool.query(query, [paymentDate, paymentReference, userId, id, tenantId]);
    logger.info(`Payroll marked paid: ${id}`);
    return result.rows[0];
  }

  async getMonthlyStats(tenantId: string, year: number, month: number) {
    const periodStart = `${year}-${String(month).padStart(2, '0')}-01`;
    const periodEnd = `${year}-${String(month).padStart(2, '0')}-31`;

    const query = `
      SELECT
        status,
        COUNT(*) as count,
        SUM(net_salary) as total_amount
      FROM payroll_records
      WHERE tenant_id = $1
        AND period_start BETWEEN $2 AND $3
      GROUP BY status
    `;

    const result = await this.pool.query(query, [tenantId, periodStart, periodEnd]);

    const stats = {
      draft: { count: 0, amount: 0 },
      processed: { count: 0, amount: 0 },
      paid: { count: 0, amount: 0 },
      total: { count: 0, amount: 0 },
    };

    result.rows.forEach((row: any) => {
      const status = row.status as string;
      if (stats[status as keyof typeof stats]) {
        stats[status as keyof typeof stats].count = parseInt(row.count);
        stats[status as keyof typeof stats].amount = parseFloat(row.total_amount) || 0;
      }
      stats.total.count += parseInt(row.count);
      stats.total.amount += parseFloat(row.total_amount) || 0;
    });

    return stats;
  }
}

export default PayrollService;
