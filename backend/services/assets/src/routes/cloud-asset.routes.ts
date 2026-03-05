import { Router, Response } from 'express';

const router = Router();

// Placeholder cloud asset routes
router.get('/', (_req, res: Response) => {
  res.json({ message: 'Cloud asset routes - implement CRUD operations' });
});

export { router as cloudAssetRoutes };
