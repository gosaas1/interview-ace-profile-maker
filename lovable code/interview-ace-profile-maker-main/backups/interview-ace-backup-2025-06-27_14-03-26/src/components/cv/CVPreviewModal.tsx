import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CVData } from '@/lib/supabase';
import { FileText, Download, ExternalLink } from 'lucide-react';
import { getDocument, GlobalWorkerOptions, version as pdfjsVersion } from 'pdfjs-dist';

// Use the installed version for the workerSrc
GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsVersion}/pdf.worker.min.js`;

interface CVPreviewModalProps {
  open: boolean;
  onClose: () => void;
  cv: CVData | undefined;
}

const CVPreviewModal: React.FC<CVPreviewModalProps> = ({ open, onClose, cv }) => {
  const [fileContent, setFileContent] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Debug logging
  console.log('CVPreviewModal render - open:', open, 'cv:', cv);

  useEffect(() => {
    console.log('CVPreviewModal useEffect - cv:', cv, 'open:', open);
    if (cv && open) {
      setLoading(true);
      setPdfError(null);
      // If PDF, try to render visually
      if (cv.file_url && cv.file_name && cv.file_name.endsWith('.pdf')) {
        const renderPDF = async () => {
          try {
            const loadingTask = getDocument(cv.file_url);
            const pdf = await loadingTask.promise;
            const page = await pdf.getPage(1);
            const viewport = page.getViewport({ scale: 1.5 });
            const canvas = canvasRef.current;
            if (canvas) {
              const context = canvas.getContext('2d');
              if (context) {
                canvas.height = viewport.height;
                canvas.width = viewport.width;
                await page.render({ canvasContext: context, viewport }).promise;
              }
            }
            setLoading(false);
          } catch (err) {
            setPdfError('Failed to render PDF. Showing extracted text instead.');
            setLoading(false);
          }
        };
        renderPDF();
      } else if (cv.content) {
        setFileContent(cv.content);
        setLoading(false);
      } else {
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

  console.log('CVPreviewModal rendering with cv:', cv.full_name);

  // Check if this is a file-based CV (has file_url or file_name)
  const isFileCV = cv.type === 'file' || cv.file_url || cv.file_name;
  const isPDF = cv.file_name && cv.file_name.endsWith('.pdf');
  const hasExtractedContent = !!(cv.content && cv.content.trim().length > 0);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-y-auto bg-blue-50 rounded-xl shadow-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            CV Preview: {cv.full_name}
            {isFileCV && (
              <span className="text-sm text-gray-500 font-normal">
                ({cv.file_name || 'Uploaded File'})
              </span>
            )}
          </DialogTitle>
          <DialogDescription>
            {isFileCV 
              ? `Previewing uploaded file: ${cv.file_name || 'Unknown file'}`
              : 'Viewing structured CV data'
            }
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 p-2">
          {isFileCV ? (
            isPDF && cv.file_url && !pdfError ? (
              <div className="flex flex-col items-center">
                <canvas ref={canvasRef} className="border rounded shadow max-w-full" style={{ background: '#fff' }} />
                <div className="text-xs text-gray-500 mt-2">First page of PDF shown. <a href={cv.file_url} target="_blank" rel="noopener noreferrer" className="underline">Open full PDF</a></div>
              </div>
            ) : hasExtractedContent ? (
              <div className="bg-white border rounded-lg p-6">
                <h3 className="font-semibold mb-4">File Content:</h3>
                <pre className="whitespace-pre-wrap text-sm text-gray-700 bg-gray-50 p-4 rounded border overflow-auto max-h-96">
                  {cv.content}
                </pre>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-10 bg-blue-50 rounded-xl shadow-inner">
                <FileText className="h-16 w-16 mb-6 text-blue-300" />
                <p className="text-lg font-semibold text-slate-700 mb-2">No file content available for preview.</p>
                <p className="text-base text-slate-500 mb-4">
                  {cv.file_url ? 'The file may not be accessible or may be in a format that cannot be displayed.' : 'This CV was saved without file content.'}
                </p>
                {cv.file_url && (
                  <a
                    href={cv.file_url}
                    download={cv.file_name}
                    className="inline-block bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-6 py-2 rounded-lg shadow transition"
                  >
                    Download File
                  </a>
                )}
              </div>
            )
          ) : (
            // Structured CV display
            <>
              <section>
                <h2 className="text-xl font-bold mb-1">Personal Information</h2>
                <div className="text-gray-700">
                  <div><strong>Name:</strong> {cv.full_name}</div>
                  <div><strong>Email:</strong> {cv.email}</div>
                  <div><strong>Phone:</strong> {cv.phone}</div>
                  <div><strong>Location:</strong> {cv.location}</div>
                </div>
              </section>
              <section>
                <h2 className="text-xl font-bold mb-1">Professional Summary</h2>
                <div className="text-gray-700 whitespace-pre-line">{cv.summary}</div>
              </section>
              <section>
                <h2 className="text-xl font-bold mb-1">Work Experience</h2>
                <div className="space-y-2">
                  {cv.experiences && cv.experiences.length > 0 ? (
                    cv.experiences.map((exp, idx) => (
                      <div key={idx} className="border rounded p-2">
                        <div><strong>Company:</strong> {exp.company}</div>
                        <div><strong>Role:</strong> {exp.role}</div>
                        <div><strong>Duration:</strong> {exp.duration}</div>
                        <div><strong>Description:</strong> <span className="whitespace-pre-line">{exp.description}</span></div>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-500">No experience listed.</div>
                  )}
                </div>
              </section>
              <section>
                <h2 className="text-xl font-bold mb-1">Education</h2>
                <div className="space-y-2">
                  {cv.education && cv.education.length > 0 ? (
                    cv.education.map((edu, idx) => (
                      <div key={idx} className="border rounded p-2">
                        <div><strong>Institution:</strong> {edu.institution}</div>
                        <div><strong>Degree:</strong> {edu.degree}</div>
                        <div><strong>Year:</strong> {edu.year}</div>
                        <div><strong>GPA:</strong> {edu.gpa}</div>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-500">No education listed.</div>
                  )}
                </div>
              </section>
              <section>
                <h2 className="text-xl font-bold mb-1">Skills</h2>
                <div className="text-gray-700 whitespace-pre-line">{cv.skills}</div>
              </section>
              <section>
                <h2 className="text-xl font-bold mb-1">Certifications</h2>
                <div className="text-gray-700 whitespace-pre-line">{cv.certifications}</div>
              </section>
            </>
          )}
          
          <div className="flex justify-end pt-2">
            <Button variant="outline" onClick={onClose}>Close</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CVPreviewModal; 