import { Response } from 'express';
import { BoardConfigService } from '../services/board-config.service';
import { AuthRequest } from './project.controller';

export class BoardConfigController {
    private service: BoardConfigService;

    constructor() {
        this.service = new BoardConfigService();
    }

    async findByProjectId(req: AuthRequest, res: Response, next: any) {
        try {
            const projectId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            const result = await this.service.findByProjectId(projectId, req.user?.tenantId || '');

            if (!result) {
                // Return default configuration if not found
                return res.json({
                    projectId,
                    tenantId: req.user?.tenantId,
                    columns: [
                        { id: 'todo', name: 'To Do', order: 1 },
                        { id: 'in-progress', name: 'In Progress', order: 2 },
                        { id: 'review', name: 'Review', order: 3 },
                        { id: 'done', name: 'Done', order: 4 }
                    ],
                    wipLimits: {},
                    enabledFeatures: ['sprints', 'epics']
                });
            }
            return res.json(result);
        } catch (error) {
            return next(error);
        }
    }

    async upsert(req: AuthRequest, res: Response, next: any) {
        try {
            const projectId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            const result = await this.service.upsert(projectId, req.body, req.user?.tenantId || '');
            return res.json(result);
        } catch (error) {
            return next(error);
        }
    }
}
