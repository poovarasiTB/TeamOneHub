import { describe, it, expect } from '@jest/globals';
import request from 'supertest';
import app from '../src/index';

describe('Growth API', () => {
  const authToken = 'Bearer test-token';

  describe('GET /api/wiki/articles', () => {
    it('should return paginated articles', async () => {
      const response = await request(app)
        .get('/api/wiki/articles')
        .set('Authorization', authToken)
        .query({ page: 1, limit: 10 });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('pagination');
    });
  });

  describe('GET /api/wiki/categories', () => {
    it('should return wiki categories', async () => {
      const response = await request(app)
        .get('/api/wiki/categories')
        .set('Authorization', authToken);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });
});
