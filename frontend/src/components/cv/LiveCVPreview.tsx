import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CVFormData } from '@/components/cv-builder/CVBuilderModern';
import { getTemplateById } from '@/data/cvTemplates';
import { Eye } from 'lucide-react';

interface LiveCVPreviewProps {
  formData: CVFormData;
  selectedTemplate: string;
  className?: string;
}

export const LiveCVPreview: React.FC<LiveCVPreviewProps> = ({
  formData,
  selectedTemplate,
  className = ""
}) => {
  const template = getTemplateById(selectedTemplate);

  const renderModernPreview = () => (
    <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4 font-sans">
      {/* Header */}
      <div className="text-center border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {formData.full_name || 'Your Name'}
        </h1>
        <p className="text-lg text-gray-700 mb-2">
          {formData.job_title || 'Job Title'}
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
          {formData.email && <span>📧 {formData.email}</span>}
          {formData.phone && <span>📱 {formData.phone}</span>}
          {formData.location && <span>📍 {formData.location}</span>}
        </div>
        <div className="flex justify-center gap-4 mt-2">
          {formData.linkedin_url && (
            <a href={formData.linkedin_url} className="text-blue-600 text-sm hover:underline">
              LinkedIn
            </a>
          )}
          {formData.portfolio_url && (
            <a href={formData.portfolio_url} className="text-blue-600 text-sm hover:underline">
              Portfolio
            </a>
          )}
        </div>
      </div>

      {/* Summary */}
      {formData.summary && (
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Professional Summary</h2>
          <p className="text-gray-700 leading-relaxed">{formData.summary}</p>
        </div>
      )}

      {/* Experience */}
      {formData.experiences && formData.experiences.length > 0 && formData.experiences[0].company && (
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Professional Experience</h2>
          <div className="space-y-4">
            {formData.experiences.map((exp, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-semibold text-gray-900">{exp.role}</h3>
                <p className="text-gray-700">{exp.company}</p>
                <p className="text-sm text-gray-600 mb-2">{exp.duration}</p>
                <p className="text-gray-700 text-sm">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {formData.education && formData.education.length > 0 && formData.education[0].institution && (
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Education</h2>
          <div className="space-y-3">
            {formData.education.map((edu, index) => (
              <div key={index} className="border-l-4 border-green-500 pl-4">
                <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                <p className="text-gray-700">{edu.institution}</p>
                <p className="text-sm text-gray-600">{edu.year}</p>
                {edu.gpa && <p className="text-sm text-gray-600">GPA: {edu.gpa}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {formData.skills && (
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {formData.skills.split(',').map((skill, index) => (
              <Badge key={index} variant="secondary" className="text-sm">
                {skill.trim()}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {formData.projects && formData.projects.length > 0 && formData.projects[0].name && (
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Projects</h2>
          <div className="space-y-3">
            {formData.projects.map((project, index) => (
              <div key={index} className="border-l-4 border-purple-500 pl-4">
                <h3 className="font-semibold text-gray-900">{project.name}</h3>
                <p className="text-gray-700 text-sm mb-1">{project.description}</p>
                <p className="text-sm text-gray-600">Technologies: {project.technologies}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Languages */}
      {formData.languages && formData.languages.length > 0 && formData.languages[0].language && (
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Languages</h2>
          <div className="flex flex-wrap gap-2">
            {formData.languages.map((lang, index) => (
              <Badge key={index} variant="outline" className="text-sm">
                {lang.language} - {lang.proficiency}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {formData.certifications && (
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Certifications</h2>
          <p className="text-gray-700">{formData.certifications}</p>
        </div>
      )}
    </div>
  );

  const renderClassicPreview = () => (
    <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4 font-serif">
      {/* Header */}
      <div className="border-b-2 border-gray-300 pb-4">
        <h1 className="text-3xl font-bold text-gray-900 uppercase tracking-wide mb-2">
          {formData.full_name || 'YOUR NAME'}
        </h1>
        <p className="text-xl text-gray-700 mb-2">
          {formData.job_title || 'Job Title'}
        </p>
        <div className="text-sm text-gray-600 space-y-1">
          {formData.email && <div>Email: {formData.email}</div>}
          {formData.phone && <div>Phone: {formData.phone}</div>}
          {formData.location && <div>Location: {formData.location}</div>}
          {formData.linkedin_url && <div>LinkedIn: {formData.linkedin_url}</div>}
        </div>
      </div>

      {/* Summary */}
      {formData.summary && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide mb-2 border-b border-gray-300 pb-1">
            Professional Summary
          </h2>
          <p className="text-gray-700 leading-relaxed">{formData.summary}</p>
        </div>
      )}

      {/* Experience */}
      {formData.experiences && formData.experiences.length > 0 && formData.experiences[0].company && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide mb-3 border-b border-gray-300 pb-1">
            Professional Experience
          </h2>
          <div className="space-y-4">
            {formData.experiences.map((exp, index) => (
              <div key={index}>
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-gray-900">{exp.role}</h3>
                  <span className="text-sm text-gray-600">{exp.duration}</span>
                </div>
                <p className="text-gray-700 font-semibold mb-1">{exp.company}</p>
                <p className="text-gray-700 text-sm">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {formData.education && formData.education.length > 0 && formData.education[0].institution && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide mb-3 border-b border-gray-300 pb-1">
            Education
          </h2>
          <div className="space-y-3">
            {formData.education.map((edu, index) => (
              <div key={index}>
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                  <span className="text-sm text-gray-600">{edu.year}</span>
                </div>
                <p className="text-gray-700">{edu.institution}</p>
                {edu.gpa && <p className="text-sm text-gray-600">GPA: {edu.gpa}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {formData.skills && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide mb-3 border-b border-gray-300 pb-1">
            Skills
          </h2>
          <p className="text-gray-700">{formData.skills}</p>
        </div>
      )}
    </div>
  );

  const getPreviewContent = () => {
    switch (template?.layout) {
      case 'classic':
        return renderClassicPreview();
      case 'modern':
      default:
        return renderModernPreview();
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5 text-blue-600" />
          Live Preview
          {template && (
            <Badge variant="outline" className="ml-auto">
              {template.name}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="max-h-[600px] overflow-y-auto">
          {getPreviewContent()}
        </div>
      </CardContent>
    </Card>
  );
}; 