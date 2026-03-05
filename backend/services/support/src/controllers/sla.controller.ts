import { Request, Response } from 'express';
import { SLAService } from '../services/sla.service';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    tenantId: string;
    roles: string[];
  };
}

export class SLAController {
  private service: SLAService;

  constructor() {
    this.service = new SLAService();
  }

  async findAll(req: AuthRequest, res: Response, next: any) {
    try {
      const result = await this.service.findAll({
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || 20,
        ticketType: req.query.ticketType as string,
        priority: req.query.priority as string,
        isActive: req.query.isActive === 'true' ? true : req.query.isActive === 'false' ? false : undefined,
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
        return res.status(404).json({ error: 'SLA policy not found' });
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
        return res.status(404).json({ error: 'SLA policy not found' });
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

  async getActiveSLA(req: AuthRequest, res: Response, next: any) {
    try {
      const result = await this.service.getActiveSLA(
        req.user?.tenantId || '',
        req.query.ticketType as string,
        req.query.priority as string
      );
      if (!result) {
        return res.status(404).json({ error: 'No active SLA policy found' });
      }
      return res.json(result);
    } catch (error) {
      return next(error);
    }
  }

  async calculateDueDate(req: AuthRequest, res: Response, next: any) {
    try {
      const { slaId, createdAt } = req.body;
      const result = await this.service.calculateDueDate(slaId, new Date(createdAt));
      if (!result) {
        return res.status(400).json({ error: 'Invalid SLA or missing response/resolution time' });
      }
      return res.json(result);
    } catch (error) {
      return next(error);
    }
  }
}
