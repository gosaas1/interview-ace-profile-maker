const express = require('express');
const cors = require('cors');
require('dotenv').config();

function importRoute(routePath) {
  const mod = require(routePath);
  return mod.default || mod;
}

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
const authRoutes = importRoute('../dist/routes/auth.js');
const cvRoutes = importRoute('../dist/routes/cv.js');
const cvAIRoutes = importRoute('../dist/routes/cv-ai.js');
const adminRoutes = importRoute('../dist/routes/admin.js');
const interviewRoutes = importRoute('../dist/routes/interview.js');
const jobRoutes = importRoute('../dist/routes/jobs.js');

app.use('/api/auth', authRoutes);
app.use('/api/cv', cvRoutes);
app.use('/api/cv', cvAIRoutes); // AI-enhanced CV routes
app.use('/api/admin', adminRoutes);
app.use('/api/interview', interviewRoutes);
app.use('/api/jobs', jobRoutes);

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