import { Router, Response } from 'express';
import { LicenseController, AuthRequest } from '../controllers/license.controller';
import { authenticate } from '../middleware/auth';
import { body, validationResult } from 'express-validator';

const router = Router();
const controller = new LicenseController();

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
 * GET /api/licenses
 * List all software licenses
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
 * GET /api/licenses/compliance
 * Get license compliance status
 */
router.get('/compliance', async (_req: AuthRequest, res: Response, next: any) => {
  try {
    const result = await controller.getCompliance(_req, res, next);
    return result;
  } catch (error) {
    return next(error);
  }
});

/**
 * GET /api/licenses/:id
 * Get license by ID
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
 * POST /api/licenses
 * Create new license
 */
router.post('/', [
  body('name').notEmpty().withMessage('name is required'),
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
 * PATCH /api/licenses/:id
 * Update license
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
 * DELETE /api/licenses/:id
 * Delete license
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
