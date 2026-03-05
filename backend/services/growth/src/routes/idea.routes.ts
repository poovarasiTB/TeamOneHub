import { Router, Response } from 'express';
import { IdeaController, AuthRequest } from '../controllers/idea.controller';
import { authenticate } from '../middleware/auth';
import { body } from 'express-validator';
import { validateRequest } from '../middleware/validator';

const router = Router();
const controller = new IdeaController();

router.use(authenticate);

/**
 * GET /api/ideas
 * List all ideas
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
 * GET /api/ideas/:id
 * Get idea by ID
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
 * POST /api/ideas
 * Create new idea
 */
router.post('/', [
  body('title').notEmpty().withMessage('title is required'),
  body('description').notEmpty().withMessage('description is required'),
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
 * PATCH /api/ideas/:id
 * Update idea
 */
router.patch('/:id', [
  body('title').optional().notEmpty().withMessage('title cannot be empty'),
  body('status').optional().isIn(['submitted', 'under-review', 'approved', 'in-progress', 'implemented', 'rejected']).withMessage('invalid status'),
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
 * DELETE /api/ideas/:id
 * Delete idea
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
 * POST /api/ideas/:id/upvote
 * Upvote an idea
 */
router.post('/:id/upvote', async (_req: AuthRequest, res: Response, next: any) => {
  try {
    const result = await controller.upvote(_req, res, next);
    return result;
  } catch (error) {
    return next(error);
  }
});

/**
 * POST /api/ideas/:id/downvote
 * Downvote an idea
 */
router.post('/:id/downvote', async (_req: AuthRequest, res: Response, next: any) => {
  try {
    const result = await controller.downvote(_req, res, next);
    return result;
  } catch (error) {
    return next(error);
  }
});

/**
 * DELETE /api/ideas/:id/vote
 * Remove user's vote on an idea
 */
router.delete('/:id/vote', async (_req: AuthRequest, res: Response, next: any) => {
  try {
    const result = await controller.removeVote(_req, res, next);
    return result;
  } catch (error) {
    return next(error);
  }
});

export default router;
