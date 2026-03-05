import { Router, Response } from 'express';

const router = Router();

// Health check endpoint
router.get('/', (_req, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'support-service',
  });
});

export { router as healthCheck };
