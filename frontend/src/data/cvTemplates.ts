export interface CVTemplate {
  id: string;
  name: string;
  description: string;
  category: 'basic' | 'professional' | 'executive' | 'creative' | 'academic' | 'modern' | 'minimalist' | 'tech' | 'business' | 'healthcare';
  tier: 'free' | 'starter' | 'professional' | 'career-pro' | 'elite';
  preview: string;
  layout: 'single-column' | 'two-column' | 'modern' | 'classic' | 'creative';
  features: string[];
  isPopular?: boolean;
  colorScheme?: string;
  atsScore?: number;
  industrySpecific?: string[];
}

export const cvTemplates: CVTemplate[] = [
  // FREE TIER - Top 5 Free Templates
  {
    id: 'basic-modern',
    name: 'Basic Modern',
    description: 'Clean, simple template perfect for entry-level positions',
    category: 'basic',
    tier: 'free',
    preview: '/templates/basic-modern-preview.png',
    layout: 'single-column',
    features: ['Clean typography', 'Easy to scan', 'ATS-friendly', 'Professional appearance'],
    isPopular: true,
    colorScheme: 'blue',
    atsScore: 95
  },
  {
    id: 'simple-clean',
    name: 'Simple Clean',
    description: 'Minimalist design focusing on content over decoration',
    category: 'minimalist',
    tier: 'free',
    preview: '/templates/simple-clean-preview.png',
    layout: 'single-column',
    features: ['Minimal design', 'Content-focused', 'Fast loading', 'Universal appeal'],
    colorScheme: 'gray',
    atsScore: 98
  },
  {
    id: 'attractive-clean',
    name: 'Attractive Clean',
    description: 'Well-organized layout with modern fonts and subtle accents',
    category: 'modern',
    tier: 'free',
    preview: '/templates/attractive-clean-preview.png',
    layout: 'modern',
    features: ['Modern fonts', 'Subtle accents', 'Professional', 'Easy to read'],
    colorScheme: 'emerald',
    atsScore: 92
  },
  {
    id: 'perfect-resume',
    name: 'Perfect Resume',
    description: 'Balanced clarity, design, and structure for any industry',
    category: 'professional',
    tier: 'free',
    preview: '/templates/perfect-resume-preview.png',
    layout: 'classic',
    features: ['Balanced design', 'Industry universal', 'Clear structure', 'Professional'],
    colorScheme: 'amber',
    atsScore: 96
  },
  {
    id: 'unique-clean',
    name: 'Unique Clean',
    description: 'Modern fonts with creative flair and professionalism',
    category: 'creative',
    tier: 'free',
    preview: '/templates/unique-clean-preview.png',
    layout: 'creative',
    features: ['Creative flair', 'Professional', 'Modern fonts', 'Unique style'],
    colorScheme: 'rose',
    atsScore: 88
  },

  // STARTER TIER - Top 10 Starter Templates
  {
    id: 'harvard-classic',
    name: 'Harvard Classic',
    description: 'The most popular professional template with proven success rate',
    category: 'professional',
    tier: 'starter',
    preview: '/templates/harvard-classic-preview.png',
    layout: 'classic',
    features: ['Proven ATS success', 'Professional appearance', 'Clear hierarchy', 'Industry standard'],
    isPopular: true,
    colorScheme: 'amber',
    atsScore: 99,
    industrySpecific: ['Finance', 'Consulting', 'Corporate']
  },
  {
    id: 'modern-professional',
    name: 'Modern Professional',
    description: 'Clean, modern and professional with excellent customization',
    category: 'professional',
    tier: 'starter',
    preview: '/templates/modern-professional-preview.png',
    layout: 'modern',
    features: ['Fully customizable', 'Smart objects', 'Modern design', 'Professional'],
    colorScheme: 'emerald',
    atsScore: 94
  },
  {
    id: 'creative-clean',
    name: 'Creative Clean',
    description: 'Professional design that increases interview chances',
    category: 'creative',
    tier: 'starter',
    preview: '/templates/creative-clean-preview.png',
    layout: 'creative',
    features: ['Professional design', 'Interview focused', 'Clear structure', 'Creative elements'],
    colorScheme: 'rose',
    atsScore: 90
  },
  {
    id: 'attractive-cv',
    name: 'Attractive CV',
    description: 'Perfect blend of clarity, design, and structure',
    category: 'professional',
    tier: 'starter',
    preview: '/templates/attractive-cv-preview.png',
    layout: 'single-column',
    features: ['Clarity focus', 'Balanced design', 'Professional structure', 'Universal appeal'],
    colorScheme: 'blue',
    atsScore: 93
  },
  {
    id: 'business-resume',
    name: 'Business Resume',
    description: 'Professional and polished layout for corporate roles',
    category: 'business',
    tier: 'starter',
    preview: '/templates/business-resume-preview.png',
    layout: 'classic',
    features: ['Corporate focus', 'Polished design', 'Structured sections', 'Business oriented'],
    colorScheme: 'amber',
    atsScore: 97,
    industrySpecific: ['Business', 'Management', 'Sales']
  },
  {
    id: 'minimalist-formal',
    name: 'Minimalist Formal',
    description: 'Elegant, simple business A4 format for job hunting',
    category: 'minimalist',
    tier: 'starter',
    preview: '/templates/minimalist-formal-preview.png',
    layout: 'single-column',
    features: ['Elegant design', 'A4 format', 'Business focused', 'Minimalist'],
    colorScheme: 'gray',
    atsScore: 98
  },
  {
    id: 'simple-creative',
    name: 'Simple Creative',
    description: 'Professional, creative, and simple - very attractive',
    category: 'creative',
    tier: 'starter',
    preview: '/templates/simple-creative-preview.png',
    layout: 'creative',
    features: ['Professional', 'Creative elements', 'Simple design', 'Attractive'],
    colorScheme: 'rose',
    atsScore: 89
  },
  {
    id: 'perfect-clean-cv',
    name: 'Perfect Clean CV',
    description: 'Professional design that stands out from the stack',
    category: 'professional',
    tier: 'starter',
    preview: '/templates/perfect-clean-cv-preview.png',
    layout: 'single-column',
    features: ['Professional design', 'Stand out', 'Clear structure', 'Clean layout'],
    colorScheme: 'blue',
    atsScore: 95
  },
  {
    id: 'modern-cv',
    name: 'Modern CV',
    description: 'Clean, modern and professional with smart objects',
    category: 'modern',
    tier: 'starter',
    preview: '/templates/modern-cv-preview.png',
    layout: 'modern',
    features: ['Smart objects', 'Modern design', 'Professional', 'Customizable'],
    colorScheme: 'emerald',
    atsScore: 91
  },
  {
    id: 'creative-professional',
    name: 'Creative Professional',
    description: 'Fully customizable with creative style and smart objects',
    category: 'creative',
    tier: 'starter',
    preview: '/templates/creative-professional-preview.png',
    layout: 'creative',
    features: ['Fully customizable', 'Creative style', 'Smart objects', 'Professional'],
    colorScheme: 'rose',
    atsScore: 87
  },

  // PROFESSIONAL TIER - Top 10 Professional Templates
  {
    id: 'executive-modern',
    name: 'Executive Modern',
    description: 'Sophisticated template for senior-level positions',
    category: 'executive',
    tier: 'professional',
    preview: '/templates/executive-modern-preview.png',
    layout: 'two-column',
    features: ['Executive appearance', 'Two-column layout', 'Advanced formatting', 'Senior level'],
    colorScheme: 'purple',
    atsScore: 96,
    industrySpecific: ['Executive', 'Senior Management', 'C-Suite']
  },
  {
    id: 'creative-portfolio',
    name: 'Creative Portfolio',
    description: 'Stand out with this creative template for design and marketing roles',
    category: 'creative',
    tier: 'professional',
    preview: '/templates/creative-portfolio-preview.png',
    layout: 'creative',
    features: ['Creative design', 'Portfolio sections', 'Visual appeal', 'Design focused'],
    colorScheme: 'rose',
    atsScore: 85,
    industrySpecific: ['Design', 'Marketing', 'Creative']
  },
  {
    id: 'minimalist',
    name: 'Minimalist',
    description: 'Clean and minimal template focusing on content over design',
    category: 'minimalist',
    tier: 'professional',
    preview: '/templates/minimalist-preview.png',
    layout: 'single-column',
    features: ['Minimal design', 'Content-focused', 'Fast loading', 'Clean typography'],
    colorScheme: 'gray',
    atsScore: 99
  },
  {
    id: 'aesthetic-style',
    name: 'Aesthetic Style',
    description: 'Creative style template suitable for any purpose',
    category: 'creative',
    tier: 'professional',
    preview: '/templates/aesthetic-style-preview.png',
    layout: 'creative',
    features: ['Creative style', 'Universal purpose', 'Aesthetic design', 'Customizable'],
    colorScheme: 'rose',
    atsScore: 86
  },
  {
    id: 'stunning-cv',
    name: 'Stunning CV',
    description: 'Professional design that creates lasting impressions',
    category: 'professional',
    tier: 'professional',
    preview: '/templates/stunning-cv-preview.png',
    layout: 'modern',
    features: ['Stunning design', 'Lasting impression', 'Professional', 'Modern layout'],
    colorScheme: 'emerald',
    atsScore: 93
  },
  {
    id: 'best-elegant',
    name: 'Best Elegant',
    description: 'Modern resume with clear headings and concise sections',
    category: 'executive',
    tier: 'professional',
    preview: '/templates/best-elegant-preview.png',
    layout: 'classic',
    features: ['Elegant design', 'Clear headings', 'Concise sections', 'Modern typography'],
    colorScheme: 'amber',
    atsScore: 97
  },
  {
    id: 'perfect-best',
    name: 'Perfect Best',
    description: 'Stylish resume combining visual appeal with professional structure',
    category: 'creative',
    tier: 'professional',
    preview: '/templates/perfect-best-preview.png',
    layout: 'creative',
    features: ['Visual appeal', 'Professional structure', 'Stylish design', 'Creative industry'],
    colorScheme: 'rose',
    atsScore: 88
  },
  {
    id: 'tech-focused',
    name: 'Tech Focused',
    description: 'Specialized template for technology and engineering roles',
    category: 'tech',
    tier: 'professional',
    preview: '/templates/tech-focused-preview.png',
    layout: 'modern',
    features: ['Tech optimized', 'Skills focused', 'Project showcase', 'Modern design'],
    colorScheme: 'blue',
    atsScore: 94,
    industrySpecific: ['Technology', 'Engineering', 'Software Development']
  },
  {
    id: 'healthcare-professional',
    name: 'Healthcare Professional',
    description: 'Specialized template for healthcare and medical professionals',
    category: 'healthcare',
    tier: 'professional',
    preview: '/templates/healthcare-professional-preview.png',
    layout: 'single-column',
    features: ['Healthcare focused', 'Clinical experience', 'Certifications', 'Professional'],
    colorScheme: 'emerald',
    atsScore: 96,
    industrySpecific: ['Healthcare', 'Medical', 'Nursing']
  },
  {
    id: 'academic-research',
    name: 'Academic Research',
    description: 'Specialized template for academic and research positions',
    category: 'academic',
    tier: 'professional',
    preview: '/templates/academic-research-preview.png',
    layout: 'single-column',
    features: ['Academic sections', 'Publication lists', 'Research focus', 'Scholarly design'],
    colorScheme: 'blue',
    atsScore: 95,
    industrySpecific: ['Academic', 'Research', 'Education']
  },

  // CAREER PRO TIER - Top 5 Career Pro Templates
  {
    id: 'executive-premium',
    name: 'Executive Premium',
    description: 'Ultimate executive template with all premium features',
    category: 'executive',
    tier: 'career-pro',
    preview: '/templates/executive-premium-preview.png',
    layout: 'two-column',
    features: ['Premium design', 'Custom sections', 'Advanced controls', 'Executive level'],
    colorScheme: 'purple',
    atsScore: 98,
    industrySpecific: ['Executive', 'C-Suite', 'Board Level']
  },
  {
    id: 'creative-designer',
    name: 'Creative Designer',
    description: 'Advanced creative template for design professionals',
    category: 'creative',
    tier: 'career-pro',
    preview: '/templates/creative-designer-preview.png',
    layout: 'creative',
    features: ['Advanced design', 'Portfolio integration', 'Custom branding', 'Designer focused'],
    colorScheme: 'rose',
    atsScore: 87,
    industrySpecific: ['Design', 'Creative', 'Art Direction']
  },
  {
    id: 'tech-lead',
    name: 'Tech Lead',
    description: 'Advanced template for technology leadership roles',
    category: 'tech',
    tier: 'career-pro',
    preview: '/templates/tech-lead-preview.png',
    layout: 'two-column',
    features: ['Leadership focus', 'Technical depth', 'Team management', 'Strategic thinking'],
    colorScheme: 'blue',
    atsScore: 95,
    industrySpecific: ['Technology Leadership', 'Engineering Management', 'CTO']
  },
  {
    id: 'consultant-elite',
    name: 'Consultant Elite',
    description: 'Premium template for consulting and advisory roles',
    category: 'business',
    tier: 'career-pro',
    preview: '/templates/consultant-elite-preview.png',
    layout: 'classic',
    features: ['Consulting focus', 'Client results', 'Strategic thinking', 'Professional prestige'],
    colorScheme: 'amber',
    atsScore: 97,
    industrySpecific: ['Consulting', 'Advisory', 'Strategy']
  },
  {
    id: 'research-scientist',
    name: 'Research Scientist',
    description: 'Specialized template for research and scientific positions',
    category: 'academic',
    tier: 'career-pro',
    preview: '/templates/research-scientist-preview.png',
    layout: 'single-column',
    features: ['Research focus', 'Publication tracking', 'Grant experience', 'Scientific rigor'],
    colorScheme: 'blue',
    atsScore: 96,
    industrySpecific: ['Research', 'Science', 'PhD Level']
  },

  // ELITE EXECUTIVE TIER - Top 2 Elite Templates
  {
    id: 'harvard-elite',
    name: 'Harvard Elite',
    description: 'Ultimate Harvard template with custom branding and advanced features',
    category: 'executive',
    tier: 'elite',
    preview: '/templates/harvard-elite-preview.png',
    layout: 'classic',
    features: ['Custom branding', 'Advanced formatting', 'Premium support', 'Ultimate design'],
    colorScheme: 'amber',
    atsScore: 99,
    industrySpecific: ['Executive', 'C-Suite', 'Board Level']
  },
  {
    id: 'executive-ultimate',
    name: 'Executive Ultimate',
    description: 'Ultimate executive template with all premium features and custom branding',
    category: 'executive',
    tier: 'elite',
    preview: '/templates/executive-ultimate-preview.png',
    layout: 'two-column',
    features: ['Ultimate design', 'Custom branding', 'Premium support', 'Executive prestige'],
    colorScheme: 'purple',
    atsScore: 99,
    industrySpecific: ['CEO', 'CFO', 'CTO', 'Board Level']
  }
];

