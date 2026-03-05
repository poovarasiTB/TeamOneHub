import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    tenantId: string;
    roles: string[];
  };
}

export function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'No authentication token provided',
      });
    }

    const token = authHeader.substring(7);
    
    if (!token) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid token format',
      });
    }

    const secret = process.env.JWT_SECRET || 'dev-secret-key';
    const decoded = jwt.verify(token, secret) as any;

    req.user = {
      id: decoded.userId,
      email: decoded.email,
      tenantId: decoded.tenantId,
      roles: decoded.roles || [],
    };

    logger.debug(`Authenticated user: ${req.user.email} (${req.user.id})`);
    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Token has expired',
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid token',
      });
    }

    logger.error('Authentication error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Authentication failed',
    });
  }
  
  return next();
}

export function requireRole(...roles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required',
      });
    }

    const hasRole = roles.some(role => req.user?.roles.includes(role));

    if (!hasRole) {
      return res.status(403).json({
        error: 'Forbidden',
        message: `Required role: ${roles.join(' or ')}`,
      });
    }

    return next();
  };
}

export function requireTenant(tenantId: string) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (req.user.tenantId !== tenantId) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Access denied to this tenant',
      });
    }

    return next();
  };
}
