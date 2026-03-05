import { Request, Response } from 'express';
import { IdeaService } from '../services/idea.service';

export interface AuthRequest extends Request {
  user?: { id: string; email: string; tenantId: string; roles: string[] };
}

export class IdeaController {
  private service: IdeaService;
  constructor() { this.service = new IdeaService(); }

  async findAll(req: AuthRequest, res: Response, next: any) {
    try {
      const result = await this.service.findAll({
        page: Number(req.query.page) || 1, limit: Number(req.query.limit) || 20,
        status: req.query.status as string, category: req.query.category as string,
        search: req.query.search as string, sort: req.query.sort as string,
        order: (req.query.order as 'ASC' | 'DESC') || 'DESC', tenantId: req.user?.tenantId || '',
      });
      return res.json(result);
    } catch (error) { return next(error); }
  }

  async findById(req: AuthRequest, res: Response, next: any) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const result = await this.service.findById(id, req.user?.tenantId || '');
      if (!result) return res.status(404).json({ error: 'Idea not found' });
      return res.json(result);
    } catch (error) { return next(error); }
  }

  async create(req: AuthRequest, res: Response, next: any) {
    try {
      const result = await this.service.create(req.body, req.user?.id || '', req.user?.tenantId || '');
      return res.status(201).json(result);
    } catch (error: any) { return next(error); }
  }

  async update(req: AuthRequest, res: Response, next: any) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const result = await this.service.update(id, req.body, req.user?.id || '', req.user?.tenantId || '');
      if (!result) return res.status(404).json({ error: 'Idea not found' });
      return res.json(result);
    } catch (error) { return next(error); }
  }

  async delete(req: AuthRequest, res: Response, next: any) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      await this.service.delete(id, req.user?.id || '', req.user?.tenantId || '');
      return res.status(204).send();
    } catch (error) { return next(error); }
  }

  async upvote(req: AuthRequest, res: Response, next: any) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const result = await this.service.vote(id, req.user?.id || '', 'up', req.user?.tenantId || '');
      if (!result) return res.status(404).json({ error: 'Idea not found' });
      return res.json(result);
    } catch (error) { return next(error); }
  }

  async downvote(req: AuthRequest, res: Response, next: any) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const result = await this.service.vote(id, req.user?.id || '', 'down', req.user?.tenantId || '');
      if (!result) return res.status(404).json({ error: 'Idea not found' });
      return res.json(result);
    } catch (error) { return next(error); }
  }

  async removeVote(req: AuthRequest, res: Response, next: any) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const result = await this.service.removeVote(id, req.user?.id || '', req.user?.tenantId || '');
      if (!result) return res.status(404).json({ error: 'Idea not found' });
      return res.json(result);
    } catch (error) { return next(error); }
  }
}
