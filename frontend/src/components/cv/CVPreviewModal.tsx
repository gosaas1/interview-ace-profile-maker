import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CVData as DBCVData } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { cvTemplates } from '@/data/cvTemplates';
import CVPreview from './CVPreview';
import { normalizeCVData } from '@/lib/cv/normalize';
import { printCV } from '@/lib/cv/print';

import { Printer, Download } from 'lucide-react';

interface CVPreviewModalProps {
  open: boolean;
  onClose: () => void;
  cv: DBCVData | undefined;
  userTier?: string;
  onSaved?: () => void;
  onAnalyze?: (cvId: string) => void;
  isNewUpload?: boolean;
}

const CVPreviewModal: React.FC<CVPreviewModalProps> = ({ open, onClose, cv, userTier = 'free' }) => {
  const navigate = useNavigate();
  const [editName, setEditName] = useState(cv?.full_name || '');

  useEffect(() => {
    if (cv && open) {
      setEditName(cv.full_name || '');
    }
  }, [cv, open]);

  if (!cv || !open) return null;

  const normalizedCV = normalizeCVData(cv);
  const isStructuredCV = !cv.file_url && (cv.content || cv.experiences || cv.education || cv.skills);
  const selectedTemplate = cv.template_id || 'modern-professional';

  const handlePrint = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent modal from closing
    if (!isStructuredCV) return;
    
    try {
      await printCV({
        cvData: normalizedCV,
        template: selectedTemplate,
        userTier,
        mode: 'print'
      });
    } catch (error) {
      console.error('Print error:', error);
    }
  };

  const handleDownload = async () => {
    if (!isStructuredCV) return;
    
    try {
      await printCV({
        cvData: normalizedCV,
        template: selectedTemplate,
        userTier,
        mode: 'download'
      });
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl w-full max-h-[90vh] overflow-y-auto bg-gray-50 rounded-xl shadow-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            CV Preview: {cv?.full_name || 'Untitled CV'}
          </DialogTitle>
          <DialogDescription>
            {`Template: ${cvTemplates.find(t => t.id === selectedTemplate)?.name || 'Modern Professional'}`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 p-4">
          <div className="flex gap-2">
            <Button onClick={handleDownload} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button onClick={handlePrint} variant="outline" size="sm">
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
          </div>

          <div className="bg-white rounded-lg shadow-sm border print-area">
            {isStructuredCV ? (
              <CVPreview
                cvData={normalizedCV}
                template={selectedTemplate}
              />
            ) : (
              <div className="p-4 text-center text-gray-500">
                File preview not supported.
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CVPreviewModal; 