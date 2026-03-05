import { Router, Response } from 'express';
import { InvoiceController, AuthRequest } from '../controllers/invoice.controller';
import { authenticate } from '../middleware/auth';
import { body, validationResult } from 'express-validator';

const router = Router();
const controller = new InvoiceController();

router.use(authenticate);

// Validation middleware helper
const validate = (req: any, res: Response, next: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Request validation failed',
      details: errors.array(),
    });
  }
  return next();
};

/**
 * GET /api/invoices
 * List all invoices with filtering, pagination
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
 * GET /api/invoices/stats
 * Get invoice statistics
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
 * GET /api/invoices/:id
 * Get invoice by ID
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
 * POST /api/invoices
 * Create new invoice
 */
router.post('/', [
  body('customerId').notEmpty().withMessage('customerId is required'),
  body('amount').isNumeric().withMessage('amount must be a number'),
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
 * PATCH /api/invoices/:id
 * Update invoice
 */
router.patch('/:id', [
  body('amount').optional().isNumeric().withMessage('amount must be a number'),
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
 * POST /api/invoices/:id/send
 * Send invoice to customer
 */
router.post('/:id/send', async (_req: AuthRequest, res: Response, next: any) => {
  try {
    const result = await controller.send(_req, res, next);
    return result;
  } catch (error) {
    return next(error);
  }
});

/**
 * POST /api/invoices/:id/payment
 * Record payment
 */
router.post('/:id/payment', async (_req: AuthRequest, res: Response, next: any) => {
  try {
    const result = await controller.recordPayment(_req, res, next);
    return result;
  } catch (error) {
    return next(error);
  }
});

/**
 * DELETE /api/invoices/:id
 * Soft delete invoice
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
 * POST /api/invoices/:id/export
 * Export invoice
 */
router.post('/:id/export', async (_req: AuthRequest, res: Response, next: any) => {
  try {
    const result = await controller.export(_req, res, next);
    return result;
  } catch (error) {
    return next(error);
  }
});

export { router as invoiceRoutes };
