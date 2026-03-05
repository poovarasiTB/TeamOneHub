import { Router, Response } from 'express';
import { WhiteboardController, AuthRequest } from '../controllers/whiteboard.controller';
import { authenticate } from '../middleware/auth';
import { body } from 'express-validator';
import { validateRequest } from '../middleware/validator';

const router = Router();
const controller = new WhiteboardController();

router.use(authenticate);

/**
 * GET /api/whiteboards
 * List all whiteboards with filtering and pagination
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
 * GET /api/whiteboards/:id
 * Get whiteboard by ID
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
 * GET /api/whiteboards/:id/content
 * Get whiteboard content only
 */
router.get('/:id/content', async (_req: AuthRequest, res: Response, next: any) => {
  try {
    const result = await controller.getContent(_req, res, next);
    return result;
  } catch (error) {
    return next(error);
  }
});

/**
 * POST /api/whiteboards
 * Create new whiteboard
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
 * PATCH /api/whiteboards/:id
 * Update whiteboard
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
 * PUT /api/whiteboards/:id/content
 * Update whiteboard content (for real-time collaboration)
 */
router.put('/:id/content', async (_req: AuthRequest, res: Response, next: any) => {
  try {
    const result = await controller.updateContent(_req, res, next);
    return result;
  } catch (error) {
    return next(error);
  }
});

/**
 * DELETE /api/whiteboards/:id
 * Delete whiteboard
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
 * POST /api/whiteboards/:id/collaborators
 * Add collaborator to whiteboard
 */
router.post('/:id/collaborators', [
  body('userId').notEmpty().withMessage('userId is required'),
  validateRequest
], async (_req: AuthRequest, res: Response, next: any) => {
  try {
    const result = await controller.addCollaborator(_req, res, next);
    return result;
  } catch (error) {
    return next(error);
  }
});

/**
 * DELETE /api/whiteboards/:id/collaborators
 * Remove collaborator from whiteboard
 */
router.delete('/:id/collaborators', [
  body('userId').notEmpty().withMessage('userId is required'),
  validateRequest
], async (_req: AuthRequest, res: Response, next: any) => {
  try {
    const result = await controller.removeCollaborator(_req, res, next);
    return result;
  } catch (error) {
    return next(error);
  }
});

export default router;
