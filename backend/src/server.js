import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('AI CV + Interview App Backend is running!');
});

// Import and use route handlers
const authRoutes = (await import('../dist/routes/auth.js')).default;
const cvRoutes = (await import('../dist/routes/cv.js')).default;
const cvAIRoutes = (await import('../dist/routes/cv-ai.js')).default;
const adminRoutes = (await import('../dist/routes/admin.js')).default;
const interviewRoutes = (await import('../dist/routes/interview.js')).default;
const jobRoutes = (await import('../dist/routes/jobs.js')).default;
const analyticsRoutes = (await import('../dist/routes/analytics.js')).default;
const tierRoutes = (await import('../dist/routes/tier.js')).default;

app.use('/api/auth', authRoutes);
app.use('/api/cv', cvRoutes);
app.use('/api/cv', cvAIRoutes); // AI-enhanced CV routes
app.use('/api/admin', adminRoutes);
app.use('/api/interview', interviewRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/tier', tierRoutes); // Tier info endpoint
app.use('/api/feedback', analyticsRoutes); // Feedback endpoint
app.use('/api/contact', analyticsRoutes); // Contact endpoint

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
}); 