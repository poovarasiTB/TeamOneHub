import { Pool } from 'pg';
import { database } from '../database';
import { logger } from '../utils/logger';

interface Milestone {
    id: string;
    projectId: string;
    name: string;
    dueDate: Date;
    status: 'pending' | 'in-progress' | 'completed' | 'missed';
    deliverables: string[];
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
    updatedBy: string;
}

export class MilestoneService {
    private pool: Pool;

    constructor() {
        this.pool = database.getPool();
    }

    async findByProjectId(projectId: string, tenantId: string): Promise<Milestone[]> {
        // We join with projects to ensure tenant isolation
        const query = `
      SELECT m.* 
      FROM milestones m
      JOIN projects p ON p.id = m.project_id
      WHERE m.project_id = $1 AND p.tenant_id = $2 AND p.is_deleted = FALSE
      ORDER BY m.due_date ASC
    `;
        const result = await this.pool.query(query, [projectId, tenantId]);
        return result.rows.map(this.mapToCamelCase);
    }

    async create(projectId: string, data: Partial<Milestone>, userId: string, tenantId: string): Promise<Milestone> {
        const client = await this.pool.connect();
        try {
            await client.query('BEGIN');

            // Verify project ownership/tenant
            const projectCheck = await client.query('SELECT id FROM projects WHERE id = $1 AND tenant_id = $2 AND is_deleted = FALSE', [projectId, tenantId]);
            if (projectCheck.rows.length === 0) {
                throw new Error('Project not found');
            }

            const query = `
        INSERT INTO milestones (
          project_id, name, due_date, status, deliverables, created_by, updated_by
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `;
            const values = [
                projectId,
                data.name,
                data.dueDate,
                data.status || 'pending',
                data.deliverables || [],
                userId,
                userId
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

    async update(id: string, projectId: string, data: Partial<Milestone>, userId: string, tenantId: string): Promise<Milestone> {
        const client = await this.pool.connect();
        try {
            await client.query('BEGIN');

            // Verify project ownership/tenant
            const projectCheck = await client.query('SELECT id FROM projects WHERE id = $1 AND tenant_id = $2 AND is_deleted = FALSE', [projectId, tenantId]);
            if (projectCheck.rows.length === 0) {
                throw new Error('Project not found');
            }

            const query = `
        UPDATE milestones
        SET 
          name = COALESCE($1, name),
          due_date = COALESCE($2, due_date),
          status = COALESCE($3, status),
          deliverables = COALESCE($4, deliverables),
          updated_by = $5,
          updated_at = NOW()
        WHERE id = $6 AND project_id = $7
        RETURNING *
      `;
            const values = [
                data.name,
                data.dueDate,
                data.status,
                data.deliverables,
                userId,
                id,
                projectId
            ];
            const result = await client.query(query, values);
            if (result.rows.length === 0) {
                throw new Error('Milestone not found');
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

    async delete(id: string, projectId: string, tenantId: string): Promise<void> {
        const query = `
      DELETE FROM milestones m
      USING projects p
      WHERE m.id = $1 AND m.project_id = $2 AND m.project_id = p.id AND p.tenant_id = $3
    `;
        const result = await this.pool.query(query, [id, projectId, tenantId]);
        if (result.rowCount === 0) {
            throw new Error('Milestone not found or access denied');
        }
    }

    private mapToCamelCase(row: any): Milestone {
        return {
            id: row.id,
            projectId: row.project_id,
            name: row.name,
            dueDate: row.due_date,
            status: row.status,
            deliverables: row.deliverables,
            createdAt: row.created_at,
            createdBy: row.created_by,
            updatedAt: row.updated_at,
            updatedBy: row.updated_by
        };
    }
}
