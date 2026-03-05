import { Pool } from 'pg';
import { database } from '../database';

export class AuditService {
  private pool: Pool;

  constructor() {
    this.pool = database.getPool();
  }

  async log(data: {
    tenantId: string;
    userId: string;
    action: string;
    entityType: string;
    entityId: string;
    changes?: any;
  }): Promise<void> {
    const query = `
      INSERT INTO audit_logs (
        tenant_id, user_id, action, entity_type, entity_id,
        changes, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, NOW())
    `;

    const values = [
      data.tenantId,
      data.userId,
      data.action,
      data.entityType,
      data.entityId,
      data.changes ? JSON.stringify(data.changes) : null,
    ];

    try {
      await this.pool.query(query, values);
    } catch (error) {
      console.error('Failed to log audit:', error);
    }
  }
}
