import { Pool } from 'pg';
import { database } from '../utils/database';
import { logger } from '../utils/logger';

interface Asset {
  id: string;
  tenantId: string;
  assetCode: string;
  name: string;
  type: 'hardware' | 'software' | 'cloud' | 'digital';
  category?: string;
  status: 'active' | 'inactive' | 'maintenance' | 'retired';
  serialNumber?: string;
  manufacturer?: string;
  model?: string;
  purchaseDate?: Date;
  purchaseCost?: number;
  warrantyEndDate?: Date;
  assignedToType?: string;
  assignedToId?: string;
  location?: string;
  specifications?: any;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;
  isDeleted: boolean;
  version: number;
}

interface AssetFilters {
  page: number;
  limit: number;
  type?: string;
  status?: string;
  search?: string;
  assignedTo?: string;
  tenantId: string;
}

export class AssetService {
  private pool: Pool;

  constructor() {
    this.pool = database.getPool();
  }

  async findAll(filters: AssetFilters) {
    const { page, limit, type, status, search, assignedTo, tenantId } = filters;
    const offset = (page - 1) * limit;

    let query = `
      SELECT * FROM assets 
      WHERE tenant_id = $1 
        AND is_deleted = FALSE
    `;
    
    const values: any[] = [tenantId];
    let paramIndex = 2;

    if (type) {
      query += ` AND type = $${paramIndex}`;
      values.push(type);
      paramIndex++;
    }

    if (status) {
      query += ` AND status = $${paramIndex}`;
      values.push(status);
      paramIndex++;
    }

    if (search) {
      query += ` AND (name ILIKE $${paramIndex} OR asset_code ILIKE $${paramIndex} OR serial_number ILIKE $${paramIndex})`;
      values.push(`%${search}%`);
      paramIndex++;
    }

    if (assignedTo) {
      query += ` AND assigned_to_id = $${paramIndex}`;
      values.push(assignedTo);
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

  async findById(id: string, tenantId: string): Promise<Asset | null> {
    const query = `
      SELECT * FROM assets 
      WHERE id = $1 AND tenant_id = $2 AND is_deleted = FALSE
    `;
    
    const result = await this.pool.query(query, [id, tenantId]);
    return result.rows[0] || null;
  }

  async create(data: Partial<Asset>, userId: string, tenantId: string): Promise<Asset> {
    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');

      const assetCode = await this.generateAssetCode(tenantId, client);

      const query = `
        INSERT INTO assets (
          tenant_id, asset_code, name, type, category, status,
          serial_number, manufacturer, model, purchase_date, purchase_cost,
          warranty_end_date, assigned_to_type, assigned_to_id, location,
          specifications, created_by, updated_by
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
        RETURNING *
      `;

      const values = [
        tenantId,
        assetCode,
        data.name,
        data.type,
        data.category,
        data.status || 'active',
        data.serialNumber,
        data.manufacturer,
        data.model,
        data.purchaseDate,
        data.purchaseCost,
        data.warrantyEndDate,
        data.assignedToType,
        data.assignedToId,
        data.location,
        JSON.stringify(data.specifications || {}),
        userId,
        userId,
      ];

      const result = await client.query(query, values);
      const asset = result.rows[0];

      await client.query('COMMIT');
      
      logger.info(`Asset created: ${asset.id} (${asset.assetCode})`);
      
      return asset;
    } catch (error) {
      await client.query('ROLLBACK');
      logger.error(`Error creating asset: ${error}`);
      throw error;
    } finally {
      client.release();
    }
  }

  async update(id: string, data: Partial<Asset>, userId: string, tenantId: string): Promise<Asset> {
    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');

      const currentAsset = await this.findById(id, tenantId);
      if (!currentAsset) {
        throw new Error('Asset not found');
      }

      const query = `
        UPDATE assets 
        SET 
          name = COALESCE($1, name),
          type = COALESCE($2, type),
          category = COALESCE($3, category),
          status = COALESCE($4, status),
          serial_number = COALESCE($5, serial_number),
          manufacturer = COALESCE($6, manufacturer),
          model = COALESCE($7, model),
          purchase_date = COALESCE($8, purchase_date),
          purchase_cost = COALESCE($9, purchase_cost),
          warranty_end_date = COALESCE($10, warranty_end_date),
          assigned_to_type = COALESCE($11, assigned_to_type),
          assigned_to_id = COALESCE($12, assigned_to_id),
          location = COALESCE($13, location),
          specifications = COALESCE($14, specifications),
          updated_by = $15,
          updated_at = NOW(),
          version = version + 1
        WHERE id = $16 AND tenant_id = $17 AND is_deleted = FALSE
        RETURNING *
      `;

      const values = [
        data.name,
        data.type,
        data.category,
        data.status,
        data.serialNumber,
        data.manufacturer,
        data.model,
        data.purchaseDate,
        data.purchaseCost,
        data.warrantyEndDate,
        data.assignedToType,
        data.assignedToId,
        data.location,
        data.specifications ? JSON.stringify(data.specifications) : null,
        userId,
        id,
        tenantId,
      ];

      const result = await client.query(query, values);
      const asset = result.rows[0];

      await client.query('COMMIT');
      
      logger.info(`Asset updated: ${asset.id}`);
      
      return asset;
    } catch (error) {
      await client.query('ROLLBACK');
      logger.error(`Error updating asset: ${error}`);
      throw error;
    } finally {
      client.release();
    }
  }

