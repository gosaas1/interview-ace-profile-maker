import { Router, Request, Response } from 'express';
import { supabase } from '../lib/supabase.js';
import { authenticateUser, optionalAuth } from '../middleware/auth.js';

const router = Router();

// GET /api/analytics/usage - Return user's current usage stats
router.get('/usage', authenticateUser, async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;

    console.log('📊 Fetching usage analytics for user:', userId);

    // Get user's tier from profiles table
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('tier')
      .eq('id', userId)
      .single();

    if (profileError) {
      console.error('❌ Profile fetch error:', profileError);
      res.status(500).json({
        error: 'Failed to fetch user profile',
        details: profileError.message
      });
      return;
    }

    const tier = profileData?.tier || 'free';

    // Count CVs parsed
    const { count: cvCount, error: cvError } = await supabase
      .from('cvs')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (cvError) {
      console.error('❌ CV count error:', cvError);
      res.status(500).json({
        error: 'Failed to count CVs',
        details: cvError.message
      });
      return;
    }

    // Count jobs saved
    const { count: jobCount, error: jobError } = await supabase
      .from('jobs')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (jobError) {
      console.error('❌ Job count error:', jobError);
      res.status(500).json({
        error: 'Failed to count jobs',
        details: jobError.message
      });
      return;
    }

    // Count interview sessions
    const { count: interviewCount, error: interviewError } = await supabase
      .from('interview_sessions')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (interviewError) {
      console.error('❌ Interview count error:', interviewError);
      res.status(500).json({
        error: 'Failed to count interviews',
        details: interviewError.message
      });
      return;
    }

    const usageStats = {
      cv_parsed_count: cvCount || 0,
      jobs_saved_count: jobCount || 0,
      interviews_done: interviewCount || 0,
      tier: tier
    };

    console.log('✅ Usage analytics fetched successfully:', usageStats);
    res.status(200).json(usageStats);

  } catch (error: any) {
    console.error('❌ Usage analytics error:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
});

// POST /api/feedback - Save user feedback or bug report
router.post('/feedback', optionalAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const { message, context, rating, page } = req.body;
    const userId = req.user?.id;

    // Validate required fields
    if (!message || typeof message !== 'string') {
      res.status(400).json({
        error: 'Missing required fields',
        details: 'message is required and must be a string'
      });
      return;
    }

    console.log('💬 Saving feedback:', { userId, message: message.substring(0, 50) + '...' });

    const { data, error } = await supabase
      .from('feedback')
      .insert([
        {
          user_id: userId,
          message: message,
          context: context || null,
          rating: rating || null,
          page: page || null,
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('❌ Feedback save error:', error);
      res.status(500).json({
        error: 'Failed to save feedback',
        details: error.message
      });
      return;
    }

    console.log('✅ Feedback saved successfully:', data.id);
    res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully',
      data: {
        id: data.id,
        created_at: data.created_at
      }
    });

  } catch (error: any) {
    console.error('❌ Feedback error:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
});

// POST /api/contact - Save contact form message from unauthenticated visitor
router.post('/contact', async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      res.status(400).json({
        error: 'Missing required fields',
        details: 'name, email, and message are required'
      });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({
        error: 'Invalid email format',
        details: 'Please provide a valid email address'
      });
      return;
    }

    console.log('📧 Saving contact message:', { name, email, message: message.substring(0, 50) + '...' });

    const { data, error } = await supabase
      .from('public_contact_messages')
      .insert([
        {
          name: name,
          email: email,
          message: message,
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('❌ Contact save error:', error);
      res.status(500).json({
        error: 'Failed to save contact message',
        details: error.message
      });
      return;
    }

    console.log('✅ Contact message saved successfully:', data.id);
    res.status(201).json({
      success: true,
      message: 'Contact message submitted successfully',
      data: {
        id: data.id,
        created_at: data.created_at
      }
    });

  } catch (error: any) {
    console.error('❌ Contact error:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
});

export default router; 
 
 