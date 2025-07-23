import { Router, Request, Response } from 'express';
import { authenticateUser } from '../middleware/auth.js';

const router = Router();

const tiers = {
  free: { parsingLimit: 10, aiLimit: 20 },
  career: { parsingLimit: 100, aiLimit: 200 },
  pro: { parsingLimit: 500, aiLimit: 1000 },
  executive: { parsingLimit: 2000, aiLimit: 5000 }
};

// GET /api/tier/info - Return current user's tier and limits
router.get('/info', authenticateUser, async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user;
    if (!user) {
      console.error('Missing user in /tier/info');
      res.status(200).json({ tier: 'free', limits: tiers['free'] });
      return;
    }
    // For now, default to free tier since user_metadata is not available
    let tier: keyof typeof tiers = 'free';
    if (!tiers[tier]) tier = 'free';
    const limits = tiers[tier];
    res.json({ tier, limits });
  } catch (error: any) {
    console.error('❌ Tier info error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

export default router; 