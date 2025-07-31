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
  // Parse incoming content as object if needed
  const parsed = typeof content === 'string' ? JSON.parse(content) : content;
  const personalInfo = parsed.personalInfo || {};
  
  // Accept skills as string or array
  const skillsValid = Array.isArray(parsed.skills) || typeof parsed.skills === 'string';
  // Accept certifications as array or string (convert string to array if needed)
  const certificationsValid = Array.isArray(parsed.certifications) || typeof parsed.certifications === 'string' || parsed.certifications === undefined;
  // Accept experience and education as arrays (empty or not) - check both experience and experiences
  const experienceValid = Array.isArray(parsed.experience) || Array.isArray(parsed.experiences);
  const educationValid = Array.isArray(parsed.education);
  // Accept all string fields as string or empty string, and allow missing optional fields
  const stringOrEmpty = (v: any) => typeof v === 'string' || v === undefined || v === null;

  const valid = (
    (stringOrEmpty(parsed.full_name) || stringOrEmpty(personalInfo.fullName)) &&
    (stringOrEmpty(parsed.email) || stringOrEmpty(personalInfo.email)) &&
    (stringOrEmpty(parsed.phone) || stringOrEmpty(personalInfo.phone)) &&
    (stringOrEmpty(parsed.location) || stringOrEmpty(personalInfo.location)) &&
    (stringOrEmpty(parsed.linkedin_url) || stringOrEmpty(personalInfo.linkedin)) &&
    (stringOrEmpty(parsed.portfolio_url) || stringOrEmpty(personalInfo.website)) &&
    (stringOrEmpty(parsed.summary) || stringOrEmpty(personalInfo.summary)) &&
    experienceValid &&
    educationValid &&
    skillsValid &&
    certificationsValid
  );

  if (!valid) {
    console.error('CV validation failed:', { content, parsed, personalInfo });
  }
  return valid;
}

// CV Content Normalization
export function normalizeCVContent(content: any): CVContent {
  // Helper to ensure array
  const toArray = (v: any) => Array.isArray(v) ? v : typeof v === 'string' && v.trim() ? v.split(',').map((s: string) => s.trim()).filter(Boolean) : [];
  
  // Parse incoming content as object if needed
  const parsed = typeof content === 'string' ? JSON.parse(content) : content;
  
  // Handle both flat and nested personalInfo structures
  const personalInfo = parsed.personalInfo || {};
  
  return {
    full_name: parsed.full_name || personalInfo.fullName || '',
    email: parsed.email || personalInfo.email || '',
    phone: parsed.phone || personalInfo.phone || '',
    location: parsed.location || personalInfo.location || '',
    linkedin_url: parsed.linkedin_url || personalInfo.linkedin || '',
    portfolio_url: parsed.portfolio_url || personalInfo.website || '',
    summary: parsed.summary || personalInfo.summary || '',
    experience: Array.isArray(parsed.experience) ? parsed.experience : 
                Array.isArray(parsed.experiences) ? parsed.experiences : [],
    education: Array.isArray(parsed.education) ? parsed.education : [],
    skills: toArray(parsed.skills),
    certifications: toArray(parsed.certifications),
    projects: Array.isArray(parsed.projects) ? parsed.projects : [],
    languages: Array.isArray(parsed.languages) ? parsed.languages : [],
    references: Array.isArray(parsed.references) ? parsed.references : [],
    isSampleDatabase: !!parsed.isSampleDatabase,
  };
} 