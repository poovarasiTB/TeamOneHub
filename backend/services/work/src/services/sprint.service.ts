import { Pool } from 'pg';
import { database } from '../database';
import { logger } from '../utils/logger';

interface Sprint {
  id: string;
  tenantId: string;
  projectId: string;
  name: string;
  status: 'planning' | 'active' | 'completed' | 'cancelled';
  startDate: string;
  endDate: string;
  goal?: string;
}

interface SprintFilters {
  page: number;
  limit: number;
  projectId?: string;
  status?: string;
  tenantId: string;
}

export class SprintService {
  private pool: Pool;

  constructor() {
    this.pool = database.getPool();
  }

  async findAll(filters: SprintFilters) {
    const { page, limit, projectId, status, tenantId } = filters;
    const offset = (page - 1) * limit;

    let query = `
      SELECT * FROM sprints
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

    const countQuery = query.replace('SELECT *', 'SELECT COUNT(*)');
    const countResult = await this.pool.query(countQuery, values);
    const total = parseInt(countResult.rows[0].count);

    query += ` ORDER BY start_date DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
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

  async findById(id: string, tenantId: string): Promise<Sprint | null> {
    const query = `
      SELECT * FROM sprints
      WHERE id = $1 AND tenant_id = $2 AND is_deleted = FALSE
    `;

    const result = await this.pool.query(query, [id, tenantId]);
    return result.rows[0] || null;
  }

  async create(data: Partial<Sprint>, userId: string, tenantId: string): Promise<Sprint> {
    const query = `
      INSERT INTO sprints (
        tenant_id, project_id, name, status, start_date,
        end_date, goal, created_by, updated_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;

    const values = [
      tenantId,
      data.projectId,
      data.name,
      data.status || 'planning',
      data.startDate,
      data.endDate,
      data.goal,
      userId,
      userId,
    ];

    const result = await this.pool.query(query, values);
    logger.info(`Sprint created: ${result.rows[0].id}`);
    return result.rows[0];
  }

  async update(id: string, data: Partial<Sprint>, userId: string, tenantId: string): Promise<Sprint> {
    const current = await this.findById(id, tenantId);
    if (!current) throw new Error('Sprint not found');

    const query = `
      UPDATE sprints
      SET
        name = COALESCE($1, name),
        status = COALESCE($2, status),
        start_date = COALESCE($3, start_date),
        end_date = COALESCE($4, end_date),
        goal = COALESCE($5, goal),
        updated_by = $6,
        updated_at = NOW(),
        version = version + 1
      WHERE id = $7 AND tenant_id = $8 AND is_deleted = FALSE
      RETURNING *
    `;

    const values = [
      data.name,
      data.status,
      data.startDate,
      data.endDate,
      data.goal,
      userId,
      id,
      tenantId,
    ];

    const result = await this.pool.query(query, values);
    logger.info(`Sprint updated: ${id}`);
    return result.rows[0];
  }

  async delete(id: string, userId: string, tenantId: string): Promise<void> {
    const query = `
      UPDATE sprints
      SET is_deleted = TRUE, deleted_by = $1, deleted_at = NOW()
      WHERE id = $2 AND tenant_id = $3
    `;

    await this.pool.query(query, [userId, id, tenantId]);
    logger.info(`Sprint deleted: ${id}`);
  }

  async addTask(sprintId: string, taskId: string, _tenantId: string) {
    const query = `
      INSERT INTO sprint_tasks (sprint_id, task_id)
      VALUES ($1, $2)
      ON CONFLICT (sprint_id, task_id) DO NOTHING
      RETURNING *
    `;

    const result = await this.pool.query(query, [sprintId, taskId]);
    logger.info(`Task added to sprint: ${taskId} -> ${sprintId}`);
    return result.rows[0];
  }

  async getTasks(sprintId: string, tenantId: string) {
    const query = `
      SELECT t.*
      FROM tasks t
      JOIN sprint_tasks st ON t.id = st.task_id
      WHERE st.sprint_id = $1 AND t.tenant_id = $2 AND t.is_deleted = FALSE
      ORDER BY t.created_at
    `;

    const result = await this.pool.query(query, [sprintId, tenantId]);
    return result.rows;
  }
}

export default SprintService;
