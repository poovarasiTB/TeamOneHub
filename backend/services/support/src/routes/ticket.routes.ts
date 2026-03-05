import { Router, Response } from 'express';
import { TicketController, AuthRequest } from '../controllers/ticket.controller';
import { authenticate } from '../middleware/auth';
import { body, validationResult } from 'express-validator';

const router = Router();
const controller = new TicketController();

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
 * GET /api/tickets
 * List all tickets
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
 * GET /api/tickets/stats
 * Get ticket statistics
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
 * GET /api/tickets/:id
 * Get ticket by ID
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
 * POST /api/tickets
 * Create new ticket
 */
router.post('/', [
  body('title').notEmpty().withMessage('title is required'),
  body('description').notEmpty().withMessage('description is required'),
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
 * PATCH /api/tickets/:id
 * Update ticket
 */
router.patch('/:id', [
  body('title').optional().notEmpty().withMessage('title cannot be empty'),
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
 * POST /api/tickets/:id/comment
 * Add comment to ticket
 */
router.post('/:id/comment', async (_req: AuthRequest, res: Response, next: any) => {
  try {
    const result = await controller.addComment(_req, res, next);
    return result;
  } catch (error) {
    return next(error);
  }
});

/**
 * POST /api/tickets/:id/assign
 * Assign ticket to agent
 */
router.post('/:id/assign', async (_req: AuthRequest, res: Response, next: any) => {
  try {
    const result = await controller.assign(_req, res, next);
    return result;
  } catch (error) {
    return next(error);
  }
});

/**
 * DELETE /api/tickets/:id
 * Soft delete ticket
 */
router.delete('/:id', async (_req: AuthRequest, res: Response, next: any) => {
  try {
    const result = await controller.delete(_req, res, next);
    return result;
  } catch (error) {
    return next(error);
  }
});

export default router;
