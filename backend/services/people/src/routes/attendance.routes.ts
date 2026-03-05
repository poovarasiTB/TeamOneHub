import { Router, Response } from 'express';
import { AttendanceService } from '../services/attendance.service';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();
const attendanceService = new AttendanceService();

router.use(authenticate);

/**
 * GET /api/attendance
 * List attendance records
 */
router.get('/', async (_req: AuthRequest, res: Response, next: any) => {
  try {
    const { page = 1, limit = 20, employeeId, startDate, endDate, status } = _req.query;
    const result = await attendanceService.findAll({
      page: Number(page),
      limit: Number(limit),
      employeeId: employeeId as string,
      startDate: startDate as string,
      endDate: endDate as string,
      status: status as string,
      tenantId: _req.user?.tenantId || '',
    });
    return res.json(result);
  } catch (error) {
    return next(error);
  }
});

/**
 * POST /api/attendance/mark
 * Mark attendance
 */
router.post('/mark', async (_req: AuthRequest, res: Response, next: any) => {
  try {
    const result = await attendanceService.markAttendance(_req.body, _req.user?.tenantId || '');
    return res.status(201).json(result);
  } catch (error) {
    return next(error);
  }
});

/**
 * GET /api/attendance/monthly-stats
 * Get monthly attendance stats
 */
router.get('/monthly-stats', async (_req: AuthRequest, res: Response, next: any) => {
  try {
    const { employeeId, year, month } = _req.query;
    const result = await attendanceService.getMonthlyStats(
      employeeId as string,
      _req.user?.tenantId || '',
      Number(year),
      Number(month)
    );
    return res.json(result);
  } catch (error) {
    return next(error);
  }
});

export default router;
