import { Router, Request, Response } from 'express';
import { supabase } from '../index';
import { authenticateUser } from '../middleware/auth';
import { validateRequest, schemas } from '../middleware/validation';

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

export default router; 