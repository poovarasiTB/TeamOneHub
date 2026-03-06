/**
 * TeamOne Work Service
 *
 * Manages Projects, Tasks, Whiteboards, and DevOps Integrations
 *
 * @version 1.0.0
 * @author TeamOne Development Team
 */

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import projectRoutes from './routes/project.routes';
import taskRoutes from './routes/task.routes';
import whiteboardRoutes from './routes/whiteboard.routes';
import sprintRoutes from './routes/sprint.routes';
import timesheetRoutes from './routes/timesheet.routes';
import { logger } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import { healthCheck } from './routes/health.routes';
import { WebSocketServer } from './websocket/server';

const app = express();
const PORT = process.env.PORT || 3004;

/**
 * Security Middleware
 */
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
}));

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

/**
 * Rate Limiting
 */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests',
});

app.use('/api/', limiter);

/**
 * Body Parsing
 */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

/**
 * Request Logging
 */
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(`${req.method} ${req.path} ${res.statusCode} ${duration}ms`);
  });
  next();
});

/**
 * Routes
 */
app.use('/health', healthCheck);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/whiteboards', whiteboardRoutes);
app.use('/api/sprints', sprintRoutes);
app.use('/api/timesheets', timesheetRoutes);

/**
 * Root endpoint
 */
app.get('/api', (_req: Request, res: Response) => {
  res.json({
    name: 'TeamOne Work Service',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString(),
  });
});

/**
 * 404 Handler
 */
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.path}`,
  });
});

/**
 * Global Error Handler
 */
app.use(errorHandler);

/**
 * Start Server
 */
app.listen(PORT, () => {
  logger.info(`💼 Work Service running on port ${PORT}`);
  logger.info(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`🔗 Health: http://localhost:${PORT}/health`);
  logger.info(`🔗 API: http://localhost:${PORT}/api`);
});

/**
 * Initialize WebSocket for real-time collaboration
 */
const wss = new WebSocketServer();
wss.initialize();

export default app;
