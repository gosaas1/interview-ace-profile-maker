// Generic Job Scraper API Endpoint
// Enhanced with OpenAI for intelligent job analysis and requirement extraction
// Supports multiple job boards: LinkedIn, Indeed, Glassdoor, Reed, TotalJobs, CWJobs, Monster

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';

// IMPORTANT: We only use gpt-4o-mini model for cost efficiency
// This model is ~60x cheaper than GPT-4 while maintaining excellent quality

// Supported job board patterns
const jobBoardPatterns = {
  linkedin: {
    pattern: /^https?:\/\/(www\.)?linkedin\.com\/jobs\/view\/\d+\/?.*$/,
    name: 'LinkedIn',
    extractJobId: (url) => {
      const match = url.match(/\/jobs\/view\/(\d+)/);
      return match ? match[1] : null;
    }
  },
  indeed: {
    pattern: /^https?:\/\/(www\.)?indeed\.com\/viewjob\?.*$/,
    name: 'Indeed',
    extractJobId: (url) => {
      const urlParams = new URLSearchParams(url.split('?')[1]);
      return urlParams.get('jk') || 'indeed-job';
    }
  },
  glassdoor: {
    pattern: /^https?:\/\/(www\.)?glassdoor\.co\.uk\/job\/.*$/,
    name: 'Glassdoor',
    extractJobId: (url) => {
      const match = url.match(/\/job\/([^\/\?]+)/);
      return match ? match[1] : 'glassdoor-job';
    }
  },
  reed: {
    pattern: /^https?:\/\/(www\.)?reed\.co\.uk\/jobs\/.*$/,
    name: 'Reed',
    extractJobId: (url) => {
      const match = url.match(/\/jobs\/([^\/\?]+)/);
      return match ? match[1] : 'reed-job';
    }
  },
  totaljobs: {
    pattern: /^https?:\/\/(www\.)?totaljobs\.com\/job\/.*$/,
    name: 'TotalJobs',
    extractJobId: (url) => {
      const match = url.match(/\/job\/([^\/\?]+)/);
      return match ? match[1] : 'totaljobs-job';
    }
  },
  cwjobs: {
    pattern: /^https?:\/\/(www\.)?cwjobs\.co\.uk\/job\/.*$/,
    name: 'CWJobs',
    extractJobId: (url) => {
      const match = url.match(/\/job\/([^\/\?]+)/);
      return match ? match[1] : 'cwjobs-job';
    }
  },
  monster: {
    pattern: /^https?:\/\/(www\.)?monster\.co\.uk\/job\/.*$/,
    name: 'Monster',
    extractJobId: (url) => {
      const match = url.match(/\/job\/([^\/\?]+)/);
      return match ? match[1] : 'monster-job';
    }
  }
};

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { jobUrl } = req.body;

    if (!jobUrl) {
      return res.status(400).json({ error: 'Job URL is required' });
    }

    // Detect job board
    let detectedJobBoard = null;
    let jobId = null;

    for (const [key, board] of Object.entries(jobBoardPatterns)) {
      if (board.pattern.test(jobUrl)) {
        detectedJobBoard = key;
        jobId = board.extractJobId(jobUrl);
        break;
      }
    }

    if (!detectedJobBoard) {
      return res.status(400).json({ 
        error: 'Unsupported job board URL',
        supportedBoards: Object.keys(jobBoardPatterns).map(key => jobBoardPatterns[key].name)
      });
    }

    if (!jobId) {
      return res.status(400).json({ error: 'Could not extract job ID from URL' });
    }

    // In a real implementation, you would:
    // 1. Use a headless browser (Puppeteer/Playwright) to scrape the page
    // 2. Handle each job board's specific anti-bot measures
    // 3. Extract structured data from the job posting
    // 4. Use AI to analyze and categorize the requirements

    // For now, we'll return mock data based on the job board and job ID
    const mockJobData = generateMockJobData(detectedJobBoard, jobId, jobUrl);

    // Enhance job data with AI analysis
    try {
      const enhancedJobData = await enhanceJobDataWithAI(mockJobData);
      return res.status(200).json({
        success: true,
        data: enhancedJobData,
        ai_enhanced: true,
        job_board: detectedJobBoard
      });
    } catch (aiError) {
      console.error('AI enhancement failed:', aiError);
      // Return original mock data if AI fails
      return res.status(200).json({
        success: true,
        data: mockJobData,
        ai_enhanced: false,
        job_board: detectedJobBoard,
        note: 'AI enhancement unavailable'
      });
    }

  } catch (error) {
    console.error('Job scraping error:', error);
    return res.status(500).json({
      error: 'Failed to scrape job posting',
      message: error.message
    });
  }
}

