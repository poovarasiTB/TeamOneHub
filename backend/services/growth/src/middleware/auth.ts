import { Request, Response, NextFunction } from 'express';

// Placeholder auth middleware - implement as needed
export function authenticate(_req: Request, _res: Response, next: NextFunction) {
  // For now, allow all requests
  // Implement actual authentication later
  return next();
}
