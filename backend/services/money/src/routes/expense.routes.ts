import { Router, Response } from 'express';
import { ExpenseService } from '../services/expense.service';
import { AuthRequest } from '../middleware/auth';

const router = Router();
const expenseService = new ExpenseService();

// GET /api/expenses - List all expenses
router.get('/', async (_req: AuthRequest, res: Response, next: any) => {
  try {
    const { page = 1, limit = 20, status = '', category = '' } = _req.query;
    const result = await expenseService.findAll({
      page: Number(page),
      limit: Number(limit),
      status: status as string,
      category: category as string,
      tenantId: _req.user?.tenantId || '',
    });
    return res.json(result);
  } catch (error: any) {
    return next(error);
  }
});

// GET /api/expenses/stats - Get expense statistics
router.get('/stats', async (_req: AuthRequest, res: Response, next: any) => {
  try {
    const stats = await expenseService.getStats(_req.user?.tenantId || '');
    return res.json(stats);
  } catch (error: any) {
    return next(error);
  }
});

// GET /api/expenses/:id - Get expense by ID
router.get('/:id', async (_req: AuthRequest, res: Response, next: any) => {
  try {
    const id = Array.isArray(_req.params.id) ? _req.params.id[0] : _req.params.id;
    const expense = await expenseService.findById(id, _req.user?.tenantId || '');
    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    return res.json(expense);
  } catch (error: any) {
    return next(error);
  }
});

// POST /api/expenses - Create new expense
router.post('/', async (_req: AuthRequest, res: Response, next: any) => {
  try {
    const expense = await expenseService.create(_req.body, _req.user?.id || '', _req.user?.tenantId || '');
    return res.status(201).json(expense);
  } catch (error: any) {
    return next(error);
  }
});

// PATCH /api/expenses/:id - Update expense
router.patch('/:id', async (_req: AuthRequest, res: Response, next: any) => {
  try {
    const id = Array.isArray(_req.params.id) ? _req.params.id[0] : _req.params.id;
    const expense = await expenseService.update(id, _req.body, _req.user?.id || '', _req.user?.tenantId || '');
    return res.json(expense);
  } catch (error: any) {
    return next(error);
  }
});

// POST /api/expenses/:id/approve - Approve expense
router.post('/:id/approve', async (_req: AuthRequest, res: Response, next: any) => {
  try {
    const id = Array.isArray(_req.params.id) ? _req.params.id[0] : _req.params.id;
    const expense = await expenseService.approve(id, _req.user?.id || '', _req.user?.tenantId || '');
    return res.json(expense);
  } catch (error: any) {
    return next(error);
  }
});

// POST /api/expenses/:id/reject - Reject expense
router.post('/:id/reject', async (_req: AuthRequest, res: Response, next: any) => {
  try {
    const id = Array.isArray(_req.params.id) ? _req.params.id[0] : _req.params.id;
    const expense = await expenseService.reject(id, _req.body.reason, _req.user?.id || '', _req.user?.tenantId || '');
    return res.json(expense);
  } catch (error: any) {
    return next(error);
  }
});

// DELETE /api/expenses/:id - Soft delete expense
router.delete('/:id', async (_req: AuthRequest, res: Response, next: any) => {
  try {
    const id = Array.isArray(_req.params.id) ? _req.params.id[0] : _req.params.id;
    await expenseService.delete(id, _req.user?.id || '', _req.user?.tenantId || '');
    return res.status(204).send();
  } catch (error: any) {
    return next(error);
  }
});

export { router as expenseRoutes };
