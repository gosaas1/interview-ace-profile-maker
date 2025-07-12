// Minimal Express server for mock API endpoints
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 8080;

app.use(cors());
app.use(bodyParser.json());

// Mock job scraping endpoint
app.post('/api/jobs/scrape-job', (req, res) => {
  const { jobUrl } = req.body;
  // Return mock job data
  res.json({
    success: true,
    data: {
      id: 'job-123',
      title: 'Senior React Developer',
      company: 'TechCorp Solutions',
      location: 'London, UK (Hybrid)',
      description: 'We are looking for a Senior React Developer to join our dynamic team...',
      requirements: [
        'React.js', 'JavaScript', 'Redux', 'RESTful APIs', 'Webpack',
        'TypeScript', 'Node.js', 'Git', 'Agile methodology'
      ],
      keywords: [
        'React', 'JavaScript', 'Frontend', 'Redux', 'TypeScript', 'API',
        'Performance', 'Optimization', 'Collaboration', 'Senior', 'Developer'
      ],
      salary_range: '£60,000 - £80,000',
      application_url: jobUrl,
      posted_date: '2024-01-15',
      job_board: 'linkedin'
    }
  });
});

// Mock CV tailoring and match analysis endpoint
app.post('/api/ai/tailor-cv', (req, res) => {
  const { cvData, jobData, action } = req.body;
  
  if (action === 'analyze-match') {
    // Return a mock match score
    return res.json({ success: true, matchScore: 85 });
  }
  
  if (action === 'tailor-cv') {
    // Return a mock tailored CV
    return res.json({
      success: true,
      data: {
        tailored_cv: {
          ...cvData,
          summary: `Tailored for ${jobData.title} at ${jobData.company}`,
          experiences: cvData.experiences || [],
          skills: jobData.requirements.join(', ')
        }
      }
    });
  }
  
  if (action === 'generate-cover-letter') {
    // Generate a mock cover letter
    const coverLetter = `Dear Hiring Manager,

I am writing to express my strong interest in the ${jobData.title} position at ${jobData.company}. With my background in ${cvData.job_title || 'software development'} and expertise in ${cvData.skills?.split(',').slice(0, 3).join(', ') || 'relevant technologies'}, I am confident I can make valuable contributions to your team.

**Why I'm a Great Fit:**

• **Relevant Experience**: I have successfully delivered projects using ${jobData.requirements.slice(0, 2).join(' and ')} and related technologies
• **Problem-Solving Skills**: Demonstrated ability to analyze complex requirements and implement effective solutions
• **Team Collaboration**: Experience working with cross-functional teams to deliver high-quality results
• **Continuous Learning**: Passionate about staying current with industry best practices and emerging technologies

**Key Achievements:**
• Developed and maintained applications that improved user experience and system performance
• Collaborated with stakeholders to gather requirements and deliver solutions that exceeded expectations
• Contributed to process improvements that enhanced team productivity and code quality

I am particularly drawn to ${jobData.company}'s focus on ${jobData.keywords?.slice(0, 2).join(' and ') || 'innovation and excellence'} and would welcome the opportunity to contribute to your continued success.

I am excited about the possibility of joining your team and would appreciate the opportunity to discuss how my skills and experience align with your needs. Thank you for considering my application.

Best regards,
${cvData.full_name || 'Your Name'}
${cvData.email || 'your.email@example.com'}
${cvData.phone || '+44 123 456 7890'}`;

    return res.json({
      success: true,
      data: {
        cover_letter: coverLetter,
        personalization_elements: {
          company_focus: jobData.keywords?.slice(0, 2).join(' and ') || 'innovation and excellence',
          key_skills: jobData.requirements.slice(0, 3).join(', '),
          experience_years: '5+ years',
          achievements: [
            'Developed and maintained applications that improved user experience and system performance',
            'Collaborated with stakeholders to gather requirements and deliver solutions that exceeded expectations',
            'Contributed to process improvements that enhanced team productivity and code quality'
          ]
        }
      }
    });
  }
  
  res.json({ success: false, error: 'Unknown action' });
});

app.listen(PORT, () => {
  console.log(`Mock API server running on http://localhost:${PORT}`);
}); 