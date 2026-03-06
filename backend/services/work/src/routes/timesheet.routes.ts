import { Router, Response } from 'express';
import { TimesheetController } from '../controllers/timesheet.controller';
import { authenticate, AuthRequest } from '../middleware/auth';
import { body } from 'express-validator';
import { validateRequest } from '../middleware/validator';

const router = Router();
const controller = new TimesheetController();

router.use(authenticate);

/**
 * GET /api/timesheets
 * Get timesheets for user (requires projectId query param)
 */
router.get('/', async (_req: AuthRequest, res: Response, next: any) => {
    try {
        const result = await controller.findByUserAndProject(_req, res, next);
        return result;
    } catch (error) {
        return next(error);
    }
});

/**
 * POST /api/timesheets
 * Create timesheet entry
 */
router.post('/', [
    body('projectId').notEmpty().withMessage('projectId is required'),
    body('date').notEmpty().withMessage('date is required'),
    body('hours').isNumeric().withMessage('hours must be a number'),
    validateRequest
], async (_req: AuthRequest, res: Response, next: any) => {
    try {
        const result = await controller.create(_req, res, next);
        return result;
    } catch (error) {
        return next(error);
    }
});

/**
 * PATCH /api/timesheets/:id/status
 * Update timesheet status
 */
router.patch('/:id/status', [
    body('status').isIn(['draft', 'submitted', 'approved', 'rejected']).withMessage('invalid status'),
    validateRequest
], async (_req: AuthRequest, res: Response, next: any) => {
    try {
        const result = await controller.updateStatus(_req, res, next);
        return result;
    } catch (error) {
        return next(error);
    }
});

export default router;
