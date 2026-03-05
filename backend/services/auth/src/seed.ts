import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

console.log('DATABASE_URL:', process.env.DATABASE_URL);
const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/teamone',
});

async function seed() {
    const client = await pool.connect();
    try {
        console.log('Starting seed...');

        // 1. Create Tenant
        const tenantId = uuidv4();
        const tenantName = 'TeamOne';
        const tenantSlug = 'teamone';

        await client.query(
            `INSERT INTO tenants (id, name, slug, status) 
       VALUES ($1, $2, $3, 'active') 
       ON CONFLICT (slug) DO NOTHING`,
            [tenantId, tenantName, tenantSlug]
        );

        // Get the tenant ID if it already existed
        const tenantResult = await client.query('SELECT id FROM tenants WHERE slug = $1', [tenantSlug]);
        const actualTenantId = tenantResult.rows[0].id;

        // 2. Create User
        const email = 'admin@teamone.local';
        const password = 'Admin123!';
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);
        const userId = uuidv4();

        await client.query(
            `INSERT INTO users (
        id, tenant_id, email, password_hash, first_name, last_name, 
        role, status, email_verified, created_by, updated_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      ON CONFLICT (tenant_id, email) DO NOTHING`,
            [
                userId, actualTenantId, email, passwordHash, 'Admin', 'User',
                'super_admin', 'active', true, uuidv4(), uuidv4()
            ]
        );

        console.log('Seed completed successfully!');
        console.log('Demo Tenant:', tenantSlug);
        console.log('Demo User:', email);
        console.log('Demo Password:', password);

    } catch (error) {
        console.error('Seed error:', error);
    } finally {
        client.release();
        await pool.end();
    }
}

seed();
