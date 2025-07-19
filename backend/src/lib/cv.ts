// CV Content Type for Validation
export interface CVContent {
  full_name: string;
  email: string;
  phone: string;
  location: string;
  linkedin_url: string;
  portfolio_url: string;
  summary: string;
  experience: any[];
  education: any[];
  skills: string[];
  certifications: any[];
  projects?: any[];
  languages?: any[];
  references?: any[];
  isSampleDatabase?: boolean;
}

export function validateCVContent(content: any): content is CVContent {
  // Accept skills as string or array
  const skillsValid = Array.isArray(content.skills) || typeof content.skills === 'string';
  // Accept certifications as array or string (convert string to array if needed)
  const certificationsValid = Array.isArray(content.certifications) || typeof content.certifications === 'string' || content.certifications === undefined;
  // Accept experience and education as arrays (empty or not)
  const experienceValid = Array.isArray(content.experience);
  const educationValid = Array.isArray(content.education);
  // Accept all string fields as string or empty string, and allow missing optional fields
  const stringOrEmpty = (v: any) => typeof v === 'string' || v === undefined || v === null;

  const valid = (
    stringOrEmpty(content.full_name) &&
    stringOrEmpty(content.email) &&
    stringOrEmpty(content.phone) &&
    stringOrEmpty(content.location) &&
    stringOrEmpty(content.linkedin_url) &&
    stringOrEmpty(content.portfolio_url) &&
    stringOrEmpty(content.summary) &&
    experienceValid &&
    educationValid &&
    skillsValid &&
    certificationsValid
  );

  if (!valid) {
    console.error('CV validation failed:', { content });
  }
  return valid;
}

// CV Content Normalization
export function normalizeCVContent(content: any): CVContent {
  // Helper to ensure array
  const toArray = (v: any) => Array.isArray(v) ? v : typeof v === 'string' && v.trim() ? v.split(',').map((s: string) => s.trim()).filter(Boolean) : [];
  return {
    full_name: typeof content.full_name === 'string' ? content.full_name : '',
    email: typeof content.email === 'string' ? content.email : '',
    phone: typeof content.phone === 'string' ? content.phone : '',
    location: typeof content.location === 'string' ? content.location : '',
    linkedin_url: typeof content.linkedin_url === 'string' ? content.linkedin_url : '',
    portfolio_url: typeof content.portfolio_url === 'string' ? content.portfolio_url : '',
    summary: typeof content.summary === 'string' ? content.summary : '',
    experience: Array.isArray(content.experience) ? content.experience : [],
    education: Array.isArray(content.education) ? content.education : [],
    skills: toArray(content.skills),
    certifications: toArray(content.certifications),
    projects: Array.isArray(content.projects) ? content.projects : [],
    languages: Array.isArray(content.languages) ? content.languages : [],
    references: Array.isArray(content.references) ? content.references : [],
    isSampleDatabase: !!content.isSampleDatabase,
  };
} 