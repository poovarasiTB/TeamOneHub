import { Router, Response } from 'express';
import { WikiController, AuthRequest } from '../controllers/wiki.controller';
import { authenticate } from '../middleware/auth';
import { body } from 'express-validator';
import { validateRequest } from '../middleware/validator';

const router = Router();
const controller = new WikiController();

router.use(authenticate);

/**
 * GET /api/wiki
 * List all wiki articles
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
 * GET /api/wiki/categories
 * Get all wiki categories
 */
router.get('/categories', async (_req: AuthRequest, res: Response, next: any) => {
  try {
    const result = await controller.getCategories(_req, res, next);
    return result;
  } catch (error) {
    return next(error);
  }
});

/**
 * GET /api/wiki/:id
 * Get article by ID
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
 * POST /api/wiki
 * Create new wiki article
 */
router.post('/', [
  body('title').notEmpty().withMessage('title is required'),
  body('slug').notEmpty().withMessage('slug is required'),
  body('content').notEmpty().withMessage('content is required'),
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
 * PATCH /api/wiki/:id
 * Update wiki article
 */
router.patch('/:id', [
  body('title').optional().notEmpty().withMessage('title cannot be empty'),
  body('content').optional().notEmpty().withMessage('content cannot be empty'),
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
 * DELETE /api/wiki/:id
 * Delete wiki article
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
 * POST /api/wiki/:id/publish
 * Publish wiki article
 */
router.post('/:id/publish', async (_req: AuthRequest, res: Response, next: any) => {
  try {
    const result = await controller.publish(_req, res, next);
    return result;
  } catch (error) {
    return next(error);
  }
});

export default router;
