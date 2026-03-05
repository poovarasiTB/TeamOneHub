import { Router, Response } from 'express';

const router = Router();

// Health check endpoint
router.get('/', (_req, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'assets-service',
  });
});

export default router;
