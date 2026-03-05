import { describe, it, expect, beforeEach } from '@jest/globals';
import request from 'supertest';
import app from '../src/index';

describe('Project API', () => {
  const authToken = 'Bearer test-token';

  describe('GET /api/projects', () => {
    it('should return paginated projects', async () => {
      const response = await request(app)
        .get('/api/projects')
        .set('Authorization', authToken)
        .query({ page: 1, limit: 10 });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('pagination');
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .get('/api/projects');

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/projects/stats', () => {
    it('should return project statistics', async () => {
      const response = await request(app)
        .get('/api/projects/stats')
        .set('Authorization', authToken);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('total');
      expect(response.body).toHaveProperty('byStatus');
    });
  });
});
