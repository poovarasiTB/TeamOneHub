import { Pool } from 'pg';
import { database } from '../database';
import { logger } from '../utils/logger';

interface PerformanceReview {
    id: string;
    tenantId: string;
    employeeId: string;
    reviewerId: string;
    periodStart: string;
    periodEnd: string;
    rating?: number;
    strengths?: string;
    weaknesses?: string;
    goals?: string;
    comments?: string;
    status: 'draft' | 'in-progress' | 'completed';
}

interface PerformanceFilters {
    page: number;
    limit: number;
    employeeId?: string;
    reviewerId?: string;
    status?: string;
    tenantId: string;
}

export class PerformanceService {
    private pool: Pool;

    constructor() {
        this.pool = database.getPool();
    }

    async findAll(filters: PerformanceFilters) {
        const { page, limit, employeeId, reviewerId, status, tenantId } = filters;
        const offset = (page - 1) * limit;

        let query = `
      SELECT pr.*, 
             e.first_name || ' ' || e.last_name as employee_name,
             r.first_name || ' ' || r.last_name as reviewer_name
      FROM performance_reviews pr
      JOIN employees e ON pr.employee_id = e.id
      JOIN employees r ON pr.reviewer_id = r.id
      WHERE pr.tenant_id = $1
    `;

        const values: any[] = [tenantId];
        let paramIndex = 2;

        if (employeeId) {
            query += ` AND pr.employee_id = $${paramIndex}`;
            values.push(employeeId);
            paramIndex++;
        }

        if (reviewerId) {
            query += ` AND pr.reviewer_id = $${paramIndex}`;
            values.push(reviewerId);
            paramIndex++;
        }

        if (status) {
            query += ` AND pr.status = $${paramIndex}`;
            values.push(status);
            paramIndex++;
        }

        const countQuery = query.replace('SELECT pr.*, \n             e.first_name || \' \' || e.last_name as employee_name,\n             r.first_name || \' \' || r.last_name as reviewer_name', 'SELECT COUNT(*)');
        const countResult = await this.pool.query(countQuery, values);
        const total = parseInt(countResult.rows[0].count);

        query += ` ORDER BY pr.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
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

    async findById(id: string, tenantId: string) {
        const query = `
      SELECT pr.*, 
             e.first_name || ' ' || e.last_name as employee_name,
             r.first_name || ' ' || r.last_name as reviewer_name
      FROM performance_reviews pr
      JOIN employees e ON pr.employee_id = e.id
      JOIN employees r ON pr.reviewer_id = r.id
      WHERE pr.id = $1 AND pr.tenant_id = $2
    `;

        const result = await this.pool.query(query, [id, tenantId]);
        return result.rows[0] || null;
    }

    async createReview(data: Partial<PerformanceReview>, userId: string, tenantId: string) {
        const query = `
      INSERT INTO performance_reviews (
        tenant_id, employee_id, reviewer_id, period_start, period_end,
        status, created_by, updated_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;

        const values = [
            tenantId,
            data.employeeId,
            data.reviewerId,
            data.periodStart,
            data.periodEnd,
            'draft',
            userId,
            userId,
        ];

        const result = await this.pool.query(query, values);
        logger.info(`Performance review created: ${result.rows[0].id}`);
        return result.rows[0];
    }

    async updateReview(id: string, data: Partial<PerformanceReview>, userId: string, tenantId: string) {
        const query = `
      UPDATE performance_reviews
      SET
        rating = COALESCE($1, rating),
        strengths = COALESCE($2, strengths),
        weaknesses = COALESCE($3, weaknesses),
        goals = COALESCE($4, goals),
        comments = COALESCE($5, comments),
        status = COALESCE($6, status),
        updated_by = $7,
        updated_at = NOW()
      WHERE id = $8 AND tenant_id = $9
      RETURNING *
    `;

        const values = [
            data.rating,
            data.strengths,
            data.weaknesses,
            data.goals,
            data.comments,
            data.status,
            userId,
            id,
            tenantId,
        ];

        const result = await this.pool.query(query, values);
        logger.info(`Performance review updated: ${id}`);
        return result.rows[0];
    }
}

export default PerformanceService;
