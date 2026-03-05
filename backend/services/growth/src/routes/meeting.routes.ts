import { Router, Response } from 'express';
import { MeetingController, AuthRequest } from '../controllers/meeting.controller';
import { authenticate } from '../middleware/auth';
import { body } from 'express-validator';
import { validateRequest } from '../middleware/validator';

const router = Router();
const controller = new MeetingController();

router.use(authenticate);

/**
 * GET /api/meetings
 * List all meetings
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
 * GET /api/meetings/:id
 * Get meeting by ID
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
 * GET /api/meetings/:id/attendees
 * Get meeting attendees
 */
router.get('/:id/attendees', async (_req: AuthRequest, res: Response, next: any) => {
  try {
    const result = await controller.getAttendees(_req, res, next);
    return result;
  } catch (error) {
    return next(error);
  }
});

/**
 * GET /api/meetings/:id/action-items
 * Get meeting action items
 */
router.get('/:id/action-items', async (_req: AuthRequest, res: Response, next: any) => {
  try {
    const result = await controller.getActionItems(_req, res, next);
    return result;
  } catch (error) {
    return next(error);
  }
});

/**
 * POST /api/meetings
 * Create new meeting
 */
router.post('/', [
  body('title').notEmpty().withMessage('title is required'),
  body('startTime').isISO8601().withMessage('startTime must be a valid date'),
  body('endTime').isISO8601().withMessage('endTime must be a valid date'),
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
 * PATCH /api/meetings/:id
 * Update meeting
 */
router.patch('/:id', [
  body('title').optional().notEmpty().withMessage('title cannot be empty'),
  body('status').optional().isIn(['scheduled', 'completed', 'cancelled']).withMessage('invalid status'),
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
 * DELETE /api/meetings/:id
 * Delete meeting
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
 * POST /api/meetings/:id/attendees
 * Add attendee to meeting
 */
router.post('/:id/attendees', [
  body('userId').notEmpty().withMessage('userId is required'),
  validateRequest
], async (_req: AuthRequest, res: Response, next: any) => {
  try {
    await controller.addAttendee(_req, res, next);
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
});

/**
 * DELETE /api/meetings/:id/attendees
 * Remove attendee from meeting
 */
router.delete('/:id/attendees', [
  body('userId').notEmpty().withMessage('userId is required'),
  validateRequest
], async (_req: AuthRequest, res: Response, next: any) => {
  try {
    await controller.removeAttendee(_req, res, next);
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
});

/**
 * PATCH /api/meetings/:id/attendees/status
 * Update attendee status
 */
router.patch('/:id/attendees/status', [
  body('userId').notEmpty().withMessage('userId is required'),
  body('status').isIn(['pending', 'accepted', 'declined']).withMessage('invalid status'),
  validateRequest
], async (_req: AuthRequest, res: Response, next: any) => {
  try {
    await controller.updateAttendeeStatus(_req, res, next);
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
});

/**
 * POST /api/meetings/:id/action-items
 * Add action item to meeting
 */
router.post('/:id/action-items', [
  body('description').notEmpty().withMessage('description is required'),
  validateRequest
], async (_req: AuthRequest, res: Response, next: any) => {
  try {
    await controller.addActionItem(_req, res, next);
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
});

/**
 * PATCH /api/meetings/action-items/:actionItemId/status
 * Update action item status
 */
router.patch('/action-items/:actionItemId/status', [
  body('status').isIn(['open', 'in-progress', 'completed']).withMessage('invalid status'),
  validateRequest
], async (_req: AuthRequest, res: Response, next: any) => {
  try {
    await controller.updateActionItemStatus(_req, res, next);
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
});

export default router;
