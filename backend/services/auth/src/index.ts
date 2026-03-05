/**
 * TeamOne Authentication Service
 * 
 * Handles user authentication, authorization, JWT tokens, MFA, and SSO
 * 
 * @version 1.0.0
 * @author TeamOne Development Team
 */

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { authRoutes } from './routes/auth.routes';
// import { userRoutes } from './routes/user.routes'; // Temporarily disabled due to missing dependencies
import { mfaRoutes } from './routes/mfa.routes';
import { logger } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import { healthCheck } from './routes/health.routes';

const app = express();
const PORT = process.env.PORT || 3002;

/**
 * Security Middleware
 */
app.use(helmet({
  contentSecurityPolicy: false, // Disable for API
  crossOriginEmbedderPolicy: false,
}));

const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:3000',
  'http://localhost:3009'
];

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin 
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error('CORS not allowed'), false);
    }
    return callback(null, true);
  },
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token', 'X-CSRF-Token', 'x-request-id', 'X-Request-ID', 'X-Request-Id'],
}));

/**
 * Rate Limiting
 */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Increased for development from 100
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

/**
 * Stricter rate limit for auth endpoints
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Increased for development from 5
  message: 'Too many authentication attempts, please try again later.',
});

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
app.use('/api/auth', authLimiter, authRoutes);
// app.use('/api/users', userRoutes); // Temporarily disabled
app.use('/api/mfa', mfaRoutes);

/**
 * Root endpoint
 */
app.get('/api', (_req: Request, res: Response) => {
  res.json({
    name: 'TeamOne Auth Service',
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
  logger.info(`🔐 Auth Service running on port ${PORT}`);
  logger.info(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`🔗 Health: http://localhost:${PORT}/health`);
  logger.info(`🔗 API: http://localhost:${PORT}/api`);
});

export default app;
