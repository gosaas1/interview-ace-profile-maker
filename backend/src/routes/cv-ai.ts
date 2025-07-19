import { Router, Request, Response } from 'express';
import { aiProviderManager } from '../lib/ai-provider-manager.js';
import { supabase } from '../lib/supabase.js';

const router = Router();

// Middleware to get user tier (mock implementation - replace with real user tier lookup)
const getUserTier = (req: Request): string => {
  // TODO: Get actual user tier from database
  return (req.user as any)?.tier || 'free';
};

// POST /api/cv/analyze - AI CV Analysis
router.post('/analyze', async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('🔍 CV AI ANALYSIS: User authenticated:', req.user);

    const { cvId, jobDescription } = req.body;
    const userId = req.user?.id;
    const tier = getUserTier(req);

    if (!userId) {
      res.status(401).json({ error: 'UNAUTHORIZED', details: 'User not authenticated' });
      return;
    }

    if (!cvId) {
      res.status(400).json({ error: 'MISSING_CV_ID', details: 'CV ID is required' });
      return;
    }

    // Check AI usage limits
    const aiCheck = await aiProviderManager.canUseAI(userId, tier);
    if (!aiCheck.allowed) {
      res.status(429).json({ 
        error: 'AI_LIMIT_EXCEEDED', 
        details: aiCheck.reason,
        tier,
        limit: aiProviderManager.getTierConfig(tier).aiLimit
      });
      return;
    }

    // Get CV content from database
    const { data: cv, error: cvError } = await supabase
      .from('cvs')
      .select('content, title')
      .eq('id', cvId)
      .eq('user_id', userId)
      .single();

    if (cvError || !cv) {
      res.status(404).json({ error: 'CV_NOT_FOUND', details: 'CV not found or access denied' });
      return;
    }

    // Extract text from CV content
    let cvText = '';
    try {
      const content = typeof cv.content === 'string' ? JSON.parse(cv.content) : cv.content;
      cvText = content.raw_text || content.summary || JSON.stringify(content);
    } catch (error) {
      console.error('Error parsing CV content:', error);
      res.status(400).json({ error: 'INVALID_CV_CONTENT', details: 'CV content could not be parsed' });
      return;
    }

    console.log('🤖 Starting AI analysis with tier:', tier);

    // Perform AI analysis
    const analysisResult = await aiProviderManager.analyzeCV(cvText, tier, jobDescription);

    // Track usage
    await aiProviderManager.trackUsage(userId, tier, 'ai', analysisResult.cost);

    // Update CV with analysis results
    const { error: updateError } = await supabase
      .from('cvs')
      .update({
        ai_suggestions: analysisResult.analysis,
        updated_at: new Date().toISOString()
      })
      .eq('id', cvId)
      .eq('user_id', userId);

    if (updateError) {
      console.error('Error updating CV with AI analysis:', updateError);
    }

    console.log('✅ AI analysis completed successfully');
    console.log('📊 Provider:', analysisResult.provider);
    console.log('💰 Cost: $', analysisResult.cost.toFixed(4));

    res.json({
      success: true,
      analysis: analysisResult.analysis,
      provider: analysisResult.provider,
      cost: analysisResult.cost,
      tier,
      usage: await aiProviderManager.getUserStats(userId, tier)
    });

  } catch (error: any) {
    console.error('❌ AI analysis failed:', error);
    res.status(500).json({ 
      error: 'AI_ANALYSIS_FAILED', 
      details: error.message 
    });
  }
});

// POST /api/cv/cover-letter - Generate Cover Letter
router.post('/cover-letter', async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('📝 COVER LETTER GENERATION: User authenticated:', req.user);

    const { cvId, jobDescription } = req.body;
    const userId = req.user?.id;
    const tier = getUserTier(req);

    if (!userId) {
      res.status(401).json({ error: 'UNAUTHORIZED', details: 'User not authenticated' });
      return;
    }

    if (!cvId || !jobDescription) {
      res.status(400).json({ 
        error: 'MISSING_DATA', 
        details: 'CV ID and job description are required' 
      });
      return;
    }

    // Check AI usage limits
    const aiCheck = await aiProviderManager.canUseAI(userId, tier);
    if (!aiCheck.allowed) {
      res.status(429).json({ 
        error: 'AI_LIMIT_EXCEEDED', 
        details: aiCheck.reason,
        tier,
        limit: aiProviderManager.getTierConfig(tier).aiLimit
      });
      return;
    }

    // Get CV content from database
    const { data: cv, error: cvError } = await supabase
      .from('cvs')
      .select('content, title')
      .eq('id', cvId)
      .eq('user_id', userId)
      .single();

    if (cvError || !cv) {
      res.status(404).json({ error: 'CV_NOT_FOUND', details: 'CV not found or access denied' });
      return;
    }

    // Extract text from CV content
    let cvText = '';
    try {
      const content = typeof cv.content === 'string' ? JSON.parse(cv.content) : cv.content;
      cvText = content.raw_text || content.summary || JSON.stringify(content);
    } catch (error) {
      console.error('Error parsing CV content:', error);
      res.status(400).json({ error: 'INVALID_CV_CONTENT', details: 'CV content could not be parsed' });
      return;
    }

    console.log('🤖 Starting cover letter generation with tier:', tier);

    // Generate cover letter
    const coverLetterResult = await aiProviderManager.generateCoverLetter(cvText, jobDescription, tier);

    // Track usage
    await aiProviderManager.trackUsage(userId, tier, 'ai', coverLetterResult.cost);

    console.log('✅ Cover letter generated successfully');
    console.log('📊 Provider:', coverLetterResult.provider);
    console.log('💰 Cost: $', coverLetterResult.cost.toFixed(4));

    res.json({
      success: true,
      coverLetter: coverLetterResult.coverLetter,
      provider: coverLetterResult.provider,
      cost: coverLetterResult.cost,
      tier,
      usage: await aiProviderManager.getUserStats(userId, tier)
    });

  } catch (error: any) {
    console.error('❌ Cover letter generation failed:', error);
    res.status(500).json({ 
      error: 'COVER_LETTER_FAILED', 
      details: error.message 
    });
  }
});

// GET /api/cv/usage - Get user usage statistics
router.get('/usage', async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const tier = getUserTier(req);

    if (!userId) {
      res.status(401).json({ error: 'UNAUTHORIZED', details: 'User not authenticated' });
      return;
    }

    const usage = await aiProviderManager.getUserStats(userId, tier);
    const tierConfig = aiProviderManager.getTierConfig(tier);

    res.json({
      success: true,
      usage,
      tierConfig,
      limits: {
        parsing: tierConfig.parsingLimit,
        ai: tierConfig.aiLimit
      }
    });

  } catch (error: any) {
    console.error('❌ Error getting usage stats:', error);
    res.status(500).json({ 
      error: 'USAGE_STATS_FAILED', 
      details: error.message 
    });
  }
});

// GET /api/cv/tier-info - Get tier information
router.get('/tier-info', async (req: Request, res: Response): Promise<void> => {
  try {
    const tier = getUserTier(req);
    const tierConfig = aiProviderManager.getTierConfig(tier);

    res.json({
      success: true,
      tier,
      config: tierConfig,
      features: tierConfig.features
    });

  } catch (error: any) {
    console.error('❌ Error getting tier info:', error);
    res.status(500).json({ 
      error: 'TIER_INFO_FAILED', 
      details: error.message 
    });
  }
});

export default router; 