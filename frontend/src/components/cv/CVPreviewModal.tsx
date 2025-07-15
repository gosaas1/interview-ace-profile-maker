import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CVData as DBCVData } from '@/lib/supabase';
import { CVData } from '@/lib/cv/types';
import { FileText, Download, ExternalLink, Brain, Edit, ArrowLeft, Eye, Printer } from 'lucide-react';
import { cvOperations } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { cvTemplates } from '@/data/cvTemplates';
import { getTemplateStyles } from '@/data/templateStyles';
import { motion } from 'framer-motion';
import ReactDOM from 'react-dom/client';
import CVPreview from '../cv-builder/CVPreview';
import { cn } from '@/lib/utils';

interface CVPreviewModalProps {
  open: boolean;
  onClose: () => void;
  cv: DBCVData | undefined;
  onSaved?: () => void;
  onAnalyze?: (cvId: string) => void;
  isNewUpload?: boolean;
  onApplyToJob?: () => void;
  onChooseTemplate?: () => void;
  userTier?: string; // Add userTier prop
}

// Template Preview Component (updated to use new template styles)
const TemplatePreview = ({ cvData, templateId }: { cvData: CVData; templateId: string }) => {
  const template = cvTemplates.find(t => t.id === templateId);
  const templateStyles = getTemplateStyles(templateId);

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const renderCVContent = () => {
    if (!template) return null;
    
    // Check if template should have a colored header
    const hasColoredHeader = template.layout === 'single-column' && 
      (template.colorScheme === 'blue' || template.colorScheme === 'emerald' || 
       template.colorScheme === 'amber' || template.colorScheme === 'slate' || 
       template.colorScheme === 'purple' || template.colorScheme === 'teal' || 
       template.colorScheme === 'indigo');

    const renderList = (items: string[]) => {
      if (!items || items.length === 0) return null;
      
      const listStyle = template.listStyle || 'bullet';
      
      switch (listStyle) {
        case 'bullet':
          return (
            <ul className="list-disc list-inside space-y-1">
              {items.map((item, index) => (
                <li key={index} className="text-xs text-gray-700" style={{ fontFamily: templateStyles.fontFamily }}>
                  {item}
                </li>
              ))}
            </ul>
          );
        case 'dash':
          return (
            <ul className="list-none space-y-1">
              {items.map((item, index) => (
                <li key={index} className="text-xs text-gray-700 flex items-start" style={{ fontFamily: templateStyles.fontFamily }}>
                  <span className="mr-2 text-gray-500">—</span>
                  {item}
                </li>
              ))}
            </ul>
          );
        case 'arrow':
          return (
            <ul className="list-none space-y-1">
              {items.map((item, index) => (
                <li key={index} className="text-xs text-gray-700 flex items-start" style={{ fontFamily: templateStyles.fontFamily }}>
                  <span className="mr-2 text-blue-600">→</span>
                  {item}
                </li>
              ))}
            </ul>
          );
        case 'check':
          return (
            <ul className="list-none space-y-1">
              {items.map((item, index) => (
                <li key={index} className="text-xs text-gray-700 flex items-start" style={{ fontFamily: templateStyles.fontFamily }}>
                  <span className="mr-2 text-green-600">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          );
        case 'circle':
          return (
            <ul className="list-none space-y-1">
              {items.map((item, index) => (
                <li key={index} className="text-xs text-gray-700 flex items-start" style={{ fontFamily: templateStyles.fontFamily }}>
                  <span className="mr-2 w-1 h-1 bg-gray-500 rounded-full mt-1.5"></span>
                  {item}
                </li>
              ))}
            </ul>
          );
        case 'star':
          return (
            <ul className="list-none space-y-1">
              {items.map((item, index) => (
                <li key={index} className="text-xs text-gray-700 flex items-start" style={{ fontFamily: templateStyles.fontFamily }}>
                  <span className="mr-2 text-yellow-500">★</span>
                  {item}
                </li>
              ))}
            </ul>
          );
        case 'minimal':
          return (
            <ul className="list-none space-y-1">
              {items.map((item, index) => (
                <li key={index} className="text-xs text-gray-700" style={{ fontFamily: templateStyles.fontFamily }}>
                  {item}
                </li>
              ))}
            </ul>
          );
        default:
          return (
            <ul className="list-disc list-inside space-y-1">
              {items.map((item, index) => (
                <li key={index} className="text-xs text-gray-700" style={{ fontFamily: templateStyles.fontFamily }}>
                  {item}
                </li>
              ))}
            </ul>
          );
      }
    };

    const renderHeader = () => {
      if (hasColoredHeader) {
        return (
          <div className={cn("mb-6", templateStyles.header)} style={templateStyles.headerThickness}>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: templateStyles.fontFamily }}>
                {cvData.personalInfo.fullName || 'Your Name'}
              </h1>
              <p className="text-base text-white/90 mb-1">Professional Title</p>
              <p className="text-sm text-white/80">{cvData.personalInfo.email || 'email@example.com'}</p>
              {cvData.personalInfo.phone && <p className="text-sm text-white/80">{cvData.personalInfo.phone}</p>}
              {cvData.personalInfo.location && <p className="text-sm text-white/80">{cvData.personalInfo.location}</p>}
            </div>
          </div>
        );
      }
      
      return (
        <div className="mb-6" style={templateStyles.headerAlign}>
          <h1 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: templateStyles.fontFamily }}>
            {cvData.personalInfo.fullName || 'Your Name'}
          </h1>
          <p className="text-base text-gray-600 mb-1">Professional Title</p>
          <p className="text-sm text-gray-600">{cvData.personalInfo.email || 'email@example.com'}</p>
          {cvData.personalInfo.phone && <p className="text-sm text-gray-600">{cvData.personalInfo.phone}</p>}
          {cvData.personalInfo.location && <p className="text-sm text-gray-600">{cvData.personalInfo.location}</p>}
        </div>
      );
    };

    const renderSectionHeading = (title: string) => (
      <h2 
        className="text-lg font-semibold mb-3 text-gray-800" 
        style={{ 
          fontFamily: templateStyles.fontFamily,
          ...templateStyles.headingStyle,
          color: templateStyles.accent.replace('text-', '').includes('blue') ? '#3b82f6' :
                 templateStyles.accent.replace('text-', '').includes('emerald') ? '#10b981' :
                 templateStyles.accent.replace('text-', '').includes('amber') ? '#f59e0b' :
                 templateStyles.accent.replace('text-', '').includes('slate') ? '#64748b' :
                 templateStyles.accent.replace('text-', '').includes('purple') ? '#8b5cf6' :
                 templateStyles.accent.replace('text-', '').includes('gray') ? '#6b7280' :
                 templateStyles.accent.replace('text-', '').includes('teal') ? '#14b8a6' :
                 templateStyles.accent.replace('text-', '').includes('indigo') ? '#6366f1' :
                 '#6b7280'
        }}
      >
        {title}
      </h2>
    );

    const renderExperience = () => (
      <div className="mb-6">
        {renderSectionHeading('Experience')}
        {cvData.experience.map((exp, index) => (
          <div key={index} className="mb-4" style={templateStyles.sectionDivider}>
            <div className="flex justify-between items-start mb-1">
              <h3 className="text-sm font-medium text-gray-900" style={{ fontFamily: templateStyles.fontFamily }}>
                {exp.position || 'Job Title'}
              </h3>
              <span className="text-xs text-gray-600">
                {exp.startDate && exp.endDate ? `${exp.startDate} - ${exp.endDate}` : 'Date Range'}
              </span>
            </div>
            <p className="text-xs text-gray-600 mb-2">
              {exp.company || 'Company'} • {exp.location || 'Location'}
            </p>
            {exp.description && exp.description.includes('\n') ? (
              <div className="text-xs text-gray-700" style={{ fontFamily: templateStyles.fontFamily }}>
                {renderList(exp.description.split('\n').filter(Boolean))}
              </div>
            ) : (
              <p className="text-xs text-gray-700 leading-relaxed" style={{ fontFamily: templateStyles.fontFamily }}>
                {exp.description || 'Job description'}
              </p>
            )}
          </div>
        ))}
      </div>
    );

    const renderEducation = () => (
      <div className="mb-6">
        {renderSectionHeading('Education')}
        {cvData.education.map((edu, index) => (
          <div key={index} className="mb-4" style={templateStyles.sectionDivider}>
            <div className="flex justify-between items-start mb-1">
              <h3 className="text-sm font-medium text-gray-900" style={{ fontFamily: templateStyles.fontFamily }}>
                {edu.degree || 'Degree'}
              </h3>
              <span className="text-xs text-gray-600">
                {edu.startDate && edu.endDate ? `${edu.startDate} - ${edu.endDate}` : 'Date Range'}
              </span>
            </div>
            <p className="text-xs text-gray-600 mb-1">
              {edu.institution || 'Institution'}
            </p>
            {edu.gpa && (
              <p className="text-xs text-gray-700">
                GPA: {edu.gpa}
              </p>
            )}
          </div>
        ))}
      </div>
    );

    const renderSkills = () => {
      const skills = Array.isArray(cvData.skills) ? cvData.skills : [];
      
      const showAsBadges = template.skillsDisplay === 'tags';
      
      if (showAsBadges) {
        return (
          <div className="mb-6">
            {renderSectionHeading('Skills')}
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs"
                  style={{ fontFamily: templateStyles.fontFamily }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        );
      }
      
      return (
        <div className="mb-6">
          {renderSectionHeading('Skills')}
          <p className="text-xs text-gray-700 leading-relaxed" style={{ fontFamily: templateStyles.fontFamily }}>
            {skills.join(', ')}
          </p>
        </div>
      );
    };

    // Handle different layout types
    const layout = template.layout || 'single-column';
    
    if (layout === 'right-side' || layout === 'two-column') {
      // Two-column layout
      return (
        <div className="grid grid-cols-2 gap-6">
          <div className="col-span-1">
            {renderHeader()}
            {cvData.personalInfo.summary && (
              <div className="mb-6">
                {renderSectionHeading('PROFESSIONAL SUMMARY')}
                <p className="text-gray-700 text-sm leading-relaxed">
                  {cvData.personalInfo.summary}
                </p>
              </div>
            )}
            {renderSkills()}
          </div>
          <div className="col-span-1">
            {renderExperience()}
            {renderEducation()}
          </div>
        </div>
      );
    }
    
    // Single-column layout (default)
    return (
      <div>
        {renderHeader()}
        {cvData.personalInfo.summary && (
          <div className="mb-6">
            {renderSectionHeading('PROFESSIONAL SUMMARY')}
            <p className="text-gray-700 text-sm leading-relaxed">
              {cvData.personalInfo.summary}
            </p>
          </div>
        )}
        {renderExperience()}
        {renderEducation()}
        {renderSkills()}
      </div>
    );
  };

  return (
    <div className="cv-preview bg-white" style={{ fontFamily: templateStyles.fontFamily }}>
      <div className="p-8">
        {renderCVContent()}
      </div>
    </div>
  );
};

