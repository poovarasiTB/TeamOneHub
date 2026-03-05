import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';

export function validateRequest(validationChains: ValidationChain[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(validationChains.map(chain => chain.run(req)));

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Request validation failed',
        details: errors.array(),
      });
    }

    return next();
  };
}

export default { validateRequest };
