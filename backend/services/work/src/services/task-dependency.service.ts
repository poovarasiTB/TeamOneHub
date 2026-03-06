import { Pool } from 'pg';
import { database } from '../database';

interface TaskDependency {
    id: string;
    taskId: string;
    dependsOnTaskId: string;
    type: 'FS' | 'SS' | 'FF' | 'SF';
    lagDays: number;
    createdAt: Date;
}

export class TaskDependencyService {
    private pool: Pool;

    constructor() {
        this.pool = database.getPool();
    }

    async findByTaskId(taskId: string, tenantId: string): Promise<TaskDependency[]> {
        // Verify task belongs to tenant
        const query = `
      SELECT td.*
      FROM task_dependencies td
      JOIN tasks t ON td.task_id = t.id
      WHERE td.task_id = $1 AND t.tenant_id = $2
    `;
        const result = await this.pool.query(query, [taskId, tenantId]);
        return result.rows.map(this.mapToCamelCase);
    }

    async create(taskId: string, data: Partial<TaskDependency>, tenantId: string): Promise<TaskDependency> {
        const client = await this.pool.connect();
        try {
            await client.query('BEGIN');

            // Verify task ownership
            const taskCheck = await client.query('SELECT id FROM tasks WHERE id = $1 AND tenant_id = $2 AND is_deleted = FALSE', [taskId, tenantId]);
            if (taskCheck.rows.length === 0) throw new Error('Task not found');

            // Verify dependsOnTask ownership
            if (!data.dependsOnTaskId) throw new Error('Missing dependsOnTaskId');
            const dependsCheck = await client.query('SELECT id FROM tasks WHERE id = $1 AND tenant_id = $2 AND is_deleted = FALSE', [data.dependsOnTaskId, tenantId]);
            if (dependsCheck.rows.length === 0) throw new Error('Dependent Task not found');

            const query = `
        INSERT INTO task_dependencies (task_id, depends_on_task_id, type, lag_days)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `;
            const values = [
                taskId,
                data.dependsOnTaskId,
                data.type || 'FS',
                data.lagDays || 0
            ];

            const result = await client.query(query, values);
            await client.query('COMMIT');
            return this.mapToCamelCase(result.rows[0]);
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    async delete(id: string, taskId: string, tenantId: string): Promise<void> {
        const query = `
      DELETE FROM task_dependencies td
      USING tasks t
      WHERE td.id = $1 AND td.task_id = $2 AND td.task_id = t.id AND t.tenant_id = $3
    `;
        const result = await this.pool.query(query, [id, taskId, tenantId]);
        if (result.rowCount === 0) {
            throw new Error('Task dependency not found');
        }
    }

    private mapToCamelCase(row: any): TaskDependency {
        return {
            id: row.id,
            taskId: row.task_id,
            dependsOnTaskId: row.depends_on_task_id,
            type: row.type,
            lagDays: row.lag_days,
            createdAt: row.created_at
        };
    }
}
