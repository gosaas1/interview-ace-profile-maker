import { Router, Request, Response } from 'express';
import { supabase } from '../lib/supabase.js';
import { authenticateUser } from '../middleware/auth.js';
import { validateRequest, schemas } from '../middleware/validation.js';

const router = Router();

// Get all interview questions
router.get('/questions', authenticateUser, async (_req: Request, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('interview_questions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    res.json(data);
  } catch (error: any) {
    res.status(400).json({
      message: 'Error fetching interview questions',
      error: error.message,
    });
  }
});

// Get a specific interview question
router.get('/questions/:id', authenticateUser, async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('interview_questions')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    if (!data) {
      res.status(404).json({ message: 'Interview question not found' });
      return;
    }

    res.json(data);
  } catch (error: any) {
    res.status(400).json({
      message: 'Error fetching interview question',
      error: error.message,
    });
  }
});

// Get all answers for the current user
router.get('/answers', authenticateUser, async (req: Request, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('interview_answers')
      .select('*, interview_questions(*)')
      .eq('user_id', req.user!.id)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    res.json(data);
  } catch (error: any) {
    res.status(400).json({
      message: 'Error fetching interview answers',
      error: error.message,
    });
  }
});

// Submit an answer to an interview question
router.post('/answers', authenticateUser, validateRequest(schemas.interview.answer), async (req: Request, res: Response): Promise<void> => {
  try {
    const { question_id, answer, ai_feedback } = req.body;
    const { data, error } = await supabase
      .from('interview_answers')
      .insert([
        {
          user_id: req.user!.id,
          question_id,
          answer,
          ai_feedback,
        },
      ])
      .select()
      .single();

    if (error) {
      throw error;
    }

    res.status(201).json(data);
  } catch (error: any) {
    res.status(400).json({
      message: 'Error submitting interview answer',
      error: error.message,
    });
  }
});

// Update an interview answer
router.put('/answers/:id', authenticateUser, validateRequest(schemas.interview.answer), async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { answer, ai_feedback } = req.body;
    const { data, error } = await supabase
      .from('interview_answers')
      .update({
        answer,
        ai_feedback,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('user_id', req.user!.id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    if (!data) {
      res.status(404).json({ message: 'Interview answer not found' });
      return;
    }

    res.json(data);
  } catch (error: any) {
    res.status(400).json({
      message: 'Error updating interview answer',
      error: error.message,
    });
  }
});

// Delete an interview answer
router.delete('/answers/:id', authenticateUser, async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('interview_answers')
      .delete()
      .eq('id', id)
      .eq('user_id', req.user!.id);

    if (error) {
      throw error;
    }

    res.json({ message: 'Interview answer deleted successfully' });
  } catch (error: any) {
    res.status(400).json({
      message: 'Error deleting interview answer',
      error: error.message,
    });
  }
});

// POST /api/interview/save - Save interview Q&A preparation generated for a job
router.post('/save', authenticateUser, async (req: Request, res: Response): Promise<void> => {
  try {
    const { jobId, questions, answers } = req.body;
    const userId = req.user!.id;

    // Validate required fields
    if (!jobId || !questions || !Array.isArray(questions)) {
      res.status(400).json({
        error: 'Missing required fields',
        details: 'jobId and questions array are required'
      });
      return;
    }

    console.log('🎤 Saving interview session:', { jobId, userId, questionCount: questions.length });

    // First check if job exists and belongs to user
    const { data: jobData, error: jobError } = await supabase
      .from('jobs')
      .select('id, title, company')
      .eq('id', jobId)
      .eq('user_id', userId)
      .single();

    if (jobError || !jobData) {
      res.status(404).json({
        error: 'Job not found',
        details: 'Job not found or not owned by user'
      });
      return;
    }

    // Create interview session
    const { data: sessionData, error: sessionError } = await supabase
      .from('interview_sessions')
      .insert([
        {
          user_id: userId,
          job_id: jobId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (sessionError) {
      console.error('❌ Session creation error:', sessionError);
      res.status(500).json({
        error: 'Failed to create interview session',
        details: sessionError.message
      });
      return;
    }

    // Save questions and answers
    const interviewData = questions.map((question: string, index: number) => ({
      session_id: sessionData.id,
      user_id: userId,
      question: question,
      answer: answers && answers[index] ? answers[index] : null,
      question_order: index + 1,
      created_at: new Date().toISOString()
    }));

    const { error: qaError } = await supabase
      .from('interview_qa')
      .insert(interviewData);

    if (qaError) {
      console.error('❌ Q&A save error:', qaError);
      res.status(500).json({
        error: 'Failed to save interview Q&A',
        details: qaError.message
      });
      return;
    }

    console.log('✅ Interview session saved successfully:', sessionData.id);
    res.status(201).json({
      success: true,
      message: 'Interview session saved successfully',
      data: {
        sessionId: sessionData.id,
        jobId: jobId,
        questionCount: questions.length,
        answerCount: answers ? answers.filter((a: string) => a).length : 0,
        created_at: sessionData.created_at
      }
    });

  } catch (error: any) {
    console.error('❌ Interview save error:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
});

// GET /api/interview/:jobId - Get interview questions + answers for a job ID
router.get('/:jobId', authenticateUser, async (req: Request, res: Response): Promise<void> => {
  try {
    const { jobId } = req.params;
    const userId = req.user!.id;

    console.log('🎤 Fetching interview for job:', { jobId, userId });

    // First check if job exists and belongs to user
    const { data: jobData, error: jobError } = await supabase
      .from('jobs')
      .select('id, title, company')
      .eq('id', jobId)
      .eq('user_id', userId)
      .single();

    if (jobError || !jobData) {
      res.status(404).json({
        error: 'Job not found',
        details: 'Job not found or not owned by user'
      });
      return;
    }

    // Get the latest interview session for this job
    const { data: sessionData, error: sessionError } = await supabase
      .from('interview_sessions')
      .select('id, created_at')
      .eq('user_id', userId)
      .eq('job_id', jobId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (sessionError || !sessionData) {
      // No interview session found, return empty arrays
      res.status(200).json({
        questions: [],
        answers: [],
        sessionId: null,
        jobTitle: jobData.title,
        companyName: jobData.company
      });
      return;
    }

    // Get questions and answers for this session
    const { data: qaData, error: qaError } = await supabase
      .from('interview_qa')
      .select('question, answer, question_order')
      .eq('session_id', sessionData.id)
      .order('question_order', { ascending: true });

    if (qaError) {
      console.error('❌ Q&A fetch error:', qaError);
      res.status(500).json({
        error: 'Failed to fetch interview Q&A',
        details: qaError.message
      });
      return;
    }

    // Transform data to match expected format
    const questions = qaData.map(qa => qa.question);
    const answers = qaData.map(qa => qa.answer || '');

    console.log('✅ Interview fetched successfully:', { questionCount: questions.length, answerCount: answers.length });
    res.status(200).json({
      questions: questions,
      answers: answers,
      sessionId: sessionData.id,
      jobTitle: jobData.title,
      companyName: jobData.company,
      created_at: sessionData.created_at
    });

  } catch (error: any) {
    console.error('❌ Interview fetch error:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
});

export default router; 