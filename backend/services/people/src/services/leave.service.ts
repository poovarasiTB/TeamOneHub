import { Pool } from 'pg';
import { database } from '../database';
import { logger } from '../utils/logger';

interface LeaveRequest {
  id: string;
  tenantId: string;
  employeeId: string;
  leaveTypeId: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  reason?: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
}

interface LeaveFilters {
  page: number;
  limit: number;
  employeeId?: string;
  status?: string;
  leaveTypeId?: string;
  tenantId: string;
}

export class LeaveService {
  private pool: Pool;

  constructor() {
    this.pool = database.getPool();
  }

  async findAll(filters: LeaveFilters) {
    const { page, limit, employeeId, status, leaveTypeId, tenantId } = filters;
    const offset = (page - 1) * limit;

    let query = `
      SELECT lr.*, lt.name as leave_type_name
      FROM leave_requests lr
      JOIN leave_types lt ON lr.leave_type_id = lt.id
      WHERE lr.tenant_id = $1
    `;

    const values: any[] = [tenantId];
    let paramIndex = 2;

    if (employeeId) {
      query += ` AND lr.employee_id = $${paramIndex}`;
      values.push(employeeId);
      paramIndex++;
    }

    if (status) {
      query += ` AND lr.status = $${paramIndex}`;
      values.push(status);
      paramIndex++;
    }

    if (leaveTypeId) {
      query += ` AND lr.leave_type_id = $${paramIndex}`;
      values.push(leaveTypeId);
      paramIndex++;
    }

    const countQuery = query.replace('SELECT lr.*, lt.name as leave_type_name', 'SELECT COUNT(*)');
    const countResult = await this.pool.query(countQuery, values);
    const total = parseInt(countResult.rows[0].count);

    query += ` ORDER BY lr.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
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

  async applyLeave(data: Partial<LeaveRequest>, tenantId: string): Promise<LeaveRequest> {
    const query = `
      INSERT INTO leave_requests (
        tenant_id, employee_id, leave_type_id, start_date, end_date,
        total_days, reason, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;

    const values = [
      tenantId,
      data.employeeId,
      data.leaveTypeId,
      data.startDate,
      data.endDate,
      data.totalDays,
      data.reason,
      'pending',
    ];

    const result = await this.pool.query(query, values);
    logger.info(`Leave request created: ${result.rows[0].id}`);
    return result.rows[0];
  }

  async approveLeave(id: string, approvedBy: string, tenantId: string): Promise<LeaveRequest> {
    const query = `
      UPDATE leave_requests
      SET
        status = 'approved',
        approved_by = $1,
        approved_at = NOW(),
        updated_at = NOW()
      WHERE id = $2 AND tenant_id = $3
      RETURNING *
    `;

    const result = await this.pool.query(query, [approvedBy, id, tenantId]);
    logger.info(`Leave request approved: ${id}`);
    return result.rows[0];
  }

  async rejectLeave(id: string, rejectionReason: string, tenantId: string): Promise<LeaveRequest> {
    const query = `
      UPDATE leave_requests
      SET
        status = 'rejected',
        rejection_reason = $1,
        updated_at = NOW()
      WHERE id = $2 AND tenant_id = $3
      RETURNING *
    `;

    const result = await this.pool.query(query, [rejectionReason, id, tenantId]);
    logger.info(`Leave request rejected: ${id}`);
    return result.rows[0];
  }

  async getBalance(employeeId: string, leaveTypeId: string, tenantId: string, year: number) {
    const query = `
      SELECT opening_balance, allocated, taken, closing_balance
      FROM leave_balances
      WHERE employee_id = $1 AND leave_type_id = $2 AND tenant_id = $3 AND year = $4
    `;

    const result = await this.pool.query(query, [employeeId, leaveTypeId, tenantId, year]);
    return result.rows[0] || { opening_balance: 0, allocated: 0, taken: 0, closing_balance: 0 };
  }
}

export default LeaveService;
