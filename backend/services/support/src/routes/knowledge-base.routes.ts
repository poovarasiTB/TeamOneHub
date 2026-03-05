import { Router, Response } from 'express';
import { KnowledgeBaseController, AuthRequest } from '../controllers/knowledge-base.controller';
import { authenticate } from '../middleware/auth';
import { body } from 'express-validator';
import { validateRequest } from '../middleware/validator';

const router = Router();
const controller = new KnowledgeBaseController();

router.use(authenticate);

/**
 * GET /api/kb
 * List all knowledge base articles
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
 * GET /api/kb/categories
 * Get all KB categories
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
 * GET /api/kb/slug/:slug
 * Get article by slug
 */
router.get('/slug/:slug', async (_req: AuthRequest, res: Response, next: any) => {
  try {
    const result = await controller.findBySlug(_req, res, next);
    return result;
  } catch (error) {
    return next(error);
  }
});

/**
 * GET /api/kb/:id
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
 * POST /api/kb
 * Create new article
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
 * PATCH /api/kb/:id
 * Update article
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
 * DELETE /api/kb/:id
 * Delete article
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
 * POST /api/kb/:id/feedback
 * Add feedback to article
 */
router.post('/:id/feedback', [
  body('rating').isIn(['helpful', 'not-helpful']).withMessage('rating must be helpful or not-helpful'),
  validateRequest
], async (_req: AuthRequest, res: Response, next: any) => {
  try {
    await controller.addFeedback(_req, res, next);
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
});

export default router;