function generateMockJobData(jobBoard, jobId, jobUrl) {
  // Generate different mock data based on job board
  const baseJobData = {
    id: jobId,
    title: 'Senior React Developer',
    company: 'TechCorp Solutions',
    location: 'London, UK (Hybrid)',
    description: `We are looking for a Senior React Developer to join our dynamic team. You will be responsible for developing user-facing features using React.js, building reusable components, and optimizing applications for maximum speed and scalability.

Key Responsibilities:
• Develop new user-facing features using React.js
• Build reusable components and front-end libraries
• Translate designs and wireframes into high-quality code
• Optimize components for maximum performance across devices
• Collaborate with team members and stakeholders

Requirements:
• 5+ years of experience with React.js and its core principles
• Strong proficiency in JavaScript, including DOM manipulation and the JavaScript object model
• Experience with popular React.js workflows (such as Flux or Redux)
• Familiarity with newer specifications of EcmaScript
• Experience with data structure libraries (e.g., Immutable.js)
• Knowledge of isomorphic React is a plus
• Experience with RESTful APIs
• Knowledge of modern authorization mechanisms, such as JSON Web Token
• Familiarity with modern front-end build pipelines and tools
• Experience with common front-end development tools such as Babel, Webpack, NPM, etc.
• A knack for benchmarking and optimization

Benefits:
• Competitive salary (£60,000 - £80,000)
• Remote/hybrid working options
• Health insurance
• Professional development budget
• Stock options
• 25 days holiday + bank holidays`,
    requirements: [
      'React.js',
      'JavaScript',
      'Redux',
      'RESTful APIs',
      'Webpack',
      'TypeScript',
      'Node.js',
      'Git',
      'Agile methodology',
      'HTML/CSS',
      'Testing (Jest, RTL)',
      'Performance optimization'
    ],
    keywords: [
      'React', 'JavaScript', 'Frontend', 'Redux', 'TypeScript', 'API', 'Responsive',
      'Performance', 'Optimization', 'Collaboration', 'Senior', 'Developer', 'Component',
      'Scalability', 'Modern', 'Build tools', 'Testing', 'Agile'
    ],
    salary_range: '£60,000 - £80,000',
    employment_type: 'Full-time',
    experience_level: 'Senior level',
    application_url: jobUrl,
    posted_date: new Date().toISOString().split('T')[0],
    company_size: '201-500 employees',
    industry: 'Technology',
    benefits: [
      'Health insurance',
      'Remote work',
      'Professional development',
      'Stock options',
      '25 days holiday'
    ],
    job_board: jobBoard
  };

  // Add job board specific variations
  switch (jobBoard) {
    case 'indeed':
      baseJobData.company = 'Indeed Tech Solutions';
      baseJobData.location = 'Manchester, UK (Remote)';
      break;
    case 'glassdoor':
      baseJobData.company = 'Glassdoor Innovations';
      baseJobData.location = 'Birmingham, UK (Hybrid)';
      break;
    case 'reed':
      baseJobData.company = 'Reed Digital';
      baseJobData.location = 'Leeds, UK (On-site)';
      break;
    case 'totaljobs':
      baseJobData.company = 'TotalJobs Tech';
      baseJobData.location = 'Bristol, UK (Flexible)';
      break;
    case 'cwjobs':
      baseJobData.company = 'CWJobs Solutions';
      baseJobData.location = 'Edinburgh, UK (Hybrid)';
      break;
    case 'monster':
      baseJobData.company = 'Monster Technologies';
      baseJobData.location = 'Cardiff, UK (Remote)';
      break;
    default:
      // LinkedIn - keep default
      break;
  }

  return baseJobData;
}

async function callOpenAI(prompt, maxTokens = 800) {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // COST-EFFECTIVE MODEL - ~$0.15 per 1M input tokens vs ~$30 for GPT-4
        messages: [
          {
            role: 'system',
            content: 'You are an expert job analyst. Extract and analyze job requirements, skills, and provide structured data for job matching. Be concise and focused in your responses.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: maxTokens,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API call failed:', error);
    throw error;
  }
}

async function enhanceJobDataWithAI(jobData) {
  try {
    const prompt = `
Analyze this job posting and extract structured information:

JOB TITLE: ${jobData.title}
COMPANY: ${jobData.company}
DESCRIPTION: ${jobData.description}

Please provide enhanced analysis as JSON with:
- refined_requirements (array of specific technical skills/tools)
- enhanced_keywords (array of relevant keywords for matching)
- skill_categories (object with technical, soft_skills, tools, methodologies)
- experience_level_analysis (junior/mid/senior assessment)
- industry_focus (specific industry or domain)
- remote_work_compatibility (remote/hybrid/on-site assessment)
- salary_insights (market rate analysis if available)
- application_tips (specific advice for this role)

Format as valid JSON only.`;

    const aiResponse = await callOpenAI(prompt);
    
    try {
      const enhancedData = JSON.parse(aiResponse);
      
      // Merge AI enhancements with original data
      return {
        ...jobData,
        requirements: enhancedData.refined_requirements || jobData.requirements,
        keywords: enhancedData.enhanced_keywords || jobData.keywords,
        skill_categories: enhancedData.skill_categories || {},
        experience_level_analysis: enhancedData.experience_level_analysis || 'senior',
        industry_focus: enhancedData.industry_focus || 'Technology',
        remote_work_compatibility: enhancedData.remote_work_compatibility || 'hybrid',
        salary_insights: enhancedData.salary_insights || 'Competitive market rate',
        application_tips: enhancedData.application_tips || 'Focus on React and modern JavaScript experience',
        ai_enhanced: true
      };
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      return jobData; // Return original data if AI response parsing fails
    }
  } catch (error) {
    console.error('AI enhancement failed:', error);
    return jobData; // Return original data if AI enhancement fails
  }
} 