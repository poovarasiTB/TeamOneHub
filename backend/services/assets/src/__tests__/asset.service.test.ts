import { describe, it, expect, beforeEach, vi } from '@jest/globals';
import { AssetService } from '../src/services/asset.service';

describe('AssetService', () => {
  let service: AssetService;

  beforeEach(() => {
    service = new AssetService();
  });

  describe('findAll', () => {
    it('should return paginated assets', async () => {
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

    it('should filter by type', async () => {
      const filters = {
        page: 1,
        limit: 10,
        type: 'hardware',
        tenantId: 'test-tenant-id',
      };

      const result = await service.findAll(filters);

      expect(result.data).toBeDefined();
    });

    it('should filter by status', async () => {
      const filters = {
        page: 1,
        limit: 10,
        status: 'active',
        tenantId: 'test-tenant-id',
      };

      const result = await service.findAll(filters);
      expect(result.data).toBeDefined();
    });
  });

  describe('getStats', () => {
    it('should return asset statistics', async () => {
      const stats = await service.getStats('test-tenant-id');

      expect(stats).toHaveProperty('total');
      expect(stats).toHaveProperty('byType');
      expect(stats).toHaveProperty('byStatus');
      expect(stats).toHaveProperty('totalValue');
    });
  });

  describe('getHistory', () => {
    it('should return asset maintenance history', async () => {
      const history = await service.getHistory('test-asset-id', 'test-tenant-id');

      expect(history).toBeDefined();
      expect(Array.isArray(history)).toBe(true);
    });
  });
});
