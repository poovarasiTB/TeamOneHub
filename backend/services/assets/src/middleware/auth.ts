import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

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
    const secret = process.env.JWT_SECRET || 'dev-secret-key';
    const decoded = jwt.verify(token, secret) as any;

    req.user = {
      id: decoded.userId,
      email: decoded.email,
      tenantId: decoded.tenantId,
      roles: decoded.roles || [],
    };

    return next();
  } catch (error: any) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid token',
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Token expired',
      });
    }

    return res.status(500).json({
      error: 'Internal Server Error',
      message: error.message,
    });
  }
}
