/**
 * TeamOne Money Service
 * 
 * Manages Finance, Accounting, CRM, Procurement, Billing
 * 
 * @version 1.0.0
 * @author TeamOne Development Team
 */

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import accountRoutes from './routes/account.routes';
import { invoiceRoutes } from './routes/invoice.routes';
import billRoutes from './routes/bill.routes';
import { expenseRoutes } from './routes/expense.routes';
import { customerRoutes } from './routes/customer.routes';
import { logger } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import { healthCheck } from './routes/health.routes';

const app = express();
const PORT = process.env.PORT || 3005;

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
app.use('/api/accounts', accountRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/bills', billRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/customers', customerRoutes);

/**
 * Root endpoint
 */
app.get('/api', (_req: Request, res: Response) => {
  res.json({
    name: 'TeamOne Money Service',
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
  logger.info(`💰 Money Service running on port ${PORT}`);
  logger.info(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`🔗 Health: http://localhost:${PORT}/health`);
  logger.info(`🔗 API: http://localhost:${PORT}/api`);
});

export default app;
