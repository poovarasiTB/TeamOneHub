import { Request, Response } from 'express';
import { WhiteboardService } from '../services/whiteboard.service';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    tenantId: string;
    roles: string[];
  };
}

export class WhiteboardController {
  private service: WhiteboardService;

  constructor() {
    this.service = new WhiteboardService();
  }

  async findAll(req: AuthRequest, res: Response, next: any) {
    try {
      const result = await this.service.findAll({
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || 20,
        projectId: req.query.projectId as string,
        search: req.query.search as string,
        sort: (req.query.sort as string) || 'created_at',
        order: (req.query.order as 'ASC' | 'DESC') || 'DESC',
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
        return res.status(404).json({ error: 'Whiteboard not found' });
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
        return res.status(404).json({ error: 'Whiteboard not found' });
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

  async getContent(req: AuthRequest, res: Response, next: any) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const result = await this.service.getContent(id, req.user?.tenantId || '');
      return res.json(result);
    } catch (error) {
      return next(error);
    }
  }

  async updateContent(req: AuthRequest, res: Response, next: any) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const result = await this.service.updateContent(
        id,
        req.body.content,
        req.user?.id || '',
        req.user?.tenantId || ''
      );
      if (!result) {
        return res.status(404).json({ error: 'Whiteboard not found' });
      }
      return res.json(result);
    } catch (error) {
      return next(error);
    }
  }

  async addCollaborator(req: AuthRequest, res: Response, next: any) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const { userId } = req.body;
      const result = await this.service.addCollaborator(
        id,
        userId,
        req.user?.id || '',
        req.user?.tenantId || ''
      );
      if (!result) {
        return res.status(404).json({ error: 'Whiteboard not found' });
      }
      return res.json(result);
    } catch (error) {
      return next(error);
    }
  }

  async removeCollaborator(req: AuthRequest, res: Response, next: any) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const { userId } = req.body;
      const result = await this.service.removeCollaborator(
        id,
        userId,
        req.user?.id || '',
        req.user?.tenantId || ''
      );
      if (!result) {
        return res.status(404).json({ error: 'Whiteboard not found' });
      }
      return res.json(result);
    } catch (error) {
      return next(error);
    }
  }
}
