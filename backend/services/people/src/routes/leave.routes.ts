import { Router, Response } from 'express';
import { LeaveService } from '../services/leave.service';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();
const leaveService = new LeaveService();

router.use(authenticate);

/**
 * GET /api/leave
 * List leave requests
 */
router.get('/', async (_req: AuthRequest, res: Response, next: any) => {
  try {
    const { page = 1, limit = 20, employeeId, status, leaveTypeId } = _req.query;
    const result = await leaveService.findAll({
      page: Number(page),
      limit: Number(limit),
      employeeId: employeeId as string,
      status: status as string,
      leaveTypeId: leaveTypeId as string,
      tenantId: _req.user?.tenantId || '',
    });
    return res.json(result);
  } catch (error) {
    return next(error);
  }
});

/**
 * POST /api/leave/apply
 * Apply for leave
 */
router.post('/apply', async (_req: AuthRequest, res: Response, next: any) => {
  try {
    const result = await leaveService.applyLeave(_req.body, _req.user?.tenantId || '');
    return res.status(201).json(result);
  } catch (error) {
    return next(error);
  }
});

/**
 * POST /api/leave/:id/approve
 * Approve leave request
 */
router.post('/:id/approve', async (_req: AuthRequest, res: Response, next: any) => {
  try {
    const result = await leaveService.approveLeave(_req.params.id as string, _req.user?.id || '', _req.user?.tenantId || '');
    return res.json(result);
  } catch (error) {
    return next(error);
  }
});

/**
 * POST /api/leave/:id/reject
 * Reject leave request
 */
router.post('/:id/reject', async (_req: AuthRequest, res: Response, next: any) => {
  try {
    const { reason } = _req.body;
    const result = await leaveService.rejectLeave(_req.params.id as string, reason, _req.user?.tenantId || '');
    return res.json(result);
  } catch (error) {
    return next(error);
  }
});

/**
 * GET /api/leave/balance
 * Get leave balance
 */
router.get('/balance', async (_req: AuthRequest, res: Response, next: any) => {
  try {
    const { employeeId, leaveTypeId, year } = _req.query;
    const result = await leaveService.getBalance(
      employeeId as string,
      leaveTypeId as string,
      _req.user?.tenantId || '',
      Number(year) || new Date().getFullYear()
    );
    return res.json(result);
  } catch (error) {
    return next(error);
  }
});

export default router;
