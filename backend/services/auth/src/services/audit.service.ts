interface AuditLog {
  tenantId: string;
  userId: string;
  action: string;
  entityType: string;
  entityId?: string;
  changes?: any;
}

export class AuditService {
  async log(data: AuditLog): Promise<void> {
    // Placeholder - would write to audit log table
    console.log('Audit:', data);
  }
}
