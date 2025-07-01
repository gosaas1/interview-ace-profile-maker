import { CVAnalysisRequest, CVAnalysisResponse, CVSuggestion } from './types';

export class LocalCVAnalyzer {
  // ATS Keywords by Industry (Comprehensive Database)
  private atsKeywords = {
    technology: [
      // Programming Languages
      'JavaScript', 'TypeScript', 'Python', 'Java', 'C#', 'C++', 'PHP', 'Ruby', 'Go', 'Rust', 'Swift', 'Kotlin',
      'HTML', 'CSS', 'SQL', 'NoSQL', 'R', 'MATLAB', 'Scala', 'Perl', 'Shell', 'Bash',
      
      // Frameworks & Libraries
      'React', 'Angular', 'Vue.js', 'Node.js', 'Express', 'Django', 'Flask', 'Spring', 'Laravel', 'Ruby on Rails',
      '.NET', 'ASP.NET', 'jQuery', 'Bootstrap', 'Tailwind', 'Material-UI', 'Redux', 'Vuex', 'Next.js', 'Nuxt.js',
      
      // Databases
      'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Elasticsearch', 'Oracle', 'SQL Server', 'SQLite', 'Cassandra',
      'DynamoDB', 'Firebase', 'Supabase', 'Neo4j', 'InfluxDB',
      
      // Cloud & DevOps
      'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Jenkins', 'GitLab', 'GitHub Actions', 'CircleCI',
      'Terraform', 'Ansible', 'Chef', 'Puppet', 'Nginx', 'Apache', 'Linux', 'Unix', 'Ubuntu', 'CentOS',
      
      // Tools & Technologies
      'Git', 'SVN', 'Jira', 'Confluence', 'Slack', 'VS Code', 'IntelliJ', 'Eclipse', 'Postman', 'Swagger',
      'REST API', 'GraphQL', 'gRPC', 'Microservices', 'WebSockets', 'JSON', 'XML', 'YAML',
      
      // Methodologies
      'Agile', 'Scrum', 'Kanban', 'DevOps', 'CI/CD', 'TDD', 'BDD', 'SOLID', 'Clean Code', 'Code Review',
      'Unit Testing', 'Integration Testing', 'Test Automation', 'Performance Testing',
      
      // Emerging Tech
      'Machine Learning', 'Artificial Intelligence', 'Deep Learning', 'Neural Networks', 'Computer Vision',
      'Natural Language Processing', 'Blockchain', 'IoT', 'AR/VR', 'Cybersecurity', 'Penetration Testing',
      'Ethical Hacking', 'OWASP', 'Security Audit'
    ],
    
    business: [
      // Management & Leadership
      'Project Management', 'Team Leadership', 'Strategic Planning', 'Business Strategy', 'Change Management',
      'Stakeholder Management', 'Executive Leadership', 'Cross-functional Teams', 'Remote Team Management',
      'Performance Management', 'Talent Development', 'Succession Planning', 'Coaching', 'Mentoring',
      
      // Business Analysis
      'Business Analysis', 'Requirements Gathering', 'Process Improvement', 'Workflow Optimization',
      'Business Process Mapping', 'Gap Analysis', 'Risk Assessment', 'Cost-Benefit Analysis',
      'ROI Analysis', 'KPI Development', 'Metrics & Analytics', 'Data-driven Decisions',
      
      // Sales & Marketing
      'Sales Management', 'Business Development', 'Lead Generation', 'Client Acquisition', 'Account Management',
      'Customer Relationship Management', 'CRM', 'Salesforce', 'HubSpot', 'Marketing Strategy',
      'Digital Marketing', 'Content Marketing', 'Social Media Marketing', 'SEO', 'SEM', 'PPC',
      'Email Marketing', 'Marketing Automation', 'Brand Management', 'Customer Experience',
      
      // Operations & Finance
      'Operations Management', 'Supply Chain Management', 'Inventory Management', 'Vendor Management',
      'Contract Negotiation', 'Budget Management', 'Financial Planning', 'Forecasting', 'P&L Management',
      'Cost Control', 'Financial Reporting', 'Procurement', 'Compliance Management',
      
      // Consulting & Strategy
      'Management Consulting', 'Strategy Consulting', 'Business Transformation', 'Digital Transformation',
      'Organizational Development', 'Market Research', 'Competitive Analysis', 'Due Diligence',
      'Merger & Acquisition', 'IPO', 'Fundraising', 'Investor Relations'
    ],
    
    healthcare: [
      // Clinical Skills
      'Patient Care', 'Clinical Assessment', 'Medical History', 'Physical Examination', 'Diagnosis',
      'Treatment Planning', 'Medication Management', 'Pain Management', 'Wound Care', 'IV Therapy',
      'Vital Signs', 'Patient Monitoring', 'Emergency Care', 'Critical Care', 'ICU', 'OR',
      
      // Healthcare Technology
      'Electronic Health Records', 'EHR', 'EMR', 'EPIC', 'Cerner', 'Medical Coding', 'ICD-10', 'CPT',
      'Medical Billing', 'Healthcare Analytics', 'Telemedicine', 'Medical Devices', 'Diagnostic Equipment',
      
      // Specializations
      'Nursing', 'Registered Nurse', 'LPN', 'Nurse Practitioner', 'Physician Assistant', 'Medical Assistant',
      'Pharmacy', 'Physical Therapy', 'Occupational Therapy', 'Respiratory Therapy', 'Radiology',
      'Laboratory', 'Surgery', 'Anesthesia', 'Cardiology', 'Oncology', 'Pediatrics', 'Geriatrics',
      
      // Compliance & Quality
      'HIPAA', 'Patient Privacy', 'Healthcare Compliance', 'Joint Commission', 'Quality Assurance',
      'Patient Safety', 'Risk Management', 'Infection Control', 'Medicare', 'Medicaid', 'Insurance',
      'Clinical Research', 'FDA Regulations', 'Clinical Trials'
    ],
    
    finance: [
      // Financial Analysis
      'Financial Analysis', 'Financial Modeling', 'Valuation', 'DCF', 'LBO', 'Comparable Analysis',
      'Ratio Analysis', 'Variance Analysis', 'Trend Analysis', 'Sensitivity Analysis', 'Scenario Planning',
      
      // Accounting
      'Accounting', 'GAAP', 'IFRS', 'Financial Reporting', 'P&L', 'Balance Sheet', 'Cash Flow',
      'General Ledger', 'Accounts Payable', 'Accounts Receivable', 'Tax Preparation', 'Audit',
      'Internal Audit', 'External Audit', 'SOX Compliance', 'Month-end Close', 'Year-end Close',
      
      // Investment & Banking
      'Investment Banking', 'Corporate Finance', 'M&A', 'Capital Markets', 'Equity Research',
      'Fixed Income', 'Derivatives', 'Portfolio Management', 'Asset Management', 'Wealth Management',
      'Private Equity', 'Venture Capital', 'Hedge Funds', 'Trading', 'Risk Management',
      
      // Tools & Software
      'Excel', 'Advanced Excel', 'VBA', 'Bloomberg', 'Reuters', 'SQL', 'Python', 'R', 'Tableau',
      'Power BI', 'QuickBooks', 'SAP', 'Oracle Financials', 'Hyperion', 'Essbase',
      
      // Risk & Compliance
      'Credit Risk', 'Market Risk', 'Operational Risk', 'Regulatory Compliance', 'Basel III',
      'Dodd-Frank', 'Anti-Money Laundering', 'AML', 'KYC', 'Credit Analysis', 'Loan Underwriting',
      'Insurance', 'Actuarial', 'Quantitative Analysis'
    ],
    
    general: [
      // Soft Skills
      'Communication', 'Written Communication', 'Verbal Communication', 'Public Speaking', 'Presentation',
      'Leadership', 'Team Leadership', 'Cross-functional Leadership', 'Problem Solving', 'Critical Thinking',
      'Analytical Thinking', 'Creative Thinking', 'Decision Making', 'Time Management', 'Organization',
      'Attention to Detail', 'Multitasking', 'Adaptability', 'Flexibility', 'Resilience',
      
      // Interpersonal Skills
      'Teamwork', 'Collaboration', 'Interpersonal Skills', 'Customer Service', 'Client Relations',
      'Stakeholder Engagement', 'Negotiation', 'Conflict Resolution', 'Emotional Intelligence',
      'Cultural Awareness', 'Diversity & Inclusion', 'Mentoring', 'Training', 'Coaching',
      
      // Project & Process Skills
      'Project Coordination', 'Project Planning', 'Resource Management', 'Quality Control',
      'Process Documentation', 'Standard Operating Procedures', 'Continuous Improvement',
      'Six Sigma', 'Lean Manufacturing', 'Kaizen', 'Change Management'
    ]
  };

