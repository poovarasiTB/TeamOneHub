import { Pool } from 'pg';
import { database } from '../database';
import { AuditService } from './audit.service';

interface Meeting {
  id: string;
  tenantId: string;
  title: string;
  description?: string;
  meetingType?: string;
  startTime: Date;
  endTime: Date;
  timezone: string;
  locationType?: string;
  location?: string;
  videoLink?: string;
  organizerId: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  recordingUrl?: string;
  transcript?: string;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;
  isDeleted: boolean;
  version: number;
}

interface MeetingFilters {
  page: number;
  limit: number;
  meetingType?: string;
  status?: string;
  startDate?: Date;
  endDate?: Date;
  sort: string;
  order: 'ASC' | 'DESC';
  tenantId: string;
}

export class MeetingService {
  private pool: Pool;
  private auditService: AuditService;

  constructor() {
    this.pool = database.getPool();
    this.auditService = new AuditService();
  }

  async findAll(filters: MeetingFilters) {
    const { page, limit, meetingType, status, startDate, endDate, sort, order, tenantId } = filters;
    const offset = (page - 1) * limit;

    let query = `
      SELECT m.*, u.name as organizer_name
      FROM meetings m
      LEFT JOIN users u ON u.id = m.organizer_id
      WHERE m.tenant_id = $1 AND m.is_deleted = FALSE
    `;

    const values: any[] = [tenantId];
    let paramIndex = 2;

    if (meetingType) {
      query += ` AND m.meeting_type = $${paramIndex}`;
      values.push(meetingType);
      paramIndex++;
    }

    if (status) {
      query += ` AND m.status = $${paramIndex}`;
      values.push(status);
      paramIndex++;
    }

    if (startDate) {
      query += ` AND m.start_time >= $${paramIndex}`;
      values.push(startDate);
      paramIndex++;
    }

    if (endDate) {
      query += ` AND m.end_time <= $${paramIndex}`;
      values.push(endDate);
      paramIndex++;
    }

    const countQuery = query.replace('SELECT m.*, u.name as organizer_name', 'SELECT COUNT(*)');
    const countResult = await this.pool.query(countQuery, values);
    const total = parseInt(countResult.rows[0].count);

    query += ` ORDER BY m.${sort} ${order} LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    values.push(limit, offset);

    const result = await this.pool.query(query, values);

    return {
      data: result.rows.map(this.mapRowToMeeting),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string, tenantId: string): Promise<Meeting | null> {
    const query = `
      SELECT m.*, u.name as organizer_name
      FROM meetings m
      LEFT JOIN users u ON u.id = m.organizer_id
      WHERE m.id = $1 AND m.tenant_id = $2 AND m.is_deleted = FALSE
    `;

    const result = await this.pool.query(query, [id, tenantId]);

    if (result.rows.length === 0) {
      return null;
    }

    return this.mapRowToMeeting(result.rows[0]);
  }

  async create(data: Partial<Meeting>, createdBy: string, tenantId: string) {
    const query = `
      INSERT INTO meetings (
        tenant_id, title, description, meeting_type, start_time, end_time,
        timezone, location_type, location, video_link, organizer_id, status,
        created_by, updated_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *
    `;

    const values = [
      tenantId,
      data.title,
      data.description || null,
      data.meetingType || null,
      data.startTime,
      data.endTime,
      data.timezone || 'UTC',
      data.locationType || null,
      data.location || null,
      data.videoLink || null,
      data.organizerId || createdBy,
      data.status || 'scheduled',
      createdBy,
      createdBy,
    ];

    const result = await this.pool.query(query, values);

    await this.auditService.log({
      tenantId,
      userId: createdBy,
      action: 'CREATE',
      entityType: 'meeting',
      entityId: result.rows[0].id,
      changes: { title: data.title, startTime: data.startTime },
    });

    return this.mapRowToMeeting(result.rows[0]);
  }

  async update(id: string, data: Partial<Meeting>, updatedBy: string, tenantId: string): Promise<Meeting | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (data.title !== undefined) {
      fields.push(`title = $${paramIndex++}`);
      values.push(data.title);
    }

    if (data.description !== undefined) {
      fields.push(`description = $${paramIndex++}`);
      values.push(data.description);
    }

    if (data.meetingType !== undefined) {
      fields.push(`meeting_type = $${paramIndex++}`);
      values.push(data.meetingType);
    }

    if (data.startTime !== undefined) {
      fields.push(`start_time = $${paramIndex++}`);
      values.push(data.startTime);
    }

    if (data.endTime !== undefined) {
      fields.push(`end_time = $${paramIndex++}`);
      values.push(data.endTime);
    }

    if (data.timezone !== undefined) {
      fields.push(`timezone = $${paramIndex++}`);
      values.push(data.timezone);
    }

    if (data.locationType !== undefined) {
      fields.push(`location_type = $${paramIndex++}`);
      values.push(data.locationType);
    }

    if (data.location !== undefined) {
      fields.push(`location = $${paramIndex++}`);
      values.push(data.location);
    }

    if (data.videoLink !== undefined) {
      fields.push(`video_link = $${paramIndex++}`);
      values.push(data.videoLink);
    }

    if (data.status !== undefined) {
      fields.push(`status = $${paramIndex++}`);
      values.push(data.status);
    }

    if (data.recordingUrl !== undefined) {
      fields.push(`recording_url = $${paramIndex++}`);
      values.push(data.recordingUrl);
    }

    if (data.transcript !== undefined) {
      fields.push(`transcript = $${paramIndex++}`);
      values.push(data.transcript);
    }

    fields.push(`updated_by = $${paramIndex++}`);
    values.push(updatedBy);

    if (fields.length === 0) {
      return this.findById(id, tenantId);
    }

    values.push(id, tenantId);
    const query = `
      UPDATE meetings
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
      entityType: 'meeting',
      entityId: id,
      changes: data,
    });

