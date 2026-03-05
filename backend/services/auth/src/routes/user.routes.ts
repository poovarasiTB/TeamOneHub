import { Router, Response } from 'express';
import { UserController, AuthRequest } from '../controllers/user.controller';
import { authenticate } from '../middleware/auth';
import { body } from 'express-validator';
import { validateRequest } from '../middleware/validator';

const router = Router();
const controller = new UserController();

router.use(authenticate);

/**
 * GET /api/users
 * List all users with filtering and pagination
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
 * GET /api/users/:id
 * Get user by ID
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
 * POST /api/users
 * Create new user
 */
router.post('/', [
  body('email').isEmail().withMessage('email is required'),
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
 * PATCH /api/users/:id
 * Update user
 */
router.patch('/:id', [
  body('email').optional().isEmail().withMessage('invalid email'),
  body('name').optional().notEmpty().withMessage('name cannot be empty'),
  body('status').optional().isIn(['pending', 'active', 'suspended', 'inactive']).withMessage('invalid status'),
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
 * DELETE /api/users/:id
 * Delete user
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
 * POST /api/users/:id/suspend
 * Suspend user
 */
router.post('/:id/suspend', async (_req: AuthRequest, res: Response, next: any) => {
  try {
    const result = await controller.suspend(_req, res, next);
    return result;
  } catch (error) {
    return next(error);
  }
});

/**
 * POST /api/users/:id/activate
 * Activate suspended user
 */
router.post('/:id/activate', async (_req: AuthRequest, res: Response, next: any) => {
  try {
    const result = await controller.activate(_req, res, next);
    return result;
  } catch (error) {
    return next(error);
  }
});

export { router as userRoutes };
