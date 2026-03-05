/**
 * TeamOne Growth Service
 * 
 * Manages Wiki, Meetings, Campaigns, and Ideas
 * 
 * @version 1.0.0
 * @author TeamOne Development Team
 */

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { logger } from './utils/logger';

const app = express();
const PORT = process.env.PORT || 3008;

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    error: 'Too Many Requests',
    message: 'Too many requests. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(`${req.method} ${req.path} ${res.statusCode} ${duration}ms`);
  });
  
  next();
});

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    service: 'growth-service',
  });
});

// Placeholder routes - implement as needed
app.get('/api/wiki', (_req: Request, res: Response) => {
  res.json({ message: 'Wiki routes - implement CRUD operations' });
});

app.get('/api/meetings', (_req: Request, res: Response) => {
  res.json({ message: 'Meeting routes - implement CRUD operations' });
});

app.get('/api/campaigns', (_req: Request, res: Response) => {
  res.json({ message: 'Campaign routes - implement CRUD operations' });
});

app.get('/api/ideas', (_req: Request, res: Response) => {
  res.json({ message: 'Idea routes - implement CRUD operations' });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.path}`,
  });
});

// Global error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  logger.error('Global error handler:', err);

  return res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' ? 'An error occurred' : err.message,
  });
});

// Start server
app.listen(PORT, () => {
  logger.info(`🌱 Growth Service running on port ${PORT}`);
  logger.info(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`🔗 Health: http://localhost:${PORT}/health`);
  logger.info(`🔗 API: http://localhost:${PORT}/api`);
});

export default app;