  // Add keyword synonyms and variations for better matching
  private keywordSynonyms: { [key: string]: string[] } = {
    'JavaScript': ['js', 'javascript', 'ecmascript'],
    'TypeScript': ['ts', 'typescript'],
    'Python': ['python', 'py'],
    'React': ['react.js', 'reactjs'],
    'Node.js': ['nodejs', 'node'],
    'Vue.js': ['vue', 'vuejs'],
    'Angular': ['angularjs', 'angular.js'],
    'PostgreSQL': ['postgres', 'postgresql'],
    'MongoDB': ['mongo', 'mongodb'],
    'REST API': ['rest', 'restful', 'api', 'rest api', 'restful api'],
    'Machine Learning': ['ml', 'machine learning', 'artificial intelligence', 'ai'],
    'Project Management': ['pm', 'project management', 'project manager'],
    'Business Analysis': ['ba', 'business analyst', 'business analysis'],
    'Customer Relationship Management': ['crm'],
    'Electronic Health Records': ['ehr', 'emr', 'electronic medical records'],
    'Financial Analysis': ['financial analyst', 'financial analysis'],
    'Excel': ['microsoft excel', 'ms excel', 'spreadsheet'],
    'Communication': ['communications', 'communicating'],
    'Leadership': ['leader', 'leading', 'lead'],
    'Problem Solving': ['problem-solving', 'troubleshooting'],
    'Time Management': ['time-management', 'scheduling']
  };

