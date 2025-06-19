import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CVData } from '@/lib/supabase';

interface CVPreviewModalProps {
  open: boolean;
  onClose: () => void;
  cv: CVData | undefined;
}

const CVPreviewModal: React.FC<CVPreviewModalProps> = ({ open, onClose, cv }) => {
  if (!cv) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>CV Preview: {cv.full_name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 p-2">
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
          <div className="flex justify-end pt-2">
            <Button variant="outline" onClick={onClose}>Close</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CVPreviewModal; 