import React, { useState } from 'react';
import { TemplateSelectionStep } from '@/components/cv-builder/TemplateSelectionStep';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

export default function TemplateSelectionDemo() {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [showDemo, setShowDemo] = useState(false);

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    console.log('Selected template:', templateId);
  };

  const handleBack = () => {
    setShowDemo(false);
    setSelectedTemplate('');
  };

  if (!showDemo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="p-8">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Template Selection Step - Visual Mockup
              </CardTitle>
              <p className="text-slate-600 mt-4">
                This is a visual mockup of the "Choose a CV Template" step that will be integrated into the CV Builder flow.
              </p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-800">Design Features</h3>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li>• Clean, professional card-based layout</li>
                    <li>• Tier-based template organization (Free, Starter, Pro, Elite)</li>
                    <li>• Visual preview placeholders for each template</li>
                    <li>• ATS-friendly indicators and color scheme info</li>
                    <li>• Smooth hover animations and selection states</li>
                    <li>• Responsive design for all screen sizes</li>
                    <li>• Accessibility-compliant with keyboard navigation</li>
                  </ul>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-800">User Experience</h3>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li>• Clear visual hierarchy and information architecture</li>
                    <li>• Intuitive selection process with immediate feedback</li>
                    <li>• Disabled continue button until template is selected</li>
                    <li>• Helpful pro tips and guidance text</li>
                    <li>• Smooth transitions between states</li>
                    <li>• Mobile-optimized touch interactions</li>
                  </ul>
                </div>
              </div>
              
              <div className="pt-6 border-t border-slate-200">
                <Button 
                  onClick={() => setShowDemo(true)}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-lg py-3"
                >
                  View Interactive Mockup
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div>
      <TemplateSelectionStep
        onTemplateSelect={handleTemplateSelect}
        onBack={handleBack}
        selectedTemplate={selectedTemplate}
      />
    </div>
  );
} 