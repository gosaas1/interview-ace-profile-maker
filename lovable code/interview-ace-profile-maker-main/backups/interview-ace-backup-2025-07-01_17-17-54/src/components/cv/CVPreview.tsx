import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Printer, Eye, EyeOff } from 'lucide-react';
import { CVData } from '@/lib/supabase';

interface CVPreviewProps {
  cvData: CVData;
  templateId?: string;
  showPreview: boolean;
  onTogglePreview: () => void;
  onExportPDF?: () => void;
  onPrint?: () => void;
}

export const CVPreview: React.FC<CVPreviewProps> = ({
  cvData,
  templateId = 'modern',
  showPreview,
  onTogglePreview,
  onExportPDF,
  onPrint
}) => {
  const getTemplateStyles = () => {
    const templates = {
      modern: {
        primary: '#2563eb',
        secondary: '#64748b',
        layout: 'modern'
      },
      creative: {
        primary: '#7c3aed',
        secondary: '#ec4899',
        layout: 'creative'
      },
      executive: {
        primary: '#1f2937',
        secondary: '#6b7280',
        layout: 'executive'
      }
    };

    return templates[templateId as keyof typeof templates] || templates.modern;
  };

  const styles = getTemplateStyles();

  const renderModernLayout = () => (
    <div className="max-w-4xl mx-auto bg-white shadow-lg">
      {/* Header */}
      <div 
        className="p-8 text-white"
        style={{ backgroundColor: styles.primary }}
      >
        <h1 className="text-3xl font-bold mb-2">{cvData.full_name}</h1>
        <p className="text-lg opacity-90 mb-4">{cvData.email}</p>
        <div className="flex flex-wrap gap-4 text-sm opacity-80">
          {cvData.phone && <span>{cvData.phone}</span>}
          {cvData.location && <span>{cvData.location}</span>}
        </div>
      </div>

      <div className="p-8">
        {/* Summary */}
        {cvData.summary && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-3" style={{ color: styles.primary }}>
              Professional Summary
            </h2>
            <p className="text-gray-700 leading-relaxed">{cvData.summary}</p>
          </div>
        )}

        {/* Experience */}
        {cvData.experiences && cvData.experiences.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4" style={{ color: styles.primary }}>
              Work Experience
            </h2>
            <div className="space-y-6">
              {cvData.experiences.map((exp, index) => (
                <div key={index} className="border-l-4 pl-4" style={{ borderColor: styles.primary }}>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg">{exp.role}</h3>
                    <span className="text-sm text-gray-600">{exp.duration}</span>
                  </div>
                  <p className="text-gray-600 mb-2">{exp.company}</p>
                  <p className="text-gray-700">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {cvData.education && cvData.education.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4" style={{ color: styles.primary }}>
              Education
            </h2>
            <div className="space-y-4">
              {cvData.education.map((edu, index) => (
                <div key={index} className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{edu.degree}</h3>
                    <p className="text-gray-600">{edu.institution}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-600">{edu.year}</p>
                    {edu.gpa && <p className="text-sm text-gray-500">GPA: {edu.gpa}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {cvData.skills && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4" style={{ color: styles.primary }}>
              Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {cvData.skills.split(',').map((skill, index) => (
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
        )}

        {/* Certifications */}
        {cvData.certifications && (
          <div>
            <h2 className="text-xl font-semibold mb-4" style={{ color: styles.primary }}>
              Certifications
            </h2>
            <p className="text-gray-700">{cvData.certifications}</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderCreativeLayout = () => (
    <div className="max-w-4xl mx-auto bg-white shadow-lg">
      {/* Creative Header */}
      <div 
        className="p-8 text-white relative overflow-hidden"
        style={{ 
          background: `linear-gradient(135deg, ${styles.primary}, ${styles.secondary})`
        }}
      >
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative">
          <h1 className="text-4xl font-bold mb-2">{cvData.full_name}</h1>
          <p className="text-xl opacity-90 mb-4">{cvData.email}</p>
          <div className="flex flex-wrap gap-4 text-sm opacity-80">
            {cvData.phone && <span>{cvData.phone}</span>}
            {cvData.location && <span>{cvData.location}</span>}
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Summary */}
        {cvData.summary && (
          <div className="mb-8 p-6 rounded-lg" style={{ backgroundColor: `${styles.primary}10` }}>
            <h2 className="text-xl font-semibold mb-3" style={{ color: styles.primary }}>
              About Me
            </h2>
            <p className="text-gray-700 leading-relaxed">{cvData.summary}</p>
          </div>
        )}

        {/* Experience */}
        {cvData.experiences && cvData.experiences.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4" style={{ color: styles.primary }}>
              Experience
            </h2>
            <div className="space-y-6">
              {cvData.experiences.map((exp, index) => (
                <div key={index} className="p-4 rounded-lg border" style={{ borderColor: `${styles.primary}30` }}>
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
        )}

        {/* Skills */}
        {cvData.skills && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4" style={{ color: styles.primary }}>
              Skills & Expertise
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {cvData.skills.split(',').map((skill, index) => (
                <div
                  key={index}
                  className="p-3 rounded-lg text-center font-medium"
                  style={{ 
                    backgroundColor: `${styles.secondary}20`,
                    color: styles.secondary
                  }}
                >
                  {skill.trim()}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {cvData.education && cvData.education.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4" style={{ color: styles.primary }}>
              Education
            </h2>
            <div className="space-y-4">
              {cvData.education.map((edu, index) => (
                <div key={index} className="p-4 rounded-lg" style={{ backgroundColor: `${styles.primary}10` }}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{edu.degree}</h3>
                      <p className="text-gray-600">{edu.institution}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-600">{edu.year}</p>
                      {edu.gpa && <p className="text-sm text-gray-500">GPA: {edu.gpa}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderExecutiveLayout = () => (
    <div className="max-w-4xl mx-auto bg-white shadow-lg">
      {/* Executive Header */}
      <div className="p-8 border-b-4" style={{ borderColor: styles.primary }}>
        <h1 className="text-4xl font-bold mb-2 text-gray-900">{cvData.full_name}</h1>
        <p className="text-xl text-gray-600 mb-4">{cvData.email}</p>
        <div className="flex flex-wrap gap-6 text-gray-600">
          {cvData.phone && <span className="flex items-center gap-2">{cvData.phone}</span>}
          {cvData.location && <span className="flex items-center gap-2">{cvData.location}</span>}
        </div>
      </div>

      <div className="p-8">
        {/* Executive Summary */}
        {cvData.summary && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Executive Summary</h2>
            <p className="text-gray-700 leading-relaxed text-lg">{cvData.summary}</p>
          </div>
        )}

        {/* Experience */}
        {cvData.experiences && cvData.experiences.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Professional Experience</h2>
            <div className="space-y-8">
              {cvData.experiences.map((exp, index) => (
                <div key={index} className="border-l-4 pl-6" style={{ borderColor: styles.primary }}>
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-gray-900">{exp.role}</h3>
                    <span className="text-gray-600 font-medium">{exp.duration}</span>
                  </div>
                  <p className="text-lg text-gray-700 mb-3 font-semibold">{exp.company}</p>
                  <p className="text-gray-700 leading-relaxed">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {cvData.education && cvData.education.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Education</h2>
            <div className="space-y-6">
              {cvData.education.map((edu, index) => (
                <div key={index} className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{edu.degree}</h3>
                    <p className="text-lg text-gray-700">{edu.institution}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-600 font-medium">{edu.year}</p>
                    {edu.gpa && <p className="text-sm text-gray-500">GPA: {edu.gpa}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {cvData.skills && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Core Competencies</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {cvData.skills.split(',').map((skill, index) => (
                <div
                  key={index}
                  className="p-4 border-2 rounded-lg text-center font-semibold"
                  style={{ 
                    borderColor: styles.primary,
                    color: styles.primary
                  }}
                >
                  {skill.trim()}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {cvData.certifications && (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Certifications & Achievements</h2>
            <p className="text-gray-700 text-lg">{cvData.certifications}</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderCV = () => {
    switch (styles.layout) {
      case 'creative':
        return renderCreativeLayout();
      case 'executive':
        return renderExecutiveLayout();
      default:
        return renderModernLayout();
    }
  };

  if (!showPreview) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
              <Eye className="w-8 h-8 text-gray-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Preview Your CV</h3>
              <p className="text-gray-600">See how your CV will look with the selected template</p>
            </div>
            <Button onClick={onTogglePreview} variant="outline">
              <Eye className="w-4 h-4 mr-2" />
              Show Preview
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Preview Controls */}
      <div className="flex items-center justify-between bg-white p-4 rounded-lg border shadow-sm">
        <div className="flex items-center gap-4">
          <Button onClick={onTogglePreview} variant="outline" size="sm">
            <EyeOff className="w-4 h-4 mr-2" />
            Hide Preview
          </Button>
          <span className="text-sm text-gray-600">
            Template: {templateId.charAt(0).toUpperCase() + templateId.slice(1)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {onPrint && (
            <Button onClick={onPrint} variant="outline" size="sm">
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
          )}
          {onExportPDF && (
            <Button onClick={onExportPDF} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
          )}
        </div>
      </div>

      {/* CV Preview */}
      <div className="bg-gray-50 p-8 rounded-lg">
        {renderCV()}
      </div>
    </div>
  );
}; 