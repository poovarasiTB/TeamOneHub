import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';

// Store CSRF tokens (in production, use Redis)
const csrfTokens = new Map<string, { token: string; expires: number }>();

/**
 * Generate CSRF token
 */
export function generateCSRFToken(sessionId: string): string {
  const token = crypto.randomBytes(32).toString('hex');
  const expires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

  csrfTokens.set(sessionId, { token, expires });

  // Cleanup old tokens
  setTimeout(() => {
    csrfTokens.delete(sessionId);
  }, 24 * 60 * 60 * 1000);

  return token;
}

/**
 * Verify CSRF token middleware
 */
export function verifyCSRFToken(req: Request, res: Response, next: NextFunction) {
  // Skip for GET requests (should be idempotent)
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }

  const sessionId = (req as any).sessionID || req.headers['x-session-id'] as string;
  const clientToken = req.headers['x-csrf-token'] as string;

  if (!sessionId) {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'Session ID required',
    });
  }

  const storedToken = csrfTokens.get(sessionId);

  if (!storedToken) {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'CSRF token not found',
    });
  }

  if (Date.now() > storedToken.expires) {
    csrfTokens.delete(sessionId);
    return res.status(403).json({
      error: 'Forbidden',
      message: 'CSRF token expired',
    });
  }

  if (!clientToken || clientToken !== storedToken.token) {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'Invalid CSRF token',
    });
  }

  return next();
}

/**
 * Get CSRF token middleware
 */
export function getCSRFToken(req: Request, res: Response) {
  const sessionId = (req as any).sessionID || req.headers['x-session-id'] as string;

  if (!sessionId) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Session ID required',
    });
  }

  const token = generateCSRFToken(sessionId);

  return res.json({ csrfToken: token });
}

/**
 * Cleanup expired tokens (run periodically)
 */
export function cleanupExpiredTokens() {
  const now = Date.now();
  
  for (const [sessionId, data] of csrfTokens.entries()) {
    if (now > data.expires) {
      csrfTokens.delete(sessionId);
    }
  }
}

// Run cleanup every hour
setInterval(cleanupExpiredTokens, 60 * 60 * 1000);

export default {
  generateCSRFToken,
  verifyCSRFToken,
  getCSRFToken,
  cleanupExpiredTokens,
};
