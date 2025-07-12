const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// Generate new CV
router.post('/generate', async (req, res) => {
  try {
    const { userId, userInfo, preferences } = req.body;
    
    // TODO: Implement AI CV generation using Claude API
    // For now, return a mock response
    const mockCV = {
      id: Date.now().toString(),
      userId,
      content: {
        personalInfo: userInfo,
        preferences,
        sections: []
      },
      createdAt: new Date().toISOString()
    };

    // Store CV in Supabase
    const { data, error } = await supabase
      .from('cvs')
      .insert([mockCV])
      .select();

    if (error) throw error;

    res.status(201).json({
      message: 'CV generated successfully',
      cv: data[0]
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get user's CVs
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const { data, error } = await supabase
      .from('cvs')
      .select('*')
      .eq('userId', userId)
      .order('createdAt', { ascending: false });

    if (error) throw error;

    res.json({ cvs: data });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get specific CV
router.get('/:cvId', async (req, res) => {
  try {
    const { cvId } = req.params;
    
    const { data, error } = await supabase
      .from('cvs')
      .select('*')
      .eq('id', cvId)
      .single();

    if (error) throw error;

    res.json({ cv: data });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update CV
router.put('/:cvId', async (req, res) => {
  try {
    const { cvId } = req.params;
    const updates = req.body;
    
    const { data, error } = await supabase
      .from('cvs')
      .update(updates)
      .eq('id', cvId)
      .select()
      .single();

    if (error) throw error;

    res.json({
      message: 'CV updated successfully',
      cv: data
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete CV
router.delete('/:cvId', async (req, res) => {
  try {
    const { cvId } = req.params;
    
    const { error } = await supabase
      .from('cvs')
      .delete()
      .eq('id', cvId);

    if (error) throw error;

    res.json({ message: 'CV deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router; 