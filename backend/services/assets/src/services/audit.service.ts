import { database } from '../utils/database';
import { logger } from '../utils/logger';

export class AuditService {
  async log(entityType: string, entityId: string, action: string, userId: string, tenantId: string, changes?: any): Promise<void> {
    try {
      const pool = database.getPool();
      const query = `
        INSERT INTO audit_logs (entity_type, entity_id, action, user_id, tenant_id, changes, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, NOW())
      `;
      await pool.query(query, [entityType, entityId, action, userId, tenantId, changes ? JSON.stringify(changes) : null]);
      logger.info(`Audit log created: ${action} on ${entityType}/${entityId}`);
    } catch (error) {
      logger.error(`Failed to create audit log: ${error}`);
    }
  }
}

export default AuditService;
