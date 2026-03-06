import { Pool } from 'pg';
import { database } from '../database';

interface Timesheet {
    id: string;
    tenantId: string;
    userId: string;
    projectId: string;
    taskId?: string;
    date: Date;
    hours: number;
    description?: string;
    status: 'draft' | 'submitted' | 'approved' | 'rejected';
    approvedBy?: string;
    createdAt: Date;
    updatedAt: Date;
}

export class TimesheetService {
    private pool: Pool;

    constructor() {
        this.pool = database.getPool();
    }

    async findByUserAndProject(userId: string, projectId: string, tenantId: string): Promise<Timesheet[]> {
        const query = `
      SELECT *
      FROM timesheets
      WHERE user_id = $1 AND project_id = $2 AND tenant_id = $3
      ORDER BY date DESC
    `;
        const result = await this.pool.query(query, [userId, projectId, tenantId]);
        return result.rows.map(this.mapToCamelCase);
    }

    async create(data: Partial<Timesheet>, userId: string, tenantId: string): Promise<Timesheet> {
        const client = await this.pool.connect();
        try {
            await client.query('BEGIN');

            const query = `
        INSERT INTO timesheets (
          tenant_id, user_id, project_id, task_id, date, hours, description, status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
      `;
            const values = [
                tenantId,
                userId,
                data.projectId,
                data.taskId,
                data.date,
                data.hours,
                data.description,
                data.status || 'draft'
            ];

            const result = await client.query(query, values);

            // If attached to a task, update actual hours
            if (data.taskId) {
                await client.query(`
          UPDATE tasks SET 
            actual_hours = actual_hours + $1,
            time_spent = COALESCE(time_spent, 0) + $1
          WHERE id = $2 AND tenant_id = $3
        `, [data.hours, data.taskId, tenantId]);
            }

            await client.query('COMMIT');
            return this.mapToCamelCase(result.rows[0]);
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    async updateStatus(id: string, status: string, approverId: string, tenantId: string): Promise<Timesheet> {
        const query = `
      UPDATE timesheets
      SET status = $1, approved_by = $2, updated_at = NOW()
      WHERE id = $3 AND tenant_id = $4
      RETURNING *
    `;
        const result = await this.pool.query(query, [status, approverId, id, tenantId]);
        if (result.rows.length === 0) throw new Error('Timesheet not found');
        return this.mapToCamelCase(result.rows[0]);
    }

    private mapToCamelCase(row: any): Timesheet {
        return {
            id: row.id,
            tenantId: row.tenant_id,
            userId: row.user_id,
            projectId: row.project_id,
            taskId: row.task_id,
            date: row.date,
            hours: row.hours,
            description: row.description,
            status: row.status,
            approvedBy: row.approved_by,
            createdAt: row.created_at,
            updatedAt: row.updated_at
        };
    }
}
