import React from 'react';
import { CVTemplate } from '@/data/cvTemplates';

interface CVTemplatePreviewProps {
  template: CVTemplate;
  className?: string;
  exampleCV?: any;
}

export const CVTemplatePreview: React.FC<CVTemplatePreviewProps> = ({ 
  template, 
  className = '', 
  exampleCV 
}) => {
  // Sample CV data for template preview
  const sampleCV = exampleCV || {
    full_name: 'John Doe',
    job_title: 'Software Engineer',
    email: 'john.doe@email.com',
    phone: '(555) 123-4567',
    location: 'London, UK',
    summary: 'Experienced software engineer with 5+ years developing scalable web applications and leading cross-functional teams.',
    experiences: [
      { 
        role: 'Senior Software Engineer', 
        company: 'Tech Corp', 
        duration: '2020 - Present',
        description: 'Led development of microservices architecture serving 1M+ users daily.'
      },
      { 
        role: 'Software Developer', 
        company: 'Innovation Labs', 
        duration: '2018 - 2020',
        description: 'Built responsive web applications using React and Node.js.'
      }
    ],
    education: [
      { 
        degree: 'BSc Computer Science', 
        institution: 'University of Technology', 
        year: '2018',
        gpa: '3.8'
      }
    ],
    skills: 'JavaScript, React, Node.js, Python, AWS, Docker, MongoDB',
    certifications: 'AWS Certified Developer, Google Cloud Professional'
  };

  const getTemplateStyles = () => {
    const colorSchemes = {
      blue: { primary: '#3b82f6', secondary: '#64748b', accent: '#1e40af' },
      purple: { primary: '#8b5cf6', secondary: '#6b7280', accent: '#6d28d9' },
      green: { primary: '#10b981', secondary: '#64748b', accent: '#047857' },
      rose: { primary: '#f43f5e', secondary: '#64748b', accent: '#be123c' },
      amber: { primary: '#f59e0b', secondary: '#64748b', accent: '#d97706' },
      emerald: { primary: '#059669', secondary: '#64748b', accent: '#047857' },
      gray: { primary: '#6b7280', secondary: '#9ca3af', accent: '#374151' }
    };

    return colorSchemes[template.colorScheme as keyof typeof colorSchemes] || colorSchemes.blue;
  };

  const styles = getTemplateStyles();

  const renderSingleColumnLayout = () => (
    <div className="max-w-2xl mx-auto bg-white shadow-lg min-h-[600px]">
      {/* Header */}
      <div className="p-6 text-center border-b-2 border-gray-300">
        <h1 className="text-3xl font-bold mb-2 text-gray-900">{sampleCV.full_name}</h1>
        <p className="text-lg text-gray-600 mb-2">{sampleCV.job_title}</p>
        <div className="text-sm text-gray-500">
          {sampleCV.email} • {sampleCV.phone} • {sampleCV.location}
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Professional Summary */}
        <div>
          <h2 className="text-xl font-semibold mb-3" style={{ color: styles.primary }}>
            Professional Summary
          </h2>
          <p className="text-gray-700 leading-relaxed">{sampleCV.summary}</p>
        </div>

        {/* Experience */}
        <div>
          <h2 className="text-xl font-semibold mb-4" style={{ color: styles.primary }}>
            Work Experience
          </h2>
          <div className="space-y-4">
            {sampleCV.experiences.map((exp: any, index: number) => (
              <div key={index} className="border-l-4 pl-4" style={{ borderColor: styles.primary }}>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg">{exp.role}</h3>
                  <span className="text-sm text-gray-600">{exp.duration}</span>
                </div>
                <p className="text-gray-600 mb-2 font-medium">{exp.company}</p>
                <p className="text-gray-700">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Education & Skills */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-3" style={{ color: styles.primary }}>
              Education
            </h2>
            {sampleCV.education.map((edu: any, index: number) => (
              <div key={index}>
                <h3 className="font-semibold">{edu.degree}</h3>
                <p className="text-gray-600">{edu.institution}</p>
                <p className="text-gray-500">{edu.year} • GPA: {edu.gpa}</p>
              </div>
            ))}
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-3" style={{ color: styles.primary }}>
              Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {sampleCV.skills.split(',').map((skill: string, index: number) => (
                <span
                  key={index}
                  className="px-3 py-1 rounded-full text-sm font-medium"
                  style={{ 
                    backgroundColor: `${styles.primary}20`,
                    color: styles.primary
                  }}
                >
                  {skill.trim()}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTwoColumnLayout = () => (
    <div className="max-w-4xl mx-auto bg-white shadow-lg min-h-[600px] flex">
      {/* Left Sidebar */}
      <div className="w-1/3 p-6" style={{ backgroundColor: `${styles.primary}10` }}>
        <div className="space-y-6">
          {/* Contact Info */}
          <div>
            <h1 className="text-2xl font-bold mb-2" style={{ color: styles.primary }}>
              {sampleCV.full_name}
            </h1>
            <p className="text-lg text-gray-700 mb-4">{sampleCV.job_title}</p>
            <div className="space-y-2 text-sm text-gray-600">
              <div>{sampleCV.email}</div>
              <div>{sampleCV.phone}</div>
              <div>{sampleCV.location}</div>
            </div>
          </div>

          {/* Skills */}
          <div>
            <h2 className="text-lg font-semibold mb-3" style={{ color: styles.primary }}>
              Skills
            </h2>
            <div className="space-y-2">
              {sampleCV.skills.split(',').slice(0, 6).map((skill: string, index: number) => (
                <div key={index} className="flex items-center">
                  <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: styles.primary }}></div>
                  <span className="text-sm text-gray-700">{skill.trim()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div>
            <h2 className="text-lg font-semibold mb-3" style={{ color: styles.primary }}>
              Education
            </h2>
            {sampleCV.education.map((edu: any, index: number) => (
              <div key={index} className="text-sm">
                <h3 className="font-semibold text-gray-800">{edu.degree}</h3>
                <p className="text-gray-600">{edu.institution}</p>
                <p className="text-gray-500">{edu.year}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Content */}
      <div className="w-2/3 p-6">
        <div className="space-y-6">
          {/* Professional Summary */}
          <div>
            <h2 className="text-xl font-semibold mb-3" style={{ color: styles.primary }}>
              Professional Summary
            </h2>
            <p className="text-gray-700 leading-relaxed">{sampleCV.summary}</p>
          </div>

          {/* Experience */}
          <div>
            <h2 className="text-xl font-semibold mb-4" style={{ color: styles.primary }}>
              Work Experience
            </h2>
            <div className="space-y-6">
              {sampleCV.experiences.map((exp: any, index: number) => (
                <div key={index}>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg">{exp.role}</h3>
                    <span className="text-sm text-gray-600 font-medium">{exp.duration}</span>
                  </div>
                  <p className="text-gray-600 mb-2 font-medium">{exp.company}</p>
                  <p className="text-gray-700">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderModernLayout = () => (
    <div className="max-w-3xl mx-auto bg-white shadow-lg min-h-[600px]">
      {/* Modern Header */}
      <div className="p-6 border-l-8" style={{ borderColor: styles.primary }}>
        <h1 className="text-3xl font-bold mb-2" style={{ color: styles.primary }}>
          {sampleCV.full_name}
        </h1>
        <p className="text-xl text-gray-600 mb-4">{sampleCV.job_title}</p>
        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
          <span>{sampleCV.email}</span>
          <span>{sampleCV.phone}</span>
          <span>{sampleCV.location}</span>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Summary */}
        <div className="p-4 rounded-lg" style={{ backgroundColor: `${styles.primary}05` }}>
          <h2 className="text-xl font-semibold mb-3" style={{ color: styles.primary }}>
            Professional Summary
          </h2>
          <p className="text-gray-700 leading-relaxed">{sampleCV.summary}</p>
        </div>

        {/* Experience with Timeline */}
        <div>
          <h2 className="text-xl font-semibold mb-4" style={{ color: styles.primary }}>
            Work Experience
          </h2>
          <div className="space-y-6">
            {sampleCV.experiences.map((exp: any, index: number) => (
              <div key={index} className="flex">
                <div className="flex flex-col items-center mr-4">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: styles.primary }}></div>
                  {index < sampleCV.experiences.length - 1 && (
                    <div className="w-0.5 h-16 mt-2" style={{ backgroundColor: styles.primary }}></div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg">{exp.role}</h3>
                    <span className="text-sm text-gray-600 font-medium">{exp.duration}</span>
                  </div>
                  <p className="text-gray-600 mb-2 font-medium">{exp.company}</p>
                  <p className="text-gray-700">{exp.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skills Tags */}
        <div>
          <h2 className="text-xl font-semibold mb-4" style={{ color: styles.primary }}>
            Core Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {sampleCV.skills.split(',').map((skill: string, index: number) => (
              <span
                key={index}
                className="px-4 py-2 rounded-lg font-medium border-2"
                style={{ 
                  borderColor: styles.primary,
                  color: styles.primary,
                  backgroundColor: 'white'
                }}
              >
                {skill.trim()}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderCreativeLayout = () => (
    <div className="max-w-3xl mx-auto bg-white shadow-lg min-h-[600px] relative overflow-hidden">
      {/* Creative Header with Gradient */}
      <div 
        className="p-8 text-white relative"
        style={{ 
          background: `linear-gradient(135deg, ${styles.primary}, ${styles.accent})`
        }}
      >
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-2">{sampleCV.full_name}</h1>
          <p className="text-xl opacity-90 mb-4">{sampleCV.job_title}</p>
          <div className="flex flex-wrap gap-4 text-sm opacity-80">
            <span>{sampleCV.email}</span>
            <span>{sampleCV.phone}</span>
            <span>{sampleCV.location}</span>
          </div>
        </div>
        {/* Decorative Elements */}
        <div className="absolute top-4 right-4 w-16 h-16 bg-white bg-opacity-20 rounded-full"></div>
        <div className="absolute bottom-4 right-8 w-8 h-8 bg-white bg-opacity-30 rounded-full"></div>
      </div>

      <div className="p-6 space-y-6">
        {/* Summary */}
        <div className="p-6 rounded-xl border-2" style={{ borderColor: `${styles.primary}30` }}>
          <h2 className="text-xl font-semibold mb-3" style={{ color: styles.primary }}>
            About Me
          </h2>
          <p className="text-gray-700 leading-relaxed">{sampleCV.summary}</p>
        </div>

        {/* Experience */}
        <div>
          <h2 className="text-xl font-semibold mb-4" style={{ color: styles.primary }}>
            Experience
          </h2>
          <div className="space-y-6">
            {sampleCV.experiences.map((exp: any, index: number) => (
              <div key={index} className="p-4 rounded-lg shadow-sm border" style={{ borderColor: `${styles.primary}20` }}>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg">{exp.role}</h3>
                  <span className="text-sm font-medium px-3 py-1 rounded-full" 
                        style={{ backgroundColor: `${styles.primary}20`, color: styles.primary }}>
                    {exp.duration}
                  </span>
                </div>
                <p className="text-gray-600 mb-2 font-medium">{exp.company}</p>
                <p className="text-gray-700">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Skills with Creative Design */}
        <div>
          <h2 className="text-xl font-semibold mb-4" style={{ color: styles.primary }}>
            Skills & Expertise
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {sampleCV.skills.split(',').map((skill: string, index: number) => (
              <div
                key={index}
                className="p-3 rounded-lg text-center font-medium shadow-sm border-2"
                style={{ 
                  borderColor: styles.primary,
                  backgroundColor: `${styles.primary}10`,
                  color: styles.primary
                }}
              >
                {skill.trim()}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderClassicLayout = () => (
    <div className="max-w-2xl mx-auto bg-white shadow-lg min-h-[600px] font-serif">
      {/* Classic Header */}
      <div className="text-center p-8 border-b-4 border-gray-800">
        <h1 className="text-4xl font-bold mb-3 text-gray-900 uppercase tracking-wide">
          {sampleCV.full_name}
        </h1>
        <p className="text-lg text-gray-600 mb-4">{sampleCV.job_title}</p>
        <div className="text-sm text-gray-500">
          {sampleCV.email} • {sampleCV.phone} • {sampleCV.location}
        </div>
      </div>

      <div className="p-8 space-y-8">
        {/* Summary */}
        <div>
          <h2 className="text-xl font-bold mb-4 text-gray-900 uppercase tracking-wider border-b border-gray-400 pb-2">
            Professional Summary
          </h2>
          <p className="text-gray-700 leading-relaxed text-justify">{sampleCV.summary}</p>
        </div>

        {/* Experience */}
        <div>
          <h2 className="text-xl font-bold mb-4 text-gray-900 uppercase tracking-wider border-b border-gray-400 pb-2">
            Work Experience
          </h2>
          <div className="space-y-6">
            {sampleCV.experiences.map((exp: any, index: number) => (
              <div key={index}>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg text-gray-900">{exp.role}</h3>
                  <span className="text-sm text-gray-600 font-semibold">{exp.duration}</span>
                </div>
                <p className="text-gray-700 mb-2 font-semibold italic">{exp.company}</p>
                <p className="text-gray-700 text-justify">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Education & Skills */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-bold mb-4 text-gray-900 uppercase tracking-wider border-b border-gray-400 pb-2">
              Education
            </h2>
            {sampleCV.education.map((edu: any, index: number) => (
              <div key={index}>
                <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                <p className="text-gray-700 italic">{edu.institution}</p>
                <p className="text-gray-600">{edu.year} • GPA: {edu.gpa}</p>
              </div>
            ))}
          </div>
          
          <div>
            <h2 className="text-xl font-bold mb-4 text-gray-900 uppercase tracking-wider border-b border-gray-400 pb-2">
              Core Skills
            </h2>
            <p className="text-gray-700 leading-relaxed">{sampleCV.skills}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderLayout = () => {
    switch (template.layout) {
      case 'single-column':
        return renderSingleColumnLayout();
      case 'two-column':
        return renderTwoColumnLayout();
      case 'modern':
        return renderModernLayout();
      case 'creative':
        return renderCreativeLayout();
      case 'classic':
        return renderClassicLayout();
      default:
        return renderSingleColumnLayout();
    }
  };

  return (
    <div className={`bg-gray-50 p-4 rounded-lg ${className}`}>
      <div className="transform scale-75 origin-top">
        {renderLayout()}
      </div>
    </div>
  );
}; 