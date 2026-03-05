import { Pool } from 'pg';
import { database } from '../database';

interface Customer {
  id: string;
  tenantId: string;
  name: string;
  email: string;
  phone?: string;
  type: 'enterprise' | 'smb' | 'small-business' | 'startup';
  status: 'active' | 'inactive';
  address?: string;
  city?: string;
  country?: string;
  taxId?: string;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;
  isDeleted: boolean;
  version: number;
}

interface CustomerFilters {
  page: number;
  limit: number;
  search?: string;
  type?: string;
  tenantId: string;
}

export class CustomerService {
  private pool: Pool;

  constructor() {
    this.pool = database.getPool();
  }

  async findAll(filters: CustomerFilters) {
    const { page, limit, search, type, tenantId } = filters;
    const offset = (page - 1) * limit;

    let query = `
      SELECT * FROM customers 
      WHERE tenant_id = $1 AND is_deleted = FALSE
    `;
    
    const values: any[] = [tenantId];
    let paramIndex = 2;

    if (search) {
      query += ` AND (name ILIKE $${paramIndex} OR email ILIKE $${paramIndex})`;
      values.push(`%${search}%`);
      paramIndex++;
    }

    if (type) {
      query += ` AND type = $${paramIndex}`;
      values.push(type);
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

  async findById(id: string, tenantId: string): Promise<Customer | null> {
    const query = `
      SELECT * FROM customers 
      WHERE id = $1 AND tenant_id = $2 AND is_deleted = FALSE
    `;
    
    const result = await this.pool.query(query, [id, tenantId]);
    return result.rows[0] || null;
  }

  async create(data: Partial<Customer>, userId: string, tenantId: string): Promise<Customer> {
    const query = `
      INSERT INTO customers (
        tenant_id, name, email, phone, type, status,
        address, city, country, tax_id, created_by, updated_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `;

    const values = [
      tenantId,
      data.name,
      data.email,
      data.phone,
      data.type || 'smb',
      data.status || 'active',
      data.address,
      data.city,
      data.country,
      data.taxId,
      userId,
      userId,
    ];

    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async update(id: string, data: Partial<Customer>, userId: string, tenantId: string): Promise<Customer> {
    const current = await this.findById(id, tenantId);
    if (!current) {
      throw new Error('Customer not found');
    }

    const query = `
      UPDATE customers 
      SET 
        name = COALESCE($1, name),
        email = COALESCE($2, email),
        phone = COALESCE($3, phone),
        type = COALESCE($4, type),
        status = COALESCE($5, status),
        address = COALESCE($6, address),
        city = COALESCE($7, city),
        country = COALESCE($8, country),
        tax_id = COALESCE($9, tax_id),
        updated_by = $10,
        updated_at = NOW(),
        version = version + 1
      WHERE id = $11 AND tenant_id = $12 AND is_deleted = FALSE
      RETURNING *
    `;

    const values = [
      data.name,
      data.email,
      data.phone,
      data.type,
      data.status,
      data.address,
      data.city,
      data.country,
      data.taxId,
      userId,
      id,
      tenantId,
    ];

    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async delete(id: string, userId: string, tenantId: string): Promise<void> {
    const current = await this.findById(id, tenantId);
    if (!current) {
      throw new Error('Customer not found');
    }

    const query = `
      UPDATE customers 
      SET is_deleted = TRUE, deleted_by = $1, deleted_at = NOW(), updated_at = NOW()
      WHERE id = $2 AND tenant_id = $3
    `;

    await this.pool.query(query, [userId, id, tenantId]);
  }

  async getStats(tenantId: string) {
    const query = `
      SELECT 
        type,
        status,
        COUNT(*) as count,
        COALESCE(SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END), 0) as active_count
      FROM customers
      WHERE tenant_id = $1 AND is_deleted = FALSE
      GROUP BY type, status
    `;

    const result = await this.pool.query(query, [tenantId]);
    
    const stats = {
      total: 0,
      byType: {} as Record<string, number>,
      byStatus: {} as Record<string, number>,
      activeCount: 0,
    };

    result.rows.forEach((row: any) => {
      stats.byType[row.type] = parseInt(row.count);
      stats.byStatus[row.status] = parseInt(row.count);
      stats.total += parseInt(row.count);
      stats.activeCount += parseInt(row.active_count);
    });

    return stats;
  }
}
