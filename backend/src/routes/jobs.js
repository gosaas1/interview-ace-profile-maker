const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// Create new job posting
router.post('/', async (req, res) => {
  try {
    const { employerId, title, description, requirements, location, type } = req.body;
    
    const { data, error } = await supabase
      .from('jobs')
      .insert([{
        employerId,
        title,
        description,
        requirements,
        location,
        type,
        status: 'active',
        createdAt: new Date().toISOString()
      }])
      .select();

    if (error) throw error;

    res.status(201).json({
      message: 'Job posted successfully',
      job: data[0]
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all active jobs
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('status', 'active')
      .order('createdAt', { ascending: false });

    if (error) throw error;

    res.json({ jobs: data });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get specific job
router.get('/:jobId', async (req, res) => {
  try {
    const { jobId } = req.params;
    
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', jobId)
      .single();

    if (error) throw error;

    res.json({ job: data });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update job posting
router.put('/:jobId', async (req, res) => {
  try {
    const { jobId } = req.params;
    const updates = req.body;
    
    const { data, error } = await supabase
      .from('jobs')
      .update(updates)
      .eq('id', jobId)
      .select()
      .single();

    if (error) throw error;

    res.json({
      message: 'Job updated successfully',
      job: data
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete job posting
router.delete('/:jobId', async (req, res) => {
  try {
    const { jobId } = req.params;
    
    const { error } = await supabase
      .from('jobs')
      .delete()
      .eq('id', jobId);

    if (error) throw error;

    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Submit job application
router.post('/:jobId/apply', async (req, res) => {
  try {
    const { jobId } = req.params;
    const { userId, cvId, coverLetter } = req.body;
    
    const { data, error } = await supabase
      .from('job_applications')
      .insert([{
        jobId,
        userId,
        cvId,
        coverLetter,
        status: 'pending',
        createdAt: new Date().toISOString()
      }])
      .select();

    if (error) throw error;

    res.status(201).json({
      message: 'Application submitted successfully',
      application: data[0]
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get job applications
router.get('/:jobId/applications', async (req, res) => {
  try {
    const { jobId } = req.params;
    
    const { data, error } = await supabase
      .from('job_applications')
      .select('*')
      .eq('jobId', jobId)
      .order('createdAt', { ascending: false });

    if (error) throw error;

    res.json({ applications: data });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router; 