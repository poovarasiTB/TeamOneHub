import { Router, Response } from 'express';
import { CustomerController, AuthRequest } from '../controllers/customer.controller';
import { authenticate } from '../middleware/auth';

const router = Router();
const controller = new CustomerController();

router.use(authenticate);

// GET /api/customers - List all customers
router.get('/', async (_req: AuthRequest, res: Response, next: any) => {
  try {
    const result = await controller.findAll(_req, res, next);
    return result;
  } catch (error) {
    return next(error);
  }
});

// GET /api/customers/stats - Get customer statistics
router.get('/stats', async (_req: AuthRequest, res: Response, next: any) => {
  try {
    const result = await controller.getStats(_req, res, next);
    return result;
  } catch (error) {
    return next(error);
  }
});

// GET /api/customers/:id - Get customer by ID
router.get('/:id', async (_req: AuthRequest, res: Response, next: any) => {
  try {
    const result = await controller.findById(_req, res, next);
    return result;
  } catch (error) {
    return next(error);
  }
});

// POST /api/customers - Create new customer
router.post('/', async (_req: AuthRequest, res: Response, next: any) => {
  try {
    const result = await controller.create(_req, res, next);
    return result;
  } catch (error) {
    return next(error);
  }
});

// PATCH /api/customers/:id - Update customer
router.patch('/:id', async (_req: AuthRequest, res: Response, next: any) => {
  try {
    const result = await controller.update(_req, res, next);
    return result;
  } catch (error) {
    return next(error);
  }
});

// DELETE /api/customers/:id - Soft delete customer
router.delete('/:id', async (_req: AuthRequest, res: Response, next: any) => {
  try {
    const result = await controller.delete(_req, res, next);
    return result;
  } catch (error) {
    return next(error);
  }
});

export { router as customerRoutes };