  constructor() {
    // LocalCVAnalyzer initialized
  }

  // ATS-Critical Formatting Checks
  private checkATSFormatting(cvText: string): number {
    let score = 100;
    const issues: string[] = [];

    // Check for proper section headers
    const requiredSections = ['experience', 'education', 'skills'];
    const sectionHeaders = cvText.toLowerCase();
    
    requiredSections.forEach(section => {
      if (!sectionHeaders.includes(section) && !sectionHeaders.includes(section.replace('e', ''))) {
        score -= 15;
        issues.push(`Missing ${section} section`);
      }
    });

    // Check contact information
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
    const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
    
    if (!emailRegex.test(cvText)) {
      score -= 10;
      issues.push('Missing email address');
    }
    
    if (!phoneRegex.test(cvText)) {
      score -= 10;
      issues.push('Missing phone number');
    }

    // Check for dates in experience
    const dateRegex = /\d{4}|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec/gi;
    const dateMatches = cvText.match(dateRegex);
    if (!dateMatches || dateMatches.length < 2) {
      score -= 10;
      issues.push('Missing or insufficient date information');
    }

    // Check for bullet points or structured content
    const bulletRegex = /[•·▪▫‣⁃]|\*|\-\s|^\d+\./gm;
    const bulletMatches = cvText.match(bulletRegex);
    if (!bulletMatches || bulletMatches.length < 3) {
      score -= 15;
      issues.push('Poor structure - use bullet points for achievements');
    }

    return Math.max(score, 0);
  }

  // Keyword Density Analysis with improved matching
  private analyzeKeywords(cvText: string): { present: string[], missing: string[], density: number } {
    const text = cvText.toLowerCase();
    const words = text.split(/\s+/);
    const totalWords = words.length;
    
    // Detect industry context for better keyword prioritization
    const industryContext = this.detectIndustryContext(text);
    
    // Select relevant keywords based on industry context
    const relevantKeywords = this.getRelevantKeywords(industryContext);
    
    const presentKeywords: string[] = [];
    const missingKeywords: string[] = [];
    
    relevantKeywords.forEach((keyword, index) => {
      const keywordLower = keyword.toLowerCase();
      let found = false;
      let matchMethod = '';
      
      // Enhanced matching logic
      // 1. Direct exact match
      if (text.includes(keywordLower)) {
        found = true;
        matchMethod = 'direct';
      } 
      // 2. Word boundary match (more precise)
      else if (new RegExp(`\\b${keywordLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`).test(text)) {
        found = true;
        matchMethod = 'boundary';
      }
      // 3. Check synonyms
      else {
        const synonyms = this.keywordSynonyms[keyword] || [];
        for (const synonym of synonyms) {
          const synonymLower = synonym.toLowerCase();
          if (text.includes(synonymLower) || 
              new RegExp(`\\b${synonymLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`).test(text)) {
            found = true;
            matchMethod = 'synonym';
            break;
          }
        }
      }
      

      
      // 4. Compound term matching for multi-word keywords
      if (!found && keyword.includes(' ')) {
        const keywordParts = keyword.toLowerCase().split(' ');
        
        // Check if all parts are present (not necessarily adjacent)
        const allPartsFound = keywordParts.every(part => {
          return text.includes(part) || 
                 words.some(word => word.includes(part)) ||
                 new RegExp(`\\b${part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`).test(text);
        });
        
        if (allPartsFound) {
          found = true;
        }
        
        // Check for hyphenated versions
        if (!found) {
          const hyphenated = keyword.toLowerCase().replace(/\s+/g, '-');
          if (text.includes(hyphenated)) {
            found = true;
          }
        }
        
        // Check for concatenated versions (e.g., "JavaScript" vs "Java Script")
        if (!found) {
          const concatenated = keyword.toLowerCase().replace(/\s+/g, '');
          if (text.includes(concatenated)) {
            found = true;
          }
        }
      }
      
      if (found) {
        presentKeywords.push(keyword);
      } else {
        missingKeywords.push(keyword);
      }
    });

    // Remove duplicates and sort present keywords by relevance
    const uniquePresent = [...new Set(presentKeywords)];
    
    // More accurate keyword density calculation
    const keywordDensity = Math.min((uniquePresent.length / Math.max(totalWords * 0.02, 1)) * 100, 100);
    
    // Prioritize missing keywords based on CV content and industry relevance
    const prioritizedMissing = this.prioritizeMissingKeywords(missingKeywords, text, industryContext);
    
    // Emergency fallback if no keywords detected (should never happen with proper setup)
    if (uniquePresent.length === 0 && prioritizedMissing.length === 0) {
      const fallbackPresent = ['Communication', 'Leadership'];
      const fallbackMissing = ['Project Management', 'Problem Solving', 'JavaScript', 'Python', 'Excel'];
      return {
        present: fallbackPresent,
        missing: fallbackMissing,
        density: 1.0
      };
    }
    
    return {
      present: uniquePresent,
      missing: prioritizedMissing.slice(0, 12), // Top 12 most relevant missing keywords
      density: keywordDensity
    };
  }

