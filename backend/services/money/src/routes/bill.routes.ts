import { Router, Response } from 'express';
import { BillController, AuthRequest } from '../controllers/bill.controller';
import { authenticate } from '../middleware/auth';
import { body } from 'express-validator';
import { validate } from '../middleware/validator';

const router = Router();
const controller = new BillController();

router.use(authenticate);

/**
 * GET /api/bills
 * List all bills with filtering and pagination
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
 * GET /api/bills/stats
 * Get bill statistics
 */
router.get('/stats', async (_req: AuthRequest, res: Response, next: any) => {
  try {
    const result = await controller.getStats(_req, res, next);
    return result;
  } catch (error) {
    return next(error);
  }
});

/**
 * GET /api/bills/:id
 * Get bill by ID
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
 * POST /api/bills
 * Create new bill
 */
router.post('/', [
  body('billNumber').notEmpty().withMessage('billNumber is required'),
  body('vendorId').notEmpty().withMessage('vendorId is required'),
  body('amount').isNumeric().withMessage('amount must be a number'),
  body('totalAmount').isNumeric().withMessage('totalAmount must be a number'),
  body('dueDate').isISO8601().withMessage('dueDate must be a valid date'),
  body('receivedDate').isISO8601().withMessage('receivedDate must be a valid date'),
  validate
], async (_req: AuthRequest, res: Response, next: any) => {
  try {
    const result = await controller.create(_req, res, next);
    return result;
  } catch (error) {
    return next(error);
  }
});

/**
 * PATCH /api/bills/:id
 * Update bill
 */
router.patch('/:id', [
  body('billNumber').optional().notEmpty().withMessage('billNumber cannot be empty'),
  body('amount').optional().isNumeric().withMessage('amount must be a number'),
  body('status').optional().isIn(['draft', 'pending', 'approved', 'paid', 'overdue', 'cancelled']).withMessage('invalid status'),
  validate
], async (_req: AuthRequest, res: Response, next: any) => {
  try {
    const result = await controller.update(_req, res, next);
    return result;
  } catch (error) {
    return next(error);
  }
});

/**
 * DELETE /api/bills/:id
 * Delete bill
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
 * POST /api/bills/:id/approve
 * Approve bill
 */
router.post('/:id/approve', async (_req: AuthRequest, res: Response, next: any) => {
  try {
    const result = await controller.approve(_req, res, next);
    return result;
  } catch (error) {
    return next(error);
  }
});

/**
 * POST /api/bills/:id/mark-paid
 * Mark bill as paid
 */
router.post('/:id/mark-paid', async (_req: AuthRequest, res: Response, next: any) => {
  try {
    const result = await controller.markPaid(_req, res, next);
    return result;
  } catch (error) {
    return next(error);
  }
});

export default router;
