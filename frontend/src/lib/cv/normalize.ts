// Canonical CV normalization utility for ApplyAce
import { CVData } from './types';

/**
 * Normalize any CV data object to a fully type-safe, PRD-compliant CVData object.
 * Handles string/array conversions, default values, and missing fields.
 */
export function normalizeCVData(input: any): CVData {
  return {
    personalInfo: {
      fullName: input.personalInfo?.fullName || input.fullName || input.name || '',
      email: input.personalInfo?.email || input.email || '',
      phone: input.personalInfo?.phone || input.phone || '',
      location: input.personalInfo?.location || input.location || '',
      linkedIn: input.personalInfo?.linkedIn || input.linkedIn || input.linkedin || '',
      website: input.personalInfo?.website || input.website || '',
      summary: input.personalInfo?.summary || input.summary || '',
    },
    experience: Array.isArray(input.experience)
      ? input.experience.map((exp: any, i: number) => ({
          id: exp.id || String(i),
          company: exp.company || '',
          position: exp.position || exp.role || '',
          location: exp.location || '',
          startDate: exp.startDate || exp.start_date || '',
          endDate: exp.endDate || exp.end_date || '',
          current: typeof exp.current === 'boolean' ? exp.current : false,
          description: exp.description || '',
        }))
      : [],
    education: Array.isArray(input.education)
      ? input.education.map((edu: any, i: number) => ({
          id: edu.id || String(i),
          institution: edu.institution || '',
          degree: edu.degree || '',
          field: edu.field || edu.field_of_study || '',
          startDate: edu.startDate || edu.start_date || '',
          endDate: edu.endDate || edu.end_date || '',
          gpa: edu.gpa || '',
        }))
      : [],
    skills: Array.isArray(input.skills)
      ? input.skills
      : typeof input.skills === 'string'
      ? input.skills.split(',').map((s: string) => s.trim()).filter(Boolean)
      : [],
    certifications: Array.isArray(input.certifications)
      ? input.certifications.map((cert: any, i: number) => ({
          id: cert.id || String(i),
          name: cert.name || cert || '',
          issuer: cert.issuer || '',
          date: cert.date || '',
          expiryDate: cert.expiryDate || '',
        }))
      : typeof input.certifications === 'string' && input.certifications.trim() !== ''
      ? input.certifications.split(',').map((c: string, i: number) => ({
          id: String(i),
          name: c.trim(),
          issuer: '',
          date: '',
        }))
      : [],
    projects: Array.isArray(input.projects)
      ? input.projects.map((proj: any, i: number) => ({
          id: proj.id || String(i),
          name: proj.name || '',
          description: proj.description || '',
          technologies: proj.technologies || '',
          url: proj.url || '',
          github_url: proj.github_url || '',
          live_url: proj.live_url || '',
          duration: proj.duration || '',
          role: proj.role || '',
          team_size: proj.team_size || undefined,
        }))
      : [],
    languages: Array.isArray(input.languages)
      ? input.languages.map((lang: any, i: number) => ({
          id: lang.id || String(i),
          language: lang.language || lang || '',
          proficiency: lang.proficiency || '',
          certified: typeof lang.certified === 'boolean' ? lang.certified : undefined,
          certification_name: lang.certification_name || '',
        }))
      : [],
    references: Array.isArray(input.references)
      ? input.references.map((ref: any, i: number) => ({
          id: ref.id || String(i),
          name: ref.name || '',
          title: ref.title || '',
          company: ref.company || '',
          email: ref.email || '',
          phone: ref.phone || '',
          relationship: ref.relationship || '',
        }))
      : [],
    isSampleDatabase: !!input.isSampleDatabase,
  };
} 