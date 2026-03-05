import { describe, it, expect, beforeEach, vi } from '@jest/globals';
import { ProjectService } from '../src/services/project.service';
import { database } from '../src/database';

describe('ProjectService', () => {
  let service: ProjectService;

  beforeEach(() => {
    service = new ProjectService();
  });

  describe('findAll', () => {
    it('should return paginated projects', async () => {
      const filters = {
        page: 1,
        limit: 10,
        sort: 'createdAt',
        order: 'DESC' as const,
        tenantId: 'test-tenant-id',
      };

      const result = await service.findAll(filters);

      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('pagination');
      expect(result.pagination).toHaveProperty('page');
      expect(result.pagination).toHaveProperty('limit');
      expect(result.pagination).toHaveProperty('total');
    });
  });

  describe('getStats', () => {
    it('should return project statistics', async () => {
      const stats = await service.getStats('test-tenant-id');

      expect(stats).toHaveProperty('total');
      expect(stats).toHaveProperty('byStatus');
      expect(stats).toHaveProperty('totalBudget');
    });
  });
});
