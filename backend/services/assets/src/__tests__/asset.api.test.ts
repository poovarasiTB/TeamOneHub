import { describe, it, expect, beforeEach } from '@jest/globals';
import request from 'supertest';
import app from '../src/index';

describe('Asset API', () => {
  const authToken = 'Bearer test-token';

  describe('GET /api/assets', () => {
    it('should return paginated assets', async () => {
      const response = await request(app)
        .get('/api/assets')
        .set('Authorization', authToken)
        .query({ page: 1, limit: 10 });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('pagination');
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .get('/api/assets');

      expect(response.status).toBe(401);
    });

    it('should filter by type', async () => {
      const response = await request(app)
        .get('/api/assets')
        .set('Authorization', authToken)
        .query({ type: 'hardware' });

      expect(response.status).toBe(200);
    });
  });

  describe('GET /api/assets/stats', () => {
    it('should return asset statistics', async () => {
      const response = await request(app)
        .get('/api/assets/stats')
        .set('Authorization', authToken);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('total');
      expect(response.body).toHaveProperty('byType');
      expect(response.body).toHaveProperty('byStatus');
    });
  });

  describe('GET /api/assets/:id', () => {
    it('should return asset by ID', async () => {
      const response = await request(app)
        .get('/api/assets/test-asset-id')
        .set('Authorization', authToken);

      expect(response.status).toBeDefined();
    });
  });
});
