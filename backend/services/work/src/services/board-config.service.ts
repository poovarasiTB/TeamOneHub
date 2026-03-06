import { Pool } from 'pg';
import { database } from '../database';

interface BoardConfig {
    projectId: string;
    tenantId: string;
    columns: any[];
    wipLimits: any;
    enabledFeatures: string[];
    updatedAt: Date;
}

export class BoardConfigService {
    private pool: Pool;

    constructor() {
        this.pool = database.getPool();
    }

    async findByProjectId(projectId: string, tenantId: string): Promise<BoardConfig | null> {
        const query = `
      SELECT * FROM board_configs
      WHERE project_id = $1 AND tenant_id = $2
    `;
        const result = await this.pool.query(query, [projectId, tenantId]);
        if (result.rows.length === 0) return null;
        return this.mapToCamelCase(result.rows[0]);
    }

    async upsert(projectId: string, data: Partial<BoardConfig>, tenantId: string): Promise<BoardConfig> {
        const query = `
      INSERT INTO board_configs (project_id, tenant_id, columns, wip_limits, enabled_features)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (project_id) 
      DO UPDATE SET
        columns = EXCLUDED.columns,
        wip_limits = EXCLUDED.wip_limits,
        enabled_features = EXCLUDED.enabled_features,
        updated_at = NOW()
      RETURNING *
    `;

        // Default columns if not provided
        const defaultColumns = [
            { id: 'todo', name: 'To Do', order: 1 },
            { id: 'in-progress', name: 'In Progress', order: 2 },
            { id: 'review', name: 'Review', order: 3 },
            { id: 'done', name: 'Done', order: 4 }
        ];

        const values = [
            projectId,
            tenantId,
            data.columns ? JSON.stringify(data.columns) : JSON.stringify(defaultColumns),
            data.wipLimits ? JSON.stringify(data.wipLimits) : '{}',
            data.enabledFeatures ? JSON.stringify(data.enabledFeatures) : '[]'
        ];

        const result = await this.pool.query(query, values);
        return this.mapToCamelCase(result.rows[0]);
    }

    private mapToCamelCase(row: any): BoardConfig {
        return {
            projectId: row.project_id,
            tenantId: row.tenant_id,
            columns: typeof row.columns === 'string' ? JSON.parse(row.columns) : row.columns,
            wipLimits: typeof row.wip_limits === 'string' ? JSON.parse(row.wip_limits) : row.wip_limits,
            enabledFeatures: typeof row.enabled_features === 'string' ? JSON.parse(row.enabled_features) : row.enabled_features,
            updatedAt: row.updated_at
        };
    }
}
