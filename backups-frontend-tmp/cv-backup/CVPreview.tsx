import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CVData } from '@/lib/supabase';
import { Mail, Phone, MapPin, Globe, Linkedin } from 'lucide-react';

interface CVPreviewProps {
  cvData: CVData;
  templateId: string;
}

// Color scheme mapping with proper CSS classes
const getColorClasses = (colorScheme: string) => {
  const colorMap: { [key: string]: any } = {
    blue: { primary: 'text-blue-600', secondary: 'text-blue-700', light: 'bg-blue-50', border: 'border-blue-200' },
    emerald: { primary: 'text-emerald-600', secondary: 'text-emerald-700', light: 'bg-emerald-50', border: 'border-emerald-200' },
    purple: { primary: 'text-purple-600', secondary: 'text-purple-700', light: 'bg-purple-50', border: 'border-purple-200' },
    rose: { primary: 'text-rose-600', secondary: 'text-rose-700', light: 'bg-rose-50', border: 'border-rose-200' },
    amber: { primary: 'text-amber-600', secondary: 'text-amber-700', light: 'bg-amber-50', border: 'border-amber-200' },
    gray: { primary: 'text-gray-600', secondary: 'text-gray-700', light: 'bg-gray-50', border: 'border-gray-200' },
    teal: { primary: 'text-teal-600', secondary: 'text-teal-700', light: 'bg-teal-50', border: 'border-teal-200' },
    indigo: { primary: 'text-indigo-600', secondary: 'text-indigo-700', light: 'bg-indigo-50', border: 'border-indigo-200' },
    slate: { primary: 'text-slate-600', secondary: 'text-slate-700', light: 'bg-slate-50', border: 'border-slate-200' },
    zinc: { primary: 'text-zinc-600', secondary: 'text-zinc-700', light: 'bg-zinc-50', border: 'border-zinc-200' },
    neutral: { primary: 'text-neutral-600', secondary: 'text-neutral-700', light: 'bg-neutral-50', border: 'border-neutral-200' },
    stone: { primary: 'text-stone-600', secondary: 'text-stone-700', light: 'bg-stone-50', border: 'border-stone-200' },
    red: { primary: 'text-red-600', secondary: 'text-red-700', light: 'bg-red-50', border: 'border-red-200' },
    orange: { primary: 'text-orange-600', secondary: 'text-orange-700', light: 'bg-orange-50', border: 'border-orange-200' },
    yellow: { primary: 'text-yellow-600', secondary: 'text-yellow-700', light: 'bg-yellow-50', border: 'border-yellow-200' },
    lime: { primary: 'text-lime-600', secondary: 'text-lime-700', light: 'bg-lime-50', border: 'border-lime-200' },
    green: { primary: 'text-green-600', secondary: 'text-green-700', light: 'bg-green-50', border: 'border-green-200' },
    cyan: { primary: 'text-cyan-600', secondary: 'text-cyan-700', light: 'bg-cyan-50', border: 'border-cyan-200' },
    sky: { primary: 'text-sky-600', secondary: 'text-sky-700', light: 'bg-sky-50', border: 'border-sky-200' },
    violet: { primary: 'text-violet-600', secondary: 'text-violet-700', light: 'bg-violet-50', border: 'border-violet-200' }
  };
  return colorMap[colorScheme] || colorMap.blue;
};

// Font family mapping
const getFontFamily = (fontFamily?: string) => {
  const fontMap: { [key: string]: string } = {
    sans: 'font-sans',
    serif: 'font-serif',
    mono: 'font-mono',
    inter: 'font-inter',
    roboto: 'font-roboto',
    'open-sans': 'font-open-sans',
    lato: 'font-lato',
    poppins: 'font-poppins',
    montserrat: 'font-montserrat',
    raleway: 'font-raleway',
    nunito: 'font-nunito',
    'source-sans': 'font-source-sans',
    ubuntu: 'font-ubuntu'
  };
  return fontMap[fontFamily || 'sans'] || 'font-sans';
};

// Template data mapping
const getTemplateData = (templateId: string) => {
  const templateMap: { [key: string]: { colorScheme: string; fontFamily: string } } = {
    'basic-clean': { colorScheme: 'blue', fontFamily: 'sans' },
    'professional-simple': { colorScheme: 'gray', fontFamily: 'serif' },
    'unique-clean': { colorScheme: 'rose', fontFamily: 'poppins' },
    'harvard-classic': { colorScheme: 'amber', fontFamily: 'serif' },
    'modern-professional': { colorScheme: 'emerald', fontFamily: 'inter' },
    'creative-clean': { colorScheme: 'indigo', fontFamily: 'lato' },
    'executive-basic': { colorScheme: 'teal', fontFamily: 'montserrat' },
    'minimalist-clean': { colorScheme: 'slate', fontFamily: 'open-sans' },
    'modern-cv': { colorScheme: 'zinc', fontFamily: 'roboto' },
    'classic-corporate': { colorScheme: 'neutral', fontFamily: 'serif' },
    'executive-premium': { colorScheme: 'stone', fontFamily: 'raleway' },
    'creative-premium': { colorScheme: 'red', fontFamily: 'nunito' },
    'modern-executive': { colorScheme: 'orange', fontFamily: 'source-sans' },
    'academic-research': { colorScheme: 'yellow', fontFamily: 'ubuntu' },
    'minimal-premium': { colorScheme: 'lime', fontFamily: 'poppins' },
    'classic-academic': { colorScheme: 'green', fontFamily: 'serif' },
    'modern-minimal': { colorScheme: 'cyan', fontFamily: 'inter' },
    'creative-modern': { colorScheme: 'sky', fontFamily: 'montserrat' },
    'executive-classic': { colorScheme: 'violet', fontFamily: 'raleway' },
    'academic-modern': { colorScheme: 'indigo', fontFamily: 'open-sans' }
  };
  return templateMap[templateId] || { colorScheme: 'blue', fontFamily: 'sans' };
};

