import { Pool } from 'pg';

let pool: Pool | null = null;

export const database = {
  getPool: (): Pool => {
    if (!pool) {
      const connectionString = process.env.DATABASE_URL || 
        'postgresql://postgres:postgres@localhost:5432/teamone_work';
      
      pool = new Pool({
        connectionString,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
      });

      pool.on('error', (err) => {
        console.error('Unexpected database error:', err);
        process.exit(-1);
      });
    }
    return pool;
  },

  close: async (): Promise<void> => {
    if (pool) {
      await pool.end();
      pool = null;
    }
  },
};
