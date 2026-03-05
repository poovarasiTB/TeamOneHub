import { describe, it, expect, beforeEach } from '@jest/globals';
import { LicenseService } from '../src/services/license.service';

describe('LicenseService', () => {
  let service: LicenseService;

  beforeEach(() => {
    service = new LicenseService();
  });

  describe('findAll', () => {
    it('should return paginated licenses', async () => {
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
        status: 'active',
        tenantId: 'test-tenant-id',
      };

      const result = await service.findAll(filters);
      expect(result.data).toBeDefined();
    });
  });

  describe('getCompliance', () => {
    it('should return license compliance status', async () => {
      const compliance = await service.getCompliance('test-tenant-id');

      expect(compliance).toHaveProperty('compliant');
      expect(compliance).toHaveProperty('overallocated');
      expect(compliance).toHaveProperty('expiring-soon');
      expect(compliance).toHaveProperty('expired');
    });
  });
});
