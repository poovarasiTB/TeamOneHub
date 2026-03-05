import { Router, Response } from 'express';
import { AccountController, AuthRequest } from '../controllers/account.controller';
import { authenticate } from '../middleware/auth';
import { body } from 'express-validator';
import { validate } from '../middleware/validator';

const router = Router();
const controller = new AccountController();

router.use(authenticate);

/**
 * GET /api/accounts
 * List all accounts with filtering and pagination
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
 * GET /api/accounts/tree
 * Get account tree (hierarchical structure)
 */
router.get('/tree', async (_req: AuthRequest, res: Response, next: any) => {
  try {
    const result = await controller.getTree(_req, res, next);
    return result;
  } catch (error) {
    return next(error);
  }
});

/**
 * GET /api/accounts/:id
 * Get account by ID
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
 * GET /api/accounts/:id/balance
 * Get account balance
 */
router.get('/:id/balance', async (_req: AuthRequest, res: Response, next: any) => {
  try {
    const result = await controller.getBalance(_req, res, next);
    return result;
  } catch (error) {
    return next(error);
  }
});

/**
 * POST /api/accounts
 * Create new account
 */
router.post('/', [
  body('code').notEmpty().withMessage('code is required'),
  body('name').notEmpty().withMessage('name is required'),
  body('type').isIn(['asset', 'liability', 'equity', 'income', 'expense']).withMessage('invalid type'),
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
 * PATCH /api/accounts/:id
 * Update account
 */
router.patch('/:id', [
  body('code').optional().notEmpty().withMessage('code cannot be empty'),
  body('name').optional().notEmpty().withMessage('name cannot be empty'),
  body('type').optional().isIn(['asset', 'liability', 'equity', 'income', 'expense']).withMessage('invalid type'),
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
 * DELETE /api/accounts/:id
 * Delete account
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
