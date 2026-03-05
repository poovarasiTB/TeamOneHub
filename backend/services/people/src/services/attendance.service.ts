import { Pool } from 'pg';
import { database } from '../database';
import { logger } from '../utils/logger';

interface Attendance {
  id: string;
  tenantId: string;
  employeeId: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  status: 'present' | 'absent' | 'late' | 'half-day' | 'work-from-home';
  workHours?: number;
  location?: string;
  ipAddress?: string;
  notes?: string;
}

interface AttendanceFilters {
  page: number;
  limit: number;
  employeeId?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  tenantId: string;
}

export class AttendanceService {
  private pool: Pool;

  constructor() {
    this.pool = database.getPool();
  }

  async findAll(filters: AttendanceFilters) {
    const { page, limit, employeeId, startDate, endDate, status, tenantId } = filters;
    const offset = (page - 1) * limit;

    let query = `
      SELECT * FROM attendance
      WHERE tenant_id = $1
    `;

    const values: any[] = [tenantId];
    let paramIndex = 2;

    if (employeeId) {
      query += ` AND employee_id = $${paramIndex}`;
      values.push(employeeId);
      paramIndex++;
    }

    if (startDate) {
      query += ` AND date >= $${paramIndex}`;
      values.push(startDate);
      paramIndex++;
    }

    if (endDate) {
      query += ` AND date <= $${paramIndex}`;
      values.push(endDate);
      paramIndex++;
    }

    if (status) {
      query += ` AND status = $${paramIndex}`;
      values.push(status);
      paramIndex++;
    }

    const countQuery = query.replace('SELECT *', 'SELECT COUNT(*)');
    const countResult = await this.pool.query(countQuery, values);
    const total = parseInt(countResult.rows[0].count);

    query += ` ORDER BY date DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
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

  async findById(id: string, tenantId: string): Promise<Attendance | null> {
    const query = `
      SELECT * FROM attendance
      WHERE id = $1 AND tenant_id = $2
    `;

    const result = await this.pool.query(query, [id, tenantId]);
    return result.rows[0] || null;
  }

  async markAttendance(data: Partial<Attendance>, tenantId: string): Promise<Attendance> {
    const query = `
      INSERT INTO attendance (
        tenant_id, employee_id, date, check_in, check_out,
        status, work_hours, location, ip_address, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      ON CONFLICT (tenant_id, employee_id, date) 
      DO UPDATE SET
        check_out = EXCLUDED.check_out,
        status = EXCLUDED.status,
        work_hours = EXCLUDED.work_hours,
        updated_at = NOW()
      RETURNING *
    `;

    const values = [
      tenantId,
      data.employeeId,
      data.date,
      data.checkIn,
      data.checkOut,
      data.status || 'present',
      data.workHours,
      data.location,
      data.ipAddress,
      data.notes,
    ];

    const result = await this.pool.query(query, values);
    logger.info(`Attendance marked: ${data.employeeId} on ${data.date}`);
    return result.rows[0];
  }

  async getMonthlyStats(employeeId: string, tenantId: string, year: number, month: number) {
    const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
    const endDate = `${year}-${String(month).padStart(2, '0')}-31`;

    const query = `
      SELECT
        status,
        COUNT(*) as count,
        SUM(work_hours) as total_hours
      FROM attendance
      WHERE employee_id = $1 AND tenant_id = $2
        AND date BETWEEN $3 AND $4
      GROUP BY status
    `;

    const result = await this.pool.query(query, [employeeId, tenantId, startDate, endDate]);

    const stats = {
      present: 0,
      absent: 0,
      late: 0,
      workFromHome: 0,
      totalHours: 0,
    };

    result.rows.forEach((row: any) => {
      if (row.status === 'present') stats.present = parseInt(row.count);
      if (row.status === 'absent') stats.absent = parseInt(row.count);
      if (row.status === 'late') stats.late = parseInt(row.count);
      if (row.status === 'work-from-home') stats.workFromHome = parseInt(row.count);
      stats.totalHours += parseFloat(row.total_hours) || 0;
    });

    return stats;
  }
}

export default AttendanceService;
