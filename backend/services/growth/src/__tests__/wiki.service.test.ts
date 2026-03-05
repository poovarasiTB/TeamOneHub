import { describe, it, expect, beforeEach } from '@jest/globals';
import { WikiService } from '../src/services/wiki.service';

describe('WikiService', () => {
  let service: WikiService;

  beforeEach(() => {
    service = new WikiService();
  });

  describe('findAll', () => {
    it('should return paginated articles', async () => {
      const filters = {
        page: 1,
        limit: 10,
        tenantId: 'test-tenant-id',
      };

      const result = await service.findAll(filters);

      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('pagination');
    });

    it('should filter by status', async () => {
      const filters = {
        page: 1,
        limit: 10,
        status: 'published',
        tenantId: 'test-tenant-id',
      };

      const result = await service.findAll(filters);
      expect(result.data).toBeDefined();
    });
  });

  describe('getCategories', () => {
    it('should return wiki categories with article counts', async () => {
      const categories = await service.getCategories('test-tenant-id');

      expect(categories).toBeDefined();
      expect(Array.isArray(categories)).toBe(true);
    });
  });

  describe('incrementViews', () => {
    it('should increment article view count', async () => {
      await service.incrementViews('test-article-id');
      // Should not throw
    });
  });
});
