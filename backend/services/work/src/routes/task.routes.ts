import { Router, Response } from 'express';
import { TaskService } from '../services/task.service';
import { TaskDependencyController } from '../controllers/task-dependency.controller';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();
const taskService = new TaskService();

router.use(authenticate);

/**
 * GET /api/tasks
 * List all tasks
 */
router.get('/', async (_req: AuthRequest, res: Response, next: any) => {
  try {
    const { page = 1, limit = 20, projectId, status, priority, assigneeId, search } = _req.query;
    const result = await taskService.findAll({
      page: Number(page),
      limit: Number(limit),
      projectId: projectId as string,
      status: status as string,
      priority: priority as string,
      assigneeId: assigneeId as string,
      search: search as string,
      tenantId: _req.user?.tenantId || '',
    });
    return res.json(result);
  } catch (error) {
    return next(error);
  }
});

/**
 * GET /api/tasks/stats
 * Get task statistics
 */
router.get('/stats', async (_req: AuthRequest, res: Response, next: any) => {
  try {
    const { projectId } = _req.query;
    const result = await taskService.getStats(projectId as string, _req.user?.tenantId || '');
    return res.json(result);
  } catch (error) {
    return next(error);
  }
});

/**
 * GET /api/tasks/:id
 * Get task by ID
 */
router.get('/:id', async (_req: AuthRequest, res: Response, next: any) => {
  try {
    const taskId = Array.isArray(_req.params.id) ? _req.params.id[0] : _req.params.id;
    const result = await taskService.findById(taskId, _req.user?.tenantId || '');
    if (!result) {
      return res.status(404).json({ error: 'Task not found' });
    }
    return res.json(result);
  } catch (error) {
    return next(error);
  }
});

/**
 * POST /api/tasks
 * Create new task
 */
router.post('/', async (_req: AuthRequest, res: Response, next: any) => {
  try {
    const result = await taskService.create(_req.body, _req.user?.id || '', _req.user?.tenantId || '');
    return res.status(201).json(result);
  } catch (error) {
    return next(error);
  }
});

/**
 * PATCH /api/tasks/:id
 * Update task
 */
router.patch('/:id', async (_req: AuthRequest, res: Response, next: any) => {
  try {
    const taskId = Array.isArray(_req.params.id) ? _req.params.id[0] : _req.params.id;
    const result = await taskService.update(taskId, _req.body, _req.user?.id || '', _req.user?.tenantId || '');
    return res.json(result);
  } catch (error) {
    return next(error);
  }
});

/**
 * DELETE /api/tasks/:id
 * Delete task
 */
router.delete('/:id', async (_req: AuthRequest, res: Response, next: any) => {
  try {
    const taskId = Array.isArray(_req.params.id) ? _req.params.id[0] : _req.params.id;
    await taskService.delete(taskId, _req.user?.id || '', _req.user?.tenantId || '');
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
});

// --- Task Dependency Routes ---
const dependencyController = new TaskDependencyController();

/**
 * GET /api/tasks/:id/dependencies
 * Get task dependencies
 */
router.get('/:id/dependencies', async (_req: AuthRequest, res: Response, next: any) => {
  try {
    const result = await dependencyController.findByTaskId(_req, res, next);
    return result;
  } catch (error) {
    return next(error);
  }
});

/**
 * POST /api/tasks/:id/dependencies
 * Create task dependency
 */
router.post('/:id/dependencies', async (_req: AuthRequest, res: Response, next: any) => {
  try {
    const result = await dependencyController.create(_req, res, next);
    return result;
  } catch (error) {
    return next(error);
  }
});

/**
 * DELETE /api/tasks/:id/dependencies/:dependencyId
 * Delete task dependency
 */
router.delete('/:id/dependencies/:dependencyId', async (_req: AuthRequest, res: Response, next: any) => {
  try {
    const result = await dependencyController.delete(_req, res, next);
    return result;
  } catch (error) {
    return next(error);
  }
});

export default router;
