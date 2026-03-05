import { Router, Request, Response, NextFunction } from 'express';

const router = Router();

/**
 * GET /api/validator/health
 * Health check for validator
 */
router.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

/**
 * Middleware to validate request
 */
export function validateRequest(_req: Request, _res: Response, next: NextFunction) {
  next();
}

export { router };
