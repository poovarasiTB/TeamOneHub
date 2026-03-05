/**
 * TeamOne API Gateway
 * 
 * Routes incoming requests to appropriate microservices
 * Handles rate limiting, CORS, and security headers
 * 
 * @version 1.0.0
 * @author TeamOne Development Team
 */

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createProxyMiddleware, fixRequestBody } from 'http-proxy-middleware';
import { logger } from './utils/logger';

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disabled for API
  crossOriginEmbedderPolicy: false,
}));

// CORS configuration
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:3000',
  'http://localhost:3009'
];

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token', 'X-CSRF-Token', 'x-request-id', 'X-Request-ID', 'X-Request-Id'],
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Increased for development from 100
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
  });
});

// CSRF token endpoint for frontend compatibility
app.get('/api/csrf-token', (_req: Request, res: Response) => {
  res.json({
    csrfToken: 'dummy-csrf-token-for-development',
  });
});

// API Gateway Routes
const SERVICE_URLS = {
  auth: process.env.AUTH_SERVICE_URL || 'http://localhost:3002',
  work: process.env.WORK_SERVICE_URL || 'http://localhost:3004',
  money: process.env.MONEY_SERVICE_URL || 'http://localhost:3005',
  assets: process.env.ASSETS_SERVICE_URL || 'http://localhost:3006',
  support: process.env.SUPPORT_SERVICE_URL || 'http://localhost:3007',
  growth: process.env.GROWTH_SERVICE_URL || 'http://localhost:3008',
  people: process.env.PEOPLE_SERVICE_URL || 'http://localhost:3003',
};

// Create proxy middleware for each service
Object.entries(SERVICE_URLS).forEach(([service, url]) => {
  const proxyMiddleware = createProxyMiddleware({
    target: url,
    changeOrigin: true,
    secure: false,
    on: {
      proxyReq: fixRequestBody,
    },
    pathRewrite: (path: string, req: any) => req.originalUrl || path,
  });

  app.use(`/api/${service}`, proxyMiddleware);

  logger.info(`Gateway route configured: /api/${service} → ${url}`);
});

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'Endpoint not found',
  });
});

// Global error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  logger.error('Global error handler:', err);

  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' ? 'An error occurred' : err.message,
  });
});

// Start server
app.listen(PORT, () => {
  logger.info(`🚀 API Gateway running on port ${PORT}`);
  logger.info(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`🔗 Health: http://localhost:${PORT}/health`);
  logger.info(`🔗 API: http://localhost:${PORT}/api`);
});

export default app;
