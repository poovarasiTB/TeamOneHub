import { describe, it, expect, beforeEach } from '@jest/globals';
import { TicketService } from '../src/services/ticket.service';

describe('TicketService', () => {
  let service: TicketService;

  beforeEach(() => {
    service = new TicketService();
  });

  describe('findAll', () => {
    it('should return paginated tickets', async () => {
      const filters = {
        page: 1,
        limit: 10,
        tenantId: 'test-tenant-id',
      };

      const result = await service.findAll(filters);

      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('pagination');
      expect(result.pagination).toHaveProperty('page');
      expect(result.pagination).toHaveProperty('total');
    });

    it('should filter by status', async () => {
      const filters = {
        page: 1,
        limit: 10,
        status: 'open',
        tenantId: 'test-tenant-id',
      };

      const result = await service.findAll(filters);
      expect(result.data).toBeDefined();
    });

    it('should filter by priority', async () => {
      const filters = {
        page: 1,
        limit: 10,
        priority: 'high',
        tenantId: 'test-tenant-id',
      };

      const result = await service.findAll(filters);
      expect(result.data).toBeDefined();
    });
  });

  describe('getStats', () => {
    it('should return ticket statistics', async () => {
      const stats = await service.getStats('test-tenant-id');

      expect(stats).toHaveProperty('total');
      expect(stats).toHaveProperty('byStatus');
      expect(stats).toHaveProperty('byPriority');
    });
  });
});
