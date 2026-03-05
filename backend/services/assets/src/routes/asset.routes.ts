import { Router, Response } from 'express';
import { AssetController, AuthRequest } from '../controllers/asset.controller';
import { authenticate } from '../middleware/auth';
import { body, validationResult } from 'express-validator';

const router = Router();
const controller = new AssetController();

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
 * GET /api/assets
 * List all assets
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
 * GET /api/assets/stats
 * Get asset statistics
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
 * GET /api/assets/:id
 * Get asset by ID
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
 * POST /api/assets
 * Create new asset
 */
router.post('/', [
  body('name').notEmpty().withMessage('name is required'),
  body('type').notEmpty().withMessage('type is required'),
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
 * PATCH /api/assets/:id
 * Update asset
 */
router.patch('/:id', [
  body('name').optional().notEmpty().withMessage('name cannot be empty'),
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
 * DELETE /api/assets/:id
 * Delete asset
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
 * POST /api/assets/:id/assign
 * Assign asset
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
 * POST /api/assets/:id/maintenance
 * Record maintenance
 */
router.post('/:id/maintenance', async (_req: AuthRequest, res: Response, next: any) => {
  try {
    const result = await controller.recordMaintenance(_req, res, next);
    return result;
  } catch (error) {
    return next(error);
  }
});

/**
 * GET /api/assets/:id/history
 * Get asset history
 */
router.get('/:id/history', async (_req: AuthRequest, res: Response, next: any) => {
  try {
    const result = await controller.getHistory(_req, res, next);
    return result;
  } catch (error) {
    return next(error);
  }
});

export default router;