  async assign(id: string, assignment: any, userId: string, tenantId: string): Promise<Asset> {
    return this.update(id, {
      assignedToType: assignment.assignedToType,
      assignedToId: assignment.assignedToId,
      status: 'active',
    }, userId, tenantId);
  }

  async recordMaintenance(id: string, maintenance: any, userId: string, _tenantId: string) {
    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');

      const query = `
        INSERT INTO asset_maintenance (
          asset_id, maintenance_type, description, scheduled_date,
          cost, vendor, notes, status, created_by, updated_by
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *
      `;

      const values = [
        id,
        maintenance.maintenanceType,
        maintenance.description,
        maintenance.scheduledDate,
        maintenance.cost,
        maintenance.vendor,
        maintenance.notes,
        maintenance.status || 'scheduled',
        userId,
        userId,
      ];

      const result = await client.query(query, values);
      
      await client.query('COMMIT');
      
      return result.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async delete(id: string, userId: string, tenantId: string): Promise<void> {
    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');

      const asset = await this.findById(id, tenantId);
      if (!asset) {
        throw new Error('Asset not found');
      }

      const query = `
        UPDATE assets 
        SET is_deleted = TRUE, deleted_by = $1, deleted_at = NOW(), updated_at = NOW()
        WHERE id = $2 AND tenant_id = $3
      `;

      await client.query(query, [userId, id, tenantId]);

      await client.query('COMMIT');
      
      logger.info(`Asset deleted: ${id}`);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async getStats(tenantId: string) {
    const query = `
      SELECT 
        type,
        status,
        COUNT(*) as count,
        COALESCE(SUM(purchase_cost), 0) as total_value
      FROM assets
      WHERE tenant_id = $1 AND is_deleted = FALSE
      GROUP BY type, status
    `;

    const result = await this.pool.query(query, [tenantId]);
    
    const stats = {
      total: 0,
      byType: {} as Record<string, any>,
      byStatus: {} as Record<string, number>,
      totalValue: 0,
    };

    result.rows.forEach((row: any) => {
      if (!stats.byType[row.type]) {
        stats.byType[row.type] = { count: 0, value: 0 };
      }
      stats.byType[row.type].count += parseInt(row.count);
      stats.byType[row.type].value += parseFloat(row.total_value);
      
      stats.byStatus[row.status] = parseInt(row.count);
      stats.total += parseInt(row.count);
      stats.totalValue += parseFloat(row.total_value);
    });

    return stats;
  }

  async getHistory(id: string, tenantId: string) {
    const query = `
      SELECT 
        a.id,
        a.asset_code,
        a.name,
        a.status,
        a.assigned_to_type,
        a.assigned_to_id,
        a.created_at,
        a.updated_at,
        m.id as maintenance_id,
        m.maintenance_type,
        m.description as maintenance_description,
        m.scheduled_date,
        m.completed_date,
        m.cost as maintenance_cost,
        m.status as maintenance_status
      FROM assets a
      LEFT JOIN asset_maintenance m ON m.asset_id = a.id
      WHERE a.id = $1 AND a.tenant_id = $2 AND a.is_deleted = FALSE
      ORDER BY m.scheduled_date DESC
    `;

    const result = await this.pool.query(query, [id, tenantId]);
    return result.rows;
  }

  private async generateAssetCode(tenantId: string, client: any): Promise<string> {
    const year = new Date().getFullYear();
    
    const query = `
      SELECT COUNT(*) as count 
      FROM assets 
      WHERE tenant_id = $1 AND asset_code LIKE 'AST-${year}-%'
    `;

    const result = await client.query(query, [tenantId]);
    const count = parseInt(result.rows[0].count) + 1;
    
    return `AST-${year}-${String(count).padStart(4, '0')}`;
  }
}
