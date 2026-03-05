import { describe, it, expect } from '@jest/globals';
import request from 'supertest';
import app from '../src/index';

describe('Support API', () => {
  const authToken = 'Bearer test-token';

  describe('GET /api/tickets', () => {
    it('should return paginated tickets', async () => {
      const response = await request(app)
        .get('/api/tickets')
        .set('Authorization', authToken)
        .query({ page: 1, limit: 10 });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('pagination');
    });

    it('should filter by status', async () => {
      const response = await request(app)
        .get('/api/tickets')
        .set('Authorization', authToken)
        .query({ status: 'open' });

      expect(response.status).toBe(200);
    });
  });

  describe('GET /api/tickets/stats', () => {
    it('should return ticket statistics', async () => {
      const response = await request(app)
        .get('/api/tickets/stats')
        .set('Authorization', authToken);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('total');
      expect(response.body).toHaveProperty('byStatus');
    });
  });
});
