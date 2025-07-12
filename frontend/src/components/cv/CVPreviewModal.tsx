import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CVData } from '@/lib/supabase';
import { FileText, Download, ExternalLink, Brain, Edit, ArrowLeft } from 'lucide-react';
import { cvOperations } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';

interface CVPreviewModalProps {
  open: boolean;
  onClose: () => void;
  cv: CVData | undefined;
  onSaved?: () => void;
  onAnalyze?: (cvId: string) => void;
  isNewUpload?: boolean; // Indicates if this is a newly uploaded CV
  onApplyToJob?: () => void; // Optional: handler for Apply to Job
  onChooseTemplate?: () => void; // Optional: handler for Choose Template
}

const CVPreviewModal: React.FC<CVPreviewModalProps> = ({ 
  open, 
  onClose, 
  cv, 
  onSaved, 
  onAnalyze,
  isNewUpload = false,
  onApplyToJob,
  onChooseTemplate
}) => {
  const navigate = useNavigate();
  const [fileContent, setFileContent] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(cv?.full_name || '');
  const [saving, setSaving] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  // Debug logging
  console.log('CVPreviewModal render - open:', open, 'cv:', cv, 'isNewUpload:', isNewUpload);

  useEffect(() => {
    console.log('CVPreviewModal useEffect - cv:', cv, 'open:', open);
    if (cv && open) {
      setLoading(true);
      setPdfError(null);
      setEditName(cv.full_name || '');
      
      // Check if we have a file URL for preview
      if (cv.file_url && cv.file_name) {
        console.log('File URL found, attempting to preview:', cv.file_url);
        
        // For now, we'll show a simpler preview approach
        // PDF.js has worker issues in this environment, so we'll use iframe fallback
        if (cv.file_name.toLowerCase().endsWith('.pdf')) {
          console.log('PDF file detected, using iframe preview');
          setLoading(false);
        } else {
          // For non-PDF files, show download option
          setFileContent('File available for download');
          setLoading(false);
        }
      } else {
        // No file URL - show structured data or summary
        console.log('No file URL found, showing summary content');
        setFileContent(cv.summary || 'No content available');
        setLoading(false);
      }
    }
  }, [cv, open]);

  // Don't render if no CV or not open
  if (!cv || !open) {
    console.log('CVPreviewModal not rendering - cv:', cv, 'open:', open);
    return null;
  }

  console.log('CVPreviewModal rendering with cv:', cv.full_name, 'file_url:', cv.file_url);

  // Check if this is a file-based CV (has file_url)
  const hasFileUrl = !!(cv.file_url && cv.file_url.trim().length > 0);
  const isPDF = cv.file_name && cv.file_name.toLowerCase().endsWith('.pdf');
  const hasContent = !!(cv.summary && cv.summary.trim().length > 0);

  // Helper to get file extension
  const getFileExtension = (filename?: string) => {
    if (!filename) return '';
    return filename.split('.').pop()?.toLowerCase() || '';
  };

  // Handle Analyze Now button click
  const handleAnalyzeNow = async () => {
    if (!onAnalyze) {
      // If no onAnalyze callback, navigate to analysis page
      navigate(`/cvs?analyze=${cv.id}`);
      onClose();
      return;
    }
    
    setAnalyzing(true);
    try {
      await onAnalyze(cv.id);
      // Analysis started - DON'T close modal, let parent handle the flow
      // The parent will show the analysis modal while keeping this preview open
    } catch (error) {
      console.error('Analysis failed:', error);
      // Keep modal open if analysis fails
    } finally {
      setAnalyzing(false);
    }
  };

  // Handle Edit CV button click
  const handleEditCV = () => {
    navigate(`/cv-builder/${cv.id}`);
    onClose();
  };

  // Handle Back to My CVs button click
  const handleBackToCVs = () => {
    navigate('/cvs');
    onClose();
  };

  // Render preview content
  let previewContent = null;
  if (cv && cv.file_url) {
    const ext = getFileExtension(cv.file_name);
    if (ext === 'pdf') {
      // PDF preview via iframe
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
      // Word doc preview via Office Online Viewer
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
      // Fallback for unsupported file types
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
      <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-y-auto bg-blue-50 rounded-xl shadow-xl">
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
              <button onClick={handleEdit} className="ml-2 px-2 py-1 bg-gray-200 rounded">Rename</button>
            )}
          </DialogTitle>
          <DialogDescription>
            {hasFileUrl 
              ? `Previewing uploaded file: ${cv.file_name || 'Unknown file'}`
              : 'Viewing structured CV data'
            }
            {isNewUpload && (
              <span className="ml-2 text-green-600 font-medium">✓ Successfully uploaded!</span>
            )}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 p-2">
          {previewContent}
          
          {/* Action Buttons - PRD Section 6.1: "Quick Win: Immediate value in chosen module" */}
          {isNewUpload && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-800 mb-3">What would you like to do next?</h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleAnalyzeNow}
                  disabled={analyzing}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white min-h-[44px]"
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
                  className="flex-1 min-h-[44px]"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit CV
                </Button>
                {onChooseTemplate && (
                  <Button
                    onClick={onChooseTemplate}
                    variant="outline"
                    className="flex-1 min-h-[44px]"
                  >
                    Choose Template
                  </Button>
                )}
                <Button
                  onClick={handleBackToCVs}
                  variant="secondary"
                  className="flex-1 min-h-[44px]"
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