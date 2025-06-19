import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CVData } from '@/lib/supabase';
import { FileText, Download, ExternalLink } from 'lucide-react';

interface CVPreviewModalProps {
  open: boolean;
  onClose: () => void;
  cv: CVData | undefined;
}

const CVPreviewModal: React.FC<CVPreviewModalProps> = ({ open, onClose, cv }) => {
  const [fileContent, setFileContent] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // Debug logging
  console.log('CVPreviewModal render - open:', open, 'cv:', cv);

  useEffect(() => {
    console.log('CVPreviewModal useEffect - cv:', cv, 'open:', open);
    if (cv && open) {
      setLoading(true);
      
      // If this is an uploaded file CV, try to get the content
      if (cv.file_url) {
        // Try to fetch file content from storage
        fetch(cv.file_url)
          .then(response => response.text())
          .then(content => {
            setFileContent(content);
            setLoading(false);
          })
          .catch(error => {
            console.log('Could not fetch file from storage:', error);
            // Fall back to summary if available
            setFileContent(cv.summary || 'File content not available');
            setLoading(false);
          });
      } else {
        // Use the summary/content from database
        setFileContent(cv.summary || 'No content available');
        setLoading(false);
      }
    }
  }, [cv, open]);

  // Don't render if no CV or not open
  if (!cv || !open) return null;

  // Check if this is a file-based CV (has file_url or file_name)
  const isFileCV = cv.file_url || cv.file_name;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
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
            // File-based CV display
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="h-6 w-6 text-blue-600" />
                  <div>
                    <h3 className="font-semibold">{cv.full_name}</h3>
                    <p className="text-sm text-gray-600">
                      {cv.file_name && `File: ${cv.file_name}`}
                      {cv.file_size && ` • ${(cv.file_size / 1024 / 1024).toFixed(2)} MB`}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {cv.file_url && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={cv.file_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Open File
                      </a>
                    </Button>
                  )}
                  <Button variant="outline" size="sm" onClick={() => {
                    if (cv.file_url) {
                      const link = document.createElement('a');
                      link.href = cv.file_url;
                      link.download = cv.file_name || 'cv';
                      link.click();
                    }
                  }}>
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </div>
              </div>
              
              {loading ? (
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-2">Loading file content...</span>
                </div>
              ) : fileContent ? (
                <div className="bg-white border rounded-lg p-6">
                  <h3 className="font-semibold mb-4">File Content:</h3>
                  <pre className="whitespace-pre-wrap text-sm text-gray-700 bg-gray-50 p-4 rounded border overflow-auto max-h-96">
                    {fileContent}
                  </pre>
                </div>
              ) : (
                <div className="text-center p-8 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No file content available for preview.</p>
                  <p className="text-sm mt-2">
                    {cv.file_url ? 'The file may not be accessible or may be in a format that cannot be displayed.' : 'This CV was saved without file content.'}
                  </p>
                </div>
              )}
            </div>
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