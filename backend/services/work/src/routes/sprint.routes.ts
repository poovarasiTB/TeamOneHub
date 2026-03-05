import { Router, Response } from 'express';
import { SprintService } from '../services/sprint.service';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();
const sprintService = new SprintService();

router.use(authenticate);

/**
 * GET /api/sprints
 * List all sprints
 */
router.get('/', async (_req: AuthRequest, res: Response, next: any) => {
  try {
    const { page = 1, limit = 20, projectId, status } = _req.query;
    const result = await sprintService.findAll({
      page: Number(page),
      limit: Number(limit),
      projectId: projectId as string,
      status: status as string,
      tenantId: _req.user?.tenantId || '',
    });
    return res.json(result);
  } catch (error) {
    return next(error);
  }
});

/**
 * GET /api/sprints/:id
 * Get sprint by ID
 */
router.get('/:id', async (_req: AuthRequest, res: Response, next: any) => {
  try {
    const sprintId = Array.isArray(_req.params.id) ? _req.params.id[0] : _req.params.id;
    const result = await sprintService.findById(sprintId, _req.user?.tenantId || '');
    if (!result) {
      return res.status(404).json({ error: 'Sprint not found' });
    }
    return res.json(result);
  } catch (error) {
    return next(error);
  }
});

/**
 * GET /api/sprints/:id/tasks
 * Get sprint tasks
 */
router.get('/:id/tasks', async (_req: AuthRequest, res: Response, next: any) => {
  try {
    const sprintId = Array.isArray(_req.params.id) ? _req.params.id[0] : _req.params.id;
    const result = await sprintService.getTasks(sprintId, _req.user?.tenantId || '');
    return res.json(result);
  } catch (error) {
    return next(error);
  }
});

/**
 * POST /api/sprints
 * Create new sprint
 */
router.post('/', async (_req: AuthRequest, res: Response, next: any) => {
  try {
    const result = await sprintService.create(_req.body, _req.user?.id || '', _req.user?.tenantId || '');
    return res.status(201).json(result);
  } catch (error) {
    return next(error);
  }
});

/**
 * PATCH /api/sprints/:id
 * Update sprint
 */
router.patch('/:id', async (_req: AuthRequest, res: Response, next: any) => {
  try {
    const sprintId = Array.isArray(_req.params.id) ? _req.params.id[0] : _req.params.id;
    const result = await sprintService.update(sprintId, _req.body, _req.user?.id || '', _req.user?.tenantId || '');
    return res.json(result);
  } catch (error) {
    return next(error);
  }
});

/**
 * DELETE /api/sprints/:id
 * Delete sprint
 */
router.delete('/:id', async (_req: AuthRequest, res: Response, next: any) => {
  try {
    const sprintId = Array.isArray(_req.params.id) ? _req.params.id[0] : _req.params.id;
    await sprintService.delete(sprintId, _req.user?.id || '', _req.user?.tenantId || '');
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
});

/**
 * POST /api/sprints/:id/tasks
 * Add task to sprint
 */
router.post('/:id/tasks', async (_req: AuthRequest, res: Response, next: any) => {
  try {
    const { taskId } = _req.body;
    const sprintId = Array.isArray(_req.params.id) ? _req.params.id[0] : _req.params.id;
    const result = await sprintService.addTask(sprintId, taskId, _req.user?.tenantId || '');
    return res.json(result);
  } catch (error) {
    return next(error);
  }
});

export default router;
