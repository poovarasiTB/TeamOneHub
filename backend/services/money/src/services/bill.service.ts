import { Pool } from 'pg';
import { database } from '../database';
import { AuditService } from './audit.service';

interface Bill {
  id: string;
  tenantId: string;
  billNumber: string;
  vendorId: string;
  amount: number;
  taxAmount: number;
  totalAmount: number;
  status: 'draft' | 'pending' | 'approved' | 'paid' | 'overdue' | 'cancelled';
  dueDate: Date;
  receivedDate: Date;
  paidAt?: Date;
  approvedAt?: Date;
  approvedBy?: string;
  notes?: string;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;
  isDeleted: boolean;
  version: number;
}

interface BillFilters {
  page: number;
  limit: number;
  status?: string;
  vendorId?: string;
  search?: string;
  sort: string;
  order: 'ASC' | 'DESC';
  tenantId: string;
}

export class BillService {
  private pool: Pool;
  private auditService: AuditService;

  constructor() {
    this.pool = database.getPool();
    this.auditService = new AuditService();
  }

  /**
   * Find all bills with filtering and pagination
   */
  async findAll(filters: BillFilters) {
    const { page, limit, status, vendorId, search, sort: _sort, order: _order, tenantId } = filters;
    const offset = (page - 1) * limit;

    let query = `
      SELECT b.*, v.name as vendor_name, v.email as vendor_email
      FROM bills b
      LEFT JOIN vendors v ON v.id = b.vendor_id
      WHERE b.tenant_id = $1 AND b.is_deleted = FALSE
    `;

    const values: any[] = [tenantId];
    let paramIndex = 2;

    if (status) {
      query += ` AND b.status = $${paramIndex}`;
      values.push(status);
      paramIndex++;
    }

    if (vendorId) {
      query += ` AND b.vendor_id = $${paramIndex}`;
      values.push(vendorId);
      paramIndex++;
    }

    if (search) {
      query += ` AND (b.bill_number ILIKE $${paramIndex} OR v.name ILIKE $${paramIndex})`;
      values.push(`%${search}%`);
      paramIndex++;
    }

    const countQuery = query.replace('SELECT b.*, v.name as vendor_name, v.email as vendor_email', 'SELECT COUNT(*)');
    const countResult = await this.pool.query(countQuery, values);
    const total = parseInt(countResult.rows[0].count);

    query += ` ORDER BY b.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
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

  /**
   * Find bill by ID
   */
  async findById(id: string, tenantId: string): Promise<Bill | null> {
    const query = `
      SELECT b.*, v.name as vendor_name, v.email as vendor_email, v.phone as vendor_phone
      FROM bills b
      LEFT JOIN vendors v ON v.id = b.vendor_id
      WHERE b.id = $1 AND b.tenant_id = $2 AND b.is_deleted = FALSE
    `;

    const result = await this.pool.query(query, [id, tenantId]);

    if (result.rows.length === 0) {
      return null;
    }

    return this.mapRowToBill(result.rows[0]);
  }

  /**
   * Create new bill
   */
  async create(data: Partial<Bill>, createdBy: string, tenantId: string) {
    const query = `
      INSERT INTO bills (
        tenant_id, bill_number, vendor_id, amount, tax_amount,
        total_amount, status, due_date, received_date, notes,
        created_by, updated_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `;

    const values = [
      tenantId,
      data.billNumber,
      data.vendorId,
      data.amount,
      data.taxAmount || 0,
      data.totalAmount,
      data.status || 'draft',
      data.dueDate,
      data.receivedDate,
      data.notes || null,
      createdBy,
      createdBy,
    ];

    const result = await this.pool.query(query, values);

    await this.auditService.log({
      tenantId,
      userId: createdBy,
      action: 'CREATE',
      resourceType: 'bill',
      resourceId: result.rows[0].id,
      changes: { after: { billNumber: data.billNumber, amount: data.amount, vendorId: data.vendorId } },
    });

    return this.mapRowToBill(result.rows[0]);
  }

  /**
   * Update bill
   */
  async update(
    id: string,
    data: Partial<Bill>,
    updatedBy: string,
    tenantId: string
  ): Promise<Bill | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (data.billNumber !== undefined) {
      fields.push(`bill_number = $${paramIndex++}`);
      values.push(data.billNumber);
    }

    if (data.vendorId !== undefined) {
      fields.push(`vendor_id = $${paramIndex++}`);
      values.push(data.vendorId);
    }

    if (data.amount !== undefined) {
      fields.push(`amount = $${paramIndex++}`);
      values.push(data.amount);
    }

    if (data.taxAmount !== undefined) {
      fields.push(`tax_amount = $${paramIndex++}`);
      values.push(data.taxAmount);
    }

    if (data.totalAmount !== undefined) {
      fields.push(`total_amount = $${paramIndex++}`);
      values.push(data.totalAmount);
    }

    if (data.status !== undefined) {
      fields.push(`status = $${paramIndex++}`);
      values.push(data.status);
    }

    if (data.dueDate !== undefined) {
      fields.push(`due_date = $${paramIndex++}`);
      values.push(data.dueDate);
    }

    if (data.notes !== undefined) {
      fields.push(`notes = $${paramIndex++}`);
      values.push(data.notes);
    }

    fields.push(`updated_by = $${paramIndex++}`);
    values.push(updatedBy);

    if (fields.length === 0) {
      return this.findById(id, tenantId);
    }

    values.push(id, tenantId);
    const query = `
      UPDATE bills
      SET ${fields.join(', ')}, updated_at = NOW(), version = version + 1
      WHERE id = $${paramIndex++} AND tenant_id = $${paramIndex} AND is_deleted = FALSE
      RETURNING *
    `;

    const result = await this.pool.query(query, values);

    if (result.rows.length === 0) {
      return null;
    }

    await this.auditService.log({
      tenantId,
      userId: updatedBy,
      action: 'UPDATE',
      resourceType: 'bill',
      resourceId: id,
      changes: { after: data },
    });

    return this.mapRowToBill(result.rows[0]);
  }

  /**
   * Delete bill (soft delete)
   */
  async delete(id: string, deletedBy: string, tenantId: string): Promise<void> {
    const query = `
      UPDATE bills
      SET is_deleted = TRUE, updated_by = $1, updated_at = NOW()
      WHERE id = $2 AND tenant_id = $3 AND is_deleted = FALSE
    `;

    const result = await this.pool.query(query, [deletedBy, id, tenantId]);

    if (result.rows.length === 0) {
      throw new Error('Bill not found');
    }

    await this.auditService.log({
      tenantId,
      userId: deletedBy,
      action: 'DELETE',
      resourceType: 'bill',
      resourceId: id,
    });
  }

  /**
   * Approve bill
   */
  async approve(id: string, approvedBy: string, tenantId: string): Promise<Bill | null> {
    const bill = await this.findById(id, tenantId);
    if (!bill) {
      return null;
    }

    if (bill.status !== 'pending' && bill.status !== 'draft') {
      throw new Error('Bill can only be approved from pending or draft status');
    }

    const query = `
      UPDATE bills
      SET status = 'approved', approved_by = $1, approved_at = NOW(),
          updated_by = $1, updated_at = NOW()
      WHERE id = $2 AND tenant_id = $3
      RETURNING *
    `;

    const result = await this.pool.query(query, [approvedBy, id, tenantId]);

    await this.auditService.log({
      tenantId,
      userId: approvedBy,
      action: 'APPROVE',
      resourceType: 'bill',
      resourceId: id,
      changes: { after: { status: 'approved' } },
    });

    return this.mapRowToBill(result.rows[0]);
  }

  /**
   * Mark bill as paid
   */
  async markPaid(id: string, paidBy: string, tenantId: string, paymentDate?: Date): Promise<Bill | null> {
    const bill = await this.findById(id, tenantId);
    if (!bill) {
      return null;
    }

    if (bill.status !== 'approved') {
      throw new Error('Bill must be approved before marking as paid');
    }

    const query = `
      UPDATE bills
      SET status = 'paid', paid_at = NOW(),
          updated_by = $1, updated_at = NOW()
      WHERE id = $2 AND tenant_id = $3
      RETURNING *
    `;

    const result = await this.pool.query(query, [paidBy, id, tenantId]);

    await this.auditService.log({
      tenantId,
      userId: paidBy,
      action: 'MARK_PAID',
      resourceType: 'bill',
      resourceId: id,
      changes: { after: { status: 'paid', paidAt: paymentDate } },
    });

    return this.mapRowToBill(result.rows[0]);
  }

  /**
   * Get bill statistics
   */
  async getStats(tenantId: string): Promise<any> {
    const query = `
      SELECT
        COUNT(*) as total_bills,
        SUM(CASE WHEN status = 'draft' THEN 1 ELSE 0 END) as draft_count,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_count,
        SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved_count,
        SUM(CASE WHEN status = 'paid' THEN 1 ELSE 0 END) as paid_count,
        SUM(CASE WHEN status = 'overdue' THEN 1 ELSE 0 END) as overdue_count,
        SUM(total_amount) as total_amount,
        SUM(CASE WHEN status != 'paid' THEN total_amount ELSE 0 END) as outstanding_amount
      FROM bills
      WHERE tenant_id = $1 AND is_deleted = FALSE
    `;

    const result = await this.pool.query(query, [tenantId]);
    return result.rows[0];
  }

  private mapRowToBill(row: any): Bill {
    return {
      id: row.id,
      tenantId: row.tenant_id,
      billNumber: row.bill_number,
      vendorId: row.vendor_id,
      amount: parseFloat(row.amount),
      taxAmount: parseFloat(row.tax_amount),
      totalAmount: parseFloat(row.total_amount),
      status: row.status,
      dueDate: row.due_date,
      receivedDate: row.received_date,
      paidAt: row.paid_at,
      approvedAt: row.approved_at,
      approvedBy: row.approved_by,
      notes: row.notes,
      createdAt: row.created_at,
      createdBy: row.created_by,
      updatedAt: row.updated_at,
      updatedBy: row.updated_by,
      isDeleted: row.is_deleted,
      version: row.version,
    };
  }
}
