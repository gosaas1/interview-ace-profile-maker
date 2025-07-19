import { Router, Request, Response } from 'express';
import { aiProviderManager } from '../lib/ai-provider-manager.js';
import { supabase } from '../lib/supabase.js';

const router = Router();

// Admin middleware (mock implementation - replace with real admin check)
const isAdmin = (req: Request): boolean => {
  // TODO: Implement real admin authentication
  return req.user?.email === 'admin@applyace.com' || req.headers['x-admin-key'] === 'admin-secret';
};

// GET /api/admin/usage - Get all user usage statistics
router.get('/usage', async (req: Request, res: Response): Promise<void> => {
  try {
    if (!isAdmin(req)) {
      res.status(403).json({ error: 'FORBIDDEN', details: 'Admin access required' });
      return;
    }

    // Get all users with their usage stats
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email, full_name, created_at');

    if (usersError) {
      console.error('Error fetching users:', usersError);
      res.status(500).json({ error: 'USERS_FETCH_FAILED', details: usersError.message });
      return;
    }

    // Get usage stats for each user
    const usageStats = [];
    for (const user of users || []) {
      const tier = 'free'; // TODO: Get actual user tier from database
      const stats = await aiProviderManager.getUserStats(user.id, tier);
      
      usageStats.push({
        email: user.email,
        fullName: user.full_name,
        createdAt: user.created_at,
        ...stats
      });
    }

    // Calculate totals
    const totals = usageStats.reduce((acc, stat) => ({
      totalUsers: acc.totalUsers + 1,
      totalParsing: acc.totalParsing + stat.parsingCount,
      totalAICalls: acc.totalAICalls + stat.aiCallCount,
      totalCost: acc.totalCost + stat.totalCost
    }), {
      totalUsers: 0,
      totalParsing: 0,
      totalAICalls: 0,
      totalCost: 0
    });

    res.json({
      success: true,
      usageStats,
      totals,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('❌ Admin usage stats failed:', error);
    res.status(500).json({ 
      error: 'ADMIN_USAGE_FAILED', 
      details: error.message 
    });
  }
});

// GET /api/admin/costs - Get cost analysis
router.get('/costs', async (req: Request, res: Response): Promise<void> => {
  try {
    if (!isAdmin(req)) {
      res.status(403).json({ error: 'FORBIDDEN', details: 'Admin access required' });
      return;
    }

    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email, full_name');

    if (usersError) {
      console.error('Error fetching users:', usersError);
      res.status(500).json({ error: 'USERS_FETCH_FAILED', details: usersError.message });
      return;
    }

    // Calculate costs by tier
    const costByTier: Record<string, { users: number; totalCost: number; avgCost: number }> = {};
    
    for (const user of users || []) {
      const tier = 'free'; // TODO: Get actual user tier
      const stats = await aiProviderManager.getUserStats(user.id, tier);
      
      if (!costByTier[tier]) {
        costByTier[tier] = { users: 0, totalCost: 0, avgCost: 0 };
      }
      
      costByTier[tier].users++;
      costByTier[tier].totalCost += stats.totalCost;
    }

    // Calculate averages
    Object.keys(costByTier).forEach(tier => {
      const tierData = costByTier[tier];
      tierData.avgCost = tierData.users > 0 ? tierData.totalCost / tierData.users : 0;
    });

    // Calculate total system costs
    const totalSystemCost = Object.values(costByTier).reduce((sum, tier) => sum + tier.totalCost, 0);

    res.json({
      success: true,
      costByTier,
      totalSystemCost,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('❌ Admin cost analysis failed:', error);
    res.status(500).json({ 
      error: 'ADMIN_COSTS_FAILED', 
      details: error.message 
    });
  }
});

// GET /api/admin/alerts - Get system alerts
router.get('/alerts', async (req: Request, res: Response): Promise<void> => {
  try {
    if (!isAdmin(req)) {
      res.status(403).json({ error: 'FORBIDDEN', details: 'Admin access required' });
      return;
    }

    const alerts = [];

    // Check for high-cost users
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email, full_name');

    if (!usersError && users) {
      for (const user of users) {
        const tier = 'free'; // TODO: Get actual user tier
        const stats = await aiProviderManager.getUserStats(user.id, tier);
        
        // Alert if user cost exceeds $10
        if (stats.totalCost > 10) {
          alerts.push({
            type: 'HIGH_COST_USER',
            severity: 'warning',
            message: `User ${user.email} has high usage cost: $${stats.totalCost.toFixed(2)}`,
            userId: user.id,
            cost: stats.totalCost,
            timestamp: new Date().toISOString()
          });
        }

        // Alert if user is approaching limits
        const tierConfig = aiProviderManager.getTierConfig(tier);
        if (tierConfig.parsingLimit !== -1 && stats.parsingCount >= tierConfig.parsingLimit * 0.8) {
          alerts.push({
            type: 'PARSING_LIMIT_WARNING',
            severity: 'info',
            message: `User ${user.email} approaching parsing limit: ${stats.parsingCount}/${tierConfig.parsingLimit}`,
            userId: user.id,
            usage: stats.parsingCount,
            limit: tierConfig.parsingLimit,
            timestamp: new Date().toISOString()
          });
        }

        if (tierConfig.aiLimit !== -1 && stats.aiCallCount >= tierConfig.aiLimit * 0.8) {
          alerts.push({
            type: 'AI_LIMIT_WARNING',
            severity: 'info',
            message: `User ${user.email} approaching AI limit: ${stats.aiCallCount}/${tierConfig.aiLimit}`,
            userId: user.id,
            usage: stats.aiCallCount,
            limit: tierConfig.aiLimit,
            timestamp: new Date().toISOString()
          });
        }
      }
    }

    // Check system health
    const totalUsers = users?.length || 0;
    if (totalUsers === 0) {
      alerts.push({
        type: 'NO_USERS',
        severity: 'warning',
        message: 'No users found in system',
        timestamp: new Date().toISOString()
      });
    }

    res.json({
      success: true,
      alerts,
      totalAlerts: alerts.length,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('❌ Admin alerts failed:', error);
    res.status(500).json({ 
      error: 'ADMIN_ALERTS_FAILED', 
      details: error.message 
    });
  }
});

// GET /api/admin/system-health - Get system health status
router.get('/system-health', async (req: Request, res: Response): Promise<void> => {
  try {
    if (!isAdmin(req)) {
      res.status(403).json({ error: 'FORBIDDEN', details: 'Admin access required' });
      return;
    }

    // Check database connection
    const { data: _dbTest, error: dbError } = await supabase
      .from('cvs')
      .select('count')
      .limit(1);

    // Check AI providers
    const aiProviders = {
      openai: !!process.env.OPENAI_API_KEY,
      claude: !!process.env.ANTHROPIC_API_KEY,
      cohere: !!process.env.COHERE_API_KEY,
      aws: !!(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY)
    };

    const healthStatus = {
      database: !dbError ? 'healthy' : 'error',
      aiProviders,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: process.version
    };

    res.json({
      success: true,
      health: healthStatus
    });

  } catch (error: any) {
    console.error('❌ System health check failed:', error);
    res.status(500).json({ 
      error: 'SYSTEM_HEALTH_FAILED', 
      details: error.message 
    });
  }
});

export default router; 