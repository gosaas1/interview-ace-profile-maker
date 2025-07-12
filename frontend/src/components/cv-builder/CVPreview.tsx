import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CVFormData } from './CVBuilderModern';
import { Mail, Phone, MapPin, Globe, Linkedin } from 'lucide-react';
import { CVTemplate } from '@/data/cvTemplates';

interface CVPreviewProps {
  cvData: CVFormData;
  template: CVTemplate;
  showPreview?: boolean;
  onTogglePreview?: () => void;
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

const CVPreview: React.FC<CVPreviewProps> = ({ cvData, template, showPreview = true, onTogglePreview }) => {
  if (!template) {
    return <div className="text-red-500 p-4">Template not found or not selected.</div>;
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString + '-01');
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  // Create color classes from template colors
  const colors = {
    primary: template.colors?.primary || '#1a365d',
    secondary: template.colors?.secondary || '#2d3748',
    light: template.colors?.background || '#ffffff',
    border: template.colors?.primary || '#1a365d',
    text: template.colors?.text || '#1a202c'
  };
  const fontFamilyClass = getFontFamily(template.fonts?.heading);

  // Transform CVFormData to the expected format
  const transformedData = {
    personalInfo: {
      fullName: cvData.full_name || 'Your Name',
      email: cvData.email || '',
      phone: cvData.phone || '',
      location: cvData.location || '',
      linkedIn: cvData.linkedin_url || '',
      website: cvData.portfolio_url || '',
      summary: cvData.summary || ''
    },
    experience: cvData.experiences?.map((exp, index) => ({
      id: index.toString(),
      position: exp.role || '',
      company: exp.company || '',
      location: '',
      startDate: exp.duration || '',
      endDate: '',
      current: false,
      description: exp.description || ''
    })) || [],
    education: cvData.education?.map((edu, index) => ({
      id: index.toString(),
      degree: edu.degree || '',
      field: '',
      institution: edu.institution || '',
      startDate: edu.year || '',
      endDate: '',
      gpa: edu.gpa || ''
    })) || [],
    skills: cvData.skills ? cvData.skills.split(',').map(s => s.trim()).filter(s => s) : []
  };

  // Two basic layouts for demonstration
  const renderSingleColumn = () => (
    <div className={`bg-white p-8 shadow-lg rounded-lg max-w-4xl mx-auto overflow-auto break-words ${fontFamilyClass}`}
      style={{ fontSize: '1rem', background: colors.light }}>
      {/* Header */}
      <div className="border-b pb-6 mb-6" style={{ borderColor: colors.border, borderBottomWidth: 2 }}>
        <h1 className="text-3xl font-bold mb-2" style={{ color: colors.primary, fontSize: '2.2rem', wordBreak: 'break-word' }}>
          {transformedData.personalInfo.fullName}
        </h1>
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          {transformedData.personalInfo.email && (
            <div className="flex items-center gap-1 break-all">
              <Mail className="w-4 h-4" />
              {transformedData.personalInfo.email}
            </div>
          )}
          {transformedData.personalInfo.phone && (
            <div className="flex items-center gap-1 break-all">
              <Phone className="w-4 h-4" />
              {transformedData.personalInfo.phone}
            </div>
          )}
          {transformedData.personalInfo.location && (
            <div className="flex items-center gap-1 break-all">
              <MapPin className="w-4 h-4" />
              {transformedData.personalInfo.location}
            </div>
          )}
          {transformedData.personalInfo.linkedIn && (
            <div className="flex items-center gap-1 break-all">
              <Linkedin className="w-4 h-4" />
              {transformedData.personalInfo.linkedIn}
            </div>
          )}
          {transformedData.personalInfo.website && (
            <div className="flex items-center gap-1 break-all">
              <Globe className="w-4 h-4" />
              {transformedData.personalInfo.website}
            </div>
          )}
        </div>
      </div>

      {/* Summary */}
      {transformedData.personalInfo.summary && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3" style={{ color: colors.primary }}>Professional Summary</h2>
          <p className="text-gray-700 leading-relaxed break-words" style={{ color: colors.text }}>{transformedData.personalInfo.summary}</p>
        </div>
      )}

      {/* Experience */}
      {transformedData.experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4" style={{ color: colors.primary }}>Work Experience</h2>
          <div className="space-y-4">
            {transformedData.experience.map(exp => (
              <div key={exp.id} className={`border-l-2 ${colors.border} pl-4`}>
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-semibold text-gray-900 break-words">{exp.position}</h3>
                  <span className="text-sm text-gray-600">
                    {exp.startDate}
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium text-gray-800 break-words">{exp.company}</span>
                  {exp.location && (
                    <>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-600 break-words">{exp.location}</span>
                    </>
                  )}
                </div>
                {exp.description && (
                  <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-line break-words" style={{ color: colors.text }}>
                    {exp.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {transformedData.education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4" style={{ color: colors.primary }}>Education</h2>
          <div className="space-y-3">
            {transformedData.education.map(edu => (
              <div key={edu.id}>
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-semibold text-gray-900 break-words">{edu.degree}</h3>
                  <span className="text-sm text-gray-600">
                    {edu.startDate}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-800 break-words">{edu.institution}</span>
                  {edu.gpa && (
                    <>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-600 break-words">GPA: {edu.gpa}</span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {transformedData.skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4" style={{ color: colors.primary }}>Skills</h2>
          <div className="flex flex-wrap gap-2">
            {transformedData.skills.map(skill => (
              <Badge key={skill} className={colors.light + ' break-words'} style={{ color: colors.text }}>{skill}</Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderTwoColumn = () => (
    <div className={`bg-white p-8 shadow-lg rounded-lg max-w-4xl mx-auto grid grid-cols-3 gap-8 ${fontFamilyClass}`}
      style={{ fontSize: '1rem', background: colors.light }}>
      {/* Left column: Personal info, skills */}
      <div className="col-span-1">
        <h1 className="text-2xl font-bold mb-2" style={{ color: colors.primary, fontSize: '1.6rem' }}>
          {transformedData.personalInfo.fullName}
        </h1>
        <div className="space-y-2 text-sm text-gray-600 mb-4">
          {transformedData.personalInfo.email && <div><Mail className="inline w-4 h-4 mr-1" />{transformedData.personalInfo.email}</div>}
          {transformedData.personalInfo.phone && <div><Phone className="inline w-4 h-4 mr-1" />{transformedData.personalInfo.phone}</div>}
          {transformedData.personalInfo.location && <div><MapPin className="inline w-4 h-4 mr-1" />{transformedData.personalInfo.location}</div>}
          {transformedData.personalInfo.linkedIn && <div><Linkedin className="inline w-4 h-4 mr-1" />{transformedData.personalInfo.linkedIn}</div>}
          {transformedData.personalInfo.website && <div><Globe className="inline w-4 h-4 mr-1" />{transformedData.personalInfo.website}</div>}
        </div>
        {transformedData.skills.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2" style={{ color: colors.primary }}>Skills</h2>
            <div className="flex flex-wrap gap-2">
              {transformedData.skills.map(skill => (
                <Badge key={skill} className={colors.light} style={{ color: colors.text }}>{skill}</Badge>
              ))}
            </div>
          </div>
        )}
      </div>
      {/* Right column: Summary, experience, education */}
      <div className="col-span-2">
        {transformedData.personalInfo.summary && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3" style={{ color: colors.primary }}>Professional Summary</h2>
            <p className="text-gray-700 leading-relaxed" style={{ color: colors.text }}>{transformedData.personalInfo.summary}</p>
          </div>
        )}
        {transformedData.experience.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4" style={{ color: colors.primary }}>Work Experience</h2>
            <div className="space-y-4">
              {transformedData.experience.map(exp => (
                <div key={exp.id} className={`border-l-2 ${colors.border} pl-4`}>
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-semibold text-gray-900" style={{ color: colors.text }}>{exp.position}</h3>
                    <span className="text-sm text-gray-600">
                      {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium text-gray-800" style={{ color: colors.text }}>{exp.company}</span>
                    {exp.location && (
                      <>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-600" style={{ color: colors.text }}>{exp.location}</span>
                      </>
                    )}
                  </div>
                  {exp.description && (
                    <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-line" style={{ color: colors.text }}>
                      {exp.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        {transformedData.education.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4" style={{ color: colors.primary }}>Education</h2>
            <div className="space-y-3">
              {transformedData.education.map(edu => (
                <div key={edu.id}>
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-semibold text-gray-900" style={{ color: colors.text }}>{edu.degree}</h3>
                    <span className="text-sm text-gray-600">
                      {edu.startDate} - {edu.endDate}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-800" style={{ color: colors.text }}>{edu.institution}</span>
                    {edu.gpa && (
                      <>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-600" style={{ color: colors.text }}>GPA: {edu.gpa}</span>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Render layout based on template.layout
  if (template.layout === 'two-column') {
    return renderTwoColumn();
  }
  // Default to single-column for all other layouts
  return renderSingleColumn();
};

export default CVPreview;
