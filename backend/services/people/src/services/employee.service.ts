import { Pool } from 'pg';
import { database } from '../database';
import { logger } from '../utils/logger';

interface Employee {
  id: string;
  tenantId: string;
  userId: string;
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  department?: string;
  designation?: string;
  managerId?: string;
  joinDate: Date;
  endDate?: Date;
  status: 'active' | 'on-leave' | 'terminated' | 'resigned';
  location?: string;
  employmentType?: string;
  salary?: number;
  currency: string;
}

interface EmployeeFilters {
  page: number;
  limit: number;
  search?: string;
  status?: string;
  department?: string;
  tenantId: string;
}

export class EmployeeService {
  private pool: Pool;

  constructor() {
    this.pool = database.getPool();
  }

  async findAll(filters: EmployeeFilters) {
    const { page, limit, search, status, department, tenantId } = filters;
    const offset = (page - 1) * limit;

    let query = `
      SELECT * FROM employees
      WHERE tenant_id = $1 AND is_deleted = FALSE
    `;

    const values: any[] = [tenantId];
    let paramIndex = 2;

    if (search) {
      query += ` AND (first_name ILIKE $${paramIndex} OR last_name ILIKE $${paramIndex} OR email ILIKE $${paramIndex})`;
      values.push(`%${search}%`);
      paramIndex++;
    }

    if (status) {
      query += ` AND status = $${paramIndex}`;
      values.push(status);
      paramIndex++;
    }

    if (department) {
      query += ` AND department = $${paramIndex}`;
      values.push(department);
      paramIndex++;
    }

    const countQuery = query.replace('SELECT *', 'SELECT COUNT(*)');
    const countResult = await this.pool.query(countQuery, values);
    const total = parseInt(countResult.rows[0].count);

    query += ` ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
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

  async findById(id: string, tenantId: string): Promise<Employee | null> {
    const query = `
      SELECT * FROM employees
      WHERE id = $1 AND tenant_id = $2 AND is_deleted = FALSE
    `;

    const result = await this.pool.query(query, [id, tenantId]);
    return result.rows[0] || null;
  }

  async create(data: Partial<Employee>, userId: string, tenantId: string): Promise<Employee> {
    const query = `
      INSERT INTO employees (
        tenant_id, user_id, employee_code, first_name, last_name,
        email, phone, department, designation, manager_id,
        join_date, status, location, employment_type, salary, currency,
        created_by, updated_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
      RETURNING *
    `;

    const values = [
      tenantId,
      data.userId,
      data.employeeCode,
      data.firstName,
      data.lastName,
      data.email,
      data.phone,
      data.department,
      data.designation,
      data.managerId,
      data.joinDate,
      data.status || 'active',
      data.location,
      data.employmentType,
      data.salary,
      data.currency || 'USD',
      userId,
      userId,
    ];

    const result = await this.pool.query(query, values);
    logger.info(`Employee created: ${result.rows[0].id}`);
    return result.rows[0];
  }

  async update(id: string, data: Partial<Employee>, userId: string, tenantId: string): Promise<Employee> {
    const current = await this.findById(id, tenantId);
    if (!current) throw new Error('Employee not found');

    const query = `
      UPDATE employees
      SET
        first_name = COALESCE($1, first_name),
        last_name = COALESCE($2, last_name),
        email = COALESCE($3, email),
        phone = COALESCE($4, phone),
        department = COALESCE($5, department),
        designation = COALESCE($6, designation),
        manager_id = COALESCE($7, manager_id),
        status = COALESCE($8, status),
        location = COALESCE($9, location),
        employment_type = COALESCE($10, employment_type),
        salary = COALESCE($11, salary),
        updated_by = $12,
        updated_at = NOW(),
        version = version + 1
      WHERE id = $13 AND tenant_id = $14 AND is_deleted = FALSE
      RETURNING *
    `;

    const values = [
      data.firstName,
      data.lastName,
      data.email,
      data.phone,
      data.department,
      data.designation,
      data.managerId,
      data.status,
      data.location,
      data.employmentType,
      data.salary,
      userId,
      id,
      tenantId,
    ];

    const result = await this.pool.query(query, values);
    logger.info(`Employee updated: ${id}`);
    return result.rows[0];
  }

  async delete(id: string, userId: string, tenantId: string): Promise<void> {
    const query = `
      UPDATE employees
      SET is_deleted = TRUE, deleted_by = $1, deleted_at = NOW()
      WHERE id = $2 AND tenant_id = $3
    `;

    await this.pool.query(query, [userId, id, tenantId]);
    logger.info(`Employee deleted: ${id}`);
  }

  async getStats(tenantId: string) {
    const query = `
      SELECT
        status,
        COUNT(*) as count
      FROM employees
      WHERE tenant_id = $1 AND is_deleted = FALSE
      GROUP BY status
    `;

    const result = await this.pool.query(query, [tenantId]);

    const stats = {
      total: 0,
      byStatus: {} as Record<string, number>,
    };

    result.rows.forEach((row: any) => {
      stats.byStatus[row.status] = parseInt(row.count);
      stats.total += parseInt(row.count);
    });

    return stats;
  }
}

export default EmployeeService;
