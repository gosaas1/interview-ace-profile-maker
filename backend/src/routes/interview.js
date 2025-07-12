const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// Generate interview questions
router.post('/questions', async (req, res) => {
  try {
    const { jobTitle, experience, skills } = req.body;
    
    // TODO: Implement AI question generation using Claude API
    // For now, return mock questions
    const mockQuestions = [
      {
        id: 1,
        question: "Tell me about yourself and your experience in " + jobTitle,
        category: "general",
        difficulty: "medium"
      },
      {
        id: 2,
        question: "What are your key strengths in " + skills.join(", "),
        category: "skills",
        difficulty: "easy"
      }
    ];

    res.json({ questions: mockQuestions });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Submit interview answer
router.post('/answers', async (req, res) => {
  try {
    const { userId, questionId, answer, type } = req.body;
    
    // TODO: Implement AI feedback generation using Claude API
    // For now, return mock feedback
    const mockFeedback = {
      score: 85,
      feedback: "Good answer! Consider adding more specific examples.",
      improvements: ["Add concrete examples", "Be more concise"]
    };

    // Store answer and feedback in Supabase
    const { data, error } = await supabase
      .from('interview_answers')
      .insert([{
        userId,
        questionId,
        answer,
        type,
        feedback: mockFeedback,
        createdAt: new Date().toISOString()
      }])
      .select();

    if (error) throw error;

    res.status(201).json({
      message: 'Answer submitted successfully',
      feedback: mockFeedback,
      answer: data[0]
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get user's interview history
router.get('/history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const { data, error } = await supabase
      .from('interview_answers')
      .select('*')
      .eq('userId', userId)
      .order('createdAt', { ascending: false });

    if (error) throw error;

    res.json({ history: data });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get specific interview answer
router.get('/answers/:answerId', async (req, res) => {
  try {
    const { answerId } = req.params;
    
    const { data, error } = await supabase
      .from('interview_answers')
      .select('*')
      .eq('id', answerId)
      .single();

    if (error) throw error;

    res.json({ answer: data });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router; 