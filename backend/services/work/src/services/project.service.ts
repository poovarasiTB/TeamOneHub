import { Pool } from 'pg';
import { database } from '../database';
import { logger } from '../utils/logger';
import { AuditService } from './audit.service';

interface Project {
  id: string;
  tenantId: string;
  code: string;
  name: string;
  description?: string;
  status: 'planning' | 'active' | 'on-hold' | 'completed' | 'cancelled';
  type: 'fixed-price' | 'time-materials' | 'retainer' | 'internal';
  budget?: number;
  currency: string;
  startDate: Date;
  endDate?: Date;
  ownerId: string;
  healthStatus: 'green' | 'yellow' | 'red';
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;
  isDeleted: boolean;
  version: number;
}

interface ProjectFilters {
  page: number;
  limit: number;
  status?: string;
  search?: string;
  sort: string;
  order: 'ASC' | 'DESC';
  tenantId: string;
}

export class ProjectService {
  private pool: Pool;
  private auditService: AuditService;

  constructor() {
    this.pool = database.getPool();
    this.auditService = new AuditService();
  }

  /**
   * Find all projects with filtering and pagination
   */
  async findAll(filters: ProjectFilters) {
    const { page, limit, status, search, sort, order, tenantId } = filters;
    const offset = (page - 1) * limit;

    let query = `
      SELECT * FROM projects 
      WHERE tenant_id = $1 
        AND is_deleted = FALSE
    `;
    
    const values: any[] = [tenantId];
    let paramIndex = 2;

    if (status) {
      query += ` AND status = $${paramIndex}`;
      values.push(status);
      paramIndex++;
    }

    if (search) {
      query += ` AND (name ILIKE $${paramIndex} OR code ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`;
      values.push(`%${search}%`);
      paramIndex++;
    }

    // Get total count
    const countQuery = query.replace('SELECT *', 'SELECT COUNT(*)');
    const countResult = await this.pool.query(countQuery, values);
    const total = parseInt(countResult.rows[0].count);

    // Add pagination and sorting
    query += ` ORDER BY ${sort} ${order} LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
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
   * Find project by ID
   */
  async findById(id: string, tenantId: string): Promise<Project | null> {
    const query = `
      SELECT * FROM projects 
      WHERE id = $1 AND tenant_id = $2 AND is_deleted = FALSE
    `;
    
    const result = await this.pool.query(query, [id, tenantId]);
    return result.rows[0] || null;
  }

  /**
   * Create new project
   */
  async create(data: Partial<Project>, userId: string, tenantId: string): Promise<Project> {
    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');

      // Generate project code
      const code = await this.generateProjectCode(tenantId, client);

      const query = `
        INSERT INTO projects (
          tenant_id, code, name, description, status, type,
          budget, currency, start_date, end_date, owner_id,
          health_status, created_by, updated_by
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        RETURNING *
      `;

      const values = [
        tenantId,
        code,
        data.name,
        data.description,
        data.status || 'planning',
        data.type || 'internal',
        data.budget,
        data.currency || 'USD',
        data.startDate,
        data.endDate,
        data.ownerId || userId,
        data.healthStatus || 'green',
        userId,
        userId,
      ];

      const result = await client.query(query, values);
      const project = result.rows[0];

      // Log audit
      await this.auditService.log({
        client,
        action: 'project.create',
        resourceId: project.id,
        resourceType: 'project',
        userId,
        tenantId,
        changes: { after: project },
      });

      await client.query('COMMIT');
      
      logger.info(`Project created: ${project.id} (${project.code})`);
      
      return project;
    } catch (error) {
      await client.query('ROLLBACK');
      logger.error('Error creating project:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Update project
   */
  async update(id: string, data: Partial<Project>, userId: string, tenantId: string): Promise<Project> {
    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');

      // Get current project for audit
      const currentProject = await this.findById(id, tenantId);
      if (!currentProject) {
        throw new Error('Project not found');
      }

      const query = `
        UPDATE projects 
        SET 
          name = COALESCE($1, name),
          description = COALESCE($2, description),
          status = COALESCE($3, status),
          type = COALESCE($4, type),
          budget = COALESCE($5, budget),
          currency = COALESCE($6, currency),
          start_date = COALESCE($7, start_date),
          end_date = COALESCE($8, end_date),
          health_status = COALESCE($9, health_status),
          updated_by = $10,
          updated_at = NOW(),
          version = version + 1
        WHERE id = $11 AND tenant_id = $12 AND is_deleted = FALSE
        RETURNING *
      `;

      const values = [
        data.name,
        data.description,
        data.status,
        data.type,
        data.budget,
        data.currency,
        data.startDate,
        data.endDate,
        data.healthStatus,
        userId,
        id,
        tenantId,
      ];

      const result = await client.query(query, values);
      const project = result.rows[0];

      // Log audit
      await this.auditService.log({
        client,
        action: 'project.update',
        resourceId: project.id,
        resourceType: 'project',
        userId,
        tenantId,
        changes: { 
          before: currentProject, 
          after: project 
        },
      });

      await client.query('COMMIT');
      
      logger.info(`Project updated: ${project.id}`);
      
      return project;
    } catch (error) {
      await client.query('ROLLBACK');
      logger.error('Error updating project:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Soft delete project
   */
  async delete(id: string, userId: string, tenantId: string): Promise<void> {
    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');

      const project = await this.findById(id, tenantId);
      if (!project) {
        throw new Error('Project not found');
      }

      const query = `
        UPDATE projects 
        SET 
          is_deleted = TRUE,
          deleted_by = $1,
          deleted_at = NOW(),
          updated_at = NOW()
        WHERE id = $2 AND tenant_id = $3
      `;

      await client.query(query, [userId, id, tenantId]);

      // Log audit
      await this.auditService.log({
        client,
        action: 'project.delete',
        resourceId: id,
        resourceType: 'project',
        userId,
        tenantId,
        changes: { before: project },
      });

      await client.query('COMMIT');
      
      logger.info(`Project deleted: ${id}`);
    } catch (error) {
      await client.query('ROLLBACK');
      logger.error('Error deleting project:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Get project statistics
   */
  async getStats(tenantId: string) {
    const query = `
      SELECT 
        status,
        COUNT(*) as count,
        COALESCE(SUM(budget), 0) as total_budget
      FROM projects
      WHERE tenant_id = $1 AND is_deleted = FALSE
      GROUP BY status
    `;

    const result = await this.pool.query(query, [tenantId]);
    
    const stats = {
      total: 0,
      byStatus: {} as Record<string, number>,
      totalBudget: 0,
    };

    result.rows.forEach((row: any) => {
      stats.byStatus[row.status] = parseInt(row.count);
      stats.total += parseInt(row.count);
      stats.totalBudget += parseFloat(row.total_budget);
    });

    return stats;
  }

  /**
   * Generate unique project code
   */
  private async generateProjectCode(tenantId: string, client: any): Promise<string> {
    const year = new Date().getFullYear();

    const query = `
      SELECT COUNT(*) as count
      FROM projects
      WHERE tenant_id = $1 AND code LIKE 'PROJ-${year}-%'
    `;

    const result = await client.query(query, [tenantId]);
    const count = parseInt(result.rows[0].count) + 1;

    return `PROJ-${year}-${String(count).padStart(4, '0')}`;
  }

  /**
   * Get project timeline
   */
  async getTimeline(id: string, tenantId: string) {
    const query = `
      SELECT id, name, start_date, end_date, status
      FROM projects
      WHERE id = $1 AND tenant_id = $2 AND is_deleted = FALSE
    `;
    const result = await this.pool.query(query, [id, tenantId]);
    return result.rows[0] || null;
  }

  /**
   * Get project members
   */
  async getMembers(id: string, tenantId: string) {
    const query = `
      SELECT pm.user_id, pm.role, u.email, u.name
      FROM project_members pm
      LEFT JOIN users u ON u.id = pm.user_id
      WHERE pm.project_id = $1 AND pm.tenant_id = $2
    `;
    const result = await this.pool.query(query, [id, tenantId]);
    return result.rows;
  }

  /**
   * Add member to project
   */
  async addMember(projectId: string, memberId: string, role: string, _userId: string, tenantId: string) {
    const query = `
      INSERT INTO project_members (project_id, user_id, role, tenant_id)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (project_id, user_id) DO UPDATE SET role = $3
      RETURNING *
    `;
    const result = await this.pool.query(query, [projectId, memberId, role, tenantId]);
    return result.rows[0];
  }

  /**
   * Get project tasks
   */
  async getTasks(projectId: string, tenantId: string) {
    const query = `
      SELECT id, title, status, priority, assignee_id
      FROM tasks
      WHERE project_id = $1 AND tenant_id = $2 AND is_deleted = FALSE
      ORDER BY created_at DESC
    `;
    const result = await this.pool.query(query, [projectId, tenantId]);
    return result.rows;
  }

  /**
   * Export project data
   */
  async export(id: string, format: string, tenantId: string) {
    const project = await this.findById(id, tenantId);
    if (!project) {
      throw new Error('Project not found');
    }
    return {
      id,
      format,
      message: `Export ${format} generated for project ${project.code}`,
      data: project,
    };
  }
}
