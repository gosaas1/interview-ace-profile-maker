import { Request, Response, NextFunction } from 'express';
import { verifyAuthToken } from '../lib/supabase.js';

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        full_name?: string;
      };
    }
  }
}

export async function authenticateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        error: 'Authentication required',
        code: 'AUTH_REQUIRED'
      });
      return;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token with Supabase
    const { user, error } = await verifyAuthToken(token);

    if (error || !user) {
      res.status(401).json({
        error: 'Invalid or expired token',
        code: 'INVALID_TOKEN'
      });
      return;
    }

    // Add user to request object
    req.user = {
      id: user.id,
      email: user.email || '',
      full_name: user.user_metadata?.full_name
    };

    next();
  } catch (error: any) {
    console.error('Authentication middleware error:', error);
    res.status(500).json({
      error: 'Authentication failed',
      code: 'AUTH_ERROR'
    });
  }
}

// Optional authentication middleware (for routes that can work with or without auth)
export async function optionalAuth(req: Request, _res: Response, next: NextFunction): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // No token provided, continue without user
      next();
      return;
    }

    const token = authHeader.substring(7);
    const { user, error } = await verifyAuthToken(token);

    if (!error && user) {
      req.user = {
        id: user.id,
        email: user.email || '',
        full_name: user.user_metadata?.full_name
      };
    }

    next();
  } catch (error: any) {
    console.error('Optional auth middleware error:', error);
    // Continue without user on error
    next();
  }
}

// Admin authentication middleware (for admin-only routes)
export async function authenticateAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    // First authenticate user
    await authenticateUser(req, res, async (err) => {
      if (err) {
        next(err);
        return;
      }

      // Check if user is admin (you can implement your own admin logic)
      const isAdmin = req.user?.email?.includes('admin') || req.user?.id === 'admin-user-id';
      
      if (!isAdmin) {
        res.status(403).json({
          error: 'Admin access required',
          code: 'ADMIN_REQUIRED'
        });
        return;
      }

      next();
    });
  } catch (error: any) {
    console.error('Admin auth middleware error:', error);
    res.status(500).json({
      error: 'Authentication failed',
      code: 'AUTH_ERROR'
    });
  }
}

// Rate limiting helper
export function createRateLimiter(maxRequests: number, windowMs: number) {
  const requests = new Map<string, { count: number; resetTime: number }>();

  return (req: Request, res: Response, next: NextFunction): void => {
    const ip = req.ip || req.connection.remoteAddress || 'unknown';
    const now = Date.now();

    // Clean up expired entries
    for (const [key, value] of requests.entries()) {
      if (now > value.resetTime) {
        requests.delete(key);
      }
    }

    // Get or create request count for this IP
    const requestData = requests.get(ip) || { count: 0, resetTime: now + windowMs };
    
    if (now > requestData.resetTime) {
      requestData.count = 0;
      requestData.resetTime = now + windowMs;
    }

    requestData.count++;
    requests.set(ip, requestData);

    // Check if limit exceeded
    if (requestData.count > maxRequests) {
      res.status(429).json({
        error: 'Rate limit exceeded',
        code: 'RATE_LIMIT_EXCEEDED',
        retryAfter: Math.ceil((requestData.resetTime - now) / 1000)
      });
      return;
    }

    // Add rate limit headers
    res.set({
      'X-RateLimit-Limit': maxRequests.toString(),
      'X-RateLimit-Remaining': (maxRequests - requestData.count).toString(),
      'X-RateLimit-Reset': new Date(requestData.resetTime).toISOString()
    });

    next();
  };
}

// Default rate limiters
export const rateLimiters = {
  general: createRateLimiter(100, 15 * 60 * 1000), // 100 requests per 15 minutes
  auth: createRateLimiter(5, 15 * 60 * 1000),      // 5 auth attempts per 15 minutes
  upload: createRateLimiter(10, 15 * 60 * 1000),   // 10 uploads per 15 minutes
}; 