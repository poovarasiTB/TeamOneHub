import { Router, Response } from 'express';
import { SLAController, AuthRequest } from '../controllers/sla.controller';
import { authenticate } from '../middleware/auth';
import { body } from 'express-validator';
import { validateRequest } from '../middleware/validator';

const router = Router();
const controller = new SLAController();

router.use(authenticate);

/**
 * GET /api/sla
 * List all SLA policies
 */
router.get('/', async (_req: AuthRequest, res: Response, next: any) => {
  try {
    const result = await controller.findAll(_req, res, next);
    return result;
  } catch (error) {
    return next(error);
  }
});

/**
 * GET /api/sla/active
 * Get active SLA policy based on ticket type and priority
 */
router.get('/active', async (_req: AuthRequest, res: Response, next: any) => {
  try {
    const result = await controller.getActiveSLA(_req, res, next);
    return result;
  } catch (error) {
    return next(error);
  }
});

/**
 * GET /api/sla/:id
 * Get SLA policy by ID
 */
router.get('/:id', async (_req: AuthRequest, res: Response, next: any) => {
  try {
    const result = await controller.findById(_req, res, next);
    return result;
  } catch (error) {
    return next(error);
  }
});

/**
 * POST /api/sla
 * Create new SLA policy
 */
router.post('/', [
  body('name').notEmpty().withMessage('name is required'),
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
 * PATCH /api/sla/:id
 * Update SLA policy
 */
router.patch('/:id', [
  body('name').optional().notEmpty().withMessage('name cannot be empty'),
  validateRequest
], async (_req: AuthRequest, res: Response, next: any) => {
  try {
    const result = await controller.update(_req, res, next);
    return result;
  } catch (error) {
    return next(error);
  }
});

/**
 * DELETE /api/sla/:id
 * Delete SLA policy
 */
router.delete('/:id', async (_req: AuthRequest, res: Response, next: any) => {
  try {
    const result = await controller.delete(_req, res, next);
    return result;
  } catch (error) {
    return next(error);
  }
});

/**
 * POST /api/sla/calculate-due-date
 * Calculate due dates based on SLA
 */
router.post('/calculate-due-date', [
  body('slaId').notEmpty().withMessage('slaId is required'),
  body('createdAt').isISO8601().withMessage('createdAt must be a valid date'),
  validateRequest
], async (_req: AuthRequest, res: Response, next: any) => {
  try {
    const result = await controller.calculateDueDate(_req, res, next);
    return result;
  } catch (error) {
    return next(error);
  }
});

export default router;