  // Detect industry context from CV content
  private detectIndustryContext(text: string): string[] {
    const contexts: string[] = [];
    
    // Technology indicators
    const techTerms = ['software', 'developer', 'engineer', 'programming', 'code', 'technical', 'system', 'application', 'web', 'mobile', 'database', 'api'];
    if (techTerms.some(term => text.includes(term))) {
      contexts.push('technology');
    }
    
    // Business indicators
    const businessTerms = ['business', 'management', 'strategy', 'sales', 'marketing', 'consultant', 'analyst', 'operations', 'project'];
    if (businessTerms.some(term => text.includes(term))) {
      contexts.push('business');
    }
    
    // Healthcare indicators
    const healthTerms = ['healthcare', 'medical', 'nurse', 'doctor', 'patient', 'clinical', 'hospital', 'therapy'];
    if (healthTerms.some(term => text.includes(term))) {
      contexts.push('healthcare');
    }
    
    // Finance indicators
    const financeTerms = ['finance', 'financial', 'accounting', 'investment', 'banking', 'audit', 'budget', 'revenue'];
    if (financeTerms.some(term => text.includes(term))) {
      contexts.push('finance');
    }
    
    // Default to general if no specific context detected
    if (contexts.length === 0) {
      contexts.push('general');
    }
    
    return contexts;
  }

  // Get relevant keywords based on detected industry contexts
  private getRelevantKeywords(contexts: string[]): string[] {
    const keywords: string[] = [];
    
    // Always include general keywords
    if (this.atsKeywords.general && this.atsKeywords.general.length > 0) {
      keywords.push(...this.atsKeywords.general);
    }
    
    // Add industry-specific keywords based on context
    contexts.forEach(context => {
      switch (context) {
        case 'technology':
          keywords.push(...this.atsKeywords.technology.slice(0, 80));
          break;
        case 'business':
          keywords.push(...this.atsKeywords.business.slice(0, 60));
          break;
        case 'healthcare':
          keywords.push(...this.atsKeywords.healthcare.slice(0, 50));
          break;
        case 'finance':
          keywords.push(...this.atsKeywords.finance.slice(0, 50));
          break;
      }
    });
    
    // Remove duplicates
    return [...new Set(keywords)];
  }

  // Prioritize missing keywords based on CV content and industry relevance
  private prioritizeMissingKeywords(missingKeywords: string[], cvText: string, industryContext: string[] = ['general']): string[] {
    const text = cvText.toLowerCase();
    const keywordScores: { keyword: string; score: number }[] = [];
    
    missingKeywords.forEach(keyword => {
      let score = 0;
      const keywordLower = keyword.toLowerCase();
      
      // Higher priority for general business skills
      if (this.atsKeywords.general.includes(keyword)) {
        score += 10;
      }
      
      // Score based on detected industry context
      industryContext.forEach(context => {
        switch (context) {
          case 'technology':
            if (this.atsKeywords.technology.includes(keyword)) score += 15;
            break;
          case 'business':
            if (this.atsKeywords.business.includes(keyword)) score += 15;
            break;
          case 'healthcare':
            if (this.atsKeywords.healthcare.includes(keyword)) score += 15;
            break;
          case 'finance':
            if (this.atsKeywords.finance.includes(keyword)) score += 15;
            break;
        }
      });
      
      // Boost commonly required skills
      const highDemandSkills = [
        'Communication', 'Leadership', 'Problem Solving', 'Project Management', 'Excel',
        'SQL', 'Python', 'JavaScript', 'React', 'AWS', 'Git', 'Agile', 'Scrum'
      ];
      if (highDemandSkills.includes(keyword)) {
        score += 8;
      }
      
      // Boost if related terms are present
      const keywordParts = keywordLower.split(' ');
      keywordParts.forEach(part => {
        if (text.includes(part)) {
          score += 3;
        }
      });
      
      keywordScores.push({ keyword, score });
    });
    
    // Sort by score (highest first) and return keywords
    return keywordScores
      .sort((a, b) => b.score - a.score)
      .map(item => item.keyword);
  }

