import { Pool } from 'pg';
import { database } from '../database';
import { logger } from '../utils/logger';

interface Task {
  id: string;
  tenantId: string;
  projectId?: string;
  parentTaskId?: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'review' | 'done' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assigneeId?: string;
  reporterId?: string;
  estimatedHours?: number;
  actualHours?: number;
  dueDate?: string;
  startDate?: string;
  completedAt?: string;
  tags?: string[];
}

interface TaskFilters {
  page: number;
  limit: number;
  projectId?: string;
  status?: string;
  priority?: string;
  assigneeId?: string;
  search?: string;
  tenantId: string;
}

export class TaskService {
  private pool: Pool;

  constructor() {
    this.pool = database.getPool();
  }

  async findAll(filters: TaskFilters) {
    const { page, limit, projectId, status, priority, assigneeId, search, tenantId } = filters;
    const offset = (page - 1) * limit;

    let query = `
      SELECT * FROM tasks
      WHERE tenant_id = $1 AND is_deleted = FALSE
    `;

    const values: any[] = [tenantId];
    let paramIndex = 2;

    if (projectId) {
      query += ` AND project_id = $${paramIndex}`;
      values.push(projectId);
      paramIndex++;
    }

    if (status) {
      query += ` AND status = $${paramIndex}`;
      values.push(status);
      paramIndex++;
    }

    if (priority) {
      query += ` AND priority = $${paramIndex}`;
      values.push(priority);
      paramIndex++;
    }

    if (assigneeId) {
      query += ` AND assignee_id = $${paramIndex}`;
      values.push(assigneeId);
      paramIndex++;
    }

    if (search) {
      query += ` AND (title ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`;
      values.push(`%${search}%`);
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

  async findById(id: string, tenantId: string): Promise<Task | null> {
    const query = `
      SELECT * FROM tasks
      WHERE id = $1 AND tenant_id = $2 AND is_deleted = FALSE
    `;

    const result = await this.pool.query(query, [id, tenantId]);
    return result.rows[0] || null;
  }

  async create(data: Partial<Task>, userId: string, tenantId: string): Promise<Task> {
    const query = `
      INSERT INTO tasks (
        tenant_id, project_id, parent_task_id, title, description,
        status, priority, assignee_id, reporter_id, estimated_hours,
        due_date, start_date, tags, created_by, updated_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING *
    `;

    const values = [
      tenantId,
      data.projectId,
      data.parentTaskId,
      data.title,
      data.description,
      data.status || 'todo',
      data.priority || 'medium',
      data.assigneeId,
      userId,
      data.estimatedHours,
      data.dueDate,
      data.startDate,
      data.tags ? JSON.stringify(data.tags) : null,
      userId,
      userId,
    ];

    const result = await this.pool.query(query, values);
    logger.info(`Task created: ${result.rows[0].id}`);
    return result.rows[0];
  }

  async update(id: string, data: Partial<Task>, userId: string, tenantId: string): Promise<Task> {
    const current = await this.findById(id, tenantId);
    if (!current) throw new Error('Task not found');

    const query = `
      UPDATE tasks
      SET
        title = COALESCE($1, title),
        description = COALESCE($2, description),
        status = COALESCE($3, status),
        priority = COALESCE($4, priority),
        assignee_id = COALESCE($5, assignee_id),
        estimated_hours = COALESCE($6, estimated_hours),
        actual_hours = COALESCE($7, actual_hours),
        due_date = COALESCE($8, due_date),
        completed_at = COALESCE($9, completed_at),
        updated_by = $10,
        updated_at = NOW(),
        version = version + 1
      WHERE id = $11 AND tenant_id = $12 AND is_deleted = FALSE
      RETURNING *
    `;

    const isCompleted = data.status === 'done' && current.status !== 'done';
    
    const values = [
      data.title,
      data.description,
      data.status,
      data.priority,
      data.assigneeId,
      data.estimatedHours,
      data.actualHours,
      data.dueDate,
      isCompleted ? new Date() : null,
      userId,
      id,
      tenantId,
    ];

    const result = await this.pool.query(query, values);
    logger.info(`Task updated: ${id}`);
    return result.rows[0];
  }

  async delete(id: string, userId: string, tenantId: string): Promise<void> {
    const query = `
      UPDATE tasks
      SET is_deleted = TRUE, deleted_by = $1, deleted_at = NOW()
      WHERE id = $2 AND tenant_id = $3
    `;

    await this.pool.query(query, [userId, id, tenantId]);
    logger.info(`Task deleted: ${id}`);
  }

  async getStats(projectId: string, tenantId: string) {
    const query = `
      SELECT
        status,
        priority,
        COUNT(*) as count
      FROM tasks
      WHERE tenant_id = $1 AND project_id = $2 AND is_deleted = FALSE
      GROUP BY status, priority
    `;

    const result = await this.pool.query(query, [tenantId, projectId]);

    const stats = {
      total: 0,
      byStatus: {} as Record<string, number>,
      byPriority: {} as Record<string, number>,
    };

    result.rows.forEach((row: any) => {
      stats.byStatus[row.status] = parseInt(row.count);
      stats.byPriority[row.priority] = parseInt(row.count);
      stats.total += parseInt(row.count);
    });

    return stats;
  }
}

export default TaskService;
