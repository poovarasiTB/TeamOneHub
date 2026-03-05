import { Request, Response } from 'express';
import { MeetingService } from '../services/meeting.service';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    tenantId: string;
    roles: string[];
  };
}

export class MeetingController {
  private service: MeetingService;

  constructor() {
    this.service = new MeetingService();
  }

  async findAll(req: AuthRequest, res: Response, next: any) {
    try {
      const result = await this.service.findAll({
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || 20,
        meetingType: req.query.meetingType as string,
        status: req.query.status as string,
        startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
        endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined,
        sort: (req.query.sort as string) || 'start_time',
        order: (req.query.order as 'ASC' | 'DESC') || 'ASC',
        tenantId: req.user?.tenantId || '',
      });
      return res.json(result);
    } catch (error) {
      return next(error);
    }
  }

  async findById(req: AuthRequest, res: Response, next: any) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const result = await this.service.findById(id, req.user?.tenantId || '');
      if (!result) {
        return res.status(404).json({ error: 'Meeting not found' });
      }
      return res.json(result);
    } catch (error) {
      return next(error);
    }
  }

  async create(req: AuthRequest, res: Response, next: any) {
    try {
      const result = await this.service.create(
        req.body,
        req.user?.id || '',
        req.user?.tenantId || ''
      );
      return res.status(201).json(result);
    } catch (error: any) {
      return next(error);
    }
  }

  async update(req: AuthRequest, res: Response, next: any) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const result = await this.service.update(
        id,
        req.body,
        req.user?.id || '',
        req.user?.tenantId || ''
      );
      if (!result) {
        return res.status(404).json({ error: 'Meeting not found' });
      }
      return res.json(result);
    } catch (error) {
      return next(error);
    }
  }

  async delete(req: AuthRequest, res: Response, next: any) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      await this.service.delete(id, req.user?.id || '', req.user?.tenantId || '');
      return res.status(204).send();
    } catch (error) {
      return next(error);
    }
  }

  async addAttendee(req: AuthRequest, res: Response, next: any) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const { userId } = req.body;
      await this.service.addAttendee(id, userId, req.user?.tenantId || '');
      return res.status(204).send();
    } catch (error) {
      return next(error);
    }
  }

  async removeAttendee(req: AuthRequest, res: Response, next: any) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const { userId } = req.body;
      await this.service.removeAttendee(id, userId, req.user?.tenantId || '');
      return res.status(204).send();
    } catch (error) {
      return next(error);
    }
  }

  async updateAttendeeStatus(req: AuthRequest, res: Response, next: any) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const { userId, status } = req.body;
      await this.service.updateAttendeeStatus(id, userId, status);
      return res.status(204).send();
    } catch (error) {
      return next(error);
    }
  }

  async getAttendees(req: AuthRequest, res: Response, next: any) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const result = await this.service.getAttendees(id);
      return res.json(result);
    } catch (error) {
      return next(error);
    }
  }

  async getActionItems(req: AuthRequest, res: Response, next: any) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const result = await this.service.getActionItems(id);
      return res.json(result);
    } catch (error) {
      return next(error);
    }
  }

  async addActionItem(req: AuthRequest, res: Response, next: any) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const { description, assigneeId, dueDate } = req.body;
      await this.service.addActionItem(id, description, assigneeId, dueDate, req.user?.id || '');
      return res.status(204).send();
    } catch (error) {
      return next(error);
    }
  }

  async updateActionItemStatus(req: AuthRequest, res: Response, next: any) {
    try {
      const actionItemId = Array.isArray(req.params.actionItemId) ? req.params.actionItemId[0] : req.params.actionItemId;
      const { status } = req.body;
      await this.service.updateActionItemStatus(actionItemId, status);
      return res.status(204).send();
    } catch (error) {
      return next(error);
    }
  }
}