  // Experience Quality Assessment
  private assessExperience(cvText: string): number {
    let score = 50; // Base score
    const text = cvText.toLowerCase();

    // Check for quantified achievements
    const numberRegex = /\d+%|\d+\+|\$\d+|\d+k|\d+ million|\d+ years/gi;
    const quantifications = cvText.match(numberRegex);
    if (quantifications) {
      score += Math.min(quantifications.length * 5, 30);
    }

    // Check for action verbs
    const actionVerbs = [
      'achieved', 'managed', 'led', 'developed', 'implemented', 'created', 'designed',
      'improved', 'increased', 'reduced', 'optimized', 'delivered', 'built', 'launched'
    ];
    
    const verbCount = actionVerbs.filter(verb => text.includes(verb)).length;
    score += Math.min(verbCount * 3, 20);

    // Check for company names and job titles
    const jobTitleKeywords = ['manager', 'director', 'engineer', 'analyst', 'specialist', 'coordinator'];
    const titleCount = jobTitleKeywords.filter(title => text.includes(title)).length;
    score += Math.min(titleCount * 2, 10);

    return Math.min(score, 100);
  }

  // Skills Section Analysis - Enhanced
  private analyzeSkills(cvText: string): number {
    const text = cvText.toLowerCase();
    let score = 30; // Lower base score to be more realistic

    // Check for dedicated skills section
    const hasSkillsSection = text.includes('skills') || text.includes('technical skills') || text.includes('competencies');
    if (hasSkillsSection) {
      score += 15;
    }

    // Technical skills analysis - more comprehensive
    const allTechSkills = this.atsKeywords.technology;
    let techSkillsFound = 0;
    allTechSkills.forEach(skill => {
      if (text.includes(skill.toLowerCase())) {
        techSkillsFound++;
      }
      // Check synonyms
      const synonyms = this.keywordSynonyms[skill] || [];
      synonyms.forEach(synonym => {
        if (text.includes(synonym.toLowerCase())) {
          techSkillsFound++;
        }
      });
    });
    score += Math.min(techSkillsFound * 2, 30);

    // Soft skills analysis - more comprehensive
    const allSoftSkills = this.atsKeywords.general;
    let softSkillsFound = 0;
    allSoftSkills.forEach(skill => {
      if (text.includes(skill.toLowerCase())) {
        softSkillsFound++;
      }
    });
    score += Math.min(softSkillsFound * 3, 25);

    // Business skills analysis
    const businessSkills = this.atsKeywords.business;
    let businessSkillsFound = 0;
    businessSkills.forEach(skill => {
      if (text.includes(skill.toLowerCase())) {
        businessSkillsFound++;
      }
    });
    score += Math.min(businessSkillsFound * 2, 20);

    // Bonus for skill diversity (having skills from multiple categories)
    const hasBusinessSkills = businessSkillsFound > 0;
    const hasTechSkills = techSkillsFound > 0;
    const hasSoftSkills = softSkillsFound > 0;
    
    const skillCategoryCount = [hasBusinessSkills, hasTechSkills, hasSoftSkills].filter(Boolean).length;
    if (skillCategoryCount >= 2) {
      score += 10;
    }
    if (skillCategoryCount === 3) {
      score += 5; // Additional bonus for well-rounded skills
    }

    return Math.min(score, 100);
  }

  // Education Assessment
  private assessEducation(cvText: string): number {
    const text = cvText.toLowerCase();
    let score = 60; // Base score assuming basic education

    // Degree keywords
    const degrees = ['bachelor', 'master', 'phd', 'doctorate', 'degree', 'diploma', 'certificate'];
    const degreeCount = degrees.filter(degree => text.includes(degree)).length;
    score += degreeCount * 10;

    // Institution indicators
    const institutionKeywords = ['university', 'college', 'institute', 'school'];
    const institutionCount = institutionKeywords.filter(inst => text.includes(inst)).length;
    score += institutionCount * 5;

    // GPA or honors
    if (text.includes('gpa') || text.includes('honors') || text.includes('magna cum laude')) {
      score += 10;
    }

    return Math.min(score, 100);
  }

  // Readability Assessment
  private assessReadability(cvText: string): number {
    const sentences = cvText.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = cvText.split(/\s+/).filter(w => w.length > 0);
    
    if (sentences.length === 0 || words.length === 0) return 0;

    const avgWordsPerSentence = words.length / sentences.length;
    const avgSyllablesPerWord = this.estimateSyllables(cvText) / words.length;

    // Flesch Reading Ease approximation
    const fleschScore = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord);
    
