import { Router, Request, Response } from 'express';
import { supabase } from '../lib/supabase.js';
import { authenticateUser } from '../middleware/auth.js';

const router = Router();

// Tier configuration
const tierConfig = {
  free: {
    name: 'Free',
    limits: {
      cvs: 1,
      parsing: 1,
      aiCalls: 1,
      interviews: 0
    },
    features: ['Basic CV Analysis', 'Single Template']
  },
  starter: {
    name: 'Starter',
    limits: {
      cvs: 3,
      parsing: 5,
      aiCalls: 10,
      interviews: 1
    },
    features: ['CV Analysis', '3 Templates', 'Basic Interview Prep']
  },
  professional: {
    name: 'Professional',
    limits: {
      cvs: -1, // unlimited
      parsing: 20,
      aiCalls: 50,
      interviews: 5
    },
    features: ['Advanced CV Analysis', 'All Templates', 'Interview Coaching']
  },
  'career-pro': {
    name: 'Career Pro',
    limits: {
      cvs: -1,
      parsing: 50,
      aiCalls: 100,
      interviews: 10
    },
    features: ['Premium CV Analysis', 'All Templates', 'Advanced Interview Coaching', 'Priority Support']
  },
  elite: {
    name: 'Elite Executive',
    limits: {
      cvs: -1,
      parsing: -1,
      aiCalls: -1,
      interviews: -1
    },
    features: ['Unlimited Everything', '1-on-1 Career Coaching', 'Executive Templates', 'Priority Support']
  }
};

// GET /api/tier/info - Get user's tier information and limits
router.get('/info', authenticateUser, async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;

    // Get user's tier from profiles
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('tier, subscription_status')
      .eq('id', userId)
      .single();

    if (profileError) {
      console.error('Error fetching user tier:', profileError);
      res.status(500).json({
        error: 'Failed to fetch user tier',
        details: profileError.message
      });
      return;
    }

    const userTier = profile?.tier || 'free';
    const subscriptionStatus = profile?.subscription_status || 'inactive';

    // Get current usage
    const { data: usage, error: usageError } = await supabase
      .from('usage_history')
      .select('cv_count, parsing_count, ai_calls_count, interview_count')
      .eq('user_id', userId)
      .single();

    if (usageError) {
      console.error('Error fetching usage:', usageError);
      res.status(500).json({
        error: 'Failed to fetch usage',
        details: usageError.message
      });
      return;
    }

    // Get tier configuration
    const config = tierConfig[userTier as keyof typeof tierConfig];
    if (!config) {
      res.status(500).json({
        error: 'Invalid tier configuration',
        details: `Tier ${userTier} not found`
      });
      return;
    }

    // Calculate remaining limits
    const currentUsage = usage || {
      cv_count: 0,
      parsing_count: 0,
      ai_calls_count: 0,
      interview_count: 0
    };

    const remaining = {
      cvs: config.limits.cvs === -1 ? -1 : Math.max(0, config.limits.cvs - currentUsage.cv_count),
      parsing: config.limits.parsing === -1 ? -1 : Math.max(0, config.limits.parsing - currentUsage.parsing_count),
      aiCalls: config.limits.aiCalls === -1 ? -1 : Math.max(0, config.limits.aiCalls - currentUsage.ai_calls_count),
      interviews: config.limits.interviews === -1 ? -1 : Math.max(0, config.limits.interviews - currentUsage.interview_count)
    };

    res.status(200).json({
      tier: userTier,
      name: config.name,
      subscription_status: subscriptionStatus,
      limits: config.limits,
      features: config.features,
      current_usage: currentUsage,
      remaining,
      unlimited: {
        cvs: config.limits.cvs === -1,
        parsing: config.limits.parsing === -1,
        aiCalls: config.limits.aiCalls === -1,
        interviews: config.limits.interviews === -1
      }
    });

  } catch (error: any) {
    console.error('Tier info error:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
});

export default router; 