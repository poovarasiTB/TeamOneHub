import { Pool } from 'pg';

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/teamone';

export const database = {
  pool: new Pool({
    connectionString: DATABASE_URL,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  }),

  getPool(): Pool {
    return this.pool;
  },

  async close() {
    await this.pool.end();
  },
};