const CVPreview: React.FC<CVPreviewProps> = ({ cvData, templateId }) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString + '-01');
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  const templateData = getTemplateData(templateId);
  const colors = getColorClasses(templateData.colorScheme);
  const fontFamily = getFontFamily(templateData.fontFamily);

  const renderTemplate = () => (
    <div className={`bg-white p-8 shadow-lg rounded-lg max-w-4xl mx-auto ${fontFamily}`}>
      {/* Header */}
      <div className={`border-b ${colors.border} pb-6 mb-6`}>
        <h1 className={`text-3xl font-bold ${colors.primary} mb-2`}>
          {cvData.personalInfo.fullName || 'Your Name'}
        </h1>
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          {cvData.personalInfo.email && (
            <div className="flex items-center gap-1">
              <Mail className="w-4 h-4" />
              {cvData.personalInfo.email}
            </div>
          )}
          {cvData.personalInfo.phone && (
            <div className="flex items-center gap-1">
              <Phone className="w-4 h-4" />
              {cvData.personalInfo.phone}
            </div>
          )}
          {cvData.personalInfo.location && (
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {cvData.personalInfo.location}
            </div>
          )}
          {cvData.personalInfo.linkedIn && (
            <div className="flex items-center gap-1">
              <Linkedin className="w-4 h-4" />
              {cvData.personalInfo.linkedIn}
            </div>
          )}
          {cvData.personalInfo.website && (
            <div className="flex items-center gap-1">
              <Globe className="w-4 h-4" />
              {cvData.personalInfo.website}
            </div>
          )}
        </div>
      </div>

      {/* Summary */}
      {cvData.personalInfo.summary && (
        <div className="mb-6">
          <h2 className={`text-xl font-semibold ${colors.primary} mb-3`}>Professional Summary</h2>
          <p className="text-gray-700 leading-relaxed">{cvData.personalInfo.summary}</p>
        </div>
      )}

      {/* Experience */}
      {cvData.experience.length > 0 && (
        <div className="mb-6">
          <h2 className={`text-xl font-semibold ${colors.primary} mb-4`}>Work Experience</h2>
          <div className="space-y-4">
            {cvData.experience.map(exp => (
              <div key={exp.id} className={`border-l-2 ${colors.border} pl-4`}>
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                  <span className="text-sm text-gray-600">
                    {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium text-gray-800">{exp.company}</span>
                  {exp.location && (
                    <>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-600">{exp.location}</span>
                    </>
                  )}
                </div>
                {exp.description && (
                  <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                    {exp.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {cvData.education.length > 0 && (
        <div className="mb-6">
          <h2 className={`text-xl font-semibold ${colors.primary} mb-4`}>Education</h2>
          <div className="space-y-3">
            {cvData.education.map(edu => (
              <div key={edu.id}>
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-semibold text-gray-900">{edu.degree} in {edu.field}</h3>
                  <span className="text-sm text-gray-600">
                    {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-800">{edu.institution}</span>
                  {edu.gpa && (
                    <>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-600">GPA: {edu.gpa}</span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {cvData.skills.length > 0 && (
        <div className="mb-6">
          <h2 className={`text-xl font-semibold ${colors.primary} mb-4`}>Skills</h2>
          <div className="flex flex-wrap gap-2">
            {cvData.skills.map(skill => (
              <Badge key={skill} className={colors.light}>{skill}</Badge>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {cvData.projects && cvData.projects.length > 0 && (
        <div className="mb-6">
          <h2 className={`text-xl font-semibold ${colors.primary} mb-4`}>Projects</h2>
          <div className="space-y-3">
            {cvData.projects.map(project => (
              <div key={project.id}>
                <h3 className="font-semibold text-gray-900">{project.title}</h3>
                <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                  {project.description}
                </div>
                {project.link && (
                  <a href={project.link} className="text-blue-500 underline text-xs" target="_blank" rel="noopener noreferrer">
                    {project.link}
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Languages */}
      {cvData.languages && cvData.languages.length > 0 && (
        <div className="mb-6">
          <h2 className={`text-xl font-semibold ${colors.primary} mb-4`}>Languages</h2>
          <div className="flex flex-wrap gap-2">
            {cvData.languages.map(lang => (
              <Badge key={lang} className={colors.light}>{lang}</Badge>
            ))}
          </div>
        </div>
      )}

      {/* References */}
      {cvData.references && cvData.references.length > 0 && (
        <div className="mb-6">
          <h2 className={`text-xl font-semibold ${colors.primary} mb-4`}>References</h2>
          <div className="space-y-2">
            {cvData.references.map(ref => (
              <div key={ref.id} className="text-gray-700 text-sm">
                <span className="font-semibold">{ref.name}</span> - {ref.contact}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full">
      {renderTemplate()}
    </div>
  );
};

export default CVPreview;
