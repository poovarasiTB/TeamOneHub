/**
 * TeamOne Assets Service
 * 
 * Manages IT Assets, Software Licenses, Cloud Resources, Domains, Digital Assets
 * 
 * @version 1.0.0
 * @author TeamOne Development Team
 */

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import assetRoutes from './routes/asset.routes';
import licenseRoutes from './routes/license.routes';
import domainRoutes from './routes/domain.routes';
import { cloudAssetRoutes } from './routes/cloud-asset.routes';
import { logger } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import healthRoutes from './routes/health.routes';

const app = express();
const PORT = process.env.PORT || 3006;

app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
}));

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests',
});

app.use('/api/', limiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(`${req.method} ${req.path} ${res.statusCode} ${duration}ms`);
  });
  next();
});

app.use('/health', healthRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/licenses', licenseRoutes);
app.use('/api/domains', domainRoutes);
app.use('/api/cloud-assets', cloudAssetRoutes);

app.get('/api', (_req: Request, res: Response) => {
  res.json({
    name: 'TeamOne Assets Service',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString(),
  });
});

app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.path}`,
  });
});

app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`🖥️ Assets Service running on port ${PORT}`);
  logger.info(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`🔗 Health: http://localhost:${PORT}/health`);
  logger.info(`🔗 API: http://localhost:${PORT}/api`);
});

export default app;
