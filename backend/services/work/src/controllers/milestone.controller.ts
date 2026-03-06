import { Response } from 'express';
import { MilestoneService } from '../services/milestone.service';
import { AuthRequest } from './project.controller';

export class MilestoneController {
    private service: MilestoneService;

    constructor() {
        this.service = new MilestoneService();
    }

    async findByProjectId(req: AuthRequest, res: Response, next: any) {
        try {
            const projectId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            const result = await this.service.findByProjectId(projectId, req.user?.tenantId || '');
            return res.json(result);
        } catch (error) {
            return next(error);
        }
    }

    async create(req: AuthRequest, res: Response, next: any) {
        try {
            const projectId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            const result = await this.service.create(projectId, req.body, req.user?.id || '', req.user?.tenantId || '');
            return res.status(201).json(result);
        } catch (error) {
            return next(error);
        }
    }

    async update(req: AuthRequest, res: Response, next: any) {
        try {
            const projectId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            const milestoneId = req.params.milestoneId;
            const result = await this.service.update(milestoneId, projectId, req.body, req.user?.id || '', req.user?.tenantId || '');
            return res.json(result);
        } catch (error) {
            return next(error);
        }
    }

    async delete(req: AuthRequest, res: Response, next: any) {
        try {
            const projectId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            const milestoneId = req.params.milestoneId;
            await this.service.delete(milestoneId, projectId, req.user?.tenantId || '');
            return res.status(204).send();
        } catch (error) {
            return next(error);
        }
    }
}