// Template access by subscription tier
export const getTemplatesByTier = (tier: string): CVTemplate[] => {
  const tierOrder = ['free', 'starter', 'professional', 'career-pro', 'elite'];
  const userTierIndex = tierOrder.indexOf(tier);
  
  if (userTierIndex === -1) return [];
  
  return cvTemplates.filter(template => {
    const templateTierIndex = tierOrder.indexOf(template.tier);
    return templateTierIndex <= userTierIndex;
  });
};

// Get template by ID
export const getTemplateById = (id: string): CVTemplate | undefined => {
  return cvTemplates.find(template => template.id === id);
};

// Get templates by category
export const getTemplatesByCategory = (category: string): CVTemplate[] => {
  return cvTemplates.filter(template => template.category === category);
};

// Get popular templates
export const getPopularTemplates = (): CVTemplate[] => {
  return cvTemplates.filter(template => template.isPopular);
};

// Get templates by industry
export const getTemplatesByIndustry = (industry: string): CVTemplate[] => {
  return cvTemplates.filter(template => 
    template.industrySpecific?.includes(industry)
  );
};

// Template categories for filtering
export const templateCategories = [
  { id: 'all', name: 'All Templates', count: cvTemplates.length },
  { id: 'professional', name: 'Professional', count: cvTemplates.filter(t => t.category === 'professional').length },
  { id: 'creative', name: 'Creative', count: cvTemplates.filter(t => t.category === 'creative').length },
  { id: 'modern', name: 'Modern', count: cvTemplates.filter(t => t.category === 'modern').length },
  { id: 'executive', name: 'Executive', count: cvTemplates.filter(t => t.category === 'executive').length },
  { id: 'minimalist', name: 'Minimalist', count: cvTemplates.filter(t => t.category === 'minimalist').length },
  { id: 'basic', name: 'Basic', count: cvTemplates.filter(t => t.category === 'basic').length },
  { id: 'business', name: 'Business', count: cvTemplates.filter(t => t.category === 'business').length },
  { id: 'tech', name: 'Tech', count: cvTemplates.filter(t => t.category === 'tech').length },
  { id: 'academic', name: 'Academic', count: cvTemplates.filter(t => t.category === 'academic').length },
  { id: 'healthcare', name: 'Healthcare', count: cvTemplates.filter(t => t.category === 'healthcare').length }
]; 