import { Router, Response } from 'express';

const router = Router();

// GET /health - Health check
router.get('/', (_req, res: Response) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

export default router;
