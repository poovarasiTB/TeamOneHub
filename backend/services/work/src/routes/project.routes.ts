import { Router, Response } from 'express';
import { ProjectController, AuthRequest } from '../controllers/project.controller';
import { MilestoneController } from '../controllers/milestone.controller';
import { BoardConfigController } from '../controllers/board-config.controller';
import { authenticate } from '../middleware/auth';
import { body } from 'express-validator';
import { validateRequest } from '../middleware/validator';

const router = Router();
const controller = new ProjectController();

router.use(authenticate);

/**
 * GET /api/projects
 * List all projects with filtering, sorting, pagination
 */
router.get('/', async (_req: AuthRequest, res: Response, next: any) => {
  try {
    const result = await controller.findAll(_req, res, next);
    return result;
  } catch (error) {
    return next(error);
  }
});

/**
 * GET /api/projects/stats
 * Get project statistics and metrics
 */
router.get('/stats', async (_req: AuthRequest, res: Response, next: any) => {
  try {
    const result = await controller.getStats(_req, res, next);
    return result;
  } catch (error) {
    return next(error);
  }
});

/**
 * GET /api/projects/:id
 * Get single project by ID
 */
router.get('/:id', async (_req: AuthRequest, res: Response, next: any) => {
  try {
    const result = await controller.findById(_req, res, next);
    return result;
  } catch (error) {
    return next(error);
  }
});

/**
 * POST /api/projects
 * Create new project
 */
router.post('/', [
  body('name').notEmpty().withMessage('name is required'),
  validateRequest
], async (_req: AuthRequest, res: Response, next: any) => {
  try {
    const result = await controller.create(_req, res, next);
    return result;
  } catch (error) {
    return next(error);
  }
});

/**
 * PATCH /api/projects/:id
 * Update project
 */
router.patch('/:id', [
  body('name').optional().notEmpty().withMessage('name cannot be empty'),
  validateRequest
], async (_req: AuthRequest, res: Response, next: any) => {
  try {
    const result = await controller.update(_req, res, next);
    return result;
  } catch (error) {
    return next(error);
  }
});

/**
 * DELETE /api/projects/:id
 * Delete project
 */
router.delete('/:id', async (_req: AuthRequest, res: Response, next: any) => {
  try {
    const result = await controller.delete(_req, res, next);
    return result;
  } catch (error) {
    return next(error);
  }
});

/**
 * GET /api/projects/:id/timeline
 * Get project timeline
 */
router.get('/:id/timeline', async (_req: AuthRequest, res: Response, next: any) => {
  try {
    const result = await controller.getTimeline(_req, res, next);
    return result;
  } catch (error) {
    return next(error);
  }
});

/**
 * GET /api/projects/:id/members
 * Get project members
 */
router.get('/:id/members', async (_req: AuthRequest, res: Response, next: any) => {
  try {
    const result = await controller.getMembers(_req, res, next);
    return result;
  } catch (error) {
    return next(error);
  }
});

/**
 * POST /api/projects/:id/members
 * Add member to project
 */
router.post('/:id/members', [
  body('memberId').notEmpty().withMessage('memberId is required'),
  body('role').notEmpty().withMessage('role is required'),
  validateRequest
], async (_req: AuthRequest, res: Response, next: any) => {
  try {
    const result = await controller.addMember(_req, res, next);
    return result;
  } catch (error) {
    return next(error);
  }
});

// --- Milestone Routes ---
const milestoneController = new MilestoneController();

/**
 * GET /api/projects/:id/milestones
 * Get project milestones
 */
router.get('/:id/milestones', async (_req: AuthRequest, res: Response, next: any) => {
  try {
    const result = await milestoneController.findByProjectId(_req, res, next);
    return result;
  } catch (error) {
    return next(error);
  }
});

/**
 * POST /api/projects/:id/milestones
 * Create milestone
 */
router.post('/:id/milestones', [
  body('name').notEmpty().withMessage('name is required'),
  body('dueDate').notEmpty().withMessage('dueDate is required'),
  validateRequest
], async (_req: AuthRequest, res: Response, next: any) => {
  try {
    const result = await milestoneController.create(_req, res, next);
    return result;
  } catch (error) {
    return next(error);
  }
});

/**
 * PATCH /api/projects/:id/milestones/:milestoneId
 * Update milestone
 */
router.patch('/:id/milestones/:milestoneId', async (_req: AuthRequest, res: Response, next: any) => {
  try {
    const result = await milestoneController.update(_req, res, next);
    return result;
  } catch (error) {
    return next(error);
  }
});

/**
 * DELETE /api/projects/:id/milestones/:milestoneId
 * Delete milestone
 */
router.delete('/:id/milestones/:milestoneId', async (_req: AuthRequest, res: Response, next: any) => {
  try {
    const result = await milestoneController.delete(_req, res, next);
    return result;
  } catch (error) {
    return next(error);
  }
});

/**
 * GET /api/projects/:id/tasks
 * Get project tasks
 */
router.get('/:id/tasks', async (_req: AuthRequest, res: Response, next: any) => {
  try {
    const result = await controller.getTasks(_req, res, next);
    return result;
  } catch (error) {
    return next(error);
  }
});

// --- Board Config Routes ---
const boardConfigController = new BoardConfigController();

/**
 * GET /api/projects/:id/board
 * Get board configuration
 */
router.get('/:id/board', async (_req: AuthRequest, res: Response, next: any) => {
  try {
    const result = await boardConfigController.findByProjectId(_req, res, next);
    return result;
  } catch (error) {
    return next(error);
  }
});

/**
 * PUT /api/projects/:id/board
 * Upsert board configuration
 */
router.put('/:id/board', async (_req: AuthRequest, res: Response, next: any) => {
  try {
    const result = await boardConfigController.upsert(_req, res, next);
    return result;
  } catch (error) {
    return next(error);
  }
});

/**
 * POST /api/projects/:id/export
 * Export project data
 */
router.post('/:id/export', async (_req: AuthRequest, res: Response, next: any) => {
  try {
    const result = await controller.export(_req, res, next);
    return result;
  } catch (error) {
    return next(error);
  }
});

export default router;