// Map Supabase CVData to new CVData structure for CVPreview
function mapToNewCVData(cv: any): import('@/lib/cv/types').CVData {
  return {
    personalInfo: {
      fullName: cv.full_name || '',
      email: cv.email || '',
      phone: cv.phone || '',
      location: cv.location || '',
      linkedIn: cv.linkedin_url || '',
      website: cv.portfolio_url || '',
      summary: cv.summary || '',
    },
    experience: (cv.experiences || []).map((exp: any) => ({
      id: exp.id || '',
      company: exp.company || '',
      position: exp.role || exp.position || '',
      location: exp.location || '',
      startDate: exp.start_date || '',
      endDate: exp.end_date || '',
      current: exp.current || false,
      description: exp.description || '',
    })),
    education: (cv.education || []).map((edu: any) => ({
      id: edu.id || '',
      institution: edu.institution || '',
      degree: edu.degree || '',
      field: edu.field || edu.field_of_study || '',
      startDate: edu.start_date || '',
      endDate: edu.end_date || '',
      gpa: edu.gpa || '',
    })),
    skills: Array.isArray(cv.skills)
      ? cv.skills
      : typeof cv.skills === 'string'
        ? cv.skills.split(',').map((s: string) => s.trim()).filter(Boolean)
        : [],
    certifications: Array.isArray(cv.certifications)
      ? cv.certifications
      : typeof cv.certifications === 'string' && cv.certifications.trim() !== ''
        ? cv.certifications.split(',').map((c: string, i: number) => ({
            id: String(i),
            name: c.trim(),
            issuer: '',
            date: '',
          }))
        : [],
    projects: cv.projects || [],
    languages: cv.languages || [],
    references: cv.references || [],
  };
}

