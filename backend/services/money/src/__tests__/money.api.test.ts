import { describe, it, expect } from '@jest/globals';
import request from 'supertest';
import app from '../src/index';

describe('Money API', () => {
  const authToken = 'Bearer test-token';

  describe('GET /api/invoices', () => {
    it('should return paginated invoices', async () => {
      const response = await request(app)
        .get('/api/invoices')
        .set('Authorization', authToken)
        .query({ page: 1, limit: 10 });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('pagination');
    });

    it('should filter by status', async () => {
      const response = await request(app)
        .get('/api/invoices')
        .set('Authorization', authToken)
        .query({ status: 'paid' });

      expect(response.status).toBe(200);
    });
  });

  describe('GET /api/invoices/stats', () => {
    it('should return invoice statistics', async () => {
      const response = await request(app)
        .get('/api/invoices/stats')
        .set('Authorization', authToken);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('total');
      expect(response.body).toHaveProperty('byStatus');
    });
  });

  describe('GET /api/customers', () => {
    it('should return paginated customers', async () => {
      const response = await request(app)
        .get('/api/customers')
        .set('Authorization', authToken)
        .query({ page: 1, limit: 10 });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
    });
  });
});
