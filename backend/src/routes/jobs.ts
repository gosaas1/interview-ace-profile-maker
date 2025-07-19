import { Router, Request, Response } from 'express';
import { supabase } from '../lib/supabase.js';
import { authenticateUser } from '../middleware/auth.js';
import { validateRequest, schemas } from '../middleware/validation.js';

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

// POST /api/job/save - Save a job description with job title, company, and parsed JD text
router.post('/save', authenticateUser, async (req: Request, res: Response): Promise<void> => {
  try {
    const { jobTitle, companyName, rawJD, parsedJD, sourceURL } = req.body;
    const userId = req.user!.id;

    // Validate required fields
    if (!jobTitle || !companyName || !rawJD) {
      res.status(400).json({
        error: 'Missing required fields',
        details: 'jobTitle, companyName, and rawJD are required'
      });
      return;
    }

    console.log('💼 Saving job:', { jobTitle, companyName, userId });

    const { data, error } = await supabase
      .from('jobs')
      .insert([
        {
          user_id: userId,
          title: jobTitle,
          company: companyName,
          description: rawJD,
          requirements: parsedJD || rawJD,
          source_url: sourceURL,
          status: 'saved',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('❌ Database error:', error);
      res.status(500).json({
        error: 'Failed to save job',
        details: error.message
      });
      return;
    }

    console.log('✅ Job saved successfully:', data.id);
    res.status(201).json({
      success: true,
      message: 'Job saved successfully',
      data: {
        id: data.id,
        jobTitle: data.title,
        companyName: data.company,
        sourceURL: data.source_url,
        created_at: data.created_at
      }
    });

  } catch (error: any) {
    console.error('❌ Job save error:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
});

// GET /api/job/list - Fetch all saved jobs for the user
router.get('/list', authenticateUser, async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;

    console.log('📋 Fetching job list for user:', userId);

    const { data, error } = await supabase
      .from('jobs')
      .select('id, title, company, source_url, created_at, updated_at, status')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Database error:', error);
      res.status(500).json({
        error: 'Failed to fetch jobs',
        details: error.message
      });
      return;
    }

    // Transform data to match expected format
    const jobList = data.map(job => ({
      id: job.id,
      jobTitle: job.title,
      companyName: job.company,
      sourceURL: job.source_url,
      created_at: job.created_at,
      updated_at: job.updated_at,
      status: job.status
    }));

    console.log('✅ Job list fetched successfully:', jobList.length, 'jobs');
    res.status(200).json(jobList);

  } catch (error: any) {
    console.error('❌ Job list fetch error:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
});

// POST /api/job/:id/apply - Mark a job as applied with timestamp
router.post('/:id/apply', authenticateUser, async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    console.log('📝 Marking job as applied:', { jobId: id, userId });

    // First check if job exists and belongs to user
    const { data: jobData, error: jobError } = await supabase
      .from('jobs')
      .select('id, title, company')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (jobError || !jobData) {
      res.status(404).json({
        error: 'Job not found',
        details: 'Job not found or not owned by user'
      });
      return;
    }

    // Update job status to applied
    const { data, error } = await supabase
      .from('jobs')
      .update({
        status: 'applied',
        applied_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('❌ Database error:', error);
      res.status(500).json({
        error: 'Failed to update job status',
        details: error.message
      });
      return;
    }

    console.log('✅ Job marked as applied successfully:', data.id);
    res.status(200).json({
      success: true,
      message: 'Job marked as applied',
      data: {
        id: data.id,
        jobTitle: data.title,
        companyName: data.company,
        status: data.status,
        applied_at: data.applied_at
      }
    });

  } catch (error: any) {
    console.error('❌ Job apply error:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
});

export default router; 