const CVPreviewModal: React.FC<CVPreviewModalProps> = ({ 
  open, 
  onClose, 
  cv, 
  onSaved, 
  onAnalyze,
  isNewUpload = false,
  onApplyToJob,
  onChooseTemplate,
  userTier = 'free' // Default to free
}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(cv?.full_name || '');
  const [saving, setSaving] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    if (cv && open) {
      setEditName(cv.full_name || '');
    }
  }, [cv, open]);

  if (!cv || !open) return null;

  // Check if this is a structured CV (from builder) or file-based CV
  const isStructuredCV = !cv.file_url && (cv.experiences || cv.education || cv.skills);
  const hasFileUrl = !!(cv.file_url && cv.file_url.trim().length > 0);
  const isPDF = cv.file_name && cv.file_name.toLowerCase().endsWith('.pdf');

  const getFileExtension = (filename?: string) => {
    if (!filename) return '';
    return filename.split('.').pop()?.toLowerCase() || '';
  };

  const handleAnalyzeNow = async () => {
    if (!onAnalyze) {
      navigate(`/cvs?analyze=${cv.id}`);
      onClose();
      return;
    }
    
    setAnalyzing(true);
    try {
      await onAnalyze(cv.id);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleEditCV = () => {
    navigate(`/cv-builder/${cv.id}`);
    onClose();
  };

  const handleBackToCVs = () => {
    navigate('/cvs');
    onClose();
  };

  const handleDownload = () => {
    if (cv.file_url) {
      // Download file-based CV
      const link = document.createElement('a');
      link.href = cv.file_url;
      link.download = cv.file_name || 'cv.pdf';
      link.click();
    } else if (isStructuredCV) {
      // For structured CVs, we'll use print functionality for now
      // In a full implementation, this would generate a PDF
      window.print();
    }
  };

  const handlePrint = () => {
    // Open a new window
    const printWindow = window.open('', '_blank', 'width=900,height=1200');
    if (!printWindow) return;

    // Write the root div
    printWindow.document.write('<div id="cv-print-root"></div>');
    printWindow.document.close();

    // Inject stylesheets and fonts
    let styles = '';
    for (const styleSheet of Array.from(document.styleSheets)) {
      try {
        if (styleSheet.href) {
          styles += `<link rel="stylesheet" href="${styleSheet.href}">`;
        } else if (styleSheet.cssRules) {
          styles += '<style>';
          for (const rule of Array.from(styleSheet.cssRules)) {
            styles += rule.cssText;
          }
          styles += '</style>';
        }
      } catch (e) {
        // Ignore CORS issues
      }
    }
    printWindow.document.head.innerHTML += styles;

    // Wait for the root div to exist, then render React
    const interval = setInterval(() => {
      const root = printWindow.document.getElementById('cv-print-root');
      if (root) {
        clearInterval(interval);
        const mapped = mapToNewCVData(cv);
        const reactRoot = ReactDOM.createRoot(root);
        reactRoot.render(
          <CVPreview 
            cvData={mapped} 
            templateId={cv.template_id || 'modern-professional'} 
            showWatermark={userTier === 'free'}
            minimal={true} // Only CV content, no extra UI
          />
        );
        setTimeout(() => {
          printWindow.print();
          printWindow.onafterprint = function() { printWindow.close(); };
        }, 500); // Wait for render
      }
    }, 50);
  };

  // Render preview content
  let previewContent = null;
  
  if (isStructuredCV) {
    const mapped = mapToNewCVData(cv);
    previewContent = (
      <CVPreview
        cvData={mapped}
        templateId={cv.template_id || 'modern-professional'}
        showWatermark={userTier === 'free'}
        minimal={true}
      />
    );
  } else if (hasFileUrl) {
    const ext = getFileExtension(cv.file_name);
    if (ext === 'pdf') {
      previewContent = (
        <iframe
          src={cv.file_url}
          title="PDF Preview"
          width="100%"
          height="600px"
          style={{ border: 'none' }}
        />
      );
    } else if (ext === 'doc' || ext === 'docx') {
      const officeUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(cv.file_url)}`;
      previewContent = (
        <iframe
          src={officeUrl}
          title="Word Document Preview"
          width="100%"
          height="600px"
          style={{ border: 'none' }}
        />
      );
    } else {
      previewContent = (
        <div className="p-4 text-center text-gray-500">
          File preview not supported for this file type.<br />
          <a href={cv.file_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Download/Open File</a>
        </div>
      );
    }
  }

  const handleEdit = () => setEditing(true);
  const handleCancel = () => { setEditing(false); setEditName(cv?.full_name || ''); };
  const handleSave = async () => {
    if (!cv) return;
    setSaving(true);
    try {
      await cvOperations.updateCV(cv.id, { full_name: editName });
      setEditing(false);
      if (cv.full_name !== editName) cv.full_name = editName;
      if (onSaved) onSaved();
    } catch (e) {
      alert('Failed to save name.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl w-full max-h-[90vh] overflow-y-auto bg-gray-50 rounded-xl shadow-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            CV Preview: {editing ? (
              <input
                value={editName}
                onChange={e => setEditName(e.target.value)}
                className="border rounded px-2 py-1 text-lg font-semibold"
                disabled={saving}
                style={{ minWidth: 200 }}
              />
            ) : (
              cv?.full_name || 'Untitled CV'
            )}
            {editing ? (
              <>
                <button onClick={handleSave} disabled={saving} className="ml-2 px-2 py-1 bg-blue-600 text-white rounded">Save</button>
                <button onClick={handleCancel} disabled={saving} className="ml-2 px-2 py-1 bg-gray-300 rounded">Cancel</button>
              </>
            ) : (
              <>
                <button onClick={handleEdit} className="ml-2 px-2 py-1 bg-gray-200 rounded">Rename</button>
                <button onClick={handleSave} disabled={saving} className="ml-2 px-2 py-1 bg-blue-600 text-white rounded">Save</button>
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {isStructuredCV 
              ? `Template: ${cvTemplates.find(t => t.id === (cv.template_id || 'modern'))?.name || 'Modern'}`
              : `Previewing uploaded file: ${cv.file_name || 'Unknown file'}`
            }
            {isNewUpload && (
              <span className="ml-2 text-green-600 font-medium">✓ Successfully uploaded!</span>
            )}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 p-4">
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 justify-between items-center">
            {/* Print Note: For best results, disable browser print headers/footers */}
            <div className="w-full mb-2 text-xs text-gray-500 text-center">
              For best results, <b>disable browser print headers/footers</b> in the print dialog.
            </div>
            <div className="flex gap-2">
              {isStructuredCV && (
                <>
                  <Button
                    onClick={handlePrint}
                    variant="outline"
                    size="sm"
                  >
                    <Printer className="h-4 w-4 mr-2" />
                    Print
                  </Button>
                  <Button
                    onClick={handleDownload}
                    variant="outline"
                    size="sm"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </>
              )}
              {hasFileUrl && !isStructuredCV && (
                <Button
                  onClick={handleDownload}
                  variant="outline"
                  size="sm"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              )}
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={handleEditCV}
                variant="outline"
                size="sm"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit CV
              </Button>
              <Button
                onClick={handleAnalyzeNow}
                disabled={analyzing}
                size="sm"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                {analyzing ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Brain className="h-4 w-4 mr-2" />
                )}
                {analyzing ? 'Analyzing...' : 'Analyze'}
              </Button>
            </div>
          </div>

          {/* Preview Content */}
          <div className="bg-white rounded-lg shadow-sm border">
            {previewContent}
          </div>

          {/* New Upload Actions */}
          {isNewUpload && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-800 mb-3">What would you like to do next?</h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleAnalyzeNow}
                  disabled={analyzing}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                >
                  {analyzing ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : (
                    <Brain className="h-4 w-4 mr-2" />
                  )}
                  {analyzing ? 'Starting Analysis...' : 'Analyze Now'}
                </Button>
                <Button
                  onClick={handleEditCV}
                  variant="outline"
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit CV
                </Button>
                {onChooseTemplate && (
                  <Button
                    onClick={onChooseTemplate}
                    variant="outline"
                    className="flex-1"
                  >
                    Choose Template
                  </Button>
                )}
                <Button
                  onClick={handleBackToCVs}
                  variant="secondary"
                  className="flex-1"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to My CVs
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CVPreviewModal; 