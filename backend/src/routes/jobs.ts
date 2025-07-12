import { Router, Request, Response } from 'express';
import { supabase } from '../index';
import { authenticateUser } from '../middleware/auth';
import { validateRequest, schemas } from '../middleware/validation';

const router = Router();

// Get all jobs
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    res.json(data);
  } catch (error: any) {
    res.status(400).json({
      message: 'Error fetching jobs',
      error: error.message,
    });
  }
});

// Get a specific job
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    if (!data) {
      res.status(404).json({ message: 'Job not found' });
      return;
    }

    res.json(data);
  } catch (error: any) {
    res.status(400).json({
      message: 'Error fetching job',
      error: error.message,
    });
  }
});

// Create a new job posting
router.post('/', authenticateUser, validateRequest(schemas.job.create), async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, company, location, description, requirements, salary_range } = req.body;
    const { data, error } = await supabase
      .from('jobs')
      .insert([
        {
          user_id: req.user!.id,
          title,
          company,
          location,
          description,
          requirements,
          salary_range,
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
      message: 'Error creating job posting',
      error: error.message,
    });
  }
});

// Update a job posting
router.put('/:id', authenticateUser, validateRequest(schemas.job.update), async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, company, location, description, requirements, salary_range, status } = req.body;
    const { data, error } = await supabase
      .from('jobs')
      .update({
        title,
        company,
        location,
        description,
        requirements,
        salary_range,
        status,
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
      res.status(404).json({ message: 'Job posting not found' });
      return;
    }

    res.json(data);
  } catch (error: any) {
    res.status(400).json({
      message: 'Error updating job posting',
      error: error.message,
    });
  }
});

// Delete a job posting
router.delete('/:id', authenticateUser, async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('jobs')
      .delete()
      .eq('id', id)
      .eq('user_id', req.user!.id);

    if (error) {
      throw error;
    }

    res.json({ message: 'Job posting deleted successfully' });
  } catch (error: any) {
    res.status(400).json({
      message: 'Error deleting job posting',
      error: error.message,
    });
  }
});

// Apply for a job
router.post('/:id/apply', authenticateUser, validateRequest(schemas.job.apply), async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { cv_id, cover_letter } = req.body;
    const { data, error } = await supabase
      .from('job_applications')
      .insert([
        {
          user_id: req.user!.id,
          job_id: id,
          cv_id,
          cover_letter,
          status: 'pending',
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
      message: 'Error submitting job application',
      error: error.message,
    });
  }
});

// Get all applications for the current user
router.get('/applications', authenticateUser, async (req: Request, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('job_applications')
      .select('*, jobs(*)')
      .eq('user_id', req.user!.id)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    res.json(data);
  } catch (error: any) {
    res.status(400).json({
      message: 'Error fetching job applications',
      error: error.message,
    });
  }
});

export default router; 