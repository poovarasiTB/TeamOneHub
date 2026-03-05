import { Pool } from 'pg';
import { database } from '../database';
import { logger } from '../utils/logger';

interface Ticket {
  id: string;
  tenantId: string;
  ticketNumber: string;
  subject: string;
  description: string;
  type: 'incident' | 'service-request' | 'problem' | 'change';
  category?: string;
  subcategory?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'new' | 'open' | 'pending' | 'on-hold' | 'resolved' | 'closed';
  channel?: string;
  requesterType?: string;
  requesterId?: string;
  requesterEmail?: string;
  requesterName?: string;
  assigneeId?: string;
  assetId?: string;
  dueDate?: Date;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;
  isDeleted: boolean;
  version: number;
}

interface TicketFilters {
  page: number;
  limit: number;
  status?: string;
  priority?: string;
  assignee?: string;
  search?: string;
  tenantId: string;
}

export class TicketService {
  private pool: Pool;

  constructor() {
    this.pool = database.getPool();
  }

  async findAll(filters: TicketFilters) {
    const { page, limit, status, priority, assignee, search, tenantId } = filters;
    const offset = (page - 1) * limit;

    let query = `
      SELECT t.*, u.name as assignee_name, u.email as assignee_email
      FROM tickets t
      LEFT JOIN users u ON u.id = t.assignee_id
      WHERE t.tenant_id = $1 AND t.is_deleted = FALSE
    `;
    
    const values: any[] = [tenantId];
    let paramIndex = 2;

    if (status) {
      query += ` AND t.status = $${paramIndex}`;
      values.push(status);
      paramIndex++;
    }

    if (priority) {
      query += ` AND t.priority = $${paramIndex}`;
      values.push(priority);
      paramIndex++;
    }

    if (assignee) {
      query += ` AND t.assignee_id = $${paramIndex}`;
      values.push(assignee);
      paramIndex++;
    }

    if (search) {
      query += ` AND (t.subject ILIKE $${paramIndex} OR t.description ILIKE $${paramIndex} OR t.ticket_number ILIKE $${paramIndex})`;
      values.push(`%${search}%`);
      paramIndex++;
    }

    const countQuery = query.replace('SELECT t.*, u.name as assignee_name, u.email as assignee_email', 'SELECT COUNT(*)');
    const countResult = await this.pool.query(countQuery, values);
    const total = parseInt(countResult.rows[0].count);

    query += ` ORDER BY t.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
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

  async findById(id: string, tenantId: string): Promise<Ticket | null> {
    const query = `
      SELECT t.*, u.name as assignee_name, u.email as assignee_email
      FROM tickets t
      LEFT JOIN users u ON u.id = t.assignee_id
      WHERE t.id = $1 AND t.tenant_id = $2 AND t.is_deleted = FALSE
    `;
    
    const result = await this.pool.query(query, [id, tenantId]);
    return result.rows[0] || null;
  }

  async create(data: Partial<Ticket>, userId: string, tenantId: string): Promise<Ticket> {
    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');

      const ticketNumber = await this.generateTicketNumber(tenantId, client);

      const query = `
        INSERT INTO tickets (
          tenant_id, ticket_number, subject, description, type, category,
          subcategory, priority, status, channel, requester_type,
          requester_id, requester_email, requester_name, assignee_id,
          asset_id, due_date, created_by, updated_by
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
        RETURNING *
      `;

      const values = [
        tenantId,
        ticketNumber,
        data.subject,
        data.description,
        data.type || 'incident',
        data.category,
        data.subcategory,
        data.priority || 'medium',
        data.status || 'new',
        data.channel,
        data.requesterType,
        data.requesterId,
        data.requesterEmail,
        data.requesterName,
        data.assigneeId,
        data.assetId,
        data.dueDate,
        userId,
        userId,
      ];

      const result = await client.query(query, values);
      const ticket = result.rows[0];

      await client.query('COMMIT');
      logger.info(`Ticket created: ${ticket.id} (${ticket.ticketNumber})`);
      return ticket;
    } catch (error) {
      await client.query('ROLLBACK');
      logger.error(`Error creating ticket: ${error}`);
      throw error;
    } finally {
      client.release();
    }
  }

  async update(id: string, data: Partial<Ticket>, userId: string, tenantId: string): Promise<Ticket> {
    const current = await this.findById(id, tenantId);
    if (!current) throw new Error('Ticket not found');

    const query = `
      UPDATE tickets 
      SET 
        subject = COALESCE($1, subject),
        description = COALESCE($2, description),
        type = COALESCE($3, type),
        category = COALESCE($4, category),
        priority = COALESCE($5, priority),
        status = COALESCE($6, status),
        assignee_id = COALESCE($7, assignee_id),
        due_date = COALESCE($8, due_date),
        updated_by = $9,
        updated_at = NOW(),
        version = version + 1
      WHERE id = $10 AND tenant_id = $11 AND is_deleted = FALSE
      RETURNING *
    `;

    const values = [
      data.subject,
      data.description,
      data.type,
      data.category,
      data.priority,
      data.status,
      data.assigneeId,
      data.dueDate,
      userId,
      id,
      tenantId,
    ];

    const result = await this.pool.query(query, values);
    logger.info(`Ticket updated: ${id}`);
    return result.rows[0];
  }

  async addComment(ticketId: string, comment: any, userId: string, _tenantId: string) {
    const query = `
      INSERT INTO ticket_comments (ticket_id, user_id, comment_type, content)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;

    const values = [
      ticketId,
      userId,
      comment.commentType || 'public',
      comment.content,
    ];

    const result = await this.pool.query(query, values);
    logger.info(`Comment added to ticket: ${ticketId}`);
    return result.rows[0];
  }

  async assign(ticketId: string, assignment: any, userId: string, tenantId: string): Promise<Ticket> {
    return this.update(ticketId, {
      assigneeId: assignment.assigneeId,
      status: 'open',
    }, userId, tenantId);
  }

  async delete(id: string, userId: string, tenantId: string): Promise<void> {
    const query = `
      UPDATE tickets 
      SET is_deleted = TRUE, deleted_by = $1, deleted_at = NOW()
      WHERE id = $2 AND tenant_id = $3
    `;
    await this.pool.query(query, [userId, id, tenantId]);
    logger.info(`Ticket deleted: ${id}`);
  }

  async getStats(tenantId: string) {
    const query = `
      SELECT 
        status,
        priority,
        COUNT(*) as count,
        AVG(EXTRACT(EPOCH FROM (updated_at - created_at))) as avg_resolution_seconds
      FROM tickets
      WHERE tenant_id = $1 AND is_deleted = FALSE
      GROUP BY status, priority
    `;

    const result = await this.pool.query(query, [tenantId]);
    
    const stats = {
      total: 0,
      byStatus: {} as Record<string, number>,
      byPriority: {} as Record<string, number>,
      avgResolutionTime: 0,
    };

    result.rows.forEach((row: any) => {
      stats.byStatus[row.status] = parseInt(row.count);
      stats.byPriority[row.priority] = (stats.byPriority[row.priority] || 0) + parseInt(row.count);
      stats.total += parseInt(row.count);
    });

    return stats;
  }

  private async generateTicketNumber(tenantId: string, client: any): Promise<string> {
    const year = new Date().getFullYear();
    const month = new Date().getMonth() + 1;
    
    const query = `
      SELECT COUNT(*) as count 
      FROM tickets 
      WHERE tenant_id = $1 AND ticket_number LIKE 'TKT-${year}-${month}-%'
    `;

    const result = await client.query(query, [tenantId]);
    const count = parseInt(result.rows[0].count) + 1;
    
    return `TKT-${year}-${String(month).padStart(2, '0')}-${String(count).padStart(4, '0')}`;
  }
}
