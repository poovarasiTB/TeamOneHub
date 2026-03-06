import { Response } from 'express';
import { TimesheetService } from '../services/timesheet.service';
import { AuthRequest } from './project.controller';

export class TimesheetController {
    private service: TimesheetService;

    constructor() {
        this.service = new TimesheetService();
    }

    async findByUserAndProject(req: AuthRequest, res: Response, next: any) {
        try {
            const projectId = req.query.projectId as string;
            const result = await this.service.findByUserAndProject(req.user?.id || '', projectId, req.user?.tenantId || '');
            return res.json(result);
        } catch (error) {
            return next(error);
        }
    }

    async create(req: AuthRequest, res: Response, next: any) {
        try {
            const result = await this.service.create(req.body, req.user?.id || '', req.user?.tenantId || '');
            return res.status(201).json(result);
        } catch (error) {
            return next(error);
        }
    }

    async updateStatus(req: AuthRequest, res: Response, next: any) {
        try {
            const timesheetId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            const { status } = req.body;
            const result = await this.service.updateStatus(timesheetId, status, req.user?.id || '', req.user?.tenantId || '');
            return res.json(result);
        } catch (error) {
            return next(error);
        }
    }
}
