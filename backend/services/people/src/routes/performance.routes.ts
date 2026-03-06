import { Router, Response } from 'express';
import { PerformanceService } from '../services/performance.service';
import { authenticate, AuthRequest, requireRole } from '../middleware/auth';

const router = Router();
const performanceService = new PerformanceService();

router.use(authenticate);

/**
 * GET /api/performance
 * List performance reviews
 */
router.get('/', async (_req: AuthRequest, res: Response, next: any) => {
    try {
        const { page = 1, limit = 20, employeeId, reviewerId, status } = _req.query;
        const result = await performanceService.findAll({
            page: Number(page),
            limit: Number(limit),
            employeeId: employeeId as string,
            reviewerId: reviewerId as string,
            status: status as string,
            tenantId: _req.user?.tenantId || '',
        });
        return res.json(result);
    } catch (error) {
        return next(error);
    }
});

/**
 * GET /api/performance/:id
 * Get review by ID
 */
router.get('/:id', async (_req: AuthRequest, res: Response, next: any) => {
    try {
        const result = await performanceService.findById(_req.params.id as string, _req.user?.tenantId || '');
        if (!result) {
            return res.status(404).json({ error: 'Performance review not found' });
        }
        return res.json(result);
    } catch (error) {
        return next(error);
    }
});

/**
 * POST /api/performance
 * Create performance review
 */
router.post('/', requireRole('admin', 'manager'), async (_req: AuthRequest, res: Response, next: any) => {
    try {
        const result = await performanceService.createReview(_req.body, _req.user?.id || '', _req.user?.tenantId || '');
        return res.status(201).json(result);
    } catch (error) {
        return next(error);
    }
});

/**
 * PUT /api/performance/:id
 * Update performance review
 */
router.put('/:id', requireRole('admin', 'manager'), async (_req: AuthRequest, res: Response, next: any) => {
    try {
        const result = await performanceService.updateReview(_req.params.id as string, _req.body, _req.user?.id || '', _req.user?.tenantId || '');
        return res.json(result);
    } catch (error) {
        return next(error);
    }
});

export default router;
