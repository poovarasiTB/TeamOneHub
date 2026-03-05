import { Pool } from 'pg';
import { database } from '../database';
import { logger } from '../utils/logger';

interface Invoice {
  id: string;
  tenantId: string;
  invoiceNumber: string;
  customerId: string;
  amount: number;
  taxAmount: number;
  totalAmount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  dueDate: Date;
  issuedDate: Date;
  items: InvoiceItem[];
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;
  isDeleted: boolean;
  version: number;
}

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
  amount: number;
}

export class InvoiceService {
  private pool: Pool;

  constructor() {
    this.pool = database.getPool();
  }

  async findAll(filters: any) {
    const { page, limit, status, customerId, search, tenantId } = filters;
    const offset = (page - 1) * limit;

    let query = `
      SELECT i.*, c.name as customer_name, c.email as customer_email
      FROM invoices i
      LEFT JOIN customers c ON c.id = i.customer_id
      WHERE i.tenant_id = $1 AND i.is_deleted = FALSE
    `;
    
    const values: any[] = [tenantId];
    let paramIndex = 2;

    if (status) {
      query += ` AND i.status = $${paramIndex}`;
      values.push(status);
      paramIndex++;
    }

    if (customerId) {
      query += ` AND i.customer_id = $${paramIndex}`;
      values.push(customerId);
      paramIndex++;
    }

    if (search) {
      query += ` AND (i.invoice_number ILIKE $${paramIndex} OR c.name ILIKE $${paramIndex})`;
      values.push(`%${search}%`);
      paramIndex++;
    }

    const countQuery = query.replace('SELECT i.*, c.name as customer_name, c.email as customer_email', 'SELECT COUNT(*)');
    const countResult = await this.pool.query(countQuery, values);
    const total = parseInt(countResult.rows[0].count);

    query += ` ORDER BY i.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
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

  async findById(id: string, tenantId: string): Promise<Invoice | null> {
    const query = `
      SELECT i.*, c.name as customer_name, c.email as customer_email, c.address as customer_address
      FROM invoices i
      LEFT JOIN customers c ON c.id = i.customer_id
      WHERE i.id = $1 AND i.tenant_id = $2 AND i.is_deleted = FALSE
    `;
    
    const result = await this.pool.query(query, [id, tenantId]);
    
    if (!result.rows[0]) return null;
    
    const invoice = result.rows[0];
    invoice.items = await this.getInvoiceItems(id);
    
    return invoice;
  }

  async create(data: Partial<Invoice>, userId: string, tenantId: string): Promise<Invoice> {
    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');

      const invoiceNumber = await this.generateInvoiceNumber(tenantId, client);

      const query = `
        INSERT INTO invoices (
          tenant_id, invoice_number, customer_id, amount, tax_amount, total_amount,
          status, due_date, issued_date, created_by, updated_by
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING *
      `;

      const values = [
        tenantId,
        invoiceNumber,
        data.customerId,
        data.amount,
        data.taxAmount || 0,
        data.totalAmount || data.amount || 0,
        data.status || 'draft',
        data.dueDate,
        data.issuedDate || new Date(),
        userId,
        userId,
      ];

      const result = await client.query(query, values);
      const invoice = result.rows[0];

      // Insert line items
      if (data.items && data.items.length > 0) {
        await this.insertInvoiceItems(client, invoice.id, data.items);
      }

      await client.query('COMMIT');
      
      logger.info(`Invoice created: ${invoice.id} (${invoice.invoiceNumber})`);
      
      invoice.items = data.items || [];
      return invoice;
    } catch (error) {
      await client.query('ROLLBACK');
      logger.error(`Error creating invoice: ${error}`);
      throw error;
    } finally {
      client.release();
    }
  }

  async update(id: string, data: Partial<Invoice>, userId: string, tenantId: string): Promise<Invoice> {
    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');

      const currentInvoice = await this.findById(id, tenantId);
      if (!currentInvoice) {
        throw new Error('Invoice not found');
      }

      const query = `
        UPDATE invoices 
        SET 
          customer_id = COALESCE($1, customer_id),
          amount = COALESCE($2, amount),
          tax_amount = COALESCE($3, tax_amount),
          total_amount = COALESCE($4, total_amount),
          status = COALESCE($5, status),
          due_date = COALESCE($6, due_date),
          updated_by = $7,
          updated_at = NOW(),
          version = version + 1
        WHERE id = $8 AND tenant_id = $9 AND is_deleted = FALSE
        RETURNING *
      `;

      const values = [
        data.customerId,
        data.amount,
        data.taxAmount,
        data.totalAmount,
        data.status,
        data.dueDate,
        userId,
        id,
        tenantId,
      ];

      const result = await client.query(query, values);
      const invoice = result.rows[0];

      // Update line items if provided
      if (data.items) {
        await this.updateInvoiceItems(client, id, data.items);
      }

      await client.query('COMMIT');
      
      logger.info(`Invoice updated: ${invoice.id}`);
      
      invoice.items = data.items || currentInvoice.items;
      return invoice;
    } catch (error) {
      await client.query('ROLLBACK');
      logger.error(`Error updating invoice: ${error}`);
      throw error;
    } finally {
      client.release();
    }
  }

  async send(id: string, userId: string, tenantId: string): Promise<Invoice> {
    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');

      const invoice = await this.findById(id, tenantId);
      if (!invoice) {
        throw new Error('Invoice not found');
      }

      // Update status to sent
      const query = `
        UPDATE invoices 
        SET status = 'sent', sent_at = NOW(), updated_by = $1, updated_at = NOW()
        WHERE id = $2 AND tenant_id = $3
        RETURNING *
      `;

      const result = await client.query(query, [userId, id, tenantId]);
      const updatedInvoice = result.rows[0];

      await client.query('COMMIT');

      // TODO: Send email to customer
      
      logger.info(`Invoice sent: ${id}`);
      
      return updatedInvoice;
    } catch (error) {
      await client.query('ROLLBACK');
      logger.error(`Error sending invoice: ${error}`);
      throw error;
    } finally {
      client.release();
    }
  }

  async recordPayment(id: string, payment: any, userId: string, tenantId: string): Promise<Invoice> {
    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');

      const invoice = await this.findById(id, tenantId);
      if (!invoice) {
        throw new Error('Invoice not found');
      }

      // Insert payment record
      const paymentQuery = `
        INSERT INTO payments (
          invoice_id, amount, payment_date, payment_method, reference,
          created_by, updated_by
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `;

      await client.query(paymentQuery, [
        id,
        payment.amount,
        payment.paymentDate || new Date(),
        payment.paymentMethod || 'bank_transfer',
        payment.reference,
        userId,
        userId,
      ]);

      // Update invoice status if fully paid
      let updatedInvoice = invoice;
      if (payment.amount >= invoice.totalAmount) {
        const updateQuery = `
          UPDATE invoices 
          SET status = 'paid', paid_at = NOW(), updated_by = $1, updated_at = NOW()
          WHERE id = $2
          RETURNING *
        `;
        
        const result = await client.query(updateQuery, [userId, id]);
        updatedInvoice = result.rows[0];
      }

      await client.query('COMMIT');
      
      logger.info(`Payment recorded for invoice: ${id}`);
      
      return updatedInvoice;
    } catch (error) {
      await client.query('ROLLBACK');
      logger.error(`Error recording payment: ${error}`);
      throw error;
    } finally {
      client.release();
    }
  }

  async delete(id: string, userId: string, tenantId: string): Promise<void> {
    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');

      const invoice = await this.findById(id, tenantId);
      if (!invoice) {
        throw new Error('Invoice not found');
      }

      const query = `
        UPDATE invoices 
        SET is_deleted = TRUE, deleted_by = $1, deleted_at = NOW(), updated_at = NOW()
        WHERE id = $2 AND tenant_id = $3
      `;

      await client.query(query, [userId, id, tenantId]);

      await client.query('COMMIT');
      
      logger.info(`Invoice deleted: ${id}`);
    } catch (error) {
      await client.query('ROLLBACK');
      logger.error(`Error deleting invoice: ${error}`);
      throw error;
    } finally {
      client.release();
    }
  }

  async getStats(tenantId: string) {
    const query = `
      SELECT 
        status,
        COUNT(*) as count,
        COALESCE(SUM(total_amount), 0) as total_amount
      FROM invoices
      WHERE tenant_id = $1 AND is_deleted = FALSE
      GROUP BY status
    `;

    const result = await this.pool.query(query, [tenantId]);
    
    const stats = {
      total: 0,
      byStatus: {} as Record<string, any>,
      totalAmount: 0,
    };

    result.rows.forEach((row: any) => {
      stats.byStatus[row.status] = {
        count: parseInt(row.count),
        amount: parseFloat(row.total_amount),
      };
      stats.total += parseInt(row.count);
      stats.totalAmount += parseFloat(row.total_amount);
    });

    return stats;
  }

  private async getInvoiceItems(invoiceId: string): Promise<InvoiceItem[]> {
    const query = `
      SELECT description, quantity, unit_price, tax_rate, amount
      FROM invoice_items
      WHERE invoice_id = $1
      ORDER BY id
    `;
    
    const result = await this.pool.query(query, [invoiceId]);
    return result.rows;
  }

  private async insertInvoiceItems(client: any, invoiceId: string, items: InvoiceItem[]) {
    for (const item of items) {
      const query = `
        INSERT INTO invoice_items (invoice_id, description, quantity, unit_price, tax_rate, amount)
        VALUES ($1, $2, $3, $4, $5, $6)
      `;
      
      await client.query(query, [
        invoiceId,
        item.description,
        item.quantity,
        item.unitPrice,
        item.taxRate,
        item.amount,
      ]);
    }
  }

  private async updateInvoiceItems(client: any, invoiceId: string, items: InvoiceItem[]) {
    // Delete existing items
    await client.query('DELETE FROM invoice_items WHERE invoice_id = $1', [invoiceId]);
    
    // Insert new items
    await this.insertInvoiceItems(client, invoiceId, items);
  }

  private async generateInvoiceNumber(tenantId: string, client: any): Promise<string> {
    const year = new Date().getFullYear();
    const month = new Date().getMonth() + 1;

    const query = `
      SELECT COUNT(*) as count
      FROM invoices
      WHERE tenant_id = $1 AND invoice_number LIKE 'INV-${year}-${month}-%'
    `;

    const result = await client.query(query, [tenantId]);
    const count = parseInt(result.rows[0].count) + 1;

    return `INV-${year}-${String(month).padStart(2, '0')}-${String(count).padStart(4, '0')}`;
  }

  async export(id: string, format: string, tenantId: string): Promise<any> {
    const invoice = await this.findById(id, tenantId);
    if (!invoice) {
      throw new Error('Invoice not found');
    }
    // Placeholder for actual export logic
    return {
      id,
      format,
      message: `Export ${format} generated for invoice ${invoice.invoiceNumber}`,
    };
  }
}
