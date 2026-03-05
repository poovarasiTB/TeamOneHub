import { Request, Response } from 'express';
import { AccountService } from '../services/account.service';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    tenantId: string;
    roles: string[];
  };
}

export class AccountController {
  private service: AccountService;

  constructor() {
    this.service = new AccountService();
  }

  async findAll(req: AuthRequest, res: Response, next: any) {
    try {
      const result = await this.service.findAll({
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || 20,
        type: req.query.type as string,
        parentId: req.query.parentId as string,
        search: req.query.search as string,
        isActive: req.query.isActive === 'true' ? true : req.query.isActive === 'false' ? false : undefined,
        sort: (req.query.sort as string) || 'code',
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
        return res.status(404).json({ error: 'Account not found' });
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
        return res.status(404).json({ error: 'Account not found' });
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

  async getTree(req: AuthRequest, res: Response, next: any) {
    try {
      const result = await this.service.getTree(req.user?.tenantId || '');
      return res.json(result);
    } catch (error) {
      return next(error);
    }
  }

  async getBalance(req: AuthRequest, res: Response, next: any) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const result = await this.service.getBalance(id, req.user?.tenantId || '');
      return res.json({ balance: result });
    } catch (error) {
      return next(error);
    }
  }
}
