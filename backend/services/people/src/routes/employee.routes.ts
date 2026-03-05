import { Router, Response } from 'express';
import { EmployeeService } from '../services/employee.service';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();
const employeeService = new EmployeeService();

router.use(authenticate);

/**
 * GET /api/employees
 * List all employees
 */
router.get('/', async (_req: AuthRequest, res: Response, next: any) => {
  try {
    const { page = 1, limit = 20, search, status, department } = _req.query;
    const result = await employeeService.findAll({
      page: Number(page),
      limit: Number(limit),
      search: search as string,
      status: status as string,
      department: department as string,
      tenantId: _req.user?.tenantId || '',
    });
    return res.json(result);
  } catch (error) {
    return next(error);
  }
});

/**
 * GET /api/employees/stats
 * Get employee statistics
 */
router.get('/stats', async (_req: AuthRequest, res: Response, next: any) => {
  try {
    const result = await employeeService.getStats(_req.user?.tenantId || '');
    return res.json(result);
  } catch (error) {
    return next(error);
  }
});

/**
 * GET /api/employees/:id
 * Get employee by ID
 */
router.get('/:id', async (_req: AuthRequest, res: Response, next: any) => {
  try {
    const result = await employeeService.findById(_req.params.id as string, _req.user?.tenantId || '');
    if (!result) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    return res.json(result);
  } catch (error) {
    return next(error);
  }
});

/**
 * POST /api/employees
 * Create new employee
 */
router.post('/', async (_req: AuthRequest, res: Response, next: any) => {
  try {
    const result = await employeeService.create(_req.body, _req.user?.id || '', _req.user?.tenantId || '');
    return res.status(201).json(result);
  } catch (error) {
    return next(error);
  }
});

/**
 * PATCH /api/employees/:id
 * Update employee
 */
router.patch('/:id', async (_req: AuthRequest, res: Response, next: any) => {
  try {
    const result = await employeeService.update(_req.params.id as string, _req.body, _req.user?.id || '', _req.user?.tenantId || '');
    return res.json(result);
  } catch (error) {
    return next(error);
  }
});

/**
 * DELETE /api/employees/:id
 * Delete employee
 */
router.delete('/:id', async (_req: AuthRequest, res: Response, next: any) => {
  try {
    await employeeService.delete(_req.params.id as string, _req.user?.id || '', _req.user?.tenantId || '');
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
});

export default router;
