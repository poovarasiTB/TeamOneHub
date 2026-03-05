import { Router, Response } from 'express';
import { PayrollService } from '../services/payroll.service';
import { authenticate, AuthRequest, requireRole } from '../middleware/auth';

const router = Router();
const payrollService = new PayrollService();

router.use(authenticate);

/**
 * GET /api/payroll
 * List payroll records
 */
router.get('/', async (_req: AuthRequest, res: Response, next: any) => {
  try {
    const { page = 1, limit = 20, employeeId, status, periodStart, periodEnd } = _req.query;
    const result = await payrollService.findAll({
      page: Number(page),
      limit: Number(limit),
      employeeId: employeeId as string,
      status: status as string,
      periodStart: periodStart as string,
      periodEnd: periodEnd as string,
      tenantId: _req.user?.tenantId || '',
    });
    return res.json(result);
  } catch (error) {
    return next(error);
  }
});

/**
 * GET /api/payroll/stats
 * Get payroll statistics
 */
router.get('/stats', async (_req: AuthRequest, res: Response, next: any) => {
  try {
    const { year, month } = _req.query;
    const result = await payrollService.getMonthlyStats(
      _req.user?.tenantId || '',
      Number(year) || new Date().getFullYear(),
      Number(month) || new Date().getMonth() + 1
    );
    return res.json(result);
  } catch (error) {
    return next(error);
  }
});

/**
 * GET /api/payroll/:id
 * Get payroll record by ID
 */
router.get('/:id', async (_req: AuthRequest, res: Response, next: any) => {
  try {
    const result = await payrollService.findById(_req.params.id as string, _req.user?.tenantId || '');
    if (!result) {
      return res.status(404).json({ error: 'Payroll record not found' });
    }
    return res.json(result);
  } catch (error) {
    return next(error);
  }
});

/**
 * POST /api/payroll/generate
 * Generate payroll
 */
router.post('/generate', requireRole('admin', 'manager'), async (_req: AuthRequest, res: Response, next: any) => {
  try {
    const result = await payrollService.generatePayroll(_req.body, _req.user?.id || '', _req.user?.tenantId || '');
    return res.status(201).json(result);
  } catch (error) {
    return next(error);
  }
});

/**
 * POST /api/payroll/:id/process
 * Process payroll
 */
router.post('/:id/process', requireRole('admin', 'manager'), async (_req: AuthRequest, res: Response, next: any) => {
  try {
    const result = await payrollService.processPayroll(_req.params.id as string, _req.user?.id || '', _req.user?.tenantId || '');
    return res.json(result);
  } catch (error) {
    return next(error);
  }
});

/**
 * POST /api/payroll/:id/pay
 * Mark payroll as paid
 */
router.post('/:id/pay', requireRole('admin', 'manager'), async (_req: AuthRequest, res: Response, next: any) => {
  try {
    const { paymentDate, paymentReference } = _req.body;
    const result = await payrollService.markPaid(
      _req.params.id as string,
      paymentDate,
      paymentReference,
      _req.user?.id || '',
      _req.user?.tenantId || ''
    );
    return res.json(result);
  } catch (error) {
    return next(error);
  }
});

export default router;
