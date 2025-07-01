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
    colorScheme: 'blue'
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
    colorScheme: 'gray'
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
    colorScheme: 'emerald'
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
    colorScheme: 'amber'
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
    colorScheme: 'rose'
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
    colorScheme: 'amber'
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
    colorScheme: 'emerald'
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
    colorScheme: 'rose'
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
    colorScheme: 'blue'
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
    colorScheme: 'amber'
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
    colorScheme: 'gray'
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
    colorScheme: 'rose'
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
    colorScheme: 'blue'
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
    colorScheme: 'emerald'
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
    colorScheme: 'rose'
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
    colorScheme: 'purple'
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
    colorScheme: 'rose'
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
    colorScheme: 'gray'
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
    colorScheme: 'rose'
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
    colorScheme: 'emerald'
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
    colorScheme: 'amber'
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
    colorScheme: 'rose'
  },
  {
    id: 'stylish-clean',
    name: 'Stylish Clean',
    description: 'Professional design that stands out from the competition',
    category: 'modern',
    tier: 'professional',
    preview: '/templates/stylish-clean-preview.png',
    layout: 'modern',
    features: ['Stylish design', 'Professional', 'Competitive edge', 'Clean layout'],
    colorScheme: 'emerald'
  },
  {
    id: 'attractive-perfect',
    name: 'Attractive Perfect',
    description: 'Minimalist and professional design emphasizing clarity',
    category: 'minimalist',
    tier: 'professional',
    preview: '/templates/attractive-perfect-preview.png',
    layout: 'single-column',
    features: ['Minimalist design', 'Professional', 'Clarity focus', 'Universal appeal'],
    colorScheme: 'gray'
  },
  {
    id: 'unique-clean-cv',
    name: 'Unique Clean CV',
    description: 'Modern fonts combining elegance and readability',
    category: 'modern',
    tier: 'professional',
    preview: '/templates/unique-clean-cv-preview.png',
    layout: 'modern',
    features: ['Modern fonts', 'Elegant design', 'Readability', 'Unique style'],
    colorScheme: 'emerald'
  },

  // CAREER PRO TIER - Top 3 Career Pro Templates
  {
    id: 'harvard-executive',
    name: 'Harvard Executive',
    description: 'Premium Harvard style with executive-level enhancements',
    category: 'executive',
    tier: 'career-pro',
    preview: '/templates/harvard-executive-preview.png',
    layout: 'classic',
    features: ['Premium Harvard style', 'Executive enhancements', 'Advanced sections', 'Leadership focus'],
    colorScheme: 'amber'
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
    colorScheme: 'rose'
  },
  {
    id: 'academic',
    name: 'Academic',
    description: 'Specialized template for academic and research positions',
    category: 'academic',
    tier: 'career-pro',
    preview: '/templates/academic-preview.png',
    layout: 'single-column',
    features: ['Academic sections', 'Publication lists', 'Research focus', 'Scholarly design'],
    colorScheme: 'blue'
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
    colorScheme: 'amber'
  },
  {
    id: 'executive-premium',
    name: 'Executive Premium',
    description: 'Ultimate executive template with all premium features',
    category: 'executive',
    tier: 'elite',
    preview: '/templates/executive-premium-preview.png',
    layout: 'two-column',
    features: ['Premium design', 'Custom sections', 'Advanced controls', 'Executive level'],
    colorScheme: 'purple'
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

// Get popular templates
export const getPopularTemplates = (): CVTemplate[] => {
  return cvTemplates.filter(template => template.isPopular);
};

// Get template by ID
export const getTemplateById = (id: string): CVTemplate | undefined => {
  return cvTemplates.find(template => template.id === id);
};

// Template categories for filtering
export const templateCategories = [
  { id: 'all', name: 'All Templates' },
  { id: 'basic', name: 'Basic' },
  { id: 'professional', name: 'Professional' },
  { id: 'executive', name: 'Executive' },
  { id: 'creative', name: 'Creative' },
  { id: 'academic', name: 'Academic' },
  { id: 'modern', name: 'Modern' },
  { id: 'minimalist', name: 'Minimalist' },
  { id: 'tech', name: 'Tech' },
  { id: 'business', name: 'Business' },
  { id: 'healthcare', name: 'Healthcare' }
]; 