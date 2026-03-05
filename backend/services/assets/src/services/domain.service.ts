import { Pool } from 'pg';
import { database } from '../utils/database';
import { logger } from '../utils/logger';

interface Domain {
  id: string;
  tenantId: string;
  domainName: string;
  registrar?: string;
  registrationDate?: Date;
  expiryDate: Date;
  autoRenew: boolean;
  status: 'active' | 'expiring-soon' | 'expired';
  nameServers?: string[];
  dnsProvider?: string;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;
  isDeleted: boolean;
  version: number;
}

export class DomainService {
  private pool: Pool;

  constructor() {
    this.pool = database.getPool();
  }

  async findAll(filters: any) {
    const { page = 1, limit = 20, search, tenantId } = filters;
    const offset = (page - 1) * limit;

    let query = `
      SELECT * FROM domains 
      WHERE tenant_id = $1 AND is_deleted = FALSE
    `;
    
    const values: any[] = [tenantId];
    let paramIndex = 2;

    if (search) {
      query += ` AND domain_name ILIKE $${paramIndex}`;
      values.push(`%${search}%`);
      paramIndex++;
    }

    const countQuery = query.replace('SELECT *', 'SELECT COUNT(*)');
    const countResult = await this.pool.query(countQuery, values);
    const total = parseInt(countResult.rows[0].count);

    query += ` ORDER BY expiry_date ASC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
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

  async findById(id: string, tenantId: string): Promise<Domain | null> {
    const query = `SELECT * FROM domains WHERE id = $1 AND tenant_id = $2 AND is_deleted = FALSE`;
    const result = await this.pool.query(query, [id, tenantId]);
    return result.rows[0] || null;
  }

  async create(data: Partial<Domain>, userId: string, tenantId: string): Promise<Domain> {
    const query = `
      INSERT INTO domains (
        tenant_id, domain_name, registrar, registration_date, expiry_date,
        auto_renew, status, name_servers, dns_provider, created_by, updated_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `;

    const values = [
      tenantId,
      data.domainName,
      data.registrar,
      data.registrationDate,
      data.expiryDate,
      data.autoRenew || false,
      data.status || 'active',
      data.nameServers ? JSON.stringify(data.nameServers) : null,
      data.dnsProvider,
      userId,
      userId,
    ];

    const result = await this.pool.query(query, values);
    logger.info(`Domain created: ${result.rows[0].id}`);
    return result.rows[0];
  }

  async update(id: string, data: Partial<Domain>, userId: string, tenantId: string): Promise<Domain> {
    const current = await this.findById(id, tenantId);
    if (!current) throw new Error('Domain not found');

    const query = `
      UPDATE domains 
      SET 
        domain_name = COALESCE($1, domain_name),
        registrar = COALESCE($2, registrar),
        registration_date = COALESCE($3, registration_date),
        expiry_date = COALESCE($4, expiry_date),
        auto_renew = COALESCE($5, auto_renew),
        status = COALESCE($6, status),
        name_servers = COALESCE($7, name_servers),
        dns_provider = COALESCE($8, dns_provider),
        updated_by = $9,
        updated_at = NOW(),
        version = version + 1
      WHERE id = $10 AND tenant_id = $11 AND is_deleted = FALSE
      RETURNING *
    `;

    const values = [
      data.domainName,
      data.registrar,
      data.registrationDate,
      data.expiryDate,
      data.autoRenew,
      data.status,
      data.nameServers ? JSON.stringify(data.nameServers) : null,
      data.dnsProvider,
      userId,
      id,
      tenantId,
    ];

    const result = await this.pool.query(query, values);
    logger.info(`Domain updated: ${id}`);
    return result.rows[0];
  }

  async delete(id: string, userId: string, tenantId: string): Promise<void> {
    const query = `
      UPDATE domains 
      SET is_deleted = TRUE, deleted_by = $1, deleted_at = NOW()
      WHERE id = $2 AND tenant_id = $3
    `;
    await this.pool.query(query, [userId, id, tenantId]);
    logger.info(`Domain deleted: ${id}`);
  }

  async getExpiringSoon(tenantId: string, days = 30) {
    const query = `
      SELECT * FROM domains 
      WHERE tenant_id = $1 
        AND is_deleted = FALSE
        AND expiry_date <= NOW() + INTERVAL '${days} days'
        AND status != 'expired'
      ORDER BY expiry_date ASC
    `;

    const result = await this.pool.query(query, [tenantId]);
    return result.rows;
  }
}
