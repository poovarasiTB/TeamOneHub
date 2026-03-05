import { database } from '../database';
import { logger } from '../utils/logger';

interface AuditLogOptions {
  client?: any;
  action: string;
  resourceId: string;
  resourceType: string;
  userId: string;
  tenantId: string;
  changes?: { before?: any; after?: any };
}

export class AuditService {
  async log(options: AuditLogOptions | string, entityId?: string, action?: string, userId?: string, tenantId?: string, changes?: any): Promise<void> {
    try {
      let entityType: string, resourceId: string, actionVal: string, userIdVal: string, tenantIdVal: string, changesVal: any;
      
      if (typeof options === 'string') {
        entityType = options;
        resourceId = entityId || '';
        actionVal = action || '';
        userIdVal = userId || '';
        tenantIdVal = tenantId || '';
        changesVal = changes;
      } else {
        entityType = options.resourceType;
        resourceId = options.resourceId;
        actionVal = options.action;
        userIdVal = options.userId;
        tenantIdVal = options.tenantId;
        changesVal = options.changes;
      }

      const pool = database.getPool();
      const query = `
        INSERT INTO audit_logs (entity_type, entity_id, action, user_id, tenant_id, changes, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, NOW())
      `;
      await pool.query(query, [entityType, resourceId, actionVal, userIdVal, tenantIdVal, changesVal ? JSON.stringify(changesVal) : null]);
      logger.info(`Audit log created: ${actionVal} on ${entityType}/${resourceId}`);
    } catch (error) {
      logger.error(`Failed to create audit log: ${error}`);
    }
  }
}

export default AuditService;