    return this.mapRowToMeeting(result.rows[0]);
  }

  async delete(id: string, deletedBy: string, tenantId: string): Promise<void> {
    const query = `
      UPDATE meetings
      SET is_deleted = TRUE, updated_by = $1, updated_at = NOW()
      WHERE id = $2 AND tenant_id = $3 AND is_deleted = FALSE
    `;

    const result = await this.pool.query(query, [deletedBy, id, tenantId]);

    if (result.rows.length === 0) {
      throw new Error('Meeting not found');
    }

    await this.auditService.log({
      tenantId,
      userId: deletedBy,
      action: 'DELETE',
      entityType: 'meeting',
      entityId: id,
    });
  }

  async addAttendee(meetingId: string, userId: string, _tenantId: string): Promise<void> {
    const query = `
      INSERT INTO meeting_attendees (meeting_id, user_id, status)
      VALUES ($1, $2, 'pending')
      ON CONFLICT (meeting_id, user_id) DO NOTHING
    `;

    await this.pool.query(query, [meetingId, userId]);
  }

  async removeAttendee(meetingId: string, userId: string, _tenantId: string): Promise<void> {
    const query = `
      DELETE FROM meeting_attendees
      WHERE meeting_id = $1 AND user_id = $2
    `;

    await this.pool.query(query, [meetingId, userId]);
  }

  async updateAttendeeStatus(meetingId: string, userId: string, status: 'pending' | 'accepted' | 'declined'): Promise<void> {
    const query = `
      UPDATE meeting_attendees
      SET status = $1, response_at = NOW()
      WHERE meeting_id = $2 AND user_id = $3
    `;

    await this.pool.query(query, [status, meetingId, userId]);
  }

  async getAttendees(meetingId: string): Promise<any[]> {
    const query = `
      SELECT ma.*, u.name, u.email
      FROM meeting_attendees ma
      LEFT JOIN users u ON u.id = ma.user_id
      WHERE ma.meeting_id = $1
      ORDER BY ma.created_at
    `;

    const result = await this.pool.query(query, [meetingId]);
    return result.rows;
  }

  async addActionItem(meetingId: string, description: string, assigneeId: string | null, dueDate: Date | null, createdBy: string): Promise<void> {
    const query = `
      INSERT INTO meeting_action_items (meeting_id, description, assignee_id, due_date, created_by)
      VALUES ($1, $2, $3, $4, $5)
    `;

    await this.pool.query(query, [meetingId, description, assigneeId, dueDate, createdBy]);
  }

  async updateActionItemStatus(actionItemId: string, status: 'open' | 'in-progress' | 'completed'): Promise<void> {
    const query = `
      UPDATE meeting_action_items
      SET status = $1${status === 'completed' ? ', completed_at = NOW()' : ''}
      WHERE id = $2
    `;

    await this.pool.query(query, [status, actionItemId]);
  }

  async getActionItems(meetingId: string): Promise<any[]> {
    const query = `
      SELECT mai.*, u.name as assignee_name
      FROM meeting_action_items mai
      LEFT JOIN users u ON u.id = mai.assignee_id
      WHERE mai.meeting_id = $1
      ORDER BY mai.due_date, mai.created_at
    `;

    const result = await this.pool.query(query, [meetingId]);
    return result.rows;
  }

  private mapRowToMeeting(row: any): Meeting {
    return {
      id: row.id,
      tenantId: row.tenant_id,
      title: row.title,
      description: row.description,
      meetingType: row.meeting_type,
      startTime: row.start_time,
      endTime: row.end_time,
      timezone: row.timezone,
      locationType: row.location_type,
      location: row.location,
      videoLink: row.video_link,
      organizerId: row.organizer_id,
      status: row.status,
      recordingUrl: row.recording_url,
      transcript: row.transcript,
      createdAt: row.created_at,
      createdBy: row.created_by,
      updatedAt: row.updated_at,
      updatedBy: row.updated_by,
      isDeleted: row.is_deleted,
      version: row.version,
    };
  }
}