    // Convert to 0-100 scale where higher is better for CVs
    return Math.round(Math.max(Math.min(fleschScore, 100), 0));
  }

  private estimateSyllables(text: string): number {
    const words = text.toLowerCase().split(/\s+/);
    let syllableCount = 0;

    words.forEach(word => {
      // Remove punctuation
      word = word.replace(/[^a-z]/g, '');
      if (word.length === 0) return;

      // Estimate syllables (simplified)
      const vowelGroups = word.match(/[aeiouy]+/g);
      syllableCount += vowelGroups ? vowelGroups.length : 1;
    });

    return syllableCount;
  }

  // Generate Improvement Suggestions
  private generateSuggestions(cvText: string, scores: any, keywords: any): CVSuggestion[] {
    const suggestions: CVSuggestion[] = [];

    // ATS Formatting suggestions
    if (scores.formatting < 80) {
      suggestions.push({
        id: 'ats-formatting',
        category: 'formatting',
        priority: 'high',
        title: 'Improve ATS Compatibility',
        description: 'Add clear section headers like "Professional Experience", "Education", and "Skills". Use bullet points for achievements.',
        impact: 'Increases chance of passing ATS filters by 40%'
      });
    }

    // Keyword suggestions - Enhanced
    if (keywords.present.length < 15) {
      const keywordSuggestion = this.generateKeywordSuggestion(cvText, keywords);
      suggestions.push({
        id: 'keyword-optimization',
        category: 'keywords',
        priority: keywords.present.length < 8 ? 'high' : 'medium',
        title: keywordSuggestion.title,
        description: keywordSuggestion.description,
        impact: keywordSuggestion.impact
      });
    }

    // Experience suggestions
    if (scores.experience < 70) {
      suggestions.push({
        id: 'quantify-achievements',
        category: 'content',
        priority: 'medium',
        title: 'Quantify Your Achievements',
        description: 'Add numbers, percentages, and metrics. Example: "Increased sales by 25%" instead of "Increased sales".',
        impact: 'Makes achievements more credible and impressive'
      });
    }

    // Skills suggestions
    if (scores.skills < 70) {
      suggestions.push({
        id: 'skills-section',
        category: 'skills',
        priority: 'medium',
        title: 'Enhance Skills Section',
        description: 'Add both technical and soft skills. Include proficiency levels and certifications.',
        impact: 'Better matches job requirements and ATS searches'
      });
    }

    return suggestions;
  }

  // Generate specific keyword suggestions based on CV content and industry
  private generateKeywordSuggestion(cvText: string, keywords: any): { title: string; description: string; impact: string } {
    const text = cvText.toLowerCase();
    const presentCount = keywords.present.length;
    const topMissing = keywords.missing.slice(0, 8);
    
    // Detect industry context
    let industry = 'general';
    if (text.includes('software') || text.includes('developer') || text.includes('engineer') || text.includes('programming')) {
      industry = 'technology';
    } else if (text.includes('business') || text.includes('manager') || text.includes('analyst') || text.includes('marketing')) {
      industry = 'business';
    } else if (text.includes('healthcare') || text.includes('medical') || text.includes('nurse') || text.includes('patient')) {
      industry = 'healthcare';
    } else if (text.includes('finance') || text.includes('accounting') || text.includes('banking') || text.includes('investment')) {
      industry = 'finance';
    }

    // Industry-specific suggestions
    const industryKeywords: { [key: string]: string[] } = {
      technology: ['Communication', 'Problem Solving', 'Git', 'Agile', 'JavaScript', 'Python', 'SQL', 'API'],
      business: ['Project Management', 'Leadership', 'Strategic Planning', 'Excel', 'Communication', 'Data Analysis'],
      healthcare: ['Patient Care', 'HIPAA', 'Clinical Assessment', 'Communication', 'Team Collaboration'],
      finance: ['Financial Analysis', 'Excel', 'Risk Management', 'Compliance', 'Attention to Detail'],
      general: ['Communication', 'Leadership', 'Problem Solving', 'Project Management', 'Team Collaboration']
    };

    const relevantKeywords = industryKeywords[industry] || industryKeywords.general;
    const priorityMissing = topMissing.filter((keyword: string) => relevantKeywords.includes(keyword));
    const finalSuggestions = priorityMissing.length > 0 ? priorityMissing : topMissing;

    if (presentCount < 5) {
      return {
        title: 'Critical: Add Essential Keywords',
        description: `Your CV only contains ${presentCount} relevant keywords. Add these high-priority terms: ${finalSuggestions.slice(0, 5).join(', ')}. Include them naturally in your experience descriptions and skills section.`,
        impact: 'Essential for passing ATS filters - could increase visibility by 60%'
      };
    } else if (presentCount < 10) {
      return {
        title: 'Boost Keyword Optimization',
        description: `Add ${finalSuggestions.slice(0, 4).join(', ')} to strengthen your ${industry} profile. Focus on skills that match your actual experience.`,
        impact: 'Improves ATS ranking and recruiter searchability by 35%'
      };
    } else {
      return {
        title: 'Fine-tune Keyword Strategy',
        description: `Consider adding: ${finalSuggestions.slice(0, 3).join(', ')} to reach optimal keyword density (1-2%).`,
        impact: 'Maximizes ATS compatibility and search visibility'
      };
    }
  }

  // Detect if the document is not a CV/resume
  private detectNonCV(cvText: string): boolean {
    const text = cvText.toLowerCase();
    // Expanded section detection for modern/LinkedIn CVs
    const hasExperience = text.includes('experience') || text.includes('work experience') || text.includes('professional experience') || text.includes('employment history') || text.includes('volunteer experience');
    const hasEducation = text.includes('education') || text.includes('academic background');
    const hasSkills = text.includes('skills') || text.includes('core competencies') || text.includes('key skills');
    const hasCerts = text.includes('certification') || text.includes('licenses & certifications') || text.includes('licenses and certifications');
    const hasAbout = text.includes('about') || text.includes('summary') || text.includes('profile');
    const hasAccomplishments = text.includes('accomplishments') || text.includes('projects') || text.includes('publications');
    // LinkedIn-specific heuristic
    const hasLinkedIn = text.includes('linkedin.com/in/') || text.includes('linkedin profile');
    // Check for contact info
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
    const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
    const hasEmail = emailRegex.test(cvText);
    const hasPhone = phoneRegex.test(cvText);
    // If missing all sections and contact info, or very short, or contains insurance/legal keywords, flag as not a CV
    const insuranceKeywords = ['policy number', 'insurance company', 'claim', 'premium', 'coverage', 'beneficiary', 'underwriter', 'endorsement', 'exclusion', 'deductible'];
    const legalKeywords = ['agreement', 'contract', 'witnesseth', 'hereinafter', 'party of the first part', 'party of the second part', 'notary', 'affidavit', 'deed', 'testament'];
    const isInsuranceDoc = insuranceKeywords.some(k => text.includes(k));
    const isLegalDoc = legalKeywords.some(k => text.includes(k));
    // Accept as CV if LinkedIn profile detected and at least 2 major sections
    const linkedInSections = [hasExperience, hasEducation, hasSkills, hasCerts, hasAbout, hasAccomplishments].filter(Boolean).length;
    if (hasLinkedIn && linkedInSections >= 2) {
      return false; // treat as valid CV
    }
    if ((!hasExperience && !hasEducation && !hasSkills && !hasEmail && !hasPhone) || cvText.length < 200 || isInsuranceDoc || isLegalDoc) {
      return true;
    }
    return false;
  }

  // Main Analysis Function
  public analyzeCV(request: CVAnalysisRequest): CVAnalysisResponse {
    const { cvText } = request;
    
    // Detect non-CV documents
    if (this.detectNonCV(cvText)) {
      return {
        id: crypto.randomUUID(),
        cvId: request.cvId,
        userId: request.userId,
        provider: 'local',
        model: 'ats-analyzer-v1',
        analysisType: request.analysisType,
        overallScore: 0,
        atsCompatibility: 0,
        readabilityScore: 0,
        scores: {
          formatting: 0,
          keywords: 0,
          experience: 0,
          skills: 0,
          education: 0,
          achievements: 0
        },
        strengths: [],
        weaknesses: ['This document does not appear to be a CV/resume. Please upload a valid CV.'],
        suggestions: [],
        missingKeywords: [],
        presentKeywords: [],
        keywordDensity: 0,
        analysisDate: new Date().toISOString(),
        processingTime: 50,
        tokenUsage: {
          input: Math.ceil(cvText.length / 4),
          output: 0,
          cost: 0
        }
      };
    }

    console.log('🔍 Running comprehensive ATS-compliant CV analysis...');
    
    // Perform all analyses
    const formattingScore = this.checkATSFormatting(cvText);
    const keywordAnalysis = this.analyzeKeywords(cvText);
    const experienceScore = this.assessExperience(cvText);
    const skillsScore = this.analyzeSkills(cvText);
    const educationScore = this.assessEducation(cvText);
    const readabilityScore = this.assessReadability(cvText);

    // Calculate weighted overall score
    const overallScore = Math.round(
      (formattingScore * 0.25) +
      (experienceScore * 0.30) +
      (skillsScore * 0.20) +
      (educationScore * 0.15) +
      (readabilityScore * 0.10)
    );

    // Improved ATS compatibility calculation
    const keywordScore = Math.min(keywordAnalysis.present.length * 4, 100); // More realistic scoring
    const atsCompatibility = Math.round(
      (formattingScore * 0.35) +
      (keywordScore * 0.35) +
      (experienceScore * 0.30)
    );

    const scores = {
      formatting: formattingScore,
      keywords: keywordScore,
      experience: experienceScore,
      skills: skillsScore,
      education: educationScore,
      achievements: experienceScore > 70 ? experienceScore : Math.max(experienceScore - 10, 0)
    };

    // Generate suggestions
    const suggestions = this.generateSuggestions(cvText, scores, keywordAnalysis);

    // Generate balanced strengths and weaknesses analysis
    const strengths: string[] = [];
    const weaknesses: string[] = [];

    // Prioritize strengths and weaknesses based on overall performance
    const potentialStrengths: { text: string; priority: number }[] = [];
    const potentialWeaknesses: { text: string; priority: number }[] = [];
    
    // ATS Formatting Analysis
    if (formattingScore > 75) {
      potentialStrengths.push({ text: 'Excellent ATS-friendly structure with clear section headers and proper formatting', priority: 1 });
    } else if (formattingScore > 55) {
      potentialStrengths.push({ text: 'Good document structure with identifiable sections', priority: 3 });
    } else {
      potentialWeaknesses.push({ text: 'Improve section organization and formatting for better ATS compatibility', priority: 1 });
    }

    // Keyword Optimization Analysis
    if (keywordAnalysis.present.length > 8) {
      potentialStrengths.push({ text: `Strong keyword optimization with ${keywordAnalysis.present.length} relevant industry terms`, priority: 1 });
    } else if (keywordAnalysis.present.length > 4) {
      potentialStrengths.push({ text: `Contains ${keywordAnalysis.present.length} industry-relevant keywords`, priority: 2 });
    } else {
      potentialWeaknesses.push({ text: 'Add more industry-relevant keywords to improve searchability', priority: 1 });
    }

    // Experience Quality Analysis
    const numberRegex = /\d+%|\d+\+|\$\d+|\d+k|\d+ million|\d+ years/gi;
    const quantifications = cvText.match(numberRegex);
    if (experienceScore > 75) {
      potentialStrengths.push({ text: `Strong professional experience with ${quantifications?.length || 0} quantified achievements`, priority: 1 });
    } else if (experienceScore > 55) {
      potentialStrengths.push({ text: 'Solid professional background with clear work history', priority: 2 });
    } else {
      potentialWeaknesses.push({ text: 'Quantify achievements with specific metrics and numbers', priority: 2 });
    }

    // Skills Section Analysis
    if (skillsScore > 75) {
      potentialStrengths.push({ text: 'Comprehensive skills section covering technical and soft skills', priority: 2 });
    } else if (skillsScore > 55) {
      potentialStrengths.push({ text: 'Good skills representation with relevant competencies', priority: 3 });
    } else {
      potentialWeaknesses.push({ text: 'Enhance skills section with more specific technical and soft skills', priority: 2 });
    }

    // Education Analysis (only add if genuinely strong)
    if (educationScore > 80) {
      potentialStrengths.push({ text: 'Strong educational background with clear credentials', priority: 2 });
    } else if (educationScore < 50) {
      potentialWeaknesses.push({ text: 'Strengthen educational background with relevant qualifications', priority: 3 });
    }

    // Action Verbs Analysis
    const actionVerbs = ['achieved', 'managed', 'led', 'developed', 'implemented', 'created', 'designed', 'improved', 'increased', 'reduced', 'optimized', 'delivered', 'built', 'launched'];
    const verbCount = actionVerbs.filter(verb => cvText.toLowerCase().includes(verb)).length;
    if (verbCount > 8) {
      potentialStrengths.push({ text: `Effective use of ${verbCount} strong action verbs throughout descriptions`, priority: 2 });
    } else if (verbCount < 3) {
      potentialWeaknesses.push({ text: 'Strengthen action verbs in experience descriptions for more impact', priority: 3 });
    }

    // Contact Information Analysis (only if complete)
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
    const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
    if (emailRegex.test(cvText) && phoneRegex.test(cvText)) {
      potentialStrengths.push({ text: 'Complete contact information provided for recruiter outreach', priority: 3 });
    } else if (!emailRegex.test(cvText) && !phoneRegex.test(cvText)) {
      potentialWeaknesses.push({ text: 'Add complete contact information (email and phone number)', priority: 1 });
    }

    // Sort by priority and select top items
    potentialStrengths.sort((a, b) => a.priority - b.priority);
    potentialWeaknesses.sort((a, b) => a.priority - b.priority);
    
    // Limit strengths and weaknesses based on overall score
    let maxStrengths = 1; // Default for low scores
    let maxWeaknesses = 3; // Default for low scores
    
    if (overallScore > 70) {
      maxStrengths = 3;
      maxWeaknesses = 1;
    } else if (overallScore > 50) {
      maxStrengths = 2;
      maxWeaknesses = 2;
    }
    
    // Add top strengths and weaknesses up to the limits
    strengths.push(...potentialStrengths.slice(0, maxStrengths).map(s => s.text));
    weaknesses.push(...potentialWeaknesses.slice(0, maxWeaknesses).map(w => w.text));

    // Ensure at least one strength and one weakness
    if (strengths.length === 0) {
      if (cvText.length > 200) {
        strengths.push('Professional presentation with comprehensive content');
      } else {
        strengths.push('Basic professional information provided');
      }
    }
    
    if (weaknesses.length === 0) {
      weaknesses.push('Consider professional review for optimization opportunities');
    }

    console.log('✅ Analysis complete:', { overallScore, atsCompatibility, keywordCount: keywordAnalysis.present.length });

    return {
      id: crypto.randomUUID(),
      cvId: request.cvId,
      userId: request.userId,
      provider: 'local',
      model: 'ats-analyzer-v1',
      analysisType: request.analysisType,
      
      overallScore,
      atsCompatibility,
      readabilityScore,
      
      scores,
      
      strengths,
      weaknesses,
      suggestions,
      
      missingKeywords: keywordAnalysis.missing,
      presentKeywords: keywordAnalysis.present,
      keywordDensity: keywordAnalysis.density,
      
      analysisDate: new Date().toISOString(),
      processingTime: 150, // Simulated processing time
      tokenUsage: {
        input: Math.ceil(cvText.length / 4),
        output: 200,
        cost: 0 // Free local analysis
      }
    };
  }
} 