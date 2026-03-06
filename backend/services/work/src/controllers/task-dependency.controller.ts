import { Response } from 'express';
import { TaskDependencyService } from '../services/task-dependency.service';
import { AuthRequest } from './project.controller';

export class TaskDependencyController {
    private service: TaskDependencyService;

    constructor() {
        this.service = new TaskDependencyService();
    }

    async findByTaskId(req: AuthRequest, res: Response, next: any) {
        try {
            const taskId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            const result = await this.service.findByTaskId(taskId, req.user?.tenantId || '');
            return res.json(result);
        } catch (error) {
            return next(error);
        }
    }

    async create(req: AuthRequest, res: Response, next: any) {
        try {
            const taskId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            const result = await this.service.create(taskId, req.body, req.user?.tenantId || '');
            return res.status(201).json(result);
        } catch (error: any) {
            if (error.message.includes('unique') || error.message.includes('duplicate')) {
                return res.status(400).json({ error: 'Dependency already exists' });
            }
            return next(error);
        }
    }

    async delete(req: AuthRequest, res: Response, next: any) {
        try {
            const taskId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            const flexId = req.params.dependencyId;
            await this.service.delete(flexId, taskId, req.user?.tenantId || '');
            return res.status(204).send();
        } catch (error) {
            return next(error);
        }
    }
}
