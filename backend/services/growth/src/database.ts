import { Pool } from 'pg';

interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  max: number;
  idleTimeoutMillis: number;
  connectionTimeoutMillis: number;
}

class Database {
  private pool: Pool | null = null;
  private config: DatabaseConfig;

  constructor() {
    const databaseUrl = process.env.DATABASE_URL;

    if (databaseUrl) {
      // Parse DATABASE_URL (postgresql://user:password@host:port/database)
      const url = new URL(databaseUrl);
      this.config = {
        host: url.hostname,
        port: parseInt(url.port) || 5432,
        database: url.pathname.slice(1),
        user: url.username,
        password: url.password,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
      };
    } else {
      this.config = {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        database: process.env.DB_NAME || 'teamone_growth',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
      };
    }
  }

  getPool(): Pool {
    if (!this.pool) {
      this.pool = new Pool(this.config);

      this.pool.on('error', (err) => {
        console.error('Unexpected error on idle client', err);
      });
    }

    return this.pool;
  }

  async query(text: string, params?: any[]) {
    const pool = this.getPool();
    return pool.query(text, params);
  }

  async close() {
    if (this.pool) {
      await this.pool.end();
      this.pool = null;
    }
  }
}

export const database = new Database();
export default database;
