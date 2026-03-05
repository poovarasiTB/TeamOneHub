/**
 * TeamOne Support Service
 * 
 * Manages IT Helpdesk, Ticketing, Knowledge Base, Call Center
 * 
 * @version 1.0.0
 * @author TeamOne Development Team
 */

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import ticketRoutes from './routes/ticket.routes';
import knowledgeBaseRoutes from './routes/knowledge-base.routes';
import slaRoutes from './routes/sla.routes';
import { logger } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import { healthCheck } from './routes/health.routes';

const app = express();
const PORT = process.env.PORT || 3007;

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

app.use('/health', healthCheck);
app.use('/api/tickets', ticketRoutes);
app.use('/api/knowledge-base', knowledgeBaseRoutes);
app.use('/api/sla', slaRoutes);

app.get('/api', (_req: Request, res: Response) => {
  res.json({
    name: 'TeamOne Support Service',
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
  logger.info(`🎧 Support Service running on port ${PORT}`);
  logger.info(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`🔗 Health: http://localhost:${PORT}/health`);
  logger.info(`🔗 API: http://localhost:${PORT}/api`);
});

export default app;
