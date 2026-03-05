import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { database } from '../database';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-change-in-production';
const JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';

// We'll use direct SQL queries through a simple database helper
// The database module will be imported from the database service
// Helper for database queries
const queryDatabase = (sql: string, values: any[]) => database.pool.query(sql, values);

/**
 * POST /api/auth/register
 * Register a new user
 */
router.post('/register', async (req, res: Response) => {
  try {
    const { email, password, firstName, lastName, tenantSlug } = req.body;

    // Validate required fields
    if (!email || !password || !firstName || !lastName || !tenantSlug) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Missing required fields: email, password, firstName, lastName, tenantSlug',
      });
    }

    // Find or create tenant
    let tenantId: string;
    const tenantResult = await queryDatabase(
      'SELECT id FROM tenants WHERE slug = $1 AND is_deleted = FALSE',
      [tenantSlug]
    );

    if (tenantResult.rows.length === 0) {
      // Create new tenant
      const newTenant = await queryDatabase(
        `INSERT INTO tenants (name, slug, status) 
         VALUES ($1, $2, 'active') 
         RETURNING id`,
        [firstName + "'s Organization", tenantSlug]
      );
      tenantId = newTenant.rows[0].id;
    } else {
      tenantId = tenantResult.rows[0].id;
    }

    // Check if user already exists
    const existingUser = await queryDatabase(
      'SELECT id FROM users WHERE tenant_id = $1 AND email = $2 AND is_deleted = FALSE',
      [tenantId, email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        error: 'Conflict',
        message: 'User with this email already exists',
      });
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user
    const newUser = await queryDatabase(
      `INSERT INTO users (
        tenant_id, email, password_hash, first_name, last_name, 
        role, status, email_verified, created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id, email, first_name, last_name, role, created_at`,
      [tenantId, email, passwordHash, firstName, lastName, 'user', 'active', false, 'system']
    );

    const user = newUser.rows[0];

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        tenantId,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRY as jwt.SignOptions['expiresIn'] }
    );

    return res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
      },
      token,
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: error.message || 'Failed to register user',
    });
  }
});

/**
 * POST /api/auth/login
 * Login user
 */
router.post('/login', async (req, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Email and password are required',
      });
    }

    // Find user by email
    const userResult = await queryDatabase(
      `SELECT u.id, u.email, u.password_hash, u.first_name, u.last_name, 
              u.role, u.status, u.tenant_id, t.slug as tenant_slug
       FROM users u
       JOIN tenants t ON u.tenant_id = t.id
       WHERE u.email = $1 AND u.is_deleted = FALSE`,
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid email or password',
      });
    }

    const user = userResult.rows[0];

    // Check user status
    if (user.status !== 'active') {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'User account is not active',
      });
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid email or password',
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        tenantId: user.tenant_id,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRY as jwt.SignOptions['expiresIn'] }
    );

    // Update last login
    await queryDatabase(
      'UPDATE users SET last_login_at = NOW() WHERE id = $1',
      [user.id]
    );

    // Create session
    await queryDatabase(
      `INSERT INTO sessions (user_id, token_hash, expires_at)
       VALUES ($1, $2, $3)`,
      [user.id, token, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)]
    );

    return res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        tenant: {
          id: user.tenant_id,
          slug: user.tenant_slug,
        },
      },
      token,
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: error.message || 'Failed to login',
    });
  }
});

/**
 * POST /api/auth/logout
 * Logout user
 */
router.post('/logout', async (req, res: Response) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);

      // Invalidate session (delete from sessions table)
      await queryDatabase(
        'DELETE FROM sessions WHERE token_hash = $1',
        [token]
      );
    }

    res.json({
      message: 'Logout successful',
    });
  } catch (error: any) {
    console.error('Logout error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message || 'Failed to logout',
    });
  }
});

/**
 * POST /api/auth/refresh
 * Refresh JWT token
 */
router.post('/refresh', async (req, res: Response) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Token is required',
      });
    }

    // Verify token
    const decoded: any = jwt.verify(token, JWT_SECRET);

    // Generate new token
    const newToken = jwt.sign(
      {
        userId: decoded.userId,
        email: decoded.email,
        tenantId: decoded.tenantId,
        role: decoded.role,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRY as jwt.SignOptions['expiresIn'] }
    );

    return res.json({
      message: 'Token refreshed successfully',
      token: newToken,
    });
  } catch (error: any) {
    if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid or expired token',
      });
    }

    console.error('Refresh error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: error.message || 'Failed to refresh token',
    });
  }
});

/**
 * GET /api/auth/me
 * Get current user info
 */
router.get('/me', async (req, res: Response) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'No authentication token provided',
      });
    }

    const token = authHeader.substring(7);
    const decoded: any = jwt.verify(token, JWT_SECRET);

    // Get user info
    const userResult = await queryDatabase(
      `SELECT u.id, u.email, u.first_name, u.last_name, u.role, u.avatar_url,
              t.id as tenant_id, t.name as tenant_name, t.slug as tenant_slug
       FROM users u
       JOIN tenants t ON u.tenant_id = t.id
       WHERE u.id = $1 AND u.is_deleted = FALSE`,
      [decoded.userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'User not found',
      });
    }

    const user = userResult.rows[0];

    return res.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        avatarUrl: user.avatar_url,
        tenant: {
          id: user.tenant_id,
          name: user.tenant_name,
          slug: user.tenant_slug,
        },
      },
    });
  } catch (error: any) {
    if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid or expired token',
      });
    }

    console.error('Get user error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: error.message || 'Failed to get user info',
    });
  }
});

export { router as authRoutes };
