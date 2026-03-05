import { Pool } from 'pg';
import { database } from '../utils/database';
import { logger } from '../utils/logger';

interface License {
  id: string;
  tenantId: string;
  licenseKey?: string;
  softwareName: string;
  publisher?: string;
  licenseType: 'perpetual' | 'subscription' | 'concurrent';
  totalSeats: number;
  usedSeats: number;
  purchaseDate?: Date;
  expiryDate?: Date;
  autoRenew: boolean;
  cost?: number;
  currency: string;
  status: 'active' | 'expiring' | 'expired';
  complianceStatus: 'compliant' | 'overallocated' | 'expiring-soon' | 'expired';
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;
  isDeleted: boolean;
  version: number;
}

export class LicenseService {
  private pool: Pool;

  constructor() {
    this.pool = database.getPool();
  }

  async findAll(filters: any) {
    const { page = 1, limit = 20, status, search, tenantId } = filters;
    const offset = (page - 1) * limit;

    let query = `
      SELECT * FROM software_licenses 
      WHERE tenant_id = $1 AND is_deleted = FALSE
    `;
    
    const values: any[] = [tenantId];
    let paramIndex = 2;

    if (status) {
      query += ` AND status = $${paramIndex}`;
      values.push(status);
      paramIndex++;
    }

    if (search) {
      query += ` AND (software_name ILIKE $${paramIndex} OR publisher ILIKE $${paramIndex})`;
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

  async findById(id: string, tenantId: string): Promise<License | null> {
    const query = `SELECT * FROM software_licenses WHERE id = $1 AND tenant_id = $2 AND is_deleted = FALSE`;
    const result = await this.pool.query(query, [id, tenantId]);
    return result.rows[0] || null;
  }

  async create(data: Partial<License>, userId: string, tenantId: string): Promise<License> {
    const query = `
      INSERT INTO software_licenses (
        tenant_id, license_key, software_name, publisher, license_type,
        total_seats, used_seats, purchase_date, expiry_date, auto_renew,
        cost, currency, status, compliance_status, created_by, updated_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING *
    `;

    const values = [
      tenantId,
      data.licenseKey,
      data.softwareName,
      data.publisher,
      data.licenseType || 'subscription',
      data.totalSeats || 1,
      data.usedSeats || 0,
      data.purchaseDate,
      data.expiryDate,
      data.autoRenew || false,
      data.cost,
      data.currency || 'USD',
      data.status || 'active',
      data.complianceStatus || 'compliant',
      userId,
      userId,
    ];

    const result = await this.pool.query(query, values);
    logger.info(`License created: ${result.rows[0].id}`);
    return result.rows[0];
  }

  async update(id: string, data: Partial<License>, userId: string, tenantId: string): Promise<License> {
    const current = await this.findById(id, tenantId);
    if (!current) throw new Error('License not found');

    const query = `
      UPDATE software_licenses 
      SET 
        software_name = COALESCE($1, software_name),
        publisher = COALESCE($2, publisher),
        license_type = COALESCE($3, license_type),
        total_seats = COALESCE($4, total_seats),
        used_seats = COALESCE($5, used_seats),
        expiry_date = COALESCE($6, expiry_date),
        auto_renew = COALESCE($7, auto_renew),
        cost = COALESCE($8, cost),
        status = COALESCE($9, status),
        compliance_status = COALESCE($10, compliance_status),
        updated_by = $11,
        updated_at = NOW(),
        version = version + 1
      WHERE id = $12 AND tenant_id = $13 AND is_deleted = FALSE
      RETURNING *
    `;

    const values = [
      data.softwareName,
      data.publisher,
      data.licenseType,
      data.totalSeats,
      data.usedSeats,
      data.expiryDate,
      data.autoRenew,
      data.cost,
      data.status,
      data.complianceStatus,
      userId,
      id,
      tenantId,
    ];

    const result = await this.pool.query(query, values);
    logger.info(`License updated: ${id}`);
    return result.rows[0];
  }

  async delete(id: string, userId: string, tenantId: string): Promise<void> {
    const query = `
      UPDATE software_licenses 
      SET is_deleted = TRUE, deleted_by = $1, deleted_at = NOW()
      WHERE id = $2 AND tenant_id = $3
    `;
    await this.pool.query(query, [userId, id, tenantId]);
    logger.info(`License deleted: ${id}`);
  }

  async getCompliance(tenantId: string) {
    const query = `
      SELECT 
        compliance_status,
        COUNT(*) as count,
        SUM(total_seats) as total_seats,
        SUM(used_seats) as used_seats
      FROM software_licenses
      WHERE tenant_id = $1 AND is_deleted = FALSE
      GROUP BY compliance_status
    `;

    const result = await this.pool.query(query, [tenantId]);
    
    const compliance = {
      compliant: { count: 0, seats: 0, used: 0 },
      overallocated: { count: 0, seats: 0, used: 0 },
      'expiring-soon': { count: 0, seats: 0, used: 0 },
      expired: { count: 0, seats: 0, used: 0 },
    };

    result.rows.forEach((row: any) => {
      const status = row.compliance_status as keyof typeof compliance;
      if (compliance[status]) {
        compliance[status].count = parseInt(row.count);
        compliance[status].seats = parseInt(row.total_seats);
        compliance[status].used = parseInt(row.used_seats);
      }
    });

    return compliance;
  }
}
