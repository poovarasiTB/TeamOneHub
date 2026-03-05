import { Request, Response } from 'express';
import { KnowledgeBaseService } from '../services/knowledge-base.service';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    tenantId: string;
    roles: string[];
  };
}

export class KnowledgeBaseController {
  private service: KnowledgeBaseService;

  constructor() {
    this.service = new KnowledgeBaseService();
  }

  async findAll(req: AuthRequest, res: Response, next: any) {
    try {
      const result = await this.service.findAll({
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || 20,
        status: req.query.status as string,
        categoryId: req.query.categoryId as string,
        search: req.query.search as string,
        tags: req.query.tags ? (req.query.tags as string).split(',') : undefined,
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
        return res.status(404).json({ error: 'Article not found' });
      }
      
      // Increment views
      await this.service.incrementViews(id, req.user?.tenantId || '');
      
      return res.json(result);
    } catch (error) {
      return next(error);
    }
  }

  async findBySlug(req: AuthRequest, res: Response, next: any) {
    try {
      const slug = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;
      const result = await this.service.findBySlug(slug, req.user?.tenantId || '');
      if (!result) {
        return res.status(404).json({ error: 'Article not found' });
      }
      
      // Increment views
      await this.service.incrementViews(result.id, req.user?.tenantId || '');
      
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
        return res.status(404).json({ error: 'Article not found' });
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

  async getCategories(req: AuthRequest, res: Response, next: any) {
    try {
      const result = await this.service.getCategories(req.user?.tenantId || '');
      return res.json(result);
    } catch (error) {
      return next(error);
    }
  }

  async addFeedback(req: AuthRequest, res: Response, next: any) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const { rating, comment } = req.body;
      await this.service.addFeedback(id, req.user?.id || '', rating, comment);
      return res.status(204).send();
    } catch (error) {
      return next(error);
    }
  }
}
